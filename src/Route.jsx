import { About } from "./components/About";
import { EMI } from "./components/EMI";
import { Err404 } from "./components/Err404";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { MainServices } from "./components/MainServices";
import ServicePage from "./components/ServicePage";
import { TrustedPartner } from "./components/TrustedPartner";
import { AddCareer } from "./components/AddCareer";
import { Careers } from "./components/Careers";
import { ConsulatationForm } from "./components/ConsulatationForm";
import AdminTable from "./components/AdminTable";
import { AdminReviews } from "./components/AdminReviews";
import { Insurance } from "./components/Insurance";
import { CibilScoreCheck } from "./components/CibilScoreCheck";
import { UnderDev } from "./components/UnderDev";
import { Admin } from "./components/Admin";
import { Cibil } from "./components/Cibil";
import { Development } from "./components/Development";

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
    path: "/services/:slug",
    label: "Service Detail",
    element: <ServicePage />,
  },
  {
    path: "emi-calculator",
    label: "EMI Calculator",
    element: <EMI />,
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
    path: "/admin-career",
    label: "Add Career",
    element: <AddCareer />,
  },
  {
    path: "/consultation",
    element: <ConsulatationForm />,
  },
  {
    path: "/admin-table",
    label: "Admin Table",
    element: <AdminTable />,
  },
  {
    path: "/admin-reviews",
    label: "Admin Reviews",
    element: <AdminReviews />,
  },
  {
    path: "/insurance-assistance",
    label: "Insurance Assistance",
    element: <Insurance />,
  },
  {
    path: "/cibil-score-check",
    label: "CiBil Score Check",
    element: <CibilScoreCheck />,
  },
  {
    path: "/udc",
    label: "Under Development",
    element: <UnderDev />,
  },{
    path: "/admin",
    label: "Admin",
    element: <Admin />,
  },{
    path:"/cibil-improvement",
    label:"Cibil Improvement",
    element: <Cibil/>
  }
  ,{
    path:"/website-development",
    label:"Website Improvement",
    element: <Development/>
  }
];
