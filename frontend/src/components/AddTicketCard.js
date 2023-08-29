import { useState } from "react";
import { motion } from "framer-motion";
import jordan from "../assets/landing/jaelyn.jpg";
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

export const tagDefaultOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "bugfix", label: "Bugfix" },
  { value: "feature", label: "Feature" },
];

export const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "0.5rem",
    cursor: "pointer",
    boxShadow: "none",
    borderColor: "#E0DFE1",
    "&:hover": {
      borderColor: "#E0DFE1",
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#F6F6F6" : "white",
      color: isDisabled ? "#E0DFE1" : "#353535",
      cursor: isDisabled ? "" : "pointer",
    };
  },
};

function AddTicketCard(props) {
  //TODO: render out tickets dynamically (including a default N.A null option)
  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);

  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketAssignee, setTicketAssignee] = useState("1");
  const [ticketCreatedOn, setTicketCreatedOn] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [ticketDueDate, setTicketDueDate] = useState();
  const [ticketTag, setTicketTag] = useState("");
  const [ticketBlockedBy, setTicketBlockedBy] = useState(null);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [ticketContent, setTicketContent] = useState("");

  const handleChangeTag = (value) => {
    setTicketTag(value);
  };

  const handleCreateTag = (inputValue) => {
    console.log(inputValue);
  };

  const users = [
    {
      name: "Jordan Ang",
      profilePicture:
        "https://images.unsplash.com/photo-1527082395-e939b847da0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1635&q=80",
      value: "1", // userId,
    },
    {
      name: "Jaelyn Teo",
      profilePicture:
        "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      value: "2",
    },
  ];

  const tickets = [
    {
      title: "N.A.",
      value: null,
    },
    {
      title: "FE - Update UI",
      value: "1", // ticketId,
    },
    {
      title: "BE - Finish ERD Diagrams",
      value: "2",
    },
  ];

  // useEffect(() => {
  //   console.log(content);
  // }, [content]);

  const handleAddTicket = (e) => {
    console.log({
      ticketTitle: ticketTitle,
      ticketRaisedBy: "userId",
      ticketAssignee: ticketAssignee,
      ticketCreatedOn: new Date(ticketCreatedOn),
      ticketDueDate: new Date(ticketDueDate),
      ticketTag: ticketTag.label,
      ticketBlockedBy: ticketBlockedBy,
      ticketPriority: ticketPriority,
      ticketContent: ticketContent,
    });
    // TODO: set information to backend
    // setTicketAssignee(null);
    // setContent("");
    props.setAddTicket(false);
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
                src={jordan}
                alt=""
                className="h-4 w-4 rounded-full object-cover flex-shrink-0"
              />
              <span className="ml-2 text-xs font-semibold truncate">
                Jaelyn Teo
              </span>
            </div>

            {/* 2nd row */}
            <div className="flex items-center">
              <PiCrosshairSimpleBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Assignee</label>
            </div>

            <div className="">
              <UserSelector
                data={users}
                id={"ticket-selector"}
                open={isUserSelectorOpen}
                onToggle={() => setIsUserSelectorOpen(!isUserSelectorOpen)}
                onChange={setTicketAssignee}
                onBlur={() => setIsUserSelectorOpen(false)}
                selectedValue={users.find(
                  (option) => option.value === ticketAssignee
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
                className="cursor-pointer font-semibold bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                defaultValue={ticketCreatedOn}
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
                options={tagDefaultOptions}
                value={ticketTag}
                onChange={handleChangeTag}
                onCreateOption={(input) => handleCreateTag(input)}
                styles={colourStyles}
                placeholder=""
              />
            </div>

            {/* 6th row */}
            <div className="flex items-center">
              <PiGitForkBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Blocked by</label>
            </div>

            <div>
              <TicketSelector
                data={tickets}
                id={"ticket-selector"}
                open={isTicketSelectorOpen}
                onToggle={() => setIsTicketSelectorOpen(!isTicketSelectorOpen)}
                onChange={setTicketBlockedBy}
                selectedValue={tickets.find(
                  (option) => option.value === ticketBlockedBy
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
          onClick={() => props.setAddTicket(false)}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default AddTicketCard;
