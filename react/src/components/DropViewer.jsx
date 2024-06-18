import { useRef } from "react";
import { DropProp } from "../assets/customProps";
import { useEffect } from "react";
import PropTypes from 'prop-types';
import { useUser } from "../contexts/UserContext";
import axios from 'axios';
import { apiBaseURL } from "../apiSwitch";
import DropContent from "./DropContent";


export default function DropViewer({ drop, close }) {
    const { profile } = useUser();
    const nodeRef = useRef(null);

    const handleClose = () => {
        nodeRef.current?.close();
        close();
    };

    const handleLikeToggle = () => {
        if (drop.likedBy.includes(profile._id)) {
            axios.delete(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
                .catch(err => console.log(err.message));
        } else {
            axios.post(`${apiBaseURL}/drops/${drop._id}/like/${profile._id}`)
                .catch(err => console.log(err.message));
        }
    };

    useEffect(() => {
        nodeRef.current?.showModal();
    }, []);

    return (
        <dialog ref={nodeRef} className="dropViewer">
            <button onClick={handleClose} className="closeButton">
                <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="dropWrapper">
                <p className="dropCreator w100"><strong>{drop.creatorInfo.displayName}</strong></p>
                <DropContent type={drop.type} data={drop.data} title={drop.title} />
                <p className="padM dropDescription">{drop.description}</p>
                <div className="flex spread w100 dropViewerFooter">
                    <div>
                        <p><small><em>{new Date(drop.timestamp).toLocaleString()}</em></small></p>
                    </div>
                    <i
                        className={`fa-${drop.likedBy.includes(profile._id) ? "solid" : "regular"} fa-heart`}
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
