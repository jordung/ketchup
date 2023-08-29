import jordan from "../assets/landing/jordan.jpeg";
import { PiCheckBold, PiXBold } from "react-icons/pi";

function KetchupAvatarCheck(props) {
  return (
    <div className="avatar">
      <div className="w-12 rounded-full">
        <img src={jordan} alt="avatar" />
      </div>
      <span
        className={`absolute bottom-0 right-0 p-1 rounded-full ${
          props.checkedIn ? "bg-success" : "bg-error"
        }`}
      >
        {props.checkedIn ? (
          <PiCheckBold className="h-3 w-3" />
        ) : (
          <PiXBold className="h-3 w-3" />
        )}
      </span>
    </div>
  );
}

export default KetchupAvatarCheck;
