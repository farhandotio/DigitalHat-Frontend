import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { GlobalContext } from "../../../context/GlobalContext";

const ProfileIcon = () => {
  const { user } = useContext(GlobalContext);

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
            <span className="text-xs text-white/90">{user.email}</span>
          </div>
        </Link>
      ) : (
        <Link
          to="/login"
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
