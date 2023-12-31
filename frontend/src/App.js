import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "./utils/socket-client";

// Components
import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner";
import Sidebar from "./components/Sidebar";

// Pages
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SetOrganisation from "./pages/SetOrganisation";
import SignupThroughInvite from "./pages/SignupThroughInvite";
import DailyKetchup from "./pages/DailyKetchup";
import Tickets from "./pages/Tickets";
import Documents from "./pages/Documents";
import Ticket from "./pages/Ticket";
import AllKetchups from "./pages/AllKetchups";
import Document from "./pages/Document";
import Preferences from "./pages/Preferences";
import VerifyUser from "./pages/VerifyUser";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Notifications from "./pages/Notifications";

export const LoadingContext = createContext();
export const UserContext = createContext();
export const LoggedInContext = createContext();

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      socket.emit("initialisation", {
        userId: user.id,
        organisationId: user.organisationId,
      });

      // socket.connect();
      socket.on("show_notification", function (data) {
        toast.info(data.title);
      });
      socket.on("user_join_notification", function (data) {
        toast.info(data.title);
      });
    }

    return () => {
      socket.off("show_notification");
      socket.off("user_join_notification");
    };
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const checkTokenValidity = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DB_API}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // user has account + has organisation
        if (response.data.data.user && response.data.data.user.organisationId) {
          setUser(response.data.data.user);
          localStorage.setItem("accessToken", response.data.data.accessToken);
          setIsLoggedIn(true);
          if (
            location.pathname === "/login" ||
            location.pathname === "/" ||
            location.pathname === "signup"
          ) {
            navigate("/home");
          }

          // user has account + no organisation
        } else if (
          response.data.data.user &&
          !response.data.data.user.organisationId
        ) {
          localStorage.setItem("accessToken", response.data.data.accessToken);
          setUser(response.data.data.user);
          setIsLoggedIn(true);
          navigate("/setorganisation");
        }

        // user has no organisation
      } catch (error) {
        console.log(error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (
          !location.pathname.includes("/invite") &&
          !location.pathname.includes("/verify") &&
          !location.pathname.includes("/signup") &&
          !location.pathname.includes("/")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    checkTokenValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <UserContext.Provider value={{ user, setUser }}>
        <LoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {loading && <Spinner />}
          <ToastContainer
            position="bottom-right"
            pauseOnFocusLoss={false}
            pauseOnHover={false}
          />
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
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/preferences" element={<Preferences />} />
                  <Route path="/notifications" element={<Notifications />} />
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
