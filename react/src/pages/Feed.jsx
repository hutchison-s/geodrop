import DropFeed from "../components/DropFeed";
import { useGeoLoc } from "../contexts/GeoLocationContext";
import { useDrops } from "../contexts/DropContext";
import { useUser } from "../contexts/UserContext";
import "../styles/feed.css";
import { distanceToDrop } from "../functions/utilityFunctions";
import { useEffect, useState } from "react";

export default function Feed() {
  const { drops } = useDrops();
  const { profile } = useUser();
  const { position } = useGeoLoc();
  const [dropsHere, setDropsHere] = useState(0)

  const isMine = (drop) => drop.creatorInfo._id === profile._id;
  const alreadyViewed = (drop) => drop.viewedBy.includes(profile._id);
  const isFollowing = (drop) =>
    profile.following.includes(drop.creatorInfo._id);
  const nearThresh = 5280 * 5; // 5 miles
  const hereThresh = 100; // 100 feet

  // Filters
  const here = (drop) =>
    distanceToDrop(position, drop.location) < hereThresh &&
    !alreadyViewed(drop);
  const nearby = (drop) =>
    distanceToDrop(position, drop.location) < nearThresh &&
    !alreadyViewed(drop);
  const following = (drop) =>
    distanceToDrop(position, drop.location) >= nearThresh && isFollowing(drop);
  const notMine = (drop) => !isMine(drop);

  // Sorts
  const distanceAscending = (a, b) =>
    distanceToDrop(position, a.location) - distanceToDrop(position, b.location);
  const recency = (a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

  const StillLoading = () => {
    return (
      <div className="dropFeed flex vertical gapM">
        <div className="dropPreviewFrame minH4 contentLoading"></div>
        <div className="dropPreviewFrame minH4 contentLoading"></div>
        <div className="dropPreviewFrame minH4 contentLoading"></div>
      </div>
    );
  };

  useEffect(()=>{
    const checkScroll = ()=>{
        console.log('checking scroll');
        // Get the elements by their IDs

        const container = document.getElementById('feedSelector');
        const hereFeed = document.getElementById('hereFeed');
        const nearbyFeed = document.getElementById('nearbyFeed');
        const followingFeed = document.getElementById('followingFeed');
        const highlighter = document.getElementById('highlighter');

        const pixelWidth = container.getBoundingClientRect().width
    
        // Function to check if element is within 100px of the top of the viewport
        function isWithinViewport(element) {
            const rect = element.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= 200;
        }

        let transformAmount;
        if (hereFeed) {
            if (isWithinViewport(hereFeed)) {
                transformAmount = 0;
            } else if (isWithinViewport(nearbyFeed)) {
                transformAmount = 0.33
            } else if (isWithinViewport(followingFeed)) {
                transformAmount = 0.66
            }
        } else {
            if (isWithinViewport(nearbyFeed)) {
                transformAmount = 0
            } else if (isWithinViewport(followingFeed)) {
                transformAmount = 0.50
            }
        }
        if (transformAmount !== undefined) {
            highlighter.style.transform = `translate(${transformAmount * pixelWidth}px)`
        }
        
    }
    document.querySelector('.contentWrap').addEventListener('scroll', checkScroll);

    return ()=>{document.querySelector('.contentWrap').removeEventListener('scroll', checkScroll)}
    
  })

  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      document.querySelector('.contentWrap').scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  useEffect(()=>{
    // eslint-disable-next-line no-unused-vars
    setDropsHere(dh => drops.filter(here).length)
  }, [drops, position, here])

  return drops ? (
    <>
      <div className="flex center fixed" id="feedSelector">
        <div id="highlighter" className="absolute" style={{width: dropsHere === 0 ? '50%' : '33%'}}></div>
        {dropsHere > 0 && <button className="bgNone borderNone flex1 grid center padM colorFG" onClick={(e)=>{handleAnchorClick(e, 'hereFeed')}}>Here</button>}
        <button className="bgNone borderNone flex1 grid center padM colorFG" onClick={(e)=>{handleAnchorClick(e, 'nearbyFeed')}}>Nearby</button>
        <button className="bgNone borderNone flex1 grid center padM colorFG" onClick={(e)=>{handleAnchorClick(e, 'followingFeed')}}>Following </button>
      </div>
      {dropsHere > 0 && (
        <DropFeed drops={drops.filter(here).sort(recency)}>
          <div className="feedWelcome" id="hereFeed">
            <h2>Welcome {profile.displayName}!</h2>
            <p>Check out these new drops within 100 feet of you!</p>
          </div>
        </DropFeed>
      )}
      <DropFeed
        drops={drops.filter(notMine).filter(nearby).sort(distanceAscending)}
      >
        <div className="feedWelcome" id="nearbyFeed">
          {
            (dropsHere === 0 && (
              <h2>Welcome {profile.displayName}!</h2>
            ))
          }
          <p>Explore these new drops near you:</p>
        </div>
      </DropFeed>
      <DropFeed drops={drops.filter(following).sort(distanceAscending)}>
        <p className="textCenter w100 padM colorFG" id="followingFeed">
          More distant drops by people you follow:
        </p>
      </DropFeed>
    </>
  ) : (
    <StillLoading />
  );
}
