
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import PropTypes from 'prop-types'


export default function NewVideoDrop({collect, cancel}) {

    const videoRef = useRef(null);
    const recorderRef = useRef(null)
    const chunksRef = useRef([])
    const streamRef = useRef(null)
    const [isRecording, setIsRecording] = useState(false)

    const acceptedFormat = ()=>{
        const useWebM = MediaRecorder.isTypeSupported('video/webm');
        return useWebM ? 'video/webm' : 'video/mp4'
    }

    const startStream = async (cameraId)=>{
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        streamRef.current = await navigator.mediaDevices.getUserMedia({video: {deviceId: cameraId ? {exact: cameraId} : undefined}, audio: true});
        initializeRecorder(streamRef.current)
        videoRef.current.srcObject = streamRef.current
    }


    const initializeRecorder = (stream)=>{
        const options = { mimeType: acceptedFormat() };
        const recorder = new MediaRecorder(stream, options);
        recorder.onstart = ()=>{
            chunksRef.current.length = 0;
            setIsRecording(true)
        }
        recorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data)
        }
        recorder.onstop = ()=>{
            const videoBlob = new Blob(chunksRef.current, {type: acceptedFormat()});
            collect({target: {files: [videoBlob]}})
        }
        recorderRef.current = recorder;
    }

    useEffect(()=>{
        if (typeof(navigator.mediaDevices.getUserMedia) === 'function') {
            startStream();

                return ()=>{
                    if (videoRef.current && videoRef.current.srcObject) {
                        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                    }
                };
        }
    }, [])

    const toggleRecording = ()=>{
        if (isRecording) {
            recorderRef.current.stop()
        } else {
            recorderRef.current.start()
            
        } 
    }

    return (
        <>
            <div className="videoPreviewWrapper fullscreen flex vertical center">
                    <video id="newDropVideo" muted ref={videoRef} playsInline autoPlay className="w100"></video>
                    <button
                            id="cancelSubmission"
                            type="button"
                            onClick={cancel}
                            className="padM circle grid center colorFG bgNone"
                        >
                    <i className="fa-solid fa-xmark"></i>
                    </button>
                    <button 
                        onClick={toggleRecording}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            {isRecording ? <i className="fa-solid fa-stop"></i> : <i className="fa-solid fa-video colorFG"></i>}
                    </button>
            </div>
            
        </>
    )
}

NewVideoDrop.propTypes = {
    collect: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
}