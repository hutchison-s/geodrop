import PropTypes from "prop-types";
import { useState } from "react";
import ProfileScroller from "./ProfileScroller";

export default function FollowersFollowing({ user }) {
  const [isFollowingChosen, setIsFollowingChosen] = useState(true);

  return (
    <>
      <div className="flex w100 padS followingFrame">
        <button
          onClick={() => {
            setIsFollowingChosen(true);
          }}
          className="flex1 padS bgNone borderNone"
          style={
            isFollowingChosen ? { borderBottom: "2px solid var(--fg)" } : {}
          }
        >
          {user.following.length} Following
        </button>
        <button
          onClick={() => {
            setIsFollowingChosen(false);
          }}
          className="flex1 padS bgNone borderNone"
          style={
            !isFollowingChosen ? { borderBottom: "2px solid var(--fg)" } : {}
          }
        >
          {user.followers.length} Followers
        </button>
      </div>
      {isFollowingChosen ? <ProfileScroller key={'following'+user.following.length}
        people={user.following}
      /> : <ProfileScroller people={user.followers} key={'followers'+user.followers.length}/>}
    </>
  );
}
FollowersFollowing.propTypes = {
    user: PropTypes.object.isRequired
};
