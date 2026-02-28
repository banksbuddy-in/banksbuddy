import Marquee from "react-fast-marquee";
import React from "react";
import { MdArrowOutward, MdWhatsapp } from "react-icons/md";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Services } from "./Services";
import { HeroEMI } from "./HeroEMI";
import { Reviews } from "./Reviews";
import { Counters } from "./Counters";
import { EdgeDesign } from "./EdgeDesign";
import { NewsnOffers } from "./NewsnOffers";

export const Hero = () => {
  const images = Array.from({ length: 10 }, (_, i) => `b${i + 1}.webp`);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const ShortAbout = () => {
    return (
      <motion.div
        className="shortAbt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        variants={fadeUp}
      >
        <video
          src="/shortabt.mp4"
          autoPlay
          muted
          loop
          className="abtl"
          alt="shortabout"
        />
        {/* <img src="/shortabt.jpg" alt="shortabout" className="abtl" /> */}
        <div className="abtr">
          <h1>
            About <span style={{ color: "#ff451f" }}>Us</span>
          </h1>
          <p className="hdes">Your trusted partner in loans</p>
          <p className="abtdes">
            BanksBuddy Finance is committed to uplifting small, micro, and
            medium enterprises that often struggle to secure financial support
            due to market constraints. Our platform is designed to provide
            accessible personal and business loans, ensuring that entrepreneurs
            at the grassroots level receive the assistance they need to thrive.
            By empowering these businesses, we contribute to strengthening the
            foundation of the economy and driving sustainable growth for a
            better tomorrow.
          </p>
          <div className="btnnss">
            <Link className="abtsn" to="/about-us">
              Know More <MdArrowOutward />
            </Link>
            <Link to="/services" className="abtsnaa">
              Services
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };
  return (
    <div id="Hero">
      <div className="herocont">
        <motion.div
          className="lhr"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          variants={fadeUp}
        >
          <h4 className="hr">BanksBuddy your financial partner</h4>
          <h1>
            Banks<span>Buddy</span>
          </h1>
          <p className="hdes">The fastest way to reach your dreams</p>
          <p className="pdes">
            BanksBuddy provides customized loans and funding solutions to
            individuals and businesses, helping them grow and succeed.
          </p>
          <div className="btnss">
            <Link className="hrca" to="/consultation">
              Book a Consultation
            </Link>
            <a className="hrc" href="https://wa.me/+917723926058">
              <span>
                <MdWhatsapp />
              </span>{" "}
              WhatsApp
            </a>
          </div>
        </motion.div>
        <motion.div
          className="rhr"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut", delay:0 }}
          variants={fadeUp}
        >
          <img className="rhrimg" src="heroman.png" alt="Hero Image" />
        </motion.div>
      </div>
      <div className="marquee-container">
        <Marquee className="Maq">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`b${index + 1}`}
              className="marquee-image"
            />
          ))}
        </Marquee>
      </div>
      <ShortAbout />
      <Counters />
      <EdgeDesign />
      <Services />
      {/* <HeroEMI /> */}
      <Reviews />
      <NewsnOffers />
    </div>
  );
};
