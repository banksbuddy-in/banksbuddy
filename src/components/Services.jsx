import React from "react";
import { ServicesCards } from "./ServicesCards";

export const Services = () => {
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
    </div>
  );
};
