
import { useState } from "react";
import DropSubmissionDialog from "./DropSubmissionDialog";


export default function NewTextDrop() {
    const [textContent, setTextContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)


    
    return (
        <>
            <div className="videoPreviewWrapper">
                <textarea className='w100 padM textDropInput' value={textContent} onInput={(e)=>{setTextContent(e.target.value)}} maxLength={1000} rows={18}></textarea>
                    <button 
                        onClick={()=>{setIsSubmitting(true)}}
                        id="shutter" 
                        className="grid center circle shadow3d borderNone mAuto">
                            <i className="fa-solid fa-pencil colorFG"></i>
                    </button>
            </div>
           {isSubmitting && <DropSubmissionDialog finish={()=>{setIsSubmitting(false)}} dropType='text' text={textContent}/>}
            
        </>
    )
}