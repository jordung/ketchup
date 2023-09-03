import { motion } from "framer-motion";
import { PiCircleBold } from "react-icons/pi";
import TicketSelector from "./TicketSelector";
import DocumentSelector from "./DocumentSelector";
import { useState } from "react";

function UpdateItem(props) {
  const [isTicketSelectorOpen, setIsTicketSelectorOpen] = useState(false);
  const [isDocumentSelectorOpen, setIsDocumentSelectorOpen] = useState(false);

  const {
    updateItem,
    handleUpdateContentChange,
    handleUpdateFlagIdChange,
    handleUpdateTicketIdChange,
    handleUpdateDocumentIdChange,
    handleRemoveUpdateItem,
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
        data-tip="Remove Update"
      >
        <PiCircleBold
          className="group-hover:text-primary transition-all duration-300"
          onClick={() => handleRemoveUpdateItem(updateItem.id)}
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow">
        <div className="flex items-center gap-2 flex-grow">
          <input
            className="input input-sm w-full"
            type="text"
            value={updateItem.content}
            placeholder="Any updates for previous Ketchups?"
            onChange={(e) =>
              handleUpdateContentChange(updateItem.id, e.target.value)
            }
          />
        </div>
        <div className="mt-1 flex flex-col">
          <p className="text-sm font-semibold">Ticket: </p>
          <div className="flex-grow">
            <TicketSelector
              data={ticketList}
              id={`ticket-selector ${updateItem.id}`}
              open={isTicketSelectorOpen}
              onToggle={() => setIsTicketSelectorOpen(!isTicketSelectorOpen)}
              onChange={(e) => handleUpdateTicketIdChange(updateItem.id, e)}
              selectedValue={ticketList.find(
                (option) => option.id === updateItem.ticketId
              )}
            />
          </div>
        </div>
        <div className="mt-1 flex flex-col">
          <p className="text-sm font-semibold">Document: </p>
          <div className="flex-grow">
            <DocumentSelector
              data={documentList}
              id={`document-selector ${updateItem.id}`}
              open={isDocumentSelectorOpen}
              onToggle={() =>
                setIsDocumentSelectorOpen(!isDocumentSelectorOpen)
              }
              onChange={(e) => handleUpdateDocumentIdChange(updateItem.id, e)}
              selectedValue={documentList.find(
                (option) => option.id === updateItem.documentId
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
                    name={`radio-${updateItem.id}`}
                    value={1}
                    className="radio radio-xs checked:bg-warning border-0 bg-base-100"
                    onChange={(e) =>
                      handleUpdateFlagIdChange(
                        updateItem.id,
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
                    name={`radio-${updateItem.id}`}
                    value={2}
                    className="radio radio-xs checked:bg-success border-0 bg-base-100"
                    onChange={(e) =>
                      handleUpdateFlagIdChange(
                        updateItem.id,
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
                    name={`radio-${updateItem.id}`}
                    value={3}
                    className="radio radio-xs checked:bg-info border-0 bg-base-100"
                    onChange={(e) =>
                      handleUpdateFlagIdChange(
                        updateItem.id,
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
                    name={`radio-${updateItem.id}`}
                    value={4}
                    className="radio radio-xs checked:bg-error border-0 bg-base-100"
                    onChange={(e) =>
                      handleUpdateFlagIdChange(
                        updateItem.id,
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

export default UpdateItem;
