import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ketchup-logo-bottle.png";
import {
  PiPencilBold,
  PiHouseBold,
  PiArchiveBold,
  PiTicketBold,
  PiFilesBold,
  PiGearBold,
  PiEnvelopeBold,
  PiCaretCircleLeftBold,
  PiBellRingingBold,
} from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import VerifyEmailOverlay from "./VerifyEmailOverlay";
import NotificationsModal from "./NotificationsModal";

function Sidebar() {
  const [showMore, setShowMore] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowMore(false);
  }, [location.key]);

  return (
    <AnimatePresence>
      <div className="flex flex-row overflow-x-hidden">
        {user && !user.emailVerified && <VerifyEmailOverlay />}
        <motion.aside
          layout
          className={`${
            showMore ? "w-48 lg:w-64" : "w-12 lg:w-24"
          } fixed h-screen bg-base-100 text-neutral z-40`}
        >
          {/* button to expand sidebar */}
          <motion.span
            layout="position"
            className="absolute -right-3 top-20 rounded-full bg-base-100 p-1 border-0 cursor-pointer"
            onClick={() => setShowMore(!showMore)}
          >
            <motion.div
              animate={{
                rotate: showMore ? 0 : 180,
              }}
            >
              <PiCaretCircleLeftBold className="h-5 w-auto" />
            </motion.div>
          </motion.span>
          <motion.div
            transition={{ layout: { duration: 0.2, type: "spring" } }}
            className="lg:px-4 px-1 py-6 flex flex-col h-full justify-between items-start overflow-y-auto"
          >
            <div className="w-full">
              <div className="flex items-center justify-start py-4">
                <div className="flex items-center justify-start min-w-full min-h-8">
                  <motion.img
                    layout="position"
                    src={logo}
                    alt="logo"
                    className="w-10 lg:w-16 object-contain"
                  />
                  {showMore && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-2xl font-bold ml-4"
                    >
                      Ketchup
                    </motion.span>
                  )}
                </div>
              </div>
              <ul className="flex flex-col w-full mt-8">
                <li className="w-full group">
                  <button
                    className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                      location.pathname === "/daily"
                        ? "bg-neutral group-hover:bg-neutral"
                        : "group-hover:bg-accent"
                    }`}
                    onClick={() => navigate("/daily")}
                  >
                    <motion.span layout="position">
                      <PiPencilBold
                        className={`h-9 w-9 text-lg p-2 rounded-full ${
                          location.pathname === "/daily"
                            ? "bg-white text-neutral"
                            : "bg-primary text-white"
                        }`}
                      />
                    </motion.span>
                    {showMore && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`ml-3 text-sm font-semibold normal-case ${
                          location.pathname === "/daily"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      >
                        Daily Ketchup
                      </motion.span>
                    )}
                  </button>
                </li>
                <li className="mt-8 w-full group">
                  <button
                    className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                      location.pathname === "/notifications"
                        ? "bg-neutral group-hover:bg-neutral"
                        : "group-hover:bg-accent"
                    }`}
                    // onClick={() => navigate("/notifications")}
                    onClick={() => window.notificationsModal.showModal()}
                  >
                    <motion.span layout="position">
                      <PiBellRingingBold
                        className={`h-10 w-10 p-2 text-lg rounded-full text-neutral ${
                          location.pathname === "/notifications"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      />
                    </motion.span>
                    {showMore && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`ml-3 text-sm font-semibold normal-case flex flex-col items-start ${
                          location.pathname === "/notifications"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      >
                        <span>Notifications</span>
                      </motion.div>
                    )}
                  </button>
                </li>
                <li className="mt-8 w-full group">
                  <button
                    className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                      location.pathname === "/home"
                        ? "bg-neutral group-hover:bg-neutral"
                        : "group-hover:bg-accent"
                    }`}
                    onClick={() => navigate("/home")}
                  >
                    <motion.span layout="position">
                      <PiHouseBold
                        className={`h-10 w-10 p-2 text-lg rounded-full text-neutral ${
                          location.pathname === "/home"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      />
                    </motion.span>
                    {showMore && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`ml-3 text-sm font-semibold normal-case flex flex-col items-start ${
                          location.pathname === "/home"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      >
                        <span>Home</span>
                        <p className="text-xs text-gray-400 max-w-[7rem] xl:max-w-[8rem] truncate group-hover:text-primary">
                          {user?.organisation?.name}
                        </p>
                      </motion.div>
                    )}
                  </button>
                </li>
                <li className="w-full group">
                  <button
                    className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                      location.pathname.includes("/tickets")
                        ? "bg-neutral group-hover:bg-neutral"
                        : "group-hover:bg-accent"
                    }`}
                    onClick={() => navigate("/tickets")}
                  >
                    <motion.span layout="position">
                      <PiTicketBold
                        className={`h-10 w-10 p-2 text-lg rounded-full text-neutral ${
                          location.pathname.includes("/tickets")
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      />
                    </motion.span>
                    {showMore && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`ml-3 text-sm font-semibold normal-case ${
                          location.pathname.includes("/tickets")
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      >
                        Tickets
                      </motion.span>
                    )}
                  </button>
                </li>
                <li className="w-full group">
                  <button
                    className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                      location.pathname.includes("/documents")
                        ? "bg-neutral group-hover:bg-neutral"
                        : "group-hover:bg-accent"
                    }`}
                    onClick={() => navigate("/documents")}
                  >
                    <motion.span layout="position">
                      <PiFilesBold
                        className={`h-10 w-10 p-2 text-lg rounded-full text-neutral ${
                          location.pathname.includes("/documents")
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      />
                    </motion.span>
                    {showMore && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`ml-3 text-sm font-semibold normal-case ${
                          location.pathname.includes("/documents")
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      >
                        Documents
                      </motion.span>
                    )}
                  </button>
                </li>
                <li className="w-full group">
                  <button
                    className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                      location.pathname === "/allketchups"
                        ? "bg-neutral group-hover:bg-neutral"
                        : "group-hover:bg-accent"
                    }`}
                    onClick={() => navigate("/allketchups")}
                  >
                    <motion.span layout="position">
                      <PiArchiveBold
                        className={`h-10 w-10 p-2 text-lg rounded-full text-neutral ${
                          location.pathname === "/allketchups"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      />
                    </motion.span>
                    {showMore && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`ml-3 text-sm font-semibold normal-case ${
                          location.pathname === "/allketchups"
                            ? "text-white"
                            : "text-neutral group-hover:text-primary"
                        }`}
                      >
                        All Ketchups
                      </motion.span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
            <ul className="flex flex-col w-full">
              <li className="w-full group">
                <button
                  className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                    location.pathname === `/profile/${user.id}`
                      ? "bg-neutral group-hover:bg-neutral"
                      : "group-hover:bg-accent"
                  }`}
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <motion.span layout="position">
                    <img
                      src={user.profilePicture}
                      className={`h-6 w-6 m-2 border-2 rounded-full object-cover ${
                        location.pathname === `/profile/${user.id}`
                          ? "border-white"
                          : "group-hover:border-primary border-neutral"
                      }`}
                      alt="profile"
                    />
                  </motion.span>
                  {showMore && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className={`ml-3 text-sm font-semibold normal-case ${
                        location.pathname === `/profile/${user.id}`
                          ? "text-white"
                          : "text-neutral group-hover:text-primary"
                      }`}
                    >
                      Profile
                    </motion.span>
                  )}
                </button>
              </li>
              {/* <li className="w-full group">
                <button
                  className="flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost group-hover:bg-accent"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <motion.span layout="position">
                    <img
                      src={user.profilePicture}
                      className={`h-6 w-6 m-2 border-neutral border-2 rounded-full object-fill group-hover:border-primary ${
                        location.pathname.includes("/profile") && "border-white"
                      }`}
                      alt="profile"
                    />
                  </motion.span>
                  {showMore && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="ml-3 text-sm font-semibold normal-case group-hover:text-primary"
                    >
                      Profile
                    </motion.span>
                  )}
                </button>
              </li> */}
              <li className="w-full group">
                <button
                  className="flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost group-hover:bg-accent"
                  onClick={() =>
                    (window.location = "mailto:theketchupcorner@gmail.com")
                  }
                >
                  <motion.span layout="position">
                    <PiEnvelopeBold className="h-10 w-10 p-2 text-lg rounded-full text-neutral group-hover:text-primary" />
                  </motion.span>
                  {showMore && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="ml-3 text-sm font-semibold normal-case group-hover:text-primary"
                    >
                      Email Us
                    </motion.span>
                  )}
                </button>
              </li>
              {/* <li className="w-full group">
                <button className="flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost group-hover:bg-accent">
                  <motion.span layout="position">
                    <PiGearBold className="h-10 w-10 p-2 text-lg rounded-full text-neutral group-hover:text-primary" />
                  </motion.span>
                  {showMore && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="ml-3 text-sm font-semibold normal-case group-hover:text-primary"
                    >
                      Preferences
                    </motion.span>
                  )}
                </button>
              </li> */}
              <li className="w-full group">
                <button
                  className={`flex flex-row items-center justify-start px-0 lg:px-3 rounded-xl w-full btn btn-ghost ${
                    location.pathname === "/preferences"
                      ? "bg-neutral group-hover:bg-neutral"
                      : "group-hover:bg-accent"
                  }`}
                  onClick={() => navigate("/preferences")}
                >
                  <motion.span layout="position">
                    <PiGearBold
                      className={`h-10 w-10 p-2 text-lg rounded-full text-neutral ${
                        location.pathname === "/preferences"
                          ? "text-white"
                          : "text-neutral group-hover:text-primary"
                      }`}
                    />
                  </motion.span>
                  {showMore && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className={`ml-3 text-sm font-semibold normal-case ${
                        location.pathname === "/preferences"
                          ? "text-white"
                          : "text-neutral group-hover:text-primary"
                      }`}
                    >
                      Preferences
                    </motion.span>
                  )}
                </button>
              </li>
            </ul>
          </motion.div>
        </motion.aside>
        <motion.div
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${showMore ? "ml-48 lg:ml-64" : "ml-12 lg:ml-24"}`}
        >
          <NotificationsModal />
          <Outlet />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default Sidebar;
