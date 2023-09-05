import { PiSmileyBold } from "react-icons/pi";
import slack from "../assets/ketchupcard/slack.png";
import { useContext, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TicketCard from "./TicketCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import DocumentCard from "./DocumentCard";

function KetchupCard(props) {
  const {
    userId,
    ketchupId,
    profilePicture,
    firstName,
    lastName,
    createdDate,
    agendas,
    updates,
    groupedReactions,
    mood,
  } = props;

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [showReactionsSelector, setShowReactionsSelector] = useState(false);
  const [agendaEmojis, setAgendaEmojis] = useState([...groupedReactions]);
  const [popoverPosition, setPopoverPosition] = useState("below");

  // determine if reactions selector popover should appear below or above the button based on available space
  const buttonRef = useRef(null);

  const handleTogglePopover = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    if (spaceBelow >= 500) {
      setPopoverPosition("below");
    } else if (spaceAbove >= 500) {
      setPopoverPosition("above");
    }

    setShowReactionsSelector(!showReactionsSelector);
  };

  const accessToken = localStorage.getItem("accessToken");

  const handleAddReaction = (e) => {
    const inputEmoji = typeof e === "object" ? e.unified : e;
    const updateEmojiInformation = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DB_API}/home`,
          {
            // control = 1, add reaction to ketchup OR control = 2, add reaction to post
            control: 1,
            userId: user.id,
            ketchupId: ketchupId,
            icon: inputEmoji,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log(response);
        const currentPost = response.data.data.getKetchupReactions.find(
          (item) => item.id === ketchupId
        );
        setAgendaEmojis(currentPost.groupedReactions);
        // console.log(currentKetchup.reactionCounts);
        // setAgendaEmojis([...currentKetchup.reactionCounts]);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.msg);
      } finally {
        setShowReactionsSelector(false);
      }
    };

    updateEmojiInformation();
  };

  const handleRemoveReaction = (e) => {
    const inputEmoji = typeof e === "object" ? e.unified : e;
    const updateEmojiInformation = async () => {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_DB_API}/home`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            data: {
              // control = 1, add reaction to ketchup OR control = 2, add reaction to post
              control: 1,
              userId: user.id,
              ketchupId: ketchupId,
              icon: inputEmoji,
            },
          }
        );
        const currentPost = response.data.data.find(
          (item) => item.id === ketchupId
        );
        setAgendaEmojis(currentPost.groupedReactions);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setShowReactionsSelector(false);
      }
    };

    updateEmojiInformation();
  };

  return (
    <div className="mb-4 flex gap-2 items-start max-w-full">
      <div className="relative">
        <div className="avatar">
          <div className="w-12 rounded-full relative">
            <img src={profilePicture} alt="" />
          </div>
        </div>
        <div
          className={`absolute bottom-0 right-0 p-1 rounded-full flex-shrink-0 text-xs ${
            ((mood.id === 1 || mood.id === 2 || mood.id === 3) &&
              "bg-success") ||
            ((mood.id === 4 || mood.id === 5 || mood.id === 6) &&
              "bg-warning") ||
            ((mood.id === 7 || mood.id === 8 || mood.id === 9) && "bg-error")
          }`}
        >
          {String.fromCodePoint(parseInt(mood.icon, 16))}
        </div>
      </div>
      <div className="flex flex-col items-start w-full">
        <div className="flex gap-2 items-center">
          <p
            className="font-semibold hover:text-base-300 cursor-pointer transition-all duration-300"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            {firstName} {lastName}
          </p>
          <p className="text-xs ">
            {moment(createdDate).format("DD MMM YYYY")}
          </p>
        </div>
        {/* Agenda Card */}
        <div className="flex flex-col gap-3">
          {agendas &&
            agendas.map((agenda, index) => (
              <div className="max-w-full" key={agenda.id}>
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className="badge bg-base-300 text-white border-0 text-xs font-semibold">
                      agenda #{index + 1}
                    </span>
                    <span
                      className={`badge font-semibold text-xs ${
                        (agenda.agenda.flag.id === 1 &&
                          "badge-warning text-orange-800") ||
                        (agenda.agenda.flag.id === 2 &&
                          "badge-success text-green-800") ||
                        (agenda.agenda.flag.id === 3 &&
                          "badge-info text-blue-800") ||
                        (agenda.agenda.flag.id === 4 &&
                          "badge-error text-red-800")
                      }`}
                    >
                      {agenda.agenda.flag.name}
                    </span>
                  </div>
                  <p className="text-sm break-words">{agenda.agenda.content}</p>
                </div>
                <div>
                  {agenda.agenda.ticket && (
                    <TicketCard
                      ticketId={agenda.agenda.ticket.id}
                      ticketName={agenda.agenda.ticket.name}
                    />
                  )}
                </div>
                <div>
                  {agenda.agenda.document && (
                    <DocumentCard
                      documentId={agenda.agenda.document.id}
                      documentName={agenda.agenda.document.name}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
        {/* Updates Card */}
        <div className="flex flex-col">
          {updates &&
            updates.map((update, index) => (
              <div className="max-w-full mt-3" key={update.id}>
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className="badge bg-base-300 text-white border-0 text-xs font-semibold">
                      update #{index + 1}
                    </span>
                    <span
                      className={`badge font-semibold text-xs ${
                        (update.update.flag.id === 1 &&
                          "badge-warning text-orange-800") ||
                        (update.update.flag.id === 2 &&
                          "badge-success text-green-800") ||
                        (update.update.flag.id === 3 &&
                          "badge-info text-blue-800") ||
                        (update.update.flag.id === 4 &&
                          "badge-error text-red-800")
                      }`}
                    >
                      {update.update.flag.name}
                    </span>
                  </div>
                  <p className="text-sm break-words">{update.update.content}</p>
                </div>
                <div>
                  {update.update.ticket && (
                    <TicketCard
                      ticketId={update.update.ticket.id}
                      ticketName={update.update.ticket.name}
                    />
                  )}
                </div>
                <div>
                  {update.update.document && (
                    <DocumentCard
                      documentId={update.update.document.id}
                      documentName={update.update.document.name}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="flex gap-2 my-1">
          <button className="btn btn-xs bg-base-100 border-0 normal-case">
            <img src={slack} alt="slack" className="w-3 h-3 object-contain" />
            <span className="text-xs">Slack</span>
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <button
              ref={buttonRef}
              className="btn btn-xs bg-base-100 border-0 normal-case tooltip before:text-xs"
              data-tip="Add reaction..."
              onClick={handleTogglePopover}
            >
              <PiSmileyBold className="w-6 h-4 text-neutral" />
            </button>
            {showReactionsSelector && (
              <motion.div
                initial={{
                  opacity: 0,
                  top: popoverPosition === "below" ? "100%" : "auto",
                }}
                animate={{
                  opacity: 1,
                  top: popoverPosition === "below" ? "100%" : "auto",
                }}
                transition={{ duration: 0.2 }}
                className={`absolute z-10 ${
                  popoverPosition === "below" ? "top-full" : "bottom-[130%]"
                } left-1/2 transform -translate-x-[30%] mt-2 md:left-auto md:translate-x-0`}
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleAddReaction}
                  theme={"light"}
                  searchPosition={"none"}
                  previewPosition={"none"}
                  navPosition={"none"}
                  perLine={7}
                  emojiButtonSize={40}
                  emojiSize={20}
                />
              </motion.div>
            )}
          </div>
          {agendaEmojis.map((emoji) => (
            <div key={emoji.icon}>
              {/*  */}
              <button
                className={`btn btn-xs normal-case flex items-center justify-center gap-2 ${
                  emoji.userId.includes(user.id)
                    ? "bg-accent border-primary"
                    : "bg-base-100 border-gray-100"
                }`}
                onClick={() => {
                  if (!emoji.userId.includes(user.id)) {
                    handleAddReaction(emoji.icon);
                  } else {
                    handleRemoveReaction(emoji.icon);
                  }
                }}
              >
                <span>{String.fromCodePoint(parseInt(emoji.icon, 16))}</span>
                <span>{emoji.userId.length}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KetchupCard;
