import React from "react";
import { FaHeartbeat, FaStethoscope, FaShieldAlt, FaMoneyBill } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

export const cibilSv = {
  id: "cibil_improvement",
  title: "CIBIL Improvement",
  URL: "/cibil",
  smg: "/ss4.jpg",
  overview:
    "Strategies to enhance your CIBIL score for better credit opportunities.",
};

export const specSv = [
  {
    id: "consultancy_service",
    title: "Consultancy Service",
    URL: "/consultation",
    smg: "/ss1.jpg",
    overview:
      "Personalized loan consultancy to find the best financial solutions.",
  },
  {
    id: "tax-services",
    title: "Tax Consultancy Services",
    URL: "/tax-services",
    smg: "/ss5.jpg",
    overview: "Expert Guidance for Smart, Compliant, and Stress-Free Taxation.",
  },
];
export const Insur = [
  {
    id: "insurance",
    title: "Insurance Services",
    URL: "/insurance",
    smg: "/ss2.jpg",
    overview:
      "Comprehensive insurance solutions to protect you and your family from life's uncertainties.",
    tagline: "Your Shield Against Life's Uncertainties",
    description:
      "Insurance is a financial safety net that protects individuals and families from unexpected losses. We offer expert guidance across life, health, and general insurance categories to ensure you have the right coverage tailored to your needs and budget.",
    mainFeatures: [
      "Wide Range of Insurance Products",
      "Expert Policy Comparison & Selection",
      "Hassle-Free Claims Assistance",
      "Competitive Premium Rates",
      "End-to-End Policy Management",
      "Dedicated Customer Support",
    ],
    subsections: [
      {
        id: "life_insurance",
        title: "Life Insurance",
        image: "/spc1.jpg",
        isg: "/ins2.jpeg",
        inr: "/inr3.jpg",
        icon: <GiReceiveMoney size={40} color="#ff451f" />,
        overview:
          "Secure your family's financial future with comprehensive life insurance plans that provide protection and investment benefits.",
        tagline: "Secure Your Family's Financial Future",
        description:
          "Life insurance ensures that your loved ones are financially protected in case of an unfortunate event. Choose from term plans, endowment policies, ULIPs, and pension plans designed to meet your long-term financial goals.",
        keyBenefits: [
          "Financial security for your family",
          "Tax benefits under Section 80C and 10(10D)",
          "Flexible premium payment options",
          "Maturity benefits and bonus additions",
          "Loan facility against policy",
          "Riders for enhanced coverage",
        ],
        popularPlans: [
          {
            name: "Term Insurance",
            desc: "Pure life protection with high coverage at affordable premiums. Ideal for young families and income earners.",
          },
          {
            name: "Endowment Policy",
            desc: "Combination of insurance and savings. Provides maturity benefits along with life cover.",
          },
          {
            name: "ULIP (Unit Linked Insurance Plans)",
            desc: "Market-linked insurance plans offering dual benefits of investment and protection.",
          },
          {
            name: "Pension Plans",
            desc: "Retirement solutions ensuring regular income post-retirement for financial independence.",
          },
          {
            name: "Money Back Policy",
            desc: "Periodic payouts during policy term while maintaining life coverage throughout.",
          },
          {
            name: "Child Plans",
            desc: "Secure your child's education and future milestones with dedicated savings plans.",
          },
        ],
        whoShouldBuy: [
          "Primary income earners with dependents",
          "Parents planning for children's future",
          "Individuals seeking tax-saving investments",
          "Self-employed professionals without employer benefits",
          "Young adults starting their financial journey",
        ],
        documents: [
          "Age Proof (Aadhaar, Passport, Birth Certificate)",
          "Identity Proof (PAN Card, Aadhaar)",
          "Address Proof (Utility Bills, Aadhaar)",
          "Income Proof (Salary Slips, ITR, Bank Statements)",
          "Medical Reports (if required for high sum assured)",
          "Passport-size Photographs",
        ],
      },
      {
        id: "health_insurance",
        title: "Health Insurance",
        image: "/spc2.jpg",
        isg: "/ins1.jpg",
        inr: "/inr2.jpg",
        icon: <FaStethoscope size={40} color="#ff451f" />,
        overview:
          "Protect yourself and your family from rising medical costs with comprehensive health insurance coverage.",
        tagline: "Protect Your Health, Secure Your Wealth",
        description:
          "Health insurance covers hospitalization expenses, surgeries, treatments, and critical illnesses. With cashless facilities at network hospitals and family floater options, ensure quality healthcare without financial burden.",
        keyBenefits: [
          "Cashless treatment at network hospitals",
          "Coverage for pre and post-hospitalization",
          "Day-care procedures covered",
          "No claim bonus for claim-free years",
          "Tax benefits under Section 80D",
          "Annual health check-ups included",
        ],
        popularPlans: [
          {
            name: "Family Health Insurance",
            desc: "Single policy covering entire family with shared sum insured. Cost-effective for families.",
          },
          {
            name: "Senior Citizen Health Insurance",
            desc: "Specialized plans for elderly with coverage for age-related ailments and pre-existing conditions.",
          },
          {
            name: "Critical Illness Insurance",
            desc: "Lump sum payout on diagnosis of critical diseases like cancer, heart attack, or stroke.",
          },
          {
            name: "Maternity Insurance",
            desc: "Coverage for pre and post-natal expenses, delivery costs, and newborn baby care.",
          },
          {
            name: "Top-Up Health Plans",
            desc: "Additional coverage beyond base policy limits at affordable premiums for high medical expenses.",
          },
          {
            name: "Group Health Insurance",
            desc: "Employer-provided or association-based plans covering multiple members at discounted rates.",
          },
        ],
        whoShouldBuy: [
          "Individuals and families of all age groups",
          "Senior citizens with age-related health concerns",
          "Pregnant women and new parents",
          "Individuals with family history of critical illnesses",
          "Self-employed professionals without corporate health cover",
        ],
        documents: [
          "Age Proof (Aadhaar, Passport, Birth Certificate)",
          "Identity Proof (PAN Card, Aadhaar, Voter ID)",
          "Address Proof (Utility Bills, Aadhaar)",
          "Medical History (if any pre-existing conditions)",
          "Pre-policy Medical Tests (if required)",
          "Previous Health Insurance Policy (for portability)",
        ],
      },
      {
        id: "general_insurance",
        title: "General Insurance",
        image: "/spc3.jpg",
        isg: "/ins3.jpg",
        inr: "/inr1.jpg",
        icon: <FaShieldAlt size={40} color="#ff451f" />,
        overview:
          "Comprehensive protection for your assets including vehicles, home, travel, and business with customized general insurance plans.",
        tagline: "Safeguarding Your Valuable Assets.",
        description:
          "General insurance covers non-life assets and liabilities including motor vehicles, property, travel, business risks, and third-party liabilities. Get peace of mind knowing your valuable assets are protected against damages, theft, and unforeseen events.",
        keyBenefits: [
          "Protection against asset damage and loss",
          "Legal liability coverage",
          "Quick claim settlement process",
          "Affordable premiums with flexible tenures",
          "Add-on covers for comprehensive protection",
          "24/7 roadside assistance (motor insurance)",
        ],
        popularPlans: [
          {
            name: "Motor Insurance (Car/Bike)",
            desc: "Mandatory coverage for vehicles including own damage, third-party liability, and theft protection.",
          },
          {
            name: "Travel Insurance",
            desc: "Coverage for international and domestic travel including medical emergencies, trip cancellations, and baggage loss.",
          },
          {
            name: "Home Insurance",
            desc: "Protection for your home structure and contents against fire, theft, natural disasters, and liabilities.",
          },
          {
            name: "Fire Insurance",
            desc: "Coverage for commercial and residential properties against fire damage and related perils.",
          },
          {
            name: "Marine Insurance",
            desc: "Protection for goods in transit via sea, air, or land for import-export businesses.",
          },
          {
            name: "Cyber Insurance",
            desc: "Coverage against cyber threats, data breaches, and online frauds for businesses and individuals.",
          },
          {
            name: "Professional Indemnity",
            desc: "Liability coverage for professionals against claims of negligence, errors, or omissions in service.",
          },
          {
            name: "Shopkeepers Insurance",
            desc: "Comprehensive coverage for retail businesses including stock, property, and public liability.",
          },
        ],
        whoShouldBuy: [
          "All vehicle owners (mandatory by law)",
          "Frequent travelers - domestic and international",
          "Homeowners and property investors",
          "Business owners and entrepreneurs",
          "Professionals (doctors, lawyers, consultants)",
          "E-commerce and IT businesses",
        ],
        documents: [
          "Identity Proof (Aadhaar, PAN Card, Passport)",
          "Address Proof (Utility Bills, Aadhaar)",
          "Vehicle RC Book (for motor insurance)",
          "Property Ownership Documents (for home/fire insurance)",
          "Business Registration Documents (for commercial insurance)",
          "Previous Insurance Policy (for renewal)",
          "Passport and Visa (for travel insurance)",
          "Professional License (for indemnity insurance)",
        ],
      },
    ],
    whyChooseUs: [
      "Expert guidance from certified insurance advisors",
      "Compare policies from top insurance companies",
      "Transparent pricing with no hidden charges",
      "Quick policy issuance and documentation",
      "Dedicated claim support and assistance",
      "Regular policy reviews and updates",
    ],
  },
];

