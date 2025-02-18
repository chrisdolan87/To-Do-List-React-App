import { useState } from "react";

function Form(props) {
  const [name, setName] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.addTask(name);
    setName("");
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className="input input__lg add-task-input"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="btn btn__primary btn__lg add-task-button">
        Add
      </button>
    </form>
  );
}

export default Form;
