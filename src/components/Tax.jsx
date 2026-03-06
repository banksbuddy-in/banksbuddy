import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaCalculator,
  FaMoneyBillWave,
  FaChartLine,
  FaFileAlt,
  FaBalanceScale,
  FaClipboardCheck,
  FaBell,
  FaUserTie,
  FaHandshake,
  FaLightbulb,
  FaPhoneAlt,
  FaComments,
  FaCreditCard,
  FaLock,
  FaUserCheck,
  FaTimesCircle,
  FaCheckCircle,
  FaWhatsapp,
} from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import "./Tax.css";
import { FAQ } from "./FAQ";
import { taxFAQs } from "./Data_FAQs";

// Tax Services Data
const taxServices = [
  {
    icon: <FaCalculator />,
    title: "Advance Tax Planning & Calculation",
    description: "Stay prepared with accurate tax projections",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Salary Income Tax Optimization",
    description: "Maximize exemptions and deductions",
  },
  {
    icon: <FaChartLine />,
    title: "Capital Gains Tax Advisory",
    description: "Efficient planning for equity, property, and assets",
  },
  {
    icon: <FaFileAlt />,
    title: "Income Tax Notice Assistance",
    description: "Professional representation and resolution",
  },
  {
    icon: <FaClipboardCheck />,
    title: "ITR Filing (All Categories)",
    description: "Individuals, freelancers, and businesses",
  },
  {
    icon: <FaBalanceScale />,
    title: "Old vs New Tax Regime Advisory",
    description: "Choose the most beneficial option",
  },
  {
    icon: <FaBell />,
    title: "Tax Compliance Monitoring",
    description: "Never miss deadlines or filings",
  },
  {
    icon: <FaLightbulb />,
    title: "Regulatory Updates & Advisory",
    description: "Stay compliant with latest tax laws",
  },
];

// How It Works Steps
const processSteps = [
  {
    icon: <FaPhoneAlt />,
    step: "1",
    title: "Book a Consultation Call",
    description: "Connect with a qualified tax expert",
  },
  {
    icon: <FaComments />,
    step: "2",
    title: "Discuss Your Tax Query",
    description: "We understand your financial situation",
  },
  {
    icon: <FaCreditCard />,
    step: "3",
    title: "Transparent Pricing",
    description: "Know the cost upfront",
  },
  {
    icon: <FaLock />,
    step: "4",
    title: "Secure Payment",
    description: "Easy and safe payment options",
  },
  {
    icon: <FaUserCheck />,
    step: "5",
    title: "Personalized Tax Consultation",
    description: "Actionable advice tailored to you",
  },
];

// Say NO / YES Lists
const sayNoList = [
  "Tax miscalculations",
  "Filing errors",
  "Confusing tax rules",
  "Income tax notices",
  "Penalties and interest",
  "Repeated CA visits",
  "Compliance stress",
];

const sayYesList = [
  "Personalized tax strategies",
  "End-to-end tax solutions",
  "Experienced tax professionals",
  "Legal tax savings",
  "Accurate compliance",
  "Complete peace of mind",
];

// Counter Component for Stats
const TaxCounters = () => {
  const [counts, setCounts] = useState({
    advisors: 0,
    clients: 0,
    filings: 0,
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
      advisors: 50,
      clients: 5000,
      filings: 15000,
    };

    const duration = 1200;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        advisors: Math.floor(targets.advisors * progress),
        clients: Math.floor(targets.clients * progress),
        filings: Math.floor(targets.filings * progress),
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, interval);
  };

  return (
    <div className="tax-counters" ref={counterRef}>
      <div className="tax-counter-card">
        <div className="tax-counter-icon">
          <FaUserTie />
        </div>
        <div className="tax-counter-content">
          <h3 className="tax-counter-number">{counts.advisors}+</h3>
          <p className="tax-counter-label">Expert Tax Consultants</p>
        </div>
      </div>

      <div className="tax-counter-card">
        <div className="tax-counter-icon">
          <FaHandshake />
        </div>
        <div className="tax-counter-content">
          <h3 className="tax-counter-number">{counts.clients.toLocaleString()}+</h3>
          <p className="tax-counter-label">Happy Clients</p>
        </div>
      </div>

      <div className="tax-counter-card">
        <div className="tax-counter-icon">
          <FaClipboardCheck />
        </div>
        <div className="tax-counter-content">
          <h3 className="tax-counter-number">{counts.filings.toLocaleString()}+</h3>
          <p className="tax-counter-label">ITRs Filed</p>
        </div>
      </div>
    </div>
  );
};

