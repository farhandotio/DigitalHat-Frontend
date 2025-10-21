import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-gradient-to-b from-gray-50 to-white">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[120px] sm:text-[160px] font-bold text-gray-800 select-none"
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-700 mt-2"
      >
        Oops! Page Not Found 😕
      </motion.h2>

      <p className="text-gray-500 max-w-md mt-3 mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link
          to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300"
        >
          <Home size={20} />
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
