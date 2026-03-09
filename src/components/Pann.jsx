import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Pann = () => {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div id="panindia">
      <div className="pntxt">
        <h1>Banks Buddy</h1>
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
