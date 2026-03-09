import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";
import { RiMenuFold4Fill } from "react-icons/ri";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { RiLogoutBoxRLine } from "react-icons/ri"; // Import logout icon
import "./ServicesDropdown.css";

const servicesMenu = {
  loanServices: {
    title: "Loan Services",
    items: [
      { title: "Personal Loan", slug: "/services/personal-loan" },
      { title: "Home Loan", slug: "/services/home-loan" },
      { title: "Education Loan", slug: "/services/education-loan" },
      { title: "Machinery Loan", slug: "/services/machinery-loan" },
      { title: "Business Loan", slug: "/services/business-loan" },
      { title: "Auto Loan", slug: "/services/auto-loan" },
      {
        title: "Loan Against Property",
        slug: "/services/loan-against-property",
      },
    ],
  },

  insuranceServices: {
    title: "Insurance Services",
    items: [
      { title: "Life Insurance", slug: "/insurance/life-insurance" },
      { title: "Health Insurance", slug: "/insurance/health-insurance" },
      { title: "General Insurance", slug: "/insurance/general-insurance" },
    ],
  },

  cibilImprovement: {
    title: "CIBIL Improvement",
    items: [{ title: "CIBIL Score Improvement", slug: "/cibil" }],
  },

  coreServices: {
    title: "Other Services",
    items: [
      { title: "Consultancy Service", slug: "/consultation" },
      { title: "Tax Services", slug: "/tax-services" },
    ],
  },
};

const LogoutButton = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <li>
      <button className="lgout" onClick={logout}>
        <RiLogoutBoxRLine title="Logout" />
      </button>
    </li>
  );
};

export const Navbar = () => {
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

  // const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
  //   subject
  // )}&body=${encodeURIComponent(body)}`;

  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(null);

  const handleLinkClick = () => {
    setOpen(false);
    setMobileServicesOpen(false);
    setMobileSubMenuOpen(null);
  };

  const toggleMobileServices = () => {
    setMobileServicesOpen(!mobileServicesOpen);
    setMobileSubMenuOpen(null);
  };

  const toggleMobileSubMenu = (category) => {
    setMobileSubMenuOpen(mobileSubMenuOpen === category ? null : category);
  };

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
          <Link onClick={handleLinkClick} className="nvanime" to="/about-us">
            About
          </Link>
        </li>
        {/* Desktop Hover Menu */}
        <li className="services-dropdown-wrapper desktop-only">
          <span className="nvanime services-trigger">Services</span>
          <div className="services-dropdown-menu">
            {Object.entries(servicesMenu).map(([key, category]) => (
              <div key={key} className="category-item">
                <span className="category-title">
                  {category.title}
                  <MdKeyboardArrowRight className="arrow-right" />
                </span>
                <div className="subcategory-menu">
                  {category.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.slug}
                      onClick={handleLinkClick}
                      className="subcategory-link"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </li>

        {/* Mobile Accordion Menu */}
        <li className="mobile-only">
          <button
            className="nvanime mobile-services-btn"
            onClick={toggleMobileServices}
          >
            Services
          </button>
          {mobileServicesOpen && (
            <div className="mobile-services-menu">
              {Object.entries(servicesMenu).map(([key, category]) => (
                <div key={key} className="mobile-category">
                  <button
                    className="mobile-category-btn"
                    onClick={() => toggleMobileSubMenu(key)}
                  >
                    {category.title}
                    <MdKeyboardArrowRight
                      className={`mobile-arrow ${mobileSubMenuOpen === key ? "rotate" : ""}`}
                    />
                  </button>
                  {mobileSubMenuOpen === key && (
                    <div className="mobile-subcategory-menu">
                      {category.items.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.slug}
                          onClick={handleLinkClick}
                          className="mobile-subcategory-link"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </li>

        <li>
          <Link onClick={handleLinkClick} className="nvanime" to="/careers">
            Careers
          </Link>
        </li>
        <li>
          <Link
            onClick={handleLinkClick}
            className="nvanime"
            to="/trusted-partner"
          >
            Partners
          </Link>
        </li>
        <li>
          <Link className="nvanime" to="/contact-banksbuddy">
            Contact Us
          </Link>
        </li>
        <li className="nbtn">
          <Link className="btns" to="https://wa.me/+916377956633">
            Chat with us
          </Link>
        </li>
        <LogoutButton />
      </ul>
    </nav>
  );
};
