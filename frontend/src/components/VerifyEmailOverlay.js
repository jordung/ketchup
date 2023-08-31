import logo from "../assets/ketchup-logo.png";

function VerifyEmailOverlay() {
  return (
    <div className="fixed z-50 h-screen backdrop-blur-md flex flex-col justify-center items-center px-4 w-screen">
      <img src={logo} alt="logo" className="w-24 object-contain" />
      <div className="flex flex-col items-center justify-center text-center">
        <p className="font-semibold text-sm my-">
          Kindly verify your email before proceeding
        </p>
        <p className="font-semibold text-sm">
          Verification information can be found in the email sent to you
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailOverlay;
