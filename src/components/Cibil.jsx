import React, { useEffect, useState } from "react";

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
import { db } from "../firebase";
import { ref, push } from "firebase/database";
import { motion } from "framer-motion";
import { BuyNowPayment } from "./BuyNowPayment";

const CASHFREE_SCRIPT = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js";

// Helper to select icon based on document text (Reusing logic from ServicePage)
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
    id: "Cibil Improvement",
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

const svc = InsuranceData.find((s) => s.id === "Cibil Improvement");

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

export const Cibil = () => {
  const [faqCategory, setFaqCategory] = useState("Common");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(200);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user has already paid for CIBIL improvement
    const checkPaymentStatus = async (user) => {
      if (!user) return;
      const cibilRef = ref(db, "cibil_requests");
      onValue(cibilRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const paidRequest = Object.values(data).find(
            (req) => req.email === user.email && req.status === "paid",
          );
          if (paidRequest) {
            setHasPaid(true);
          }
        }
      });
    };

    // Assuming we have access to current user's email
    // For now, checking against the phone/email if they were recently stored in localStorage or if we can find a better way.
    // Let's look for a generic way since login might not be robust.
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      checkPaymentStatus({ email: savedEmail });
    }
  }, []);
  const [cfReady, setCfReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [sdkError, setSdkError] = useState("");

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    employmentType: "",
    income: "",
    message: "",
  });

  useEffect(() => {
    setCfReady(true);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getMode = () =>
    (import.meta.env.VITE_CASHFREE_ENV || "sandbox").toLowerCase() ===
    "production"
      ? "production"
      : "sandbox";

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      state: "",
      city: "",
      employmentType: "",
      income: "",
      message: "",
    });
    setFormStatus("");
  };

  const recordRevenue = async (status, orderId) => {
    const now = new Date().toISOString();
    await push(ref(db, "cashfree_revenue"), {
      serviceId: "cibil-improvement",
      serviceTitle: svc.Title,
      mainCategory: "Cibil Improvement",
      username: formData.name || "Guest User",
      email: formData.email || "",
      mobile: formData.phone || "",
      status,
      amount: Number(paymentAmount),
      orderId,
      date: now,
      createdAt: now,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("");

    if (!cfReady) {
      setFormStatus("Payment gateway is still loading. Please wait.");
      return;
    }

    const amountValue = Number(paymentAmount);
    if (!amountValue || amountValue <= 0) {
      setFormStatus("Enter a valid amount.");
      return;
    }

    try {
      setPaying(true);

      const appId = import.meta.env.VITE_CASHFREE_APP_ID;
      const secret = import.meta.env.VITE_CASHFREE_SECRET_KEY;
      const envUrl =
        (import.meta.env.VITE_CASHFREE_API_ENV || "sandbox").toLowerCase() ===
        "production"
          ? "https://api.cashfree.com/pg"
          : "https://sandbox.cashfree.com/pg";

      if (!appId || !secret)
        throw new Error("Cashfree keys missing in environment.");

      const orderPayload = {
        order_amount: amountValue,
        order_currency: "INR",
        order_id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        order_note: `${svc.Title || "Service"} payment`,
        customer_details: {
          customer_id: formData.phone || `guest_${Date.now()}`,
          customer_name: formData.name || "Guest User",
          customer_email: formData.email || "support@banksbuddy.com",
          customer_phone: formData.phone || "9999999999",
        },
        order_meta: {
          return_url: `${window.location.origin}/payment-status?order_id={order_id}`,
        },
      };

      const res = await fetch(`${envUrl}/orders`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": appId,
          "x-client-secret": secret,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.link_url) {
        throw new Error(
          data?.error || "Unable to start payment link via Cashfree directly",
        );
      }

      await recordRevenue("pending", data.order_id || data.link_id);

      // Save email to localStorage for persistence check
      if (formData.email) {
        localStorage.setItem("userEmail", formData.email);
      }

      await push(ref(db, "cibil_requests"), {
        ...formData,
        paymentId: data.order_id || data.link_id,
        amount: amountValue,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // Redirect the user entirely off banksbuddy.com to cashfree.com
      window.location.href = data.link_url;
    } catch (err) {
      console.error("Cashfree payment error", err);
      setFormStatus(
        err.message || "Payment could not be processed. Try again.",
      );
    } finally {
      setPaying(false);
    }
  };

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
              {hasPaid ? (
                <button
                  className="sp-btn-primary cb-btn-report"
                  onClick={() => setShowSuccessPopup(true)}
                >
                  Get a Report <GoArrowRight />
                </button>
              ) : (
                <button
                  className="sp-btn-primary"
                  onClick={() => setShowFormModal(true)}
                >
                  Pay now <GoArrowRight />
                </button>
              )}
              <BuyNowPayment
                serviceId="cibil-improvement"
                serviceTitle={svc.Title}
                mainCategory="Cibil Improvement"
                defaultAmount={paymentAmount}
              />
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

            <div className="sp-docs-grid">
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

        {/* Bottom CTA */}
        <section className="sp-bottom-cta">
          <h2>Ready to improve your CIBIL Score?</h2>
          {hasPaid ? (
            <button
              className="sp-btn-white cb-btn-report"
              onClick={() => setShowSuccessPopup(true)}
            >
              Get a Report <GoArrowRight />
            </button>
          ) : (
            <button
              className="sp-btn-white"
              onClick={() => setShowFormModal(true)}
            >
              Pay now — ₹{paymentAmount} <GoArrowRight />
            </button>
          )}
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
      {showFormModal && (
        <div
          className="cb-modal-overlay"
          onClick={() => setShowFormModal(false)}
        >
          <div
            className="cb-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="cb-close-btn"
              onClick={() => setShowFormModal(false)}
            >
              <FaTimes />
            </button>
            <h2 className="cb-modal-title">Apply for CIBIL Improvement</h2>
            <p className="cb-modal-subtitle">
              Fill your details below and pay securely via Cashfree.
            </p>
            <form className="cb-form" onSubmit={handleFormSubmit}>
              <input
                className="cb-input"
                type="number"
                min="1"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                placeholder="Payment Amount (₹)"
              />
              <div className="cb-form-row">
                <input
                  className="cb-input"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                  placeholder="Full Name"
                />
                <input
                  className="cb-input"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  required
                  placeholder="Mobile Number"
                />
              </div>
              <input
                className="cb-input"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                required
                placeholder="Email Address"
              />
              <select
                className="cb-select"
                value={formData.state}
                onChange={(e) => handleFormChange("state", e.target.value)}
                required
              >
                <option value="">Select State</option>
                {[
                  "Andhra Pradesh",
                  "Arunachal Pradesh",
                  "Assam",
                  "Bihar",
                  "Chhattisgarh",
                  "Goa",
                  "Gujarat",
                  "Haryana",
                  "Himachal Pradesh",
                  "Jharkhand",
                  "Karnataka",
                  "Kerala",
                  "Madhya Pradesh",
                  "Maharashtra",
                  "Manipur",
                  "Meghalaya",
                  "Mizoram",
                  "Nagaland",
                  "Odisha",
                  "Punjab",
                  "Rajasthan",
                  "Sikkim",
                  "Tamil Nadu",
                  "Telangana",
                  "Tripura",
                  "Uttar Pradesh",
                  "Uttarakhand",
                  "West Bengal",
                  "Delhi",
                  "Chandigarh",
                  "Puducherry",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {formData.state && (
                <input
                  className="cb-input"
                  value={formData.city}
                  onChange={(e) => handleFormChange("city", e.target.value)}
                  required
                  placeholder="Enter City Name"
                />
              )}
              <select
                className="cb-select"
                value={formData.employmentType}
                onChange={(e) =>
                  handleFormChange("employmentType", e.target.value)
                }
                required
              >
                <option value="">Select Employment Type</option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
              </select>
              {formData.employmentType === "Salaried" && (
                <input
                  className="cb-input"
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleFormChange("income", e.target.value)}
                  required
                  placeholder="Monthly Income (₹)"
                />
              )}
              <textarea
                className="cb-textarea"
                value={formData.message}
                onChange={(e) => handleFormChange("message", e.target.value)}
                placeholder="Any additional details..."
                rows={3}
              />
              <button className="cb-btn-submit" type="submit">
                {paying
                  ? "Processing payment..."
                  : `Pay ₹${paymentAmount || ""} with Cashfree`}
              </button>
              {sdkError && <p className="cb-form-status">{sdkError}</p>}
              {formStatus && <p className="cb-form-status">{formStatus}</p>}
            </form>
          </div>
        </div>
      )}

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
