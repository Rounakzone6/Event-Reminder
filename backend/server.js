import express from "express";
import "dotenv/config";
import cors from "cors";
import cron from "node-cron";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import eventRouter from "./routes/eventRouter.js";
import { checkAndSendMessages } from "./controllers/sendReminder.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.get("/", (req, res) => {
  res.send("API is working");
});

// Daily Message Trigger Route
app.get("/api/send-daily-messages", async (req, res) => {
  try {
    await checkAndSendMessages();
    res.status(200).json({ success: true, message: "Daily messages sent!" });
  } catch (error) {
    console.error("Error sending messages:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to send messages" });
  }
});

cron.schedule("0 5 * * *", async () => {
  console.log("Running daily WhatsApp message job at 5:00 AM");
  await checkAndSendMessages();
});

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
