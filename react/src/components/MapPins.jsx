import { useGeoLoc } from "../contexts/GeoLocationContext"
import { usePins } from "../contexts/PinContext";
import { useUser } from "../contexts/UserContext";
import NearPin from "./NearPin";
import FarPin from "./FarPin";

export default function MapPins() {
    const {position} = useGeoLoc();
    const {profile} = useUser();
    const {pins} = usePins();

    // from GPT
    const isClose = (pinLoc) => {
        const toRadians = (degree) => degree * (Math.PI / 180);
    
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(pinLoc.lat - position.lat);
        const dLng = toRadians(pinLoc.lng - position.lng);
        const lat1 = toRadians(position.lat);
        const lat2 = toRadians(pinLoc.lat);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c; // Distance in kilometers
    
        // return distance < 0.035; // Check if distance is less than 30.5 meters (about 100 ft)
        return distance < 5; // expanded for development to 5 km
    }

    return pins.map(p => (isClose(p.location) || profile.viewed.includes(p._id)) ? <NearPin key={p._id} pin={p}/> : <FarPin key={p._id} pin={p} />)
}