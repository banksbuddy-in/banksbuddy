import React from "react";
import { useParams, Link } from "react-router-dom";
import "./services.css";
import { MdOnlinePrediction } from "react-icons/md";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import NewServices from "./Data_Services";
import { FaHandHoldingUsd, FaWhatsapp } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import "./newserv.css";
import { PiChartLineDownFill } from "react-icons/pi";
import { GoArrowLeft } from "react-icons/go";

const toSlug = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

// const buildMailTo = svc => {
//   const subject = `${svc.title} - Inquiry`
//   const docs = collectRequiredDocs(svc) || []
//   const docsText = docs.length ? `\nRequired documents:\n${docs.map(d => `- ${d}`).join('\n')}` : ''

//   const body = `Hello,%0D%0A%0D%0AI am interested in your ${svc.title}. Please share the next steps, eligibility confirmation and estimated timelines.${encodeURIComponent('\n\nPlease find the documents I will provide:')}`
//   // We can't safely mix percent encoding and plain - simpler to construct then encode
//   const plainBody = `Hello,\n\nI am interested in your ${svc.title}. Please share the next steps, eligibility confirmation and estimated timelines.\n\nRequired documents:\n${docs.map(d => `- ${d}`).join('\n')}\n\nRegards,\n[Your name]\n[Phone]`

//   return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`
// }

export const ServicePage = () => {
  const { slug } = useParams();
  if (!slug) return <div className="service-page">Service not found</div>;

  const svc = NewServices.find(
    (s) => toSlug(s.id) === slug || toSlug(s.title) === slug
  );

  if (!svc) {
    return (
      <div className="service-page not-found">
        <h2 className="service-not-foundh">Service not found</h2>
        <p className="service-not-foundp">No service matches the requested page.</p>
        <Link className="Svnf" to="/services">Back to Services</Link>
      </div>
    );
  }

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
    { elm: <FaHandHoldingUsd />, txt: "No Collateral Required" },
    { elm: <MdOnlinePrediction />, txt: "Simple, Easy Online Process" },
    { elm: <PiChartLineDownFill />, txt: "Low Interest Rates" },
    { elm: <HiMiniClipboardDocumentCheck />, txt: "Transparent Terms" },
    { elm: <FaCalendarCheck />, txt: "Flexible Tenure" },
  ];

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
      <Link className="alynse" to={gmailHref}>Apply Now</Link>
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

export default ServicePage;
