const services = [
	{
		id: "personal_loan",
		title: "Personal Loan",
		overview: "Unsecured personal loans for salaried and certain self-employed profiles.",
		eligibility: [
			"Age: 21-80 Years",
			"CIBIL Score: 685 or higher",
			"Minimum net take-home salary > 11,000",
			"Employment types accepted: Proprietorship, Partnership, LLP, Pvt. Ltd., Public Ltd., Government (class4)"
		],
		features: [
			"Competitive Interest Rates",
			"Flexible Repayment Terms",
			"Quick Approval Process",
			"No Hidden Fees",
			"Unsecured Loans"
		],
		checklist: [
			"KYC of Applicant (Aadhar Card, PAN Card)",
			"3 months' salary slips",
			"6 months bank statement",
			"Service certificate for Defence personnel (Army, Navy, Air Force)",
			"Passport size photo",
			"Address proof (Electricity bill / Rent agreement / Postpaid bill / Gas connection)",
			"Contact details: email and phone number",
			"2 reference names with number and address",
			"Mother's name"
		]
	},
	{
		id: "home_loan",
		title: "Home Loan",
		overview: "Loans for purchase, construction, balance transfer, self-construction, refinance and builder funding.",
		eligibility: {
			salaried: ["Age: 21 to 65 years", "Minimum salary: ₹10,000 p.m.", "Cash salary accepted / Non-income proof accepted"],
			selfEmployed: ["Age: 21 to 65 years", "Minimum business income: ₹2 lac p.a.", "Maximum loan term: 30 years"],
			partnersOrDirectors: ["Age: 21 to 65 years"]
		},
		documents: {
			salaried: [
				"KYC of primary applicant and co-applicant (Aadhar, PAN)",
				"Passport size photos",
				"3 months' salary slips",
				"Address proof (Electricity bill / Postpaid bill / Gas connection)",
				"1 year bank statement",
				"Property papers with chain documents / Allotment letter / Receipts of advance payments",
				"Form 16 / IT returns for past 2 financial years",
				"Contact details: email, mother's name of primary and co-applicant",
				"2 references with name, number and address"
			],
			selfEmployed: [
				"KYC of primary applicant and co-applicant (Aadhar, PAN)",
				"Passport size photos",
				"3 months' salary slips",
				"Address proof (Electricity bill / Postpaid bill / Gas connection)",
				"1 year bank statement",
				"Property papers with chain documents / Allotment letter / Receipts of advance payments",
				"2-3 years of ITR with computation of income / P&L / Balance Sheet",
				"Business registration proof (Udhyam Registration / Gumasta License / etc.)"
			],
			partnersOrDirectors: [
				"KYC of primary applicant and co-applicant (Aadhar, PAN)",
				"Passport size photos",
				"3 months' salary slips",
				"Address proof (Electricity bill / Postpaid bill / Gas connection)",
				"1 year bank statement",
				"Property papers with chain documents / Allotment letter / Receipts of advance payments",
				"Partner deed / List of partners / Authority letter / DIN of all directors / Board resolution / Company shareholding pattern"
			],
			additionalForBalanceTransfer: [
				"Sanction letter",
				"Statement of loan account",
				"List of documents"
			]
		}
	},
	{
		id: "business_loan",
		title: "Business Loan",
		overview: "Working capital and term loans for businesses (manufacturing, trading, services).",
		eligibility: [
			"Self-employed individuals, proprietors, private ltd. companies and partnership firms",
			"Minimum business turnover: ₹40 lakhs",
			"Applicant age: 21+ at application and not older than 65 at loan maturity"
		],
		documents: [
			"Identity proof: Aadhar / Passport / Voter ID / PAN / Driving License",
			"Bank statements for previous 6 months",
			"Latest ITR with computation of income, Balance Sheet and P&L for previous 2 years (CA certified/audited)",
			"Proof of continuity (ITR / Trade license / Establishment / Sales Tax Certificate)",
			"Other mandatory documents: Sole proprietor declaration OR certified copy of partnership deed OR certified true copy of Memorandum & Articles of Association (certified by Director) & Board resolution (original)"
		]
	},
	{
		id: "auto_loan",
		title: "Auto Loan (and Refinance)",
		overview: "Loans for new/used vehicles and refinance of existing vehicle loans.",
		eligibility: [
			"Age: 21 to below 65 years",
			"Limited companies should be at least 3 years old",
			"Income stability: minimum 2-3 years for self-employed"
		],
		documents: {
			salaried: [
				"KYC (Aadhar, PAN)",
				"Latest 3 months' salary slips and Form 16",
				"Bank statements for previous 6 months"
			],
			selfEmployed: [
				"KYC (Aadhar, PAN)",
				"Latest salary proof and Form 16",
				"Bank statements for previous 6 months",
				"Business ownership proof (office address proof / maintenance bill / utility bill / business registration license)",
				"Income tax returns for last 2 years / Audited balance sheet / Profit & Loss statement"
			],
			note: "For car refinance, additional documents required: Registration Certificate and Insurance"
		}
	},
	{
		id: "loan_against_property",
		title: "Loan Against Property (LAP)",
		overview: "Secured loan against residential or commercial property.",
		documents: {
			salaried: [
				"Aadhar Card, PAN Card",
				"Latest bank statement / passbook showing salary credited for previous 6 months",
				"3 months' salary slips",
				"Form 16 for previous 2 years",
				"Copies of all property documents to be pledged"
			],
			selfEmployed: [
				"Aadhar Card, PAN Card",
				"Latest bank statement / passbook showing credited income for previous 6 months",
				"Business registration proof",
				"ITR with computation for 2 years",
				"Registry / Purchase agreement / Property paper with chain documents"
			]
		}
	},
	{
		id: "education_loan",
		title: "Education Loan (Domestic & International)",
		overview: "Finance for students pursuing domestic or international courses.",
		studentChecklist: [
			"ID proof (PAN, Driving License, Voter ID, Aadhar). Passport mandatory for abroad courses. Form 60 if PAN not available.",
			"Address proof (Passport, Voter ID, Aadhar, DL)",
			"10th, 12th & graduation mark sheets",
			"Copy of admission letter along with fee schedule",
			"Marksheet of qualifying exam (CAT, GRE, SAT, MAT, TOEFL, etc.)",
			"1 passport size photo",
			"If salaried: 3 salary slips, Form 16 & 6 months bank statement"
		],
		coApplicant: {
			salaried: [
				"PAN Card",
				"Address proof (Passport, Voter ID, Aadhar, DL)",
				"1 photo",
				"Latest 3 months' salary slips",
				"6 months bank account statement",
				"Latest Form 16 for 2 years",
				"Existing loan repayment track record for 6 months"
			],
			selfEmployed: [
				"PAN Card",
				"Address proof (Passport, Voter ID, Aadhar, DL)",
				"1 photo",
				"Last 3 years ITR with computation of income, balance sheet and P&L",
				"6 months bank account statement for saving & current accounts",
				"Shop Act (Gumasta)",
				"Existing loan repayment track record for 6 months",
				"Partnership deed (if applicable)",
				"MOU, AOA, COI for private limited companies"
			]
		},
		propertyDocuments: [
			"T&CP and Diversion",
			"Map",
			"Registry",
			"Prakoshta (in case of flat)",
			"Colony layout plan",
			"Chain documents",
			"Builder permission",
			"Allotment letter (in case of IDA)",
			"Mutations (in case of IDA)",
			"Mortgage NOC (in case of IDA)"
		]
	},
];

export default services;
