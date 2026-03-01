import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import DeleteConfirmModal from "../../modals/DeleteModal"
import "./Dashboard.css"; 

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    sortBy: "",
  });
  const [summary, setSummary] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    const query = new URLSearchParams(filter).toString();
    const res = await axios.get(
      `http://localhost:5000/api/tasks?${query}`,
      { headers }
    );
    setTasks(res.data);
  };

  const fetchSummary = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/tasks/summary",
      { headers }
    );
    setSummary(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchSummary();
  }, [filter]);

  const handleDelete = async () => {
    if (!taskToDelete) return;
    await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete}`,{ headers });
    setDeleteModalOpen(false);
    setTaskToDelete(null);
    fetchTasks();
    fetchSummary();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <h2 style={{ color: "white" }}>Dashboard</h2>
        <div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Summary Section */}
        <div className="summary">
          <div>Total Tasks: {summary.total || 0}</div>
          <div>Overdue: {summary.overdue || 0}</div>
          {summary.groupedByStatus &&
            Object.entries(summary.groupedByStatus).map(
              ([status, count]) => (
                <div key={status}>
                  {status}: {count}
                </div>
              )
            )}
            <button className="add-btn" onClick={() => setModalOpen(true)}>
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={filter.priority}
            onChange={(e) =>
              setFilter({ ...filter, priority: e.target.value })
            }
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={filter.sortBy}
            onChange={(e) =>
              setFilter({ ...filter, sortBy: e.target.value })
            }
          >
            <option value="">Sort By</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>

        {/* Task Table */}
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
                  <td>
                    <span
                      className={`badge ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.status}</td>
                  <td>
                    {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "-"}
                  </td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <AiOutlineEdit
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      title="Edit"
                      onClick={() => {
                        setEditingTask(task);
                        setModalOpen(true);
                      }}
                    />
                    <AiOutlineDelete
                      style={{ cursor: "pointer", color: "#ef4444" }}
                      title="Delete"
                      onClick={() => {setTaskToDelete(task._id);
                        setDeleteModalOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        © 2026 Task Manager. All rights reserved.
      </footer>

      {/* Modal */}
      {modalOpen && (
        <TaskForm
          fetchTasks={fetchTasks}
          fetchSummary={fetchSummary}
          closeModal={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
        />
      )}
      <DeleteConfirmModal
      isOpen={deleteModalOpen}
      onClose={() => {
        setDeleteModalOpen(false);
        setTaskToDelete(null);
      }}
      onConfirm={handleDelete}
      />
    </div>
  );
}