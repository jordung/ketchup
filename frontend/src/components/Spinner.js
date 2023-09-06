import loading from "../assets/spinner/bottle-filling.gif";

function Spinner() {
  return (
    <div className="absolute z-30 min-h-screen max-h-full w-screen backdrop-blur-md flex flex-col justify-center items-center">
      <img className="h-40" src={loading} alt="spinning" />
      <p className="text-neutral font-semibold">Loading...</p>
    </div>
  );
}

export default Spinner;
