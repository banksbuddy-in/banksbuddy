import Marquee from "react-fast-marquee";
import React from "react";
import { MdArrowOutward, MdWhatsapp } from "react-icons/md";
import { Link } from "react-router-dom";

export const Hero = () => {
  const images = Array.from({ length: 10 }, (_, i) => `b${i + 1}.webp`);
  const ShortAbout = () => {
    return (
      <div className="shortAbt">
        <video
          src="/shortabt.mp4"
          autoPlay
          muted
          loop
          className="abtl"
          alt="shortabout"
        />
        {/* <img src="/shortabt.jpg" alt="shortabout" className="abtl" /> */}
        <div className="abtr">
          <h1>ABOUT <span style={{color:"#ff451f"}}>US</span></h1>
          <p className="hdes">Your trusted partner in loans</p>
          <p className="abtdes">
            Banksbuddy Finance is committed to uplifting small, micro, and
            medium enterprises that often struggle to secure financial support
            due to market constraints. Our platform is designed to provide
            accessible personal and business loans, ensuring that entrepreneurs
            at the grassroots level receive the assistance they need to thrive.
            By empowering these businesses, we contribute to strengthening the
            foundation of the economy and driving sustainable growth for a
            better tomorrow.
          </p>
          <div className="btnnss">
            <Link className="abtsn" to="/about-us">
              Know More <MdArrowOutward />
            </Link>
            <Link to="/services" className="abtsnaa">Services</Link>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div id="Hero">
      <div className="herocont">
        <div className="lhr">
          <h4 className="hr">BanksBuddy your financial partner</h4>
          <h1>
            Banks<span>Buddy</span>
          </h1>
          <p className="hdes">The fastest way to reach your dreams</p>
          <p className="pdes">
            BanksBuddy provides customized loans and funding solutions to
            individuals and businesses, helping them grow and succeed.
          </p>
          <div className="btnss">
            <a
              className="hrca"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=Inquiry%20Regarding%20Loan%20Support&body=Hi%20BanksBuddy%20Team%2C%0A%0AI%20am%20interested%20in%20your%20financial%20services.%0A%0AMy%20Details%3A%0AName%3A%20%0APhone%20Number%3A%20%0AType%20of%20Loan%20Needed%20(Personal%2FBusiness)%3A%20%0A%0APlease%20guide%20me%20through%20the%20process.%0A%0AThanks!"
            >
              Connect with us
            </a>
            <a className="hrc" href="https://wa.me/+917723926058">
              <span>
                <MdWhatsapp />
              </span>{" "}
              WhatsApp
            </a>
          </div>
        </div>
        <div className="rhr">
          <img className="rhrimg" src="heroman.png" alt="Hero Image" />
        </div>
      </div>
      <div className="marquee-container">
        <Marquee className="Maq">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`b${index + 1}`}
              className="marquee-image"
            />
          ))}
        </Marquee>
      </div>
      <ShortAbout />
    </div>
  );
};
