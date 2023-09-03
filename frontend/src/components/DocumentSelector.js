import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { PiFileTextBold } from "react-icons/pi";

function DocumentSelector({
  data,
  id,
  open,
  disabled = false,
  onToggle,
  onChange,
  selectedValue,
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="relative" onBlur={() => onToggle()}>
      <div className="mt-1 relative">
        <button
          type="button"
          className={`${
            disabled ? "bg-neutral-100" : "bg-white"
          } relative w-full border border-base-200 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none text-sm`}
          onClick={onToggle}
          disabled={disabled}
        >
          {selectedValue && (
            <span className="flex items-center">
              <PiFileTextBold className="h-4 w-4 flex-shrink-0" />
              <span className="ml-2 font-semibold text-xs">
                {selectedValue.name}
              </span>
            </span>
          )}
          <span
            className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ${
              disabled ? "hidden" : ""
            }`}
          >
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              // aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
              tabIndex={-1}
            >
              <div className="sticky top-0 z-10 bg-white">
                <li className=" text-neutral cursor-default relative py-2 px-3">
                  <input
                    type="search"
                    name="search"
                    autoComplete={"off"}
                    className="input input-sm w-full text-xs bg-white border-base-200 rounded-lg"
                    placeholder={"Search ticket"}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </li>
                <hr />
              </div>

              <div className="max-h-64 overflow-y-auto">
                {data.filter((ticket) =>
                  ticket.name.toLowerCase().includes(query.toLowerCase())
                ).length === 0 ? (
                  <li className="text-neutral cursor-default relative py-2 pl-3 pr-9">
                    No data found
                  </li>
                ) : (
                  data
                    .filter((ticket) =>
                      ticket.name.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((value, index) => {
                      return (
                        <li
                          key={`${id}-${index}`}
                          className="text-neutral cursor-pointer relative py-2 pl-3 pr-9 flex items-center hover:bg-base-100 transition"
                          onClick={() => {
                            onChange(value.id);
                            setQuery("");
                            onToggle();
                          }}
                        >
                          <PiFileTextBold className="h-4 w-4 flex-shrink-0" />
                          <span className="ml-2 text-xs font-semibold">
                            {value.name}
                          </span>
                        </li>
                      );
                    })
                )}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DocumentSelector;
