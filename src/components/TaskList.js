import { useState } from "react";
import { toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";
import { useEffect } from "react";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const { name } = formData;

  const handelInputchange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://mern-crud-app-backend.vercel.app/api/tasks`
      );
      //   console.log(data);
      setTasks(data);
      //   console.log(tasks);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input Field cannot be empty");
    }
    try {
      await axios.post(
        "https://mern-crud-app-backend.vercel.app/api/tasks",
        formData
      );

      setFormData({ ...formData, name: "" });
      getTasks();
      toast.success("Task added successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://mern-crud-app-backend.vercel.app/api/tasks/${id}`
      );
      getTasks();
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(cTask);
  });

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  let updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input Field cannot be empty");
    }
    try {
      await axios.put(
        `https://mern-crud-app-backend.vercel.app/api/tasks/${taskID}`,
        formData
      );
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(
        `https://mern-crud-app-backend.vercel.app/api/tasks/${task._id}`,
        newFormData
      );
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handelInputchange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />

      {tasks.length > 0 && (
        <div className="--flex-between pb">
          <p>
            <b>Total Task :</b> {tasks.length}
          </p>
          <p>
            <b>Completed Task :</b>
            {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {loading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}
      {!loading && tasks.length === 0 ? (
        <p className="--py">No Task Added</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
