import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import DropContent from "./DropContent";
import { apiBaseURL } from "../apiSwitch";
import axios from "axios";
import { useGeoLoc } from "../contexts/GeoLocationContext";
import { uploadFile } from "../config/firebase";
import dropIcon from "../assets/drop.png";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMode } from "../contexts/LightContext";

export default function DropSubmissionDialog({ finish, dropType, file, text }) {
  const { profile } = useUser();
  const { position } = useGeoLoc();
  const {mode} = useMode();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false)
  const submitRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasError(false)
    setIsSubmitting(true)
    try {
      let data = "";
      let path = undefined;

      if (file) {
        const firestoreResponse = await uploadFile(file, profile._id);
        data = firestoreResponse.url;
        path = firestoreResponse.path;
      } else {
        data = text;
      }

      const response = await axios.post(`${apiBaseURL}/drops`, {
        title: title,
        description: description,
        data: data,
        path: path,
        type: dropType,
        creator: profile._id,
        location: position,
      });
      if (response.status === 201) {
        console.log("successfully dropped");
        navigate("/explore");
      }
      handleModalClose();
    } catch (error) {
      console.log(error);
      setIsSubmitting(false)
      setHasError(true)

    }
  };

  const handleModalClose = () => {
    setTitle("");
    setDescription("");
    submitRef.current.close();
    finish();
  };

  useEffect(() => {
    if (file) {
      setContent(window.URL.createObjectURL(file));
    } else {
      setContent(text);
    }
    submitRef.current.showModal();
  }, []);

  return (
    <>
      <dialog ref={submitRef} id="dropSubmission" className={`shadowWall ${mode !== 'light' ? 'darkMode' : ''}`}>
        <div className="formContentWrapper flex vertical center w100 h100">
          <div className="submissionDropContentWrapper">
            <DropContent type={dropType} data={content} title={title} />
          </div>
          <button onClick={handleModalClose} id="closeModal">
            Cancel
          </button>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              name="image"
              id="dropImage"
              style={{ display: "none" }}
            />
            <label className="inputWrapper">
              <span className={`${titleRef.current && titleRef.current.value === '' ? '' : 'invisible'}`}>Title</span>
              <input
                type="text"
                name="title"
                id="dropTitle"
                ref={titleRef}
                value={title}
                onInput={(e) => {
                  setTitle(e.target.value);
                }}
                maxLength="24"
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="inputWrapper">
              <span className={`${descRef.current && descRef.current.value === '' ? '' : 'invisible'}`}>Description</span>
              <textarea
                name="description"
                id="dropDescription"
                ref={descRef}
                rows="3"
                value={description}
                onInput={(e) => {
                  setDescription(e.target.value);
                }}
                disabled={isSubmitting}
              ></textarea>
            </label>
            <button
              type="submit"
              className={`borderNone bgNone circle shadow3d ${hasError ? 'error' : ''} ${isSubmitting ? 'submitting' : ''}`}
              id="submitDrop"
              disabled={isSubmitting}
            >
              <img src={dropIcon} alt="Drop" width="60px" />
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}

DropSubmissionDialog.propTypes = {
  finish: PropTypes.func.isRequired,
  dropType: PropTypes.string.isRequired,
  file: PropTypes.object,
  text: PropTypes.string,
};
