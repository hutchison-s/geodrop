import PropTypes from "prop-types";
import { useRef } from "react";
import { useState } from "react";
import "../styles/audioplayer.css";
import wave from "../assets/wave.png";

export default function AudioPlayer({ src }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const holderRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const progRef = useRef(null);

  const handlePlayToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {

      audioRef.current.play();
    }
  };

  const handleProgress = () => {
    if (audioRef.current.currentTime === audioRef.current.duration) {
      setTimeout(() => {
        setProgress(0);
      }, 300);

      return;
    }
    const progress =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  return (
    <div className="audioPlayer">
  
          <div
            className="progressBar"
            ref={progRef}
            style={{
              flex: `100%`,
              transform: `scaleX(${progress}%)`,
              height: "10px",
              borderRadius: '10px',
              background: "var(--blue)",
              transformOrigin: 'left',
              transition: "transform 0.5s linear",

            }}>
      </div>
      <button onClick={handlePlayToggle}>
        {isPlaying ? (
          <i className="fa-solid fa-pause"></i>
        ) : (
          <i className="fa-solid fa-play"></i>
        )}
      </button>
      <div className="waveHolder" ref={holderRef}>
        <img src={wave} alt="soundwave" className="soundwave" width='100%' />
      </div>
      <audio
        src={src}
        ref={audioRef}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onTimeUpdate={handleProgress}
      />
    </div>
  );
}

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};
