import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const productName = "Loan Support";
  const subject = `Banksbuddy - INQUIRY Regarding ${productName}`;

  const body = `Hello BanksBuddy Team,

[your message here]

Name: [Full Name]
Email: [your.email@example.com]
Phone Number: [Country code + number]
Location: [City, State, Country]
Product / Service: ${productName}
Employment Status: [Salaried / Self-employed / Other]
If Loan — Loan Amount Required: [Amount or N/A]
Preferred Contact Method: [Email / Phone]
Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]

Brief Message / Additional Details:
[Short paragraph describing purpose / urgency / additional context]


Thank you for your time.
Warm regards,
[Your Full Name]`;

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <img src="/logo1.png" alt="Banks Buddy" />
      </a>
      <ul className="navlist">
        <li>
          <Link className="nvanime" style={{ color: "black" }} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="nvanime" style={{ color: "black" }} to="/about-us">
            About
          </Link>
        </li>
        <li>
          <Link className="nvanime" style={{ color: "black" }} to="/services">
            Services
          </Link>
        </li>
        <li>
          <Link className="nvanime" style={{ color: "black" }} to="/careers">
            Careers
          </Link>
        </li>
        <li>
          <Link
            className="nvanime"
            style={{ color: "black" }}
            to="/trusted-partner"
          >
            Partners
          </Link>
        </li>
        <li>
          <a
            className="nvanime"
            style={{ color: "black" }}
            href={gmailHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us
          </a>
        </li>
        <li>
          <Link
            className="nvanime"
            style={{ color: "black" }}
            to="/emi-calculator"
          >
            EMI Calculator
          </Link>
        </li>
        <li className="nbtn" style={{ color: "white" }}>
          <Link className="btns" to="https://wa.me/+916377956633">
            Chat with us
          </Link>
        </li>
      </ul>
    </nav>
  );
};
