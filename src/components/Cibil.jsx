import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MdBolt, MdOnlinePrediction } from "react-icons/md";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import {
  FaHandHoldingUsd,
  FaWhatsapp,
  FaCheckCircle,
  FaIdCard,
  FaMoneyBillWave,
  FaHome,
  FaBriefcase,
  FaGraduationCap,
  FaUser,
  FaCalendarCheck,
  FaTimes,
} from "react-icons/fa";
import { BsBank2, BsFileEarmarkText } from "react-icons/bs";
import { PiChartLineDownFill } from "react-icons/pi";
import { GoArrowRight } from "react-icons/go";
import { IoTimer } from "react-icons/io5";
import { FAQ } from "./FAQ";
import { cibilFAQs } from "./Data_FAQs";
import "./ServicePageRefactored.css";
import { Cover } from "./Cover";
import apiFetch from "../lib/api.js";
import { motion } from "framer-motion";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

import DevStudioPaymentForm from "./DevStudioPaymentForm"; // Helper to select icon based on document text (Reusing logic from ServicePage)
const getDocIcon = (docText) => {
  const text = docText.toLowerCase();

  if (
    text.includes("aadhaar") ||
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
    text.includes("form 16") ||
    text.includes("bank") ||
    text.includes("cheque")
  ) {
    return <BsBank2 />;
  }
  if (
    text.includes("address") ||
    text.includes("electricity") ||
    text.includes("rent") ||
    text.includes("property")
  ) {
    return <FaHome />;
  }
  if (
    text.includes("business") ||
    text.includes("registration") ||
    text.includes("itr") ||
    text.includes("gst")
  ) {
    return <FaBriefcase />;
  }
  if (text.includes("photo")) {
    return <FaUser />;
  }

  return <BsFileEarmarkText />;
};

const InsuranceData = [
  {
    id: "CIBIL Improvement",
    Title: "CIBIL Score Improvement Service",
    overview: [
      "Your CIBIL score is a critical factor that determines your loan and credit card approval chances. A strong credit score opens doors to better interest rates, higher loan amounts, and faster approvals from financial institutions.",
      "Our CIBIL Score Improvement Service helps you identify credit report errors, rectify negative remarks, and implement strategies to boost your creditworthiness. We provide expert guidance on credit management and dispute resolution to enhance your financial profile.",
      "Whether you're dealing with a low credit score, NPA issues, or incorrect reporting, our comprehensive service ensures your credit history is accurate and optimized for future financial opportunities.",
    ],
    tagline: "Rebuild Your Credit, Reclaim Your Financial Freedom",
    image: "/ss4.jpg",
    TbData: [
      "Starting from 300",
      "3 to 12 months",
      "Customized Plan",
      "Varies by Service Type",
    ],
    TbLabels: [
      "Starting Score Range",
      "Service Duration",
      "Service Plan",
      "Service Fees",
    ],
    features: [
      "Credit Score Improvement across all bureaus (CIBIL, Equifax, Experian & CRIF)",
      "CMR Rank Improvement (scale 1 to 4) for enhanced credit standing",
      "Regular Credit Check Services with detailed reports and analysis",
      "Upgrade External Credit Ratings (scale D to AAA) for businesses",
      "NPA OTS & Closure Services for non-performing assets",
      "Error Removal from credit reports with proper documentation",
      "Credit Dispute Resolution with bureaus and lenders",
      "Personalized Credit Improvement Strategy and action plan",
    ],

    Docs: [
      "Aadhaar Card (Identity & Address Proof)",
      "PAN Card (Mandatory for credit verification)",
      "Contact Number (Active mobile number)",
      "Email ID (For communication and reports)",
      "Cancelled Cheque (For account verification)",
      "Latest Credit Report (CIBIL/Equifax/Experian)",
      "Loan/Credit Card Statements (If applicable)",
      "Bank Statements (Last 6 months)",
    ],

    Types: [
      {
        titl: "Credit Score Enhancement",
        des: "Comprehensive analysis and strategic actions to improve your CIBIL, Equifax, Experian, and CRIF scores through proper credit management.",
      },
      {
        titl: "CMR Rank Improvement",
        des: "Upgrade your Credit Monitoring Rank from scale 1 to 4, helping you access better credit facilities and loan terms.",
      },
      {
        titl: "Regular Credit Monitoring",
        des: "Continuous tracking of your credit report with timely alerts on changes, new inquiries, and potential issues affecting your score.",
      },
      {
        titl: "External Credit Rating Upgrade",
        des: "For businesses and corporate entities, we help improve external credit ratings from D to AAA through proper financial management.",
      },
      {
        titl: "NPA OTS & Closure",
        des: "Negotiate One-Time Settlement for non-performing assets and ensure proper closure with updated credit bureau reporting.",
      },
      {
        titl: "Error Rectification Service",
        des: "Identify and remove incorrect, outdated, or fraudulent entries from your credit report through formal dispute processes.",
      },
    ],
  },
];

