import React, { useState, useEffect } from "react";

// Helper function to handle API requests
const apiUrl = "http://localhost:8000/api/tasks/";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    taskTitle: "",
    taskDescription: "",
    effort: "",
    due_date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to get the auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("authtoken");
    console.log("Auth Token:", token); // Check if the token is available
    return token;
  };
  

  // Function to set the auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" }; // Fallback if no token is present
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const { taskTitle, effort, due_date } = form;

    // Validate fields
    if (!taskTitle || !effort || !due_date) {
      alert("Please fill in all fields!");
      return;
    }
    const newTask = {
      title: form.taskTitle,
      description: form.taskDescription,
      effort_days: form.effort,
      due_date: form.due_date,
    };

    try {
      if (isEditing) {
        // Update existing task
        await updateTask(editTaskId, newTask);
      } else {
        // Create new task
        await createTask(newTask);
      }
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error handling task submit:", error);
    }
  };

  const createTask = async (task) => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      alert("The Task has been created");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (taskId, task) => {
    try {
      const response = await fetch(`${apiUrl}${taskId}/`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      setIsEditing(false);
      alert("the task has been updated");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTaskDelete = async (id) => {
    // Show confirmation dialog
    const userConfirmed = window.confirm("Are you sure you want to delete this task?");
    
    // Proceed only if user confirms
    if (userConfirmed) {
      try {
        await fetch(`${apiUrl}${id}/`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    } else {
      console.log("Task deletion canceled by the user.");
    }
  };
  
  const handleTaskEdit = (task) => {
    setForm({
      taskTitle: task.title,
      taskDescription: task.description,
      effort: task.effort_days,
      due_date: task.due_date,
    });
    setIsEditing(true);
    setEditTaskId(task.id);
    openModal();
  };

  const handleExportToExcel = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tasks/export/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to export tasks");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_export.xlsx"); // Specify filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting tasks to Excel:", error);
    }
  };
  

  const resetForm = () => {
    setForm({
      taskTitle: "",
      taskDescription: "",
      effort: "",
      due_date: "",
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      {/* Welcome Zaid outside the box */}
      {/* <h1 className="text-4xl font-bold text-yellow-500 mb-8">Welcome Zaid</h1> */}

      {/* Task Management Box */}
      <div className="max-w-xl w-full p-8 bg-gray-900 rounded-xl shadow-xl mb-10">
        {/* Task Management System title inside the box */}
        <h2 className="text-4xl font-bold text-yellow-500 text-center mb-8">
          Task Management System
        </h2>

        <button
          onClick={openModal}
          className="w-full py-4 mt-4 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Add Task
        </button>

        {/* Task List */}
        <div className="space-y-6 mt-8">
          {tasks.length === 0 ? (
            <p className="text-center text-yellow-300">No tasks available.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-200 ease-in-out"
              >
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-yellow-500">
                    {task.title}
                  </h3>
                  <p className="text-sm text-yellow-300 mt-2">{task.description}</p>
                  <p className="text-sm text-yellow-400 mt-2">
                    Effort: {task.effort_days} days
                  </p>
                  <p className="text-sm text-yellow-400 mt-2">Due: {task.due_date}</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleTaskEdit(task)}
                    className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for adding/editing task */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-gray-900 rounded-lg shadow-lg w-1/3 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold text-yellow-500 mb-6 text-center">
                {isEditing ? "Edit Task" : "Add Task"}
              </h2>
              <form onSubmit={handleTaskSubmit} className="space-y-6">
                <div>
                  <label className="block text-yellow-300 font-medium">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="taskTitle"
                    value={form.taskTitle}
                    onChange={handleInputChange}
                    className="w-full p-4 mt-2 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-yellow-300 font-medium">Description</label>
                  <textarea
                    name="taskDescription"
                    value={form.taskDescription}
                    onChange={handleInputChange}
                    className="w-full p-4 mt-2 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter task description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-yellow-300 font-medium">Effort (in Days)</label>
                    <input
                      type="number"
                      name="effort"
                      value={form.effort}
                      onChange={handleInputChange}
                      className="w-full p-4 mt-2 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter effort"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-300 font-medium">Due Date</label>
                    <input
                      type="date"
                      name="due_date"
                      value={form.due_date}
                      onChange={handleInputChange}
                      className="w-full p-4 mt-2 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-4 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={handleExportToExcel}
          className="w-full py-4 mt-4 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default TodoList;
