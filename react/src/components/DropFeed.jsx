import { useGeoLoc } from "../contexts/GeoLocationContext";
import { useUser } from "../contexts/UserContext"
import DropPreview from "./DropPreview";
import PropTypes from 'prop-types';

export default function DropFeed({drops, children}) {
    const {profile} = useUser();
    const {position} = useGeoLoc();


    const distanceToDrop = (dropLocation) => {
        const toRadians = (degree) => degree * (Math.PI / 180);
        const R = 6371;

        const dLat = toRadians(dropLocation.lat - position.lat);
        const dLng = toRadians(dropLocation.lng - position.lng);
        const lat1 = toRadians(position.lat);
        const lat2 = toRadians(dropLocation.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = (R * c) * 3280.8398950131; // Distance in feet

        return distance 
    }

    return (
        <div className="dropFeed">
            {children}
            {drops.length > 0 
                ?   drops.map(drop => <DropPreview key={drop._id} drop={drop} distance={distanceToDrop(drop.location)} following={profile.following.includes(drop.creator)}/>)
                :   <p className="textCenter colorFG">No new drops to display</p>}
        </div>
        
    )
}

DropFeed.propTypes = {
    drops: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
}