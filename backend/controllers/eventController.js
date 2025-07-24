import userModal from "../models/userModel.js";

// function to add new event
const addEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, event, date, relation } = req.body;

    const newEvent = { name, phone, event, date, relation };

    const userData = await userModal.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    userData.events.push(newEvent);
    await userData.save();

    res.json({ success: true, message: "Event Added", data: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function to list events
const listEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModal.findById(userId).select("events");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, events: user.events });
  } catch (error) {
    console.error("Error in listEvents:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// function to edit event
const editEvent = async (req, res) => {
  try {
    const { userId, eventId, name, phone, event, date, relation } = req.body;
    const user = await userModal.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const eventToEdit = user.events.id(eventId);
    if (!eventToEdit) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Update fields
    eventToEdit.name = name || eventToEdit.name;
    eventToEdit.phone = phone || eventToEdit.phone;
    eventToEdit.event = event || eventToEdit.event;
    eventToEdit.date = date || eventToEdit.date;
    eventToEdit.relation = relation || eventToEdit.relation;

    await user.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      data: eventToEdit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function to delete the event
const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const user = await userModal.findById(userId);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const eventExists = user.events.id(eventId);
    if (!eventExists) {
      console.log("Event not found in user's list");
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    user.events.pull(eventId);
    await user.save();
    return res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error.stack || error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { addEvent, editEvent, listEvents, deleteEvent };
