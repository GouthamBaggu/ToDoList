import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All"); // Filter state
  const [editIndex, setEditIndex] = useState(null); // For editing tasks

  // Load tasks from local storage when the app starts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to local storage whenever the task list changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task) return;

    if (editIndex !== null) {
      // Update task if in edit mode
      const updatedTasks = tasks.map((t, index) => (index === editIndex ? { ...t, name: task, completed: false } : t));
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      // Add a new task
      setTasks([...tasks, { name: task, completed: false }]);
    }

    setTask("");
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleComplete = (index) => {
    const newTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(newTasks);
  };

  const editTask = (index) => {
    setTask(tasks[index].name);
    setEditIndex(index);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true; // Show all tasks for All filter
  });

  return (
    <div className="app-container">
      <div className="todo-container">
        <h1 className="title">To-Do List</h1>

        <div className="input-section">
          <input
            type="text"
            className="task-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
          />
          <button className="add-task-btn" onClick={addTask}>
            {editIndex !== null ? "Update Task" : "Add Task"}
          </button>
        </div>

        <div className="filter-section">
          <button className={filter === "All" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("All")}>
            All
          </button>
          <button className={filter === "Active" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("Active")}>
            Active
          </button>
          <button className={filter === "Completed" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("Completed")}>
            Completed
          </button>
        </div>

        <ul className="task-list">
          {filteredTasks.map((t, index) => (
            <li className={`task-item ${t.completed ? "completed" : ""}`} key={index}>
              <span onClick={() => toggleComplete(index)}>{t.name}</span>
              <div className="task-buttons">
                <button className="edit-task-btn" onClick={() => editTask(index)}>Edit</button>
                <button className="delete-task-btn" onClick={() => deleteTask(index)}>Delete</button>
                {/* Complete button added here */}
                <button className="complete-task-btn" onClick={() => toggleComplete(index)}>
                  {t.completed ? "Undo" : "Complete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
