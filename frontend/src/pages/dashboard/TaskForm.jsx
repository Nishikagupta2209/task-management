import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TaskForm({ fetchTasks, fetchSummary, closeModal, editingTask, setEditingTask, darkMode }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "To Do",
    dueDate: ""
  });
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : ""
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    else if (!editingTask) {
      const selectedDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.dueDate = "Due date cannot be in the past";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (editingTask) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, form, { headers });
        setEditingTask(null);
      } else {
        await axios.post("http://localhost:5000/api/tasks", form, { headers });
      }

      setForm({
        title: "",
        description: "",
        priority: "Low",
        status: "To Do",
        dueDate: ""
      });

      fetchTasks();
      fetchSummary();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div className={`task-modal-overlay ${darkMode ? "dark" : ""}`}>
      <div className="task-modal-content">
        <h3>{editingTask ? "Edit Task" : "Create Task"}</h3>
        <form className="task-form" onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          {errors.title && <span className="error">{errors.title}</span>}

          <textarea className="desc" name="description" placeholder="Description" value={form.description} onChange={handleChange} />

          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} {...(!editingTask && { min: todayString })} />
          {errors.dueDate && <span className="error">{errors.dueDate}</span>}

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px", width: "100%" }}>
            <button type="button" className="task-btn" style={{ backgroundColor: "#ef4444" }} onClick={closeModal}>Cancel</button>
            <button type="submit" className="task-btn">{editingTask ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}