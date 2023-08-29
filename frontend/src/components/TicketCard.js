import { PiTicketBold } from "react-icons/pi";

function TicketCard(props) {
  return (
    <button className="btn btn-sm justify-start bg-base-100 border-0 normal-case p-1 rounded-lg mt-1 w-40">
      <p className="flex items-center gap-1 font-semibold text-secondary px-1 max-w-full">
        <PiTicketBold className="h-4 w-4 flex-shrink-0" />
        <span className="truncate text-xs">{props.ticketName}</span>
      </p>
    </button>
  );
}

export default TicketCard;
