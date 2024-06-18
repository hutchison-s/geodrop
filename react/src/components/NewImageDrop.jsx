
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react"
import DropSubmissionDialog from "./DropSubmissionDialog";


export default function NewImageDrop() {

    const canvasRef = useRef(null);
    const ctx = useRef(null)
    const videoRef = useRef(null);

    const [blob, setBlob] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    
    

    useEffect(()=>{
        if (typeof(navigator.mediaDevices.getUserMedia) === 'function') {
            navigator.mediaDevices.getUserMedia({video: true, audio: false})
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    ctx.current = canvasRef.current.getContext("2d")
                })
        }
    }, [])

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
                    <video id="newDropVideo" muted ref={videoRef} width='100%' height='100%' autoPlay></video>
                    <button 
                        onClick={snapshot}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            <i className="fa-solid fa-camera colorFG"></i>
                    </button>
                    <canvas id="screenshotCanvas" ref={canvasRef}></canvas>
            </div>
           {isSubmitting && <DropSubmissionDialog finish={()=>{setIsSubmitting(false)}} dropType='image' file={blob} text=''/>}
            
        </>
    )
}