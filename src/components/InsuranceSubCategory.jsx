import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Insur } from "./Data_Special";
import { FAQ } from "./FAQ";
import { getFAQsByServiceId } from "./Data_FAQs";
import { BuyNowPayment } from "./BuyNowPayment";
import {
  FaHandHoldingUsd,
  FaWhatsapp,
  FaIdCard,
  FaMoneyBillWave,
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaUser,
  FaCheckCircle,
  FaMedkit,
  FaPlane,
  FaCar,
  FaShieldAlt,
  FaStethoscope,
  FaLaptopMedical,
  FaHeartbeat,
} from "react-icons/fa";
import { BsBank2, BsFileEarmarkText } from "react-icons/bs";
import { GoArrowRight } from "react-icons/go";
import "./ServicePageRefactored.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Helper to select icon based on document text (matching ServicePage logic)
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

const getFeatureIcon = (featureText) => {
  const text = featureText.toLowerCase();

  if (text.includes("tax")) return <FaMoneyBillWave size={28} />;
  if (
    text.includes("hospital") ||
    text.includes("medical") ||
    text.includes("treatment")
  )
    return <FaStethoscope size={28} />;
  if (text.includes("day-care") || text.includes("check-up"))
    return <FaMedkit size={28} />;
  if (text.includes("bonus") || text.includes("claim"))
    return <FaHandHoldingUsd size={28} />;
  if (text.includes("online") || text.includes("digital"))
    return <FaLaptopMedical size={28} />;
  if (text.includes("health") || text.includes("critical"))
    return <FaHeartbeat size={28} />;
  if (text.includes("travel") || text.includes("trip"))
    return <FaPlane size={28} />;
  if (text.includes("motor") || text.includes("car") || text.includes("bike"))
    return <FaCar size={28} />;

  return <FaShieldAlt size={28} />;
};

