import PropTypes from 'prop-types'
import { useEffect } from 'react';
import {useMap, useMapEvents} from 'react-leaflet'
import { useGeoLoc } from '../contexts/GeoLocationContext';
import { useState } from 'react';

export default function MapController({panTo, children, clearParams}) {
    const map = useMap();
    const {position} = useGeoLoc();
    const [isBrowsing, setIsBrowsing] = useState(panTo !== undefined)

    useEffect(()=>{
        if (panTo) {
            map.flyTo(panTo, 16)
        }
    }, [panTo, map])

    useMapEvents({
        dragstart: ()=>{
            setIsBrowsing(true)
        }
    })

    const findMe = ()=>{
        map.flyTo(position, 16);
        clearParams();
        setIsBrowsing(false)
    }

    return (
        <>
            {(panTo || isBrowsing) && <button className='findMeButton shadow3d' onClick={findMe}><i className="fa-solid fa-crosshairs"></i></button>}
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