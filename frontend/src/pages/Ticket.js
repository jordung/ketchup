import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "react-icons/pi";
import MarkdownEditor from "../components/MarkdownEditor";
import UserSelector from "../components/UserSelector";
import Creatable from "react-select/creatable";
import TicketSelector from "../components/TicketSelector";
import { colourStyles } from "../utils/selectSettings";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import moment from "moment";
import { formatOneTag, formatTags } from "../utils/formatTags";
import { UserContext } from "../App";
import WatcherModal from "../components/WatcherModal";
import DeleteTicketModal from "../components/DeleteTicketModal";

function Ticket() {
  //TODO: add in Edit functionality
  const { ticketId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [watcherList, setWatcherList] = useState([]);
  const [originalTicket, setOriginalTicket] = useState(null);
  const [disableUpdateButton, setDisableUpdateButton] = useState(true);

  const [ticketCreator, setTicketCreator] = useState(null);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketAssignee, setTicketAssignee] = useState(null);
  const [ticketCreatedOn, setTicketCreatedOn] = useState("");
  const [ticketDueDate, setTicketDueDate] = useState("");
  const [ticketTag, setTicketTag] = useState(null);
  const [ticketBlockedBy, setTicketBlockedBy] = useState(null);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [ticketContent, setTicketContent] = useState("");

  useEffect(() => {
    const getTicketInformation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/tickets/view/${ticketId}`
        );
        setUserList([
          {
            id: null,
            firstName: "N/A",
            lastName: "",
            profilePicture: null,
          },
          ...response.data.data.allUsers,
        ]);
        setTagList(formatTags(response.data.data.allTags));
        setTicketList([
          { name: "N/A", id: null },
          ...response.data.data.allTickets,
        ]);
        setWatcherList(response.data.data.allWatchers);

        setOriginalTicket(response.data.data.ticket);

        setTicketTitle(response.data.data.ticket.name);
        setTicketCreator(response.data.data.ticket.creator);
        setTicketPriority(
          response.data.data.ticket.priority &&
            response.data.data.ticket.priority.id
        );
        setTicketBlockedBy(
          response.data.data.ticket.ticket_dependencies.length > 0
            ? response.data.data.ticket.ticket_dependencies[0].dependencyId
            : null
        );
        setTicketContent(response.data.data.ticket.body);
        setTicketDueDate(
          response.data.data.ticket.dueDate
            ? moment(response.data.data.ticket.dueDate).format("yyyy-MM-DD")
            : ""
        );
        setTicketCreatedOn(
          moment(response.data.data.ticket.createdAt).format("yyyy-MM-DD")
        );
        setTicketTag(
          response.data.data.ticket.tag && {
            value: response.data.data.ticket.tag.id,
            label: response.data.data.ticket.tag.name,
          }
        );
        setTicketStatus(response.data.data.ticket.status.id);
        setTicketAssignee(response.data.data.ticket.assigneeId);
      } catch (error) {
        toast.error(`${error.response.data.msg}`);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    getTicketInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // listening for changes, if there are changes, enable update button
  useEffect(() => {
    if (!loading) {
      const hasChanges =
        ticketTitle !== originalTicket?.name ||
        ticketAssignee !== originalTicket?.assigneeId ||
        ticketDueDate.slice(0, 10) !== originalTicket?.dueDate?.slice(0, 10) ||
        (ticketTag && ticketTag.value) !== originalTicket?.tagId ||
        ticketBlockedBy !==
          (originalTicket?.ticket_dependencies[0]?.dependencyId || null) ||
        ticketPriority !== originalTicket?.priorityId ||
        ticketStatus !== originalTicket?.statusId ||
        ticketContent?.trim() !== (originalTicket?.body?.trim() || "");
      setDisableUpdateButton(!hasChanges);
    }
  }, [
    ticketTitle,
    ticketAssignee,
    ticketDueDate,
    ticketTag,
    ticketPriority,
    ticketStatus,
    ticketBlockedBy,
    originalTicket,
    loading,
    ticketContent,
  ]);

  const handleSaveTicket = async (e) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/tickets/view/${ticketId}`,
        {
          name: ticketTitle,
          assigneeId: ticketAssignee,
          tagId: ticketTag?.value || null,
          priorityId: ticketPriority,
          statusId: ticketStatus,
          dependencyId: ticketBlockedBy,
          body: ticketContent,
          dueDate: ticketDueDate,
        }
      );
      setOriginalTicket(response.data.data.ticket);
      setTicketTitle(response.data.data.ticket.name);
      setTicketCreator(response.data.data.ticket.creator);
      setTicketPriority(
        response.data.data.ticket.priority &&
          response.data.data.ticket.priority.id
      );
      setTicketBlockedBy(
        response.data.data.ticket.ticket_dependencies.length > 0
          ? response.data.data.ticket.ticket_dependencies[0].dependencyId
          : null
      );
      setTicketContent(response.data.data.ticket.body);
      setTicketDueDate(
        response.data.data.ticket.dueDate
          ? moment(response.data.data.ticket.dueDate).format("yyyy-MM-DD")
          : ""
      );
      setTicketCreatedOn(
        moment(response.data.data.ticket.createdAt).format("yyyy-MM-DD")
      );
      setTicketTag(
        response.data.data.ticket.tag && {
          value: response.data.data.ticket.tag.id,
          label: response.data.data.ticket.tag.name,
        }
      );
      setTicketStatus(response.data.data.ticket.status.id);
      setTicketAssignee(response.data.data.ticket.assigneeId);
      setDisableUpdateButton(true);
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
        {/* Header */}
        <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
          <h2 className="text-2xl font-bold">Ticket</h2>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-success normal-case rounded-xl btn-sm text-white"
              onClick={() => handleSaveTicket()}
              disabled={disableUpdateButton ? true : false}
            >
              Update
            </button>
            <button
              className="btn btn-error normal-case rounded-xl btn-sm text-white"
              onClick={() => window.deleteTicketModal.showModal()}
            >
              Delete
            </button>
            <DeleteTicketModal ticketId={ticketId} ticketTitle={ticketTitle} />
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
                    <p className="font-semibold">
                      {originalTicket && originalTicket.name}
                    </p>
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
                      onChange={(e) => {
                        setTicketTitle(e.target.value);
                      }}
                    />
                    {/* 1st row */}
                    <div className="flex items-center">
                      <PiHandPalmBold className="h-5 w-5" />
                      <label className="text-sm ml-1 font-semibold">
                        Raised By
                      </label>
                    </div>

                    <div className="flex items-center input input-sm bg-white border-1 border-base-200 rounded-lg">
                      {ticketCreator && (
                        <>
                          <img
                            src={ticketCreator.profilePicture}
                            alt=""
                            className="h-4 w-4 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="ml-2 text-xs font-semibold truncate">
                            {ticketCreator.firstName} {ticketCreator.lastName}
                          </span>
                        </>
                      )}
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
                        data={userList}
                        id={"user-selector"}
                        open={isUserSelectorOpen}
                        onToggle={() =>
                          setIsUserSelectorOpen(!isUserSelectorOpen)
                        }
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
                      <label className="text-sm ml-1 font-semibold">
                        Created on
                      </label>
                    </div>

                    <div>
                      <input
                        type="date"
                        className="font-semibold disabled:bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                        value={ticketCreatedOn}
                        disabled
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
                        options={tagList}
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
                        data={ticketList}
                        id={"ticket-selector"}
                        open={isTicketSelectorOpen}
                        onToggle={() =>
                          setIsTicketSelectorOpen(!isTicketSelectorOpen)
                        }
                        onChange={setTicketBlockedBy}
                        selectedValue={ticketList.find(
                          (option) => option.id === ticketBlockedBy
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
                      <label className="text-sm ml-1 font-semibold">
                        Status
                      </label>
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
                      <div className="avatar-group -space-x-2 group">
                        {watcherList.length >= 3
                          ? watcherList.slice(0, 3).map((user) => (
                              <div
                                className="avatar border-none group-hover:opacity-50 transition-all duration-300 cursor-pointer"
                                key={user.user.id}
                                onClick={() => window.watcherModal.showModal()}
                              >
                                <div className="w-8">
                                  <img
                                    src={user.user.profilePicture}
                                    alt="watcher"
                                  />
                                </div>
                              </div>
                            ))
                          : watcherList.map((user) => (
                              <div
                                className="avatar border-none group-hover:opacity-50 transition-all duration-300 cursor-pointer"
                                key={user.user.id}
                                onClick={() => window.watcherModal.showModal()}
                              >
                                <div className="w-8">
                                  <img
                                    src={user.user.profilePicture}
                                    alt="watcher"
                                  />
                                </div>
                              </div>
                            ))}
                        {watcherList.length - 3 > 0 ? (
                          <div
                            className="avatar placeholder border-none"
                            onClick={() => window.watcherModal.showModal()}
                          >
                            <div className="w-8 bg-base-100 text-neutral">
                              <span className="text-xs font-semibold">
                                {watcherList.length - 3}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <WatcherModal
                        watcherList={watcherList}
                        setWatcherList={setWatcherList}
                        userId={user.id}
                        ticketId={ticketId}
                      />
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
    </>
  );
}

export default Ticket;
