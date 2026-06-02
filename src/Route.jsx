import React, { lazy } from "react";
import { Hero } from "./components/Hero";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";

const About = lazy(() => import("./components/About").then(m => ({ default: m.About })));
const EMI = lazy(() => import("./components/EMI").then(m => ({ default: m.EMI })));
const Err404 = lazy(() => import("./components/Err404").then(m => ({ default: m.Err404 })));
const Services = lazy(() => import("./components/Services").then(m => ({ default: m.Services })));
const MainServices = lazy(() => import("./components/MainServices").then(m => ({ default: m.MainServices })));
const ServicePage = lazy(() => import("./components/ServicePage"));
const TrustedPartner = lazy(() => import("./components/TrustedPartner").then(m => ({ default: m.TrustedPartner })));
const AddCareer = lazy(() => import("./components/AddCareer").then(m => ({ default: m.AddCareer })));
const Careers = lazy(() => import("./components/Careers").then(m => ({ default: m.Careers })));
const ConsulatationForm = lazy(() => import("./components/ConsulatationForm").then(m => ({ default: m.ConsulatationForm })));
const AdminTable = lazy(() => import("./components/AdminTable"));
const AdminReviews = lazy(() => import("./components/AdminReviews").then(m => ({ default: m.AdminReviews })));
const AdminOffers = lazy(() => import("./components/AdminOffers").then(m => ({ default: m.AdminOffers })));
const AdminTeam = lazy(() => import("./components/AdminTeam").then(m => ({ default: m.AdminTeam })));
const AdminPolicyReminder = lazy(() => import("./components/AdminPolicyReminder").then(m => ({ default: m.AdminPolicyReminder })));
const Insurance = lazy(() => import("./components/Insurance").then(m => ({ default: m.Insurance })));
const CibilScoreCheck = lazy(() => import("./components/CibilScoreCheck").then(m => ({ default: m.CibilScoreCheck })));
const UnderDev = lazy(() => import("./components/UnderDev").then(m => ({ default: m.UnderDev })));
const Admin = lazy(() => import("./components/Admin").then(m => ({ default: m.Admin })));
const Cibil = lazy(() => import("./components/Cibil").then(m => ({ default: m.Cibil })));
const Development = lazy(() => import("./components/Development").then(m => ({ default: m.Development })));
const ContactForm = lazy(() => import("./components/ContactForm").then(m => ({ default: m.ContactForm })));
const InsuranceSubCategory = lazy(() => import("./components/InsuranceSubCategory").then(m => ({ default: m.InsuranceSubCategory })));
const Tax = lazy(() => import("./components/Tax").then(m => ({ default: m.Tax })));
const PartnerForm = lazy(() => import("./components/PartnerForm").then(m => ({ default: m.PartnerForm })));
const Login = lazy(() => import("./components/Login").then(m => ({ default: m.Login })));
const Signup = lazy(() => import("./components/Signup").then(m => ({ default: m.Signup })));
const Credit = lazy(() => import("./components/Credit").then(m => ({ default: m.Credit })));
const PaymentTestPage = lazy(() => import("./components/PaymentTestPage").then(m => ({ default: m.PaymentTestPage })));
const FeedbackForm = lazy(() => import("./components/FeedbackForm").then(m => ({ default: m.FeedbackForm })));

export const Dat = [
  {
    path: "/",
    label: "Home",
    element: <Hero />,
  },
  {
    path: "/login",
    label: "Login",
    element: <Login />,
  },
  {
    path: "/feedback-form",
    label: "Feedback",
    element: <FeedbackForm />,
  },
  {
    path: "/feeback-form",
    label: "Feedback Typo",
    element: <FeedbackForm />,
  },
  {
    path: "/signup",
    label: "Signup",
    element: <Signup />,
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
    path: "/tax-services",
    label: "Tax Services",
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
    element: (
      <AdminRoute>
        <AddCareer />
      </AdminRoute>
    ),
  },
  {
    path: "/consultation",
    element: <ConsulatationForm />,
  },
  {
    path: "/admin-table",
    label: "Admin Table",
    element: (
      <AdminRoute>
        <AdminTable />
      </AdminRoute>
    ),
  },
  {
    path: "/admin-reviews",
    label: "Admin Reviews",
    element: (
      <AdminRoute>
        <AdminReviews />
      </AdminRoute>
    ),
  },
  {
    path: "/admin-offers",
    label: "Admin Offers",
    element: (
      <AdminRoute>
        <AdminOffers />
      </AdminRoute>
    ),
  },
  {
    path: "/admin-team",
    label: "Admin Team",
    element: (
      <AdminRoute>
        <AdminTeam />
      </AdminRoute>
    ),
  },
  {
    path: "/admin-policy-reminder",
    label: "Policy Reminders",
    element: (
      <AdminRoute>
        <AdminPolicyReminder />
      </AdminRoute>
    ),
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
  },
  {
    path: "/admin",
    label: "Admin",
    element: (
      <AdminRoute>
        <Admin />
      </AdminRoute>
    ),
  },
  {
    path: "/cibil",
    label: "Credit Improvement Service",
    element: <Cibil />,
  },
  {
    path: "/credit-dashboard",
    label: "Credit Dashboard",
    element: (
      <PrivateRoute>
        <Credit />
      </PrivateRoute>
    ),
  },
  {
    path: "/website-development",
    label: "Website Improvement",
    element: <ServicePage />,
  },
  {
    path: "/digital-marketing",
    label: "Digital Marketing Services",
    element: <ServicePage />,
  },
  {
    path: "/contact-banksbuddy",
    label: "Contact Us",
    element: <ConsulatationForm />,
  },
  {
    path: "/insurance/:category",
    label: "Insurance Category",
    element: <InsuranceSubCategory />,
  },
  {
    path: "/partner-application",
    label: "Partner Application",
    element: <PartnerForm />,
  },
  {
    path: "/payment",
    label: "Payment",
    element: <PaymentTestPage />,
  },
];
