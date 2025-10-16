import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { HiOutlineLockClosed } from "react-icons/hi";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(GlobalContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Register user (send OTP)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!fullName || !email || !password)
        throw new Error("All fields are required");

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          fullName,
          email,
          password,
        }
      );

      console.log("OTP sent:", response.data.message);
      setShowOtpModal(true); // Show OTP modal
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!otp) throw new Error("Please enter OTP");

      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        {
          identifier: email,
          otp,
        }
      );

      const userData = response.data.user;
      const token = response.data.token;

      // ✅ set user only after OTP verify
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userToken", token);
      setUser(userData);

      window.dispatchEvent(
        new CustomEvent("auth-state-change", { detail: { user: userData } })
      );

      navigate("/account");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-[Inter]">
      <form
        className="p-8 bg-white  rounded-2xl  shadow-2xl w-full max-w-sm border border-gray-100"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 bg-red-50 p-3  rounded-full mb-6 text-center border border-red-200">
            {error}
          </p>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <div className="group relative flex items-center w-full border border-gray-300 rounded-full  overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition">
            <span className="p-3 text-gray-500 group-focus-within:text-primary">
              <HiOutlineUser size={20} />
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full h-full border-none px-0 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <div className="group relative flex items-center w-full border border-gray-300  rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition">
            <span className="p-3 text-gray-500 group-focus-within:text-primary">
              <HiOutlineMail size={20} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-full border-none px-0 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="group relative flex items-center w-full border border-gray-300 rounded-full  overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition">
            <span className="p-3 text-gray-500 group-focus-within:text-primary">
              <HiOutlineLockClosed size={20} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-full border-none px-0 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4  rounded-full cursor-pointer bg-primary text-white font-semibold text-lg transition duration-300 shadow-lg shadow-orange-200/50 hover:bg-orange-600 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleOtpVerify}
            className="bg-white p-6  rounded-full  shadow-lg w-full max-w-sm"
          >
            <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full border border-gray-300  rounded-full  px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4   rounded-full bg-primary text-white font-medium hover:bg-orange-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;
