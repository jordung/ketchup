import { useContext, useEffect, useState } from "react";
import KetchupContainer from "../components/KetchupContainer";
import PostContainer from "../components/PostContainer";
import { motion } from "framer-motion";
import NewPostCard from "../components/NewPostCard";
import { LoadingContext, UserContext } from "../App";
import VerifyEmailOverlay from "../components/VerifyEmailOverlay";

function Home() {
  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);

  const [composePost, setComposePost] = useState(false);

  console.log(user);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Home</h2>
        <button
          className="btn btn-neutral normal-case rounded-xl btn-sm"
          onClick={() => setComposePost(!composePost)}
        >
          New Post
        </button>
      </div>

      {/* Body */}
      <motion.div
        layout
        className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        {composePost && <NewPostCard setComposePost={setComposePost} />}
        <motion.div layout="position" className="flex flex-col gap-4">
          <KetchupContainer />
          <PostContainer />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