/**
 * 
 * Term Insurance
Life Insurance contains 
---------------------
List of Term Insurance Plan
Term Insurance for NRI
What is Term Insurance
1 Crore Term Insurance
Term Insurance Calculator
Dedicated Claim Assistance
Term Insurance for Women
Term Insurance for HNI
Term Insurance Return of Premium



Investment Plans
Investment Plans with High Returns
Unit Linked Insurance Plans (ULIP)
Investment Plans for NRIs
Best SIP Plans
Capital Guarantee Plans
Child Plans
Pension Plans
Dollar Based Investment Plans
Guaranteed Return Plans
Tax Saving Investments
SIP Calculator
Endowment Policy
LIC
Money Back Policy
Annuity Plans
Income Tax Calculator

-----------------------

Health Insurance
-------------------------

Book Free Home Visit
Family Health Insurance
Senior Citizen Health Insurance
Health Insurance for Parents
Maternity Insurance
Network Hospitals
Health Insurance Portability
OPD Cover In Health Insurance
Mediclaim Policy
Critical Illness Insurance
Health Insurance Calculator
Health Insurance Companies
Types of Health Insurance
Health Insurance for NRIs

--------------------------
General Insurance cotains
---------------------------
Travel Insurance
International Travel Insurance
Schengen travel insurance
Group Health Insurance
Marine Insurance
Workmen Compensation Policy
Professional Indemnity
Doctors Indemnity Insurance
Fire Insurance
Shopkeepers Insurance
Office Insurance
Comprehensive General Liability
Cyber Insurance
Contractors All Risk
Surety Bond
Home Insurance
Home Loan Insurance
Home Loan EMI Calculator
Pet Insurance
Cancer Insurance
Defence Personnel Insurance
General Insurance
Car Insurance
Motor Insurance
Bike Insurance
Zero Dep Car Insurance
Third Party Insurance
Third Party Bike Insurance
Car Insurance Calculator
Bike Insurance Calculator
Car Insurance Companies
Pay As You Drive Insurance
Commercial Vehicle Insurance
Electric Car Insurance
E-Bike Insurance
IDV Calculator
Comprehensive Insurance
New Car Insurance
Car Insurance Status
---------------------------
 */
