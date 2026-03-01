import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import setupSwagger from "./config/swagger.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/dashboard", (req, res) => {
  res.json({ message: "Welcome to dashboard" });
});

// Swagger
setupSwagger(app);

// Error handler
app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Socket.io Setup
|--------------------------------------------------------------------------
*/

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // adjust in production if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible inside controllers
app.set("io", io);

/*
|--------------------------------------------------------------------------
| Start Server (Skip during tests)
|--------------------------------------------------------------------------
*/

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Supertest
export default app;