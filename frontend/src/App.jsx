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
        // Fetch tasks from the backend
        const response = await fetch(import.meta.env.VITE_API_URL);
        const data = await response.json();
        setTasks(data); // Set the tasks to the state
      } catch (error) {
        console.error("Error fetching tasks", error); // Log any errors
      }
    };

    fetchTasks(); // Call the function to fetch tasks on component mount
  }, []); // The empty array means this will only run once when the component mounts

  // Dark mode state management
  const [dark, setDark] = useState({
    backgroundColor: "white",
  });

  const [btntext, setBtntext] = useState("Dark mode");

  // Function to toggle dark mode
  const changetheme = () => {
    if (dark.backgroundColor === "white") {
      setDark({
        backgroundColor: "black",
      });
      setBtntext("Light mode");
    } else {
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
          className="fixed text-white rounded-3xl p-2 bg-gray-800 mt-5 ml-350"
          onClick={changetheme}
        >
          {btntext}
        </button>
        <div className="w-screen h-dvw flex flex-col items-center gap-7 pt-2">
          <h1 className="text-3xl text-gray-700 font-bold text-center">KANBAN BOARD</h1>
          <CreateTask tasks={tasks} setTasks={setTasks} />
          <p className="text-gray-500 text-xs -mt-4 text-center">
            Drag and drop tasks between lists to update task status.
          </p>
          <ListTasks tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
