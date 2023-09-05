import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import {
  PiFileTextBold,
  PiTicketBold,
  PiBabyBold,
  PiBellSlashBold,
} from "react-icons/pi";
import moment from "moment";

function NotificationsModal() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/notifications/${user.id}`
        );
        setNotifications(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getNotifications();
  }, [location.key, user.id]);

  function notificationCard(item) {
    switch (item.type) {
      case "document":
        return (
          <div className="flex gap-2 border-b pb-2">
            <div className="bg-accent h-8 w-8 rounded-full flex-shrink-0 p-2 flex items-center justify-center">
              <PiFileTextBold />
            </div>
            <div className="flex flex-col items-start">
              <p
                className="text-sm"
                onClick={() => {
                  window.notificationsModal.close();
                  navigate(`/documents/${item.documentId}`);
                }}
              >
                <span className="hover:text-base-300 transition-all duration-300 cursor-pointer">
                  {item.message}
                </span>
              </p>
              <p className="text-xs">{moment(item.createdAt).fromNow()}</p>
            </div>
          </div>
        );

      case "ticket":
        return (
          <div className="flex gap-2 border-b pb-2">
            <div className="bg-accent h-8 w-8 rounded-full flex-shrink-0 p-2 flex items-center justify-center">
              <PiTicketBold />
            </div>
            <div className="flex flex-col items-start">
              <p
                className="text-sm"
                onClick={() => {
                  window.notificationsModal.close();
                  navigate(`/tickets/${item.ticketId}`);
                }}
              >
                <span className="hover:text-base-300 transition-all duration-300 cursor-pointer">
                  {item.message}
                </span>
              </p>
              <p className="text-xs">{moment(item.createdAt).fromNow()}</p>
            </div>
          </div>
        );

      case "new joiner":
        return (
          <div className="flex gap-2 border-b pb-2">
            <div className="bg-accent h-8 w-8 rounded-full flex-shrink-0 p-2 flex items-center justify-center">
              <PiBabyBold />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm">
                <span className="hover:text-base-300 transition-all duration-300 cursor-pointer">
                  {item.message}
                </span>
              </p>
              <p className="text-xs">{moment(item.createdAt).fromNow()}</p>
            </div>
          </div>
        );

      default:
        return;
    }
  }

  return (
    <dialog id="notificationsModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white max-w-xs">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Notifications</h3>
        <div className="max-h-[70vw] min-h-max overflow-y-auto flex flex-col gap-2 mt-2">
          {notifications?.length > 0 ? (
            notifications.map((item) => (
              <div key={item.id}>{notificationCard(item)}</div>
            ))
          ) : (
            <div className="text-sm">
              <div className="flex gap-2 border-b pb-2 items-center">
                <div className="bg-accent h-8 w-8 rounded-full flex-shrink-0 p-2 flex items-center justify-center">
                  <PiBellSlashBold />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-sm">
                    There are currently no notifications!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default NotificationsModal;
