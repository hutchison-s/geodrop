
import { useEffect } from "react";
import { useRef } from "react"
import PropTypes from 'prop-types'


export default function NewImageDrop({collect, cancel}) {

    const canvasRef = useRef(null);
    const ctx = useRef(null)
    const videoRef = useRef(null);
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
        streamRef.current = await navigator.mediaDevices.getUserMedia({video: cameraId ? {deviceId: {exact: cameraId}} : true});
        videoRef.current.srcObject = streamRef.current
        ctx.current = canvasRef.current.getContext("2d")
    }

    const snapshot = ()=>{
        const {width, height} = videoRef.current.getBoundingClientRect();
        const rect = videoRef.current.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        console.log(width, "x", height, "vs", w, "x", h);
    
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        ctx.current.fillRect(0,0,width,height);
        ctx.current.to
        ctx.current.drawImage(videoRef.current, 0, 0, width, height);
        canvasRef.current.toBlob((blob)=>{
            collect({target: {files: [blob]}})
        })
        
    }

    

    return (
        <>
            <div className="videoCaptureFrame fullscreen flex vertical center">
                    <video id="newDropVideo" muted ref={videoRef} autoPlay playsInline className="w100"></video>
                    <button
                            id="cancelSubmission"
                            type="button"
                            onClick={cancel}
                            className="padM circle grid center colorFG bgNone"
                        >
                    <i className="fa-solid fa-xmark"></i>
                    </button>
                    <button 
                        onClick={snapshot}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            <i className="fa-solid fa-camera colorFG"></i>
                    </button>
                    <canvas id="screenshotCanvas" ref={canvasRef}></canvas>
            </div>
        </>
    )
}

NewImageDrop.propTypes = {
    collect: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
}