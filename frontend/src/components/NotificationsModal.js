import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NotificationsModal(props) {
  const navigate = useNavigate();

  return (
    <dialog id="notificationsModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white max-w-xs">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Notifications</h3>
        <p className="pt-4 text-sm">Notifications component</p>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default NotificationsModal;