export const InsuranceSubCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [faqCategory, setFaqCategory] = useState("Common");

  // Find the insurance data and the specific subcategory
  const insuranceData = Insur[0];
  const subCategory = insuranceData?.subsections?.find(
    (sub) => sub.id === category.replace(/-/g, "_"),
  );

  if (!subCategory) {
    return (
      <div style={{ padding: "4rem 10%", textAlign: "center" }}>
        <h1>Insurance Category Not Found</h1>
        <button
          onClick={() => navigate("/insurance-assistance")}
          style={{
            marginTop: "2rem",
            padding: "1rem 2rem",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "3rem",
            cursor: "pointer",
          }}
        >
          Back to Insurance Services
        </button>
      </div>
    );
  }

  const getFilteredFaqs = () => {
    const allFaqs = getFAQsByServiceId(subCategory.id);
    const commonFaqs = allFaqs.slice(0, 3);
    const infoFaqs = allFaqs.slice(3, 6);
    const miscFaqs = allFaqs.slice(6);

    if (faqCategory === "Common") return commonFaqs;
    if (faqCategory === "Informations") return infoFaqs;
    return miscFaqs;
  };

  const gmailHref = (() => {
    const subject = `SERVICE INQUIRY - ${subCategory.title} | BanksBuddy`;

    const plainBody = `Hello BanksBuddy Team,
I am interested in your ${subCategory.title}. Please share the next steps, eligibility confirmation and estimated timelines. 
Brief Message / Additional Details:
[Short paragraph describing purpose / urgency / additional context]

Name: [Full Name]
Email: [your.email@example.com]
Phone Number: [Country code + number]
Location: [City, State, Country]
Product / Service: ${subCategory.title}
Employment Status: [Salaried / Self-employed / Other]
Preferred Contact Method: [Email / Phone]
Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]

Thank you for your time.
Warm regards,
[Your Full Name]`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(plainBody)}`;
  })();

  // Fixed attributes mapping for highlight card
  const txtarr = [
    "Coverage Amount",
    "Policy Tenure",
    "Premium Starting",
    "Processing Fees",
  ];
  const tbData = [
    "₹40 Lakhs",
    "Tenure from 12 months to 84 months",
    "Starting from 11.1% p.a.",
    "Up to 2% of loan amount + GST",
  ];

  return (
    <div id="ServicePage" className="service-page-container">
      {/* Cover section removed as requested */}

      <div className="pgcntt" style={{ marginTop: "30px" }}>
        {/* Hero Section */}
        <motion.section
          className="sp-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
        >
          <div className="sp-hero-content">
            <span className="sp-hero-tagline">{subCategory.overview}</span>
            <h1>{subCategory.title}</h1>
            <p className="sp-hero-description">{subCategory.description}</p>

            <div className="sp-hero-actions">
              <a
                className="sp-btn-primary"
                href={gmailHref}
                target="_blank"
                rel="noreferrer"
              >
                Apply Now <GoArrowRight />
              </a>
              <BuyNowPayment
                serviceId={subCategory.id}
                serviceTitle={subCategory.title}
                mainCategory="Insurance Services"
              />
              <a
                className="sp-btn-whatsapp"
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/+916377956633?text=I%20am%20interested%20in%20the%20${encodeURIComponent(
                  subCategory.title,
                )}%20service%20offered%20by%20BanksBuddy.`}
              >
                <FaWhatsapp /> Whatsapp
              </a>
            </div>
          </div>
          <div className="sp-hero-image">
            <img src={subCategory.image} alt={subCategory.title} />
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
            <h2 className="sp-section-title">About {subCategory.title}</h2>
            <div className="sp-overview-text-wrapper">
              <p className="sp-text-block center-text">
                {subCategory.description}
              </p>
            </div>
          </motion.div>

          {/* Hardcoding Highlights visually to match exactly, but can be removed if strictly adhering to individual data */}
          <motion.div
            className="sp-details-card full-width-table"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            variants={fadeUp}
          >
            <div className="sp-details-header">
              <h3>Key Highlights of {subCategory.title}</h3>
            </div>
            <div className="sp-details-list">
              {txtarr.map((k, i) => (
                <div key={i} className="sp-detail-item">
                  <span className="sp-detail-label">{k}</span>
                  <span className="sp-detail-value">{tbData[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Online Features Horizontal Grid */}
        <section className="sp-section">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Why Choose Us</span>
            <h2 className="sp-section-title">{subCategory.title} Features</h2>
            <p className="sp-text-block" style={{ textAlign: "center" }}>
              Experience the best in class service with our digital-first
              approach.
            </p>
          </div>

          <motion.div
            className="sp-features-horizontal"
            style={{
              justifyContent: "center",
              flexWrap: "wrap",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            {subCategory.keyBenefits.map((txt, i) => (
              <div
                key={i}
                className="sp-feature-card"
                style={{
                  minWidth: "220px",
                  maxWidth: "280px",
                  flex: "1 1 auto",
                }}
              >
                <div className="sp-feature-icon">{getFeatureIcon(txt)}</div>
                <p className="sp-feature-text">{txt}</p>
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
              <h2 className="sp-section-title">Who Should Buy?</h2>
              <div className="sp-check-list">
                {subCategory.whoShouldBuy.map((elg, i) => (
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
              className="sp-docs-grid"
              style={{
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              {subCategory.documents.map((doc, i) => (
                <div
                  key={i}
                  className="sp-doc-card sp-doc-card-shadow"
                  style={{
                    minWidth: "180px",
                    maxWidth: "240px",
                    flex: "1 1 auto",
                  }}
                >
                  <div className="sp-doc-icon-wrapper">{getDocIcon(doc)}</div>
                  <p className="sp-doc-text">{doc}</p>
                </div>
              ))}
            </div>
            <div className="sp-note">
              <strong>Note:</strong> Required documents are subject to change
              depending on the individual profile and insurance type.
            </div>
          </motion.div>
        </section>

        {/* Types Section (Horizontal) */}
        <section className="sp-section sp-section-alt">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Varieties</span>
            <h2 className="sp-section-title">Popular Plans</h2>
          </div>
          <motion.div
            className="sp-types-horizontal"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            {subCategory.popularPlans.map((type, i) => (
              <div key={i} className="sp-type-card">
                <h3 className="sp-type-title">{type.name}</h3>
                <p className="sp-type-desc">{type.desc}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <section className="sp-bottom-cta">
          <h2>Ready to get started with {subCategory.title}?</h2>
          <a
            className="sp-btn-white"
            href={gmailHref}
            target="_blank"
            rel="noreferrer"
          >
            Apply Now <GoArrowRight />
          </a>
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
