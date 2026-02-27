import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MdBolt } from "react-icons/md";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import { FaHandHoldingUsd, FaWhatsapp } from "react-icons/fa";
import { IoTimer } from "react-icons/io5";
import { PiChartLineDownFill } from "react-icons/pi";
import { Cover } from "./Cover";
import { FAQ } from "./FAQ";
import { insuranceFAQs } from "./Data_FAQs";
import { BuyNowPayment } from "./BuyNowPayment";
import "./ServicePageRefactored.css";

const InsuranceData = [
  {
    id: "insurance",
    Title: "Insurance",
    overview: [
      "Insurance is a financial tool that protects individuals and families from unexpected financial losses. It provides coverage for life, health, vehicles, travel, home, accidents, and more, ensuring financial support during emergencies.",
      "By paying a premium, you get financial protection against risks such as illnesses, accidents, property damage, or death. Insurance helps reduce financial stress during unforeseen situations, making it a vital part of financial planning.",
      "Major insurance categories include life insurance, health insurance, motor insurance, travel insurance, home insurance, and personal accident insurance. Each type offers specialized coverage based on your lifestyle, needs, and financial goals.",
    ],
    tagline: "Your Shield Against Life’s Uncertainties",
    image: "/insurn.jpg",
    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Age criteria vary based on the type of insurance (life, health, motor, etc.)",
      "Valid identity and address proof required",
      "Medical screening may be needed for certain life or health policies",
      "Correct asset details required for motor and home insurance",
      "Nominee details for life insurance policies",
      "Accurate personal and risk-related information must be provided",
    ],
    Docs: [
      "Identity Proof (Aadhaar, PAN, Passport, Voter ID)",
      "Address Proof (Electricity Bill, Rent Agreement, etc.)",
      "Age Proof (School Certificate, Aadhaar, Passport)",
      "Medical Reports (if required for underwriting)",
      "Vehicle RC Book for Motor Insurance",
      "Property Ownership Documents for Home Insurance",
      "Passport & Travel Details for Travel Insurance",
      "Nominee Details for Life Insurance",
    ],
    Types: [
      {
        titl: "Life Insurance",
        des: "Provides financial protection to your family in case of your unfortunate demise during the policy term.",
      },
      {
        titl: "Health Insurance",
        des: "Covers medical expenses from hospitalization, treatments, surgeries, and critical illnesses.",
      },
      {
        titl: "Motor Insurance (Car/Bike)",
        des: "Covers damage, theft, and third-party liabilities for your vehicle as mandated by law.",
      },
      {
        titl: "Travel Insurance",
        des: "Protects against trip cancellations, baggage loss, medical emergencies, and other travel-related risks.",
      },
      {
        titl: "Home Insurance",
        des: "Covers damages to your house and its contents from fire, theft, natural disasters, and more.",
      },
      {
        titl: "Personal Accident Insurance",
        des: "Provides financial support in the event of accidental death, disability, or injury.",
      },
    ],
  },
];

const svc = InsuranceData.find((s) => s.id === "insurance");

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
Preferred Contact Method: [Email / Phone]
Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]



Thank you for your time.
Warm regards,
[Your Full Name]`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(plainBody)}`;
})();

const txtarr = [
  "Max Loan Amount",
  "Max Loan Tenure",
  "Interest Rate",
  "Processing Fees",
];

const textarr2 = [
  { elm: <FaHandHoldingUsd />, txt: "Affordable Premium Options" },
  { elm: <MdBolt />, txt: "Easy & Quick Online Purchase" },
  { elm: <PiChartLineDownFill />, txt: "Wide Coverage at Low Cost" },
  {
    elm: <HiMiniClipboardDocumentCheck />,
    txt: "Clear & Transparent Policy Terms",
  },
  { elm: <IoTimer />, txt: "Flexible Policy Tenure Choices" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const Insurance = () => {
  return (
    <div id="ServicePage" className="service-page-container">
      <Cover
        tagline={svc.tagline}
        title={svc.Title}
        description={`Secure your future with ${svc.Title}.`}
        image={svc.image}
      />

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
              <a className="sp-btn-primary" href={gmailHref} target="_blank" rel="noreferrer">
                Get a Quote
              </a>
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

        <section className="sp-section" style={{ paddingTop: "0" }}>
          <BuyNowPayment
            serviceId={svc.id}
            serviceTitle={svc.Title}
            mainCategory="Insurance Services"
          />
        </section>

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

        <section className="sp-section">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Why Choose Us</span>
            <h2 className="sp-section-title">Insurance Features</h2>
            <p className="sp-text-block" style={{ textAlign: "center" }}>
              Pick the cover that fits you best with transparent pricing and guided onboarding.
            </p>
          </div>

          <motion.div
            className="sp-features-horizontal"
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
                    <HiMiniClipboardDocumentCheck className="sp-check-icon" />
                    <p className="sp-check-text">{elg}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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

            <div className="sp-docs-grid">
              {svc.Docs.map((doc, i) => (
                <div key={i} className="sp-doc-card sp-doc-card-shadow">
                  <div className="sp-doc-icon-wrapper">{i + 1}</div>
                  <p className="sp-doc-text">{doc}</p>
                </div>
              ))}
            </div>
            <div className="sp-note">
              <strong>Note:</strong> Eligibility and required documents may vary by insurer and policy.
            </div>
          </motion.div>
        </section>

        <section className="sp-section sp-section-alt">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Varieties</span>
            <h2 className="sp-section-title">Types of {svc.Title}</h2>
          </div>
          <motion.div
            className="sp-types-horizontal"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeUp}
          >
            {svc.Types.map((type, i) => (
              <div key={i} className="sp-type-card">
                <h3 className="sp-type-title">{type.titl}</h3>
                <p className="sp-type-desc">{type.des}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="sp-bottom-cta">
          <h2>Ready to protect what matters most?</h2>
          <a className="sp-btn-white" href={gmailHref} target="_blank" rel="noreferrer">
            Talk to an Advisor
          </a>
        </section>

        <motion.div
          className="sp-section"
          id="faq-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
        >
          <FAQ
            faqs={insuranceFAQs}
            title="Insurance - Frequently Asked Questions"
            subtitle="Got Questions?"
          />
        </motion.div>
      </div>
    </div>
  );
};
