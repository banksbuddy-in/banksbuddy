import React from "react";
import { useNavigate } from "react-router-dom";

export const Services = () => {
  const navigate = useNavigate();
  const BuddyNavigate = (url) => {
    navigate(url);
  };

  return (
    <div id="Services">
      <h1 className="shead">OUR SERVICES <br /> <span>Catering your needs with tailored products for financial actualization.

</span></h1>
      <div className="scont">
        <div className="div1" onClick={() => BuddyNavigate("/personal-loan")}>
          <video src="/d1.mp4" autoPlay muted loop />
          <h1>Personal Loan</h1>
          <p>
            Flexible and hassle-free loans to meet your personal financial
            requirements, from unexpected expenses to dream vacations.
          </p>
        </div>
        <div className="div2" onClick={() => BuddyNavigate("/business-loan")}>
          <img src="/d2.jpg" alt="d2.webp" />
          <h1>Business Loan</h1>
          <p>
            Fuel your entrepreneurial journey with customizable business loans
            to support expansion, operations, or new ventures.
          </p>
        </div>
        <div className="div4" onClick={() => BuddyNavigate("/education-loan")}>
          <img src="/d4.jpg" alt="d4.webp" />
          <h1>Education Loan</h1>
          <p>
            Empowering your academic aspirations with loans to cover tuition
            fees, study materials, and living expenses.
          </p>
        </div>
        <div className="div3" onClick={() => BuddyNavigate("/home-loan")}>
          <img src="/d3.jpg" alt="d3.jpg" />
          <h1>Home Loan</h1>
          <p>
            Affordable housing finance solutions to help you turn your dream of
            owning a home into reality.
          </p>
        </div>
        <div className="div5" onClick={() => BuddyNavigate("/machinery-loan")}>
          <img src="/d5.jpg" alt="d5.jpg" />
          <h1>Machinery Loan</h1>
          <p>
            Drive your dream car with our competitive auto loan offerings,
            designed for easy and quick approval.
          </p>
        </div>
      </div>
    </div>
  );
};
