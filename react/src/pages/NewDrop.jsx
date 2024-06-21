import { useState } from "react";
import "../styles/newdrop.css";
import { useMode } from "../contexts/LightContext";
import NewAudioDrop from "../components/NewAudioDrop";
import { uploadFile } from "../config/firebase";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { apiBaseURL } from "../apiSwitch";
import { useGeoLoc } from "../contexts/GeoLocationContext";
import { useNavigate } from "react-router-dom";
import DropSubmissionDialog from "../components/DropSubmissionDialog";
import { useEffect } from "react";
import NewTextDrop from "../components/NewTextDrop";

export default function NewDrop() {
  const [chosenType, setChosenType] = useState("");
  const { isDark } = useMode();
  const { profile } = useUser();
  const { position, setIsTracking } = useGeoLoc();

  const [blob, setBlob] = useState();
  const [textContent, setTextContent] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setHasError(false);
    setIsWorking(true);
    console.log("submitting");
    const { title, description } = e.target;
    let desc =
      description.value === "Description" ? undefined : description.value;
    let data = textContent;
    let path = undefined;
    if (chosenType !== "text") {
      const response = await uploadFile(blob, profile._id);
      data = response.url;
      path = response.path;
    }
    axios
      .post(`${apiBaseURL}/drops`, {
        title: title.value,
        description: desc,
        creator: profile._id,
        data,
        path,
        type: chosenType,
        location: position,
      })
      .then((res) => {
        setIsTracking(true);
        if (res.status === 201) {
          navigate("/explore");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsWorking(false);
        setHasError(true);
      });
  }

  function handleReset() {
    setIsSubmitting(false);
    setBlob(undefined);
    setTextContent(undefined);
    setIsWorking(false);
    setHasError(false);
    setChosenType("");
    setIsTracking(true);
  }

  function handleInputChange(e) {
    console.log("receiving input from capture device");
    const file = e.target.files[0];
    if (!file) {
      alert("Something went wrong with the camera");
      e.target.files.length = 0;
      e.target.value = null;
      return;
    }
    if (!/image|video/.test(file.type)) {
      alert("Cannot process this file type");
      e.target.files.length = 0;
      e.target.value = null;
      return;
    }
    if (file.size > 1028 * 1028 * 10) {
      alert("File is too large. Can't submit.");
      e.target.files.length = 0;
      e.target.value = null;
      return;
    }
    setBlob(new Blob([file], { type: file.type }));
    console.log("checks passed. Submitting now");
    setIsSubmitting(true);
  }

  function handleTextChange(e) {
      e.preventDefault();
      setTextContent(e.target.textInput.value);
      setIsSubmitting(true);
  }

  useEffect(() => {
    setIsTracking(!isSubmitting);
  }, [isSubmitting, setIsTracking]);

  return (
    <>
      <section className={`newDropPage grid w100 ${isDark ? "darkMode" : ""}`}>
        <label
          className="flex1 grid center w100"
          onClick={() => {
            setChosenType("audio");
          }}
        >
          <i className="fa-solid fa-microphone" role="button"></i>
        </label>
        <label
          className="flex1 grid center w100"
          onClick={() => {
            setChosenType("text");
          }}
        >
          <i className="fa-solid fa-pencil" role="button"></i>
        </label>
        <label
          className="flex1 grid center w100"
          onClick={() => {
            setChosenType("video");
          }}
        >
          <i className="fa-solid fa-video"></i>
          <input
            type="file"
            accept="video/*"
            capture
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
        </label>
        <label
          className="flex1 grid center w100"
          onClick={() => {
            setChosenType("image");
          }}
        >
          <i className="fa-solid fa-camera"></i>
          <input
            type="file"
            accept="image/*"
            capture
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
        </label>
        {chosenType === "text" && !isSubmitting && <NewTextDrop collect={handleTextChange} cancel={handleReset} />}
        {chosenType === "audio" && !isSubmitting && (
          <NewAudioDrop
            collect={(b) => {
              setBlob(b);
              setIsSubmitting(true);
            }}
            cancel={() => {
              setChosenType("");
              setIsSubmitting(false);
            }}
          />
        )}
        {isSubmitting && (
          <DropSubmissionDialog
            onCancel={handleReset}
            onSubmit={handleSubmit}
            dropType={chosenType}
            file={blob}
            text={textContent}
            hasError={hasError}
            isWorking={isWorking}
          />
        )}
      </section>
    </>
  );
}
