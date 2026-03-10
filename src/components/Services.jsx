import React from "react";
import { ServicesCards } from "./ServicesCards";
import { specSv, cibilSv } from "./Data_Special";
import { useNavigate } from "react-router-dom";
import { SpecInsur } from "./SpecInsur";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Cards } from "./Cards";

export const Services = () => {
  const navigate = useNavigate();
  const hanService = (e) => {
    navigate(e);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div id="Services">
      <motion.h1
        className="shead"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        Loan Services <br />{" "}
        <span>
          Catering your needs with tailored products for financial
          actualization.
        </span>
      </motion.h1>
      {/* <ServicesCards /> */}
      <Cards />
      <motion.h1
        className="shead"
        style={{ marginTop: "5%" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        Insurance Services
        <span>
          Comprehensive insurance solutions to protect what matters most to you.
        </span>
      </motion.h1>
      <SpecInsur />

      <motion.h1
        className="shead"
        style={{ marginTop: "5%" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        CIBIL Improvement
        <span>
          Rebuild your credit score and unlock better financial opportunities.
        </span>
      </motion.h1>
      <div className="services-list">
        <motion.div
          className="service-card spec"
          onClick={() => hanService(cibilSv.URL)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
          style={{
            padding: "4% 1.5%",
            margin: "0 4%",
          }}
        >
          <img src={cibilSv.smg} alt={cibilSv.title} />
          <div className="service-title">{cibilSv.title}</div>
          <div
            style={{
              padding: "0 1%",
            }}
            className="service-overview"
          >
            {cibilSv.overview}
          </div>
        </motion.div>
      </div>

      <motion.h1
        className="shead"
        style={{ marginTop: "5%" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        Other Services
        <span>
          We offer our core financial services tailored to your needs. Secure
          and reliable solutions for your financial growth.
        </span>
      </motion.h1>
      <div className="services-list">
        {specSv.map((s, index) => (
          <motion.div
            key={index}
            className="service-card spec"
            onClick={() => {
              hanService(s.URL);
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            variants={fadeUp}
            style={{ padding: "5%" }}
          >
            <img src={s.smg} alt={s.title} />
            <div className="service-title">{s.title}</div>
            <div className="service-overview">{s.overview}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * client:815  GET http://localhost:5173/src/components/ServicesCards.jsx?t=1767158162060 net::ERR_ABORTED 500 (Internal Server Error)
importUpdatedModule @ client:815
fetchUpdate @ client:210
queueUpdate @ client:189
(anonymous) @ client:839
handleMessage @ client:838
await in handleMessage
(anonymous) @ client:458
dequeue @ client:480
(anonymous) @ client:472
enqueue @ client:466
(anonymous) @ client:458
onMessage @ client:305
(anonymous) @ client:413Understand this error
installHook.js:1 [vite] Failed to reload /src/components/ServicesCards.jsx. This could be due to syntax errors or importing non-existent modules. (see errors above)
 */
