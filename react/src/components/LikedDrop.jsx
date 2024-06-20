import { DropProp } from "../assets/customProps";
import {Link} from 'react-router-dom';
import { useMode } from "../contexts/LightContext";
import axios from 'axios'
import "../styles/droppreview.css";
import { useEffect } from "react";
import { useState } from "react";
import { readableTimeStamp, typeIcon } from "../functions/utilityFunctions";
import DropContent from "./DropContent";

export default function LikedDrop({ drop }) {
  const { isDark } = useMode();
  const [cityName, setCityName] = useState('Somewhere...')

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
      className={`dropPreviewFrame w100 ${isDark ? "darkMode" : ""}`}
    >
      <div className="dropPreviewHeader flex spread w100">
        <h3>{drop.title}</h3>
        <div className="flex gapS">
          <div className="circle dropTypeIcon">
            <i className={typeIcon(drop.type)}></i>
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
        <DropContent data={drop.data} title={drop.title} type={drop.type} />
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
            <em>{readableTimeStamp(drop.timestamp)}</em>
          </small>
        </p>
      </div>
    </div>
  );
}

LikedDrop.propTypes = {
  drop: DropProp
};
