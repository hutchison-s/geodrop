import PropTypes from 'prop-types';
import { DropProp } from '../assets/customProps';
// import LikedDrop from '../components/LikedDrop'
import LocalDrop from './LocalDrop';

export default function HereSwiper({drops}) {
    return (
        <>
            <section className="w100 dropScrollFrame">
                <div className="flex gapS h100 dropScrollCar">
                    {drops.map(drop=><LocalDrop drop={drop} key={drop._id}/>)}
                </div>
            </section>
        </>
    )
}
HereSwiper.propTypes = {
    drops: PropTypes.arrayOf(DropProp)
}