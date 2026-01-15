import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Insur } from "./Data_Special";
import "./services.css";
import { FAQ } from "./FAQ";
import { getFAQsByServiceId } from "./Data_FAQs";

export const InsuranceSubCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [faqCategory, setFaqCategory] = useState("Common");

  // Find the insurance data and the specific subcategory
  const insuranceData = Insur[0];
  const subCategory = insuranceData?.subsections?.find(
    (sub) => sub.id === category.replace(/-/g, "_")
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
            background: "#ff451f",
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

  return (
    <div
      className="insurance-subcategory-container"
      style={{
        padding: "1% 10%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Header Section */}
      <div
        className="subcategory-header"
        style={{
          textAlign: "center",
          marginBottom: "5%",
          width: "100%",
        }}
      >
        {/* <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{subCategory.icon}</div> */}
        <div className="subcont">
          <h1
            style={{
              fontSize: "3.5rem",
              color: "#ff451f",
              margin: "3% 0",
              marginBottom: "0",
            }}
          >
            {subCategory.title}
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#666",
              margin: "0 auto",
              marginBottom: "2rem",
            }}
          >
            {subCategory.overview}
          </p>
        </div>
        <img
          src={subCategory.image}
          style={{ borderRadius: "5rem" }}
          alt={subCategory.title}
        />
      </div>

      {/* Description Section */}

      {/* Key Benefits Section */}
      <div
        className="subcategory-benefits"
        style={{ marginBottom: "3rem", width: "100%", maxWidth: "1200px" }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            textAlign: "center",
            color: "var(--bl)",
            marginBottom: "1.5rem",
          }}
        >
          Key Benefits
        </h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
            justifyContent: "center",
            listStyle: "none",
            padding: 0,
          }}
        >
          {subCategory.keyBenefits.map((benefit, idx) => (
            <li
              key={idx}
              style={{
                padding: "1rem 1.5rem",
                background: "#fff5f3",
                borderRadius: "1rem",
                borderLeft: "4px solid #ff451f",
                fontSize: "1rem",
              }}
            >
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Plans Section */}
      <div
        className="subcategory-plans"
        style={{ marginBottom: "3rem", width: "100%", maxWidth: "1200px" }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            color: "var(--bl)",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Popular Plans
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {subCategory.popularPlans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                padding: "1.5rem",
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "3rem",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255, 69, 31, 0.2)";
                e.currentTarget.style.borderColor = "#ff451f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  color: "#ff451f",
                  marginBottom: "0.75rem",
                }}
              >
                {plan.name}
              </h3>
              <p style={{ fontSize: "1rem", color: "#666", lineHeight: "1.6" }}>
                {plan.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Who Should Buy Section */}
      <div
        className="subcategory-who-should-buy"
        style={{
          marginBottom: "3rem",
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            color: "var(--bl)",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Who Should Buy?
        </h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            justifyItems: "center",
            listStyle: "none",
            padding: 0,
            width: "100%",
          }}
        >
          {subCategory.whoShouldBuy.map((person, idx) => (
            <li
              key={idx}
              style={{
                padding: "1rem",
                background: "#f9f9f9",
                borderRadius: "3rem",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                width: "100%",
              }}
            >
              <span style={{ color: "#ff451f", fontSize: "1.5rem" }}>✓</span>
              {person}
            </li>
          ))}
        </ul>
      </div>

      {/* Documents Required Section */}
      <div
        className="subcategory-documents"
        style={{
          marginBottom: "3rem",
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            color: "var(--bl)",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Documents Required
        </h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            justifyItems: "center",
            listStyle: "none",
            padding: 0,
            width: "100%",
          }}
        >
          {subCategory.documents.map((doc, idx) => (
            <li
              key={idx}
              style={{
                padding: "1rem 1.5rem",
                background: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "3rem",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#ff451f", fontSize: "1.2rem" }}>📄</span>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Section */}
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "linear-gradient(135deg, #ff451f 0%, #ff6b47 100%)",
          borderRadius: "3rem",
          color: "white",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
          Get expert guidance and find the perfect insurance plan for you
        </p>
        <button
          onClick={() => navigate("/consultation")}
          style={{
            padding: "1rem 3rem",
            background: "white",
            color: "#ff451f",
            border: "none",
            borderRadius: "3rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          Book Free Consultation
        </button>
      </div>
      {/* FAQ Section with Categories */}
      <div style={{ width: "100%", maxWidth: "1200px", marginTop: "2rem" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "2.5rem",
            color: "var(--bl)",
            marginBottom: "1.5rem"
          }}>
            {subCategory.title} FAQs
          </h2>

          <div className="sp-faq-tabs" style={{ justifyContent: "center", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {["Common", "Informations", "Misc"].map((tab) => (
              <button
                key={tab}
                className={`sp-faq-tab ${faqCategory === tab ? "active" : ""}`}
                onClick={() => setFaqCategory(tab)}
                style={{
                  padding: "0.8rem 2rem",
                  border: "none",
                  borderRadius: "2rem",
                  background: faqCategory === tab ? "#ff451f" : "#f0f0f0",
                  color: faqCategory === tab ? "white" : "#333",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: faqCategory === tab ? "0 4px 12px rgba(255, 69, 31, 0.3)" : "none"
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <FAQ
          faqs={(() => {
            const allFaqs = getFAQsByServiceId(subCategory.id);
            const commonFaqs = allFaqs.slice(0, 3);
            const infoFaqs = allFaqs.slice(3, 6);
            const miscFaqs = allFaqs.slice(6);

            if (faqCategory === "Common") return commonFaqs;
            if (faqCategory === "Informations") return infoFaqs;
            return miscFaqs;
          })()}
          title=""
          subtitle=""
        />
      </div>
    </div>
  );
};
