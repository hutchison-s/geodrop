import PinPreview from "../components/PinPreview";
import { usePins } from "../contexts/PinContext"

export default function Feed() {
    const {pins} = usePins();
    return (

            pins.length > 0 && pins.map(p => <PinPreview key={p._id} pin={p} />)

    )
}