import { useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext"

import '../styles/profile.css'

import PropTypes from 'prop-types'
import ProfileDisplay from "../components/ProfileDisplay";

export default function Profile({isMine}) {
    const {profile} = useUser();
    const {id} = useParams();

    return (
        <ProfileDisplay profileId={isMine ? profile._id : id} />
    )
}

Profile.propTypes = {
    isMine: PropTypes.bool
}