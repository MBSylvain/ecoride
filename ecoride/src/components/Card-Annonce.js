import React from "react";
import "./CardAnnonce.css";

const CardAnnonce = ({ text }) => {
  return <div className="bg-white bg-opacity-50 rounded-lg p-4">{text}</div>;
};

export default CardAnnonce;
