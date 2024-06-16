import LikedDrop from "../components/LikedDrop";
import { usePins } from "../contexts/PinContext"
import { useUser } from "../contexts/UserContext";

export default function Favorites() {
    const {pins} = usePins();
    const {profile} = useUser();

    return (
        <>
            <div className="dropFeed">
                <div className="feedWelcome">
                    <h2>Your Favorite Things</h2>
                </div>
                {pins.filter(p => p.likedBy.includes(profile._id)).sort((a,b)=>a.timestamp - b.timestamp).map(drop => <LikedDrop key={drop._id} drop={drop}/>)}
            </div>
        </>
    )
}