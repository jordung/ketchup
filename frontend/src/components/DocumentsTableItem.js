import { useNavigate } from "react-router-dom";
import moment from "moment";

function DocumentsTableItem(props) {
  const {
    documentId,
    documentTitle,
    documentCreatedBy,
    documentCreatedOn,
    documentRelatedTicket,
    documentTag,
  } = props;

  const navigate = useNavigate();

  return (
    <tr className="hover:bg-base-100 w-full transition-all duration-300">
      <td className="min-w-[180px]">
        <div className="flex items-center">
          <p
            className="font-semibold cursor-pointer hover:text-base-300 transition-all duration-300"
            onClick={() => navigate(`/documents/${documentId}`)}
          >
            {documentTitle}
          </p>
        </div>
      </td>
      <td>
        <p className="font-semibold">
          {moment(documentCreatedOn).format("DD MMM YYYY")}
        </p>
      </td>
      <td>
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate(`/profile/${documentCreatedBy.id}`)}
        >
          <div className="avatar">
            <div className="w-8 object-contain rounded-full">
              <img
                src={documentCreatedBy.profilePicture}
                alt="avatar"
                className="group-hover:opacity-75 transition-all duration-300"
              />
            </div>
          </div>
          <p className="font-semibold group-hover:text-base-300 transition-all duration-300">
            {documentCreatedBy.firstName} {documentCreatedBy.lastName}
          </p>
        </div>
      </td>

      <td>
        {documentTag && (
          <p className="font-semibold badge">{documentTag.name}</p>
        )}
      </td>

      <td className="min-w-[180px]">
        {documentRelatedTicket && (
          <div className="flex items-center">
            <p
              className="font-semibold cursor-pointer hover:text-base-300 transition-all duration-300"
              onClick={() =>
                navigate(`/tickets/${documentRelatedTicket.ticketId}`)
              }
            >
              {documentRelatedTicket.ticket.name}
            </p>
          </div>
        )}
      </td>
    </tr>
  );
}

export default DocumentsTableItem;
