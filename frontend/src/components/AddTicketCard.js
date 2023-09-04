import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  PiHandPalmBold,
  PiCrosshairSimpleBold,
  PiCalendarPlusBold,
  PiCalendarCheckBold,
  PiTagBold,
  PiGitForkBold,
  PiFlagBold,
} from "react-icons/pi";
import MarkdownEditor from "./MarkdownEditor";
import UserSelector from "./UserSelector";
import Creatable from "react-select/creatable";
import TicketSelector from "./TicketSelector";
import { colourStyles } from "../utils/selectSettings";
import { formatInputDate } from "../utils/formatInputDate";
import { UserContext } from "../App";
import { formatOneTag, formatTags } from "../utils/formatTags";
import axios from "axios";
import { socket } from "../utils/socket-client";

function AddTicketCard(props) {
  const {
    setAddTicket,
    allUsers,
    allTags,
    allTickets,
    setAllUsers,
    setAllTags,
    setAllTickets,
  } = props;
  const { user } = useContext(UserContext);
  const userList = [
    {
      id: null,
      firstName: "N/A",
      lastName: "",
      profilePicture: null,
    },
    ...allUsers,
  ];
  const ticketList = [{ name: "N/A", id: null }, ...allTickets];

  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);
  const [tagList, setTagList] = useState(formatTags(allTags));

  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketAssignee, setTicketAssignee] = useState(null);
  const [ticketCreatedOn, setTicketCreatedOn] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [ticketDueDate, setTicketDueDate] = useState("");
  const [ticketTag, setTicketTag] = useState(null);
  const [ticketBlockedBy, setTicketBlockedBy] = useState(null);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [ticketContent, setTicketContent] = useState("");

  const handleChangeTag = (value) => {
    setTicketTag(value);
  };

  const handleCreateTag = async (inputValue) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/tickets/tag`,
        {
          organisationId: user.organisationId,
          name: inputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response);
      setTagList(formatTags(response.data.data));
      setTicketTag(
        formatOneTag(
          response.data.data.find((obj) => obj.name.includes("#" + inputValue))
        )
      );
    } catch (error) {
      toast.error(`${error.response.data.msg}`);
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("show_notification", function (data) {
      toast.success(data.title);
    });

    return () => {
      socket.off("show_notification");
    };
  }, []);

  const handleAddTicket = async (e) => {
    if (!ticketTitle.trim().length > 0) {
      toast.error("Ticket Title must not be blank.");
      return;
    } else {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DB_API}/tickets`,
          {
            organisationId: user.organisationId,
            creatorId: user.id,
            assigneeId: ticketAssignee,
            tagId: ticketTag ? ticketTag.value : null,
            priorityId: ticketPriority,
            dependencyId: ticketBlockedBy,
            name: ticketTitle,
            body: ticketContent,
            dueDate: formatInputDate(ticketDueDate),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAllUsers(response.data.data.allUsers);
        setAllTags(response.data.data.allTags);
        setAllTickets(response.data.data.allTickets);
        toast.success(response.data.msg);
        socket.emit("assignee", {
          target: ticketAssignee,
          title: `You have been assigned a new ticket: ${ticketTitle}!`,
        });
      } catch (error) {
        toast.error(`${error.response.data.msg}`);
      } finally {
        setAddTicket(false);
      }
    }
    setTicketTitle("");
    setTicketAssignee(null);
    setTicketDueDate("");
    setTicketTag(null);
    setTicketBlockedBy(null);
    setTicketPriority(null);
    setTicketContent("");
  };

  return (
    <motion.div
      layout="position"
      initial={{ x: 2000 }}
      animate={{ x: 0 }}
      exit={{ x: 2000 }}
      transition={{ delay: 0.5 }}
      className="bg-white w-full p-4 rounded-lg shadow-lg"
    >
      <h3 className="font-bold text-lg">Add Ticket</h3>
      <div className="w-full flex flex-col gap-4 xl:flex-row justify-start">
        <div className="w-full xl:w-1/4 my-2">
          <div className="grid grid-cols-2 gap-x-0 gap-y-2 xl:gap-4 max-w-xs">
            <input
              type="text"
              placeholder="Ticket Title"
              className="input input-md font-semibold col-span-2"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
            />
            {/* 1st row */}
            <div className="flex items-center">
              <PiHandPalmBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Raised By</label>
            </div>

            <div className="flex items-center input input-sm bg-white border-1 border-base-200 rounded-lg">
              <img
                src={user.profilePicture}
                alt=""
                className="h-4 w-4 rounded-full object-cover flex-shrink-0"
              />
              <span className="ml-2 text-xs font-semibold truncate">
                {user.firstName} {user.lastName}
              </span>
            </div>

            {/* 2nd row */}
            <div className="flex items-center">
              <PiCrosshairSimpleBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Assignee</label>
            </div>

            <div className="">
              <UserSelector
                data={userList}
                id={"user-selector"}
                open={isUserSelectorOpen}
                onToggle={() => setIsUserSelectorOpen(!isUserSelectorOpen)}
                onChange={setTicketAssignee}
                onBlur={() => setIsUserSelectorOpen(false)}
                selectedValue={userList.find(
                  (option) => option.id === ticketAssignee
                )}
              />
            </div>

            {/* 3rd row */}
            <div className="flex items-center">
              <PiCalendarPlusBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Created on</label>
            </div>

            <div>
              <input
                type="date"
                className="cursor-pointer font-semibold disabled:bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                defaultValue={ticketCreatedOn}
                disabled
                onChange={(e) => setTicketCreatedOn(e.target.value)}
              />
            </div>

            {/* 4th row */}
            <div className="flex items-center">
              <PiCalendarCheckBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Due date</label>
            </div>

            <div>
              <input
                type="date"
                className="cursor-pointer font-semibold bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                value={ticketDueDate}
                onChange={(e) => setTicketDueDate(e.target.value)}
              />
            </div>

            {/* 5th row */}
            <div className="flex items-center">
              <PiTagBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Tag</label>
            </div>

            <div className="cursor-pointer">
              <Creatable
                isClearable
                className="font-semibold text-xs cursor-pointer"
                options={tagList}
                value={ticketTag}
                onChange={handleChangeTag}
                onCreateOption={(input) => handleCreateTag(input)}
                styles={colourStyles}
                placeholder="Search..."
              />
            </div>

            {/* 6th row */}
            <div className="flex items-center">
              <PiGitForkBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Blocked by</label>
            </div>

            <div>
              <TicketSelector
                data={ticketList}
                id={"ticket-selector"}
                open={isTicketSelectorOpen}
                onToggle={() => setIsTicketSelectorOpen(!isTicketSelectorOpen)}
                onChange={setTicketBlockedBy}
                selectedValue={ticketList.find(
                  (option) => option.id === ticketBlockedBy
                )}
              />
            </div>

            {/* 7th row */}
            <div className="flex items-center">
              <PiFlagBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Priority</label>
            </div>

            <div className="flex flex-col items-start justify-center xl:flex-row xl:justify-start">
              <button
                className={`btn btn-ghost btn-xs font-semibold normal-case hover:bg-base-100 ${
                  ticketPriority === 3 ? "text-error" : ""
                }`}
                onClick={() => setTicketPriority(3)}
              >
                High
              </button>
              <button
                className={`btn btn-ghost btn-xs font-semibold normal-case hover:bg-base-100 ${
                  ticketPriority === 2 ? "text-warning" : ""
                }`}
                onClick={() => setTicketPriority(2)}
              >
                Medium
              </button>
              <button
                className={`btn btn-ghost btn-xs font-semibold normal-case hover:bg-base-100 ${
                  ticketPriority === 1 ? "text-success" : ""
                }`}
                onClick={() => setTicketPriority(1)}
              >
                Low
              </button>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-3/4 min-h-[5rem] xl:min-h-0 xl:mb-2 xl:mt-6">
          {/* Markdown */}
          <p className="font-bold text-md flex items-center gap-2">
            Ticket Information{" "}
            <span className="text-xs uppercase badge badge-neutral badge-md border-0">
              editor
            </span>
          </p>
          <MarkdownEditor
            content={ticketContent}
            setContent={setTicketContent}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-primary btn-sm normal-case mt-2"
          onClick={handleAddTicket}
        >
          Add
        </button>
        <button
          className="btn btn-base-100 btn-sm normal-case mt-2"
          onClick={() => setAddTicket(false)}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default AddTicketCard;
