import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

export default function ClickableProfileImage({id, photo, name}) {
    return (
        <>
            <Link to={`/profile/${id}`}>
                <img src={photo} alt={name} width='36px' className='circle'/>
            </Link>
        </>
    )
}

ClickableProfileImage.propTypes = {
    id: PropTypes.string,
    photo: PropTypes.string,
    name: PropTypes.string
}