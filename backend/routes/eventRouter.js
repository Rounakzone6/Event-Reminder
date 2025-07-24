import express from "express";
import {
  addEvent,
  deleteEvent,
  editEvent,
  listEvents,
} from "../controllers/eventController.js";
import authUser from "../middleware/auth.js";

const eventRouter = express.Router();

eventRouter.post("/add", authUser, addEvent);
eventRouter.get("/list", authUser, listEvents);
eventRouter.post("/edit", authUser, editEvent);
eventRouter.delete("/delete/:id", authUser, deleteEvent);

export default eventRouter;
