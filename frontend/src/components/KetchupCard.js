import { PiSmileyBold } from "react-icons/pi";
import jordan from "../assets/landing/jordan.jpeg";
import slack from "../assets/ketchupcard/slack.png";
import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TicketCard from "./TicketCard";

function KetchupCard() {
  const [showReactionsSelector, setShowReactionsSelector] = useState(false);
  const [emojiObj, setEmojiObj] = useState([{ unicode: "1f60d", count: 1 }]);

  const handleSelectedReaction = (e) => {
    console.log(e.unified);
    setShowReactionsSelector(false);
    setEmojiObj((prevState) => [
      ...prevState,
      { unicode: e.unified, count: 1 },
    ]);
  };

  return (
    <div className="mb-4 flex gap-2 items-start w-full">
      <div className="avatar">
        <div className="w-12 rounded-full relative">
          <img src={jordan} alt="" />
        </div>
      </div>
      <div className="flex flex-col items-start w-full">
        <div className="flex gap-2 items-center">
          <p className="font-semibold">Jordan Ang</p>
          <p className="text-xs ">21 August 2023</p>
        </div>
        <div>
          <p className="text-sm">
            Running into issues adding dynamic columns{" "}
            <span className="badge badge-warning text-amber-500 font-semibold text-xs">
              help
            </span>
          </p>
        </div>
        <TicketCard ticketName="FE - Add Homepage" />
        <div className="flex gap-2 my-1">
          <button className="btn btn-sm bg-base-100 border-0 normal-case">
            <img src={slack} alt="slack" className="w-3 h-3 object-contain" />
            <span className="text-xs">Slack</span>
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {emojiObj.map((emoji, index) => (
            <div key={index}>
              <button className="btn btn-xs bg-base-100 border-0 normal-case flex items-center justify-center gap-2">
                <span>{String.fromCodePoint(parseInt(emoji.unicode, 16))}</span>
                <span>{emoji.count}</span>
              </button>
            </div>
          ))}
          <div>
            <button
              className="btn btn-xs bg-base-100 border-0 normal-case"
              onClick={() => setShowReactionsSelector(!showReactionsSelector)}
            >
              <PiSmileyBold className="w-6 h-4 text-gray-400" />
            </button>
            {showReactionsSelector && (
              <div className="absolute mt-2 left-16 md:left-auto z-10">
                <Picker
                  data={data}
                  onEmojiSelect={handleSelectedReaction}
                  theme={"light"}
                  searchPosition={"none"}
                  previewPosition={"none"}
                  navPosition={"none"}
                  perLine={7}
                  emojiButtonSize={40}
                  emojiSize={20}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KetchupCard;
