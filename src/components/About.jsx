import React from "react";
import "./optional.css";
import { Data_Team } from "./Data_team";

export const About = () => {
  return (
    <div id="about">
      <h1>ABOUT US</h1>
      <div className="a1">
        <div className="a1ct">
          <h3>Company History</h3>
          <p>
            BanksBuddy was founded by Ashwin Kumar Singh with the vision To be
            the most trusted and innovative financial partner for individuals
            and businesses worldwide From the very beginning, our goal has been
            To provide exceptional financial services that empower our clients
            to make informed decisions, achieve financial stability, and realize
            their dreams through innovative solutions and personalized service.
            <br />
            Over time, BanksBuddy has expanded its services to include CIBIL
            score improvement, education loans, and CA services like ITR filing
            and business registrations. Today, we are proud to be one of the
            fastest-growing platforms in the finance industry, dedicated to
            offering personalized solutions that make financial dreams a reality
            for everyone. From Education loan to Business loan we are here to be
            your finance buddy
          </p>
        </div>
        <img src="ab1.jpg" alt="About BanksBuddy" />
      </div>
      <div className="a2">
        <img src="/vision.avif" alt="vison" />
        <div className="a2ct">
          <p className="a2cts">Our Guiding Principles</p>
          <h4>Mission and Vision</h4>
          <p>
            At BanksBuddy, our mission is to provide quick, reliable, and
            personalized financial solutions that empower individuals and
            businesses to achieve their dreams. We are dedicated to simplifying
            financial decisions by offering accessible products and services,
            such as loans, insurance, and CA services, ensuring that our clients
            can focus on what matters most to them — growth, stability, and
            success. Our core values are Integrity, Innovation, Customer Focus,
            . Excellence
            <br />
            Our vision is to be the leading platform that transforms the
            financial services landscape by continually innovating and evolving
            our offerings. We aim to make financial freedom a reality for people
            across the globe by delivering seamless, trustworthy, and
            comprehensive financial solutions. By staying committed to
            excellence and customer satisfaction, we strive to create a world
            where anyone can access the financial support they need to thrive.
          </p>
        </div>
      </div>
      <div className="a3">
        <h1>Our Partners</h1>
        <p>
          BanksBuddy is proud to be partnered with the top financial
          institutions to provide unparalleled services to our customers.
        </p>
        <div className="a3imgs">
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26,
          ].map((num) => (
            <img key={num} src={`a${num}.webp`} alt={`Partner ${num}`} />
          ))}
        </div>
      </div>
      <div className="a4">
        <h1>Our Team</h1>
        <p className="a4ct">
          Growth is never by mere chance, it is the result of forces working
          together
        </p>
        <div className="memcards">
          {Data_Team.map((member, index) => (
            <div key={index} className="mem">
              <img src={`m${member.id}.jpg`} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
