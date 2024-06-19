import DropFeed from "../components/DropFeed";
import { useGeoLoc } from "../contexts/GeoLocationContext";
import { useDrops } from "../contexts/DropContext"
import { useUser } from "../contexts/UserContext";
import '../styles/feed.css'

export default function Feed() {
    const {drops} = useDrops();
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
    const filterProximity = (dropList) => {
        return dropList.filter(drop => (distanceToDrop(drop.location) < 26000) && !drop.viewedBy.includes(profile._id))
    }
    // Filter for drops beyond 5 miles by other users the profile follows
    const filterFollowing = (dropList) => {
        return dropList.filter(drop => (distanceToDrop(drop.location) >= 26000 && profile.following.includes(drop.creatorInfo._id)))
    }
    // Filter out drops the user created
    const filterMine = (dropList) => {
        return dropList.filter(drop => drop.creatorInfo._id !== profile._id);
    }

    // Sort the filtered list from nearest to farthest
    const sortByDistance = (dropList) => {
        return dropList.sort((a,b)=>distanceToDrop(a.location) - distanceToDrop(b.location))
    }
    return (
        <>
            
            <DropFeed drops={sortByDistance(filterProximity(filterMine(drops)))}>
                <div className="feedWelcome">
                    <h2>Welcome {profile.displayName}!</h2>
                    <p>Explore these new drops near you:</p>
                </div>
            </DropFeed>
            <DropFeed drops={sortByDistance(filterFollowing(drops))}>
                <p className="textCenter w100 padM colorFG">More distant drops by people you follow:</p>
            </DropFeed>
            </>
    )
}