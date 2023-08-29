import { useNavigate } from "react-router-dom";
import jordan from "../assets/landing/jordan.jpeg";

function DocumentsTableItem(props) {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-base-100 w-full transition-all duration-300">
      <td>
        <div className="flex items-center">
          <button
            className="btn btn-ghost btn-sm normal-case font-semibold"
            onClick={() => navigate(`/documents/${props.documentId}`)}
          >
            {props.documentTitle}
          </button>
        </div>
      </td>
      <td>
        <p className="font-semibold">{props.documentCreatedOn}</p>
      </td>
      <td className="flex items-center gap-2">
        <div className="avatar">
          <div className="w-8 object-contain rounded-full">
            <img src={jordan} alt="avatar" />
          </div>
        </div>
        <button className="btn btn-sm mr-4 btn-ghost normal-case font-semibold flex-shrink-0">
          {props.documentCreatedBy}
        </button>
      </td>
      <td>
        <p className="font-semibold badge">{props.documentTag}</p>
      </td>

      <td>
        {props.documentRelatedTicket && (
          <button
            className="btn btn-ghost btn-sm normal-case font-semibold"
            onClick={() =>
              navigate(`/tickets/${props.documentRelatedTicket.ticketId}`)
            }
          >
            {props.documentRelatedTicket.ticketTitle}
          </button>
        )}
      </td>
    </tr>
  );
}

export default DocumentsTableItem;
