import { Outlet } from "react-router-dom";
import NoLocation from "../components/NoLocation";
import { useGeoLoc } from "../contexts/GeoLocationContext";


// eslint-disable-next-line react/prop-types
export default function AwaitLocation() {
    const {position} = useGeoLoc();

    if (position.lat && position.lng) {
        return <Outlet/>
    }
    else {
        return <NoLocation />
    }
  }