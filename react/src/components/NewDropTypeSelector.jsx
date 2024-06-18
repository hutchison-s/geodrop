import { useRef } from "react";
import PropTypes from 'prop-types'

export default function NewDropTypeSelector({state, setState}) {
  
  const highligherRef = useRef(null);

  const getElementIndex = (el)=>{
    return Array.from(el.parentNode.children).indexOf(el)
  }

  const handleRadioChange = (e) => {
    setState(e.target.value);
    const width = e.target.parentNode.parentNode.clientWidth
    const idx = getElementIndex(e.target.parentNode) - 1;
    const translate = idx * (width / 4);
    console.log(`width: ${width}, index: ${idx}, transform: ${translate}`);
    highligherRef.current.style.transform = `translateX(${translate}px)`
  };

  return (
    <>
      <div className="flex w100 typeSelector">
        <div className="highlighter" ref={highligherRef}></div>
        <label className="typeOption flex1 colorFG textCenter padL">
          <i className="fa-solid fa-camera"></i>
          <input 
            type="radio" 
            name="typeSelection" 
            onChange={handleRadioChange} 
            checked={state === 'image'} 
            value='image' 
            style={{ display: 'none' }}
          />
        </label>
        <label className="typeOption flex1 colorFG textCenter padL">
          <i className="fa-solid fa-video"></i>
          <input 
            type="radio" 
            name="typeSelection" 
            onChange={handleRadioChange} 
            checked={state === 'video'} 
            value='video' 
            style={{ display: 'none' }}
          />
        </label>
        <label className="typeOption flex1 colorFG textCenter padL">
          <i className="fa-solid fa-headphones"></i>
          <input 
            type="radio" 
            name="typeSelection" 
            onChange={handleRadioChange} 
            checked={state === 'audio'} 
            value='audio' 
            style={{ display: 'none' }}
          />
        </label>
        <label className="typeOption flex1 colorFG textCenter padL">
          <i className="fa-regular fa-file-lines"></i>
          <input 
            type="radio" 
            name="typeSelection" 
            onChange={handleRadioChange} 
            checked={state === 'text'} 
            value='text' 
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </>
  );
}

NewDropTypeSelector.propTypes = {
    state: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired
}
