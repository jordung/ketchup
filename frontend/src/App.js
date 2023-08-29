import { Routes, Route, useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

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

export const LoadingContext = createContext();
export const UserContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

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
        {loading && <Spinner />}
        {/* {location.pathname === "/home" &&
          ((user !== null && user.emailVerified === false) ||
            user === null) && <VerifyEmailOverlay />} */}
        <Routes>
          <Route element={<Navbar />}>
            {/* Routes with Navbar */}
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Routes with Sidebar */}
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

          {/* Routes without Navbar or Sidebar */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/invite/:inviteCode" element={<SignupThroughInvite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setorganisation" element={<SetOrganisation />} />
          <Route path="/verify" element={<VerifyUser />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </UserContext.Provider>
    </LoadingContext.Provider>
  );
}

export default App;
