import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext"

/* eslint-disable react/prop-types */
export default function ProfileEditor({collect, cancel}) {
    const {profile} = useUser();
    const [currentPhoto, setCurrentPhoto] = useState(profile.photo)
    const [currentName, setCurrentName] = useState(profile.displayName)
    const [currentBio, setCurrentBio] = useState(profile.bio || '');
    const [hasChanges, setHasChanges] = useState(false)

    const handleNewPhoto = (e)=>{
        setCurrentPhoto(URL.createObjectURL(e.target.files[0]));
    }

    const evaluateChanges = ()=>{
        const hasNameChange = currentName !== profile.displayName;
        const hasBiochange = (profile.bio !== undefined && currentBio !== profile.bio) || (profile.bio === undefined && currentBio !== '')
        const hasPhotoChange = currentPhoto !== profile.photo
        setHasChanges(hasNameChange || hasBiochange || hasPhotoChange);
    }

    useEffect(()=>{
        evaluateChanges()
    }, [currentBio, currentName, currentPhoto])
    return (
            <form id='profileEditor' className="flex vertical center gapM padL" onSubmit={collect}>
                    <button
                        id="cancelEdit"
                        type="button"
                        onClick={cancel}
                        className="padM circle grid center colorFG bgNone"
                        >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    
                        <div className="flex center w100">
                            <label id="photoLabel">
                            <img src={currentPhoto} alt="Profile Photo" className='circle' width='100%'/>
                            <i className="fa-solid fa-pencil" style={{position: 'absolute', bottom: '0', right: '0'}}></i>
                            <input type="file" name="photo" accept="image/*" style={{display: 'none'}} onChange={handleNewPhoto} />
                    </label>
                        </div>
                        
                    <label className="w100 grid">
                        <small>Display Name</small>
                        <input type="text" name="name" value={currentName} pattern="^[\w\s]{3,24}$" onInput={(e)=>{setCurrentName(e.target.value); console.log(e.target.checkValidity());}} required/>
                    </label>
                    <label className="w100 grid">
                        <small>Bio</small>
                        <textarea name="bio" rows={5} defaultValue={profile.bio} onInput={(e)=>{setCurrentBio(e.target.value); }}></textarea>
                    </label>
                    {hasChanges ? <button type="submit" className="bigButton">Save Changes</button> : <button type="button" className='bigButton' onClick={cancel}>Cancel</button>}
                </form>
    )
}