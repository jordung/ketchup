import { useEffect, useState } from "react";
import DocumentsTableItem from "./DocumentsTableItem";

function DocumentsTable(props) {
  const { allDocuments } = props;
  const [searchedDocuments, setSearchedDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredDocuments = allDocuments.filter((document) =>
        document.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchedDocuments(filteredDocuments);
    } else {
      setSearchedDocuments(allDocuments);
    }
  }, [searchQuery, allDocuments]);

  return (
    <div className="w-full rounded-lg shadow-xl">
      <div className="w-full bg-white rounded-lg p-4">
        <input
          type="text"
          className="input w-full text-sm font-semibold input-sm"
          placeholder="Search document"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              {searchedDocuments.map((document) => (
                <DocumentsTableItem
                  key={document.id}
                  documentId={document.id}
                  documentTitle={document.name}
                  documentCreatedBy={document.creator}
                  documentCreatedOn={document.createdAt}
                  documentRelatedTicket={document?.document_tickets[0]}
                  documentTag={document.tag}
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
