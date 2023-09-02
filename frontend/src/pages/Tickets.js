import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../App";
import TicketsTable from "../components/TicketsTable";
import AddTicketCard from "../components/AddTicketCard";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "../components/Spinner";

function Tickets() {
  // const { setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);
  const [allTickets, setAllTickets] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [addTicket, setAddTicket] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllTickets = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/tickets/${user.organisationId}`
        );
        setAllTickets(response.data.data.allTickets);
        setAllTags(response.data.data.allTags);
        setAllUsers(response.data.data.allUsers);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.msg);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    getAllTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {" "}
      {loading && <Spinner />}
      <div className="h-screen pt-4 px-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
        {/* Header */}
        <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
          <h2 className="text-2xl font-bold">Tickets</h2>
          <button
            className="btn btn-neutral normal-case rounded-xl btn-sm"
            onClick={() => setAddTicket(!addTicket)}
          >
            Add Ticket
          </button>
        </div>

        {/* Body */}
        <motion.div
          layout
          className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
        >
          {addTicket && (
            <AddTicketCard
              setAddTicket={setAddTicket}
              allUsers={allUsers}
              allTags={allTags}
              allTickets={allTickets}
              setAllUsers={setAllUsers}
              setAllTags={setAllTags}
              setAllTickets={setAllTickets}
            />
          )}
          <motion.div layout="position" className="flex flex-col gap-4">
            <TicketsTable allTickets={allTickets} />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Tickets;
