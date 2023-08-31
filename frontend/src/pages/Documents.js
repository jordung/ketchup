import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingContext } from "../App";
import AddDocumentCard from "../components/AddDocumentCard";
import DocumentsTable from "../components/DocumentsTable";

function Documents() {
  const { setLoading } = useContext(LoadingContext);
  const [addDocument, setAddDocument] = useState(false);

  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Documents</h2>
        <button
          className="btn btn-neutral normal-case rounded-xl btn-sm"
          onClick={() => setAddDocument(!addDocument)}
        >
          Add Document
        </button>
      </div>

      {/* Body */}
      <motion.div
        layout
        className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        {addDocument && <AddDocumentCard setAddDocument={setAddDocument} />}
        <motion.div layout="position" className="flex flex-col gap-4">
          <DocumentsTable />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Documents;
