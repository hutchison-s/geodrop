import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

const initialLocation = {
    lat: 40,
    lng: 40
}

export const GeoLocationContext = createContext(initialLocation);

export default function GeoLocationProvider({children}) {

    const [position, setPosition] = useState({lat: null, lng: null});

    // from GPT
    const isSignificant = (coords) => {
        const toRadians = (degree) => degree * (Math.PI / 180);
    
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(coords.latitude - position.lat);
        const dLng = toRadians(coords.longitude - position.lng);
        const lat1 = toRadians(position.lat);
        const lat2 = toRadians(coords.latitude);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const distance = R * c; // Distance in kilometers
    
        return distance > 0.002; // Check if distance is greater than 2 meters
    }

    const foundLocation = (result)=>{
        const {latitude, longitude} = result.coords;
                
                if (!position.lat) {
                    // eslint-disable-next-line no-unused-vars
                    setPosition(p => {
                        return {
                            lat: latitude,
                            lng: longitude
                        }
                    })
                } else {
                    if (isSignificant(result.coords)) {
                        // eslint-disable-next-line no-unused-vars
                        setPosition(p => {
                            return {
                                lat: latitude,
                                lng: longitude
                            }
                        })
                    }
                }
                
                
    }
    const locationError = (error)=>{
        alert("Error occured: "+error.message)
    }

    useEffect(()=>{
        let tracker;
        if (navigator.geolocation) {
            tracker = navigator.geolocation.watchPosition(foundLocation, locationError, {enableHighAccuracy: true })
        }
        return ()=>{
            navigator.geolocation.clearWatch(tracker)
        }
    }, [])
    return (
        <>
            <GeoLocationContext.Provider value={{position}}>
                {children}
            </GeoLocationContext.Provider>
        </>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGeoLoc = ()=>useContext(GeoLocationContext);

GeoLocationProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
}