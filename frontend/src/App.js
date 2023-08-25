import { Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

// Components
import Navbar from "./components/Navbar";

// Pages
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export const LoadingContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Routes>
        <Route element={<Navbar />}>
          {/* Routes with Navbar */}
          <Route path="/" element={<Landing />} />
        </Route>

        {/* Routes without Navbar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </LoadingContext.Provider>
  );
}

export default App;
