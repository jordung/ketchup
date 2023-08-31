import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TicketCard from "../components/TicketCard";
import DocumentCard from "../components/DocumentCard";
import { PiArchiveBold } from "react-icons/pi";
import DeleteUserModal from "../components/DeleteUserModal";
import EditUserModal from "../components/EditUserModal";
import { v4 as uuidv4 } from "uuid";
import { PiCaretDownBold } from "react-icons/pi";
import Spinner from "../components/Spinner";

function Profile() {
  const { user } = useContext(UserContext);
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState();
  const [watchlist, setWatchlist] = useState([]);
  const [updatedWatchlist, setUpdatedWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/users/${userId}`
        );
        setUserProfile(response.data.data);
        setWatchlist(response.data.data.watchers);
        setUpdatedWatchlist(response.data.data.watchers);
        console.log(response.data.data.watchers);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // search through watchlist
  useEffect(() => {
    if (searchQuery !== "") {
      setUpdatedWatchlist(
        watchlist.filter(
          (item) =>
            (item.ticket &&
              item.ticket.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (item.document &&
              item.document.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setUpdatedWatchlist(watchlist);
    }
  }, [searchQuery, watchlist]);

  const renderSlackStatus = (userProfileId, userId, slackUserId) => {
    // case 1: own profile + no slack -> return connect button
    if (userProfileId === userId && !slackUserId) {
      return (
        <button className="btn btn-neutral btn-sm normal-case text-sm">
          Connect Slack
        </button>
      );

      // case 2: own profile + slack -> return disconnect button
    } else if (userProfileId === userId && slackUserId) {
      return (
        <button className="btn btn-neutral btn-sm normal-case text-sm">
          Disconnect Slack
        </button>
      );

      // case 3: others' profile + no slack -> return "Not connected"
    } else if (userProfileId !== userId && !slackUserId) {
      return <p className="text-sm">Not connected</p>;

      // case 4: others' profile + slack -> return "Connected"
    } else if (userProfileId !== userId && slackUserId) {
      return <p className="text-sm">Connected</p>;
    }
  };

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>

      {/* Body */}
      <motion.div
        layout
        className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        {loading && <Spinner />}
        {userProfile && (
          <motion.div layout="position" className="flex flex-col gap-4 xl:px-4">
            <div className="flex flex-col xl:flex-row xl:justify-between">
              <div className="xl:w-1/3">
                <div className="relative w-fit">
                  <img
                    src={userProfile.profilePicture}
                    alt="profile"
                    className="rounded-full w-48 object-cover"
                  />
                  <div className="absolute -bottom-[5%] left-1/2 transform -translate-x-1/2">
                    <span
                      className={`badge badge-sm uppercase font-semibold ${
                        userProfile.emailVerified
                          ? "badge-success text-white"
                          : "badge-warning"
                      }`}
                    >
                      {userProfile.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
                <div className="mt-8 px-4 flex flex-col gap-4">
                  {userProfile.id === user.id && (
                    <div className="dropdown">
                      <label
                        tabIndex={0}
                        className="btn btn-sm normal-case text-sm"
                      >
                        User Settings
                        <PiCaretDownBold />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-1 mt-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <button
                          className="btn btn-sm font-semibold text-xs normal-case w-full rounded-b-none btn-ghost text-neutral"
                          onClick={() => window.editUserModal.showModal()}
                        >
                          Edit Profile
                        </button>
                        <button
                          className="btn btn-sm font-semibold text-xs normal-case w-full rounded-t-none btn-ghost text-error outline-none"
                          onClick={() => window.deleteUserModal.showModal()}
                        >
                          Delete Account
                        </button>
                      </ul>
                      <EditUserModal user={user} />
                      <DeleteUserModal
                        userId={user.id}
                        firstName={user.firstName}
                        lastName={user.lastName}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold">First Name</p>
                    <p className="text-sm">{userProfile.firstName}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold">Last Name</p>
                    <p className="text-sm">{userProfile.lastName}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold">Email Address</p>
                    <p className="text-sm">{userProfile.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold">Organisation</p>
                    <p className="text-sm">{userProfile.organisation.name}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold">Slack</p>
                    {renderSlackStatus(
                      userProfile.id,
                      user.id,
                      userProfile.slackUserId
                    )}
                  </div>

                  {/* drawer to show watchlist */}
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold">Watchlist</p>
                    <div className="drawer drawer-end">
                      <input
                        id="watching-drawer"
                        type="checkbox"
                        className="drawer-toggle"
                      />
                      <div className="drawer-content">
                        {/* drawer button */}
                        <label
                          htmlFor="watching-drawer"
                          className="btn btn-neutral btn-sm normal-case text-sm drawer-button"
                        >
                          Show Watchlist
                        </label>
                      </div>
                      <div className="drawer-side">
                        <label
                          htmlFor="watching-drawer"
                          className="drawer-overlay"
                        ></label>
                        <ul className="menu p-4 w-80 md:w-1/2 min-h-full bg-base-200 text-base-content">
                          {/* drawer content */}
                          <span className="text-lg font-semibold">
                            Watchlist
                          </span>
                          <input
                            type="text"
                            className="input w-full text-sm font-semibold input-sm"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {updatedWatchlist.length > 0 ? (
                            updatedWatchlist.map((item) => (
                              <div key={uuidv4()}>
                                {item.document && (
                                  <DocumentCard
                                    documentId={item.document.id}
                                    documentName={item.document.name}
                                  />
                                )}
                                {item.ticket && (
                                  <TicketCard
                                    ticketId={item.ticket.id}
                                    ticketName={item.ticket.name}
                                  />
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="flex p-1 rounded-lg mt-1 items-center gap-1">
                              <PiArchiveBold className="h-4 w-4" />
                              <p className="font-semibold">
                                Currently not watching anything...
                              </p>
                            </div>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Profile;
