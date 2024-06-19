import {string} from 'prop-types'


export default function VideoPlayer({url, title}) {

    return (
        <>

            <video controls autoPlay src={url} alt={title} width='100%' style={{maxHeight: '50vh'}}/>
        </>
    )
}

VideoPlayer.propTypes = {
    url: string.isRequired,
    title: string
}