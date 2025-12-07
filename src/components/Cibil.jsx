import React from "react";
import { Link } from "react-router-dom";
import "./services.css";
import { MdBolt, MdOnlinePrediction } from "react-icons/md";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import NewServices from "./Data_Services";
import { FaBolt, FaHandHoldingUsd, FaWhatsapp } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import "./newserv.css";
import { PiChartLineDownFill, PiLightning, PiLightningAFill } from "react-icons/pi";
import { GoArrowLeft } from "react-icons/go";
import { IoTimer } from "react-icons/io5";

const InsuranceData = [
  {
    id: "Cibil Improvement",
    Title: "CIBIL Score Improvement Service",
    overview: [
      "Your CIBIL score is a critical factor that determines your loan and credit card approval chances. A strong credit score opens doors to better interest rates, higher loan amounts, and faster approvals from financial institutions.",
      "Our CIBIL Score Improvement Service helps you identify credit report errors, rectify negative remarks, and implement strategies to boost your creditworthiness. We provide expert guidance on credit management and dispute resolution to enhance your financial profile.",
      "Whether you're dealing with a low credit score, NPA issues, or incorrect reporting, our comprehensive service ensures your credit history is accurate and optimized for future financial opportunities.",
    ],
    tagline: "Rebuild Your Credit, Reclaim Your Financial Freedom",
    image: "/ss4.jpg",
    TbData: [
      "Starting from 300",
      "3 to 12 months",
      "Customized Plan",
      "Varies by Service Type",
    ],
    features: [
      "Credit Score Improvement across all bureaus (CIBIL, Equifax, Experian & CRIF)",
      "CMR Rank Improvement (scale 1 to 4) for enhanced credit standing",
      "Regular Credit Check Services with detailed reports and analysis",
      "Upgrade External Credit Ratings (scale D to AAA) for businesses",
      "NPA OTS & Closure Services for non-performing assets",
      "Error Removal from credit reports with proper documentation",
      "Credit Dispute Resolution with bureaus and lenders",
      "Personalized Credit Improvement Strategy and action plan",
    ],

    Docs: [
      "Aadhaar Card (Identity & Address Proof)",
      "PAN Card (Mandatory for credit verification)",
      "Contact Number (Active mobile number)",
      "Email ID (For communication and reports)",
      "Cancelled Cheque (For account verification)",
      "Latest Credit Report (CIBIL/Equifax/Experian)",
      "Loan/Credit Card Statements (If applicable)",
      "Bank Statements (Last 6 months)",
    ],

    Types: [
      {
        titl: "Credit Score Enhancement",
        des: "Comprehensive analysis and strategic actions to improve your CIBIL, Equifax, Experian, and CRIF scores through proper credit management.",
      },
      {
        titl: "CMR Rank Improvement",
        des: "Upgrade your Credit Monitoring Rank from scale 1 to 4, helping you access better credit facilities and loan terms.",
      },
      {
        titl: "Regular Credit Monitoring",
        des: "Continuous tracking of your credit report with timely alerts on changes, new inquiries, and potential issues affecting your score.",
      },
      {
        titl: "External Credit Rating Upgrade",
        des: "For businesses and corporate entities, we help improve external credit ratings from D to AAA through proper financial management.",
      },
      {
        titl: "NPA OTS & Closure",
        des: "Negotiate One-Time Settlement for non-performing assets and ensure proper closure with updated credit bureau reporting.",
      },
      {
        titl: "Error Rectification Service",
        des: "Identify and remove incorrect, outdated, or fraudulent entries from your credit report through formal dispute processes.",
      },
    ],
  },
];
const svc = InsuranceData.find((s) => s.id === "Cibil Improvement");
const gmailHref = (() => {
  const subject = `SERVICE INQUIRY - ${svc.Title} | BanksBuddy`;

  const plainBody = `Hello BanksBuddy Team,
I am interested in your ${svc.Title}. Please share the next steps, eligibility confirmation and estimated timelines. 
Brief Message / Additional Details:
[Short paragraph describing purpose / urgency / additional context]

Name: [Full Name]
Email: [your.email@example.com]
Phone Number: [Country code + number]
Location: [City, State, Country]
Product / Service: ${svc.Title}
Employment Status: [Salaried / Self-employed / Other]
If Loan — Loan Amount Required: [Amount or N/A]
Preferred Contact Method: [Email / Phone]
Preferred Contact Time: [e.g., Mon–Fri, 10:00–18:00 IST]




Thank you for your time.
Warm regards,
[Your Full Name]`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=banksbuddy2023@gmail.com&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(plainBody)}`;
})();
const txtarr = [
  "Starting Score Range",
  "Service Duration",
  "Service Plan",
  "Service Fees",
];
const textarr2 = [
  { elm: <FaHandHoldingUsd />, txt: "Expert Credit Analysis & Strategy" },
  { elm: <MdBolt />, txt: "Fast Error Rectification Process" },
  { elm: <PiChartLineDownFill />, txt: "Proven Score Improvement Methods" },
  {
    elm: <HiMiniClipboardDocumentCheck />,
    txt: "Comprehensive Credit Report Review",
  },
  { elm: <IoTimer />, txt: "Flexible Service Timeline" },
];

export const Cibil = () => {
  return (
    <div id="ServicePage">
      <div className="se1">
        <img src={svc.image} style={{padding:"8%"}} alt={svc.Title} />
        <section className="hro">
          <Link className="backtoser" to="/services">
            <span>
              <GoArrowLeft />
            </span>{" "}
            Back to Services
          </Link>
          <h1>{svc.Title}</h1>
          <p className="tg">{svc.tagline}</p>
          <p className="ovi">{svc.overview[0]}</p>

          <section className="se1se">
            <Link className="alyn" to={gmailHref}>
              Apply Now
            </Link>
            <a
              className="alynwp"
              target="_blank"
              href={`https://wa.me/+916377956633?text=I%20am%20interested%20in%20the%20${encodeURIComponent(
                svc.Title
              )}%20service%20offered%20by%20BanksBuddy.`}
            >
              <FaWhatsapp /> Whatsapp
            </a>
          </section>
        </section>
      </div>
      <div className="se2">
        <div className="se2c1">
          <p className="abtg">{svc.tagline}</p>
          <h2>About {svc.Title}</h2>
          {/* <p className="svpp">{svc.overview[0]}</p> */}
          <p className="svpp">{svc.overview[1]}</p>
        </div>
        <div className="se2c2">
          <h3>{svc.Title} Details</h3>
          <ul className="svtb">
            {txtarr.map((k, i) => (
              <li key={i} className={i % 2 == 0 ? "drk" : "plain"}>
                <p>{k}</p>
                <span>{svc.TbData[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="seconstantdom"  style={{margin:"2% 0"}}>
        <h1>{svc.Title} Online Features</h1>
        <div className="secd">
          {textarr2.map((io, i) => (
            <div key={i} className="secdc">
              <span>{io.elm}</span>
              <p>{io.txt}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="se3">
        <h1>{svc.Title}</h1>
        <div className="se3m">
          <div className="se3m1">
            <ul>
              {svc.features.map((feature, i) => (
                <li key={i}>
                  <strong>{i + 1}.</strong> {feature}
                </li>
              ))}
            </ul>
          </div>
          <img
            src="/se3m1.jpg"
            alt="Key Features Illustration"
            className="se3m2"
          />
        </div>
      </div>
      <div className="se4">
        <h1>Required Documents for {svc.Title}</h1>
        <div className="chse4" style={{width:"100%"}}>
          <div className="se4m" style={{width:"100%"}}>
            <img
              src="/se4m1.png"
              alt="Documents Illustration"
              className="se4mi"
            />
            <div className="se4m2" style={{width:"100%"}}>
              {svc.Docs.map((doc, i) => (
                <div key={i} className="se4mc">
                  <p>
                    <span>{i + 1}. </span>
                    {doc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="nt">
            <strong>Note:</strong> Eligibility and document required are
            subjected to change depending on the individual
          </p>
        </div>
      </div>
      <Link className="alynse" to={gmailHref}>
        Apply Now
      </Link>
      {/* <hr /> */}
      <div className="se5">
        <h1>{svc.Title}s</h1>
        <div className="s25cs">
          {svc.Types.map((type, i) => (
            <div key={i} className="se5c">
              <h2>{type.titl}</h2>
              <p>{type.des}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
