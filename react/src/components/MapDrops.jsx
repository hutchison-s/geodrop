import { useDrops } from "../contexts/DropContext";
import ProximityMarker from "./ProximityMarker";

export default function MapDrops() {
    const {drops} = useDrops();

    return drops.map(drop => <ProximityMarker key={drop._id} drop={drop} />)
}