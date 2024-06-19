import '../styles/dropviewer.css'
import PropTypes from 'prop-types'
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

export default function DropContent({type, data, title}) {

        switch (type) {
            case 'text':
                return (
                    <div style={{maxHeight: '400px', overflowY: 'auto', margin: 'auto', width: '100%'}}>
                        <p>{data}</p>
                    </div>
                );
            case 'image':
                return (
                    <img src={data} alt={title} width='100%' style={{maxHeight: '50vh'}}/>
                );
            case 'video':
                return (
                    <VideoPlayer url={data} title={title}/>
                )
            case 'audio':
                return (
                    <AudioPlayer src={data} />
                )
            default:
                return (
                    <p>Cannot display this type yet</p>
                );
        }
}

DropContent.propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired, // Link to data or text content
    title: PropTypes.string.isRequired,

}