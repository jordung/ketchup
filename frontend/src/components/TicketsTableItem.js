import { useNavigate } from "react-router-dom";
import jordan from "../assets/landing/jordan.jpeg";
import { priorityConverter } from "../utils/priorityConverter";
import { statusConverter } from "../utils/statusConverter";

function TicketsTableItem(props) {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-base-100 w-full transition-all duration-300">
      <td>
        <div className="flex items-center">
          <button
            className="btn btn-ghost btn-sm normal-case font-semibold"
            onClick={() => navigate(`/tickets/${props.ticketId}`)}
          >
            {props.ticketTitle}
          </button>
        </div>
      </td>
      <td>
        <span
          className={`font-semibold ${
            (props.ticketPriority === 1 && "text-success") ||
            (props.ticketPriority === 2 && "text-warning") ||
            (props.ticketPriority === 3 && "text-error")
          }`}
        >
          {priorityConverter(props.ticketPriority)}
        </span>
      </td>
      <td className="flex items-center gap-2">
        <div className="avatar">
          <div className="w-8 object-contain rounded-full">
            <img src={jordan} alt="avatar" />
          </div>
        </div>
        <button className="btn btn-sm mr-4 btn-ghost normal-case font-semibold flex-shrink-0">
          {props.ticketAssignee}
        </button>
      </td>
      <td>
        <div className="flex items-center w-28">
          <span
            className={`font-semibold badge text-white ${
              (props.ticketStatus === 1 && "badge-error") ||
              (props.ticketStatus === 2 && "badge-warning") ||
              (props.ticketStatus === 3 && "badge-success")
            }`}
          >
            {statusConverter(props.ticketStatus)}
          </span>
        </div>
      </td>
      <td>
        <p className="font-semibold">{props.ticketCreatedOn}</p>
      </td>
      <td>
        <p className="font-semibold">{props.ticketDueDate}</p>
      </td>
      <td>
        <div className="flex items-center">
          {props.ticketBlockedBy && (
            <button
              className="btn btn-ghost btn-sm normal-case font-semibold"
              onClick={() =>
                navigate(`/tickets/${props.ticketBlockedBy.ticketId}`)
              }
            >
              {props.ticketBlockedBy.ticketTitle}
            </button>
          )}
        </div>
      </td>
      <td>
        <p className="font-semibold badge">{props.ticketTag}</p>
      </td>
    </tr>
  );
}

export default TicketsTableItem;
