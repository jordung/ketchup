import Select from "react-select";
import { colourStyles, userPermissions } from "../utils/selectSettings";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

function UserListCard(props) {
  const {
    userId,
    profilePicture,
    firstName,
    lastName,
    email,
    isAdmin,
    organisationId,
    userList,
  } = props;
  const { user } = useContext(UserContext);
  const [userStatus, setUserStatus] = useState({
    value: isAdmin,
    label: isAdmin ? "Admin" : "Member",
  });
  const navigate = useNavigate();

  const isCurrentUserAdmin = !userList.find(
    (organisationUser) => organisationUser.id === user.id
  ).isAdmin;

  const handleUpdateUserStatus = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_API}/admin`,
        {
          userId: userId,
          organisationId: organisationId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response);
      const currentUser = response.data.data.find((user) => user.id === userId);
      console.log(currentUser);
      setUserStatus({
        value: currentUser.isAdmin,
        label: currentUser.isAdmin ? "Admin" : "Member",
      });
      toast.success(`${response.data.msg}`);
    } catch (error) {
      toast.error("There was an error in updating user's status");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className="flex items-center gap-2 group cursor-pointer"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <img
          src={profilePicture}
          alt=""
          className="w-8 h-8 object-cover rounded-full flex-shrink-0 group-hover:opacity-75 transition-all duration-300"
        />
        <div className="flex flex-col justify-start w-32 md:w-full">
          <p className="text-sm font-semibold group-hover:text-base-300 transition-all duration-300">
            {firstName} {lastName}
          </p>
          <p className="text-gray-500 text-xs truncate group-hover:text-base-300 transition-all duration-300">
            {email}
          </p>
        </div>
      </div>
      <Select
        styles={colourStyles}
        options={userPermissions}
        value={userStatus}
        onChange={handleUpdateUserStatus}
        className="text-xs font-semibold w-28 md:w-40"
        isDisabled={isCurrentUserAdmin}
      />
    </div>
  );
}

export default UserListCard;
