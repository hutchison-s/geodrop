import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {useGeoLoc} from '../contexts/GeoLocationContext.jsx'
import '../styles/map.css'
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import personIcon from '../assets/person.png';
import darkModePersonIcon from '../assets/person-darkmode.png';
import dropIcon from '../assets/drop.png'
import dropFarIcon from '../assets/drop-far.png'
// import multidrop from '../assets/multidrop.png';
// import multidropFar from '../assets/multidrop-far.png';
import { useMode } from '../contexts/LightContext.jsx';
import { usePins } from '../contexts/PinContext.jsx';

export default function MapComponent() {
    const {position} = useGeoLoc();
    const {mode} = useMode();
    const {pins} = usePins();

    const youIcon = new Icon({
        iconUrl: mode === 'light' ? personIcon : darkModePersonIcon,
        iconSize: [25, 25]
    });

    const pinIcon = new Icon({
        iconUrl: dropIcon,
        iconSize: [40,40]
    })

    const farPinIcon = new Icon({
        iconUrl: dropFarIcon,
        iconSize: [40,40]
    })

    // const groupIcon = new Icon({
    //     iconUrl: multidrop,
    //     iconSize: [40,40]
    // })

    // const farGroupIcon = new Icon({
    //     iconUrl: multidropFar,
    //     iconSize: [40,40]
    // })

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
    
        return distance < 0.035; // Check if distance is less than 30.5 meters (about 100 ft)
    }

    return (
        <>
            <p id='tempPositionMarker'>Position: {position?.lat?.toFixed(3)}, {position?.lng?.toFixed(3)}</p>
            <MapContainer center={position} zoom={16}>
                <TileLayer
                    url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${mode}_all/{z}/{x}/{y}.png`}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                />
                <Marker icon={youIcon} position={position}/>
                {pins.map(p => 
                    (<Marker key={p._id} icon={isClose(p.location) ? pinIcon : farPinIcon} position={p.location}>
                        <Popup>
                            {p.title}
                        </Popup>
                    </Marker>)
                )}
            </MapContainer>
        </>
    )
}