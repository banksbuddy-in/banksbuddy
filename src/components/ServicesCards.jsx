import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

export const ServicesCards = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState("left");
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Detect screen size and set slides to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 cards
      } else {
        setSlidesToShow(3); // Desktop: 3 cards
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const services = [
    {
      id: 1,
      className: "div1",
      url: "/services/personal-loan",
      media: <video src="/d1.mp4" className="media" autoPlay muted loop />,
      title: "Personal Loan",
      description:
        "Flexible and hassle-free loans to meet your personal financial requirements, from unexpected expenses to dream vacations.",
    },
    {
      id: 2,
      className: "div2",
      url: "/services/business-loan",
      media: <img src="/d2.jpg" className="media" alt="Business Loan" />,
      title: "Business Loan",
      description:
        "Fuel your entrepreneurial journey with customizable business loans to support expansion, operations, or new ventures.",
    },
    {
      id: 3,
      className: "div4",
      url: "/services/education-loan",
      media: <img src="/d4.jpg" className="media" alt="Education Loan" />,
      title: "Education Loan",
      description:
        "Empowering your academic aspirations with loans to cover tuition fees, study materials, and living expenses.",
    },
    {
      id: 4,
      className: "div3",
      url: "/services/home-loan",
      media: <img src="/d6.jpg" className="media" alt="Home Loan" />,
      title: "Home Loan",
      description:
        "Affordable housing finance solutions to help you turn your dream of owning a home into reality.",
    },
    {
      id: 5,
      className: "div5",
      url: "/services/machinery-loan",
      media: <img src="/d5.jpg" className="media" alt="Machinery Loan" />,
      title: "Machinery Loan",
      description:
        "Power your business with financing for construction, industrial, and manufacturing equipment.",
    },
    {
      id: 6,
      className: "div6",
      url: "/services/auto-loan",
      media: <img src="/d5.jpg" className="media" alt="Auto Loan" />,
      title: "Auto Loan",
      description:
        "Drive your dream car or two-wheeler with quick approvals and competitive rates tailored for individuals.",
    },
    {
      id: 7,
      className: "div6",
      url: "/services/loan-against-property",
      media: (
        <img src="/d3.jpg" className="media" alt="Loan Against Property" />
      ),
      title: "Loan Against Property",
      description:
        "Unlock the value of your property to meet major financial needs at lower interest rates.",
    },
  ];

  const BuddyNavigate = (url) => {
    navigate(url);
  };

  const totalServices = services.length;

  // Modular navigation
  const goToNext = useCallback(() => {
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % totalServices);
  }, [totalServices]);

  const goToPrev = useCallback(() => {
    setSlideDirection("left");
    setCurrentIndex((prev) => (prev - 1 + totalServices) % totalServices);
  }, [totalServices]);

  const goToSlide = (index) => {
    setSlideDirection(index > currentIndex ? "left" : "right");
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setSlideDirection("left"); // Default auto-slide direction
      goToNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Get visible services using modular arithmetic for infinite loop
  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % totalServices;
      visible.push({ ...services[index], displayIndex: i });
    }
    return visible;
  };

  const slideVariants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div
      className="services-carousel-wrapper"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="carousel-container"
        style={{ position: "relative", overflow: "hidden", padding: "2rem 0" }}
      >
        {/* Previous Button */}
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={goToPrev}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(255, 69, 31, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: slidesToShow === 3 ? "50px" : "20px",
            height: slidesToShow === 3 ? "50px" : "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 69, 31, 1)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 69, 31, 0.9)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <MdNavigateBefore size={slidesToShow === 3 ? 30 : 12} color="white" />
        </button>

        {/* Carousel Content */}
        <div
          className="scont"
          style={{
            display: "flex",
            gap: slidesToShow === 3 ? "1rem" : "2rem",
            padding:
              slidesToShow === 1
                ? "0 40px"
                : slidesToShow === 2
                  ? "0 50px"
                  : "0 80px",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {getVisibleServices().map((service, idx) => (
            <motion.div
              key={`${service.id}-${currentIndex}-${idx}`}
              className={service.className}
              onClick={() => BuddyNavigate(service.url)}
              initial={slideDirection === "left" ? "hiddenLeft" : "hiddenRight"}
              animate="visible"
              variants={slideVariants}
              transition={{ duration: 0.5, ease: "linear", delay: idx * 0.1 }}
              style={{
                flex: `0 0 calc(${100 / slidesToShow}% - 1rem)`,
                cursor: "pointer",
                minWidth: "0",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              {service.media}
              <h1 style={{ whiteSpace: "normal" }}>{service.title}</h1>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <button
          className="carousel-btn carousel-btn-next"
          onClick={goToNext}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(255, 69, 31, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: slidesToShow === 3 ? "50px" : "20px",
            height: slidesToShow === 3 ? "50px" : "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 69, 31, 1)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 69, 31, 0.9)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <MdNavigateNext size={slidesToShow === 3 ? 30 : 12} color="white" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div
        className="carousel-dots"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "1.5rem",
          padding: "0 1rem",
        }}
      >
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: currentIndex === index ? "30px" : "10px",
              height: "10px",
              borderRadius: "5px",
              border: "none",
              background: currentIndex === index ? "#ff451f" : "#ccc",
              cursor: "pointer",
              transition: "all 0.3s ease",
              opacity: currentIndex === index ? 1 : 0.5,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
