import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import jordan from "../assets/landing/jaelyn.jpg";
import {
  PiCalendarPlusBold,
  PiCalendarBlankBold,
  PiTagBold,
  PiLinkSimpleBold,
  PiPencilLineBold,
} from "react-icons/pi";
import MarkdownEditor from "../components/MarkdownEditor";
import Creatable from "react-select/creatable";
import TicketSelector from "../components/TicketSelector";
import { LoadingContext } from "../App";

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

function Document() {
  //TODO: render out tickets dynamically (including a default N.A null option)
  //TODO: add in Watching functionality
  const { documentId } = useParams();
  const navigate = useNavigate();

  const { setLoading } = useContext(LoadingContext);

  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentCreatedBy, setDocumentCreatedBy] = useState("1");
  const [documentRelatedTicket, setDocumentRelatedTicket] = useState("");
  const [documentCreatedOn, setDocumentCreatedOn] = useState();
  const [documentUpdatedOn, setDocumentUpdatedOn] = useState();
  const [documentTag, setDocumentTag] = useState("");

  const [documentContent, setDocumentContent] = useState("");

  useEffect(() => {
    const data = {
      documentId: 1,
      documentTitle: "Frontend Setup Docs",
      documentCreatedBy: "Alice Spring",
      documentCreatedOn: "2023-08-28",
      documentUpdatedOn: "2023-08-29",
      documentRelatedTicket: {
        ticketId: 2,
        documentTitle: "Feature Request",
      },
      documentTag: {
        label: "Bugfix",
        value: "Bugfix",
      },
      documentContent: "# Testing title \n * item 1 \n * item 2 \n * item 3",
    };
    setDocumentTitle(data.documentTitle);
    setDocumentCreatedBy(data.documentCreatedBy);
    setDocumentRelatedTicket(data.documentRelatedTicket.ticketId);
    setDocumentCreatedOn(data.documentCreatedOn);
    setDocumentUpdatedOn(data.documentUpdatedOn);
    setDocumentTag(data.documentTag);
    setDocumentContent(data.documentContent);
    setLoading(false);
  }, []);

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
      value: 1, // ticketId,
    },
    {
      title: "BE - Finish ERD Diagrams",
      value: 2,
    },
  ];

  const handleSaveDocument = (e) => {
    //TODO: listen for changes then allow button?
    console.log({
      documentTitle: documentTitle,
      documentCreatedBy: documentCreatedBy,
      documentCreatedOn: documentCreatedOn,
      documentRelatedTicket: documentRelatedTicket,
      documentTag: documentTag,
      documentContent: documentContent,
    });
    // TODO: set information to backend
  };

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Document</h2>
        <button
          className="btn btn-neutral normal-case rounded-xl btn-sm"
          onClick={handleSaveDocument}
        >
          Save Changes
        </button>
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
                    onClick={() => navigate("/documents")}
                  >
                    Documents
                    {/* Created on, created by, tag, ticket */}
                  </span>
                </li>
                <li>
                  <p className="font-semibold">{documentTitle}</p>
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
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                  {/* 1st row */}
                  <div className="flex items-center">
                    <PiPencilLineBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Created By
                    </label>
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
                    <PiCalendarPlusBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Created on
                    </label>
                  </div>

                  <div className="flex items-center input input-sm bg-white border-1 border-base-200 rounded-lg">
                    <span className="text-xs font-semibold truncate">
                      {documentCreatedOn}
                    </span>
                  </div>

                  {/* 3rd row */}
                  <div className="flex items-center">
                    <PiCalendarBlankBold className="h-5 w-5" />
                    <label className="text-sm ml-1 font-semibold">
                      Last updated
                    </label>
                  </div>

                  <div className="flex items-center input input-sm bg-white border-1 border-base-200 rounded-lg">
                    <span className="text-xs font-semibold truncate">
                      {documentUpdatedOn}
                    </span>
                  </div>

                  {/* 4th row */}
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

                  {/* 5th row */}
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
                      onToggle={() =>
                        setIsTicketSelectorOpen(!isTicketSelectorOpen)
                      }
                      onChange={setDocumentRelatedTicket}
                      selectedValue={tickets.find(
                        (option) => option.value === documentRelatedTicket
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full min-h-[5rem] xl:min-h-0 xl:mb-2 xl:mt-6">
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
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Document;
