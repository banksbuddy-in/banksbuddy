{
  /*Secured personal loans for salaried and certain self-employed profiles.
Loans for purchase, construction, balance transfer, self-construction, refinance and builder funding.
Loans for new/used vehicles and refinance of existing vehicle loans.
Secured loan against residential or commercial property.
Finance for students pursuing domestic or international courses.
Working capital and term loans for businesses (manufacturing, trading, services).*/
}

const NewServices = [
  {
    id: "personal_loan",
    Title: "Personal Loan",
    image: "/d1.jpg",
    overview: [
      "A personal loan is your go-to solution for managing financial needs without hassle. Whether you’re planning a dream wedding, funding higher education, covering medical emergencies, or consolidating debts, our instant personal loan offers quick disbursal, minimal paperwork, and flexible repayment options.",
      "With competitive interest rates and a hassle-free application process, we ensure you get the funds you need, exactly when you need them. No collateral required—just a simple and transparent way to achieve your financial goals with ease. Take the first step toward financial freedom today and experience the convenience of a personal loan tailored to your needs.",
      "Secured personal loans for salaried and certain self-employed profiles.",
    ],
    tagline: "Unlock Financial Freedom",

    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Age: 21–80 years",
      "CIBIL Score: 685 or higher",
      "Minimum age: 21 years",
      "Minimum NTH salary: More than 11,000",
      "Employed with: Proprietorship, Partnership, LLP, Pvt. Ltd., Public Ltd., Govt. (Class 4)",
      "Details Required: Email ID and Contact Number",
    ],
    Docs: [
      "KYC of Applicant (Aadhar Card, Pan Card)",
      "3 Months’ Salary Slip",
      "6 Months Bank Statement",
      "Service Certificate for Defence (Army, Navy, Air Force)",
      "Passport Size Photo",
      "Address Proof (Electricity Bill, Rent Agreement, Postpaid Bill, Gas Connection)",
    ],
    Types: [
      {
        titl: "Personal Loan for Wedding",
        des: "Make your D-Day special with a tailored personal loan for weddings.",
      },
      {
        titl: "Personal Loan for Home Renovation",
        des: "Upgrade your living space with a personal loan for home improvements.",
      },
      {
        titl: "Personal Loan for Travel",
        des: "Explore the world with our flexible travel loans.",
      },
      {
        titl: "Personal Loan for Higher Education",
        des: "Invest in your future with an education loan to support your studies.",
      },
    ],
  },
  {
    id: "home_loan",
    Title: "Home Loan",
    image: "/d6.jpg",
    overview: [
      "A home loan is the perfect solution to turn your dream home into reality without financial strain. Whether you're buying your first home, upgrading to a bigger space, or investing in property, our home loan offers attractive interest rates, flexible repayment options, and easy approvals.",
      "With minimal paperwork, quick processing, and tailored loan amounts, we make homeownership simple and accessible. Secure your future with a hassle-free home loan and move into your dream home with confidence.",
      "Loans for purchase, construction, balance transfer, self-construction, refinance and builder funding.",
    ],
    tagline: "Turn Your Dream Home into Reality",
    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months*",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Age Limit (Salaried): 21 to 65 years",
      "Age Limit (Self-Employed): 21 to 65 years",
      "Minimum Salary: ₹10,000 per month",
      "Minimum Business Income: ₹2 lakhs per annum",
      "Maximum Loan Term: 30 years",
    ],
    Docs: [
      "KYC of applicant & co-applicant (Aadhar, PAN)",
      "Passport size photo (Applicant & Co-applicant)",
      "3 months’ salary slip",
      "1 year bank statement",
      "Address Proof – Electricity Bill / Postpaid Bill / Gas Connection",
      "Property papers with chain documents / Allotment Letter / Payment receipts",
      "Form 16 / ITR for past 2 financial years",
    ],
    Types: [
      {
        titl: "Standard Home Loan",
        des: "The most common and preferred type of home loan.",
      },
      {
        titl: "Construction Loan",
        des: "Loan designed for constructing a new home.",
      },
      {
        titl: "Home Improvement & Extension Loan",
        des: "Used for renovation or extending your home.",
      },
      {
        titl: "Adjustable-Rate Mortgage (ARM)",
        des: "Interest rate may vary, with caps to prevent large fluctuations.",
      },
    ],
  },
  {
    id: "education_loan",
    Title: "Education Loan",
    image: "/d4.jpg",
    overview: [
      "An education loan helps you or your loved ones achieve academic dreams without financial worries. Whether it's higher education in India or abroad, our student-friendly loans cover tuition fees, living expenses, and other educational costs with low-interest rates and easy repayment plans.",
      "With a simple application process, quick disbursal, and no collateral for eligible students, we ensure uninterrupted learning. Focus on your studies while we take care of the finances.",
      "Finance for students pursuing domestic or international courses.",
    ],
    tagline: "Invest in Your Future",

    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months*",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Indian Citizenship required",
      "Minimum 50% marks in HSC & Graduation",
      "Admission to career-oriented courses (Medical, Engineering, Management, etc.)",
      "Admission based on entrance exam or merit",
      "Co-applicant must provide proof of regular income",
    ],
    Docs: [
      "ID Proof: PAN, Driving License, Voter ID, Aadhar",
      "Address Proof: Aadhar, Passport, Voter ID, DL",
      "10th, 12th & Graduation mark sheets",
      "Admission letter & fee schedule",
      "Exam scorecards (CAT, GRE, SAT, etc.)",
      "Co-applicant documents: PAN, Address Proof",
      "Property documents (if required)",
    ],
    Types: [
      {
        titl: "Domestic Education Loan",
        des: "For education in Indian institutions.",
      },
      {
        titl: "Study Abroad Education Loan",
        des: "For students pursuing education abroad.",
      },
      {
        titl: "Undergraduate Education Loan",
        des: "Loans for 3–5 year bachelor's degree programs.",
      },
      {
        titl: "Postgraduate Education Loan",
        des: "Loans for 2-year masters degree programs.",
      },
    ],
  },
  {
    id: "auto_loan",
    Title: "Machinery Loan",
    image: "/d5.jpg",
    overview: [
      "A machinery or auto loan helps businesses and individuals invest in the right equipment or vehicle without financial burden. Whether you need machinery for business or a vehicle for personal/commercial use, our loans offer competitive rates and convenient repayment plans.",
      "With fast approvals, minimal documentation, and flexible tenure, we make it easy to upgrade your assets and fuel your growth.",
      "Loans for new/used vehicles and refinance of existing vehicle loans.",
    ],
    tagline: "Power Your Growth",

    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months*",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Age: 21 to 65 years",
      "Limited companies must be at least 3 years old",
      "Minimum business stability of 2–3 years",
    ],
    Docs: [
      "KYC: Aadhar, PAN",
      "Latest 3 months' salary slips / Form 16",
      "6 months' bank statement",
      "ITR for last 2 years / Audited P&L & Balance Sheet",
      "Business ownership proof / Registration documents",
    ],
    Types: [
      { titl: "Car Loans", des: "Finance your new car with ease." },
      { titl: "Two-Wheeler Loan", des: "Affordable financing for bikes." },
      {
        titl: "Commercial Vehicle Loans",
        des: "For trucks, mixers, vans, and more.",
      },
      {
        titl: "Loan Against Vehicle",
        des: "Use your owned vehicle as collateral.",
      },
    ],
  },
  {
    id: "business_loan",
    Title: "Business Loan",
    image: "/d2.jpg",
    overview: [
      "A business loan empowers entrepreneurs and businesses with the capital they need to grow and scale. Whether you’re launching a startup, expanding operations, or managing working capital, our business loans provide quick funding with minimal hassle.",
      "Enjoy flexible repayment options, competitive interest rates, and fast approvals—designed to support your business vision.",
      "Working capital and term loans for businesses (manufacturing, trading, services).",
    ],
    tagline: "Expand & Succeed Without Limits",

    TbData: [
      "₹40 Lakhs",
      "Tenure from 12 months to 84 months*",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Self-employed individuals, proprietors, Pvt Ltd, partnership firms",
      "Minimum business turnover: ₹40 lakhs",
      "Applicant age: 21 to 65 years",
    ],
    Docs: [
      "Aadhar / Passport / Voter ID / PAN / Driving License",
      "6 months' bank statement",
      "Latest ITR + Audited financials (2 years)",
      "Proof of business continuation",
      "Mandatory documents: Partnership Deed, MOA/AOA, Board Resolution (as applicable)",
    ],
    Types: [
      {
        titl: "Term Loans",
        des: "Used for long-term growth and capital investment.",
      },
      {
        titl: "Working Capital Loans",
        des: "Fund day-to-day operational expenses.",
      },
      {
        titl: "Merchant Cash Advance",
        des: "Short-term online funding option.",
      },
      {
        titl: "Startup Loans",
        des: "Capital for new businesses and entrepreneurs.",
      },
    ],
  },
  {
    id: "loan_against_property",
    Title: "Loan Against Property",
    image: "/d3.jpg",
    overview: [
      "A Loan Against Property (LAP) helps you unlock the value of your residential or commercial property to meet major financial needs—business expansion, medical expenses, education, or personal requirements.",
      "Enjoy high loan amounts, lower interest rates, and long repayment tenure while keeping ownership of your property.",
      "Secured loan against residential or commercial property",
    ],
    tagline: "Unlock the Power of Your Property",

    TbData: [
      "₹40 Lakhs (may vary based on property value)",
      "Tenure up to 15 years (varies by lender)",
      "Starting from 11.1% p.a.",
      "Up to 2% of loan amount + GST",
    ],
    EliCr: [
      "Salaried or Self-Employed individuals",
      "Clear and marketable property documents required",
      "Stable income proof",
      "Age 21–65 years",
    ],
    Docs: [
      "Aadhar Card & PAN Card",
      "6 months bank statement / passbook",
      "Salary slips (3 months) – For Salaried",
      "Form 16 (Last 2 years) – For Salaried",
      "Business Registration & ITR (2 years) – For Self-Employed",
      "Complete Property Documents with chain",
    ],
    Types: [
      {
        titl: "LAP for Personal Use",
        des: "Fund large personal expenses using property value.",
      },
      {
        titl: "LAP for Business Expansion",
        des: "Get capital for scaling or operations.",
      },
      {
        titl: "Commercial Property LAP",
        des: "Borrow against commercial premises.",
      },
      {
        titl: "Residential Property LAP",
        des: "Borrow against self-owned residential property.",
      },
    ],
  },
];

export default NewServices;
