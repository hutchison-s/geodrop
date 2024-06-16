import { Marker } from "react-leaflet";
import { Popup, useMap } from "react-leaflet";
import { pinIcons } from "../assets/pinIcons";
import { useUser } from "../contexts/UserContext";
import { DropProp } from "../assets/customProps";
import axios from 'axios'
import { useState } from "react";
import DropViewer from '../components/DropViewer'

export default function ClosePin({ pin }) {
  const { profile } = useUser();
  const map = useMap();
  const [viewing, setViewing] = useState(false)

  const handleView = ()=>{
    map.flyTo(pin.location, 16)
    if (!pin.viewedBy.includes(profile._id)) {
        axios.post(`http://localhost:5000/pins/${pin._id}/view/${profile._id}`)
            .catch(err => console.log(err.message))
    }
  }

  const handleLikeToggle = ()=>{
    if (pin.likedBy.includes(profile._id)) {
        axios.delete(`http://localhost:5000/pins/${pin._id}/like/${profile._id}`)
            .catch(err => console.log(err.message))
    } else {
        axios.post(`http://localhost:5000/pins/${pin._id}/like/${profile._id}`)
            .catch(err => console.log(err.message))
    }
  }

  return (
    <>
      {!profile.viewed.includes(pin._id) && (
        <Marker icon={pinIcons.ripple} position={pin.location} />
      )}
      {viewing && <DropViewer drop={pin} close={()=>setViewing(false)}/>}
      <Marker icon={pinIcons.drop} position={pin.location}>
        <Popup eventHandlers={{
            add: handleView
        }}>
          <div className="popupFrame flex w100 spread">
            <div className="popupLeft flex vertical">
              <p className="popupTitle">
                <strong>{pin.title}</strong>
              </p>
              <p>
                <em>{pin.creatorInfo.displayName}</em>
              </p>
              <button onClick={()=>{setViewing(true)}} className="viewButton borderNone shadow3d">
                Open
              </button>
              <p className="popupDate">
                <small>{new Date(pin.timestamp).toLocaleDateString()}</small>
              </p>
            </div>
            <div className="popupRight flex vertical center gapS">
              <img
                src={pin.creatorInfo.photo}
                alt={pin.creatorInfo.displayName}
                width="25px"
                className="circle popupCreatorImage"
              />

              <div className="w100">
                <div className="popupViews flex spread gapS w100">
                  <span>{pin.viewedBy.length}</span>{" "}
                  <i className="fa-solid fa-eye"></i>
                </div>
                <div className="popupLikes flex spread gapS w100">
                  <span>{pin.likedBy.length}</span>
                  <i
                    className={`fa-${
                      pin.likedBy.includes(profile._id) ? "solid" : "regular"
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

ClosePin.propTypes = {
  pin: DropProp,
};
