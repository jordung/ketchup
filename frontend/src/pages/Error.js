import { useContext, useEffect } from "react";
import logo from "../assets/ketchup-logo.png";
import { LoadingContext } from "../App";
import { useNavigate } from "react-router-dom";

function Error() {
  const { setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex items-center justify-center ">
        <img src={logo} alt="logo" className="w-32 object-contain" />
      </div>
      <div className="flex flex-col items-center my-8 justify-center w-full lg:max-w-lg">
        <div className="flex flex-col justify-center items-center text-center px-8 gap-3">
          <h2 className="text-xl font-semibold">Oops!</h2>
          <p className="text-sm">
            Looks like you've taken a detour into the unexplored territory of
            Ketchup!
          </p>
          <p className="text-sm">
            Much like when you take a bite of a new dish and discover unexpected
            flavors, you've stumbled upon a page that's yet to be fully cooked.
          </p>
          <p className="text-sm">
            Don't worry, though—just as mixing ketchup into recipes can lead to
            delightful surprises, our developers are whipping up the right
            ingredients to make this page as smooth as a dollop of your favorite
            condiment.
          </p>
          <p className="text-sm">
            So sit tight, embrace the adventure, and get ready for the full
            Ketchup experience!
          </p>
          <button
            className="text-sm btn btn-primary normal-case btn-sm w-full mt-2"
            onClick={() => navigate("/home")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
