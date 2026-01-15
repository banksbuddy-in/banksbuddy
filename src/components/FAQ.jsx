import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./FAQ.css";

/**
 * Reusable FAQ Accordion Component
 * @param {Object} props
 * @param {Array} props.faqs - Array of FAQ objects with 'question' and 'answer' properties
 * @param {string} props.title - Optional section title (default: "Frequently Asked Questions")
 * @param {string} props.subtitle - Optional subtitle/tag above the title
 */
export const FAQ = ({ faqs = [], title = "FAQs", subtitle = "" }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          {subtitle && <span className="faq-subtitle">{subtitle}</span>}
          <h2 className="faq-title">{title}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "faq-item-active" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className={`faq-icon ${activeIndex === index ? "faq-icon-rotated" : ""}`}>
                  <FaChevronDown />
                </span>
              </button>
              <div
                className={`faq-answer-wrapper ${activeIndex === index ? "faq-answer-open" : ""}`}
              >
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
