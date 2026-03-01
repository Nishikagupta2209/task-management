import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineBulb } from "react-icons/ai";
import DeleteConfirmModal from "../../modals/DeleteModal";
import KanbanBoard from "./KanbanBoard";
import "./Dashboard.css"; 

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: "", priority: "", sortBy: "" });
  const [summary, setSummary] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "kanban"

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    const query = new URLSearchParams(filter).toString();
    const res = await axios.get(`http://localhost:5000/api/tasks?${query}`, { headers });
    setTasks(res.data);
    fetchSummary(res.data); // update summary whenever tasks change
  };

  const fetchSummary = (tasksData) => {
    const data = tasksData || tasks;
    const total = data.length;
    // Only count overdue tasks that are not done
  const overdue = data.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done").length;
    const groupedByStatus = {
      "To Do": data.filter(t => t.status === "To Do").length,
      "In Progress": data.filter(t => t.status === "In Progress").length,
      "Done": data.filter(t => t.status === "Done").length,
    };
    setSummary({ total, overdue, groupedByStatus });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setDarkMode(savedTheme === "dark");
    fetchTasks();
  }, [filter]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleDelete = async () => {
    if (!taskToDelete) return;
    await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete}`, { headers });
    setDeleteModalOpen(false);
    setTaskToDelete(null);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={`dashboard-wrapper ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="header-buttons">
          <button 
            className="theme-toggle-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <AiOutlineBulb />
          </button>
          <button 
            className="view-toggle-btn" 
            onClick={() => setViewMode(viewMode === "table" ? "kanban" : "table")}
            title={viewMode === "table" ? "Switch to Kanban View" : "Switch to Table View"}
          >
            {viewMode === "table" ? "Kanban View" : "Table View"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: darkMode ? "#000000" : "inherit" }}>
        {/* Summary Section */}
        <div className="summary">
          <div>Total Tasks: {summary.total || 0}</div>
          <div>Overdue: {summary.overdue || 0}</div>
          {summary.groupedByStatus &&
            Object.entries(summary.groupedByStatus).map(([status, count]) => (
              <div key={status}>{status}: {count}</div>
            ))}
          <button className="add-btn" onClick={() => setModalOpen(true)}>Add Task</button>
        </div>

        {/* Filters */}
        <div className="filters">
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select value={filter.sortBy} onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}>
            <option value="">Sort By</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>

        {/* Conditional Rendering: Table or Kanban */}
        {viewMode === "table" ? (
          <div className="table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Creation Date</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td><span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                    <td>{task.status}</td>
                    <td>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}</td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                    <td>
                      <AiOutlineEdit style={{ cursor: "pointer", marginRight: "10px" }} title="Edit"
                        onClick={() => { setEditingTask(task); setModalOpen(true); }}
                      />
                      <AiOutlineDelete style={{ cursor: "pointer", color: "#ef4444" }} title="Delete"
                        onClick={() => { setTaskToDelete(task._id); setDeleteModalOpen(true); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <KanbanBoard tasks={tasks} fetchTasks={fetchTasks} fetchSummary={fetchSummary} darkMode={darkMode} />
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        © 2026 Task Manager. All rights reserved.
      </footer>

      {/* Modals */}
      {modalOpen && (
        <TaskForm
        fetchTasks={fetchTasks}
        fetchSummary={fetchSummary}
        closeModal={() => { setModalOpen(false); setEditingTask(null); }}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        darkMode={darkMode}
        />
        )}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setTaskToDelete(null); }}
        onConfirm={handleDelete}
      />
    </div>
  );
}