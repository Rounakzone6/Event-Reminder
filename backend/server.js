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
  console.log("📡 Root endpoint accessed");
  res.json({ 
    message: "Event Reminder API is working!",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Daily Message Trigger Route
app.get("/api/send-daily-messages", async (req, res) => {
  try {
    await checkAndSendMessages();
    console.log("Daily messages sent successfully");
    res.status(200).json({ success: true, message: "Daily messages sent!" });
  } catch (error) {
    console.error("Error sending messages:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to send messages" });
  }
});

// Schedule cron job
console.log("⏰ Setting up cron job for daily messages at 5:00 AM");
cron.schedule("0 5 * * *", async () => {
  console.log("⏰ Running daily WhatsApp message job at 5:00 AM");
  await checkAndSendMessages();
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Express error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// CRITICAL: Listen on 0.0.0.0 for Railway, not localhost
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on PORT: ${port}`);
  console.log(`🌐 Server URL: https://event-reminder-production-2481.up.railway.app`);
  console.log("✅ Server is ready to accept connections");
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});