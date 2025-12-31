import React, { useState, useEffect } from 'react'
import './NewsnOffers.css'
import { db } from '../firebase'
import { ref, get } from 'firebase/database'

export const NewsnOffers = () => {
  const [news, setNews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);

  useEffect(() => {
    fetchFinancialNews();
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const offersRef = ref(db, 'offers');
      const snapshot = await get(offersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const offersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setOffers(offersArray);
      }
      setOffersLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffersLoading(false);
    }
  };

  const fetchFinancialNews = async () => {
    try {
      // Using GNews API - Get your free API key from https://gnews.io/
      const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=finance OR banking OR investment OR stock market&country=in&lang=en&max=4&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.articles) {
        setNews(data.articles);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit 
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  return (
   <div id="NewsnOffers">
    <h1 className="shead">News and Offers</h1>
    <div className="nnf">
        <div className="news">
          <h2 style={{fontWeight:"900", margin:"3%",color:"var(--bl)"}}>Latest Financial News</h2>
          {loading ? (
            <p>Loading news...</p>
          ) : (
            <div className="news-grid">
              {news.map((article, index) => (
                <div key={index} className="news-card">
                  <img 
                    src={article.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={article.title}
                    className="news-image"
                  />
                  <div className="news-content">
                    <h3 className="news-title">{truncateText(article.title, 8)}</h3>
                    <p className="news-desc">{truncateText(article.description, 7)}</p>
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
          <h2 style={{fontWeight:"900", margin:"3%",color:"var(--bl)"}}>Special Offers</h2>
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
  )
}
