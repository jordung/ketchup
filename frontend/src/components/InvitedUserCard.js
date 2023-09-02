import moment from "moment";

function InvitedUserCard(props) {
  const { email, date, status } = props;

  return (
    <div className="flex items-center justify-between min-w-full lg:min-w-0">
      <div className="flex items-center gap-2">
        <div className="flex flex-col justify-start w-32 text-gray-500 md:w-full">
          <p className="text-sm truncate">{email}</p>
          <p className="text-xs">
            Sent on{" "}
            <span className="font-semibold">
              {moment(date).format("DD MMM YYYY")}
            </span>
          </p>
        </div>
      </div>
      <p
        className={`text-xs font-semibold w-28 md:w-40 badge h-7 border-0 ${
          status ? "badge-success" : "badge-accent"
        }`}
      >
        {status ? "confirmed" : "pending"}
      </p>
    </div>
  );
}

export default InvitedUserCard;
