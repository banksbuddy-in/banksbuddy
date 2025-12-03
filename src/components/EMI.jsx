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
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateEMI = () => {
    const P = loanAmount;
    const R = interest / 12 / 100;
    const N = tenure * 12;
    let emiValue = 0;
    if (R === 0) {
      emiValue = P / N;
    } else {
      emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }

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
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "-";
    return new Intl.NumberFormat("en-US").format(num);
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
            min={0}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
        </div>

        <div className="memitenu">
          <section className="smemi1">

          
          <label>Tenure (Years)</label>
          <div className="range-row">
            <input
              type="number"
              value={tenure}
              min={1}
              max={50}
              onChange={(e) => {
                let v = Number(e.target.value);
                if (isNaN(v)) return;
                if (v < 1) v = 1;
                if (v > 50) v = 50;
                setTenure(v);
              }}
            />
          </div>
          </section>
          <input
            type="range"
            min={1}
            max={50}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
          />
        </div>

        <div className="memiint">
          <section className="smemi2">
            <label>Interest Rate (% p.a.)</label>
            <div className="range-row">
              <input
                type="number"
                value={interest}
                min={1}
                max={40}
                step={0.1}
                onChange={(e) => {
                  let v = Number(e.target.value);
                  if (isNaN(v)) return;
                  if (v < 0) v = 0;
                  if (v > 40) v = 40;
                  setInterest(v);
                }}
              />
            </div>
          </section>
          <input
            type="range"
            min={1}
            max={40}
            step={0.1}
            value={interest}
            onChange={(e) => setInterest(Number(e.target.value))}
          />
        </div>

        <button onClick={calculateEMI}>Calculate EMI</button>
      </div>
      {emi && (
        <div className={"emic2" + (emi ? " emic2active" : "")}>
          <div className="emir1">
            <h3>Monthly EMI</h3>
            <h1>₹{formatNumber(emi)}</h1>
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
                <h1>₹{formatNumber(totalInterest)}</h1>
                <p>Interest Payable</p>
              </div>
              <div className="emitp">
                <p>
                  <PiChartLineUp /> Total payment
                </p>
                <h1>₹{formatNumber(totalPayment)}</h1>
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
