import { useState } from "react";
import { motion } from "framer-motion";
import jordan from "../assets/landing/jaelyn.jpg";
import {
  PiPencilLineBold,
  PiCalendarPlusBold,
  PiTagBold,
  PiLinkSimpleBold,
} from "react-icons/pi";
import MarkdownEditor from "./MarkdownEditor";
import Creatable from "react-select/creatable";
import TicketSelector from "./TicketSelector";
import { tagDefaultOptions, colourStyles } from "../utils/selectSettings";

function AddDocumentCard(props) {
  //TODO: render out tickets dynamically (including a default N.A null option)
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentCreatedOn, setDocumentCreatedOn] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [documentTag, setDocumentTag] = useState("");
  const [documentRelatedTicket, setDocumentRelatedTicket] = useState(null);
  const [documentContent, setDocumentContent] = useState("");

  const handleChangeTag = (value) => {
    setDocumentTag(value);
  };

  const handleCreateTag = (inputValue) => {
    console.log(inputValue);
  };

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

  const handleAddDocument = (e) => {
    console.log({
      documentTitle: documentTitle,
      documentCreatedBy: "userId",
      documentCreatedOn: documentCreatedOn,
      documentTag: documentTag.label,
      documentRelatedTicket: documentRelatedTicket,
      documentContent: documentContent,
    });
    // TODO: set information to backend
    // setTicketAssignee(null);
    // setContent("");
    props.setAddDocument(false);
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
                src={jordan}
                alt=""
                className="h-4 w-4 rounded-full object-cover flex-shrink-0"
              />
              <span className="ml-2 text-xs font-semibold truncate">
                Jaelyn Teo
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
                className="cursor-pointer font-semibold bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                defaultValue={documentCreatedOn}
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
                options={tagDefaultOptions}
                value={documentTag}
                onChange={handleChangeTag}
                onCreateOption={(input) => handleCreateTag(input)}
                styles={colourStyles}
                placeholder=""
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
                data={tickets}
                id={"ticket-selector"}
                open={isTicketSelectorOpen}
                onToggle={() => setIsTicketSelectorOpen(!isTicketSelectorOpen)}
                onChange={setDocumentRelatedTicket}
                selectedValue={tickets.find(
                  (option) => option.value === documentRelatedTicket
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
          onClick={() => props.setAddDocument(false)}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default AddDocumentCard;
