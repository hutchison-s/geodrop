import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";
import { pinIcons } from "../assets/pinIcons";
import { DropProp } from "../assets/customProps";

export default function FarPin({ pin }) {
  return (
    <Marker icon={pinIcons.farDrop} position={pin.location}>
      <Popup>
        <div className="popupFrame flex spread">
          <div className="popupLeft flex vertical">
            <p className="popupTitle">
              <strong>{pin.title}</strong>
            </p>
            <p className="popupDescription">
              <em>{pin.creatorInfo.displayName}</em>
            </p>
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
            <div>
              <div className="popupViews flex gapS spread">
                <span>{pin.viewedBy.length}</span>
                <i className="fa-solid fa-eye"></i>
              </div>
              <div className="popupLikes flex gapS spread">
                <span>{pin.likedBy.length}</span>
                <i className="fa-regular fa-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

FarPin.propTypes = {
  pin: DropProp,
};
