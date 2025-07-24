import { useState, useContext, useEffect } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const navigate =useNavigate();

  const { token, setToken, backendUrl } = useContext(Context);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Login") {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          phone,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="border md:w-[40%] bg-gray-50 mx-auto shadow-2xl border-gray-300 rounded-2xl p-4">
      <p className="text-2xl font-medium text-center my-4">
        Welcome to Humanastic
      </p>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-3">
        {currentState === "Login" ? (
          ""
        ) : (
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="name">
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="py-2 px-4 rounded bg-gray-200"
              type="text"
              name="name"
              id="name"
              placeholder="Enter your Name"
              required
            />
          </div>
        )}
        {currentState === "Login" ? (
          ""
        ) : (
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="phone">
              Phone
            </label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              className="py-2 px-4 rounded bg-gray-200"
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter your Phone Number"
              required
            />
          </div>
        )}
        <div className="flex flex-col">
          <label className="font-medium" htmlFor="email">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="py-2 px-4 rounded bg-gray-200"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium" htmlFor="password">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="py-2 px-4 rounded bg-gray-200"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your Password"
            required
          />
        </div>
        <div className="mb-4 mt-2">
          <button className="py-2 rounded-full bg-green-800 text-gray-100 w-full font-medium">
            {currentState === "Login" ? "Login" : "Sign Up"}
          </button>
          <div className="flex justify-between mt-2">
            {currentState === "Login" ? (
              <p className="cursor-pointer text-blue-700 hover:text-blue-500 hover:underline">
                Forgot Password
              </p>
            ) : (
              <p></p>
            )}
            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer hover:underline"
              >
                Create an Account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer hover:underline"
              >
                Login Here
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
