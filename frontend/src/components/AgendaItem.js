import { motion } from "framer-motion";
import { PiCircleBold } from "react-icons/pi";
import TicketSelector from "./TicketSelector";
import DocumentSelector from "./DocumentSelector";
import { useState } from "react";

function AgendaItem(props) {
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);
  const [isDocumentSelectorOpen, setIsDocumentSelectorOpen] = useState(false);

  const {
    agendaItem,
    handleAgendaContentChange,
    handleAgendaFlagIdChange,
    handleAgendaTicketIdChange,
    handleAgendaDocumentIdChange,
    handleRemoveAgendaItem,
    ticketList,
    documentList,
  } = props;
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-start gap-2 w-full"
    >
      <div
        className="mt-2 cursor-pointer group tooltip tooltip-right before:text-xs"
        data-tip="Remove Agenda"
      >
        <PiCircleBold
          className="group-hover:text-primary transition-all duration-300"
          onClick={() => handleRemoveAgendaItem(agendaItem.id)}
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow">
        <div className="flex items-center gap-2 flex-grow">
          <input
            className="input input-sm w-full"
            type="text"
            value={agendaItem.content}
            placeholder="What are you working on today?"
            onChange={(e) =>
              handleAgendaContentChange(agendaItem.id, e.target.value)
            }
          />
        </div>
        <div className="mt-1 flex flex-col">
          <p className="text-sm font-semibold">Ticket: </p>
          <div className="flex-grow">
            <TicketSelector
              data={ticketList}
              id={`ticket-selector ${agendaItem.id}`}
              open={isTicketSelectorOpen}
              onToggle={() => setIsTicketSelectorOpen(!isTicketSelectorOpen)}
              onChange={(e) => handleAgendaTicketIdChange(agendaItem.id, e)}
              selectedValue={ticketList.find(
                (option) => option.id === agendaItem.ticketId
              )}
            />
          </div>
        </div>
        <div className="mt-1 flex flex-col">
          <p className="text-sm font-semibold">Document: </p>
          <div className="flex-grow">
            <DocumentSelector
              data={documentList}
              id={`document-selector ${agendaItem.id}`}
              open={isDocumentSelectorOpen}
              onToggle={() =>
                setIsDocumentSelectorOpen(!isDocumentSelectorOpen)
              }
              onChange={(e) => handleAgendaDocumentIdChange(agendaItem.id, e)}
              selectedValue={documentList.find(
                (option) => option.id === agendaItem.documentId
              )}
            />
          </div>
        </div>
        <div className="mt-1 flex flex-col">
          <p className="text-sm font-semibold">Flag: </p>

          {/* Option */}
          <div className="flex flex-col items-start mb-1 md:flex-row">
            <div className="flex">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name={`radio-${agendaItem.id}`}
                    value={1}
                    className="radio radio-xs checked:bg-warning border-0 bg-base-100"
                    onChange={(e) =>
                      handleAgendaFlagIdChange(
                        agendaItem.id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span className="label-text ml-2 font-semibold text-xs badge badge-warning text-orange-800">
                    help
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name={`radio-${agendaItem.id}`}
                    value={2}
                    className="radio radio-xs checked:bg-success border-0 bg-base-100"
                    onChange={(e) =>
                      handleAgendaFlagIdChange(
                        agendaItem.id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span className="label-text ml-2 font-semibold text-xs badge badge-success text-green-800">
                    all's good
                  </span>
                </label>
              </div>
            </div>
            <div className="flex">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name={`radio-${agendaItem.id}`}
                    value={3}
                    className="radio radio-xs checked:bg-info border-0 bg-base-100"
                    onChange={(e) =>
                      handleAgendaFlagIdChange(
                        agendaItem.id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span className="label-text ml-2 font-semibold text-xs badge badge-info text-blue-800">
                    fyi
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name={`radio-${agendaItem.id}`}
                    value={4}
                    className="radio radio-xs checked:bg-error border-0 bg-base-100"
                    onChange={(e) =>
                      handleAgendaFlagIdChange(
                        agendaItem.id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <span className="label-text ml-2 font-semibold text-xs badge badge-error text-red-800">
                    urgent
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AgendaItem;
