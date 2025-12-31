import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { reviewData } from "./Data_Reviews";
import Slider from "react-slick";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

export const Reviews = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    // autoplay: true,
    // autoplaySpeed: 2000,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [reviews, setReviews] = useState([]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const reviewsRef = ref(db, "reviews");
    // eslint-disable-next-line no-unused-vars
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

  return (
    <motion.div
      id="review"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={fadeUp}
    >
      <h1 className="rehed">Testimonials</h1>
      <p className="repd">
        Our financial services empower individuals and businesses to achieve
        their dreams with expert financial solutions.
      </p>
      <div className="whitis"></div>
      <div className="revslist">
        <Slider {...settings}>
          {display.map((review, index) => (
            <div key={index} className="revcardsa">
              <div className="whitish"></div>
              <div className="msgbox">
                <div className="reli1">
                  <RiDoubleQuotesL className="qot" />
                  <RiDoubleQuotesR className="qot" />
                </div>
                <p>{review.review}</p>
                <div className="stars">
                  <span><FaStar/></span>
                  <span><FaStar/></span>
                  <span><FaStar/></span>
                  <span><FaStar/></span>
                  <span><FaStar/></span>
                </div>
              </div>
              <h1>{review.name}</h1>
            </div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
};
