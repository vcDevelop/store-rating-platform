import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import UpdatePassword from "../components/UpdatePassword";

function OwnerDashboard() {
  const { logout } = useContext(AuthContext);
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/owner/dashboard");
      setData(res.data);
    } catch (err) {
      alert("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <p>Loading...</p>;

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-3xl font-bold text-gray-800">
        {data.storeName}
      </h2>
      <button
        onClick={logout}
        className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>

    {/* Summary Card */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <p className="text-gray-500 text-sm">Average Rating</p>
      <h3 className="text-4xl font-bold text-gray-800 mt-2">
        ⭐ {data.averageRating}
      </h3>
    </div>

    {/* Ratings List */}
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Customer Ratings
      </h3>

      <div className="space-y-3 max-h-[350px] overflow-y-auto">
        {data.ratings.map((r, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-gray-50 rounded-xl p-3"
          >
            <div>
              <p className="font-medium text-gray-800">{r.user}</p>
              <p className="text-xs text-gray-500">{r.email}</p>
            </div>
            <span className="font-bold text-yellow-500">
              ⭐ {r.rating}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Update Password */}
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <UpdatePassword />
    </div>

  </div>
);

}

export default OwnerDashboard;
