import React, { useState, useEffect } from "react";
import "./AboutRefactored.css";
import { motion } from "framer-motion";
import apiFetch from "../lib/api.js";
import { Awards } from "./Awards";
import { Mile } from "./Mile.jsx";

export const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandPartners, setExpandPartners] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await apiFetch("/api/team");
        setTeamMembers(data || []);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };
    fetchTeam();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <motion.section
        className="ab-hero"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        variants={fadeUp}
      >
        <div className="ab-hero-content">
          <span className="ab-tagline">Who We Are</span>
          <h1>
            Empowering Your <br /> Financial Journey
          </h1>
          <p>
            Your trusted partner for loans, insurance, and financial growth. We
            make finance simple, transparent, and accessible for everyone.
          </p>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        className="ab-story-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <div className="ab-story-content">
          <h2>CEO & Founder</h2>
          <p>
            BanksBuddy was founded by Ashwin Kumar Singh with a singular vision:
            to be the most trusted and innovative financial partner for
            individuals and businesses worldwide. From our humble beginnings, we
            have strived to provide exceptional services that empower our
            clients to make informed decisions.
          </p>
          <p>
            Over time, we have expanded our portfolio to include CIBIL score
            improvement, education loans, and diverse CA services. Today, we
            stand proud as one of the fastest-growing platforms in the finance
            industry, turning financial dreams into reality—from education to
            enterprise.
          </p>
        </div>
        <div
          className="ab-story-image"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "32rem",
              objectFit: "cover",
              borderRadius: "18rem",
            }}
            src="/real.jpeg"
            alt="BanksBuddy Story"
          />
        </div>
      </motion.section>
      <Mile />
      

      {/* Mission / Video Section */}
      <motion.section
        className="ab-mission-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <div className="ab-mission-content">
          <span className="ab-mission-tag">Our Guiding Principles</span>
          <h2>Mission & Vision</h2>
          <p>
            Our mission is to provide quick, reliable, and personalized
            financial solutions. We simplify complex decisions by offering
            accessible products like loans, insurance, and advisory services,
            allowing you to focus on growth and stability.
          </p>
          <p>
            We envision a world where financial freedom is a reality for
            everyone. By staying committed to integrity, innovation, and
            excellence, we strive to be the leading platform that transforms the
            financial landscape, one success story at a time.
          </p>
        </div>
        <div
          className="ab-video-wrapper"
          style={{
            borderRadius: "6rem",
            overflow: "hidden",
          }}
        >
          {/* <video src="/mnv.mp4" autoPlay muted loop playsInline /> */}
          <img
            style={{
              width: "100%",
            }}
            src="/mnv.jpg"
            alt="mission and vision"
          />
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="ab-values-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <div className="ab-values-content">
          <h2>Our Values</h2>
          <div className="vanen">
            <img
              className="v-full"
              style={{ width: "100%" }}
              src={isMobile ? "/mobilevalues.png" : "/values.png"}
              alt="values"
            />
          </div>
        </div>
      </motion.section>

      {/* Partners Section */}
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

      {/* Team Section */}
      {/* <section className="ab-team-section">
        <div className="ab-section-header">
          <h2>Meet Our Team</h2>
          <p>Growth is the result of forces working together.</p>
        </div>

        <motion.div
          className="ab-team-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              className="ab-team-card"
              variants={fadeUp}
            >
              <img
                src={member.image}
                alt={member.name}
                className="ab-team-img"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section> */}

      <Awards />
    </div>
  );
};
