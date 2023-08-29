import TicketSelector from "./TicketSelector";
import { useState } from "react";
import { motion } from "framer-motion";

function NewPostCard(props) {
  //TODO: render out tickets dynamically (including a default N.A null option)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [content, setContent] = useState("");

  const tickets = [
    {
      title: "N.A.",
      value: null,
    },
    {
      title: "FE - Update UI",
      value: "1", // ticketId,
    },
    {
      title: "BE - Finish ERD Diagrams",
      value: "2",
    },
  ];

  const handleSubmitNewPost = (e) => {
    console.log(selectedTicket, content);
    // TODO: set information to backend
    setSelectedTicket(null);
    setContent("");
    props.setComposePost(false);
  };

  return (
    <motion.div
      layout="position"
      initial={{ x: 2000 }}
      animate={{ x: 0 }}
      exit={{ x: 2000 }}
      transition={{ delay: 0.5 }}
      className="bg-white w-full p-4 rounded-lg shadow-lg"
    >
      <h3 className="font-bold text-lg">New Post</h3>
      <p className="font-semibold text-sm text-neutral">
        Bites of information to share with your team!
      </p>
      <div className="w-full mt-2">
        <textarea
          className="textarea bg-white resize-none focus:outline-none font-normal my-1 w-full border border-base-200 rounded-lg"
          placeholder="Content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={"flex flex-col justify-center items-center"}>
        <div className="w-full">
          <label className="block text-sm font-medium text-neutral">
            Related Ticket
          </label>
          <TicketSelector
            data={tickets}
            id={"ticket-selector"}
            open={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            onChange={setSelectedTicket}
            selectedValue={tickets.find(
              (option) => option.value === selectedTicket
            )}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-primary btn-sm normal-case mt-2"
          onClick={handleSubmitNewPost}
        >
          Share
        </button>
        <button
          className="btn btn-base-100 btn-sm normal-case mt-2"
          onClick={() => props.setComposePost(false)}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default NewPostCard;
