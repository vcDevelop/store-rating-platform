import { useState } from "react";
import api from "../services/api";
import Message from "./Message";

function UpdatePassword() {
  const [show, setShow] = useState(false);
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const updatePassword = async () => {
    try {
      setErr("");
      setMsg("");

      await api.put("/profile/password", {
        oldPassword,
        newPassword,
      });

      setMsg("Password updated successfully");
      setOld("");
      setNew("");
      setShow(false);
    } catch (e) {
      setErr(e.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {!show && (
        <button
          onClick={() => setShow(true)}
          className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Update Password
        </button>
      )}

      {show && (
        <div className="animate-[fadeIn_0.4s_ease-out]">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Change Password
          </h3>

          <Message type="success" text={msg} />
          <Message type="error" text={err} />

          <input
            className="w-full px-4 py-2 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={updatePassword}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
