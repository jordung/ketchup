import { PiTicketBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function TicketCard(props) {
  const navigate = useNavigate();
  const { ticketId, ticketName } = props;
  return (
    <button
      className="btn btn-sm justify-start bg-base-100 border-0 normal-case p-1 rounded-lg mt-1 w-40"
      onClick={() => navigate(`/tickets/${ticketId}`)}
    >
      <p className="flex items-center gap-1 font-semibold text-secondary px-1 max-w-full">
        <PiTicketBold className="h-4 w-4 flex-shrink-0" />
        <span className="truncate text-xs">{ticketName}</span>
      </p>
    </button>
  );
}

export default TicketCard;
