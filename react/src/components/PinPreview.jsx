import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import PropTypes from 'prop-types'
import axios from "axios";

export default function PinPreview({pin}) {
    const {profile} = useUser();
    const [creator, setCreator] = useState(pin.creator);

    useEffect(()=>{
        axios.get(`http://localhost:5000/users/${pin.creator}`)
            .then(res => {
                if (res.status === 200) {
                    setCreator(res.data)
                }
            })
    }, [])

    return (
        pin && profile && <div className="pinPreviewBox">
            <h4>{pin.title}</h4>
            <p>{creator.displayName}</p>
            {profile._id && profile._id === pin.creator && pin.data}
        </div>
    )
}

PinPreview.propTypes = {
    pin: PropTypes.object.isRequired
}