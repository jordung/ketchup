import { PiSmileyBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { useContext, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TicketCard from "./TicketCard";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { convertTextToLink } from "../utils/convertTextToLink";
import slack from "../assets/ketchupcard/slack.png";

function PostCard(props) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const {
    userId,
    postId,
    profilePicture,
    firstName,
    lastName,
    date,
    content,
    ticket,
    groupedReactions,
  } = props;

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
            control: 2,
            userId: user.id,
            postId: postId,
            icon: inputEmoji,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const currentPost = response.data.data.getPostReactions.find(
          (item) => item.id === postId
        );
        setAgendaEmojis(currentPost.groupedReactions);
        // console.log(currentKetchup.reactionCounts);
        // setAgendaEmojis([...currentKetchup.reactionCounts]);
      } catch (error) {
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
              control: 2,
              userId: user.id,
              postId: postId,
              icon: inputEmoji,
            },
          }
        );
        const currentPost = response.data.data.find(
          (item) => item.id === postId
        );
        setAgendaEmojis(currentPost.groupedReactions);
        // console.log(currentKetchup.reactionCounts);
        // setAgendaEmojis([...currentKetchup.reactionCounts]);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setShowReactionsSelector(false);
      }
    };

    updateEmojiInformation();
  };

  return (
    <div className="w-full rounded-lg shadow-xl flex gap-2 items-start p-4 bg-white">
      <div className="avatar">
        <div className="w-12 rounded-full relative">
          <img src={profilePicture} alt="profile" />
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
          <p className="text-xs "> {moment(date).format("DD MMM YYYY")}</p>
        </div>
        <div>
          <p className="text-sm break-words">{convertTextToLink(content)}</p>
        </div>
        {ticket && (
          <div>
            <TicketCard ticketId={ticket.id} ticketName={ticket.name} />
          </div>
        )}
        <div className="flex gap-2 my-1">
          <a
            className="btn btn-xs bg-base-100 border-0 normal-case"
            href="slack://user?team=TNYFQH8G5&id=U057R0367TM"
          >
            <img src={slack} alt="slack" className="w-3 h-3 object-contain" />
            <span className="text-xs">Slack</span>
          </a>
        </div>
        <div className="flex gap-2 flex-wrap mt-1">
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
              <button
                className={`btn btn-xs normal-case flex items-center justify-center gap-2 ${
                  emoji.userId.includes(user.id)
                    ? "bg-accent border-primary"
                    : "bg-base-100 border-0"
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

export default PostCard;
