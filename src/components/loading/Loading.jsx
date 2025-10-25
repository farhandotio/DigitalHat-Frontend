import React from "react";
import { motion } from "framer-motion";
import { PiSpinnerBold } from "react-icons/pi";

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="h-full w-full flex justify-center items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      >
        <PiSpinnerBold className="text-primary text-4xl" />
      </motion.div>
    </div>
  );
};

export default Loading;
