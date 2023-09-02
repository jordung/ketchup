import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function WatcherModal(props) {
  const { watcherList, setWatcherList, userId, ticketId } = props;
  const accessToken = localStorage.getItem("accessToken");
  const [isWatching, setIsWatching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsWatching(watcherList.some((user) => user.user.id === userId));
  }, [watcherList, userId]);

  const handleAddWatch = async () => {
    try {
      setIsSending(true);
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/watch/ticket`,
        {
          userId: userId,
          ticketId: parseInt(ticketId),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(response.data.msg);
      setWatcherList(response.data.data);
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleRemoveWatch = async () => {
    try {
      setIsSending(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_API}/watch/ticket`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            userId: userId,
            ticketId: parseInt(ticketId),
          },
        }
      );
      toast.success(response.data.msg);
      setWatcherList(response.data.data);
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <dialog id="watcherModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white max-w-xs">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Watchers</h3>
        <p className="text-sm italic">Users watching: {watcherList.length}</p>
        <div className="mt-2 max-h-[40vh] overflow-y-auto">
          {watcherList.map((watcher) => (
            <div key={watcher.user.id} className="mb-4 flex items-center gap-2">
              <img
                src={watcher.user.profilePicture}
                alt="watcher"
                className="w-10 h-10 object-cover rounded-full"
              />
              <p className="text-sm font-semibold">
                {watcher.user.firstName} {watcher.user.lastName}
              </p>
            </div>
          ))}
        </div>
        <button
          className={`btn btn-sm font-semibold text-sm normal-case w-full ${
            isWatching ? "text-neutral" : "btn-neutral text-white"
          }`}
          disabled={isSending}
          onClick={isWatching ? handleRemoveWatch : handleAddWatch}
        >
          {isWatching ? "Stop" : "Start"} watching
        </button>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default WatcherModal;
