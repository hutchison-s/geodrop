import { Icon } from "leaflet";
import personIcon from '../assets/person.png';
import darkModePersonIcon from '../assets/person-darkmode.png';
import dropIcon from '../assets/drop.png'
import dropFarIcon from '../assets/drop-far.png'
import multidrop from '../assets/multidrop.png';
import multidropDark from '../assets/multidrop-dark.png';

const youIconLightMode = new Icon({
    iconUrl: personIcon,
    iconSize: [25, 25],
    className: 'you-icon'
});

const youIconDarkMode = new Icon({
    iconUrl: darkModePersonIcon,
    iconSize: [25, 25],
    className: 'you-icon'
});

const nearDropIcon = new Icon({
    iconUrl: dropIcon,
    iconSize: [40,40],
    className: 'near-drop-icon'
})

const newNearDropIcon = new Icon({
    iconUrl: dropIcon,
    iconSize: [40,40],
    className: 'near-drop-icon undiscovered'
})

const farDropIcon = new Icon({
    iconUrl: dropFarIcon,
    iconSize: [40,40],
    className: 'far-drop-icon'
})

const groupIcon = new Icon({
    iconUrl: multidrop,
    iconSize: [40,40],
    className: 'custom-marker-cluster'
})

const groupIconDarkMode = new Icon({
    iconUrl: multidropDark,
    iconSize: [40,40]
})

export const icons = {
    youLight: youIconLightMode,
    youDark: youIconDarkMode,
    drop: nearDropIcon,
    newDrop: newNearDropIcon,
    farDrop: farDropIcon,
    multidrop: groupIcon,
    multidropDark: groupIconDarkMode,
}