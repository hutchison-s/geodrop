import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import dropIcon from "../assets/drop.png";

export default function AppFooter() {
  const { profile } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="w100 fixed flex">
      <div className="footerLeft flex">
        <div className="navOption">
          <Link to="/" className="flex1 padM">
            <i className="fa-solid fa-home"></i>
          </Link>
        </div>
        <div className="navOption">
          <Link to="/explore" className="flex1 padM">
            <i className="fa-solid fa-map"></i>
          </Link>
        </div>
      </div>
      <div className="footerRight flex">
        <div className="navOption">
          <Link to='/favorites' className="flex1 padM">
            <i className="fa-solid fa-heart"></i>
          </Link>
        </div>
        <div className="navOption">
          <Link to="/profile/me" className="profileLink circle">
            {profile.photo ? (
              <img src={profile.photo} alt="profile" />
            ) : (
              <i className="fa-solid fa-circle-user"></i>
            )}
          </Link>
        </div>
      </div>
      <button id="newPostButton" className="absolute" onClick={()=>navigate('/drop')}>
        <img src={dropIcon} alt="New Drop" width='50px'/>
      </button>
    </nav>
  );
}
