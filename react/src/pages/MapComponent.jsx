import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import {useGeoLoc} from '../contexts/GeoLocationContext.jsx'
import '../styles/map.css'
import 'leaflet/dist/leaflet.css';
import { useMode } from '../contexts/LightContext.jsx';
import MapPins from '../components/MapPins.jsx';
import { pinIcons } from '../assets/pinIcons.jsx';

export default function MapComponent() {
    const {position} = useGeoLoc();
    const {mode} = useMode();

    return (
        <>
            <p id='tempPositionMarker'>Position: {position?.lat?.toFixed(3)}, {position?.lng?.toFixed(3)}</p>
            <MapContainer center={position} zoom={16}>
                <TileLayer
                    url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${mode}_all/{z}/{x}/{y}.png`}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                />
                <Marker icon={mode === 'light' ? pinIcons.youLight : pinIcons.youDark} position={position}/>
                <MapPins />
            </MapContainer>
        </>
    )
}