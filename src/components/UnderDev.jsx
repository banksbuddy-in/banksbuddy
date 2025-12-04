import React from "react";
import { useNavigate } from "react-router-dom";

export const UnderDev = () => {
  const navigate = useNavigate();
  const Highlight = () => {
    navigate("/");
  }
  return (
    <div className="UDC">
      <h1 >Section under Development</h1>
      <p onClick={() => Highlight()}>Back to Homepage</p>
    </div>
  );
};
