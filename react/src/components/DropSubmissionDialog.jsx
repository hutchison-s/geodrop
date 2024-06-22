
import DropContent from "./DropContent";

import dropIcon from "../assets/drop.png";

import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";


export default function DropSubmissionDialog({
  onSubmit,
  onCancel,
  dropType,
  file,
  text,
  hasError,
  isWorking,
}) {

  const [objectURL, setObjectURL] = useState('')

  useEffect(()=>{
    if (file) {
      setObjectURL(window.URL.createObjectURL(file))
    }
  }, [file])

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="fullscreen flex vertical padL gapM"
        id="submissionForm"
      >
        <button
          id="cancelSubmission"
          type="button"
          onClick={onCancel}
          className="padM circle grid center colorFG bgNone"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <DropContent type={dropType} data={file ? objectURL : text}/>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title..."
          required
          maxLength="20"
          disabled={isWorking}
        />
        <textarea
          name="description"
          id="description"
          defaultValue="Description"
          onFocus={(e) => {
            e.target.value = "";
          }}
          rows="3"
          disabled={isWorking}
        ></textarea>
        <button
          type="submit"
          className={`borderNone bgNone circle shadow3d padM ${
            hasError ? "error" : ""
          } ${isWorking ? "submitting" : ""}`}
          id="submitDrop"
          disabled={isWorking}
        >
          <img src={dropIcon} alt="Drop" width="60px" />
        </button>
      </form>
    </>
  );
}

DropSubmissionDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dropType: PropTypes.string.isRequired,
  file: PropTypes.object,
  text: PropTypes.string,
  hasError: PropTypes.bool.isRequired,
  isWorking: PropTypes.bool.isRequired,
};
