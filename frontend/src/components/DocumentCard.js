import { PiFileTextBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function DocumentCard(props) {
  const navigate = useNavigate();
  const { documentId, documentName } = props;
  return (
    <button
      className="btn btn-sm justify-start bg-base-100 border-0 normal-case p-1 rounded-lg mt-1"
      onClick={() => navigate(`/documents/${documentId}`)}
    >
      <p className="flex items-center gap-1 font-semibold text-neutral px-1">
        <PiFileTextBold className="h-4 w-4 flex-shrink-0" />
        <span className="text-xs overflow-x-hidden line-clamp-1 text-start">
          {documentName}
        </span>
      </p>
    </button>
  );
}

export default DocumentCard;
