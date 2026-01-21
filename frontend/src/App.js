import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import StoreList from "./pages/StoreList";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthContext } from "./context/AuthContext";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  const { role } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* NOT LOGGED IN */}
        {!role && (
          <Route path="*" element={<Login />} />
        )}

        {/* NORMAL USER */}
        {role === "USER" && (
          <Route path="/" element={<StoreList />} />
        )}

        {/* ADMIN */}
        {role === "ADMIN" && (
          <Route path="/" element={<AdminDashboard />} />
        )}

        {role === "STORE_OWNER" && (
  <Route path="/" element={<OwnerDashboard />} />
)}

        {/* STORE OWNER (TEMP PLACEHOLDER UI) */}
        {role === "STORE_OWNER" && (
          <Route
            path="/"
            element={<h2>Store Owner Dashboard (UI Coming Next)</h2>}
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
