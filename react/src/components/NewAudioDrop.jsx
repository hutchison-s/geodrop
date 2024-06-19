
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import DropSubmissionDialog from "./DropSubmissionDialog";


export default function NewAudioDrop() {

    const recorderRef = useRef(null)
    const chunksRef = useRef([])

    const [blob, setBlob] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false)
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
                        setBlob(audioBlob);
                        setIsRecording(false);
                        setIsSubmitting(true)
                        stream.getTracks().forEach(track => track.stop());
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
                    <button 
                        onClick={toggleRecording}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            {isRecording ? <i className="fa-solid fa-stop recordingInProgress"></i> : <i className="fa-solid fa-microphone colorFG"></i>}
                    </button>
            </div>
           {isSubmitting && <DropSubmissionDialog finish={()=>{setIsSubmitting(false); setBlob(undefined); initializeRecorder()}} dropType='audio' file={blob} text=''/>}
            
        </>
    )
}