import { Marker } from "react-leaflet";
import { Popup, useMap } from "react-leaflet";
import { icons } from "../assets/icons";
import { DropProp } from "../assets/customProps";
import ClickableProfileImage from "./ClickableProfileImage";

export default function FarDrop({ drop }) {
  const map = useMap();

  return (
    <Marker icon={icons.farDrop} position={drop.location} autoPanOnFocus={true}>
      <Popup eventHandlers={{add: ()=>{map.flyTo(drop.location)}}}>
        <div className="popupFrame flex spread">
          <div className="popupLeft flex vertical">
            <p className="popupTitle">
              <strong>{drop.title}</strong>
            </p>
            <p className="popupDescription">
              <em>{drop.creatorInfo.displayName}</em>
            </p>
            <p className="popupDate">
              <small>{new Date(drop.timestamp).toLocaleDateString()}</small>
            </p>
          </div>
          <div className="popupRight flex vertical center gapS">
          <ClickableProfileImage creator={drop.creatorInfo} />
            <div>
              <div className="popupViews flex gapS spread">
                <span>{drop.viewedBy.length}</span>
                <i className="fa-solid fa-eye"></i>
              </div>
              <div className="popupLikes flex gapS spread">
                <span>{drop.likedBy.length}</span>
                <i className="fa-regular fa-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

FarDrop.propTypes = {
  drop: DropProp,
};
