import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");
  const [events, setEvents] = useState([]);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.name) setUserName(decoded.name);
      } catch (error) {
        console.error("Invalid token:", error.message);
      }
    }
  }, [token]);

  // Sort the events based on their date -> upcoming date
  const sortEventsByUpcomingDate = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .map((event) => {
        const original = new Date(event.date);
        if (isNaN(original)) return null;

        const currentYear = today.getFullYear();
        let upcomingDate = new Date(
          currentYear,
          original.getMonth(),
          original.getDate()
        );

        if (upcomingDate < today) {
          upcomingDate.setFullYear(currentYear + 1);
        }

        return { ...event, _sortDate: upcomingDate };
      })
      .filter(Boolean)
      .sort((a, b) => a._sortDate - b._sortDate)
      .map(({ _sortDate, ...rest }) => rest);
  };

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendUrl}/api/event/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const sortedEvents = sortEventsByUpcomingDate(res.data.events);
        setEvents(sortedEvents);
      } else {
        toast.error("Failed to load events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error(error.response?.data?.message || "Network error");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`${backendUrl}/api/event/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prevEvents) =>
        sortEventsByUpcomingDate(prevEvents.filter((e) => e._id !== eventId))
      );

      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleEdit = (event) => {
    navigate("/new-event", { state: { eventData: event } });
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  const value = {
    token,
    setToken,
    backendUrl,
    userName,
    fetchEvents,
    events,
    handleDelete,
    handleEdit,
    setEvents,
    logout,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