const svc = InsuranceData.find((s) => s.id === "CIBIL Improvement");

const textarr2 = [
  { elm: <FaHandHoldingUsd />, txt: "Expert Credit Analysis & Strategy" },
  { elm: <MdBolt />, txt: "Fast Error Rectification Process" },
  { elm: <PiChartLineDownFill />, txt: "Proven Score Improvement Methods" },
  {
    elm: <HiMiniClipboardDocumentCheck />,
    txt: "Comprehensive Credit Report Review",
  },
  { elm: <IoTimer />, txt: "Flexible Service Timeline" },
];

import { useAuth } from "../context/AuthContext";

export const Cibil = () => {
  const { currentUser } = useAuth();
  const [faqCategory, setFaqCategory] = useState("Common");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  // Initialize hasPaid from localStorage so it shows immediately on re-visits
  const [hasPaid, setHasPaid] = useState(() => {
    return localStorage.getItem("cibilPaid") === "true";
  });
  const [formStatus, setFormStatus] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [checkLoading, setCheckLoading] = useState(!localStorage.getItem("cibilPaid"));

  // 1. Verify Payment if returning from Cashfree
  useEffect(() => {
    const checkRedirect = async () => {
      const orderId = searchParams.get("order_id");
      const requestId = searchParams.get("request_id");

      if (orderId && requestId) {
        setIsVerifying(true);
        try {
          const res = await apiFetch("/api/payment/verify", {
            method: "POST",
            body: JSON.stringify({ order_id: orderId, request_id: requestId }),
          });

          if (res.status === "PAID") {
            setShowSuccessPopup(true);
            setHasPaid(true);
            localStorage.setItem("cibilPaid", "true");
          } else {
            console.warn("Payment incomplete. Status:", res.status);
          }
        } catch (err) {
          console.error("Payment verification failed:", err);
        } finally {
          setIsVerifying(false);
          // Remove query params from URL
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("order_id");
          newParams.delete("request_id");
          setSearchParams(newParams);
        }
      }
    };
    checkRedirect();
  }, [searchParams, setSearchParams]);

  // 2. Check payment status: read users/{uid}/cibilPaid directly from Firebase RTDB
  useEffect(() => {
    // If already cached in localStorage, no need to check again
    if (localStorage.getItem("cibilPaid") === "true") {
      setHasPaid(true);
      setCheckLoading(false);
      return;
    }

    // If user is not logged in, nothing to check
    if (!currentUser) {
      setCheckLoading(false);
      return;
    }

    const checkPaymentStatus = async () => {
      setCheckLoading(true);
      try {
        // Primary check: read users/{uid}/cibilPaid from Firebase RTDB directly
        const snapshot = await get(ref(db, `users/${currentUser.uid}/cibilPaid`));
        if (snapshot.exists() && snapshot.val() === true) {
          setHasPaid(true);
          localStorage.setItem("cibilPaid", "true");
          return;
        }

        // Fallback: also check cibil_requests collection for paid status by email
        const res = await apiFetch(
          `/api/payment/status/${encodeURIComponent(currentUser.email)}`,
        );
        if (res?.paid) {
          setHasPaid(true);
          localStorage.setItem("cibilPaid", "true");
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      } finally {
        setCheckLoading(false);
      }
    };
    checkPaymentStatus();
  }, [currentUser]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div id="ServicePage" className="service-page-container">
      {/* Hero Section */}
      <Cover
        tagline={svc.tagline}
        title={svc.Title}
        description={`Get your ${svc.Title} with BanksBuddy.`}
        image="/cc7.png"
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
              {checkLoading || isVerifying ? (
                <button className="sp-btn-primary" disabled>
                  {isVerifying ? "Verifying Payment..." : "Checking Status..."}
                </button>
              ) : hasPaid ? (
                <button
                  className="sp-btn-primary cb-btn-report"
                  onClick={async () => {
                    setShowSuccessPopup(true);
                    const savedEmail =
                      currentUser?.email ||
                      localStorage.getItem("userEmail") ||
                      "Unknown User";
                    const safeEmail = savedEmail.replace(/[^a-zA-Z0-9]/g, "_");
                    try {
                      await apiFetch(`/api/cibil-notifications/${safeEmail}`, {
                        method: "PUT",
                        body: JSON.stringify({
                          email: savedEmail,
                          type: "report_request",
                          message: `${savedEmail} asked for a CIBIL report.`,
                          read: false,
                          status: "pending",
                          createdAt: new Date().toISOString(),
                        }),
                      });
                    } catch (err) {
                      console.error("Error creating notification:", err);
                    }
                  }}
                >
                  Get a Report <GoArrowRight />
                </button>
              ) : !currentUser ? (
                <button
                  className="sp-btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Apply Now <GoArrowRight />
                </button>
              ) : (
                <button
                  className="sp-btn-primary"
                  onClick={() => setShowFormModal(true)}
                >
                  Pay Now <GoArrowRight />
                </button>
              )}

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

        <div className="cibprt">
          <h1 className=" sp-section-title" style={{ textAlign: "center" }}>
            Our Trusted Bureaus Partners
          </h1>
          <p className="sp-text-block center-text">
            Partnering with India's leading credit bureaus to provide expert
            analysis and help improve your credit score.
          </p>
          <img src="/bureaus.png" style={{ width: "80%" }} alt="" />
        </div>

        {/* About & Highlights */}
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
            <h2 className="sp-section-title">About {svc.id}</h2>
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
              <h3>Key Highlights of {svc.id}</h3>
            </div>
            <div className="sp-details-list">
              {svc.TbLabels.map((k, i) => (
                <div key={i} className="sp-detail-item">
                  <span className="sp-detail-label">{k}</span>
                  <span className="sp-detail-value">{svc.TbData[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Online Features Horizontal Grid */}
        <section className="sp-section">
          <div className="sp-centered-header">
            <span className="sp-section-tag">Why Choose Us</span>
            <h2 className="sp-section-title">{svc.id} Features</h2>
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

        {/* Features List Section (Split) - Replacing Eligibility for Cibil as it has features list */}
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
              <img src="/se3m1.jpg" alt="Service Features" />
            </motion.div>
            <motion.div
              className="sp-split-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              variants={fadeUp}
            >
              <span className="sp-section-tag">Service Benefits</span>
              <h2 className="sp-section-title">Comprehensive Solutions</h2>
              <div className="sp-check-list">
                {svc.features.map((feat, i) => (
                  <div key={i} className="sp-check-item">
                    <FaCheckCircle className="sp-check-icon" />
                    <p className="sp-check-text">{feat}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Documents Section */}
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
            <h2 className="sp-section-title">Our Services</h2>
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

        {/* FAQ Section */}
        <motion.div
          className="sp-section"
          id="faq-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
        >
          {/* FAQ Section with Categories */}
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

          <FAQ
            faqs={
              faqCategory === "Common"
                ? cibilFAQs.slice(0, 3)
                : faqCategory === "Informations"
                  ? cibilFAQs.slice(3, 6)
                  : cibilFAQs.slice(6)
            }
            title=""
            subtitle=""
          />
        </motion.div>
      </div>

      {/* ─── Form Modal ─── */}
      <DevStudioPaymentForm
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        serviceTitle={svc.Title}
      />

      {/* ─── Success Popup ─── */}
      {showSuccessPopup && (
        <div
          className="cb-success-overlay"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div className="cb-success-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="cb-close-btn"
              onClick={() => setShowSuccessPopup(false)}
            >
              <FaTimes />
            </button>
            <div className="cb-success-icon">✅</div>
            <h2 className="cb-success-title">Payment Successful!</h2>
            <p className="cb-success-text">
              You will receive a{" "}
              <strong>detailed credit report analysis</strong> and be contacted
              by the <strong>BanksBuddy team within 15–20 minutes</strong>.
            </p>
            <p className="cb-success-subtext">
              Our credit expert will reach out to you on your registered phone
              number.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
