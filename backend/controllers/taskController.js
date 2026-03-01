import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      status,
      userId: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks of logged-in user with filtering and sorting
export const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let query = Task.find(filter);

    if (sortBy === "dueDate") query = query.sort({ dueDate: 1 });
    else query = query.sort({ createdAt: -1 });

    const tasks = await query;
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard summary
export const getSummary = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const total = tasks.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === "Done") return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
       return due < today;
      }).length;
    const groupedByStatus = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    res.json({ total, overdue, groupedByStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};