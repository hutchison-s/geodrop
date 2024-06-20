import { useRef } from "react";
import { DropProp } from "../assets/customProps";
import { useEffect } from "react";
import PropTypes from 'prop-types';
import { useUser } from "../contexts/UserContext";
import axios from 'axios';
import { apiBaseURL } from "../apiSwitch";
import DropContent from "./DropContent";
import ClickableProfileImage from "./ClickableProfileImage";
import { useMode } from "../contexts/LightContext";
import { deleteFile } from "../config/firebase";


export default function DropViewer({ drop, close }) {
    const { profile, setProfile } = useUser();
    const {isDark} = useMode();
    const nodeRef = useRef(null);

    const isMine = drop.creatorInfo._id === profile._id;
    const alreadyViewed = drop.viewedBy.includes(profile._id);
    const alreadyLiked = drop.likedBy.includes(profile._id);

    const handleClose = () => {
        nodeRef.current?.close();
        close();
    };

    const handleLikeToggle = () => {
        if (alreadyLiked) {
            axios.delete(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
                .catch(err => console.log(err.message));
        } else {
            axios.post(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
                .catch(err => console.log(err.message));
        }
    };

    const logView = ()=>{
        if (!isMine && !alreadyViewed) {
            axios.post(`${apiBaseURL}/drops/${drop._id}/view/${profile._id}`)
                .catch(err => console.log(err))
        }
    }

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

    useEffect(() => {
        nodeRef.current?.showModal();
        logView();
    }, []);

    return (
        <dialog ref={nodeRef} className={`dropViewer ${isDark ? 'darkMode' : ''}`}>
            <button onClick={handleClose} className="closeButton">
                <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="dropWrapper">
                
                <div className="flex spread dropViewerHeader w100">
                    
                    <div className="flex gapS center">
                        <ClickableProfileImage creator={drop.creatorInfo} />
                        <p className="dropCreator w100">{drop.creatorInfo.displayName}</p>
                    </div>
                    {isMine && <button
                            onClick={handleDelete}
                            className="bgNone padS circle deleteDropButton"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>}
                </div>
                <h3 className="dropTitle">{drop.title}</h3>
                <DropContent type={drop.type} data={drop.data} title={drop.title} />
                <p className="padM dropDescription">{drop.description}</p>
                <div className="flex spread w100 dropViewerFooter">
                    <div>
                        <p><small><em>{new Date(drop.timestamp).toLocaleString()}</em></small></p>
                    </div>
                    <i
                        className={`fa-${alreadyLiked ? "solid" : "regular"} fa-heart`}
                        role="button"
                        onClick={handleLikeToggle}
                        tabIndex={0}
                    ></i>
                </div>
            </div>
        </dialog>
    );
}
DropViewer.propTypes = {
    drop: DropProp,
    close: PropTypes.func.isRequired
};
