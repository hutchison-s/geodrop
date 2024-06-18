import { useState } from "react";
import NewDropTypeSelector from "../components/NewDropTypeSelector";
import "../styles/newdrop.css";
import NewImageDrop from "../components/NewImageDrop";
import NewVideoDrop from "../components/NewVideoDrop";
import NewAudioDrop from "../components/NewAudioDrop";
import NewTextDrop from "../components/NewTextDrop";

export default function NewPost() {
  const [chosenType, setChosenType] = useState("image");

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
    <section className="newDropPage flex vertical spread">
      <DropInterface />
      <NewDropTypeSelector state={chosenType} setState={setChosenType} />
      <div className="infiniteScroll">
        <div className="scrollCar">
          <span className="scrollText">What will you leave behind?</span>
          <span className="scrollText">What will you leave behind?</span>
          <span className="scrollText">What will you leave behind?</span>
          <span className="scrollText">What will you leave behind?</span>
        </div>
      </div>
    </section>
  );
}
