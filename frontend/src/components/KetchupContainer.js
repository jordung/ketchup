import KetchupAvatarCheck from "./KetchupAvatarCheck";
import KetchupCard from "./KetchupCard";
import { PiHandWavingBold } from "react-icons/pi";

function KetchupContainer(props) {
  const { dailyKetchups, usersWithoutKetchups } = props;

  //TODO: FIX KETCHUP CONTAINER;
  return (
    <div className="min-w-full xl:min-w-[75%] max-w-min rounded-lg shadow-xl">
      <div className="w-full bg-base-100 rounded-t-lg p-4">
        <h3 className="text-xl font-semibold">Today's Ketchup</h3>
        <div className="mt-2 flex gap-2 max-w-full overflow-x-auto">
          {/* Avatar Card */}
          {dailyKetchups.length > 0 &&
            dailyKetchups.map((ketchup) => (
              <KetchupAvatarCheck
                key={ketchup.id}
                profilePicture={ketchup.creator.profilePicture}
                firstName={ketchup.creator.firstName}
                lastName={ketchup.creator.lastName}
                userId={ketchup.creator.id}
                checkedIn={true}
              />
            ))}
          {usersWithoutKetchups.length > 0 &&
            usersWithoutKetchups.map((user) => (
              <KetchupAvatarCheck
                key={user.id}
                profilePicture={user.profilePicture}
                firstName={user.firstName}
                lastName={user.lastName}
                userId={user.id}
                checkedIn={false}
              />
            ))}
        </div>
      </div>
      <div className="w-full bg-white rounded-b-lg p-4">
        <h3 className="text-lg font-semibold">Main Focus</h3>
        <div className="w-full">
          {/* Ketchup Card */}
          {dailyKetchups.length > 0 ? (
            dailyKetchups.map((ketchup) => (
              <KetchupCard
                key={ketchup.id}
                ketchupId={ketchup.id}
                userId={ketchup.creator.id}
                profilePicture={ketchup.creator.profilePicture}
                firstName={ketchup.creator.firstName}
                lastName={ketchup.creator.lastName}
                createdDate={ketchup.createdAt}
                agendas={ketchup.ketchup_agendas}
                groupedReactions={ketchup.groupedReactions}
                mood={ketchup.mood}
              />
            ))
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-accent p-1 rounded-full">
                <PiHandWavingBold className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">
                Start checking in now!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KetchupContainer;
