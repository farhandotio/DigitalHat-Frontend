// src/components/ProfileIcon/ProfileIcon.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const AUTH_CHANGE_EVENT = "auth-state-change";

const ProfileIcon = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // --- 1️⃣ Initial Load from Local Storage
    const storedUserData = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("userToken");

    if (storedUserData && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("userData");
        localStorage.removeItem("userToken");
      }
    }

    // --- 2️⃣ Listen for Custom Auth Change Event
    const onAuthChange = (event) => {
      const newUser = event?.detail?.user ?? null;
      if (newUser) {
        setUser(newUser);
      } else {
        const stored = localStorage.getItem("userData");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    // --- 3️⃣ Listen for Storage Change (other tabs)
    const onStorage = (e) => {
      if (e.key === "userData" || e.key === "userToken") {
        const stored = localStorage.getItem("userData");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div className="relative">
      {user ? (
        <Link
          to="/account"
          className="flex items-center gap-3 md:px-3 py-2 rounded-md transition hover:bg-white/5"
          aria-label="User Profile"
        >
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <User className="w-5 h-5 text-text" />
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <span className="text-sm font-medium text-white">
              {user.fullName || user.email}
            </span>
            <span className="text-xs text-white/90">{user.role}</span>
          </div>
        </Link>
      ) : (
        <Link
          to="/auth"
          className="flex items-center gap-2 px-3 py-2 rounded-md transition bg-white/90 hover:bg-white text-text font-medium"
          aria-label="Login / Sign Up"
        >
          <User className="w-5 h-5" />
          Login
        </Link>
      )}
    </div>
  );
};

export default React.memo(ProfileIcon);
