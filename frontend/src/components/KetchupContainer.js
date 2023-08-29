import KetchupAvatarCheck from "./KetchupAvatarCheck";
import KetchupCard from "./KetchupCard";

function KetchupContainer() {
  return (
    <div className="w-full rounded-lg shadow-xl">
      <div className="w-full bg-base-100 rounded-t-lg p-4">
        <h3 className="text-xl font-semibold">Today's Ketchup</h3>
        <div className="mt-2 flex gap-2 overflow-x-auto max-w-full">
          {/* Avatar Card */}
          <KetchupAvatarCheck checkedIn={true} />
          <KetchupAvatarCheck checkedIn={false} />
          <KetchupAvatarCheck checkedIn={true} />
        </div>
      </div>
      <div className="w-full bg-white rounded-b-lg p-4">
        <h3 className="text-lg font-semibold">Main Focus</h3>
        <div className="w-full">
          {/* Ketchup Card */}
          <KetchupCard key="1" />
          <KetchupCard key="2" />
        </div>
      </div>
    </div>
  );
}

export default KetchupContainer;
