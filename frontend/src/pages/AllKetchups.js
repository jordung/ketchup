import { useContext, useEffect, useState } from "react";
import KetchupContainer from "../components/KetchupContainer";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";
import axios from "axios";
import { UserContext } from "../App";
import { toast } from "react-toastify";

function AllKetchups() {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const [allKetchupsByDate, setAllKetchupsByDate] = useState([]);

  useEffect(() => {
    const getAllKetchups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/ketchups/${user.organisationId}`
        );
        setAllKetchupsByDate(response.data.data.groupKetchupsByDate);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    getAllKetchups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Spinner />}
      <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
        {/* Header */}
        <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
          <h2 className="text-2xl font-bold">All Ketchups</h2>
        </div>

        {/* Body */}
        <motion.div
          layout
          className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
        >
          {/* <motion.div layout="position" className="flex flex-col gap-4"> */}
          <motion.div layout="position" className="flex flex-col gap-4">
            {allKetchupsByDate.map((ketchup) => (
              <KetchupContainer
                key={ketchup.date}
                ketchupDate={ketchup.date}
                dailyKetchups={ketchup.getKetchupReactions}
                usersWithoutKetchups={ketchup.usersWithoutKetchups}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default AllKetchups;
