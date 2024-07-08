import {string} from 'prop-types'


export default function VideoPlayer({url, title}) {

    return (
        <>

            <video controls autoPlay src={url} alt={title} width='80%' playsInline/>
        </>
    )
}

VideoPlayer.propTypes = {
    url: string.isRequired,
    title: string
}