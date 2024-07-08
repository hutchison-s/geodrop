import LikedDrop from "../components/LikedDrop";
import SEO from "../components/SEO";
import { useDrops } from "../contexts/DropContext"
import { useUser } from "../contexts/UserContext";

export default function Favorites() {
    const {drops} = useDrops();
    const {profile} = useUser();

    return (
        <>
            <SEO 
                title='Favorite GeoDrops'
                desc='Browse your favorite GeoDrops from other users.'
                canon='favorites'
            />
            <div className="dropFeed">
                <div className="feedWelcome">
                    <h2>Your Favorite Things</h2>
                </div>
                {drops.filter(d => d.likedBy.includes(profile._id)).sort((a,b)=>a.timestamp - b.timestamp).map(drop => <LikedDrop key={drop._id} drop={drop}/>)}
            </div>
        </>
    )
}