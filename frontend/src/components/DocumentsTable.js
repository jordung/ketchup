import DocumentsTableItem from "./DocumentsTableItem";

function DocumentsTable() {
  const data = [
    {
      documentId: 1,
      documentTitle: "Frontend Setup Docs",
      documentCreatedBy: "Alice Spring",
      documentCreatedOn: "28/08/2023",
      documentRelatedTicket: {
        ticketId: 2,
        ticketTitle: "Feature Request",
      },
      documentTag: "setup",
    },
    {
      documentId: 2,
      documentTitle: "API Documentation",
      documentCreatedBy: "Bob Bob",
      documentCreatedOn: "28/08/2023",
      documentRelatedTicket: {
        ticketId: 3,
        ticketTitle: "UI Enhancement",
      },
      documentTag: "api",
    },
    // Add more objects as needed
  ];

  return (
    <div className="w-full rounded-lg shadow-xl">
      <div className="w-full bg-white rounded-lg p-4">
        <input
          type="text"
          className="input w-full text-sm font-semibold input-sm"
          placeholder="Search document"
        />
        <div className="overflow-x-auto">
          <table className="table mt-4">
            {/* head */}
            <thead>
              <tr>
                <th>Document</th>
                <th>Created On</th>
                <th>Created By</th>
                <th>Tag</th>
                <th>Related Ticket</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {data.map((item) => (
                <DocumentsTableItem
                  key={item.documentId}
                  documentId={item.documentId}
                  documentTitle={item.documentTitle}
                  documentCreatedBy={item.documentCreatedBy}
                  documentCreatedOn={item.documentCreatedOn}
                  documentRelatedTicket={item.documentRelatedTicket}
                  documentTag={item.documentTag}
                />
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Document</th>
                <th>Created On</th>
                <th>Created By</th>
                <th>Tag</th>
                <th>Related Ticket</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DocumentsTable;
