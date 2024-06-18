import { MapContainer, Marker, TileLayer} from 'react-leaflet';
import {useSearchParams} from 'react-router-dom'
import {useGeoLoc} from '../contexts/GeoLocationContext.jsx'
import '../styles/map.css'
import 'leaflet/dist/leaflet.css';
import { useMode } from '../contexts/LightContext.jsx';
import MapDrops from '../components/MapDrops.jsx';
import { icons } from '../assets/icons.jsx';
import MapController from '../components/MapController.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { Popup } from 'react-leaflet';


export default function MapComponent() {
    const {position} = useGeoLoc();
    const {mode} = useMode();
    const [params, setParams] = useSearchParams();
    const [destination, setDestination] = useState(undefined);

    useEffect(()=>{
        console.log(params);
        if (params.has('lat') && params.has('lng')) {
            setDestination(d => {
                return {
                    ...d,
                    lat: parseFloat(params.get('lat')),
                    lng: parseFloat(params.get('lng'))
                }
            })
        }
    }, [])

    const clearParams = ()=>{
        setParams('');
        setDestination(undefined)
    }

    return (
        <>
            <p id='tempPositionMarker'>Position: {position?.lat?.toFixed(3)}, {position?.lng?.toFixed(3)}</p>
            <MapContainer center={position} zoom={16}>
                <MapController panTo={destination} clearParams={clearParams}>
                    <TileLayer
                        url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${mode}_all/{z}/{x}/{y}.png`}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    />
                    <Marker icon={mode === 'light' ? icons.youLight : icons.youDark} position={position}>
                        <Popup>
                            <p>Latitude: {position.lat}</p>
                            <p>Longitude: {position.lng}</p>
                        </Popup>
                        </Marker>
                    <MapDrops />
                </MapController>
            </MapContainer>
        </>
    )
}

