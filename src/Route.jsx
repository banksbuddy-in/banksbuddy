import { About } from "./components/About";
import { EMI } from "./components/EMI";
import { Err404 } from "./components/Err404";
import { LHomeLoan } from "./components/LHomeLoan";
import { LPersonalLoan } from "./components/LPersonalLoan";
import { LBusinessLoan } from "./components/LBusinessLoan";
import { LMachineryLoan } from "./components/LMachineryLoan";
import { LEducationLoan } from "./components/LEducationLoan";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { MainServices } from "./components/MainServices";
import { TrustedPartner } from "./components/TrustedPartner";
import { AddCareer } from "./components/addCareer";
import { Careers } from "./components/Careers";

export const Dat = [
  {
    path: "/",
    label: "Home",
    element: <Hero />,
  },
  {
    path: "/about-us",
    label: "About",
    element: <About />,
  },
  {
    path: "*",
    label: "Not Found",
    element: <Err404 />,
  },
  {
    path: "/services",
    label: "Services",
    element: <MainServices />,
  },
  {
    path: "emi-calculator",
    label: "EMI Calculator",
    element: <EMI />,
  },
  {
    path: "/personal-loan",
    label: "Personal Loan",
    element: <LPersonalLoan />,
  },
  {
    path: "/home-loan",
    label: "Home Loan",
    element: <LHomeLoan />,
  },
  {
    path: "/education-loan",
    label: "Education Loan",
    element: <LEducationLoan />,
  },
  {
    path: "/business-loan",
    label: "Business Loan",
    element: <LBusinessLoan />,
  },
  {
    path: "/machinery-loan",
    label: "Machinery Loan",
    element: <LMachineryLoan />,
  },
  {
    path: "/trusted-partner",
    label: "Trusted Partner",
    element: <TrustedPartner />,
  },
  {
    path: "/careers",
    label: "Careers",
    element: <Careers />,
  },
  {
    path: "/admin",
    label: "Add Career",
    element: <AddCareer />,
  },
];