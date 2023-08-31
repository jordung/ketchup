import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import jaelyn from "../assets/landing/jaelyn.jpg";
import {
  PiHandPalmBold,
  PiCrosshairSimpleBold,
  PiCalendarPlusBold,
  PiCalendarCheckBold,
  PiTagBold,
  PiGitForkBold,
  PiFlagBold,
  PiSpinnerBold,
  PiEyeBold,
  PiPlusBold,
} from "react-icons/pi";
import MarkdownEditor from "../components/MarkdownEditor";
import UserSelector from "../components/UserSelector";
import Creatable from "react-select/creatable";
import TicketSelector from "../components/TicketSelector";
import { LoadingContext } from "../App";
import { tagDefaultOptions, colourStyles } from "../utils/selectSettings";

function Ticket() {
  //TODO: render out tickets dynamically (including a default N.A null option)
  //TODO: add in Watching functionality
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const { setLoading } = useContext(LoadingContext);

  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);

  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketAssignee, setTicketAssignee] = useState("1");
  const [ticketCreatedOn, setTicketCreatedOn] = useState("");
  const [ticketDueDate, setTicketDueDate] = useState("");
  const [ticketTag, setTicketTag] = useState("");
  const [ticketBlockedBy, setTicketBlockedBy] = useState(null);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [ticketContent, setTicketContent] = useState("");

  useEffect(() => {
    const data = {
      ticketId: 1,
      ticketTitle: "Bug Fix",
      ticketPriority: 3,
      ticketAssignee: "Alice Spring",
      ticketCreatedOn: "2023-08-28",
      ticketDueDate: "2023-09-01",
      ticketBlockedBy: {
        ticketId: 2,
        ticketTitle: "Feature Request",
      },
      ticketTag: {
        label: "Bugfix",
        value: "Bugfix",
      },
      ticketStatus: 1,
      ticketContent: "# Testing title \n * item 1 \n * item 2 \n * item 3",
    };
    setTicketTitle(data.ticketTitle);
    setTicketPriority(data.ticketPriority);
    setTicketBlockedBy(data.ticketBlockedBy.ticketId);
    setTicketContent(data.ticketContent);
    setTicketDueDate(data.ticketDueDate);
    setTicketCreatedOn(data.ticketCreatedOn);
    setTicketTag(data.ticketTag);
    setTicketStatus(data.ticketStatus);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      value: 1, // ticketId,
    },
    {
      title: "BE - Finish ERD Diagrams",
      value: 2,
    },
  ];

  const handleSaveTicket = (e) => {
    //TODO: listen for changes then allow button?
    console.log({
      ticketTitle: ticketTitle,
      ticketRaisedBy: "userId",
      ticketAssignee: ticketAssignee,
      ticketCreatedOn: new Date(ticketCreatedOn),
      ticketDueDate: new Date(ticketDueDate),
      ticketTag: ticketTag.label,
      ticketBlockedBy: ticketBlockedBy,
      ticketPriority: ticketPriority,
      ticketStatus: ticketStatus,
      ticketContent: ticketContent,
    });
    // TODO: set information to backend
    // setTicketAssignee(null);
    // setTicketContent("");
  };

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Ticket</h2>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-neutral normal-case rounded-xl btn-sm"
            onClick={() => handleSaveTicket()}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Body */}
      <motion.div
        layout
        className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        <motion.div layout="position" className="flex flex-col gap-4">
          <motion.div
            layout="position"
            className="bg-white w-full p-4 rounded-lg shadow-lg"
          >
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <span
                    className="link font-semibold normal-case"
                    onClick={() => navigate("/tickets")}
                  >
                    Tickets
                  </span>
                </li>
                <li>
                  <p className="font-semibold">{ticketTitle}</p>
                </li>
              </ul>
            </div>
            <div className="w-full flex flex-col gap-4 justify-start">
              <div className="w-full">
                <div className="grid grid-cols-2 gap-x-0 gap-y-2 xl:gap-4 max-w-lg">
                  <input
                    type="text"
                    placeholder="Ticket Title"
                    className="input input-md text-lg font-semibold col-span-2"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                  />
                  {/* 1st row */}
                  <div className="flex items-center">
                    <PiHandPalmBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Raised By
                    </label>
                  </div>

                  <div className="flex items-center input input-sm bg-white border-1 border-base-200 rounded-lg">
                    <img
                      src={jaelyn}
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
                    <label className="text-sm ml-1 font-semibold">
                      Assignee
                    </label>
                  </div>

                  <div className="">
                    <UserSelector
                      data={users}
                      id={"ticket-selector"}
                      open={isUserSelectorOpen}
                      onToggle={() =>
                        setIsUserSelectorOpen(!isUserSelectorOpen)
                      }
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
                    <label className="text-sm ml-1 font-semibold">
                      Created on
                    </label>
                  </div>

                  <div>
                    <input
                      type="date"
                      className="font-semibold bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                      defaultValue={ticketCreatedOn}
                      onChange={(e) => setTicketCreatedOn(e.target.value)}
                    />
                  </div>

                  {/* 4th row */}
                  <div className="flex items-center">
                    <PiCalendarCheckBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Due date
                    </label>
                  </div>

                  <div>
                    <input
                      type="date"
                      className="font-semibold bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
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
                    <label className="text-sm ml-1 font-semibold">
                      Blocked by
                    </label>
                  </div>

                  <div>
                    <TicketSelector
                      data={tickets}
                      id={"ticket-selector"}
                      open={isTicketSelectorOpen}
                      onToggle={() =>
                        setIsTicketSelectorOpen(!isTicketSelectorOpen)
                      }
                      onChange={setTicketBlockedBy}
                      selectedValue={tickets.find(
                        (option) => option.value === ticketBlockedBy
                      )}
                    />
                  </div>

                  {/* 7th row */}
                  <div className="flex items-center">
                    <PiFlagBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Priority
                    </label>
                  </div>

                  <div className="flex flex-col items-start justify-center md:flex-row md:justify-between">
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

                  {/* 8th row */}
                  <div className="flex items-center">
                    <PiSpinnerBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">Status</label>
                  </div>

                  <div className="flex flex-col items-start justify-center md:flex-row md:justify-between">
                    <button
                      className={`btn btn-ghost btn-xs font-semibold normal-case hover:bg-base-100 ${
                        ticketStatus === 1 ? "text-error" : ""
                      }`}
                      onClick={() => setTicketStatus(1)}
                    >
                      Not Started
                    </button>
                    <button
                      className={`btn btn-ghost btn-xs font-semibold normal-case hover:bg-base-100 ${
                        ticketStatus === 2 ? "text-warning" : ""
                      }`}
                      onClick={() => setTicketStatus(2)}
                    >
                      In Progress
                    </button>
                    <button
                      className={`btn btn-ghost btn-xs font-semibold normal-case hover:bg-base-100 ${
                        ticketStatus === 3 ? "text-success" : ""
                      }`}
                      onClick={() => setTicketStatus(3)}
                    >
                      Completed
                    </button>
                  </div>

                  {/* 9th Row */}
                  <div className="flex items-center">
                    <PiEyeBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Watching
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="avatar-group -space-x-2">
                      <div className="avatar border-none">
                        <div className="w-8">
                          <img src={jaelyn} alt="" />
                        </div>
                      </div>
                      <div className="avatar border-none">
                        <div className="w-8">
                          <img src={jaelyn} alt="" />
                        </div>
                      </div>
                      <div className="avatar border-none">
                        <div className="w-8">
                          <img src={jaelyn} alt="" />
                        </div>
                      </div>
                      <div className="avatar placeholder border-none">
                        <div className="w-8 bg-base-100 text-neutral">
                          <span className="text-xs font-semibold">+4</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn bg-white btn-sm rounded-xl">
                      <PiPlusBold />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full min-h-[5rem] xl:min-h-0 xl:mb-2 xl:mt-6">
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
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Ticket;
