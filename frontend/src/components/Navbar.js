import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/ketchup-logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar fixed bg-white z-50">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <button className="btn btn-link">
            <img
              className="w-16 h-auto md:w-20 object-contain"
              draggable="false"
              src={logo}
              alt="logo"
            />
          </button>
        </div>
        <div className="navbar-end gap-4">
          <div className="dropdown dropdown-end" tabIndex={0}>
            <button tabIndex={0} className="btn btn-square btn-ghost xl:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            {/* mobile/tablet view of quicklinks */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <p onClick={() => navigate("/login")}>Login</p>
              </li>
              <li>
                <p onClick={() => navigate("/signup")}>Signup</p>
              </li>
            </ul>
          </div>

          <div className="hidden xl:flex">
            {/* desktop view of quicklinks */}
            <ul className="menu menu-horizontal px-1 gap-4">
              <button
                className="hidden btn btn-ghost btn-sm normal-case xl:h-10 xl:inline-flex"
                onClick={() => navigate("/login")}
              >
                <p className="text-sm font-semibold">Login</p>
              </button>
              <button
                className="hidden btn btn-neutral btn-sm normal-case xl:h-10 xl:inline-flex"
                onClick={() => navigate("/signup")}
              >
                <p className="text-sm font-semibold">Signup</p>
              </button>
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
