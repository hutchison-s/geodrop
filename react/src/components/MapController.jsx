import PropTypes from 'prop-types'
import { useEffect } from 'react';
import {useMap, useMapEvents} from 'react-leaflet'
import { useGeoLoc } from '../contexts/GeoLocationContext';

export default function MapController({panTo, children, clearParams}) {
    const map = useMap();
    const {position, isTracking, setIsTracking} = useGeoLoc();

    useEffect(()=>{
        if (panTo) {
            // eslint-disable-next-line no-unused-vars
            setIsTracking(t => false)
            map.flyTo(panTo, 16)
        }
    }, [panTo, map, setIsTracking])

    useEffect(()=>{
        if (isTracking) {
            map.panTo(position, {duration: 0.1, animate: true})
        }
    }, [position, isTracking, map])

    useMapEvents({
        dragstart: ()=>{
            setIsTracking(false)
        },
        popupopen: ()=>{
            setIsTracking(false)
        }
    })

    const findMe = ()=>{
        map.flyTo(position, 16);
        clearParams();
        setIsTracking(true)
    }

    return (
        <>
            {(!isTracking) && <button className='findMeButton shadow3d' onClick={findMe}><i className="fa-solid fa-location-crosshairs"></i></button>}
            {children}
        </>
    )
}
MapController.propTypes = {
    panTo: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
    }),
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
    clearParams: PropTypes.func
}