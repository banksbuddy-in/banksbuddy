import React, { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOnlinePrediction } from "react-icons/md";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import NewServices from "./Data_Services";
import {
  FaHandHoldingUsd,
  FaWhatsapp,
  FaCheckCircle,
  FaFileAlt,
  FaIdCard,
  FaMoneyBillWave,
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaUser,
  FaCalendarCheck,
} from "react-icons/fa";
import { BsBank2, BsFileEarmarkText } from "react-icons/bs";
import { PiChartLineDownFill } from "react-icons/pi";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { FAQ } from "./FAQ";
import { getFAQsByServiceId } from "./Data_FAQs";
import EMICalculator from "./EMICalculator";
import "./ServicePageRefactored.css";
import { Cover } from "./Cover";

const toSlug = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

// Helper to select icon based on document text
const getDocIcon = (docText) => {
  const text = docText.toLowerCase();

  if (
    text.includes("aadhar") ||
    text.includes("pan") ||
    text.includes("kyc") ||
    text.includes("passport") ||
    text.includes("voter") ||
    text.includes("id proof") ||
    text.includes("license")
  ) {
    return <FaIdCard />;
  }
  if (
    text.includes("salary") ||
    text.includes("income") ||
    text.includes("form 16")
  ) {
    return <FaMoneyBillWave />;
  }
  if (
    text.includes("bank") ||
    text.includes("statement") ||
    text.includes("cheque") ||
    text.includes("passbook")
  ) {
    return <BsBank2 />;
  }
  if (
    text.includes("address") ||
    text.includes("electricity") ||
    text.includes("rent") ||
    text.includes("property") ||
    text.includes("bill") ||
    text.includes("hosting")
  ) {
    return <FaHome />;
  }
  if (
    text.includes("business") ||
    text.includes("registration") ||
    text.includes("itr") ||
    text.includes("gst") ||
    text.includes("partnership") ||
    text.includes("company") ||
    text.includes("profile")
  ) {
    return <FaBriefcase />;
  }
  if (text.includes("photo") || text.includes("check")) {
    return <FaUser />;
  }
  if (
    text.includes("education") ||
    text.includes("marksheet") ||
    text.includes("admission") ||
    text.includes("scorecard") ||
    text.includes("degree")
  ) {
    return <FaGraduationCap />;
  }

  return <BsFileEarmarkText />;
};

