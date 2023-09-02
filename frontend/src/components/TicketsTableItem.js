import { useNavigate } from "react-router-dom";
import moment from "moment";

function TicketsTableItem(props) {
  const {
    ticketId,
    ticketTitle,
    ticketPriority,
    ticketAssignee,
    ticketCreator,
    ticketCreatedOn,
    ticketDueDate,
    ticketBlockedBy,
    ticketTag,
    ticketStatus,
  } = props;
  const navigate = useNavigate();

  // ticket name, creator_id, created_at - cannot be null

  return (
    <tr className="hover:bg-base-100 w-full transition-all duration-300">
      <td className="min-w-[180px]">
        <div className="flex items-center">
          <p
            className="font-semibold cursor-pointer hover:text-base-300 transition-all duration-300"
            onClick={() => navigate(`/tickets/${ticketId}`)}
          >
            {ticketTitle}
          </p>
        </div>
      </td>
      <td>
        {ticketPriority && (
          <span
            className={`font-semibold ${
              (ticketPriority.id === 1 && "text-success") ||
              (ticketPriority.id === 2 && "text-warning") ||
              (ticketPriority.id === 3 && "text-error")
            }`}
          >
            {ticketPriority.name}
          </span>
        )}
      </td>
      <td>
        {ticketAssignee ? (
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate(`/profile/${ticketAssignee.id}`)}
          >
            <div className="avatar">
              <div className="w-8 object-contain rounded-full">
                <img
                  src={ticketAssignee.profilePicture}
                  alt="avatar"
                  className="group-hover:opacity-75 transition-all duration-300"
                />
              </div>
            </div>
            <p className="font-semibold group-hover:text-base-300 transition-all duration-300">
              {ticketAssignee.firstName} {ticketAssignee.lastName}
            </p>
          </div>
        ) : (
          <p className="font-semibold">Unassigned</p>
        )}
      </td>
      <td>
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate(`/profile/${ticketCreator.id}`)}
        >
          <div className="avatar">
            <div className="w-8 object-contain rounded-full">
              <img
                src={ticketCreator.profilePicture}
                alt="avatar"
                className="group-hover:opacity-75 transition-all duration-300"
              />
            </div>
          </div>
          <p className="font-semibold group-hover:text-base-300 transition-all duration-300">
            {ticketCreator.firstName} {ticketCreator.lastName}
          </p>
        </div>
      </td>
      <td>
        {ticketStatus && (
          <div className="flex items-center w-28">
            <span
              className={`font-semibold badge text-white ${
                (ticketStatus.id === 1 && "badge-error") ||
                (ticketStatus.id === 2 && "badge-warning") ||
                (ticketStatus.id === 3 && "badge-success")
              }`}
            >
              {ticketStatus.name}
            </span>
          </div>
        )}
      </td>
      <td>
        <p className="font-semibold">
          {moment(ticketCreatedOn).format("DD MMM YYYY")}
        </p>
      </td>
      <td>
        {ticketDueDate && (
          <p className="font-semibold">
            {moment(ticketDueDate).format("DD MMM YYYY")}
          </p>
        )}
      </td>
      <td className="min-w-[180px]">
        {ticketBlockedBy.dependencyId && (
          <div className="flex items-center">
            <p
              className="font-semibold cursor-pointer hover:text-base-300 transition-all duration-300"
              onClick={() =>
                navigate(`/tickets/${ticketBlockedBy.dependencyId}`)
              }
            >
              {ticketBlockedBy.ticket.name}
            </p>
          </div>
        )}
      </td>
      <td>
        {ticketTag && <p className="font-semibold badge">{ticketTag.name}</p>}
      </td>
    </tr>
  );
}

export default TicketsTableItem;
