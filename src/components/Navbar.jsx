import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";
import { RiMenuFold4Fill } from "react-icons/ri";

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

  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navlist suv"></div>
      <a href="/" className="logo">
        <img src="/logo1.png" alt="Banks Buddy" />
      </a>

      <button
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="burger" aria-hidden="true">
          {open ? <RiMenuFold4Fill /> : <CgMenuRightAlt />}
        </span>
      </button>

      <ul className={`navlist ${open ? "open" : ""}`}>
        <li>
          <Link onClick={() => setOpen(false)} className="nvanime" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setOpen(false)}
            className="nvanime"
            to="/about-us"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setOpen(false)}
            className="nvanime"
            to="/services"
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setOpen(false)}
            className="nvanime"
            to="/careers"
          >
            Careers
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setOpen(false)}
            className="nvanime"
            to="/trusted-partner"
          >
            Partners
          </Link>
        </li>
        <li>
          <a
            onClick={() => setOpen(false)}
            className="nvanime"
            href={gmailHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us
          </a>
        </li>
        <li className="nbtn">
          <Link className="btns" to="https://wa.me/+916377956633">
            Chat with us
          </Link>
        </li>
      </ul>
    </nav>
  );
};
