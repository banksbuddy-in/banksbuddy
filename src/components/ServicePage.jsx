import React from "react";
import { useParams, Link } from "react-router-dom";
import services from "./Data_Services";
import "./services.css";

const toSlug = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

const collectRequiredDocs = (svc) => {
  // prefer checklist, then documents, then studentChecklist, then propertyDocuments
  if (Array.isArray(svc.checklist))
    return { type: "list", data: svc.checklist };
  if (Array.isArray(svc.documents))
    return { type: "list", data: svc.documents };
  if (svc.documents && typeof svc.documents === "object") {
    // return structured documents object so UI can label subsections (salaried/selfEmployed/etc.)
    return { type: "grouped", data: svc.documents };
  }
  if (Array.isArray(svc.studentChecklist))
    return { type: "list", data: svc.studentChecklist };
  if (Array.isArray(svc.propertyDocuments))
    return { type: "list", data: svc.propertyDocuments };
  return null;
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

  const svc = services.find(
    (s) => toSlug(s.id) === slug || toSlug(s.title) === slug
  );

  if (!svc) {
    return (
      <div className="service-page">
        <h2>Service not found</h2>
        <p>No service matches the requested page.</p>
        <Link to="/services">Back to Services</Link>
      </div>
    );
  }

  const gmailHref = (() => {
    const subject = `SERVICE INQUIRY - ${svc.title} | BanksBuddy`;

    const plainBody = `Hello BanksBuddy Team,
I am interested in your ${svc.title}. Please share the next steps, eligibility confirmation and estimated timelines. 
Brief Message / Additional Details:
[Short paragraph describing purpose / urgency / additional context]

Name: [Full Name]
Email: [your.email@example.com]
Phone Number: [Country code + number]
Location: [City, State, Country]
Product / Service: ${svc.title}
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

  const docsFound = collectRequiredDocs(svc);

  const humanizeKey = (k) => {
    if (!k) return "";
    // split camelCase or snake_case into words
    const fromCamel = k.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    const fromSnake = fromCamel.replace(/[_-]/g, " ");
    return fromSnake
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="service-page">
      <Link to="/services">← Back to Services</Link>
      <div className="servcescntent">
        <h1>{svc.title}</h1>
        {svc.overview && <p className="overview">{svc.overview}</p>}

        {svc.eligibility && (
          <section className="modaldetailsmore">
            <h3>Eligibility</h3>
            {Array.isArray(svc.eligibility) ? (
              <ul>
                {svc.eligibility.map((e, i) => (
                  <li key={i}><strong>{i+1}</strong>. {e}</li>
                ))}
              </ul>
            ) : (
              <div>
                {Object.entries(svc.eligibility).map(([k, v]) => (
                  <div key={k}>
                    <strong>{k}:</strong>
                    <ul>
                      {v.map((item, idx) => (
                        <li key={idx}><strong>{idx+1}</strong>. {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {svc.features && (
          <section>
            <h3>Features</h3>
            <ul>
              {svc.features.map((f, i) => (
                <li key={i}><strong>{i+1}</strong>. {f}</li>
              ))}
            </ul>
          </section>
        )}
<br />
        {(svc.checklist ||
          svc.documents ||
          svc.studentChecklist ||
          svc.propertyDocuments) && (
          <section>
            <h3>Required Documents</h3>
            {docsFound ? (
              docsFound.type === "list" ? (
                <ul>
                  {docsFound.data.map((d, i) => (
                    <li key={i}><strong>{i+1}</strong>. {d}</li>
                  ))}
                </ul>
              ) : (
                <div>
                  {Object.entries(docsFound.data).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 8 }}>
                      <strong>{humanizeKey(k)}</strong>
                      {Array.isArray(v) ? (
                        <ul>
                          {v.map((item, idx) => (
                            <li key={idx}><strong>{idx+1}</strong>. {item}</li>
                          ))}
                        </ul>
                      ) : (
                        <pre>{String(v)}</pre>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <pre>
                {typeof svc.documents === "object"
                  ? JSON.stringify(svc.documents, null, 2)
                  : String(svc.documents)}
              </pre>
            )}
          </section>
        )}
      </div>

        <a
          className="apply-btn"
          href={gmailHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Now
        </a>
    </div>
  );
};

export default ServicePage;
