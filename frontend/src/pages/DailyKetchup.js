import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { PiPlusCircleBold } from "react-icons/pi";
import { v4 as uuidv4 } from "uuid";
import MoodBar from "../components/MoodBar";
import AgendaItem from "../components/AgendaItem";
import UpdateItem from "../components/UpdateItem";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function DailyKetchup() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState(null);
  const [agendaItems, setAgendaItems] = useState([
    {
      documentId: null,
      flagId: null,
      id: uuidv4(),
      ticketId: null,
      content: "",
    },
  ]);
  const [updateItems, setUpdateItems] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getInformation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/daily/${user.organisationId}`
        );
        // console.log(response);
        setTicketList([
          { name: "N/A", id: null },
          ...response.data.data.allTickets,
        ]);
        setDocumentList([
          { name: "N/A", id: null },
          ...response.data.data.allDocuments,
        ]);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    getInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitDailyKetchup = async () => {
    try {
      let hasError = false;

      if (mood === null) {
        toast.error("Error: Mood must not be empty");
        hasError = true;
      }

      if (agendaItems.length === 0) {
        toast.error("Error: There must be at least 1 agenda");
        hasError = true;
      } else {
        agendaItems.forEach((agenda) => {
          if (agenda.content.trim() === "") {
            toast.error("Error: Agenda content must not be empty");
            hasError = true;
          }
          if (agenda.flagId === null) {
            toast.error("Error: Missing flag for agenda");
            hasError = true;
          }
        });
      }

      if (updateItems.length > 0) {
        updateItems.forEach((update) => {
          if (update.content.trim() === "") {
            toast.error("Error: Update content must not be empty");
            hasError = true;
          }
          if (update.flagId === null) {
            toast.error("Error: Missing flag for update");
            hasError = true;
          }
        });
      }

      if (hasError) {
        // If any error occurred, do not send the request to the API
        return;
      }

      setIsSubmitting(true);
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/daily`,
        {
          userId: user.id,
          organisationId: user.organisationId,
          reactionId: mood,
          agendas: agendaItems,
          updates: updateItems,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(response.data.msg);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleAddAgendaItem = () => {
    const newAgendaItem = {
      id: uuidv4(),
      content: "",
      ticketId: null,
      documentId: null,
      flagId: null,
    };
    setAgendaItems([...agendaItems, newAgendaItem]);
  };

  const handleRemoveAgendaItem = (id) => {
    const updatedAgendaItems = agendaItems.filter((agenda) => agenda.id !== id);
    setAgendaItems(updatedAgendaItems);
  };

  const handleAgendaContentChange = (id, newContent) => {
    const updatedAgendaItems = agendaItems.map((agenda) => {
      if (agenda.id === id) {
        return { ...agenda, content: newContent };
      }
      return agenda;
    });
    setAgendaItems(updatedAgendaItems);
  };

  const handleAgendaFlagIdChange = (id, newFlagId) => {
    const updatedAgendaItems = agendaItems.map((agenda) => {
      if (agenda.id === id) {
        return { ...agenda, flagId: newFlagId };
      }
      return agenda;
    });
    setAgendaItems(updatedAgendaItems);
  };

  const handleAgendaTicketIdChange = (id, newTicketId) => {
    const updatedAgendaItems = agendaItems.map((agenda) => {
      if (agenda.id === id) {
        return { ...agenda, ticketId: newTicketId };
      }
      return agenda;
    });
    setAgendaItems(updatedAgendaItems);
  };

  const handleAgendaDocumentIdChange = (id, newDocumentId) => {
    const updatedAgendaItems = agendaItems.map((agenda) => {
      if (agenda.id === id) {
        return { ...agenda, documentId: newDocumentId };
      }
      return agenda;
    });
    setAgendaItems(updatedAgendaItems);
  };

  const handleAddUpdateItem = () => {
    const newUpdateItem = {
      id: uuidv4(),
      content: "",
      ticketId: null,
      documentId: null,
      flagId: null,
    };
    setUpdateItems([...updateItems, newUpdateItem]);
  };

  const handleRemoveUpdateItem = (id) => {
    const updatedUpdateItems = updateItems.filter((update) => update.id !== id);
    setUpdateItems(updatedUpdateItems);
  };

  const handleUpdateContentChange = (id, newContent) => {
    const updatedUpdateItems = updateItems.map((update) => {
      if (update.id === id) {
        return { ...update, content: newContent };
      }
      return update;
    });
    setUpdateItems(updatedUpdateItems);
  };

  const handleUpdateFlagIdChange = (id, newFlagId) => {
    const updatedUpdateItems = updateItems.map((update) => {
      if (update.id === id) {
        return { ...update, flagId: newFlagId };
      }
      return update;
    });
    setUpdateItems(updatedUpdateItems);
  };

  const handleUpdateTicketIdChange = (id, newTicketId) => {
    const updatedUpdateItems = updateItems.map((update) => {
      if (update.id === id) {
        return { ...update, ticketId: newTicketId };
      }
      return update;
    });
    setUpdateItems(updatedUpdateItems);
  };

  const handleUpdateDocumentIdChange = (id, newDocumentId) => {
    const updatedUpdateItems = updateItems.map((update) => {
      if (update.id === id) {
        return { ...update, documentId: newDocumentId };
      }
      return update;
    });
    setUpdateItems(updatedUpdateItems);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen pt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
        {/* Header */}
        <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
          <h2 className="text-2xl font-bold">Daily Ketchup</h2>
          <button
            className="btn btn-neutral normal-case rounded-xl btn-sm"
            onClick={submitDailyKetchup}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>

        {/* Body */}
        <AnimatePresence>
          <motion.div
            layout
            className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
          >
            <motion.div
              layout
              className="flex flex-col gap-4 shadow-xl p-4 rounded-lg min-h-full"
            >
              <motion.h3 layout className="text-xl font-semibold">
                My Ketchup
              </motion.h3>

              <motion.div layout className="flex flex-col gap-4 items-start">
                <p className="text-lg font-semibold">Mood</p>
                <MoodBar mood={mood} setMood={setMood} />
              </motion.div>

              {/* Agenda */}
              <motion.div
                layout
                className="flex flex-col gap-2 mt-4 items-start w-full xl:max-w-xl"
              >
                <motion.div layout="position" className="flex flex-col">
                  <p className="text-lg font-semibold">Agenda</p>
                  <p className="text-sm font-semibold text-base-300">
                    Main focus of the day!
                  </p>
                </motion.div>
                <motion.div layout className="w-full">
                  {agendaItems.map((agendaItem) => (
                    <AgendaItem
                      key={agendaItem.id}
                      agendaItem={agendaItem}
                      handleAgendaContentChange={handleAgendaContentChange}
                      handleAgendaFlagIdChange={handleAgendaFlagIdChange}
                      handleAgendaTicketIdChange={handleAgendaTicketIdChange}
                      handleAgendaDocumentIdChange={
                        handleAgendaDocumentIdChange
                      }
                      handleRemoveAgendaItem={handleRemoveAgendaItem}
                      ticketList={ticketList}
                      documentList={documentList}
                    />
                  ))}
                  <motion.div layout="position" className="mt-2">
                    <button
                      className="btn btn-ghost normal-case text-primary font-semibold btn-xs p-0"
                      onClick={handleAddAgendaItem}
                    >
                      <PiPlusCircleBold className="h-4 w-4 text-primary" />
                      Add
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Update */}
              <motion.div
                layout
                className="flex flex-col gap-2 mt-4 items-start w-full xl:max-w-xl"
              >
                <motion.div layout="position" className="flex flex-col">
                  <p className="text-lg font-semibold">Updates</p>
                  <p className="text-sm font-semibold text-base-300">
                    Completed work since last Ketchup!
                  </p>
                </motion.div>
                <motion.div layout className="w-full">
                  {updateItems.map((updateItem) => (
                    <UpdateItem
                      key={updateItem.id}
                      updateItem={updateItem}
                      handleUpdateContentChange={handleUpdateContentChange}
                      handleUpdateFlagIdChange={handleUpdateFlagIdChange}
                      handleUpdateTicketIdChange={handleUpdateTicketIdChange}
                      handleUpdateDocumentIdChange={
                        handleUpdateDocumentIdChange
                      }
                      handleRemoveUpdateItem={handleRemoveUpdateItem}
                      ticketList={ticketList}
                      documentList={documentList}
                    />
                  ))}
                  <motion.div layout="position" className="mt-2">
                    <button
                      className="btn btn-ghost normal-case text-primary font-semibold btn-xs p-0"
                      onClick={handleAddUpdateItem}
                    >
                      <PiPlusCircleBold className="h-4 w-4 text-primary" />
                      Add
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          layout="position"
          className="w-full flex justify-end pt-4 pb-8"
        >
          <button
            className="btn btn-neutral normal-case rounded-xl btn-sm"
            onClick={submitDailyKetchup}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </motion.div>
      </div>
    </>
  );
}

export default DailyKetchup;
