import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { reviewData } from "./Data_Reviews";
import Slider from "react-slick";
import { db } from '../firebase'
import { ref, onValue, off } from 'firebase/database'


export const Reviews = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const reviewsRef = ref(db, 'reviews')
    // eslint-disable-next-line no-unused-vars
    const unsub = onValue(reviewsRef, snapshot => {
      const data = snapshot.val()
      if (!data) {
        setReviews([])
        return
      }
      const mapped = Object.values(data).map(item => ({
        name: item.name || item.title || 'Anonymous',
        review: item.review || item.message || '',
        createdAt: item.createdAt || ''
      }))
      setReviews(mapped)
    })

    return () => off(reviewsRef)
  }, [])

  const display = reviews.length ? reviews : reviewData

  return (
    <div id="review">
      <h1 className="rehed">Reviews & Testimonials</h1>
      <p className="repd">
        Our financial services empower individuals and businesses to achieve
        their dreams with expert financial solutions.
      </p>
      <div className="revslist">
        <Slider {...settings}>
          {display.map((review, index) => (
            <div key={index} className="revcardsa">
              <p>{review.review}</p>
              <h1>{review.name}</h1>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
};
