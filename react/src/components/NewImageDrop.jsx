
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import DropSubmissionDialog from "./DropSubmissionDialog";


export default function NewImageDrop() {

    const canvasRef = useRef(null);
    const ctx = useRef(null)
    const videoRef = useRef(null);

    const [blob, setBlob] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const streamRef = useRef(null);

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

    const startStream = async (cameraId)=>{
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        streamRef.current = await navigator.mediaDevices.getUserMedia({video: {deviceId: cameraId ? {exact: cameraId} : undefined}});
        videoRef.current.srcObject = streamRef.current
        ctx.current = canvasRef.current.getContext("2d")
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

    const snapshot = ()=>{
        const {width, height} = videoRef.current.getBoundingClientRect();
        const rect = document.querySelector(".videoPreviewWrapper").getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        console.log(width, "x", height, "vs", w, "x", h);
    
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        ctx.current.fillRect(0,0,width,height);
        ctx.current.to
        ctx.current.drawImage(videoRef.current, 0, 0, width, height);
        canvasRef.current.toBlob(async (blob)=>{
            // eslint-disable-next-line no-unused-vars
            setBlob(b => blob);
            setIsSubmitting(true)
        })
        
    }

    

    

    return (
        <>
            <div className="videoPreviewWrapper">
                    <video id="newDropVideo" muted ref={videoRef} autoPlay playsInline></video>
                    <button 
                        onClick={snapshot}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            <i className="fa-solid fa-camera colorFG"></i>
                    </button>
                    <button id="flipCamera" className="borderNone padS circle grid center" onClick={switchCamera}><i className="fa-solid fa-camera-rotate"></i></button>
                    <canvas id="screenshotCanvas" ref={canvasRef}></canvas>
            </div>
           {isSubmitting && <DropSubmissionDialog finish={()=>{setIsSubmitting(false)}} dropType='image' file={blob} text=''/>}
            
        </>
    )
}