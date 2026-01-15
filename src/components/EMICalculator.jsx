import React, { useState, useEffect } from "react";
import { FaChartPie, FaCalculator, FaPercentage, FaMoneyBillWave } from "react-icons/fa";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import "./ServicePageRefactored.css";

const EMICalculator = ({
    defaultAmount = 500000,
    defaultInterest = 11,
    defaultTenure = 60, // months
    maxAmount = 5000000,
    title = "Loan"
}) => {
    // Convert defaults for state
    const defaultTenureYears = Math.max(1, Math.round(defaultTenure / 12));

    const [loanAmount, setLoanAmount] = useState(defaultAmount);
    const [tenureYears, setTenureYears] = useState(defaultTenureYears);
    const [interest, setInterest] = useState(defaultInterest);

    const [emi, setEmi] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [amortizationData, setAmortizationData] = useState([]);

    useEffect(() => {
        setLoanAmount(defaultAmount);
        setTenureYears(Math.max(1, Math.round(defaultTenure / 12)));
        setInterest(defaultInterest);
    }, [defaultAmount, defaultInterest, defaultTenure]);

    useEffect(() => {
        calculateEMI();
    }, [loanAmount, tenureYears, interest]);

    const calculateEMI = () => {
        const P = loanAmount;
        const R = interest / 12 / 100;
        const N = tenureYears * 12;

        let emiValue = 0;
        if (P === 0 || N === 0) {
            emiValue = 0;
        } else if (R === 0) {
            emiValue = P / N;
        } else {
            emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        }

        if (!isFinite(emiValue)) emiValue = 0;

        const total = emiValue * N;
        const interestTotal = total - P;

        setEmi(Math.round(emiValue));
        setTotalPayment(Math.round(total));
        setTotalInterest(Math.round(interestTotal));

        // Calculate Amortization Data for Chart (Yearly Balance)
        const data = [];
        let balance = P;
        const yearlyDataPoints = 6; // Show limited points for cleaner chart
        const step = Math.max(1, Math.floor(tenureYears / yearlyDataPoints));

        // Initial Point
        data.push({ year: 0, balance: Math.round(P), principalPaid: 0, interestPaid: 0 });

        for (let i = 1; i <= tenureYears; i++) {
            // Simple approximation for chart points
            // In real amortization, balance drops non-linearly, but for year-end it's close enough for visuals
            // Or calculate exact: B = P * ((1+r)^n - (1+r)^p) / ((1+r)^n - 1)
            // p = payments made (i * 12)
            const p = i * 12;
            let bal = 0;
            if (R === 0) {
                bal = P - (emiValue * p);
            } else {
                bal = (P * (Math.pow(1 + R, N) - Math.pow(1 + R, p))) / (Math.pow(1 + R, N) - 1);
            }

            if (bal < 0) bal = 0;

            data.push({
                year: `Yr ${i}`,
                balance: Math.round(bal),
                paid: Math.round(total - (emiValue * (N - p)))
            });
        }
        setAmortizationData(data);
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined || num === "") return "-";
        return new Intl.NumberFormat("en-IN").format(num);
    };

    const pieData = [
        { name: "Principal", value: parseInt(loanAmount) || 0 },
        { name: "Interest", value: parseInt(totalInterest) || 0 },
    ];

    const COLORS = ["#0869ff", "#ff451f"];

    return (
        <div className="new-emi-dashboard">
            <div className="ned-header">
                <div className="ned-title-group">
                    <div className="ned-icon"><FaCalculator /></div>
                    <div>
                        <h3>Calculate Interest on {title}</h3>
                        <p>Customize your loan details and get a comprehensive breakdown.</p>
                    </div>
                </div>
                <div className="ned-header-badge">
                    <span>Interest Rate:</span> <strong>{interest}%</strong>
                </div>
            </div>

            <div className="ned-body-horizontal">
                {/* Left Panel: Inputs */}
                <div className="ned-panel-left">
                    <h4 className="ned-panel-title">Configure Loan</h4>

                    <div className="ned-control-group">
                        <div className="ned-label-row">
                            <label>Loan Amount</label>
                            <div className="ned-value-display">₹ {formatNumber(loanAmount)}</div>
                        </div>
                        <input
                            type="range"
                            min={10000}
                            max={maxAmount}
                            step={5000}
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="ned-slider"
                            style={{ backgroundSize: `${(loanAmount / maxAmount) * 100}% 100%` }}
                        />
                    </div>

                    <div className="ned-control-group">
                        <div className="ned-label-row">
                            <label>Tenure (Years)</label>
                            <div className="ned-value-display">{tenureYears} Years</div>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={30}
                            value={tenureYears}
                            onChange={(e) => setTenureYears(Number(e.target.value))}
                            className="ned-slider"
                            style={{ backgroundSize: `${(tenureYears / 30) * 100}% 100%` }}
                        />
                    </div>

                    <div className="ned-control-group">
                        <div className="ned-label-row">
                            <label>Interest Rate (% p.a.)</label>
                            <div className="ned-value-display">{interest}%</div>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={25}
                            step={0.1}
                            value={interest}
                            onChange={(e) => setInterest(Number(e.target.value))}
                            className="ned-slider"
                            style={{ backgroundSize: `${((interest - 5) / 20) * 100}% 100%` }}
                        />
                    </div>

                    <div className="ned-result-card">
                        <div className="ned-rc-label">Your Monthly EMI</div>
                        <div className="ned-rc-value">₹ {formatNumber(emi)}</div>
                        <div className="ned-rc-sub">Total Payable: ₹ {formatNumber(totalPayment)}</div>
                    </div>
                </div>

                {/* Right Panel: Visualization & Details */}
                <div className="ned-panel-right">
                    {/* Top Row: Charts */}
                    <div className="ned-charts-row">
                        <div className="ned-chart-box">
                            <h5>Breakdown</h5>
                            <div className="ned-pie-wrapper">
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={2}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹ ${formatNumber(value)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="ned-pie-overlay">
                                    <span>Ratio</span>
                                </div>
                            </div>
                        </div>

                        <div className="ned-chart-box wide">
                            <h5>Balance Trend</h5>
                            <ResponsiveContainer width="100%" height={160}>
                                <AreaChart data={amortizationData}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0869ff" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#0869ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip formatter={(value) => `₹ ${formatNumber(value)}`} />
                                    <Area type="monotone" dataKey="balance" stroke="#0869ff" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Row: Detailed Stats Grid */}
                    <div className="ned-details-grid">
                        <div className="ned-detail-item">
                            <div className="ned-di-icon"><FaMoneyBillWave /></div>
                            <div className="ned-di-content">
                                <span>Principal Amount</span>
                                <strong>₹ {formatNumber(loanAmount)}</strong>
                            </div>
                        </div>
                        <div className="ned-detail-item">
                            <div className="ned-di-icon" style={{ color: '#ff451f', background: '#fff0ec' }}><FaPercentage /></div>
                            <div className="ned-di-content">
                                <span>Total Interest</span>
                                <strong>₹ {formatNumber(totalInterest)}</strong>
                            </div>
                        </div>
                        <div className="ned-detail-item">
                            <div className="ned-di-icon" style={{ color: '#10b981', background: '#ecfdf5' }}><FaCalculator /></div>
                            <div className="ned-di-content">
                                <span>Total Payable</span>
                                <strong>₹ {formatNumber(totalPayment)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMICalculator;
