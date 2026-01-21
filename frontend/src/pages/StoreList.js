import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import UpdatePassword from "../components/UpdatePassword";
import Message from "../components/Message";

function StoreList() {
  const { logout } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
const [msg, setMsg] = useState("");

const fetchStores = async (sortBy = "", order = "asc") => {
  const res = await api.get(
    `/stores?search=${search}&sortBy=${sortBy}&order=${order}`
  );
  setStores(res.data);
};

  useEffect(() => {
    fetchStores();
  }, []);

  const submitRating = async (storeId, value) => {
  try {
    await api.post("/ratings", { storeId, value });
    setMsg("Rating submitted");
    fetchStores();
  } catch {
    setMsg("Failed to submit rating");
  }
};


  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">Stores</h2>
      <button
        onClick={logout}
        className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>

    {/* Controls */}
    <div className="bg-white rounded-2xl shadow p-5 flex flex-wrap gap-4 items-center mb-6">
      <input
        className="px-4 py-2 border rounded-xl w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
        placeholder="Search by name or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={fetchStores}
        className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition"
      >
        Search
      </button>

      <select
        className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => fetchStores(e.target.value, "asc")}
      >
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="averageRating">Rating</option>
      </select>
    </div>

    <Message type="success" text={msg} />

    {/* Store Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <div
          key={store.id}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {store.name}
          </h3>
          <p className="text-gray-500 text-sm">{store.address}</p>

          <div className="mt-3 text-sm">
            <p>
              ⭐ <b>{store.averageRating}</b> average
            </p>
            <p className="text-gray-500">
              Your rating: {store.userRating || "Not rated"}
            </p>
          </div>

          {/* Rating Buttons */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => submitRating(store.id, n)}
                className="bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded-full transition"
              >
                {n} ⭐
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Update Password */}
    <div className="mt-10">
      <UpdatePassword />
    </div>
  </div>
);
}

export default StoreList;
