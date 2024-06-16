import DropPreview from "../components/DropPreview";
import { useGeoLoc } from "../contexts/GeoLocationContext";
import { usePins } from "../contexts/PinContext"
import { useUser } from "../contexts/UserContext";
import '../styles/feed.css'

export default function Feed() {
    const {pins} = usePins();
    const {profile} = useUser(); 
    const {position} = useGeoLoc();

    // from GPT
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

    // Filter for drops by connections and drops within 5 miles
    const filterFeed = (dropList) => {
        return dropList.filter(drop => distanceToDrop(drop.location) < 26000 || profile.connections.includes(drop.creator))
    }

    // Sort the filtered list from nearest to farthest
    const sortByDistance = (dropList) => {
        return dropList.sort((a,b)=>distanceToDrop(a.location) - distanceToDrop(b.location))
    }
    return (
        <div className="dropFeed">
            <div className="feedWelcome">
                <h2>Welcome {profile.displayName}!</h2>
                <p>Explore these new drops near you:</p>
            </div>
            {pins.length > 0 && sortByDistance(filterFeed(pins)).map(p => <DropPreview key={p._id} drop={p} distance={distanceToDrop(p.location)} following={profile.connections.includes(p.creator)}/>)}
        </div>
    )
}