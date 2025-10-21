import React from "react";
import "../assets/css/DLoader.css";

const MainLoader = () => {
  return (
    <div className="dloader-wrapper">
      <svg
        viewBox="0 0 100 100"
        width="120"
        height="120"
        className="dloader-svg"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
        <path
          d="M30 20 L30 80 Q80 50 30 20 Z"
          className="dloader-path"
          stroke="url(#grad)"
        />
      </svg>
      <p className="dloader-text">Cargando ...</p>
    </div>
  );
};

export default MainLoader;
