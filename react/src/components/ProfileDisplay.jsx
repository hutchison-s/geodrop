import PropTypes from 'prop-types'
import { useEffect } from 'react';
import axios from 'axios'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import dropIcon from '../assets/drop.png'
import FollowersFollowing from "../components/FollowersFollowing";
import DropFeed from "../components/DropFeed";
import { useUser } from '../contexts/UserContext';
import { useMode } from '../contexts/LightContext';
import { useDrops } from '../contexts/DropContext';
import { apiBaseURL } from '../apiSwitch';

export default function ProfileDisplay({profileId}) {

    const [viewing, setViewing] = useState();
    const {profile, setProfile} = useUser();
    const {mode} = useMode();
    const {drops} = useDrops();
    const navigate = useNavigate();

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
        if (profile.following.includes(viewing._id)) {
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

    const profileDrops = (allDrops)=>{
        return allDrops.filter(p => viewing.drops.includes(p._id)).sort((a,b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return (
        viewing && <>
            <section id='profileFrame' className={`grid ${mode === 'light' ? '' : 'darkMode'}`}>
            <h2 className="textCenter profileName">{viewing.displayName}</h2>
            <p className="textCenter profileTimestamp"><small><em>{profileDrops(drops).length > 0 ? `Last dropped on ${new Date(profileDrops(drops)[0].timestamp).toLocaleDateString()}` : 'No Drops Yet'}</em></small></p>
            <img src={viewing.photo} alt={`${viewing.displayName}`} className="circle shadowL" width='50%'/>
            {profile._id !== viewing._id 
                ? <button onClick={handleFollowToggle} className="shadow3d followButton">{profile.following.includes(viewing._id) ? 'Unfollow' : 'Follow'}</button>
                : <button className="borderNone bgNone profileEdit padM"><i className="fa-solid fa-pencil"></i> Edit Profile</button>
            }
            <div className="profileStats grid padM gapS">
                <div className="flex w100">
                    <div><img src={dropIcon} alt="drops" width='48px' /></div>
                    <div><i className="fa-regular fa-heart"></i></div>
                    <div><i className="fa-solid fa-eye"></i></div>
                </div>
                <div className="flex w100">
                    <div><span>{viewing.drops?.length}</span></div>
                    <div><span>{viewing.liked?.length}</span></div>
                    <div><span>{viewing.viewed?.length}</span></div>
                </div>
            </div>
            <FollowersFollowing user={viewing} key={viewing._id+'scroller'}/>
            <DropFeed drops={profileDrops(drops)}>
                <h3 className="textCenter padM profileFeedTitle">{viewing.displayName}&apos;s Recent Drops:</h3>
            </DropFeed>
        </section>
        </>
    )
}

ProfileDisplay.propTypes = {
    profileId: PropTypes.string.isRequired
}