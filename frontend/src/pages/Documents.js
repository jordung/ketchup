import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../App";
import AddDocumentCard from "../components/AddDocumentCard";
import DocumentsTable from "../components/DocumentsTable";
import Spinner from "../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";

function Documents() {
  const { user } = useContext(UserContext);

  const [addDocument, setAddDocument] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allDocuments, setAllDocuments] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    const getAllDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/documents/${user.organisationId}`
        );
        setAllDocuments(response.data.data.allDocuments);
        setAllTags(response.data.data.allTags);
        setAllTickets(response.data.data.allTickets);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    getAllDocuments();
  }, [user]);

  return (
    <>
      {loading && <Spinner />}
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
          {addDocument && (
            <AddDocumentCard
              setAddDocument={setAddDocument}
              allTags={allTags}
              setAllTags={setAllTags}
              allTickets={allTickets}
              setAllDocuments={setAllDocuments}
            />
          )}
          <motion.div layout="position" className="flex flex-col gap-4">
            <DocumentsTable allDocuments={allDocuments} />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Documents;
