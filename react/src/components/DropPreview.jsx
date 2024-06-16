import { DropProp } from "../assets/customProps";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';
import { useMode } from "../contexts/LightContext";
import axios from 'axios'
import dropIcon from '../assets/drop.png'
import "../styles/droppreview.css";
import { useEffect } from "react";
import { useState } from "react";

export default function DropPreview({ drop, distance, following }) {
  const { mode } = useMode();
  const [creator, setCreator] = useState({displayName: 'Loading...', photo: dropIcon})

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

  

  useEffect(()=>{
    const getCreatorInfo = () => {
        axios.get(`http://localhost:5000/users/${drop.creator}`)
            .then(res => {
                if (res.status === 200) {
                    const {displayName, photo} = res.data;
                    setCreator({displayName, photo})
                }
            })
            .catch(err => console.log(err))
        
      }

    getCreatorInfo();
  }, [])

  return (
    <div
      className={`dropPreviewFrame w100 ${mode === "dark" ? "darkMode" : ""} ${
        following ? "following" : ""
      }`}
    >
      <div className="dropPreviewHeader flex spread w100">
        <h3>{drop.title}</h3>
        <div className="flex gapS">
          <div className="circle dropTypeIcon">
            <i className={`fa-solid fa-${typeIcon()}`}></i>
          </div>
          <img
            src={creator.photo}
            alt={creator.displayName}
            width="36px"
            className="circle"
          />
        </div>
      </div>
      <div className="flex spread w100">
          <p className="dropDistance">{feetToText(distance)}</p>
          <Link to={`/explore?lat=${drop.location.lat}&lng=${drop.location.lng}`} className="viewOnMapButton">View on Map</Link>
      </div>
      <div className="dropPreviewFooter flex spread w100">
        <p className="dropPreviewCreator">
          <small>{creator.displayName}</small>
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
