import React from "react";
import { motion } from "framer-motion";

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  const dots = [0, 0.2, 0.4]; // delays for sequential animation

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex space-x-3">
        {dots.map((delay, index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-primary rounded-full"
            animate={{ scale: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              ease: "easeInOut",
              delay: delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
