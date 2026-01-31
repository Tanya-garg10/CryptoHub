import React, { useState, useEffect } from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ message: initialMessage = "Analyzing Blockchain Data..." }) => {
  const [message, setMessage] = useState("Welcome to CryptoHub");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Switch message at 1s
    const msgTimer = setTimeout(() => setMessage(initialMessage), 1000);
    // Trigger fade-out at 1.7s
    const exitTimer = setTimeout(() => setIsExiting(true), 1700);

    return () => {
      clearTimeout(msgTimer);
      clearTimeout(exitTimer);
    };
  }, [initialMessage]);

  return (
    <div className={`elite-loading-overlay ${isExiting ? 'exit-warp' : ''}`}>
      <div className="loader-orbit-container">
        <div className="loader-ring ring-1"></div>
        <div className="loader-ring ring-2"></div>
        <div className="loader-ring ring-3"></div>
        <div className="loader-logo-pulse">
          <img src="/favicon.svg" alt="CryptoHub" />
        </div>
      </div>
      <div className="loader-content">
        <p className="loader-message">{message}</p>
        <div className="loader-progress-bar">
          <div className="loader-progress-inner"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;