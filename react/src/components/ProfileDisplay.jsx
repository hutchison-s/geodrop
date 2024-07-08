import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import dropIcon from '../assets/drop.png'
import FollowersFollowing from "../components/FollowersFollowing";
import DropFeed from "../components/DropFeed";
import { useUser } from '../contexts/UserContext';
import { useMode } from '../contexts/LightContext';
import { useDrops } from '../contexts/DropContext';
import { apiBaseURL } from '../apiSwitch';
import { readableTimeStamp } from '../functions/utilityFunctions';
import ProfileEditor from './ProfileEditor';
import { uploadFile } from '../config/firebase';

export default function ProfileDisplay({profileId}) {

    const [viewing, setViewing] = useState();
    const {profile, setProfile} = useUser();
    const {isDark} = useMode();
    const {drops} = useDrops();
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate();

    const isFollowing = viewing && profile.following.includes(viewing._id)

    useEffect(()=>{
        const getProfile = async () => {
            const content = await axios.get(`${apiBaseURL}/users/${profileId}`);
            if (content.status === 200) {
                console.log(content.data);
                setViewing(content.data);
            } else {
                navigate('/404');
            }
        }

        getProfile();

    }, [profileId])


    const handleFollowToggle = ()=>{
        if (isFollowing) {
            unfollow()
        } else {
            follow()
        }
    }

    const follow = async ()=>{
        axios.post(`${apiBaseURL}/users/${viewing._id}/follow/${profile._id}`)
                .then(() => {
                    setProfile(p => {
                        return {
                            ...p,
                            following: [...p.following, viewing._id]
                        }
                    });
                    setViewing(v => {
                        return {
                            ...v,
                            followers: [...v.followers, profile._id]
                        }
                    })
                }).catch(err => console.log(err))
    }

    const unfollow = async ()=>{
        axios.delete(`${apiBaseURL}/users/${viewing._id}/follow/${profile._id}`)
                .then(() => {
                    
                    setProfile(p => {
                        const idx = p.following.indexOf(viewing._id);
                        const prefix = p.following.slice(0,idx);
                        const suffix = p.following.slice(idx+1);
                        return {
                            ...p,
                            following: [...prefix, ...suffix]
                        }
                    })
                    setViewing(v => {
                        const idx = v.following.indexOf(profile._id);
                        const prefix = v.following.slice(0,idx);
                        const suffix = v.following.slice(idx+1);
                        return {
                            ...v,
                            followers: [...prefix, ...suffix]
                        }
                    })
                }).catch(err => console.log(err))
        
    }

    const handleProfileEdit = async (e)=>{
        e.preventDefault();
        const {name, bio, photo} = e.target;
        let photoURL = profile.photo;
        if (photo.files.length > 0) {
            const {url} = await uploadFile(photo.files[0]);
            photoURL = url;
        }
        const update = {
            displayName: name.value,
            bio: bio.value,
            photo: photoURL
        };
        axios.patch(`${apiBaseURL}/users/${profile._id}`, update)
            .then(res => {
                if (res.status === 200) {
                    setProfile(p => {
                        return {
                            ...p,
                            photo: res.data.photo,
                            bio: res.data.bio,
                            displayName: res.data.displayName
                        }
                    });
                    navigate('/profile/me')
                }
            })
            .catch(err => {
                console.log(err);
                setIsEditing(false)
            })
    }

    // Filter
    const isMine = drop => viewing.drops.includes(drop._id)
    // Sort
    const timeDescending = (a,b)=>(new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const profileDrops = (allDrops)=>{
        return allDrops.filter(isMine).sort(timeDescending);
    }

    const StillLoading = ()=>{
        return <>
            <h2 className="textCenter profileName minH2 contentLoading"></h2>
            <p className="textCenter profileTimestamp minH2 contentLoading"></p>
            <div className="circle mAuto contentLoading" style={{width: '50%', aspectRatio: '1'}}></div>
            <div className="profileStats grid padM gapS">
                <div className="flex w100">
                <div>
                    <img src={dropIcon} alt="drops" width='48px' /></div>
                    <div><i className="fa-regular fa-heart"></i></div>
                    <div><i className="fa-solid fa-eye"></i></div>
                </div>
                <div className="flex w100">
                    <div className="contentLoading"></div>
                    <div className="contentLoading"></div>
                    <div className="contentLoading"></div>
                </div>
            </div>
            <div className="w100 contentLoading" style={{height: '3rem'}}></div>
            <div className="dropFeed flex vertical gapM">
                <div className="dropPreviewFrame minH4 contentLoading"></div>
                <div className="dropPreviewFrame minH4 contentLoading"></div>
                <div className="dropPreviewFrame minH4 contentLoading"></div>
            </div>
        </>
    }

    return (
        viewing ? <>
            {profile._id === viewing._id && isEditing && <ProfileEditor cancel={()=>{setIsEditing(false)}} collect={handleProfileEdit} />}
            <section id='profileFrame' className={`grid ${isDark ? 'darkMode' : ''}`}>
            
            <h2 className="textCenter profileName">{viewing.displayName}</h2>
            <p className="textCenter profileTimestamp"><small><em>{profileDrops(drops).length > 0 ? `Last dropped on ${readableTimeStamp(profileDrops(drops)[0].timestamp)}` : 'No Drops Yet'}</em></small></p>
            <img src={viewing.photo} alt={`${viewing.displayName}`} className="circle shadowL" width='50%' />
            {viewing.bio && <p className='textCenter colorFG padM'>{viewing.bio}</p>}
            {profile._id !== viewing._id 
                ? <button onClick={handleFollowToggle} className="shadow3d followButton">{isFollowing ? 'Unfollow' : 'Follow'}</button>
                : <button className="borderNone bgNone profileEdit padM" onClick={()=>{setIsEditing(true)}}><i className="fa-solid fa-pencil"></i> Edit Profile</button>
            }
            <div className="profileStats grid padM gapS">
                <div className="flex w100">
                    <div><img src={dropIcon} alt="drops" width='48px' /></div>
                    <div><i className="fa-regular fa-heart"></i></div>
                    <div><i className="fa-solid fa-eye"></i></div>
                </div>
                <div className="flex w100">
                    <div><span key={"drops"+viewing.drops.length}>{viewing.drops.length}</span></div>
                    <div><span key={"liked"+viewing.liked.length}>{viewing.liked.length}</span></div>
                    <div><span key={"viewed"+viewing.viewed.length}>{viewing.viewed.length}</span></div>
                </div>
            </div>
            <FollowersFollowing user={viewing} key={viewing._id+'scroller'}/>
            <DropFeed drops={profileDrops(drops)}>
                <h3 className="textCenter padM profileFeedTitle">{viewing.displayName}&apos;s Recent Drops:</h3>
            </DropFeed>
        </section>
        </>
        : <StillLoading />
    )
}

ProfileDisplay.propTypes = {
    profileId: PropTypes.string.isRequired
}