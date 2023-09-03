import emoji1 from "../assets/dailyketchup/1.png";
import emoji2 from "../assets/dailyketchup/2.png";
import emoji3 from "../assets/dailyketchup/3.png";
import emoji4 from "../assets/dailyketchup/4.png";
import emoji5 from "../assets/dailyketchup/5.png";
import emoji6 from "../assets/dailyketchup/6.png";
import emoji7 from "../assets/dailyketchup/7.png";
import emoji8 from "../assets/dailyketchup/8.png";
import emoji9 from "../assets/dailyketchup/9.png";

function MoodBar(props) {
  const { mood, setMood } = props;
  return (
    <div className="flex gap-2 overflow-x-auto">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex gap-2">
          <div
            className={`p-2  rounded-3xl cursor-pointer ${
              mood === 1 || mood === null
                ? "bg-success"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(1)}
          >
            <img src={emoji1} alt="emoji1" className="h-10 w-10" />
          </div>
          <div
            className={`p-2  rounded-3xl cursor-pointer ${
              mood === 2 || mood === null
                ? "bg-success"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(2)}
          >
            <img src={emoji2} alt="emoji2" className="h-10 w-10" />
          </div>
          <div
            className={`p-2  rounded-3xl cursor-pointer ${
              mood === 3 || mood === null
                ? "bg-success"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(3)}
          >
            <img src={emoji3} alt="emoji3" className="h-10 w-10" />
          </div>
        </div>
        <p className="text-xs font-semibold text-base-300 mt-1">
          Ready to take on the world!
        </p>
      </div>
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex gap-2">
          <div
            className={`p-2 rounded-3xl cursor-pointer ${
              mood === 4 || mood === null
                ? "bg-warning"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(4)}
          >
            <img src={emoji4} alt="emoji4" className="h-10 w-10" />
          </div>
          <div
            className={`p-2 rounded-3xl cursor-pointer ${
              mood === 5 || mood === null
                ? "bg-warning"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(5)}
          >
            <img src={emoji5} alt="emoji5" className="h-10 w-10" />
          </div>
          <div
            className={`p-2 rounded-3xl cursor-pointer ${
              mood === 6 || mood === null
                ? "bg-warning"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(6)}
          >
            <img src={emoji6} alt="emoji6" className="h-10 w-10" />
          </div>
        </div>
        <p className="text-xs font-semibold text-base-300 mt-1">
          I'm doing alright
        </p>
      </div>
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex gap-2">
          <div
            className={`p-2 rounded-3xl cursor-pointer ${
              mood === 7 || mood === null
                ? "bg-error"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(7)}
          >
            <img src={emoji7} alt="emoji7" className="h-10 w-10" />
          </div>
          <div
            className={`p-2 rounded-3xl cursor-pointer ${
              mood === 8 || mood === null
                ? "bg-error"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(8)}
          >
            <img src={emoji8} alt="emoji8" className="h-10 w-10" />
          </div>
          <div
            className={`p-2 rounded-3xl cursor-pointer ${
              mood === 9 || mood === null
                ? "bg-error"
                : "bg-base-200 saturate-0 hover:opacity-75 transition-all duration-300"
            }`}
            onClick={() => setMood(9)}
          >
            <img src={emoji9} alt="emoji9" className="h-10 w-10" />
          </div>
        </div>
        <p className="text-xs font-semibold text-base-300 mt-1">
          Feels like Monday today...
        </p>
      </div>
    </div>
  );
}

export default MoodBar;
