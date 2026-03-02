import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Task from "./models/Task.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: "demo@example.com" });

    if (existingUser) {
      console.log(" Demo user already exists. Skipping seed.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create demo user
    const user = await User.create({
      email: "demo@example.com",
      password: hashedPassword,
    });

    // Create sample tasks (IMPORTANT: using userId, not user)
    await Task.insertMany([
      {
        title: "Setup project",
        description: "Initialize repository and install dependencies",
        priority: "High",
        status: "Done",
        dueDate: new Date(),
        userId: user._id,
      },
      {
        title: "Build Dashboard",
        description: "Create Kanban board layout",
        priority: "Medium",
        status: "In Progress",
        dueDate: new Date(),
        userId: user._id,
      },
      {
        title: "Write Documentation",
        description: "Complete README and API docs",
        priority: "Low",
        status: "To Do",
        dueDate: new Date(),
        userId: user._id,
      },
    ]);

    console.log(" Database seeded successfully!");
    console.log("Demo Login:");
    console.log("Email: demo@example.com");
    console.log("Password: password123");

    process.exit(0);
  } catch (error) {
    console.error(" Seeding error:", error);
    process.exit(1);
  }
};

seedData();