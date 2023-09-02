import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DeleteDocumentModal(props) {
  const { documentId, documentTitle } = props;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const handleDeleteDocument = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_API}/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(response.data.msg);
      navigate("/documents");
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <dialog id="deleteDocumentModal" className="modal backdrop-blur-sm">
      <form method="dialog" className="modal-box bg-white max-w-xs">
        <button className="btn btn-sm btn-circle btn-ghost outline-none absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg">Delete Document</h3>
        <p className="pt-4 text-sm">
          Are you sure you want to delete this document:{" "}
          <span className="font-semibold underline">{documentTitle}</span>?
        </p>
        <p className="pt-4 text-sm">
          This will delete the document permanently. You cannot undo this
          action.
        </p>
        <button
          className="btn btn-sm btn-error font-semibold text-sm normal-case w-full mt-4 text-white"
          onClick={handleDeleteDocument}
        >
          Yes, delete
        </button>
        <button className="btn btn-sm font-semibold text-sm normal-case w-full mt-2">
          Cancel
        </button>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default DeleteDocumentModal;
