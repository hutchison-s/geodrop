
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import DropSubmissionDialog from "./DropSubmissionDialog";


export default function NewVideoDrop() {

    const videoRef = useRef(null);
    const recorderRef = useRef(null)
    const chunksRef = useRef([])

    const [blob, setBlob] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRecording, setIsRecording] = useState(false)

    useEffect(()=>{
        if (typeof(navigator.mediaDevices.getUserMedia) === 'function') {
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then(stream => {
                    const recorder = new MediaRecorder(stream, {mimeType: 'video/mp4'});
                    recorder.onstart = ()=>{
                        chunksRef.current.length = 0;
                        setIsRecording(true)
                    }
                    recorder.ondataavailable = (e) => {
                        chunksRef.current.push(e.data)
                    }
                    recorder.onstop = ()=>{
                        const videoBlob = new Blob(chunksRef.current, {type: 'video/mp4'});
                        setBlob(videoBlob);
                        setIsRecording(false);
                        setIsSubmitting(true)
                    }
                    recorderRef.current = recorder;
                    videoRef.current.srcObject = stream;
                })
                .catch(err => {
                    console.error(err)
                })

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