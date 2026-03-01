import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getSummary
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post("/", createTask); // Create task
router.get("/", getTasks);    // Get tasks with filtering & sorting
router.put("/:id", updateTask); // Update task
router.delete("/:id", deleteTask); // Delete task
router.get("/summary", getSummary); // Dashboard summary

export default router;