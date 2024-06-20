import DropFeed from "../components/DropFeed";
import { useGeoLoc } from "../contexts/GeoLocationContext";
import { useDrops } from "../contexts/DropContext"
import { useUser } from "../contexts/UserContext";
import '../styles/feed.css'
import { distanceToDrop } from "../functions/utilityFunctions";

export default function Feed() {
    const {drops} = useDrops();
    const {profile} = useUser(); 
    const {position} = useGeoLoc();

    const isMine = (drop)=> drop.creatorInfo._id === profile._id;
    const alreadyViewed = (drop) => drop.viewedBy.includes(profile._id);
    const isFollowing = (drop) => profile.following.includes(drop.creatorInfo._id);
    const threshold = 5280 * 5 // 5 miles

    // Filters
    const proximity = (drop) => ((distanceToDrop(position, drop.location) < threshold) && !alreadyViewed(drop))
    const following = (drop) => ((distanceToDrop(position, drop.location) >= threshold) && isFollowing(drop))
    const notMine = drop => !isMine(drop);
    
    // Sorts
    const distanceAscending = (a,b)=>distanceToDrop(position, a.location) - distanceToDrop(position, b.location)

    const StillLoading = ()=>{
       return  <div className="dropFeed flex vertical gapM">
                <div className="dropPreviewFrame minH4 contentLoading"></div>
                <div className="dropPreviewFrame minH4 contentLoading"></div>
                <div className="dropPreviewFrame minH4 contentLoading"></div>
            </div>
    }


    return (
        drops ? <>
            
            {/* <DropFeed drops={sortByDistance(filterProximity(filterMine(drops)))}> */}
            <DropFeed drops={drops.filter(notMine).filter(proximity).sort(distanceAscending)}>
                <div className="feedWelcome">
                    <h2>Welcome {profile.displayName}!</h2>
                    <p>Explore these new drops near you:</p>
                </div>
            </DropFeed>
            {/* <DropFeed drops={sortByDistance(filterFollowing(drops))}> */}
            <DropFeed drops={drops.filter(following).sort(distanceAscending)}>
                <p className="textCenter w100 padM colorFG">More distant drops by people you follow:</p>
            </DropFeed>
            </>
        : <StillLoading />
    )
}