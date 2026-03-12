import React, { useState, useEffect } from "react";
import "./AboutRefactored.css";
import { motion } from "framer-motion";
import apiFetch from "../lib/api.js";
import { Awards } from "./Awards";
import { Mile } from "./Mile.jsx";
import {
  FaChartLine,
  FaMoneyCheckAlt,
  FaCalculator,
  FaShieldAlt,
} from "react-icons/fa";

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
      <motion.section
        className="ab-story-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <div className="ab-story-content">
          <h2>Company Overview</h2>
          <p
            className="sctn"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "justify",
              justifyContent: "center",
              paddingTop:"1%"
            }}
          >
            Founded in 2023, BanksBuddy was built with a clear vision — to become the most trusted partner for improving financial health. The platform primarily focuses on CIBIL Score Improvement, helping individuals strengthen their credit profiles, understand their credit reports, and unlock better financial opportunities. Alongside this, we offer Loans, Insurance, and Tax Services, providing a complete suite of solutions to manage finances efficiently and confidently.
            <span>
             Over the years, we have helped thousands of clients improve their Credit Scores, secure the right Loans, protect their assets with Insurance, and Optimize their Taxes. Our approach combines personalized guidance with trusted financial strategies, making complex processes simple and transparent. By focusing on CIBIL improvement as the foundation of financial empowerment, BanksBuddy ensures clients are better positioned to achieve stability, access opportunities, and make informed decisions.
            </span>
            At BanksBuddy, we believe that the right financial guidance can
            transform lives. That’s why we focus on delivering simple,
            personalized, and reliable financial solutions that empower
            individuals, students, and businesses to make informed decisions,
            achieve financial stability, and reach their goals.
          </p>
        </div>
      </motion.section>
      <motion.section
        className="ab-services-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <div className="ab-services-header">
          <h2>What We Do</h2>
          <p>
            We offer a comprehensive range of financial solutions designed to
            support individuals, families, and businesses at every stage of
            their financial journey. Our goal is to simplify financial processes
            and help you make confident decisions for a secure future.
          </p>
        </div>
        <div className="ab-services-grid">
          <div className="ab-service-card">
            <FaChartLine className="ab-service-icon" />
            <h3>CIBIL Score Improvement</h3>
            <p>
              Helping individuals strengthen their credit profiles with expert
              guidance and proven strategies.
            </p>
          </div>
          <div className="ab-service-card">
            <FaMoneyCheckAlt className="ab-service-icon" />
            <h3>Loan Assistance</h3>
            <p>
              We help you find and secure the right loan based on your needs and
              eligibility. Complete support for Personal, Education, Business,
              Auto, and Home Loans.
            </p>
          </div>
          <div className="ab-service-card">
            <FaCalculator className="ab-service-icon" />
            <h3>CA Services</h3>
            <p>
              Professional assistance for ITR filing, business registrations,
              and comprehensive compliance services.
            </p>
          </div>
          <div className="ab-service-card">
            <FaShieldAlt className="ab-service-icon" />
            <h3>Insurance Advisory</h3>
            <p>
              Expert guidance to choose the right protection and coverage for
              you and your family's secure future.
            </p>
          </div>
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
          <p
            style={{
              textAlign: "justify",
            }}
          >
            BanksBuddy was founded by Ashwin Kumar Singh with the vision of
            simplifying the loan process and eliminating unnecessary commissions
            charged by DSAs and third-party agents. The platform allows
            individuals to apply for loans directly from home and connect with
            trusted banks without visiting multiple branches. Its goal is to
            make borrowing faster, easier, and more transparent for customers.
          </p>
          <p
            style={{
              textAlign: "justify",
            }}
          >
            With over five years of experience in the finance industry, Ashwin
            has built strong expertise in financial services, loan assistance,
            and credit advisory. He also introduced CIBIL score improvement
            guidance to help individuals strengthen their credit profiles and
            increase their chances of loan approval. Under his leadership,
            BanksBuddy focuses on trust, transparency, and customer-centric
            financial solutions.
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
              objectFit: "cover",
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
            overflow: "hidden",
            boxShadow: "none",
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
