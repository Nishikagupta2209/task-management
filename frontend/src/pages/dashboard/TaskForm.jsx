import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ fetchTasks, fetchSummary, closeModal, editingTask, setEditingTask }) {
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

  // Populate form when editing a task
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (!editingTask) { 
      const selectedDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today)
        newErrors.dueDate = "Due date cannot be in the past";
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

  // Minimum date for due date input (today)
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginBottom: "20px" }}>{editingTask ? "Edit Task" : "Create Task"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.title && <span style={errorStyle}>{errors.title}</span>}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={textareaStyle}
          />

          {/* Priority */}
          <select name="priority" value={form.priority} onChange={handleChange} style={selectStyle}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* Status */}
          <select name="status" value={form.status} onChange={handleChange} style={selectStyle}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          {/* Due Date */}
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            min={todayString}
            style={inputStyle}
          />
          {errors.dueDate && <span style={errorStyle}>{errors.dueDate}</span>}

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={closeModal}
              style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}
            >
              {editingTask ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "12px",
  width: "400px",
  maxWidth: "90%"
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

const textareaStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  minHeight: "60px",
  resize: "vertical"
};

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  backgroundColor: "#fff"
};

const buttonStyle = {
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const errorStyle = {
  color: "#ef4444",
  fontSize: "0.875rem"
};