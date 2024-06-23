import PropTypes from 'prop-types';
import NearDrop from './NearDrop'
import FarDrop from './FarDrop'
import { DropProp } from '../assets/customProps';
import { useUser } from '../contexts/UserContext';
import {useGeoLoc} from '../contexts/GeoLocationContext'
import { useEffect, useState } from 'react';
import {distanceToDrop} from '../functions/utilityFunctions.jsx'
import {icons} from '../assets/icons.jsx'
import L from 'leaflet';

export default function ProximityMarker({drop}) {
    const {profile} = useUser();
    const {position} = useGeoLoc();
    const [distance, setDistance] = useState(500);

    const myDrop = L.divIcon({
        html: `<div class='my-drop'><img src='${profile.photo}' alt='my drop' width='35px'/></div>`,
        iconSize: [40, 40]
    })

    useEffect(()=>{
        // eslint-disable-next-line no-unused-vars
        setDistance(d => distanceToDrop(position, drop.location))
    }, [position, drop])

    if (!distance || !drop) {
        return null;
    }
    if (drop.creatorInfo._id === profile._id) {
        return <NearDrop drop={drop} icon={myDrop} />
    } else if (drop.viewedBy.includes(profile._id)) {
        return <NearDrop drop={drop} icon={icons.drop} />
    } else if (distance <= 100) {
        return <NearDrop drop={drop} icon={icons.newDrop}/>
    } else {
        return <FarDrop drop={drop}/>
    }
}

ProximityMarker.propTypes = {
    drop: DropProp,
    distance: PropTypes.number
}