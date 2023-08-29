import gradient from "../assets/landing/gradient.png";
import app from "../assets/landing/demo.png";
import async from "../assets/landing/async.svg";
import ticket from "../assets/landing/ticket.svg";
import document from "../assets/landing/document.svg";
import { FaCode, FaRegHandPeace, FaRegFileLines } from "react-icons/fa6";
import logo from "../assets/ketchup-logo-bottle.png";
import jordan from "../assets/landing/jordan.jpeg";
import jaelyn from "../assets/landing/jaelyn.jpg";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LoadingContext } from "../App";

function Landing() {
  const { setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20 w-full">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center xl:flex-row-reverse xl:mx-28">
        <div className="relative w-full py-16">
          <img
            src={gradient}
            alt="gradient background"
            className="absolute inset-0 w-[150vh] h-full object-cover z-0 xl:inset-y-20"
          />
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <img src={app} alt="app demo" className="w-11/12 flex-shrink-0" />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 px-12 max-w-lg xl:gap-4">
          <h1 className="text-3xl font-bold text-center xl:text-[2.5rem] xl:text-left">
            Standing up has never been easier
          </h1>
          <p className="text-center text-sm xl:text-left">
            Ketchup aligns everyone in the team so that everyone is always
            effortlessly on the same page
          </p>
          <button
            type="button"
            className="btn btn-primary w-full rounded-xl normal-case xl:w-3/4"
            onClick={() => navigate("/signup")}
          >
            Try for free!
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col justify-center items-center my-16">
        <h6 className="text-2xl font-bold">Features</h6>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col">
            <img src={async} alt="async standup" className="h-28 w-auto" />
            <p className="font-semibold text-center">Async Standup</p>
          </div>
          <div className="flex flex-col">
            <img src={ticket} alt="ticket tracking" className="h-28 w-auto" />
            <p className="font-semibold text-center">Ticket Tracking</p>
          </div>
          <div className="flex flex-col">
            <img
              src={document}
              alt="document tracking"
              className="h-28 w-auto"
            />
            <p className="font-semibold text-center">Document Tracking</p>
          </div>
        </div>
      </div>

      {/* Why Ketchup? section */}
      <div className="flex flex-col justify-center items-center my-16">
        <h6 className="text-2xl font-bold">
          Why <span className="text-primary">Ketchup</span>?
        </h6>
        <div className="flex flex-col gap-4 my-4 w-3/4 max-w-md">
          <div className="flex items-center gap-4">
            <FaCode className="bg-base-100 h-10 w-10 p-2 rounded-xl flex-shrink-0" />
            <p className="font-semibold text-sm">No code all-in-one app</p>
          </div>
          <div className="flex items-center gap-4">
            <FaRegHandPeace className="bg-base-100 h-10 w-10 p-2 rounded-xl flex-shrink-0" />
            <p className="font-semibold text-sm">Best suited for small teams</p>
          </div>
          <div className="flex items-center gap-4">
            <FaRegFileLines className="bg-base-100 h-10 w-10 p-2 rounded-xl flex-shrink-0" />
            <p className="font-semibold text-sm">
              Manage both tickets and files related, export them to pdf if you
              have to!
            </p>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <footer className="footer footer-center p-10 bg-base-100 text-neutral">
        <div>
          <img src={logo} alt="logo" className="w-16 h-auto" />
          <p className="font-bold">
            The Ketchup Corner <br />
            Starting up since 2023.
          </p>
          <p>Copyright © 2023 - All right reserved</p>
          <div className="mt-4">
            <button className="btn btn-ghost hover:bg-base-100 group transition-all duration-300">
              <a
                className="avatar flex flex-col items-center gap-1"
                href="https://www.linkedin.com/in/jaelynteo/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-12 mask mask-squircle">
                  <img
                    src={jaelyn}
                    alt="Jaelyn"
                    className="saturate-0 object-contain group-hover:saturate-100 transition-all duration-300"
                  />
                </div>
                <p className="font-normal normal-case">Jaelyn</p>
              </a>
            </button>
            <button className="btn btn-ghost hover:bg-base-100 group">
              <a
                className="avatar flex flex-col items-center gap-1"
                href="https://www.linkedin.com/in/jordanangyida/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-12 mask mask-squircle">
                  <img
                    src={jordan}
                    alt="Jordan"
                    className="saturate-0 object-contain group-hover:saturate-100 transition-all duration-300"
                  />
                </div>
                <p className="font-normal normal-case">Jordan</p>
              </a>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
