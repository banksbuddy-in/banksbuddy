import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState("left");
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);

  // Detect screen size and set slides to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1); // Mobile: 1 card
        setIsMobileOrTablet(true);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 cards
        setIsMobileOrTablet(true);
      } else {
        setSlidesToShow(3); // Desktop: 3 cards
        setIsMobileOrTablet(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalAwards = awards.length;

  // Navigation functions
  const goToNext = useCallback(() => {
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % totalAwards);
    setDragOffset(0);
  }, [totalAwards]);

  const goToPrev = useCallback(() => {
    setSlideDirection("left");
    setCurrentIndex((prev) => (prev - 1 + totalAwards) % totalAwards);
    setDragOffset(0);
  }, [totalAwards]);

  // Auto-play functionality (only on mobile/tablet)
  useEffect(() => {
    if (!isAutoPlaying || !isMobileOrTablet || isDragging) return;

    const interval = setInterval(() => {
      setSlideDirection("right");
      goToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobileOrTablet, isDragging, goToNext]);

  // Get visible awards using modular arithmetic for infinite loop
  const getVisibleAwards = () => {
    if (!isMobileOrTablet) {
      return awards.map((award, idx) => ({ award, displayIndex: idx }));
    }

    const visible = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % totalAwards;
      visible.push({ award: awards[index], displayIndex: i });
    }
    return visible;
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStart);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const threshold = 50;

    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);
    setIsAutoPlaying(true);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - dragStart);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 50;

    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);
    setIsAutoPlaying(true);
  };

  const slideVariants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

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

      {/* Desktop static view */}
      {!isMobileOrTablet && (
        <div className="awards-grid">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              className="award-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              variants={slideVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
            >
              <img
                src={`aww${index + 1}.png`}
                alt={award}
                className="award-image"
              />
              <h3>{award}</h3>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mobile/Tablet carousel view */}
      {isMobileOrTablet && (
        <div
          className="awards-carousel-wrapper"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="carousel-container"
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "2rem 0",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            {/* Previous Button */}
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={goToPrev}
              aria-label="Previous awards"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(0, 123, 255, 0.9)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 123, 255, 1)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 123, 255, 0.9)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <MdNavigateBefore size={24} color="white" />
            </button>

            {/* Carousel Content */}
            <div
              style={{
                display: "flex",
                gap: slidesToShow === 1 ? "0" : "1rem",
                padding: "0 50px",
                transition: isDragging ? "none" : "transform 0.5s ease-in-out",
                transform: `translateX(${dragOffset}px)`,
                width: "100%",
              }}
            >
              {getVisibleAwards().map((item, idx) => (
                <motion.div
                  key={`${currentIndex}-${idx}`}
                  className="award-card carousel-award"
                  initial={slideDirection === "left" ? "hiddenLeft" : "hiddenRight"}
                  animate="visible"
                  variants={slideVariants}
                  transition={{
                    duration: 0.5,
                    ease: "linear",
                    delay: idx * 0.1,
                  }}
                  style={{
                    flex:
                      slidesToShow === 1
                        ? "0 0 100%"
                        : `0 0 calc(${100 / slidesToShow}% - 1rem)`,
                    cursor: "pointer",
                    minWidth: "100%",
                    width: slidesToShow === 1 ? "100%" : "auto",
                  }}
                  whileHover={{
                    scale: isDragging ? 1 : 1.05,
                  }}
                >
                  <img
                    src={`aww${awards.indexOf(item.award) + 1}.png`}
                    alt={item.award}
                    className="award-image"
                    draggable="false"
                  />
                  <h3>{item.award}</h3>
                </motion.div>
              ))}
            </div>

            {/* Next Button */}
            <button
              className="carousel-btn carousel-btn-next"
              onClick={goToNext}
              aria-label="Next awards"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(0, 123, 255, 0.9)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 123, 255, 1)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 123, 255, 0.9)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <MdNavigateNext size={24} color="white" />
            </button>
          </div>

          {/* Indicators */}
          <div className="carousel-indicators">
            {Array.from({ length: totalAwards }).map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${idx === currentIndex ? "active" : ""}`}
                onClick={() => {
                  setSlideDirection(idx > currentIndex ? "right" : "left");
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to award ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
