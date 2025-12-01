// import { ref, push } from "firebase/database";
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyCNp-e2-3q7_uJkcZcJ9Wn0hZckv5tTi1s",
//   authDomain: "banksbuddy-fbcc4.firebaseapp.com",
//   projectId: "banksbuddy-fbcc4",
//   storageBucket: "banksbuddy-fbcc4.firebasestorage.app",
//   messagingSenderId: "596302833016",
//   appId: "1:596302833016:web:c5e0212a2680030b81948d",
//   measurementId: "G-BQBBV7PQ43",
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

// const careersData = [
//   {
//     title: "Accounts Payable Executive",
//     description:
//       "Manage supplier invoices, ensure timely payments, and maintain accurate accounting records.",
//     skills: "Accounting, ERP systems, Attention to Detail",
//     message: "Join our finance team to streamline payment processes.",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     title: "Financial Analyst",
//     description:
//       "Analyze financial data, create reports, and help the company make strategic decisions. Requires strong analytical and Excel skills.",
//     skills: "Financial Modeling, Excel, Reporting, Budgeting",
//     message: "We are looking for detail-oriented financial professionals.",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     title: "Investment Banking Associate",
//     description:
//       "Work on mergers, acquisitions, and capital raising projects. Requires financial analysis and client interaction skills.",
//     skills: "Financial Analysis, Valuation, Client Management",
//     message:
//       "Exciting opportunity to grow in a high-paced finance environment.",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     title: "Frontend Developer",
//     description:
//       "We are looking for a skilled Frontend Developer to build responsive web applications using React.js. Passion for UI/UX and performance optimization is a must.",
//     skills: "React.js, JavaScript, HTML, CSS, REST APIs",
//     message: "Join our dynamic team and work on cutting-edge projects!",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     title: "Talent Acquisition Specialist",
//     description:
//       "Source, interview, and hire top talent to meet company needs.",
//     skills: "Sourcing, Interviewing, Candidate Assessment",
//     message: "Help us bring the best people onboard.",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     title: "Backend Developer",
//     description:
//       "Responsible for designing and implementing robust backend systems. Experience with Node.js and database management required. Cloud services knowledge is a plus.",
//     skills: "Node.js, Express.js, MongoDB, SQL, API development",
//     message:
//       "Looking for innovative problem solvers who can take ownership of projects.",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     title: "Digital Marketing Executive",
//     description:
//       "Manage campaigns across social media, email, and search engines. Experience with analytics tools preferred.",
//     skills:
//       "SEO, SEM, Google Analytics, Social Media Marketing, Content Creation",
//     message: "Help us grow our brand online and reach new audiences.",
//     createdAt: new Date().toISOString(),
//   },
// ];

// careersData.forEach(async (job) => {
//   try {
//     await push(ref(db, "careers"), job);
//     console.log(`Pushed: ${job.title}`);
//   } catch (err) {
//     console.error("Error pushing job:", err);
//   }
// });

// console.log("All dummy careers pushed!");
