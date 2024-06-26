import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";
import { useUser } from "../contexts/UserContext";
import { DropProp } from "../assets/customProps";
import axios from 'axios'
import { useState } from "react";
import DropViewer from './DropViewer'
import ClickableProfileImage from "./ClickableProfileImage";
import { apiBaseURL } from "../apiSwitch";
import PropTypes from 'prop-types'

export default function NearDrop({ drop, icon }) {
  const { profile } = useUser();
  const [viewing, setViewing] = useState(false)

  const handleLikeToggle = ()=>{
    if (drop.likedBy.includes(profile._id)) {
        axios.delete(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
            .catch(err => console.log(err.message))
    } else {
        axios.post(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
            .catch(err => console.log(err.message))
    }
  }

  return (
    <>
      {viewing && <DropViewer drop={drop} close={()=>setViewing(false)}/>}
      <Marker icon={icon} position={drop.location} autoPanOnFocus={true}>
        <Popup >
          <div className="popupFrame flex w100 spread">
            <div className="popupLeft flex vertical">
              <p className="popupTitle">
                <strong>{drop.title}</strong>
              </p>
              <p>
                <em>{drop.creatorInfo.displayName}</em>
              </p>
              <button onClick={()=>{setViewing(true)}} className="viewButton borderNone shadow3d">
                Open
              </button>
              <p className="popupDate">
                <small>{new Date(drop.timestamp).toLocaleDateString()}</small>
              </p>
            </div>
            <div className="popupRight flex vertical center gapS">
            <ClickableProfileImage creator={drop.creatorInfo} />

              <div className="w100">
                <div className="popupViews flex spread gapS w100">
                  <span>{drop.viewedBy.length}</span>{" "}
                  <i className="fa-solid fa-eye"></i>
                </div>
                <div className="popupLikes flex spread gapS w100">
                  <span>{drop.likedBy.length}</span>
                  <i
                    className={`fa-${
                      drop.likedBy.includes(profile._id) ? "solid" : "regular"
                    } fa-heart`}
                    role="button"
                    onClick={handleLikeToggle}
                    tabIndex={0}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

NearDrop.propTypes = {
  drop: DropProp,
  icon: PropTypes.object
};
