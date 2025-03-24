import Webcam from "react-webcam";
import { useRef, useCallback } from "react";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CameraRef() {
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <h2>Camera with ref</h2>

      <Webcam
        audio={false}
        width={600}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <button
        onClick={capture}
        className="btn btn__primary btn__lg add-task-button">
        Take photo
      </button>
    </>
  );
}
