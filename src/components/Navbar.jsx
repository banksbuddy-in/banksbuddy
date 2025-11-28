import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <img src="/logo1.png" alt="Banks Buddy" />
      </a>
      <ul className="navlist">
        <li>
          <Link style={{color:"black"}} to="/">Home</Link>
        </li>
        <li>
          <Link style={{color:"black"}} to="/about-us">About</Link>
        </li>
        <li>
          <Link style={{color:"black"}} to="/services">Services</Link>
        </li>
        <li>
          <Link style={{color:"black"}} to="https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=Inquiry%20Regarding%20Loan%20Support&body=Hi%20BanksBuddy%20Team%2C%0A%0AI%20am%20interested%20in%20your%20financial%20services.%0A%0AMy%20Details%3A%0AName%3A%20%0APhone%20Number%3A%20%0AType%20of%20Loan%20Needed%20(Personal%2FBusiness)%3A%20%0A%0APlease%20guide%20me%20through%20the%20process.%0A%0AThanks!">Contact Us</Link>
        </li>
        <li>
          <Link style={{color:"black"}} to="/emi-calculator">EMI Calculator</Link>
        </li>
        <li className="nbtn" style={{ color: "white" }}>
          <Link className="btns" to="https://wa.me/+917723926058">
            Chat with us
          </Link>
        </li>
      </ul>
    </nav>
  );
};
