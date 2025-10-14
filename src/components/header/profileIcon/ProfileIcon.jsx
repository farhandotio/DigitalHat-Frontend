import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { GlobalContext } from "../../../context/GlobalContext";

const ProfileIcon = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`flex items-center gap-3 md:px-3 cursor-pointer py-2 rounded-md transition ${
          user
            ? "hover:bg-white/5"
            : "text-white hover:bg-secondary/50 font-medium"
        }`}
        aria-label={user ? "User Profile" : "Login / Sign Up"}
      >
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
          <User className="w-5 h-5 text-text" />
        </div>

        {user && (
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-sm font-medium text-white">
              {user.fullName || user.email}
            </span>
            <span className="text-xs text-white/90">{user.email}</span>
          </div>
        )}

        {!user && <span>Login</span>}
      </button>
    </div>
  );
};

export default React.memo(ProfileIcon);
