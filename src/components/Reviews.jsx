import React, { useEffect, useState, useRef, useCallback } from "react";
import { reviewData } from "./Data_Reviews";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";
import { FaStar } from "react-icons/fa";
import "./r.css";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const intervalRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const reviewsRef = ref(db, "reviews");
    const unsub = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setReviews([]);
        return;
      }
      const mapped = Object.values(data).map((item) => ({
        name: item.name || item.title || "Anonymous",
        review: item.review || item.message || "",
        createdAt: item.createdAt || "",
      }));
      setReviews(mapped);
    });

    return () => off(reviewsRef);
  }, []);

  const display = reviews.length ? reviews : reviewData;
  const totalCards = display.length;

  // Create extended array: [clone of last few] + [original] + [clone of first few]
  // This allows smooth infinite scrolling
  const getExtendedCards = useCallback(() => {
    if (totalCards === 0) return [];
    const cloneCount = cardsPerView;
    const lastCards = display.slice(-cloneCount); // Last N cards for start
    const firstCards = display.slice(0, cloneCount); // First N cards for end
    return [...lastCards, ...display, ...firstCards];
  }, [display, cardsPerView, totalCards]);

  const extendedCards = getExtendedCards();
  const cloneOffset = cardsPerView; // Offset to skip the cloned cards at start

  // Always show 1 card per view in this section
  useEffect(() => {
    setCardsPerView(1);
  }, []);

  // Handle infinite loop jump
  useEffect(() => {
    if (!enableTransition) {
      // Re-enable transition after instant jump
      const timer = setTimeout(() => {
        setEnableTransition(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [enableTransition]);

  const handleTransitionEnd = useCallback(() => {
    // If we've scrolled past the end, jump to the real start
    if (currentIndex >= totalCards) {
      setEnableTransition(false);
      setCurrentIndex(0);
    }
    // If we've scrolled before the start, jump to the real end
    if (currentIndex < 0) {
      setEnableTransition(false);
      setCurrentIndex(totalCards - 1);
    }
  }, [currentIndex, totalCards]);

  const nextSlide = useCallback(() => {
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToSlide = (index) => {
    setEnableTransition(true);
    setCurrentIndex(index);
  };

  // Get current dot index (normalized)
  const getCurrentDotIndex = () => {
    const normalized = ((currentIndex % totalCards) + totalCards) % totalCards;
    return normalized;
  };

  // Auto-slide every 2 seconds
  useEffect(() => {
    if (!isDragging) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide, isDragging]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }
    setDragOffset(0);
  };

  // Calculate the transform position
  // Each card takes (100 / cardsPerView)% of the viewport
  const cardWidthPercent = 100 / cardsPerView;
  const translateX = -((currentIndex + cloneOffset) * cardWidthPercent);

  return (
    <section id="review">
      <div className="reviews-container">
        <div className="reviews-header">
          <span className="reviews-badge">Testimonials</span>
          <h2 className="reviews-title shead">What Our Clients Say</h2>
          <p className="reviews-subtitle">
            Trusted by thousands of individuals and businesses across India
          </p>
        </div>

        <div className="crdsss">
          <video className="crdsvid" src="rvc1.mp4" autoPlay loop muted playsInline />
          <div className="crds">
            <div className="reviews-carousel-viewport">
              <div
                ref={trackRef}
                className="reviews-carousel-track"
                style={{
                  transform: `translateX(calc(${translateX}% + ${dragOffset}px))`,
                  transition:
                    enableTransition && !isDragging
                      ? "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)"
                      : "none",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onTransitionEnd={handleTransitionEnd}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {extendedCards.map((card, idx) => (
                  <div
                    key={`card-${idx}`}
                    className="review-mini-card"
                    style={{
                      userSelect: "none",
                      flex: `0 0 100%`,
                    }}
                  >
                    <div className="mini-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="mini-text">
                      "{card.review.substring(0, 150)}..."
                    </p>
                    <span className="mini-author">— {card.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reviews-dots">
              {Array.from({ length: totalCards }).map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    index === getCurrentDotIndex() ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
