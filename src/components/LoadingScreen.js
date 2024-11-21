import React from "react";
import { motion } from "framer-motion";
//import './LoadingScreen.css';  // Create a CSS file for custom styles

const LoadingScreen = () => {
  return (
    <motion.div
      className="loading-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        className="loading-icon"
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      >
        🔄
      </motion.div>
      
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
