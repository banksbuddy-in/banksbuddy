import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { Insur } from './Data_Special';
import './services.css';

export const SpecInsur = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState('left');
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Extract subsections from Insur data
  const insuranceCategories = Insur[0]?.subsections || [];

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
        setSlidesToShow(3); // Desktop: 3 cards (static)
        setIsMobileOrTablet(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalServices = insuranceCategories.length;

  // Modular navigation
  const goToNext = useCallback(() => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 1) % totalServices);
  }, [totalServices]);

  const goToPrev = useCallback(() => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 1 + totalServices) % totalServices);
  }, [totalServices]);

  const goToSlide = (index) => {
    setSlideDirection(index > currentIndex ? 'left' : 'right');
    setCurrentIndex(index);
  };

  // Auto-play functionality (only on mobile/tablet)
  useEffect(() => {
    if (!isAutoPlaying || !isMobileOrTablet) return;

    const interval = setInterval(() => {
      setSlideDirection('left');
      goToNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobileOrTablet, goToNext]);

  // Get visible services using modular arithmetic for infinite loop
  const getVisibleServices = () => {
    if (!isMobileOrTablet) {
      return insuranceCategories; // Show all on desktop
    }
    
    const visible = [];
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % totalServices;
      visible.push({ ...insuranceCategories[index], displayIndex: i });
    }
    return visible;
  };

  const slideVariants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 }
  };

  const handleCardClick = (url) => {
    navigate(url);
  };

  return (
    <>
      {/* Desktop static view */}
      {!isMobileOrTablet && (
        <div className="services-list spec" >
          {insuranceCategories.map((category, index) => (
            <div 
              key={index} 
              className="service-card spec" style={{justifyContent:"start",gap:".75em"}}
              onClick={() => handleCardClick(`/insurance/${category.id.replace(/_/g, '-')}`)}
            >
              <div className="service-icon">{category.icon}</div>
              <div className="service-title">{category.title}</div>
              <div className="service-overview">{category.overview}</div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile/Tablet carousel view */}
      {isMobileOrTablet && (
    <div 
      className="spec-services-carousel-wrapper" 
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="carousel-container" style={{ position: 'relative', overflow: 'hidden', padding: '2rem 0' }}>
        
        {/* Previous Button */}
        <button 
          className="carousel-btn carousel-btn-prev"
          onClick={goToPrev}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255, 69, 31, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: slidesToShow === 2 ? '20px' : '20px',
            height: slidesToShow === 2 ? '20px' : '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 69, 31, 1)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 69, 31, 0.9)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <MdNavigateBefore size={12} color="white" />
        </button>

        {/* Carousel Content */}
        <div style={{ 
          display: 'flex', 
          gap: slidesToShow === 1 ? '0' : '1rem',
          padding: slidesToShow === 1 ? '0 50px' : '0 50px',
          transition: 'transform 0.5s ease-in-out',
          width: '100%'
        }}>
          {getVisibleServices().map((category, idx) => (
            <motion.div
              key={`${category.id}-${currentIndex}-${idx}`}
              className="service-card spec"
              onClick={() => handleCardClick(`/insurance/${category.id.replace(/_/g, '-')}`)}
              initial={slideDirection === 'left' ? 'hiddenLeft' : 'hiddenRight'}
              animate="visible"
              variants={slideVariants}
              transition={{ duration: 0.5, ease: "linear", delay: idx * 0.1 }}
              style={{ 
                flex: slidesToShow === 1 ? '0 0 100%' : `0 0 calc(${100 / slidesToShow}% - 1rem)`,
                cursor: 'pointer',
                minWidth: '100%',
                width: slidesToShow === 1 ? '100%' : 'auto',
                gap: '.75em'
              }}
            >
              <div className="service-icon">{category.icon}</div>
              <div className="service-title" style={{ whiteSpace: 'normal', textAlign: 'center' }}>{category.title}</div>
              <div className="service-overview" style={{ textAlign: 'center' }}>{category.overview}</div>
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <button 
          className="carousel-btn carousel-btn-next"
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255, 69, 31, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: slidesToShow === 2 ? '20px' : '20px',
            height: slidesToShow === 2 ? '20px' : '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 69, 31, 1)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 69, 31, 0.9)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <MdNavigateNext size={12} color="white" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="carousel-dots" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '1.5rem',
        padding: '0 1rem'
      }}>
        {insuranceCategories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: currentIndex === index ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              border: 'none',
              background: currentIndex === index ? '#ff451f' : '#ccc',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: currentIndex === index ? 1 : 0.5
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
        </div>
      )}
    </>
  );
}