export const ServicePage = () => {
  const { slug: paramSlug } = useParams();
  const location = useLocation();

  // Determine slug: either from URL param or from the path itself (e.g., /tax-services -> tax-services)
  const slug = paramSlug || location.pathname.substring(1).replace(/\/$/, "");

  const [faqCategory, setFaqCategory] = useState("Common");

  if (!slug)
    return (
      <div className="service-page-container">
        <div className="sp-section">Service not found</div>
      </div>
    );

  const svc = NewServices.find(
    (s) => toSlug(s.id) === slug || toSlug(s.title) === slug,
  );

  if (!svc) {
    return (
      <div className="service-page-container">
        <div
          className="sp-section"
          style={{ textAlign: "center", padding: "10%" }}
        >
          <h2 className="sp-section-title">Service not found</h2>
          <p className="sp-text-block" style={{ textAlign: "center" }}>
            No service matches the requested page.
          </p>
          <Link className="sp-btn-primary" to="/services">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const gmailHref = (() => {
    const subject = `SERVICE INQUIRY - ${svc.Title} | BanksBuddy`;
    const plainBody = `Hello BanksBuddy Team,
I am interested in your ${svc.Title}. Please share the next steps, eligibility confirmation and estimated timelines. 
Brief Message / Additional Details:
[Short paragraph describing purpose / urgency / additional context]

Name: [Full Name]
Email: [your.email@example.com]
Phone Number: [Country code + number]
Location: [City, State, Country]
Product / Service: ${svc.Title}
Employment Status: [Salaried / Self-employed / Other]
If Loan — Loan Amount Required: [Amount or N/A]
Preferred Contact Method: [Email / Phone]
Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]

Thank you for your time.
Warm regards,
[Your Full Name]`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(plainBody)}`;
  })();

  const txtarr = svc.TbLabels || [
    "Max Loan Amount",
    "Max Loan Tenure",
    "Interest Rate",
    "Processing Fees",
  ];

  const textarr2 = [
    { elm: <FaHandHoldingUsd />, txt: "No Collateral Required" },
    { elm: <MdOnlinePrediction />, txt: "Simple, Easy Online Process" },
    { elm: <PiChartLineDownFill />, txt: "Low Interest Rates" },
    { elm: <HiMiniClipboardDocumentCheck />, txt: "Transparent Terms" },
    { elm: <FaCalendarCheck />, txt: "Flexible Tenure" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Logic to categorize FAQs
  const allFaqs = getFAQsByServiceId(svc.id);
  const commonFaqs = allFaqs.slice(0, 3);
  const infoFaqs = allFaqs.slice(3, 6);
  const miscFaqs = allFaqs.slice(6);

  const getFilteredFaqs = () => {
    if (faqCategory === "Common") return commonFaqs;
    if (faqCategory === "Informations") return infoFaqs;
    return miscFaqs;
  };

  // Helper to extract numeric values from strings
  const getInterestRate = () => {
    // Expected format: "Starting from 11.1% p.a."
    if (svc.TbData && svc.TbData[2]) {
      const match = svc.TbData[2].match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 10;
    }
    return 10;
  };

  const getMaxTenureMonths = () => {
    // Expected format: "Tenure from 12 months to 84 months" or similar
    if (svc.TbData && svc.TbData[1]) {
      // Look for the last number in the string which usually indicates max tenure
      const matches = svc.TbData[1].match(/(\d+)/g);
      if (matches && matches.length > 0) {
        const nums = matches.map((n) => parseInt(n));
        const max = Math.max(...nums);
        return max;
      }
    }
    return 60;
  };

  const serviceImageMap = {
    personal_loan: "/cc1.webp",
    home_loan: "/cc2.jpg",
    education_loan: "/cc3.jpeg",
    machinery_loan: "/cc4.jpg",
    business_loan: "/cc5.jpg",
    loan_against_property: "/cc6.png",
    cibil_improvement: "/cc7.png",
    website_development: "/cc8.png",
    tax_services: "/cc2.jpg",
    auto_loan: "/lll9.jpg",
  };

  const serviceCategoryMap = {
    personal_loan: "Loan Services",
    home_loan: "Loan Services",
    education_loan: "Loan Services",
    auto_loan: "Loan Services",
    machinery_loan: "Loan Services",
    business_loan: "Loan Services",
    loan_against_property: "Loan Services",
    "cibil-improvement": "Cibil Improvement",
    "website-development": "Other Services",
    "tax-services": "Other Services",
  };

  const mainCategory = serviceCategoryMap[svc.id] || "Other Services";

  const coverImage = serviceImageMap[svc.id] || svc.image;

  return (
    <div id="ServicePage" className="service-page-container">
      {/* Hero Section */}
      <Cover
        tagline={svc.tagline}
        title={svc.Title} // Pass title to suppress default spam
        description={`Get your ${svc.Title} with BanksBuddy.`}
        image={coverImage}
      />
      {/* <img src="https://aadharhousing.com/storage/LoanProducts/9/62594398e1180.png" alt="cover" className="cver" /> */}
      <div className="pgcntt">
        <motion.section
          className="sp-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
        >
          <div className="sp-hero-content">
            <span className="sp-hero-tagline">{svc.tagline}</span>
            <h1>{svc.Title}</h1>
            <p className="sp-hero-description">{svc.overview[0]}</p>

            <div className="sp-hero-actions">
              <Link className="sp-btn-primary" to="/contact-banksbuddy">
                Apply Now <GoArrowRight />
              </Link>
              <a
                className="sp-btn-whatsapp"
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/+916377956633?text=I%20am%20interested%20in%20the%20${encodeURIComponent(
                  svc.Title,
                )}%20service%20offered%20by%20BanksBuddy.`}
              >
                <FaWhatsapp /> Whatsapp
              </a>
            </div>
          </div>
          <div className="sp-hero-image">
            <img src={svc.image} alt={svc.Title} />
          </div>
        </motion.section>

        {/* About & Details Section (Vertical Layout) */}
        <section className="sp-section" style={{ background: "#fff" }}>
          <motion.div
            className="sp-about-centered"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            <span className="sp-section-tag">Overview</span>
            <h2 className="sp-section-title">About {svc.Title}</h2>
            <div className="sp-overview-text-wrapper">
              {svc.overview.slice(1).map((para, idx) => (
                <p key={idx} className="sp-text-block center-text">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="sp-details-card full-width-table"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            variants={fadeUp}
          >
            <div className="sp-details-header">
              <h3>Key Highlights of {svc.Title}</h3>
            </div>
            <div className="sp-details-list">
              {txtarr.map((k, i) => (
                <div key={i} className="sp-detail-item">
                  <span className="sp-detail-label">{k}</span>
                  <span className="sp-detail-value">{svc.TbData[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* EMI Calculator Section - Hidden for Non-Loan Services */}
        {!["cibil-improvement", "website-development", "tax-services"].includes(
          svc.id,
        ) && (
          <section className="sp-section sp-section-alt">
            <div className="sp-centered-header">
              <span className="sp-section-tag">Plan Your Finances</span>
              <h2 className="sp-section-title">EMI Calculator</h2>
              <p
                className="sp-text-block"
                style={{
                  textAlign: "center",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Calculate your monthly EMIs based on the loan amount and tenure.
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={fadeUp}
            >
              <EMICalculator
                defaultAmount={500000}
                defaultInterest={getInterestRate()}
                defaultTenure={getMaxTenureMonths()}
                maxTenure={
                  getMaxTenureMonths() > 60 ? getMaxTenureMonths() : 84
                }
                title={svc.Title}
              />
            </motion.div>
          </section>
        )}

        {/* Online Features Horizontal Grid */}
        <section className="sp-section">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Why Choose Us</span>
            <h2 className="sp-section-title">{svc.Title} Features</h2>
            <p className="sp-text-block" style={{ textAlign: "center" }}>
              Experience the best in class service with our digital-first
              approach.
            </p>
          </div>

          <motion.div
            className={`sp-features-horizontal${textarr2.length > 5 ? " multi-row" : ""}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            {textarr2.map((io, i) => (
              <div key={i} className="sp-feature-card">
                <div className="sp-feature-icon">{io.elm}</div>
                <p className="sp-feature-text">{io.txt}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Eligibility Section (Split) */}
        <section className="sp-section sp-section-alt">
          <div className="sp-split-section">
            <motion.div
              className="sp-split-image"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={fadeUp}
            >
              <img src="/se3m1.jpg" alt="Eligibility Criteria" />
            </motion.div>
            <motion.div
              className="sp-split-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              variants={fadeUp}
            >
              <span className="sp-section-tag">Requirements</span>
              <h2 className="sp-section-title">Eligibility Criteria</h2>
              <div className="sp-check-list">
                {svc.EliCr.map((elg, i) => (
                  <div key={i} className="sp-check-item">
                    <FaCheckCircle className="sp-check-icon" />
                    <p className="sp-check-text">{elg}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Documents Section (Full Width, No Image, Centered Header) */}
        <section className="sp-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            <div
              className="sp-centered-header-small"
              style={{ textAlign: "center", marginBottom: "2rem" }}
            >
              <span className="sp-section-tag">Documentation</span>
              <h2 className="sp-section-title">Required Documents</h2>
            </div>

            <div
              className={`sp-docs-grid${svc.Docs.length > 5 ? " multi-row" : ""}`}
            >
              {svc.Docs.map((doc, i) => (
                <div key={i} className="sp-doc-card sp-doc-card-shadow">
                  <div className="sp-doc-icon-wrapper">{getDocIcon(doc)}</div>
                  <p className="sp-doc-text">{doc}</p>
                </div>
              ))}
            </div>
            <div className="sp-note">
              <strong>Note:</strong> Eligibility and required documents are
              subject to change depending on the individual profile.
            </div>
          </motion.div>
        </section>

        {/* Types Section (Horizontal) */}
        <section className="sp-section sp-section-alt">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Varieties</span>
            <h2 className="sp-section-title">Types of {svc.Title}</h2>
          </div>
          <motion.div
            className={`sp-types-horizontal${svc.Types.length > 5 ? " multi-row" : ""}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            {svc.Types.map((type, i) => (
              <div key={i} className="sp-type-card">
                <h3 className="sp-type-title">{type.titl}</h3>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <section className="sp-bottom-cta">
          <h2>Ready to get started with {svc.Title}?</h2>
          <Link className="sp-btn-white" to="/contact-banksbuddy">
            Apply Now <GoArrowRight />
          </Link>
        </section>

        {/* FAQ Section with Categories */}
        <motion.div
          className="sp-section"
          id="faq-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
        >
          <div className="sp-faq-header" style={{ marginBottom: "1rem" }}>
            <h2
              className="sp-section-title"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="sp-faq-tabs">
              {["Common", "Informations", "Misc"].map((tab) => (
                <button
                  key={tab}
                  className={`sp-faq-tab ${faqCategory === tab ? "active" : ""}`}
                  onClick={() => setFaqCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <FAQ faqs={getFilteredFaqs()} title="" subtitle="" />
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePage;
