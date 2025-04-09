import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useDrop } from "react-dnd";
import Task from "./Task";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [peerReview, setPeerReview] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo");
    const fInProgress = tasks.filter((task) => task.status === "inprogress");
    const fPeerReview = tasks.filter((task) => task.status === "peerreview");
    const fDone = tasks.filter((task) => task.status === "done");

    setTodos(fTodos);
    setInProgress(fInProgress);
    setPeerReview(fPeerReview);
    setDone(fDone);
  }, [tasks]);

  const statuses = ["todo", "inprogress", "peerreview", "done"];
  return (
    <div className="flex -mt-8 gap-16 h-dvw">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          peerReview={peerReview}
          done={done}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  inProgress,
  peerReview,
  done,
}) => {
  const lastToastId = useRef(null); // Store last toast ID

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = "To do";
  let bg = "bg-slate-500";
  let tasksToMap = todos;

  if (status === "inprogress") {
    text = "In Progress";
    bg = "bg-purple-500";
    tasksToMap = inProgress;
  }

  if (status === "peerreview") {
    text = "Peer Review";
    bg = "bg-yellow-500";
    tasksToMap = peerReview;
  }

  if (status === "done") {
    text = "Done";
    bg = "bg-green-500";
    tasksToMap = done;
  }

  const addItemToSection = async (id) => {
    try {
      const response = await fetch(`https://https://kanban-board-sjde.onrender.com/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
  
      if (!response.ok) throw new Error("Update failed");
      
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status } : task
      ));
      toast.success("Task status updated");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update task");
    }
  };
  

  return (
    <div
      ref={drop}
      className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-200" : ""}`}
    >
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap.map((task) => (
          <Task key={task.id} tasks={tasks} task={task} setTasks={setTasks} />
        ))}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
  );
};
