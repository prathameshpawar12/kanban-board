import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const CreateTask = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    description: "",
    status: "todo",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.name.length < 3) return toast.error("Enter more than 3 characters");
    if (task.name.length > 100) return toast.error("Enter less than 100 characters");

    try {
      const response = await fetch("https://kanban-board-sjde.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uuidv4(), // Generate a unique ID
          name: task.name,
          description: task.description,
          status: "todo",
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");
      const createdTask = await response.json();
      setTasks(prev => [...prev, createdTask]);
      toast.success("Task Created");
      setTask({ id: "", name: "", description: "", status: "todo" });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error creating task");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Task Name"
        className="border-2 border-slate-400 bg-slate-200 rounded-md mr-4 h-12 w-56 px-1"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Enter Task Description"
        className="border-2 border-slate-400 bg-slate-200 rounded-md mr-4 h-12 w-56 px-1"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <button className="bg-cyan-500 rounded-md px-4 h-12 text-white">Create</button>
    </form>
  );
};

export default CreateTask;
