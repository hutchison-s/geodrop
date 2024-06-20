import { useState } from "react";
import NewDropTypeSelector from "../components/NewDropTypeSelector";
import "../styles/newdrop.css";
import NewImageDrop from "../components/NewImageDrop";
import NewVideoDrop from "../components/NewVideoDrop";
import NewAudioDrop from "../components/NewAudioDrop";
import NewTextDrop from "../components/NewTextDrop";
import Marquee from "../components/Marquee";
import logo from '../assets/logo-transparent.png'
import { useMode } from "../contexts/LightContext";

export default function NewPost() {
  const [chosenType, setChosenType] = useState("image");
  const {mode} = useMode();

  const DropInterface = () => {
    switch (chosenType) {
      case "image":
        return <NewImageDrop />;
      case "video":
        return <NewVideoDrop />;
      case "audio":
        return <NewAudioDrop />;
      case "text":
        return <NewTextDrop />
      default:
        return null;
    }
  };

  return (
    <section className={`newDropPage flex vertical ${mode !== 'light' ? 'darkMode' : ''}`}>
      <NewDropTypeSelector state={chosenType} setState={setChosenType} />
      <Marquee text='What will you leave behind?' text2={<img src={logo} alt="GeoDrop" width='60px'></img>} />
      <DropInterface />
      
    </section>
  );
}
