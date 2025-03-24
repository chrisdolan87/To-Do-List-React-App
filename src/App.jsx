import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import CameraRef from "./cameraRef";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App(props) {

  function usePersistedState(key, defaultValue) {
    const [state, setState] = useState(() => JSON.parse(localStorage.getItem(key)) || defaultValue);

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  } 

  const [tasks, setTasks] = usePersistedState("tasks", []);
  const [filter, setFilter] = useState("All");
  const [lastInsertedID, setLastInsertedID] = useState("");

  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = {
      id: id,
      name: name,
      completed: false,
      location: { latitude: "##", longitude: "##", mapURL: "##", error: "##" },
    };
    setLastInsertedID(id);
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        location={task.location}
        toggleTaskCompleted={toggleTaskCompleted}
        photoedTask={photoedTask}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const mapURL = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    console.log(
      `Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
    );
    locateTask(lastInsertedID, {
      latitude: latitude,
      longitude: longitude,
      mapURL: mapURL,
      error: "",
    });
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  function locateTask(id, location) {
    console.log("locate Task", id, " before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, location: location };
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // 1 à Set photo property to true for a task identified by id when a photo for that
        // task is saved.
        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList); // 2 à Update your tasks list appending the task with photo.
  }

  return (
    <div className="app stack-large">
      <h1>To do list</h1>

      <Form addTask={addTask} geoFindMe={geoFindMe} />

      <div className="filters btn-group stack-exception show-buttons-container">
        {filterList}
      </div>

      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}
