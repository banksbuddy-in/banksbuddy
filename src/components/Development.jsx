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
const Daata = [
  {
    id: "website_development",
    Title: "Website Development",
    overview: [
      "Website development services are designed to help businesses build a strong online presence with modern, responsive, and high-performing websites.",
      "Whether you're looking for a portfolio site, business website, e-commerce store, or a custom web application, development solutions are tailored to match your goals, branding, and functionality needs.",
      "A well-developed website enhances credibility, increases customer engagement, and acts as a powerful digital asset to grow your business."
    ],
    tagline: "Build Your Digital Presence with Modern Web Solutions",
    image: "/ss5.jpg",

    TbData: [
      "Starts from ₹15,000 onwards",
      "Delivery Timeline: 3 days to 45 days (based on project size)",
      "Fully responsive on all devices",
      "SEO-friendly and performance-optimized"
    ],

    EliCr: [
      "Clear business or project requirements",
      "Brand assets (logo, colors, content) — if available",
      "Domain & hosting details (optional; can also be arranged)",
      "Admin access for updates — if required"
    ],

    Docs: [
      "Business details (company profile or product info)",
      "Content (text, images, videos) you want on the website",
      "Domain & hosting login (if already purchased)",
      "Branding assets like logo and color palette"
    ],

    Types: [
      {
        titl: "Responsive Business Website",
        des: "Modern multi-page website built for businesses, fully responsive across devices."
      },
      {
        titl: "Portfolio Website",
        des: "Clean and professional portfolio for designers, influencers, photographers, and freelancers."
      },
      {
        titl: "E-Commerce Website",
        des: "Complete online store with payment gateway, product management, and order system."
      },
      {
        titl: "Custom Web Application",
        des: "Tailor-made solutions such as CRM, dashboards, internal systems, or booking platforms."
      },
      {
        titl: "Landing Page Design",
        des: "High-converting single page designed for marketing, ads, or product launches."
      },
      {
        titl: "Android Web App (PWA)",
        des: "Installable mobile-first Progressive Web Apps behaving like Android apps."
      }
    ]
  }
];


const svc = Daata.find((s) => s.id === "website_development");
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

export const Development = () => {
  return (
    <div id="ServicePage">
      <div className="se1">
        <img style={{padding:"8%", borderRadius:"10rem"}} src={svc.image} alt={svc.Title} />
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
          <h2 style={{fontSize:"2.75rem"}}>About {svc.Title}</h2>
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
      <div className="seconstantdom" style={{margin:"2% 0"}}>
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
        </div>
      </div>
      {/* <div className="se4">
        <h1>Required Documents for {svc.Title}</h1>
        <div className="chse4">
          <div className="se4m">
            <img
              src="/se4m1.png"
              alt="Documents Illustration"
              className="se4mi"
            />
            <div className="se4m2" style={{width:"100%",alignSelf:"center"}}>
              {svc.Docs.map((doc, i) => (
                <div key={i} className="se4mc" style={{width:"100%"}}>
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
      </div> */}
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
