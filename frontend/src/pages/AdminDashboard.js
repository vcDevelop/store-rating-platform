import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import UpdatePassword from "../components/UpdatePassword";
import Message from "../components/Message";

function AdminDashboard() {
  const { logout } = useContext(AuthContext);
const [userMsg, setUserMsg] = useState("");
const [userErr, setUserErr] = useState("");
const [storeMsg, setStoreMsg] = useState("");
const [storeErr, setStoreErr] = useState("");

  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [store, setStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      alert("Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Create user (USER / ADMIN / STORE_OWNER)
const createUser = async () => {
  try {
    setUserErr("");
    setUserMsg("");

    await api.post("/admin/users", user);
    setUserMsg("User created successfully");
    setUser({ name: "", email: "", password: "", address: "", role: "USER" });
    fetchStats();
  } catch (err) {
    setUserErr(err.response?.data?.message || "Failed to create user");
  }
};


  // Create store
const createStore = async () => {
  try {
    setStoreErr("");
    setStoreMsg("");

    await api.post("/admin/stores", {
      ...store,
      ownerId: Number(store.ownerId),
    });

    setStoreMsg("Store created successfully");
    setStore({ name: "", email: "", address: "", ownerId: "" });
    fetchStats();
  } catch (err) {
    setStoreErr(err.response?.data?.message || "Failed to create store");
  }
};


  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
      <button
        onClick={logout}
        className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[
        { label: "Total Users", value: stats.users },
        { label: "Total Stores", value: stats.stores },
        { label: "Total Ratings", value: stats.ratings },
      ].map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm">{s.label}</p>
          <h3 className="text-3xl font-bold text-gray-800">{s.value}</h3>
        </div>
      ))}
    </div>

    {/* Create User */}
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Create User
      </h3>

      <Message type="success" text={userMsg} />
      <Message type="error" text={userErr} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Name", "name"],
          ["Email", "email"],
          ["Password", "password"],
          ["Address", "address"],
        ].map(([label, key]) => (
          <input
            key={key}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={label}
            type={key === "password" ? "password" : "text"}
            value={user[key]}
            onChange={(e) =>
              setUser({ ...user, [key]: e.target.value })
            }
          />
        ))}

        <select
          className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          value={user.role}
          onChange={(e) =>
            setUser({ ...user, role: e.target.value })
          }
        >
          <option value="USER">USER</option>
          <option value="STORE_OWNER">STORE_OWNER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <button
        onClick={createUser}
        className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
      >
        Create User
      </button>
    </div>

    {/* Create Store */}
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Create Store
      </h3>

      <Message type="success" text={storeMsg} />
      <Message type="error" text={storeErr} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Store Name", "name"],
          ["Store Email", "email"],
          ["Store Address", "address"],
          ["Owner ID", "ownerId"],
        ].map(([label, key]) => (
          <input
            key={key}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={label}
            value={store[key]}
            onChange={(e) =>
              setStore({ ...store, [key]: e.target.value })
            }
          />
        ))}
      </div>

      <button
        onClick={createStore}
        className="mt-5 bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition"
      >
        Create Store
      </button>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6">
      <UpdatePassword />
    </div>
  </div>
);

}

export default AdminDashboard;
