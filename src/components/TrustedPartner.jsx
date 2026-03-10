import React from "react";
import { Awards } from "./Awards";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineClipboardList,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import "../components/AboutRefactored.css"; // Reuse modern styles
import { useState } from "react";
import { Pann } from "./Pann";

export const TrustedPartner = () => {
  const navigate = useNavigate();
  const [expandPartners, setExpandPartners] = useState(false);
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="about-page-container">
      {" "}
      {/* Reuse container */}
      <div className="ab-hero">
        <div className="ab-hero-content">
          <span className="ab-tagline">Partnerships</span>
          <h1>Partnership with BanksBuddy</h1>
          <p>
            We partner with banks, fintechs, regulators, and community
            organisations to deliver secure, inclusive, and innovative banking
            solutions. Join us in expanding financial access.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <button
              className="ab-btn-outline"
              onClick={() => navigate("/partner-application")}
              style={{ background: "var(--bl)", color: "#fff", border: "none" }}
            >
              Be the Trusted Partner Now
            </button>
          </div>
        </div>
      </div>
      {/* New Section: Why Partner & Pan India */}
      <div
        className="ab-story-section"
        style={{
          textAlign: "center",
        }}
      >
        <div
          className="ab-story-content"
          style={{
            padding: "0% 20%",
            textAlign: "center",
          }}
        >
          <h2>Why Partner with BanksBuddy?</h2>
          <p style={{ textAlign: "center" }}>
            Join a network that values speed, trust, and massive reach. We
            provide our partners with cutting-edge technology and a
            pre-qualified customer base.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "var(--bl)",
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              Pan-India Presence
            </h3>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.95rem",
              }}
            >
              With an operational footprint spanning{" "}
              <strong>500+ cities</strong> and
              <strong> 20,000+ pin codes</strong> across India, ensure your
              financial products reach the most remote corners of the nation
              instantly.
            </p>
            <h3
              style={{
                color: "var(--bl)",
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              Rapid Onboarding
            </h3>
            <p style={{ fontSize: "0.95rem", textAlign: "center" }}>
              Our streamlined digital verification processes allow us to onboard
              new partners and start processing applications in record time.
            </p>
          </div>
        </div>
        {/* <div className="ab-story-image">
          <img src="/pn.png" alt="pan india png" />
        </div> */}
      </div>
      <Pann />
      {/* New Section: Timeline */}
      <div
        className="ab-mission-section"
        style={{
          flexDirection: "column",
          textAlign: "center",
          gap: "4rem",
          position: "relative",
          overflow: "hidden",
          padding: "4rem 2rem",
          background: "#f8fafc",
        }}
      >
        <div className="ab-section-header" style={{ marginBottom: "0" }}>
          <h2>Onboarding Timeline</h2>
          <p>Go live with BanksBuddy in just 4 simple steps.</p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Connecting Line (Desktop) */}
          <div
            className="timeline-line"
            style={{
              position: "absolute",
              top: "55px",
              left: "10%",
              right: "10%",
              height: "3px",
              background: "linear-gradient(81deg, #1204f1, #ef4444)",
              zIndex: -1,
              opacity: 1,
              borderRadius: "6rem",
              display: "none",
            }}
          ></div>

          {[
            {
              step: "01",
              title: "Registration",
              desc: "Submit your application form online.",
              time: "Day 1",
              icon: <HiOutlineClipboardList />,
            },
            {
              step: "02",
              title: "Verification",
              desc: "Our team validates your credentials.",
              time: "Day 2-3",
              icon: <HiOutlineShieldCheck />,
            },
            {
              step: "03",
              title: "Agreement",
              desc: "Digital signing of MoU & terms.",
              time: "Day 4",
              icon: <HiOutlineDocumentText />,
            },
            {
              step: "04",
              title: "Go Live",
              desc: "Integration & start receiving leads.",
              time: "Day 5",
              icon: <HiOutlineLightningBolt />,
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="ab-team-card"
              style={{
                width: "240px",
                padding: "2rem 1.5rem",
                position: "relative",
                background: "white",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                borderRadius: "20px",
                border: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                transition: "transform 0.3s ease",
              }}
            >
              {/* Icon Circle */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "var(--bl)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                  marginBottom: "0.5rem",
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "800",
                  color: "var(--bl)",
                  opacity: 0.9,
                }}
              >
                {item.step}
              </div>

              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "0.5rem",
                    color: "#1e293b",
                    fontWeight: "700",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#64748b",
                    lineHeight: "1.5",
                  }}
                >
                  {item.desc}
                </p>
              </div>

              <div
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "0.4rem 1.2rem",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginTop: "auto",
                }}
              >
                {item.time}
              </div>
            </div>
          ))}

          <style>{`
             .ab-team-card:hover { transform: translateY(-5px); }
             @media (min-width: 1024px) {
               .timeline-line { display: block !important; }
             }
           `}</style>
        </div>
      </div>
      <motion.section
        className="ab-partners-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <div className="ab-section-header">
          <h2>Our Trusted Partners</h2>
          <p>
            We collaborate with top financial institutions to provide you with
            the best rates and services.
          </p>
        </div>

        <div className="ab-partners-grid">
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
          ]
            .slice(0, expandPartners ? 84 : 18)
            .map((num) => {
              const extGroups = {
                svg: [7, 14, 17, 18, 22, 83, 84],
                webp: [
                  8, 9, 10, 11, 12, 13, 15, 16, 19, 20, 21, 23, 74, 75, 76, 77,
                  78, 79, 80, 81, 82,
                ],
                jpg: [53],
              };
              const ext =
                Object.keys(extGroups).find((key) =>
                  extGroups[key].includes(num),
                ) || "png";
              return (
                <img
                  key={num}
                  src={`/part/${num}.${ext}`}
                  alt={`Partner ${num}`}
                  className="ab-partner-logo desai"
                />
              );
            })}
        </div>

        <button
          className="ab-btn-outline"
          onClick={() => setExpandPartners(!expandPartners)}
        >
          {expandPartners ? "View Less" : "View All Partners"}
        </button>
      </motion.section>
      {/* <div style={{ display: "flex", justifyContent: "center", gap: "2rem", paddingBottom: "4rem", flexWrap: "wrap" }}>
        <img src="/pc1.png" alt="Empanelment 1" style={{ maxWidth: "200px", objectFit: "contain" }} />
        <img src="/pc2.png" alt="Empanelment 2" style={{ maxWidth: "200px", objectFit: "contain" }} />
      </div> */}
      <Awards />
    </div>
  );
};
