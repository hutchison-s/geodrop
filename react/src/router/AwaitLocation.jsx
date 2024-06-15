import { useGeoLoc } from "../contexts/GeoLocationContext";


// eslint-disable-next-line react/prop-types
export default function AwaitLocation({children}) {
    const {position} = useGeoLoc();
    if (position.lat && position.lng) {
        return children
    }
    else {
        return <div>Looking for you...</div>
    }
  }