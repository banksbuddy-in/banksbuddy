import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./awards.css";

export const Awards = () => {
  const awards = [
    "FROM SMFG India Credit",
    "FROM IDFC FIRST BANK",
    "FROM FEDERAL BANK",
    "FROM HERO FIN CORP",
    "FROM HDFC 2022",
    "FROM PAYSENSE",
    "FROM HDFC BANK 21-22",
    "FROM HDFC BANK",
    "FROM PNB HOUSING",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  // Auto-slide every 2 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % awards.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused, awards.length]);

  // Triple awards for seamless infinite scroll
  const extendedAwards = [...awards, ...awards, ...awards];

  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Calculate transform - card width (140px) + gap (24px) = 164px per card
  const cardWidth = 164;
  const translateX = -(currentIndex * cardWidth);

  return (
    <div id="awards">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={slideVariants}
      >
        Our Awards
      </motion.h1>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        variants={slideVariants}
        className="awards-subtitle"
      >
        Recognized and trusted by leading financial institutions
      </motion.p>

      {/* Step-based Auto-scroll Carousel */}
      <div 
        className="awards-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="awards-track"
          ref={trackRef}
          style={{ 
            transform: `translateX(${translateX}px)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {extendedAwards.map((award, index) => (
            <div key={`award-${index}`} className="award-item">
              <img
                src={`aww${(index % awards.length) + 1}.png`}
                alt={award}
                className="award-img"
                draggable="false"
              />
              <span className="award-title">{award}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
