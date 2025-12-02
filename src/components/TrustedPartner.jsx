import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";

export const TrustedPartner = () => {
  // const navigate = useNavigate();

  const productName = "Trusted Partner";
  const subject = `Banksbuddy - INQUIRY | ${productName}`;
  const handleTP = (e) => {
    window.location.href = e;
  };
  const body = `Hello BanksBuddy Team,

Name: [Full Name]
Email: [your.email@example.com]
Phone Number: [Country code + number]
Location: [City, State, Country]
Preferred Contact Method: [Email / Phone]
Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]

Brief Message / Additional Details:
[Short paragraph describing purpose / urgency / additional context]


Thank you for your time.
Warm regards,
[Your Full Name]
[Your Company Name]`;

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  return (
    <div id="partner">
      <div className="phed">
        <h2>Partnerships</h2>
        <p>
          BanksBuddy partners with banks, fintechs, regulators, and community
          organisations to deliver secure, inclusive, and innovative banking
          solutions. We collaborate on technology integration, shared data
          insights, and outreach programs to expand financial access.
        </p>
        <button
          onClick={() => {
            handleTP(gmailHref);
          }}
        >
          Be the Trusted Partner Now !
        </button>
      </div>
      <div className="tpt">
        <h1 className="ph1">Our Partners</h1>
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
      <div className="empt">
        <h1>Empanelments</h1>
        <div className="emptsaes">
          <img src="/pc1.png" alt="pc1" />
          <img src="/pc2.png" alt="pc1" />
        </div>
      </div>
    </div>
  );
};
