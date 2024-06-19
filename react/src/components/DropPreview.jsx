import { DropProp } from "../assets/customProps";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useMode } from "../contexts/LightContext";
import axios from "axios";
import "../styles/droppreview.css";

import ClickableProfileImage from "./ClickableProfileImage";
import { useUser } from "../contexts/UserContext";
import { apiBaseURL } from "../apiSwitch";
import { deleteFile } from "../config/firebase";

export default function DropPreview({ drop, distance }) {
  const { mode } = useMode();
  const { profile, setProfile } = useUser();

  const typeIcon = () => {
    switch (drop.type) {
      case "audio":
        return "headphones";
      case "image":
        return "camera";
      case "video":
        return "video";
      default:
        return "file-lines";
    }
  };

  const feetToText = (feet) => {
    switch (true) {
      case feet < 500:
        return `Only ${Math.round(feet)} feet away!`;
      case feet < 1000:
        return `${Math.round(feet)} feet away`;
      default:
        return `${(feet / 5280).toFixed(1)} miles away`;
    }
  };

  const handleDelete = async () => {
    axios
      .delete(`${apiBaseURL}/drops/${drop._id}`)
      .then((res) => {
        deleteFile(res.data.path)
          .then(()=>{
            console.log(res.data);
            setProfile(p => {
              return {
                ...p,
                drops: p.drops.filter(d => d._id !== drop._id)
              }
            })
          })
        
        
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={`dropPreviewFrame w100 ${mode === "dark" ? "darkMode" : ""} ${
        profile.following.includes(drop.creatorInfo._id) ? "following" : ""
      }`}
    >
      <div className="dropPreviewHeader flex spread w100">
        <h3>{drop.title}</h3>
        <div className="flex gapS">
          {drop.creatorInfo._id === profile._id
            ?   <button
                  onClick={handleDelete}
                  className="bgNone padS circle deleteDropButton"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
            :   <div className="circle dropTypeIcon">
                  <i className={`fa-solid fa-${typeIcon()}`}></i>
                </div>
          }
          
          <ClickableProfileImage
            id={drop.creatorInfo._id}
            photo={drop.creatorInfo.photo}
            name={drop.creatorInfo.displayName}
          />
        </div>
      </div>
      <div className="flex spread w100">
        {(drop.viewedBy.includes(profile._id) || drop.creatorInfo._id === profile._id) ? <button className="viewDropButton">View Drop</button> : <p className="dropDistance">{feetToText(distance)}</p>}
        <Link
          to={`/explore?lat=${drop.location.lat}&lng=${drop.location.lng}`}
          className="viewOnMapButton"
        >
          View on Map
        </Link>
      </div>
      <div className="dropPreviewFooter flex spread w100">
        <p className="dropPreviewCreator">
          <small>{drop.creatorInfo.displayName}</small>
        </p>
        <p className="dropPreviewTimestamp">
          <small>
            <em>{new Date(drop.timestamp).toLocaleString()}</em>
          </small>
        </p>
      </div>
    </div>
  );
}

DropPreview.propTypes = {
  drop: DropProp,
  distance: PropTypes.number.isRequired,
  following: PropTypes.bool.isRequired,
};
