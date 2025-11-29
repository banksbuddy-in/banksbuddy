import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroEMI = () => {
  const navigate = useNavigate();

  const HandleHeroEMI = () => {
    navigate("/emi-calculator");
  };

  return (
    <div id="hero">
      <div className="hel">
        <h1>
          <span>EMI</span> Calculator
        </h1>
        <p>
          Easily calculate your Equated Monthly Installments for any loan. This tool helps you understand your monthly commitments before you apply for a loan. Plan your financial future with confidence BanksBuddy is committed to helping you find a repayment structure that fits your budget perfectly.
        </p>
        <button onClick={() => HandleHeroEMI()}>Calculate Now!</button>
      </div>
      <img src="/heroemi.avif" alt="heroimg" className="her" />
    </div>
  );
};
