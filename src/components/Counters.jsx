import React, { useState, useEffect, useRef } from 'react';
import { FaUserTie, FaHandshake, FaLightbulb } from 'react-icons/fa';
import './Counters.css';

export const Counters = () => {
  const [counts, setCounts] = useState({
    advisors: 0,
    partners: 0,
    insights: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const targets = {
      advisors: 100,
      partners: 250,
      insights: 2000,
    };

    const duration = 1000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        advisors: Math.floor(targets.advisors * progress),
        partners: Math.floor(targets.partners * progress),
        insights: Math.floor(targets.insights * progress),
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, interval);
  };

  return (
    <div className="counters-section" ref={counterRef}>
      <h2 className="counters-title">Our Impact</h2>
      <div className="counters-container">
        <div className="counter-card">
          <div className="counter-icon">
            <FaUserTie />
          </div>
          <div className="counter-content">
            <h3 className="counter-number">{counts.advisors}+</h3>
            <p className="counter-label">Financial Advisors</p>
          </div>
        </div>

        <div className="counter-card">
          <div className="counter-icon">
            <FaHandshake />
          </div>
          <div className="counter-content">
            <h3 className="counter-number">{counts.partners}+</h3>
            <p className="counter-label">Lending Partners</p>
          </div>
        </div>

        <div className="counter-card">
          <div className="counter-icon">
            <FaLightbulb />
          </div>
          <div className="counter-content">
            <h3 className="counter-number">{counts.insights}+</h3>
            <p className="counter-label">Insights Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};
