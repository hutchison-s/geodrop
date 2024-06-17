import { useGeoLoc } from "../contexts/GeoLocationContext"
import { useDrops } from "../contexts/DropContext";
import { useUser } from "../contexts/UserContext";
import NearDrop from "./NearDrop";
import FarDrop from "./FarDrop";

export default function MapDrops() {
    const {position} = useGeoLoc();
    const {profile} = useUser();
    const {drops} = useDrops();

    // from GPT
    const isClose = (dropLoc) => {
        const toRadians = (degree) => degree * (Math.PI / 180);
    
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(dropLoc.lat - position.lat);
        const dLng = toRadians(dropLoc.lng - position.lng);
        const lat1 = toRadians(position.lat);
        const lat2 = toRadians(dropLoc.lat);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c; // Distance in kilometers
    
        return distance < 0.035; // Check if distance is less than 30.5 meters (about 100 ft)
        // return distance < 5; // expanded for development to 5 km
    }

    return drops.map(drop => (isClose(drop.location) || drop.viewedBy.includes(profile._id)) ? <NearDrop key={drop._id} drop={drop}/> : <FarDrop key={drop._id} drop={drop} />)
}