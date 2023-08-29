import TicketsTableItem from "./TicketsTableItem";

function TicketsTable() {
  const data = [
    {
      ticketId: 1,
      ticketTitle: "Bug Fix",
      ticketPriority: 3,
      ticketAssignee: "Alice Spring",
      ticketCreatedOn: "28/08/2023",
      ticketDueDate: "29/08/2023",
      ticketBlockedBy: {
        ticketId: 2,
        ticketTitle: "Feature Request",
      },
      ticketTag: "bug",
      ticketStatus: 1,
    },
    {
      ticketId: 2,
      ticketTitle: "Feature Request",
      ticketPriority: 2,
      ticketAssignee: "Bob Bob",
      ticketCreatedOn: "28/08/2023",
      ticketDueDate: "29/08/2023",
      ticketBlockedBy: {
        ticketId: 3,
        ticketTitle: "UI Enhancement",
      },
      ticketTag: "frontend",
      ticketStatus: 2,
    },
    {
      ticketId: 3,
      ticketTitle: "UI Enhancement",
      ticketPriority: 1,
      ticketAssignee: "Charlie Angels",
      ticketCreatedOn: "28/08/2023",
      ticketDueDate: "29/08/2023",
      ticketBlockedBy: null,
      ticketTag: "frontend",
      ticketStatus: 1,
    },
    {
      ticketId: 4,
      ticketTitle: "Database Issue",
      ticketPriority: 3,
      ticketAssignee: "David Archuleta",
      ticketCreatedOn: "28/08/2023",
      ticketDueDate: "29/08/2023",
      ticketBlockedBy: null,
      ticketTag: "frontend",
      ticketStatus: 3,
    },
    // Add more objects as needed
  ];

  return (
    <div className="w-full rounded-lg shadow-xl">
      <div className="w-full bg-white rounded-lg p-4">
        <input
          type="text"
          className="input w-full text-sm font-semibold input-sm"
          placeholder="Search ticket"
        />
        <div className="overflow-x-auto">
          <table className="table mt-4">
            {/* head */}
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Due Date</th>
                <th>Blocked By</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {data.map((item) => (
                <TicketsTableItem
                  key={item.ticketId}
                  ticketId={item.ticketId}
                  ticketTitle={item.ticketTitle}
                  ticketPriority={item.ticketPriority}
                  ticketAssignee={item.ticketAssignee}
                  ticketCreatedOn={item.ticketCreatedOn}
                  ticketDueDate={item.ticketDueDate}
                  ticketBlockedBy={item.ticketBlockedBy}
                  ticketTag={item.ticketTag}
                  ticketStatus={item.ticketStatus}
                />
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Ticket</th>
                <th>Priority</th>
                <th>Assignee</th>
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
