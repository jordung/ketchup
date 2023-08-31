function InvitedUserCard(props) {
  return (
    <div className="flex items-center justify-between min-w-full lg:min-w-0">
      <div className="flex items-center gap-2">
        <div className="flex flex-col justify-start w-32 text-gray-500 md:w-full">
          <p className="text-sm truncate">{props.email}</p>
          <p className="text-xs">
            Sent on <span className="font-semibold">24 Aug 2023</span>
          </p>
        </div>
      </div>
      <p className="text-xs font-semibold w-28 md:w-40 badge badge-accent h-7 border-0">
        Pending
      </p>
    </div>
  );
}

export default InvitedUserCard;
