import React from "react";
import { ServicesCards } from "./ServicesCards";
import { specSv } from "./Data_Special";
import { useNavigate } from "react-router-dom";

export const Services = () => {
  const navigate = useNavigate();
  const hanService = (e) => {
    navigate(e);
  };
  return (
    <div id="Services">
      <h1 className="shead">
        OUR SERVICES <br />{" "}
        <span>
          Catering your needs with tailored products for financial
          actualization.
        </span>
      </h1>
      <ServicesCards />
      <h1 className="shead" style={{ marginTop: "5%" }}>
        Core Services
        <span>
          We offer our core financial services tailored to your needs. Secure
          and reliable solutions for your financial growth.
        </span>
      </h1>
      <div className="services-list">
        {specSv.map((s, index) => (
          <div
            key={index}
            className="service-card spec"
            onClick={() => {
              hanService(s.URL);
            }}
          >
            <img src={s.smg} alt={s.title} />
            <div className="service-title">{s.title}</div>
            <div className="service-overview">{s.overview}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
