import { useContext, useEffect, useState } from "react";
import KetchupContainer from "../components/KetchupContainer";
import { motion } from "framer-motion";
import NewPostCard from "../components/NewPostCard";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import PostContainer from "../components/PostContainer";

function Home() {
  const { user } = useContext(UserContext);
  // const { setLoading } = useContext(LoadingContext);

  const [composePost, setComposePost] = useState(false);
  const [dailyKetchups, setDailyKetchups] = useState([]);
  const [usersWithoutKetchups, setUsersWithoutKetchups] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(user);

  useEffect(() => {
    // setLoading(true);
    const getHomeFeed = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/home/${user.id}`
        );
        console.log(response.data.data);
        setDailyKetchups(response.data.data.getKetchupReactions);
        setUsersWithoutKetchups(response.data.data.usersWithoutKetchups);
        setAllPosts(response.data.data.getPostReactions);
      } catch (error) {
        console.log(error);
        toast.error(`${error.response.data.msg}`);
      } finally {
        setLoading(false);
      }
    };

    getHomeFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {loading && <Spinner />}
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
        className="mt-2 pb-4 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        {composePost && (
          <NewPostCard
            setComposePost={setComposePost}
            setAllPosts={setAllPosts}
            organisationId={user.organisationId}
            userId={user.id}
            setLoading={setLoading}
          />
        )}
        <motion.div
          layout="position"
          className="flex flex-col gap-4 xl:flex-row xl:items-start"
        >
          {/* Container for Today's Ketchup */}
          <KetchupContainer
            dailyKetchups={dailyKetchups}
            usersWithoutKetchups={usersWithoutKetchups}
          />
          <PostContainer allPosts={allPosts} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
