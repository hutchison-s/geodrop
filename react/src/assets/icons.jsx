import { Icon } from "leaflet";
import personIcon from '../assets/person.png';
import darkModePersonIcon from '../assets/person-darkmode.png';
import dropIcon from '../assets/drop.png'
import dropFarIcon from '../assets/drop-far.png'
import multidrop from '../assets/multidrop.png';
import multidropFar from '../assets/multidrop-far.png';
import ripple from '../assets/ripple.gif';

const youIconLightMode = new Icon({
    iconUrl: personIcon,
    iconSize: [25, 25]
});

const youIconDarkMode = new Icon({
    iconUrl: darkModePersonIcon,
    iconSize: [25, 25]
});

const nearDropIcon = new Icon({
    iconUrl: dropIcon,
    iconSize: [40,40]
})

const farDropIcon = new Icon({
    iconUrl: dropFarIcon,
    iconSize: [40,40]
})

const groupIcon = new Icon({
    iconUrl: multidrop,
    iconSize: [40,40]
})

const farGroupIcon = new Icon({
    iconUrl: multidropFar,
    iconSize: [40,40]
})

const rippleIcon = new Icon({
    iconUrl: ripple,
    iconSize: [80,80]
})

export const icons = {
    youLight: youIconLightMode,
    youDark: youIconDarkMode,
    drop: nearDropIcon,
    farDrop: farDropIcon,
    multidrop: groupIcon,
    farMultidrop: farGroupIcon,
    ripple: rippleIcon
}