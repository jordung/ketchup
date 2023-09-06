import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { LoggedInContext, UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
// import Select from "react-select";
// import { colourStyles, timeIntervals } from "../utils/selectSettings";
import { useNavigate } from "react-router-dom";
import UserListCard from "../components/UserListCard";
import InvitedUserCard from "../components/InvitedUserCard";
import Spinner from "../components/Spinner";

function Preferences() {
  const { user } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  // const [dailyKetchupTime, setDailyKetchupTime] = useState("");
  const [organisationId, setOrganisationId] = useState();
  const [userList, setUserList] = useState([]);
  const [inviteList, setInviteList] = useState([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrganisationPreferences = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/admin/${user.organisationId}`
        );
        // setDailyKetchupTime({
        //   value: response.data.data.invitees.time,
        //   label: response.data.data.invitees.time.slice(0, 5),
        // });
        setOrganisationId(response.data.data.invitees.id);
        setUserList(response.data.data.usersWithAdminStatus);
        setInviteList(response.data.data.invitees.invitations);
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    getOrganisationPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // * for future implementation
  // const handleUpdateDailyKetchupTime = async (value) => {
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");
  //     const response = await axios.put(
  //       `${process.env.REACT_APP_DB_API}/admin/${organisationId}`,
  //       {
  //         time: value.value.slice(0, 5),
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setDailyKetchupTime({
  //       value: response.data.data.time,
  //       label: response.data.data.time.slice(0, 5),
  //     });
  //     toast.success("Successfully updated Daily Ketchup Timing");
  //   } catch (error) {
  //     toast.error(error.response.data.msg);
  //   }
  // };

  const handleInvite = async () => {
    if (inviteeEmail === "") {
      toast.error("Invitee email is empty");
      return;
    }
    const accessToken = localStorage.getItem("accessToken");
    try {
      setIsInviting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/invite`,
        {
          userId: user.id,
          inviteeEmail: inviteeEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setInviteList(response.data.data.invitations);
      toast.success(response.data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setInviteeEmail("");
      setIsInviting(false);
    }

    // toast.success("Invite sent!");
  };

  const handleLogout = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/auth/logout`,
        {
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(`${response.data.msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="h-screen pt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
        {/* Header */}
        <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
          <h2 className="text-2xl font-bold">Preferences</h2>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-neutral normal-case rounded-xl btn-sm"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Body */}
        <motion.div
          layout
          className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
        >
          <motion.div
            layout="position"
            className="flex flex-col gap-4 xl:flex-row xl:gap-4 xl:items-start"
          >
            {/* Organisation Standup Time Preferences - for Admin */}
            <div className="flex flex-col gap-2 shadow-lg px-2 pt-2 pb-4 lg:px-4 rounded-lg min-w-full lg:min-w-[50%] lg:max-w-min">
              <div className="min-w-full lg:min-w-0">
                <h3 className="text-lg font-semibold">Daily Ketchup Timing</h3>
                {/* <Select
                  className="font-semibold text-xs cursor-pointer"
                  styles={colourStyles}
                  options={timeIntervals}
                  onChange={handleUpdateDailyKetchupTime}
                  value={dailyKetchupTime}
                  placeholder="Select a timing..."
                /> */}
                <p className="bg-base-100 text-xs font-semibold w-full p-2 rounded-xl">
                  10:00
                </p>
              </div>

              {/* User List */}
              <div className="flex flex-col gap-2 min-w-full lg:min-w-0">
                <h3 className="text-lg font-semibold">Users List</h3>
                {/* User List Card */}
                {userList.map((user) => (
                  <UserListCard
                    key={user.id}
                    userId={user.id}
                    profilePicture={user.profilePicture}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                    isAdmin={user.isAdmin}
                    organisationId={organisationId}
                    userList={userList}
                  />
                ))}
              </div>
            </div>

            {/* Invited Users List */}
            <div className="flex flex-col gap-2 shadow-lg px-2 pt-2 pb-4 rounded-lg min-w-full lg:min-w-[50%] lg:max-w-min lg:px-4">
              {/* Invite User */}
              <div className="flex flex-col items-start justify-center gap-2 min-w-full lg:min-w-0">
                <h3 className="text-lg font-semibold">Invite</h3>
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    className="input input-sm text-sm w-full rounded-xl"
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleInvite();
                      }
                    }}
                  />
                  <button
                    className="btn btn-neutral normal-case rounded-xl btn-sm"
                    onClick={handleInvite}
                    disabled={isInviting}
                  >
                    Invite
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold">Invited</h3>
              {/* Invited User Card */}
              {inviteList.map((user, index) => (
                <InvitedUserCard
                  key={index}
                  email={user.inviteeEmail}
                  date={user.createdAt}
                  status={user.isConfirmed}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Preferences;
