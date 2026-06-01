import React, { useState, useEffect } from "react";
import "./NewsnOffers.css";
import apiFetch from "../lib/api.js";

const truncateText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};

const NewsnOffersDesktop = ({ news, offers, loading, offersLoading }) => (
  <div id="NewsnOffers">
    <h1 
    style={{
      textAlign:"center",
      fontSize:"2em"
    }}
    className="sp-section-title">News and Offers</h1>
    <div className="nnf">
      <div className="news">
        <h2 style={{ fontWeight: "900", margin: "3%", color: "var(--bl)" }}>
          Latest Financial News
        </h2>
        {loading ? (
          <p>Loading news...</p>
        ) : news.length === 0 ? (
          <p className="no-offers">No news available at the moment</p>
        ) : (
          <div className="news-grid">
            {news.map((article, index) => (
              <div key={index} className="news-card">
                <img
                  src={
                    article.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={article.title}
                  className="news-image"
                />
                <div className="news-content">
                  <h3 className="news-title">
                    {truncateText(article.title, 8)}
                  </h3>
                  <p className="news-desc">
                    {truncateText(article.description, 7)}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="offers">
        <h2 style={{ fontWeight: "900", margin: "3%", color: "var(--bl)" }}>
          Special Offers
        </h2>
        {offersLoading ? (
          <p>Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="no-offers">No offers available at the moment</p>
        ) : (
          <div className="offers-container">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="offer-image"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Reusable structured carousel (similar behavior to Reviews)
const MobileCarousel = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  useEffect(() => {
    setCardsPerView(1);
  }, []);

  const totalCards = items.length;
  const cloneCount = cardsPerView;
  const extendedCards = totalCards
    ? [...items.slice(-cloneCount), ...items, ...items.slice(0, cloneCount)]
    : [];
  const cloneOffset = cardsPerView;

  useEffect(() => {
    if (!enableTransition) {
      const t = setTimeout(() => setEnableTransition(true), 50);
      return () => clearTimeout(t);
    }
  }, [enableTransition]);

  const handleTransitionEnd = () => {
    if (currentIndex >= totalCards) {
      setEnableTransition(false);
      setCurrentIndex(0);
    }
    if (currentIndex < 0) {
      setEnableTransition(false);
      setCurrentIndex(totalCards - 1);
    }
  };

  const nextSlide = () => {
    setEnableTransition(true);
    setCurrentIndex((p) => p + 1);
  };
  const prevSlide = () => {
    setEnableTransition(true);
    setCurrentIndex((p) => p - 1);
  };
  const goToSlide = (i) => {
    setEnableTransition(true);
    setCurrentIndex(i);
  };

  const getCurrentDotIndex = () => {
    if (!totalCards) return 0;
    const n = ((currentIndex % totalCards) + totalCards) % totalCards;
    return n;
  };

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
    setDragOffset(clientX - dragStartX);
  };
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (dragOffset > threshold) prevSlide();
    else if (dragOffset < -threshold) nextSlide();
    setDragOffset(0);
  };

  const cardWidthPercent = 100 / cardsPerView;
  const translateX = -((currentIndex + cloneOffset) * cardWidthPercent);

  return (
    <div>
      <div className="no-carousel-viewport">
        <div
          className="no-carousel-track"
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
          {extendedCards.map((item, idx) => (
            <div key={`mob-${idx}`} style={{ flex: "0 0 100%" }}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
      <div className="no-dots">
        {Array.from({ length: totalCards }).map((_, i) => (
          <button
            key={`dot-${i}`}
            className={`dot ${i === getCurrentDotIndex() ? "active" : ""}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const NewsnOffersMobile = ({ news, offers, loading, offersLoading }) => (
  <div id="NewsnOffers" className="mobile">
    <h1 className="sp-section-title"
    style={{
      textAlign:"center",
      fontSize:"1.67em"
    }}
    >News and Offers</h1>
    <div className="nnf mobile-col">
      <div className="news">
        <h2 style={{ fontWeight: "900", margin: "3%", color: "var(--bl)" }}>
          Latest Financial News
        </h2>
        {loading ? (
          <p>Loading news...</p>
        ) : news.length === 0 ? (
          <p className="no-offers">No news available at the moment</p>
        ) : (
          <MobileCarousel
            items={news}
            renderItem={(article) => (
              <div className="news-card">
                <img
                  src={
                    article.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={article.title}
                  className="news-image"
                />
                <div className="news-content">
                  <h3 className="news-title">
                    {truncateText(article.title, 12)}
                  </h3>
                  <p className="news-desc">
                    {truncateText(article.description, 18)}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            )}
          />
        )}
      </div>
      <div className="offers">
        <h2 style={{ fontWeight: "900", margin: "3%", color: "var(--bl)" }}>
          Special Offers
        </h2>
        {offersLoading ? (
          <p>Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="no-offers">No offers available at the moment</p>
        ) : (
          <MobileCarousel
            items={offers}
            renderItem={(offer) => (
              <div className="offer-card">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="offer-image"
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  </div>
);

export const NewsnOffers = () => {
  const [news, setNews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetchFinancialNews();
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const data = await apiFetch("/api/offers");
      setOffers(data || []);
      setOffersLoading(false);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffersLoading(false);
    }
  };

  const fetchFinancialNews = async () => {
    try {
      console.log("NewsnOffers: Fetching financial news from /api/news...");
      const data = await apiFetch("/api/news");
      console.log("NewsnOffers: Received news response:", data);
      if (data && data.articles) {
        console.log("NewsnOffers: Setting news articles:", data.articles);
        setNews(data.articles);
      } else {
        console.warn("NewsnOffers: Received empty or invalid articles field:", data);
        setNews([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("NewsnOffers: Error fetching news:", error);
      setNews([]);
      setLoading(false);
    }
  };

  const isMobileOrTablet = width <= 1024;

  return isMobileOrTablet ? (
    <NewsnOffersMobile
      news={news}
      offers={offers}
      loading={loading}
      offersLoading={offersLoading}
    />
  ) : (
    <NewsnOffersDesktop
      news={news}
      offers={offers}
      loading={loading}
      offersLoading={offersLoading}
    />
  );
};
