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
    id: "insurance",
    Title: "Insurance",
    overview: [
      "Insurance is a financial tool that protects individuals and families from unexpected financial losses. It provides coverage for life, health, vehicles, travel, home, accidents, and more, ensuring financial support during emergencies.",
      "By paying a premium, you get financial protection against risks such as illnesses, accidents, property damage, or death. Insurance helps reduce financial stress during unforeseen situations, making it a vital part of financial planning.",
      "Major insurance categories include life insurance, health insurance, motor insurance, travel insurance, home insurance, and personal accident insurance. Each type offers specialized coverage based on your lifestyle, needs, and financial goals.",
    ],
    tagline: "Your Shield Against Life’s Uncertainties",
    image: "/ss2.jpg",
    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Age criteria vary based on the type of insurance (life, health, motor, etc.)",
      "Valid identity and address proof required",
      "Medical screening may be needed for certain life or health policies",
      "Correct asset details required for motor and home insurance",
      "Nominee details for life insurance policies",
      "Accurate personal and risk-related information must be provided",
    ],

    Docs: [
      "Identity Proof (Aadhaar, PAN, Passport, Voter ID)",
      "Address Proof (Electricity Bill, Rent Agreement, etc.)",
      "Age Proof (School Certificate, Aadhaar, Passport)",
      "Medical Reports (if required for underwriting)",
      "Vehicle RC Book for Motor Insurance",
      "Property Ownership Documents for Home Insurance",
      "Passport & Travel Details for Travel Insurance",
      "Nominee Details for Life Insurance",
    ],

    Types: [
      {
        titl: "Life Insurance",
        des: "Provides financial protection to your family in case of your unfortunate demise during the policy term.",
      },
      {
        titl: "Health Insurance",
        des: "Covers medical expenses from hospitalization, treatments, surgeries, and critical illnesses.",
      },
      {
        titl: "Motor Insurance (Car/Bike)",
        des: "Covers damage, theft, and third-party liabilities for your vehicle as mandated by law.",
      },
      {
        titl: "Travel Insurance",
        des: "Protects against trip cancellations, baggage loss, medical emergencies, and other travel-related risks.",
      },
      {
        titl: "Home Insurance",
        des: "Covers damages to your house and its contents from fire, theft, natural disasters, and more.",
      },
      {
        titl: "Personal Accident Insurance",
        des: "Provides financial support in the event of accidental death, disability, or injury.",
      },
    ],
  },
];
const svc = InsuranceData.find((s) => s.id === "insurance");
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
  "Max Loan Amount",
  "Max Loan Tenure",
  "Interest Rate",
  "Processing Fees",
];
const textarr2 = [
  { elm: <FaHandHoldingUsd />, txt: "Affordable Premium Options" },
  { elm: <MdBolt />, txt: "Easy & Quick Online Purchase" },
  { elm: <PiChartLineDownFill />, txt: "Wide Coverage at Low Cost" },
  {
    elm: <HiMiniClipboardDocumentCheck />,
    txt: "Clear & Transparent Policy Terms",
  },
  { elm: <IoTimer />, txt: "Flexible Policy Tenure Choices" },
];

export const Insurance = () => {
  return (
    <div id="ServicePage">
      <div className="se1">
        <img src={svc.image} alt={svc.Title} />
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
      <div className="seconstantdom">
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
        <h1>Eligibility Criteria for {svc.Title}</h1>
        <div className="se3m">
          <div className="se3m1">
            <ul>
              {svc.EliCr.map((elg, i) => (
                <li key={i}>
                  <strong>{i + 1}.</strong> {elg}
                </li>
              ))}
            </ul>
          </div>
          <img
            src="/se3m1.jpg"
            alt="Eligibility Criteria Illustration"
            className="se3m2"
          />
        </div>
      </div>
      <div className="se4">
        <h1>Required Documents for {svc.Title}</h1>
        <div className="chse4">
          <div className="se4m">
            <img
              src="/se4m1.png"
              alt="Documents Illustration"
              className="se4mi"
            />
            <div className="se4m2">
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
        <h1>Types of {svc.Title}</h1>
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
