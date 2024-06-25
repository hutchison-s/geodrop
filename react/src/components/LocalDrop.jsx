import { DropProp } from "../assets/customProps";
import {Link} from 'react-router-dom';
import { useMode } from "../contexts/LightContext";
import axios from 'axios'
import "../styles/droppreview.css";
import { useEffect } from "react";
import { useState } from "react";
import { readableTimeStamp, typeIcon } from "../functions/utilityFunctions";
import DropContent from "./DropContent";
import { apiBaseURL } from "../apiSwitch";
import { useUser } from "../contexts/UserContext";

export default function LocalDrop({ drop }) {
  const { isDark } = useMode();
  const {profile } = useUser();
  const [ isViewing, setIsViewing] = useState(false)

  const isMine = d=>d.creatorInfo._id === profile._id;
    const alreadyViewed = d=>d.viewedBy.includes(profile._id);
    const alreadyLiked = d=>d.likedBy.includes(profile._id);

    const handleLikeToggle = () => {
        if (alreadyLiked(drop)) {
            axios.delete(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
                .catch(err => console.log(err.message));
        } else {
            axios.post(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
                .catch(err => console.log(err.message));
        }
    };

  const logView = ()=>{
    if (!isMine(drop) && !alreadyViewed(drop)) {
        axios.post(`${apiBaseURL}/drops/${drop._id}/view/${profile._id}`)
            .catch(err => console.log(err))
    }
}

useEffect(()=>{
    if (isViewing) {
        logView()
    }
}, [isViewing])

  return (
    <div
      className={`dropPreviewFrame flex vertical spread w100 ${isDark ? "darkMode" : ""}`}
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
      
      <div className="flex vertical center w100 flex1 gapM">
        {isViewing 
            ?   <div className="dropContent padM">
                    <DropContent data={drop.data} title={drop.title} type={drop.type} />
                </div> 
            :   <button className='viewContentButton rounded borderNone shadowS' onClick={()=>(setIsViewing(true))}>View Drop</button>
        }
          <Link to={`/explore?lat=${drop.location.lat}&lng=${drop.location.lng}`} className="viewOnMapButton">View on Map</Link>
      </div>
      <div className="dropPreviewFooter flex spread w100">
          <small>
            <em>{readableTimeStamp(drop.timestamp)}</em>
          </small>
          <i
                        className={`fa-${alreadyLiked(drop) ? "solid" : "regular"} fa-heart`}
                        role="button"
                        onClick={handleLikeToggle}
                        tabIndex={0}
                    ></i>
        </div>
    </div>
  );
}

LocalDrop.propTypes = {
  drop: DropProp
};
