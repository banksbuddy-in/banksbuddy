import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Data = [
  { name: "Ahmedabad", img: "/pan/ahmedabad.png" },
  { name: "Bangalore", img: "/pan/bangalore.png" },
  { name: "Chennai", img: "/pan/chennai.png" },
  { name: "Delhi", img: "/pan/delhi.png" },
  { name: "Hyderabad", img: "/pan/hyderabad.png" },
  { name: "Jaipur", img: "/pan/jaipur.png" },
  { name: "Mumbai", img: "/pan/mumbai.png" },
  { name: "Pune", img: "/pan/pune.png" },
];

export const Pann = () => {
  const [slidesToShow, setSlidesToShow] = useState(7);
  const [slidesToScroll, setSlidesToScroll] = useState(2);
  const [showArrows, setShowArrows] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setSlidesToShow(3);
        setSlidesToScroll(1);
        setShowArrows(false);
      } else if (width <= 768) {
        setSlidesToShow(4);
        setSlidesToScroll(2);
        setShowArrows(false);
      } else if (width <= 1024) {
        setSlidesToShow(5);
        setSlidesToScroll(2);
        setShowArrows(true);
      } else {
        setSlidesToShow(7);
        setSlidesToScroll(2);
        setShowArrows(true);
      }
    };

    handleResize(); // Set initial layout
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    arrows: showArrows,
  };

  return (
    <div id="panindia">
      <div className="pntxt">
        <h1>BanksBuddy</h1>
        <p>We are available throughout the Pan India</p>
      </div>
      <div className="pancarousel-container">
        <Slider {...settings}>
          {Data.map((item, index) => (
            <div key={index} className="pan-slide-wrapper">
              <div className="pan">
                <img src={item.img} alt={item.name} />
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
