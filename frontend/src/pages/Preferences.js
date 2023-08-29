import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { LoadingContext, LoggedInContext, UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { colourStyles, timeIntervals } from "../utils/selectSettings";
import { useNavigate } from "react-router-dom";
import jordan from "../assets/landing/jordan.jpeg";
import UserListCard from "../components/UserListCard";
import InvitedUserCard from "../components/InvitedUserCard";

function Preferences() {
  const { setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);
  const { setIsLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  const [dailyKetchupTime, setDailyKetchupTime] = useState("");

  const users = [
    {
      id: 1,
      name: "Jordan Ang",
      email: "jordanayd@gmail.com",
    },
    {
      id: 2,
      name: "Jaelyn Teo",
      email: "jteohn@gmail.com",
    },
    { id: 3, name: "Sam", email: "sam@sam.com" },
    { id: 4, name: "Foong", email: "foong@foong.com" },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log(dailyKetchupTime);
  }, [dailyKetchupTime]);

  const handleLogout = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/logout`,
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
      setLoading(false);
    }
  };

  return (
    <div className="h-screen mt-4 mx-4 min-w-[calc(100vw_-_5rem)] lg:min-w-[calc(100vw_-_9rem)]">
      {/* Header */}
      <div className="border-b border-base-100 flex items-center justify-between py-2 overflow-hidden">
        <h2 className="text-2xl font-bold">Preferences</h2>
        <button
          className="btn btn-neutral normal-case rounded-xl btn-sm"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>

      {/* Body */}
      <motion.div
        layout
        className="mt-2 max-w-[calc(100vw_-_5rem)] lg:max-w-[calc(100vw_-_9rem)] flex flex-col gap-4"
      >
        <motion.div
          layout="position"
          className="flex flex-col gap-4 shadow-lg p-2 rounded-lg"
        >
          {/* Organisation Standup Time Preferences - for Admin */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Daily Ketchup Timing</h3>
            <Select
              className="font-semibold text-xs cursor-pointer max-w-sm"
              styles={colourStyles}
              options={timeIntervals}
              onChange={(value) => setDailyKetchupTime(value)}
              placeholder="Select a timing..."
            />
          </div>

          {/* User List */}
          <div className="flex flex-col gap-2 mt-8 pb-8">
            <h3 className="text-lg font-semibold">Users List</h3>
            {/* User List Card */}
            {users.map((user) => (
              <UserListCard
                key={user.id}
                profilePicture={jordan}
                name={user.name}
                email={user.email}
              />
            ))}

            {/* Invited Users List */}
            <h3 className="text-sm font-semibold mt-4">Invited</h3>
            {/* Pending User Card */}
            {users.map((user) => (
              <InvitedUserCard
                key={user.id}
                profilePicture={jordan}
                name={user.name}
                email={user.email}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Preferences;
