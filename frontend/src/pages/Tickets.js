import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingContext } from "../App";
import TicketsTable from "../components/TicketsTable";
import AddTicketCard from "../components/AddTicketCard";

function Tickets() {
  const { setLoading } = useContext(LoadingContext);
  const [addTicket, setAddTicket] = useState(false);

  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
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
        {addTicket && <AddTicketCard setAddTicket={setAddTicket} />}
        <motion.div layout="position" className="flex flex-col gap-4">
          <TicketsTable />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Tickets;
