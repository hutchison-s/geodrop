import { Link } from "react-router-dom";
import dropLogo from "../assets/logo.png";
import PropTypes from 'prop-types'

export default function AppHeader({toggleMenu, visible}) {

    

  return (
    <>
      <header id="appHeader" className="flex w100">
          <Link to="/" className="logoLink">
            <img src={dropLogo} alt="Drop Logo" width='120px'/>
            <h1 style={{display: 'none'}}>Drop</h1>
          </Link>
          <div id="headerRight" className="flex gapS">
            
            <button id="elipsis" className="padM bgNone borderNone" onClick={toggleMenu}>
              <i className={`fa-solid fa-ellipsis-vertical ${visible ? 'rotate90' : ''}`}></i>
            </button>
          </div>
      </header>
    </>
  );
}


AppHeader.propTypes = {
  visible: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
}