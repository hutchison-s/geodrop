
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import PropTypes from 'prop-types'


export default function NewAudioDrop({collect, cancel}) {

    const recorderRef = useRef(null)
    const chunksRef = useRef([])


    const [isRecording, setIsRecording] = useState(false)

    const acceptedFormat = ()=>{
        const useWebM = MediaRecorder.isTypeSupported('audio/webm');
        return useWebM ? 'audio/webm' : 'audio/mp4'
    }

    const initializeRecorder = ()=>{
        navigator.mediaDevices.getUserMedia({audio: true})
                .then(stream => {
                    const recorder = new MediaRecorder(stream, {mimeType: acceptedFormat()});
                    recorderRef.current = recorder;
                    recorder.onstart = ()=>{
                        chunksRef.current.length = 0;
                        setIsRecording(true)
                    }
                    recorder.ondataavailable = (e) => {
                        chunksRef.current.push(e.data)
                    }
                    recorder.onstop = ()=>{
                        const audioBlob = new Blob(chunksRef.current, {type: acceptedFormat()});
                        stream.getTracks().forEach(track => track.stop());
                        collect(audioBlob)
                        
                    }
                    
                })
                .catch(err => {
                    console.error(err)
                })
    }

    useEffect(()=>{
        if (typeof(navigator.mediaDevices.getUserMedia) === 'function') {
            initializeRecorder();
        }
    }, [])

    const toggleRecording = (e)=>{
        e.stopPropagation();
        if (isRecording) {
            recorderRef.current.stop()
        } else {
            recorderRef.current.start()
            
        } 
    }

    return (
        <>
             <div id="audioCapture" className='fullscreen' onClick={cancel}>
                <button 
                        onClick={toggleRecording}
                        id="recordButton" 
                        className="grid center circle shadow3d borderNone recordButton">
                            {isRecording ? <i className="fa-solid fa-stop recordingInProgress"></i> : <i className="fa-solid fa-microphone colorFG"></i>}
                    </button></div>  
            
        </>
    )
}

NewAudioDrop.propTypes = {
    collect: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
}