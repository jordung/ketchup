import Select from "react-select";
import { colourStyles, userPermissions } from "../utils/selectSettings";
import { useState } from "react";
import { toast } from "react-toastify";

function UserListCard(props) {
  const [userStatus, setUserStatus] = useState({ value: true, label: "Admin" });

  const handleUpdateUserStatus = async (value) => {
    setUserStatus(value);
    toast.success(
      `${props.name} has been successfully updated to ${value.label}`
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={props.profilePicture}
          alt=""
          className="w-8 h-8 object-cover rounded-full flex-shrink-0"
        />
        <div className="flex flex-col justify-start w-32 md:w-full">
          <p className="text-sm font-semibold">{props.name}</p>
          <p className="text-gray-500 text-xs truncate">{props.email}</p>
        </div>
      </div>
      <Select
        styles={colourStyles}
        options={userPermissions}
        value={userStatus}
        onChange={handleUpdateUserStatus}
        className="text-xs font-semibold w-28 md:w-40"
      />
    </div>
  );
}

export default UserListCard;
