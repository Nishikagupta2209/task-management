import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

export default function KanbanBoard({ tasks, fetchTasks, darkMode }) {
  const [columns, setColumns] = useState({
    "To Do": [],
    "In Progress": [],
    "Done": [],
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const newColumns = { "To Do": [], "In Progress": [], "Done": [] };
    tasks.forEach(task => {
      if (newColumns[task.status]) newColumns[task.status].push(task);
    });
    setColumns(newColumns);
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = Array.from(columns[source.droppableId]);
    const destCol = Array.from(columns[destination.droppableId]);
    const [movedTask] = sourceCol.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTask);

    const newColumns = { ...columns, [source.droppableId]: sourceCol, [destination.droppableId]: destCol };
    setColumns(newColumns);

    try {
      await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, { status: movedTask.status }, { headers });
      const updatedTasks = await fetchTasks(); // make sure fetchTasks returns tasks
      fetchSummary(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", marginTop: "20px" }}>
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
                  padding: "10px",
                  borderRadius: "8px",
                  flex: 1,           // equal width
                  minHeight: "400px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ textAlign: "center", color: "#000" }}>{columnId}</h3> {/* header always black */}
                {columnTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          padding: "12px",
                          margin: "0 0 8px 0",
                          minHeight: "50px",
                          backgroundColor: darkMode ? "#334155" : "#fff",
                          color: darkMode ? "#fff" : "#333",
                          borderRadius: "6px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <strong>{task.title}</strong>
                        <p>{task.description}</p>
                        <span className={`badge ${task.priority.toLowerCase()}`} style={{ marginTop: "4px", display: "inline-block" }}>
                          {task.priority}
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}