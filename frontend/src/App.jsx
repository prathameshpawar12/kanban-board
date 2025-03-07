import { useEffect, useState } from "react";
import "./App.css";
import CreateTask from "./components/CreateTask";
import ListTasks from "./components/ListTasks";
import { ToastContainer } from "react-toastify";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://kanban-board-production-600f.up.railway.app/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };
    fetchTasks();
  }, []);

  

  const [dark, setDark] = useState({
    backgroundColor: "white",
  });

  const [btntext, setBtntext] = useState("Dark mode");
  const changetheme = () => {
    if (dark.backgroundColor == "white") {
      setDark({
        backgroundColor: "black",
      });
      setBtntext("Light mode");
    } else if (dark.backgroundColor == "black") {
      setDark({
        backgroundColor: "white",
      });
      setBtntext("Dark mode");
    }

 
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <ToastContainer />
      <div style={dark}>
        <button
          className="fixed text-white rounded-3xl p-2 bg-gray-800  mt-5 ml-350"
          onClick={changetheme}
        >
          {btntext}
        </button>
        <div className="w-screen h-dvw flex flex-col items-center  gap-7 pt-2">
          <h1 className="text-3xl text-gray-700 font-bold ">KANBAN BOARD</h1>
          <CreateTask tasks={tasks} setTasks={setTasks} />
          <p className="text-gray-500 text-xs -mt-4">
            Drag and drop tasks between lists to update task status.
          </p>
          <ListTasks tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