export const Tax = () => {
  return (
    <div id="tax">
      {/* Hero Section */}
      <section className="tax-hero">
        <div className="tax-hero-content">
          <h1>Tax Consultancy & Advisory Services</h1>
          <p className="tax-hero-tagline">
            Expert Guidance for Smart, Compliant, and Stress-Free Taxation
          </p>
          <p className="tax-hero-description">
            From proactive tax planning and accurate filing to notice handling
            and long-term tax optimization, our experienced tax consultants
            support you at every step of your financial journey.
          </p>
          <div className="tax-hero-buttons">
            <Link to="/contact-banksbuddy" className="tax-btn-primary">
              Apply Now <GoArrowRight />
            </Link>
            <a
              href="https://wa.me/+916377956633?text=I%20am%20interested%20in%20Tax%20Consultancy%20services%20offered%20by%20BanksBuddy."
              target="_blank"
              rel="noopener noreferrer"
              className="tax-btn-whatsapp"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="tax-stats-section">
        <TaxCounters />
      </section>

      {/* Services Section */}
      <section className="tax-services-section">
        <div className="tax-section-header">
          <span className="tax-section-tag">Plan Your Taxes the Right Way</span>
          <h2>Our Tax Consultancy Services</h2>
        </div>
        <div className="tax-services-grid">
          {taxServices.map((service, index) => (
            <div key={index} className="tax-service-card">
              <div className="tax-service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="tax-process-section">
        <div className="tax-section-header">
          <h2>How Our Tax Consultancy Works</h2>
        </div>
        <div className="tax-process-grid">
          {processSteps.map((step, index) => (
            <div key={index} className="tax-process-card">
              <div className="tax-process-step">{step.step}</div>
              <div className="tax-process-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="tax-why-section">
        <div className="tax-section-header">
          <h2>Why Choose Our Tax Consultants?</h2>
        </div>
        <div className="tax-why-grid">
          {/* Say NO Card */}
          <div className="tax-why-card tax-why-no">
            <div className="tax-why-header">
              <FaTimesCircle className="tax-why-icon-no" />
              <h3>
                Say <span className="tax-highlight-no">NO</span> to:
              </h3>
            </div>
            <ul className="tax-why-list">
              {sayNoList.map((item, index) => (
                <li key={index}>
                  <FaTimesCircle className="tax-list-icon-no" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Say YES Card */}
          <div className="tax-why-card tax-why-yes">
            <div className="tax-why-header">
              <FaCheckCircle className="tax-why-icon-yes" />
              <h3>
                Say <span className="tax-highlight-yes">YES</span> to:
              </h3>
            </div>
            <ul className="tax-why-list">
              {sayYesList.map((item, index) => (
                <li key={index}>
                  <FaCheckCircle className="tax-list-icon-yes" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="tax-cta-section">
        <div className="tax-cta-content">
          <h2>Get Expert Tax Advice Today</h2>
          <p>
            Take control of your finances with personalized tax solutions from
            industry experts.
          </p>
          <Link to="/contact-banksbuddy" className="tax-cta-btn">
            Book Your Consultation Now <GoArrowRight />
          </Link>
        </div>
        <div className="tax-cta-image">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&auto=format&fit=crop&q=80"
            alt="Tax Consultation"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ 
        faqs={taxFAQs} 
        title="Tax Consultancy - Frequently Asked Questions"
        subtitle="Got Questions?"
      />
    </div>
  );
};
