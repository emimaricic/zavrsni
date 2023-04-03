import React from "react";

export const ButtonSpinner = () => {
  return (
    <div className="flex justify-center">
      <p>
        <svg
          className="animate-spin"
          fill="none"
          height="30"
          viewBox="0 0 48 48"
          width="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4"
            stroke="#45A29E"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
        </svg>
      </p>
    </div>
  );
};
