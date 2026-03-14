import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import "./Mile.css";

const Timeline = [
  {
    step: "01",
    year: 2023,
    title: "Company Founded",
    description:
      "BanksBuddy, founded in 2023, is driven by a clear vision: to be the most trusted and innovative financial partner for individuals and businesses worldwide.",
  },
  {
    step: "02",
    year: 2024,
    title: "First Expansion",
    description:
      "The Beginning in Rajasthan: BanksBuddy was established with a strong vision to offer a wide range of Financial and Tax services to customers under one roof. After building a strong foundation and trusted presence in Rajasthan, we took our first major step toward growth by successfully expanding our operations into Madhya Pradesh, marking an important milestone in our journey. ",
  },
  {
    step: "03",
    year: 2025,
    title: "Business Expansion",
    description:
      "As we expanded our presence, we built strong strategic partnerships with 450+ public and private sector banks across India for loan and insurance services. We also launched our specialized CIBIL Improvement Service, designed to help individuals enhance their credit profiles by working closely with credit bureaus such as TransUnion CIBIL, Experian, Equifax, and CRIF.",
  },
  {
    step: "04",
    year: 2026,
    title: "PAN India Expansion",
    description:
      "From a single-state beginning to becoming a multi-service financial platform across India, BanksBuddy continues to grow with one clear mission: to empower individuals and businesses with trusted, innovative, and comprehensive financial solutions.",
  },
];

export const Mile = () => {
  const containerRef = useRef(null);

  // Track scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 60%"],
  });

  // Add buttery smooth spring to the progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <div id="milestone" className="dt-section" ref={containerRef}>
      <div className="dt-max-width">
        <motion.h1
          className="sp-section-title"
          style={{
            color:"white",
            textAlign:"center",
            paddingBottom:"7%",
            fontSize:"2.25em"
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Journey
        </motion.h1>

        <div className="dt-container">
          {/* Vertical progress line */}
          <div className="dt-line-wrapper">
            <div className="dt-line-bg"></div>
            <motion.div
              className="dt-line-fill"
              style={{ scaleY: smoothProgress, transformOrigin: "top" }}
            ></motion.div>
          </div>

          <div className="dt-content-wrapper">
            {Timeline.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index }) => {
  return (
    <div className="dt-item">
      <div className="dt-step-container">
        <span className="dt-step">{item.step}</span>
      </div>
      <div className="dt-item-content">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="dt-tagline">Year {item.year}</span>
          <h2 className="dt-heading">{item.title}</h2>
          <p
          style={{
            textAlign:"justify"
          }}
          className="dt-description">{item.description}</p>
        </motion.div>
      </div>
    </div>
  );
};
