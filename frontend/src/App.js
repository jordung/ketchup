import { Routes, Route, useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

// Components
import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner";
import Sidebar from "./components/Sidebar";
// import VerifyEmailOverlay from "./components/VerifyEmailOverlay";

// Pages
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SetOrganisation from "./pages/SetOrganisation";
import SignupThroughInvite from "./pages/SIgnupThroughInvite";
import DailyKetchup from "./pages/DailyKetchup";
import Tickets from "./pages/Tickets";
import Documents from "./pages/Documents";
import Ticket from "./pages/Ticket";
import AllKetchups from "./pages/AllKetchups";
import Document from "./pages/Document";
import Preferences from "./pages/Preferences";
import VerifyUser from "./pages/VerifyUser";
import Error from "./pages/Error";
import axios from "axios";

export const LoadingContext = createContext();
export const UserContext = createContext();
export const LoggedInContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const checkTokenValidity = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DB_API}/refresh`,
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.data && response.data.data.organisationId) {
          setUser(response.data.data);
          setIsLoggedIn(true);
          navigate("/home");
        } else if (response.data.data && !response.data.data.organisationId) {
          setUser(response.data.data);
          setIsLoggedIn(true);
          navigate("/setorganisation");
        }
      } catch (error) {
        navigate("/login");
      }
    };
    checkTokenValidity();
  }, []);

  // * get user on load App if logged in
  // 1. check localStorage for existing accessToken and refreshToken
  // 2. send refreshToken to backend (includ. headers: authorisation passing accessToken here) to verify
  // 3a. BE use refreshToken to return user Obj
  // 3b. accessToken is invalid, refreshToken is valid -> BE to issue new accessToken + return userObj
  // 3c. accessToken and refreshToken is invalid -> redirect to “login”

  // ? need to think about how to check accessToken silently

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <UserContext.Provider value={{ user, setUser }}>
        <LoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {loading && <Spinner />}
          <ToastContainer />
          {/* {location.pathname === "/home" &&
          ((user !== null && user.emailVerified === false) ||
            user === null) && <VerifyEmailOverlay />} */}
          <Routes>
            <Route element={<Navbar />}>
              {/* Routes with Navbar */}
              <Route path="/" element={<Landing />} />
            </Route>

            {isLoggedIn && (
              <>
                {/* Routes with Sidebar & Authenticated*/}
                <Route element={<Sidebar />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/daily" element={<DailyKetchup />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/tickets/:ticketId" element={<Ticket />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/documents/:documentId" element={<Document />} />
                  <Route path="/allketchups" element={<AllKetchups />} />
                  <Route path="/preferences" element={<Preferences />} />
                </Route>

                {/* Routes without Navbar or Sidebar & Authenticated */}
                <Route path="/setorganisation" element={<SetOrganisation />} />
              </>
            )}

            {/* Routes without Navbar or Sidebar & Unauthenticated */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/invite" element={<SignupThroughInvite />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyUser />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </LoggedInContext.Provider>
      </UserContext.Provider>
    </LoadingContext.Provider>
  );
}

export default App;
