import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";


function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.role);
    } catch (err) {
  setError("Invalid email or password");
}
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
    <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px] animate-[fadeIn_0.6s_ease-out]">
      
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Sign In
      </h2>

      <Message type="error" text={error} />

      {/* Email */}
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        Email
      </label>
      <div className="flex items-center border rounded-xl px-4 py-3 mb-5 focus-within:ring-2 focus-within:ring-indigo-500">
        <span className="text-gray-400 mr-3"></span>
        <input
          className="w-full outline-none text-sm"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        Password
      </label>
      <div className="flex items-center border rounded-xl px-4 py-3 mb-5 focus-within:ring-2 focus-within:ring-indigo-500">
        <span className="text-gray-400 mr-3"></span>
        <input
          type="password"
          className="w-full outline-none text-sm"
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
{/* 
      <div className="flex justify-between items-center text-sm mb-6">
        <label className="flex items-center gap-2 text-gray-600">
          <input type="checkbox" className="rounded" />
          Remember me
        </label>
        <span className="text-indigo-600 cursor-pointer hover:underline">
          Forgot password?
        </span>
      </div> */}

      <button
        onClick={handleLogin}
        className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Sign In
      </button>
    </div>
  </div>
);
}

export default Login;
