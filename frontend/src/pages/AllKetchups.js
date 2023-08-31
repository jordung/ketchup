import { useContext, useEffect } from "react";
import KetchupContainer from "../components/KetchupContainer";
import { motion } from "framer-motion";
import { LoadingContext } from "../App";

function AllKetchups() {
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        <motion.div layout="position" className="flex flex-col gap-4">
          {/* <KetchupContainer /> */}
          {/* <KetchupContainer /> */}
          {/* <KetchupContainer /> */}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AllKetchups;
