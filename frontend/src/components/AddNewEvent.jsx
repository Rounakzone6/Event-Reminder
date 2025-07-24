import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AddNewEvent = () => {
  const { token, backendUrl, fetchEvents } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.eventData;

  const [isFestival, setIsFestival] = useState(false);
  const [isOtherFestival, setIsOtherFestival] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    event: "Birthday",
    festival: "",
    customFestival: "",
    date: "",
    relation: "Friend",
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        name: eventData.name || "",
        phone: eventData.phone || "",
        event: eventData.event || "Birthday",
        festival: eventData.festival || "",
        customFestival: eventData.customFestival || "",
        date: eventData.date || "",
        relation: eventData.relation || "Friend",
      });
      setIsFestival(eventData.event === "Festival");
      setIsOtherFestival(eventData.festival === "Other");
    }
  }, [eventData]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (isFestival && isOtherFestival && !formData.customFestival.trim()) {
      toast.error("Please enter a custom festival name");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const finalEvent =
      formData.event === "Festival"
        ? isOtherFestival
          ? formData.customFestival.trim()
          : formData.festival
        : formData.event;

    try {
      if (eventData) {
        // Update Existing Event
        await axios.post(
          `${backendUrl}/api/event/edit`,
          {
            userId,
            eventId: eventData._id,
            name: formData.name,
            phone: formData.phone,
            event: finalEvent,
            date: formData.date,
            relation: formData.relation,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Event updated successfully");
      } else {
        // Add New Event
        await axios.post(
          `${backendUrl}/api/event/add`,
          {
            userId,
            name: formData.name,
            phone: formData.phone,
            event: finalEvent,
            date: formData.date,
            relation: formData.relation,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Event added successfully");
      }

      await fetchEvents();
      navigate("/events");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-gray-100 mx-auto rounded-2xl md:max-w-[80%] p-4 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-2 text-stone-800">
        {eventData ? "Edit Event" : "Add New Event"}
      </h2>
      <p className="italic text-center text-stone-600 mb-6">
        "The best way to remember special days is by making them unforgettable
        for others."
        <br />
        <span className="text-sm text-gray-500">— Unknown</span>
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-2xl p-6 md:max-w-xl mx-auto shadow-md flex flex-col gap-3"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="name">
            👤 Name
          </label>
          <input
            className="py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your Name"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="phone">
            ☎ Phone
          </label>
          <input
            className="py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
            type="text"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Enter your Name"
            required
          />
        </div>

        {/* Event Type */}
        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="event">
            🗓️ Event Type
          </label>
          <select
            name="event"
            id="event"
            className="py-2 px-4 rounded-lg bg-gray-100 border border-gray-300"
            value={formData.event}
            onChange={(e) => {
              const selected = e.target.value;
              setFormData({ ...formData, event: selected });
              setIsFestival(selected === "festival");
            }}
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Festival">Festival</option>
          </select>
        </div>

        {/* Festival Type */}
        {isFestival && (
          <div className="flex flex-col">
            <label className="font-medium mb-1" htmlFor="festival">
              🎊 Festival Type
            </label>
            <select
              name="festival"
              id="festival"
              className="py-2 px-4 rounded-lg bg-gray-100 border border-gray-300"
              value={formData.festival}
              onChange={(e) => {
                const selected = e.target.value;
                setFormData({ ...formData, festival: selected });
                setIsOtherFestival(selected === "Other");
              }}
            >
              <option value="Holi">Holi</option>
              <option value="Dessehra">Dessehra</option>
              <option value="Diwali">Diwali</option>
              <option value="Chhath Puja">Chhath Puja</option>
              <option value="Other">Other</option>
            </select>

            {isOtherFestival && (
              <input
                type="text"
                placeholder="Enter Festival Name"
                className="mt-2 py-2 px-4 rounded-lg bg-gray-100 border border-gray-300"
                name="customFestival"
                value={formData.customFestival}
                onChange={(e) =>
                  setFormData({ ...formData, customFestival: e.target.value })
                }
              />
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="birthday">
            📅 Date
          </label>
          <input
            className="py-2 px-4 rounded-lg bg-gray-100 border border-gray-300"
            type="date"
            name="birthday"
            id="birthday"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Relation */}
        <div className="flex flex-col">
          <label className="font-medium mb-1" htmlFor="relation">
            👥 Relation
          </label>
          <select
            name="relation"
            id="relation"
            className="py-2 px-4 rounded-lg bg-gray-100 border border-gray-300"
            value={formData.relation}
            onChange={(e) =>
              setFormData({ ...formData, relation: e.target.value })
            }
          >
            <option value="Friend">Friend</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Boss">Boss</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="mt-4">
          <button className="w-full py-2 rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition-all">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEvent;
