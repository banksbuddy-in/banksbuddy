import React, { useState, useEffect } from "react";
import "./optional.css";
// eslint-disable-next-line no-unused-vars
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

  return (
    <div id="about">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        ABOUT US
      </motion.h1>
      <motion.div
        className="a1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        <div className="a1ct">
          <h3>Company History</h3>
          <p>
            BanksBuddy was founded by Ashwin Kumar Singh with the vision To be
            the most trusted and innovative financial partner for individuals
            and businesses worldwide From the very beginning, our goal has been
            To provide exceptional financial services that empower our clients
            to make informed decisions, achieve financial stability, and realize
            their dreams through innovative solutions and personalized service.
            <br />
            Over time, BanksBuddy has expanded its services to include CIBIL
            score improvement, education loans, and CA services like ITR filing
            and business registrations. Today, we are proud to be one of the
            fastest-growing platforms in the finance industry, dedicated to
            offering personalized solutions that make financial dreams a reality
            for everyone. From Education loan to Business loan we are here to be
            your finance buddy
          </p>
        </div>
        <img src="ab1.jpg" alt="About BanksBuddy" />
      </motion.div>
      <motion.div
        className="a2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        <video src="/mnv.mp4" autoPlay muted loop />
        <div className="a2ct">
          <p className="a2cts">Our Guiding Principles</p>
          <h4>Mission and Vision</h4>
          <p>
            At BanksBuddy, our mission is to provide quick, reliable, and
            personalized financial solutions that empower individuals and
            businesses to achieve their dreams. We are dedicated to simplifying
            financial decisions by offering accessible products and services,
            such as loans, insurance, and CA services, ensuring that our clients
            can focus on what matters most to them — growth, stability, and
            success. Our core values are Integrity, Innovation, Customer Focus,
            . Excellence
            <br />
            Our vision is to be the leading platform that transforms the
            financial services landscape by continually innovating and evolving
            our offerings. We aim to make financial freedom a reality for people
            across the globe by delivering seamless, trustworthy, and
            comprehensive financial solutions. By staying committed to
            excellence and customer satisfaction, we strive to create a world
            where anyone can access the financial support they need to thrive.
          </p>
        </div>
      </motion.div>
      <motion.div
        className="a3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        <h1>Our Partners</h1>
        <p>
          BanksBuddy is proud to be partnered with the top financial
          institutions to provide unparalleled services to our customers.
        </p>
        <div className={`a3imgs ${!expandPartners ? "collapsed" : ""}`}>
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28,
          ]
            .slice(0, expandPartners ? 28 : 12)
            .map((num) => (
              <img key={num} src={`a${num}.webp`} alt={`Partner ${num}`} />
            ))}
        </div>
        <div className="a3-buttons">
          {!expandPartners ? (
            <button
              className="view-all-btn"
              onClick={() => setExpandPartners(true)}
            >
              View All
            </button>
          ) : (
            <button
              className="view-less-btn"
              onClick={() => setExpandPartners(false)}
            >
              View Less
            </button>
          )}
        </div>
      </motion.div>
      <motion.div
        className="a4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        <h1>Our Team</h1>
        <p className="a4ct">
          Growth is never by mere chance, it is the result of forces working
          together
        </p>
        <div className="memcards">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="mem"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              variants={fadeUp}
            >
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <Awards />
    </div>
  );
};
