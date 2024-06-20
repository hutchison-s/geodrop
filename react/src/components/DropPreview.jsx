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
import DropViewer from "./DropViewer";
import { useState } from "react";
import { feetToText, readableTimeStamp, typeIcon } from "../functions/utilityFunctions";

export default function DropPreview({ drop, distance }) {
  const { isDark } = useMode();
  const { profile, setProfile } = useUser();
  const [viewing, setViewing] = useState(false);

  const isMine = drop.creatorInfo._id === profile._id;
  const alreadyViewed = drop.viewedBy.includes(profile._id);
  const isFollowing = profile.following.includes(drop.creatorInfo._id)

  

  const handleDelete = async () => {
    axios
      .delete(`${apiBaseURL}/drops/${drop._id}`)
      .then((res) => {
        deleteFile(res.data.path).then(() => {
          console.log(res.data);
          setProfile((p) => {
            return {
              ...p,
              drops: p.drops.filter((d) => d._id !== drop._id),
            };
          });
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div
        className={`dropPreviewFrame w100 ${
          isDark ? "darkMode" : ""
        } ${
          isFollowing ? "following" : ""
        }`}
      >
        <div className="dropPreviewHeader flex spread w100">
          <h3>{drop.title}</h3>
          <div className="flex gapS">
            {isMine ? (
              <button
                onClick={handleDelete}
                className="bgNone padS circle deleteDropButton"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            ) : (
              <div className="circle dropTypeIcon">
                <i className={typeIcon(drop.type)}></i>
              </div>
            )}

            <ClickableProfileImage
              creator={drop.creatorInfo}
            />
          </div>
        </div>
        <div className="flex spread w100">
          {alreadyViewed || isMine 
            ?   <button
                  className="viewDropButton"
                  onClick={() => {
                    setViewing(true);
                  }}
                >
                  View Drop
                </button> 
            :   <p className="dropDistance">{feetToText(distance)}</p>
          }
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
              <em>{readableTimeStamp(drop.timestamp)}</em>
            </small>
          </p>
        </div>
      </div>
      {viewing && (
        <DropViewer
          drop={drop}
          close={() => {
            setViewing(false);
          }}
        />
      )}
    </>
  );
}

DropPreview.propTypes = {
  drop: DropProp,
  distance: PropTypes.number.isRequired
};
