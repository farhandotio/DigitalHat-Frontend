import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

// React Icons
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineLockClosed } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/account");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password)
        throw new Error("Email and password are required");

      const response = await axios.post(
        "  https://digitalhat-server.onrender.com/api/auth/login",
        { email, password }
      );

      const userData = response.data.user;
      const token = response.data.token;

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userToken", token);

      setUser(userData);

      window.dispatchEvent(
        new CustomEvent("auth-state-change", { detail: { user: userData } })
      );

      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-1000 min-h-screen w-screen bg-gray-50 p-4 font-[Inter]">
      <div className="flex justify-center items-center min-h-screen">
        <form
          className="p-8 bg-white  rounded-2xl  shadow-2xl w-full max-w-sm border border-gray-100"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-500 bg-red-50 p-3 rounded-full  mb-6 text-center border border-red-200">
              {error}
            </p>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <div className="group relative flex items-center w-full border border-gray-300 rounded-full  overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition">
              <span className="p-3 text-gray-500 group-focus-within:text-primary">
                <HiOutlineMail size={20} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full h-full border-none px-0 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="group relative flex items-center w-full border border-gray-300 rounded-full  overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition">
              <span className="p-3 text-gray-500 group-focus-within:text-primary">
                <HiOutlineLockClosed size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-full border-none px-0 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-3 text-gray-500 hover:text-gray-700 absolute right-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-full  cursor-pointer bg-primary text-white font-semibold text-lg transition duration-300 shadow-lg shadow-orange-200/50 hover:bg-orange-600 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
