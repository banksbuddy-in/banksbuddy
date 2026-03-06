import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
} from "react-icons/fa";
import { MdArrowOutward, MdEmail } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./newserv.css";
import { PayslipAd } from "./PayslipAd";

export const Footer = () => {
  // const productName = "Loan Support";
  //   const subject = `Banksbuddy - INQUIRY Regarding ${productName}`;

  //   const body = `Hello BanksBuddy Team,

  // [your message here]

  // Name: [Full Name]
  // Email: [your.email@example.com]
  // Phone Number: [Country code + number]
  // Location: [City, State, Country]
  // Product / Service: ${productName}
  // Employment Status: [Salaried / Self-employed / Other]
  // If Loan — Loan Amount Required: [Amount or N/A]
  // Preferred Contact Method: [Email / Phone]
  // Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]

  // Brief Message / Additional Details:
  // [Short paragraph describing purpose / urgency / additional context]

  // Thank you for your time.
  // Warm regards,
  // [Your Full Name]`;

  //   const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
  //     subject
  //   )}&body=${encodeURIComponent(body)}`;
  return (
    <footer className="foot">
      <img src="onlyi.png" alt="BanksBuddy Logo" />
      {/* <video className="fbg" src="fbg.mp4" autoPlay muted loop></video> */}
      <div className="r1">
        <div className="c1">
          <h1 className="fhed">
            Banks<span>Buddy</span>
          </h1>
          <p className="fdes">
            BanksBuddy provides customized loans and funding solutions to
            individuals and businesses, helping them grow and succeed.
          </p>
          <p className="number">
            <FaPhoneVolume /> +91-63779 56633
          </p>
          <div className="btns">
            <a className="chat" href="https://wa.me/+916377956633">
              Chat with us
            </a>
            <a
              className="chat"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=Inquiry%20Regarding%20Loan%20Support&body=Hi%20BanksBuddy%20Team%2C%0A%0AI%20am%20interested%20in%20your%20financial%20services.%0A%0AMy%20Details%3A%0AName%3A%20%0APhone%20Number%3A%20%0AType%20of%20Loan%20Needed%20(Personal%2FBusiness)%3A%20%0A%0APlease%20guide%20me%20through%20the%20process.%0A%0AThanks!"
            >
              <span>
                <MdEmail />
              </span>
              Email us{" "}
            </a>
          </div>
        </div>
        <div className="c2">
          <p className="fct">Loan Services</p>
          <ul>
            <li>
              <Link to="/services/personal-loan">Personal Loan</Link>
            </li>
            <li>
              <Link to="/services/home-loan">Home Loan </Link>
            </li>
            <li>
              <Link to="/services/education-loan">Education Loan</Link>
            </li>
            <li>
              <Link to="/services/business-loan">Business Loan</Link>
            </li>
            <li>
              <Link to="/services/auto-loan">Auto/Machinery Loan</Link>
            </li>
            <li>
              <Link to="/services/loan-against-property">
                Loan Against Property
              </Link>
            </li>
          </ul>
        </div>
        <div className="c2">
          <p className="fct">Services</p>
          <ul>
            <li>
              <Link className="fct" to="/consultation">
                Financial Consultation
              </Link>
            </li>
            <li>
              <Link className="fct" to="/emi-calculator">
                EMI Calculator
              </Link>
            </li>
            <li>
              <Link className="fct" to="/cibil">
                CIBIL Improvement
              </Link>
            </li>
            <li>
              <Link className="fct" to="/website-development">
                Website Development
              </Link>
            </li>
          </ul>
        </div>
        <div className="c2">
          <p className="fct">Insurance</p>
          <ul>
            <li>
              <Link className="fct" to="/insurance/life-insurance">
                Life Insurance
              </Link>
            </li>
            <li>
              <Link className="fct" to="/insurance/health-insurance">
                Health Insurance
              </Link>
            </li>
            <li>
              <Link className="fct" to="/insurance/general-insurance">
                General Insurance
              </Link>
            </li>
          </ul>
        </div>
        <div className="c2">
          <p className="fct">Resources</p>
          <ul>
            <li>
              <Link className="fct" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="fct" to="/about-us">
                About Us
              </Link>
            </li>
            <li>
              <Link className="fct" to="/careers">
                Careers
              </Link>
            </li>
            <li>
              <Link className="fct" to="/trusted-partner">
                Trusted Partners
              </Link>
            </li>
            <li>
              <Link to="/contact-banksbuddy" target="_blank" className="fct">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="r2">
        <div className="flr2">© 2025 BanksBuddy, Inc. All rights reserved.</div>
        <div
          className="frr2-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              paddingBottom: "8px",
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            remotely working across India
          </p>
          <ul className="frr2">
            <li>
              <a
                target="_blank"
                href="https://www.instagram.com/banksbuddy2023/"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.facebook.com/share/1AJUxAHeHV/"
              >
                <FaFacebook />
              </a>
            </li>
            <li>
              <a target="_blank" href="https://wa.me/+916377956633">
                <FaWhatsapp />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=Inquiry%20Regarding%20Loan%20Support&body=Hi%20BanksBuddy%20Team%2C%0A%0AI%20am%20interested%20in%20your%20financial%20services.%0A%0AMy%20Details%3A%0AName%3A%20%0APhone%20Number%3A%20%0AType%20of%20Loan%20Needed%20(Personal%2FBusiness)%3A%20%0A%0APlease%20guide%20me%20through%20the%20process.%0A%0AThanks!"
              >
                <MdEmail />
              </a>
            </li>
            <li>
              <a target="_blank" href="https://wa.me/+916377956633">
                <FaLinkedin />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="r3">
        BanksBuddy represents a secure, digital-first financial platform. We act
        as a bridge between borrowers and authorized lending partners to
        facilitate seamless credit solutions.
      </p>
      {/* <PayslipAd /> */}
    </footer>
  );
};
