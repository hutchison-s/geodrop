import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { distanceInFeet } from "../functions/utilityFunctions";

const initialLocation = {
    lat: 40,
    lng: 40
}

export const GeoLocationContext = createContext(initialLocation);

export default function GeoLocationProvider({children}) {

    const [position, setPosition] = useState({lat: null, lng: null});
    const [isTracking, setIsTracking] = useState(true);

    const isSignificant = (coords) => {
        const newPosition = {lat: coords.latitude, lng: coords.longitude};
        return distanceInFeet(position, newPosition) > 10 // Check if location update is farther than 10 feet away (debounce)
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
                    if (isSignificant(result.coords) && isTracking) {
                        // eslint-disable-next-line no-unused-vars
                        setPosition(p => {
                            return {
                                lat: latitude,
                                lng: longitude
                            }
                        })
                    } else {
                        console.log('skipped position update because it was less than 10 feet difference');
                    }
                }
                
                
    }
    const locationError = (error)=>{
        console.log(error.message);
        alert("Location must be shared in order to use this website. Please check your device and browser settings and allow sharing location with GeoDrop.xyz" )
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
            <GeoLocationContext.Provider value={{position, isTracking, setIsTracking}}>
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