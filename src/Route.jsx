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
import { AdminOffers } from "./components/AdminOffers";
import { AdminTeam } from "./components/AdminTeam";
import { AdminPolicyReminder } from "./components/AdminPolicyReminder";
import { Insurance } from "./components/Insurance";
import { CibilScoreCheck } from "./components/CibilScoreCheck";
import { UnderDev } from "./components/UnderDev";
import { Admin } from "./components/Admin";
import { Cibil } from "./components/Cibil";
import { Development } from "./components/Development";
import { ContactForm } from "./components/ContactForm";
import { InsuranceSubCategory } from "./components/InsuranceSubCategory";
import { Tax } from "./components/Tax";
import { PartnerForm } from "./components/PartnerForm";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Credit } from "./components/Credit";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";
import { PaymentTestPage } from "./components/PaymentTestPage";

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
    path: "/admin-offers",
    label: "Admin Offers",
    element: <AdminOffers />,
  },
  {
    path: "/admin-team",
    label: "Admin Team",
    element: <AdminTeam />,
  },
  {
    path: "/admin-policy-reminder",
    label: "Policy Reminders",
    element: <AdminPolicyReminder />,
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
    element: (
      <PrivateRoute>
        <Cibil />
      </PrivateRoute>
    ),
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
    path: "/payment-test",
    label: "Payment Test",
    element: <PaymentTestPage />,
  },
];
