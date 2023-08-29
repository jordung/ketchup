import { useContext, useEffect, useState } from "react";
import KetchupContainer from "../components/KetchupContainer";
import PostContainer from "../components/PostContainer";
import { motion } from "framer-motion";
import NewPostCard from "../components/NewPostCard";
import { LoadingContext } from "../App";

function AllKetchups() {
  const [composePost, setComposePost] = useState(false);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(false);
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
        {composePost && <NewPostCard setComposePost={setComposePost} />}
        <motion.div layout="position" className="flex flex-col gap-4">
          <KetchupContainer />
          <KetchupContainer />
          <KetchupContainer />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AllKetchups;
