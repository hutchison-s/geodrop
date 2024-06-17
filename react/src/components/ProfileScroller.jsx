import PropTypes from 'prop-types'
import ClickableProfileImage from './ClickableProfileImage'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

export default function ProfileScroller({people}) {

    const [profiles, setProfiles] = useState([])

    

    useEffect(()=>{
        const getPeople = async ()=>{
            const promises = [];
            for (const id of people) {
                promises.push(axios.get(`http://localhost:5000/users/${id}`))
            }
            const profs = await Promise.all(promises);
            setProfiles(profs.map(p => p.data))
        }
        if (people.length > 0) {
            getPeople();
        }
        
    }, [])

    return (
        <>
            <div className="profileScroller w100">
                <div className="scroller">
                    {profiles && profiles.map(p => <ClickableProfileImage key={p._id} id={p._id} photo={p.photo} name={p.displayName}/>)}
                </div>
            </div>
        </>
    )
}
ProfileScroller.propTypes = {
    people: PropTypes.arrayOf(PropTypes.string).isRequired
}