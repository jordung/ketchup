import loading from "../assets/spinner/bottle-filling.gif";

function Spinner() {
  return (
    <div className="absolute z-50 h-screen w-screen backdrop-blur-lg flex flex-col justify-center items-center">
      <img className="h-40" src={loading} alt="spinning" />
      <p className="text-neutral font-semibold">Loading...</p>
    </div>
  );
}

export default Spinner;
