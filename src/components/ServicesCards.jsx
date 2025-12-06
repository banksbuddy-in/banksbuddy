import React from 'react'
import { useNavigate } from 'react-router-dom';

export const ServicesCards = () => {
  const navigate = useNavigate();
  const BuddyNavigate = (url) => {
    navigate(url);
  };
  
  return (
     <div className="scont">
        <div className="div1" onClick={() => BuddyNavigate("/services/personal-loan")}>

          <video src="/d1.mp4" autoPlay muted loop />
          <h1>Personal Loan</h1>
          <p>
            Flexible and hassle-free loans to meet your personal financial
            requirements, from unexpected expenses to dream vacations.
          </p>
          <a className="kn" onClick={() => BuddyNavigate("/services/personal-loan")}>Know more</a>
        </div>
        <div className="div2" onClick={() => BuddyNavigate("/services/business-loan")}>

          <img src="/d2.jpg" alt="d2.webp" />
          <h1>Business Loan</h1>
          <p>
            Fuel your entrepreneurial journey with customizable business loans
            to support expansion, operations, or new ventures.
          </p>
          <a className="kn" onClick={() => BuddyNavigate("/services/education-loan")}>Know more</a>
        </div>
        <div className="div4" onClick={() => BuddyNavigate("/services/education-loan")}>

          <img src="/d4.jpg" alt="d4.webp" />
          <h1>Education Loan</h1>
          <p>
            Empowering your academic aspirations with loans to cover tuition
            fees, study materials, and living expenses.
          </p>
          <a className="kn" onClick={() => BuddyNavigate("/services/education-loan")}>Know more</a>
        </div>
        <div className="div3" onClick={() => BuddyNavigate("/services/home-loan")}>

          <img src="/d6.jpg" alt="d3.jpg" />
          <h1>Home Loan</h1>
          <p>
            Affordable housing finance solutions to help you turn your dream of
            owning a home into reality.{"ㅤㅤㅤㅤㅤㅤㅤㅤ"}
          </p>
          <a className="kn" onClick={() => BuddyNavigate("/services/home-loan")}>Know more</a>
        </div>
        <div className="div5" onClick={() => BuddyNavigate("/services/auto-loan")}>

          <img src="/d5.jpg" alt="d5.jpg" />
          <h1>Machinery Loan</h1>
          <p>
            Drive your dream car with our competitive auto loan offerings,
            designed for easy and quick approval.
          </p>
          <a className="kn" onClick={() => BuddyNavigate("/services/machinery-loan")}>Know more</a>
        </div>
        <div className="div6" onClick={() => BuddyNavigate("/services/loan-against-property")}>

          <img src="/d3.jpg" alt="d5.jpg" />
          <h1 style={{whiteSpace:"normal"}}>Loan Against Property</h1>
          <p>
            Drive your dream car with our competitive auto loan offerings,
            designed for easy and quick approval.
          </p>
          <a className="kn" onClick={() => BuddyNavigate("/services/auto-loan")}>Know more</a>
        </div>
      </div>
  )
}
