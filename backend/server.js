console.log("server.js started loading...");
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

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.get("/", (req, res) => {
  console.log("Root endpoint accessed");
  res.json({
    message: "Event Reminder API is working!",
    status: "active",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/send-daily-messages", async (req, res) => {
  try {
    await checkAndSendMessages();
    console.log("Daily messages sent successfully");
    res.status(200).json({ success: true, message: "Daily messages sent!" });
  } catch (error) {
    console.error("Error sending messages:", error.message);
    res.status(500).json({ success: false, message: "Failed to send messages" });
  }
});

async function startServer() {
  try {
    await connectDB();
    console.log("MongoDB connected");
    try {
      console.log("Setting up cron job...");
      cron.schedule("00 5 * * *", async () => {
        console.log("Cron job triggered");
        await checkAndSendMessages();
      });
    } catch (cronError) {
      console.error("Cron setup failed:", cronError.message);
    }

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error("App failed to start:", err.message);
    process.exit(1);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Unhandled crash prevention
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

startServer();
