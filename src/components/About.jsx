import React, { useState, useEffect } from "react";
import "./AboutRefactored.css";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { Awards } from "./Awards";

export const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandPartners, setExpandPartners] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snapshot = await get(ref(db, "team"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTeamMembers(
            Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          );
        }
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
        staggerChildren: 0.1
      }
    }
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
          <h1>Empowering Your <br /> Financial Journey</h1>
          <p>
            Your trusted partner for loans, insurance, and financial growth.
            We make finance simple, transparent, and accessible for everyone.
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
          <h2>Our Story</h2>
          <p>
            BanksBuddy was founded by Ashwin Kumar Singh with a singular vision: to be the most trusted and innovative financial partner for individuals and businesses worldwide. From our humble beginnings, we have strived to provide exceptional services that empower our clients to make informed decisions.
          </p>
          <p>
            Over time, we have expanded our portfolio to include CIBIL score improvement, education loans, and diverse CA services. Today, we stand proud as one of the fastest-growing platforms in the finance industry, turning financial dreams into reality—from education to enterprise.
          </p>
        </div>
        <div className="ab-story-image">
          <img src="ab1.jpg" alt="BanksBuddy Story" />
        </div>
      </motion.section>

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
            Our mission is to provide quick, reliable, and personalized financial solutions. We simplify complex decisions by offering accessible products like loans, insurance, and advisory services, allowing you to focus on growth and stability.
          </p>
          <p>
            We envision a world where financial freedom is a reality for everyone. By staying committed to integrity, innovation, and excellence, we strive to be the leading platform that transforms the financial landscape, one success story at a time.
          </p>
        </div>
        <div className="ab-video-wrapper">
          <video src="/mnv.mp4" autoPlay muted loop playsInline />
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
          <p>We collaborate with top financial institutions to provide you with the best rates and services.</p>
        </div>

        <div className="ab-partners-grid">
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28,
          ]
            .slice(0, expandPartners ? 28 : 12)
            .map((num) => (
              <img
                key={num}
                src={`a${num}.webp`}
                alt={`Partner ${num}`}
                className="ab-partner-logo"
              />
            ))}
        </div>

        <button
          className="ab-btn-outline"
          onClick={() => setExpandPartners(!expandPartners)}
        >
          {expandPartners ? "View Less" : "View All Partners"}
        </button>
      </motion.section>

      {/* Team Section */}
      <section className="ab-team-section">
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
              <img src={member.image} alt={member.name} className="ab-team-img" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Awards />
    </div>
  );
};

