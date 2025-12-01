import React from "react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="foot">
      <img src="onlyi.png" alt="BanksBuddy Logo" />
      <div className="r1">
        <div className="c1">
          <h1 className="fhed">BanksBuddy</h1>
          <p className="fdes">
            BanksBuddy provides customized loans and funding solutions to
            individuals and businesses, helping them grow and succeed.
          </p>
          <p className="number">
            <FaPhoneVolume /> +91-63779 56633
          </p>
          <div className="btns">
            <a className="chat" href="https://wa.me/+917723926058">
              Chat with us
            </a>
            <a
              className="chata"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=Inquiry%20Regarding%20Loan%20Support&body=Hi%20BanksBuddy%20Team%2C%0A%0AI%20am%20interested%20in%20your%20financial%20services.%0A%0AMy%20Details%3A%0AName%3A%20%0APhone%20Number%3A%20%0AType%20of%20Loan%20Needed%20(Personal%2FBusiness)%3A%20%0A%0APlease%20guide%20me%20through%20the%20process.%0A%0AThanks!"
            >
              Email us{" "}
              <span>
                <MdArrowOutward />
              </span>
            </a>
          </div>
        </div>
        <div className="c2">
          <p className="fct">Services</p>
          <ul>
            <li>
              <a href="/">Personal Loan</a>
            </li>
            <li>
              <a href="/">Home Loan </a>
            </li>
            <li>
              <a href="/">Education Loan</a>
            </li>
            <li>
              <a href="/">Business Loan</a>
            </li>
            <li>
              <a href="/">Machinery Loan</a>
            </li>
          </ul>
        </div>
        <div className="c3">
          <a href="/" className="fct">
            Home
          </a>
          <a href="/about-us" className="fct">
            About
          </a>
          <a href="/services" className="fct">
            Services
          </a>
          <a href="/emi-calculator" className="fct">
            EMI Calculator
          </a>
          <a href="/emi-calculator" className="fct">
            Careers
          </a>
          <a href="/trusted-partner" className="fct">
            Trusted Partners
          </a>

          <a href="/https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=Inquiry%20Regarding%20Loan%20Support&body=Hi%20BanksBuddy%20Team%2C%0A%0AI%20am%20interested%20in%20your%20financial%20services.%0A%0AMy%20Details%3A%0AName%3A%20%0APhone%20Number%3A%20%0AType%20of%20Loan%20Needed%20(Personal%2FBusiness)%3A%20%0A%0APlease%20guide%20me%20through%20the%20process.%0A%0AThanks!" className="fct">
            Contact Us
          </a>
        </div>
      </div>
      <div className="r2">
        <div className="flr2">© 2025 BanksBuddy, Inc. All rights reserved.</div>
        <ul className="frr2">
          <li>
            <a href="https://www.instagram.com/banksbuddy2023/">
              <FaInstagram />
            </a>
          </li>
          {/* <li>
            <a href="/">
              <FaFacebook />
            </a>
          </li> */}
          <li>
            <a href="https://wa.me/+916377956633">
              <FaWhatsapp />
            </a>
          </li>
        </ul>
      </div>
      <p className="r3">
        BanksBuddy represents a secure, digital-first financial platform. We act
        as a bridge between borrowers and authorized lending partners to
        facilitate seamless credit solutions.
      </p>
    </footer>
  );
};
