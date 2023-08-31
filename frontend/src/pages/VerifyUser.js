import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../App";
import logo from "../assets/ketchup-logo.png";
import { useNavigate } from "react-router-dom";

function VerifyUser() {
  const { setLoading } = useContext(LoadingContext);
  const urlParams = new URLSearchParams(window.location.search);
  const verificationToken = urlParams.get("token");
  const [verifySuccess, setVerifySuccess] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let counter = 10;
    var interval = 0;
    if (verifySuccess === true) {
      interval = setInterval(() => {
        if (counter > 0) {
          counter--;
        }
        document
          .getElementById("counterElement")
          .style.setProperty("--value", counter);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [verifySuccess]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        const response = await axios.get(
          `${process.env.REACT_APP_DB_API}/auth/verify?token=${verificationToken}`
        );
        console.log(response);
        if (response.data.success) {
          setVerifySuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 10000);
        }
      } catch (error) {
        console.log(error);
        setVerifySuccess(false);
      }
    };

    verifyUser().then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex items-center justify-center ">
        <img src={logo} alt="logo" className="w-32 object-contain" />
      </div>
      <div className="flex flex-col items-center my-8 justify-center w-full">
        {verifySuccess ? (
          <div className="flex flex-col justify-center items-center text-center px-8 gap-3">
            <h2 className="text-xl font-semibold text-center">
              Verification Successful
            </h2>
            <p className="text-sm">
              You should be redirected to the Login page in{" "}
              <span className="countdown font-semibold">
                <span id="counterElement" style={{ "--value": 10 }}></span>
              </span>
            </p>
            <p className="text-sm">
              If you are not automatically redirected, please click{" "}
              <span
                className="link font-semibold"
                onClick={() => navigate("/login")}
              >
                here
              </span>{" "}
              to proceed
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center px-8 gap-3">
            <h2 className="text-xl font-semibold">Verification Unsuccessful</h2>
            <p className="text-sm">
              Please reach out to your admin user for more information.
            </p>
            <p className="text-sm">
              Alternatively, you may reach out to us at{" "}
              <a
                href="mailto:theketchupcorner@gmail.com"
                className="link font-semibold"
              >
                The Ketchup Corner
              </a>
            </p>
            <p className="text-xs">
              If the link above is not working, kindly send us a email at{" "}
              <span className="text-primary font-semibold">
                theketchupcorner@gmail.com
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyUser;
