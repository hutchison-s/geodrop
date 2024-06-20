import { useGeoLoc } from "../contexts/GeoLocationContext";
import { distanceToDrop } from "../functions/utilityFunctions";
import DropPreview from "./DropPreview";
import PropTypes from 'prop-types';

export default function DropFeed({drops, children}) {
    const {position} = useGeoLoc();

    return (
        <div className="dropFeed">
            {children}
            {drops.length > 0 
                ?   drops.map(drop => <DropPreview key={drop._id} drop={drop} distance={distanceToDrop(position, drop.location)}/>)
                :   <p className="textCenter colorFG">No new drops to display</p>}
        </div>
        
    )
}

DropFeed.propTypes = {
    drops: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
}