import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  PiPencilLineBold,
  PiCalendarPlusBold,
  PiTagBold,
  PiLinkSimpleBold,
} from "react-icons/pi";
import MarkdownEditor from "./MarkdownEditor";
import Creatable from "react-select/creatable";
import TicketSelector from "./TicketSelector";
import { colourStyles } from "../utils/selectSettings";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { formatOneTag, formatTags } from "../utils/formatTags";
import axios from "axios";

function AddDocumentCard(props) {
  const { setAddDocument, allTags, setAllTags, allTickets, setAllDocuments } =
    props;

  const ticketList = [{ name: "N/A", id: null }, ...allTickets];

  const { user } = useContext(UserContext);

  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);
  const [tagList, setTagList] = useState(formatTags(allTags));

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentCreatedOn, setDocumentCreatedOn] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [documentTag, setDocumentTag] = useState(null);
  const [documentRelatedTicket, setDocumentRelatedTicket] = useState(null);
  const [documentContent, setDocumentContent] = useState("");

  const handleChangeTag = (value) => {
    setDocumentTag(value);
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
      setDocumentTag(
        formatOneTag(
          response.data.data.find((obj) => obj.name.includes("#" + inputValue))
        )
      );
    } catch (error) {
      toast.error(`${error.response.data.msg}`);
    }
  };

  const handleAddDocument = async (e) => {
    if (!documentTitle.trim().length > 0) {
      toast.error("Document Title must not be blank.");
      return;
    } else {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DB_API}/documents`,
          {
            organisationId: user.organisationId,
            creatorId: user.id,
            tagId: documentTag ? documentTag.value : null,
            ticketId: documentRelatedTicket,
            name: documentTitle,
            body: documentContent,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response);
        setAllDocuments(response.data.data.allDocuments);
        setAllTags(response.data.data.allTags);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setAddDocument(false);
      }
    }
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
      <h3 className="font-bold text-lg">Add Document</h3>
      <div className="w-full flex flex-col gap-4 xl:flex-row justify-start">
        <div className="w-full xl:w-1/4 my-2">
          <div className="grid grid-cols-2 gap-x-0 gap-y-2 xl:gap-4 max-w-xs">
            <input
              type="text"
              placeholder="Document Title"
              className="input input-md font-semibold col-span-2"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
            />
            {/* 1st row */}
            <div className="flex items-center">
              <PiPencilLineBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Created By</label>
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

            {/* 2rd row */}
            <div className="flex items-center">
              <PiCalendarPlusBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Created on</label>
            </div>

            <div>
              <input
                type="date"
                className="cursor-pointer font-semibold disabled:bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                defaultValue={documentCreatedOn}
                disabled
                onChange={(e) => setDocumentCreatedOn(e.target.value)}
              />
            </div>

            {/* 3rd row */}
            <div className="flex items-center">
              <PiTagBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">Tag</label>
            </div>

            <div className="cursor-pointer">
              <Creatable
                isClearable
                className="font-semibold text-xs cursor-pointer"
                options={tagList}
                value={documentTag}
                onChange={handleChangeTag}
                onCreateOption={(input) => handleCreateTag(input)}
                styles={colourStyles}
                placeholder="Search..."
              />
            </div>

            {/* 4th row */}
            <div className="flex items-center">
              <PiLinkSimpleBold className="h-5 w-5" />
              <label className="text-sm ml-1 font-semibold">
                Related Ticket
              </label>
            </div>

            <div>
              <TicketSelector
                data={ticketList}
                id={"ticket-selector"}
                open={isTicketSelectorOpen}
                onToggle={() => setIsTicketSelectorOpen(!isTicketSelectorOpen)}
                onChange={setDocumentRelatedTicket}
                selectedValue={ticketList.find(
                  (option) => option.id === documentRelatedTicket
                )}
              />
            </div>
          </div>
        </div>
        <div className="w-full xl:w-3/4 min-h-[5rem] xl:min-h-0 xl:mb-2 xl:mt-6">
          {/* Markdown */}
          <p className="font-bold text-md flex items-center gap-2">
            Document Content{" "}
            <span className="text-xs uppercase badge badge-neutral badge-md border-0">
              editor
            </span>
          </p>
          <MarkdownEditor
            content={documentContent}
            setContent={setDocumentContent}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-primary btn-sm normal-case mt-2"
          onClick={handleAddDocument}
        >
          Add
        </button>
        <button
          className="btn btn-base-100 btn-sm normal-case mt-2"
          onClick={() => setAddDocument(false)}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default AddDocumentCard;
