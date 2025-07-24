import Card from "../components/Card";
import { useContext } from "react";
import { Context } from "../context/Context";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { token, userName, events, handleDelete, handleEdit } =
    useContext(Context);

  return (
    <div className="bg-gray-100 rounded-2xl px-5 py-6 md:max-w-[80%] mx-auto">
      <div>
        <p className="font-medium text-2xl">
          Welcome <span className="text-violet-600">{userName}!</span>
        </p>
        <p className="text-xl">
          🎉 Celebrate Every Special Moment, Effortlessly!
        </p>
        <p className="my-2">
          Never miss a birthday, anniversary, or festival again! Our intelligent
          reminder platform helps you stay connected with your loved ones by
          sending personalized messages for all important occasions — directly
          through WhatsApp. Set reminders, get AI-generated messages, and make
          every celebration extra special — all in one place.
        </p>
      </div>
      {!token && (
        <p
          className="text-xl py-2 font-medium"
          onClick={() => navigate("/login")}
        >
          👉{" "}
          <span className="cursor-pointer hover:underline">
            Sign up now and let the celebrations begin!
          </span>
        </p>
      )}
      {token && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl py-2 font-medium">Upcoming Events —</p>
          <hr className="border w-full mb-4 text-gray-200" />

          <div className="flex flex-wrap gap-4">
            {events.length == 0 && (
              <Link to="new-event" className="font-medium text-xl">
                Add Events
              </Link>
            )}
            {events.slice(0, 6).map((event, index) => (
              <Card
                key={index}
                name={event.name}
                phone={event.phone}
                event={event.event}
                date={event.date}
                relation={event.relation}
                onEdit={() => handleEdit(event)}
                onDelete={() => handleDelete(event._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
