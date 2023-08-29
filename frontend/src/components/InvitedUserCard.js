function InvitedUserCard(props) {
  return (
    <div className="flex items-center justify-between max-w-sm">
      <div className="flex items-center gap-2">
        <img
          src={props.profilePicture}
          alt=""
          className="w-8 h-8 object-cover rounded-full flex-shrink-0"
        />
        <div className="flex flex-col justify-start w-32 md:w-40">
          <p className="text-sm font-semibold">{props.name}</p>
          <p className="text-gray-500 text-xs truncate">{props.email}</p>
        </div>
      </div>
      <p className="text-xs font-semibold w-28 md:w-40 badge border-0">
        Pending
      </p>
    </div>
  );
}

export default InvitedUserCard;
