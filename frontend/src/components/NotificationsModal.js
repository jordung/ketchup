import { useNavigate } from "react-router-dom";

function NotificationsModal(props) {
  const navigate = useNavigate();
  const deleteMe = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <dialog id="notificationsModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white max-w-xs">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Notifications</h3>
        <div className="max-h-[70vw] min-h-max overflow-y-auto flex flex-col gap-2 mt-2">
          {deleteMe.map((item) => (
            <div key={item}>
              {/* Notification Card */}
              <div className="flex gap-2 border-b pb-2">
                <div className="bg-base-100 rounded-full h-8 w-8 flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <p className="text-sm">
                    <span className="font-semibold hover:text-base-300 transition-all duration-300 cursor-pointer">
                      Betty Willow
                    </span>{" "}
                    has assigned you a new{" "}
                    <span className="font-semibold hover:text-base-300 transition-all duration-300 cursor-pointer">
                      ticket
                    </span>
                    .
                  </p>
                  <p className="text-xs">2h ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default NotificationsModal;
