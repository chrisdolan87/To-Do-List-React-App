import { useState, useEffect, useRef, useCallback } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, getPhotoSrc } from "../db";

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const WebcamCapture = (props) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [imgId, setImgId] = useState(null);
    const [photoSave, setPhotoSave] = useState(false);

    useEffect(() => {
      if (photoSave) {
        console.log("useEffect detected photoSave");
        props.photoedTask(imgId);
        setPhotoSave(false);
      }
    });
    console.log("WebCamCapture", props.id);

    const capture = useCallback(
      (id) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        console.log("capture", imageSrc.length, id);
      },
      [webcamRef, setImgSrc]
    );

    // 4 The savePhoto function saved in the const savePhoto
    const savePhoto = (id, imgSrc) => {
      console.log("savePhoto", imgSrc, id);
      addPhoto(id, imgSrc);
      setImgId(id);
      setPhotoSave(true);
    };

    // 5 cancelPhoto can be easily improved. Any idea? Easy extra marks!
    const cancelPhoto = (id, imgSrc) => {
      console.log("cancelPhoto", id);
    };

    return (
      <>
        {!imgSrc && ( // Before image capture show live picture from camera
          <Webcam audio={false} width={600}
          height={400} ref={webcamRef} screenshotFormat="image/jpeg" />
        )}
        {imgSrc && <img src={imgSrc} />} // After image capture show the static
        picture captured
        <div className="btn-group">
          {!imgSrc && ( // Before image capture show capture button &functionality
            <button
              type="button"
              className="btn"
              onClick={() => capture(props.id)}>
              Capture photo
            </button>
          )}
          {imgSrc && ( // After image capture show save button & functionality
            <button
              type="button"
              className="btn"
              onClick={() => savePhoto(props.id, imgSrc)}>
              Save Photo
            </button>
          )}
          <button // Cancel button not implemented but you could fix this.
            type="button"
            className="btn todo-cancel"
            onClick={() => cancelPhoto(props.id, imgSrc)}>
            Cancel
          </button>
        </div>
      </>
    );
  };

  const ViewPhoto = (props) => {
    // 1 Retrieving photo by id from IndexedDB using GetPhotoSrc in db.js.
    const photoSrc = getPhotoSrc(props.id);
    return (
      <>
        <div>
          <img src={photoSrc} alt={props.name} />
        </div>
      </>
    );
  };

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
      </div>

      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>

        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
          &nbsp; &nbsp;
          <a href={props.location.mapURL}>See location</a>
          {/* &nbsp; | &nbsp;
          <a href={props.location.smsURL}>(sms)</a> */}
        </label>
      </div>

      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>

        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              Take Photo{" "}
            </button>
          }
          modal>
          <div>
            <WebcamCapture id={props.id} photoedTask={props.photoedTask} />
          </div>
        </Popup>

        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              View Photo{" "}
            </button>
          }
          modal>
          <div>
            <ViewPhoto id={props.id} alt={props.name} />
          </div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
