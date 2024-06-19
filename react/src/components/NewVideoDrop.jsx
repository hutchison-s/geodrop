
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import DropSubmissionDialog from "./DropSubmissionDialog";


export default function NewVideoDrop() {

    const videoRef = useRef(null);
    const recorderRef = useRef(null)
    const chunksRef = useRef([])
    const streamRef = useRef(null)

    const [blob, setBlob] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false)
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

    const switchCamera = ()=>{
        const currentDevice = videoRef.current.srcObject.getVideoTracks()[0].getSettings().deviceId

        navigator.mediaDevices.enumerateDevices()
            .then(devices => devices.filter(device => device.kind === 'videoinput'))
            .then(videoDevices => videoDevices.find(vid => vid.deviceId !== currentDevice))
            .then(newDevice => {
                console.log(newDevice);
                if (newDevice) {
                    startStream(newDevice)
                } else {
                    console.log("no other cameras");
                }
            })

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
            setBlob(videoBlob);
            setIsRecording(false);
            setIsSubmitting(true)
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
            <div className="videoPreviewWrapper">
                    <video id="newDropVideo" muted ref={videoRef} playsInline autoPlay></video>
                    <button id="flipCamera" className="borderNone padS circle grid center" onClick={switchCamera}><i className="fa-solid fa-camera-rotate"></i></button>
                    <button 
                        onClick={toggleRecording}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            {isRecording ? <i className="fa-solid fa-stop"></i> : <i className="fa-solid fa-video colorFG"></i>}
                    </button>
            </div>
           {isSubmitting && <DropSubmissionDialog finish={()=>{setIsSubmitting(false)}} dropType='video' file={blob} text=''/>}
            
        </>
    )
}