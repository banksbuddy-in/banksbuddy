import React, { useState } from "react";
import { financialTips } from "./Data_financial_tips";
import { FaCalendar, FaCalendarWeek, FaRegLightbulb } from "react-icons/fa";
import { PiChartLineUp } from "react-icons/pi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const EMI = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(20);
  const [interest, setInterest] = useState(8.5);

  const [emi, setEmi] = useState(null);
  const [, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateEMI = () => {
    const P = loanAmount;
    const R = interest / 12 / 100;
    const N = tenure * 12;

    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

    const total = emiValue * N;
    const interestTotal = total - P;

    setEmi(Math.round(emiValue));
    setTotalPayment(Math.round(total));
    setTotalInterest(Math.round(interestTotal));
  };

  const getRandomFinancialTip = () => {
    const index = Math.floor(Math.random() * financialTips.length);
    return financialTips[index].tip;
  };
  const pieData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
  ];

  const COLORS = ["#3b82f6", "#ef4444"];
  return (
    <div id="emicalc">
      <div className={"emic1 " + (emi ? "" : "emic1inactive")}>
        <h2 className="memih">EMI Calculator</h2>

        <div className="memiprin">
          <label>Loan Amount (₹)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
        </div>

        <div className="memitenu">
          <label>Tenure (Years)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
          />
        </div>

        <div className="memiint">
          <label>Interest Rate (% p.a.)</label>
          <input
            type="text"
            value={interest}
            onChange={(e) => {
              let value = e.target.value;

              // Allow empty, ".", "3.", ".5", etc.
              const partialRegex = /^(\d{0,2}(\.\d*)?)?$/;

              // Allow typing freely as long as it looks like a number
              if (!partialRegex.test(value)) return;

              // If the number is valid, enforce max 40
              if (value !== "" && value !== "." && !isNaN(Number(value))) {
                if (Number(value) > 40) return;
              }

              setInterest(value);
            }}
          />
        </div>

        <button onClick={calculateEMI}>Calculate EMI</button>
      </div>
      {emi && (
        <div className={"emic2" + (emi ? " emic2active" : "")}>
          <div className="emir1">
            <h3>Monthly EMI</h3>
            <h1>₹{emi}</h1>
            <p>per month for {tenure} years</p>
          </div>
          <div className="emir2">
            <div className="emir2c1">
              <h3>Payment Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={50}
                    // label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="emir2c2">
              <div className="emiti">
                <p>
                  <FaCalendar /> Total interest
                </p>
                <h1>₹{totalInterest}</h1>
                <p>Interest Payable</p>
              </div>
              <div className="emitp">
                <p>
                  <PiChartLineUp /> Total interest
                </p>
                <h1>₹{totalInterest}</h1>
                <p>Over entire Loan period</p>
              </div>
            </div>
          </div>
          <div className="emir3">
            <FaRegLightbulb />
            <div className="p">
              Financial Tip <br />
              <span>{getRandomFinancialTip()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
