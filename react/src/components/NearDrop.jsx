import { Marker } from "react-leaflet";
import { Popup, useMap } from "react-leaflet";
import { icons } from "../assets/icons";
import { useUser } from "../contexts/UserContext";
import { DropProp } from "../assets/customProps";
import axios from 'axios'
import { useState } from "react";
import DropViewer from './DropViewer'
import ClickableProfileImage from "./ClickableProfileImage";

export default function NearDrop({ drop }) {
  const { profile } = useUser();
  const map = useMap();
  const [viewing, setViewing] = useState(false)

  const handleView = ()=>{
    map.flyTo(drop.location, 16)
    if (!drop.viewedBy.includes(profile._id)) {
        axios.post(`http://localhost:5000/drops/${drop._id}/view/${profile._id}`)
            .catch(err => console.log(err.message))
    }
  }

  const handleLikeToggle = ()=>{
    if (drop.likedBy.includes(profile._id)) {
        axios.delete(`http://localhost:5000/drops/${drop._id}/like/${profile._id}`)
            .catch(err => console.log(err.message))
    } else {
        axios.post(`http://localhost:5000/drops/${drop._id}/like/${profile._id}`)
            .catch(err => console.log(err.message))
    }
  }

  return (
    <>
      {!drop.viewedBy.includes(profile._id) && (
        <Marker icon={icons.ripple} position={drop.location} />
      )}
      {viewing && <DropViewer drop={drop} close={()=>setViewing(false)}/>}
      <Marker icon={icons.drop} position={drop.location}>
        <Popup eventHandlers={{
            add: handleView
        }}>
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
            <ClickableProfileImage id={drop.creatorInfo._id} photo={drop.creatorInfo.photo} name={drop.creatorInfo.displayName} />

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
};
