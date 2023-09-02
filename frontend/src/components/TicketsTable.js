import { useEffect, useState } from "react";
import TicketsTableItem from "./TicketsTableItem";

function TicketsTable(props) {
  const { allTickets } = props;
  const [searchedTickets, setSearchedTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredTickets = allTickets.filter((ticket) =>
        ticket.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchedTickets(filteredTickets);
    } else {
      setSearchedTickets(allTickets);
    }
  }, [searchQuery, allTickets]);

  return (
    <div className="w-full rounded-lg shadow-xl">
      <div className="w-full bg-white rounded-lg p-4">
        <input
          type="text"
          className="input w-full text-sm font-semibold input-sm"
          placeholder="Search ticket"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="table mt-4">
            {/* head */}
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Creator</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Due Date</th>
                <th>Blocked By</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {searchedTickets.map((ticket) => (
                <TicketsTableItem
                  key={ticket.id}
                  ticketId={ticket.id}
                  ticketTitle={ticket.name}
                  ticketPriority={ticket.priority}
                  ticketAssignee={ticket.assignee}
                  ticketCreator={ticket.creator}
                  ticketCreatedOn={ticket.createdAt}
                  ticketDueDate={ticket.dueDate}
                  ticketBlockedBy={
                    ticket.ticket_dependencies.length > 0 &&
                    ticket.ticket_dependencies[0]
                  }
                  ticketTag={ticket.tag}
                  ticketStatus={ticket.status}
                />
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Ticket</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Creator</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Due Date</th>
                <th>Blocked By</th>
                <th>Tag</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TicketsTable;
