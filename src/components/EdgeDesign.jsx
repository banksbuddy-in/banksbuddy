import React from "react";
import {
  FaClipboardCheck,
  FaCubes,
  FaGem,
  FaGift,
  FaHandshake,
  FaHeadset,
  FaPercent,
  FaShieldAlt,
  FaWallet,
} from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
// import "./newserv.css";

const DesignData = [
  {
    feature: "Easy On-boarding",
    icon: <FaUserPlus />,
  },
  {
    feature: "Multiple Products",
    icon: <FaCubes />,
  },
  {
    feature: "Zero Investment",
    icon: <FaPercent />,
  },
  {
    feature: "Best-in-class & Prompt Payouts",
    icon: <FaWallet />,
  },
  {
    feature: "Instant Approvals",
    icon: <FaClipboardCheck />,
  },
  {
    feature: "Lifetime Value",
    icon: <FaGift />,
  },
  {
    feature: "Secure Data",
    icon: <FaShieldAlt />,
  },
  {
    feature: "Rewards & Loyalty",
    icon: <FaGem />,
  },
  {
    feature: "Unified Dashboard",
    icon: <MdDashboard />,
  },
  {
    feature: "Excellent Customer Support",
    icon: <FaHeadset />,
  },
  {
    feature: "Training Programs",
    icon: <FaHandshake />,
  },
];

export const EdgeDesign = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div id="designDat">
      <h1 style={{fontWeight:"900"}}>BanksBuddy Core Features</h1>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.67, ease: "linear" }}
        variants={fadeUp}
        className="design-data-grid"
      >
        {DesignData.map((item, index) => (
          <div key={index} className="design-data-item">
            <div className="design-icon">{item.icon}</div>
            <div className="design-feature">{item.feature}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
