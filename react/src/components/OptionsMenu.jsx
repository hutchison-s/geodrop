import { useMode } from "../contexts/LightContext";
import { useUser } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

export default function OptionsMenu({visible, close}) {
    const {logout} = useUser();
    const {mode, switchMode} = useMode();
    const navigate = useNavigate();

    const nextMode = mode === 'light' ? "Dark" : "Light";

    return (
        <ul id="optionsMenu" className={`flex vertical fixed ${visible ? 'visible' : ''}`}>
            
            <li><button onClick={logout}>Log Out</button></li>
            <li><button onClick={navigate('/about')}>About GeoDrop</button></li>
            <li><button onClick={()=>{
                switchMode();
                close();
            }}>Switch to {nextMode} Mode</button></li>
            <li ><button className="comingSoon">Boost Range</button></li>
        </ul>
    )
}

OptionsMenu.propTypes = {
    visible: PropTypes.bool,
    close: PropTypes.func
}