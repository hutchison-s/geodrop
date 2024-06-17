import { useRef } from "react";
import { DropProp } from "../assets/customProps"
import { useEffect } from "react";
import PropTypes from 'prop-types';
import '../styles/dropviewer.css'
import { useUser } from "../contexts/UserContext";
import axios from 'axios'

export default function DropViewer({drop, close}) {
    const {profile} = useUser();
    const nodeRef = useRef(null)

    const Content = ()=>{
        switch(drop.type) {
            case 'text':
                return (
                    <p>{drop.data}</p>
                );
            case 'image':
                return (
                    <img src={drop.data} alt={drop.title} width='100%'/>
                );
            default:
                return (
                    <p>Cannot display this type yet</p>
                )
        }
    }

    const handleClose = ()=>{
        nodeRef.current?.close()
        close()
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

    useEffect(()=>{
        nodeRef.current?.showModal();
    }, [])

    return (
        <dialog ref={nodeRef} className="dropViewer">
            <button onClick={handleClose} className="closeButton">
                <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="dropWrapper">
                <p className="dropCreator w100"><strong>{drop.creatorInfo.displayName}</strong></p>
                <Content />
                <div className="flex spread padM w100">
                    <div>
                        <p><small><em>{new Date(drop.timestamp).toLocaleString()}</em></small></p>
                    </div>
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
        </dialog>
    )
}

DropViewer.propTypes = {
    drop: DropProp,
    close: PropTypes.func.isRequired
}