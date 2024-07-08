import {string} from 'prop-types';
import { useState } from 'react';
import { useRef } from 'react';

export default function ImageDisplay({url, title}) {

    const [isExpanded, setIsExpanded] = useState(false);
    const fullModal = useRef(null);

    const toggleFullScreen = (e)=>{
        e.stopPropagation();
        console.log("dbl");
        if (isExpanded) {
            fullModal.current.close()
            setIsExpanded(false)
        } else {
            fullModal.current.showModal();
            setIsExpanded(true)
        }
        

    }
    return (
        <>
            <img src={url} alt={title} width='80%' onClick={toggleFullScreen} />
            <dialog ref={fullModal} id='fullScreen' className='shadowWall'>
                <img src={url} alt={title} width='100%' onClick={toggleFullScreen} />
            </dialog>
        </>
    )
}

ImageDisplay.propTypes = {
    url: string.isRequired,
    title: string
}