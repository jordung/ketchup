import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DeleteUserModal(props) {
  const navigate = useNavigate();
  const { userId, firstName, lastName } = props;

  const [deleteInput, setDeleteInput] = useState("");
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);

  useEffect(() => {
    if (deleteInput === `${firstName} ${lastName}`) {
      setDisableDeleteButton(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteInput]);

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_API}/auth/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.log(response);
      setDeleteInput("");
      setDisableDeleteButton(true);
      toast.success(`${response.data.msg}`);
      navigate("/");
    } catch (error) {
      setDeleteInput("");
      setDisableDeleteButton(true);
      toast.error(`${error.response.data.msg}`);
    }
  };

  return (
    <dialog id="deleteUserModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Delete Confirmation</h3>
        <p className="pt-4 text-sm">
          Are you sure you want to delete your account?
        </p>
        <p className="pt-4 text-sm">
          All tickets, documents and ketchups that has already been created with
          this account will <span className="font-semibold">not</span> be
          deleted.
        </p>
        <p className="pt-4 text-sm">
          This will delete the account permanently. You cannot undo this action.
        </p>
        <p className="py-4 text-sm">
          Please type in{" "}
          <span className="font-bold">
            {firstName} {lastName}
          </span>{" "}
          to confirm.
        </p>
        <input
          type="text"
          className="input input-sm font-semibold w-full"
          value={deleteInput}
          onChange={(e) => setDeleteInput(e.target.value)}
        />
        <button
          className="btn btn-sm btn-error font-semibold text-sm normal-case w-full mt-4 text-white"
          disabled={disableDeleteButton}
          onClick={handleDeleteUser}
        >
          Yes, delete
        </button>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default DeleteUserModal;
