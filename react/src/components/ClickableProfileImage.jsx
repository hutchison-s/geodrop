import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

export default function ClickableProfileImage({creator}) {
    return (
        <>
            <Link to={`/profile/${creator._id}`} style={{display: 'grid', placeItems: 'center'}}>
                <img src={creator.photo} alt={creator.displayName} width='36px' className='circle'/>
            </Link>
        </>
    )
}

ClickableProfileImage.propTypes = {
    creator: PropTypes.shape({
        _id: PropTypes.string,
        photo: PropTypes.string,
        displayName: PropTypes.string
    }).isRequired
    
}