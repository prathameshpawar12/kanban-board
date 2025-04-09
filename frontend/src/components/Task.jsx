import React from "react";
import { useDrag } from "react-dnd";
const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  console.log(isDragging);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`https://kanban-board-sjde.onrender.com/api/tasks/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Delete failed");
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-gray-100 h-30 relative p-4 mt-8 shadow-2xl break-words rounded-md cursor-grab ${
        isDragging ? "opacity-25" : "opacity-100"
      }`}
    >
      <h3 className="flex justify-center font-semibold">{task.name}</h3>
      <div className="w-50 h-18 ml-0.5 ">
        <p className="opacity-50 rounded-md text-sm">{task.description}</p>
      </div>

      <button
        className="absolute bottom-1 right-1 text-slate-400"
        onClick={() => handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Task;
