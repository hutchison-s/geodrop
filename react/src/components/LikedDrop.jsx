import { DropProp } from "../assets/customProps";
import {Link} from 'react-router-dom';
import { useMode } from "../contexts/LightContext";
import axios from 'axios'
import "../styles/droppreview.css";
import { useEffect } from "react";
import { useState } from "react";

export default function LikedDrop({ drop }) {
  const { mode } = useMode();
  const [cityName, setCityName] = useState('Somewhere...')

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

  const Content = ()=>{
    switch(drop.type) {
        case 'text':
            return (
                <p>{drop.data}</p>
            );
        case 'image':
            return (
                <img src={drop.data} alt={drop.title} width='100%'/>
            );
        default:
            return (
                <p>Cannot display this type yet</p>
            )
    }
}

  useEffect(()=>{

      const locationToCity = () => {
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${drop.location.lat}&lon=${drop.location.lng}`)
            .then(res => {
                console.log(res.data);
                const {city} = res.data.address
                const state = res.data.address['ISO3166-2-lvl4'].split('-')[1]
                setCityName(`${city}, ${state}`);
            })
            .catch(error => {
                console.error('Error:', error);
            });
      };
    locationToCity();
  }, [])

  return (
    <div
      className={`dropPreviewFrame w100 ${mode === "dark" ? "darkMode" : ""}`}
    >
      <div className="dropPreviewHeader flex spread w100">
        <h3>{drop.title}</h3>
        <div className="flex gapS">
          <div className="circle dropTypeIcon">
            <i className={`fa-solid fa-${typeIcon()}`}></i>
          </div>
          <img
            src={drop.creatorInfo.photo}
            alt={drop.creatorInfo.displayName}
            width="36px"
            className="circle"
          />
        </div>
      </div>
      <div className="dropContent padM">
        <Content />
      </div>
      <div className="flex spread w100">
          <p className="dropDistance">Found in {cityName}</p>
          <Link to={`/explore?lat=${drop.location.lat}&lng=${drop.location.lng}`} className="viewOnMapButton">View on Map</Link>
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

LikedDrop.propTypes = {
  drop: DropProp
};
