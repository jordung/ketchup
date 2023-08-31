import { useNavigate } from "react-router-dom";
import { PiCheckBold, PiXBold } from "react-icons/pi";

function KetchupAvatarCheck(props) {
  const { profilePicture, firstName, lastName, userId, checkedIn } = props;
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer avatar tooltip tooltip-right before:text-xs group"
      data-tip={`${firstName} ${lastName}`}
      onClick={() => navigate(`/profile/${userId}`)}
    >
      <div className="w-12 rounded-full">
        <img
          src={profilePicture}
          alt="avatar"
          className="group-hover:opacity-75 transition-all duration-300"
        />
      </div>
      <span
        className={`absolute bottom-0 right-0 p-1 rounded-full ${
          checkedIn ? "bg-success" : "bg-error"
        }`}
      >
        {checkedIn ? (
          <PiCheckBold className="h-3 w-3" />
        ) : (
          <PiXBold className="h-3 w-3" />
        )}
      </span>
    </div>
    // </div>
  );
}

export default KetchupAvatarCheck;
