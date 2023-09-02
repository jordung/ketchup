import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PiCalendarPlusBold,
  PiCalendarBlankBold,
  PiTagBold,
  PiLinkSimpleBold,
  PiPencilLineBold,
  PiEyeBold,
} from "react-icons/pi";
import MarkdownEditor from "../components/MarkdownEditor";
import Creatable from "react-select/creatable";
import TicketSelector from "../components/TicketSelector";
import { UserContext } from "../App";
import { colourStyles } from "../utils/selectSettings";
import Spinner from "../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";
import { formatOneTag, formatTags } from "../utils/formatTags";
import moment from "moment";
import DocumentWatcherModal from "../components/DocumentWatcherModal";
import DeleteDocumentModal from "../components/DeleteDocumentModal";

function Document() {
  const { documentId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ticketList, setTicketList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [watcherList, setWatcherList] = useState([]);
  const [originalDocument, setOriginalDocument] = useState(null);
  const [disableUpdateButton, setDisableUpdateButton] = useState(true);

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentCreatedBy, setDocumentCreatedBy] = useState(null);
  const [documentRelatedTicket, setDocumentRelatedTicket] = useState("");
  const [documentCreatedOn, setDocumentCreatedOn] = useState("");
  const [documentUpdatedOn, setDocumentUpdatedOn] = useState("");
  const [documentTag, setDocumentTag] = useState(null);

  const [documentContent, setDocumentContent] = useState("");

  useEffect(() => {
    const getDocumentInformation = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/documents/view/${documentId}`
        );

        setTagList(formatTags(response.data.data.allTags));
        setTicketList([
          { name: "N/A", id: null },
          ...response.data.data.allTickets,
        ]);
        setWatcherList(response.data.data.allWatchers);
        setOriginalDocument(response.data.data.document);

        setDocumentTitle(response.data.data.document.name);
        setDocumentCreatedBy(response.data.data.document.creator);
        setDocumentRelatedTicket(
          response.data.data.document.document_tickets.length > 0
            ? response.data.data.document.document_tickets[0].ticketId
            : null
        );
        setDocumentCreatedOn(
          moment(response.data.data.document.createdAt).format("yyyy-MM-DD")
        );
        setDocumentUpdatedOn(
          moment(response.data.data.document.updatedAt).format("yyyy-MM-DD")
        );
        setDocumentTag(
          response.data.data.document.tag && {
            value: response.data.data.document.tag.id,
            label: response.data.data.document.tag.name,
          }
        );
        setDocumentContent(response.data.data.document.body);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    getDocumentInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (!loading) {
      const hasChanges =
        documentTitle !== originalDocument?.name ||
        (documentTag && documentTag.value) !== originalDocument?.tagId ||
        documentRelatedTicket !==
          (originalDocument?.document_tickets[0]?.ticketId || null) ||
        documentContent?.trim() !== (originalDocument?.body?.trim() || "");
      setDisableUpdateButton(!hasChanges);
    }
  }, [
    documentTitle,
    documentTag,
    documentRelatedTicket,
    documentContent,
    loading,
    originalDocument,
  ]);

  const handleSaveDocument = async (e) => {
    const accessToken = localStorage.getItem("accessToken");

    if (documentTitle.trim() === "") {
      toast.error("Document Title must not be empty!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/documents/view/${documentId}`,
        {
          name: documentTitle,
          tagId: documentTag?.value || null,
          body: documentContent,
          ticketId: documentRelatedTicket,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOriginalDocument(response.data.data.document);
      setDocumentTitle(response.data.data.document.name);
      setDocumentCreatedBy(response.data.data.document.creator);
      setDocumentRelatedTicket(
        response.data.data.document.document_tickets.length > 0
          ? response.data.data.document.document_tickets[0].ticketId
          : null
      );
      setDocumentCreatedOn(
        moment(response.data.data.document.createdAt).format("yyyy-MM-DD")
      );
      setDocumentUpdatedOn(
        moment(response.data.data.document.updatedAt).format("yyyy-MM-DD")
      );
      setDocumentTag(
        response.data.data.document.tag && {
          value: response.data.data.document.tag.id,
          label: response.data.data.document.tag.name,
        }
      );
      setDocumentContent(response.data.data.document.body);
      toast.success(response.data.msg);
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
          <h2 className="text-2xl font-bold">Document</h2>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-success normal-case rounded-xl btn-sm text-white"
              onClick={() => handleSaveDocument()}
              disabled={disableUpdateButton ? true : false}
            >
              Update
            </button>
            <button
              className="btn btn-error normal-case rounded-xl btn-sm text-white"
              onClick={() => window.deleteDocumentModal.showModal()}
            >
              Delete
            </button>
            <DeleteDocumentModal
              documentId={documentId}
              documentTitle={documentTitle}
            />
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
                      onClick={() => navigate("/documents")}
                    >
                      Documents
                      {/* Created on, created by, tag, ticket */}
                    </span>
                  </li>
                  <li>
                    <p className="font-semibold">
                      {originalDocument && originalDocument.name}
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
                      {documentCreatedBy && (
                        <>
                          <img
                            src={documentCreatedBy.profilePicture}
                            alt=""
                            className="h-4 w-4 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="ml-2 text-xs font-semibold truncate">
                            {documentCreatedBy.firstName}{" "}
                            {documentCreatedBy.lastName}
                          </span>
                        </>
                      )}
                    </div>

                    {/* 2nd row */}
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
                        value={documentCreatedOn}
                        disabled
                      />
                    </div>

                    {/* 3rd row */}
                    <div className="flex items-center">
                      <PiCalendarBlankBold className="h-5 w-5" />
                      <label className="text-sm ml-1 font-semibold">
                        Last updated
                      </label>
                    </div>

                    <div>
                      <input
                        type="date"
                        className="font-semibold disabled:bg-white border-base-200 text-xs input input-sm w-full rounded-lg text-center"
                        value={documentUpdatedOn}
                        disabled
                      />
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
                        options={tagList}
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
                        data={ticketList}
                        id={"ticket-selector"}
                        open={isTicketSelectorOpen}
                        onToggle={() =>
                          setIsTicketSelectorOpen(!isTicketSelectorOpen)
                        }
                        onChange={setDocumentRelatedTicket}
                        selectedValue={ticketList.find(
                          (option) => option.id === documentRelatedTicket
                        )}
                      />
                    </div>

                    {/* 6th row */}
                    <div className="flex items-center">
                      <PiEyeBold className="h-5 w-5" />
                      <label className="text-sm ml-1 font-semibold">
                        Watching
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="avatar-group -space-x-2 group"
                        onClick={() => window.documentWatcherModal.showModal()}
                      >
                        {watcherList.length >= 3
                          ? watcherList.slice(0, 3).map((user) => (
                              <div
                                className="avatar border-none group-hover:opacity-50 transition-all duration-300 cursor-pointer"
                                key={user.user.id}
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
                          <div className="avatar placeholder border-none">
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
                      <DocumentWatcherModal
                        watcherList={watcherList}
                        setWatcherList={setWatcherList}
                        userId={user.id}
                        documentId={documentId}
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
    </>
  );
}

export default Document;
