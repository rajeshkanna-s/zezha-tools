import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

interface BreakdownEntry {
  yearOrMonth: number;
  interestPaid: number;
  principalPaid: number;
  balance: number;
}

const LOANCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const [loanAmount, setLoanAmount] = useState("5,00,000");
  const [rate, setRate] = useState<number | string>(8.5);
  const [loanTenure, setLoanTenure] = useState("1");
  const [timeUnit, setTimeUnit] = useState<"years" | "months">("years");

  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownEntry[]>([]);

  const [errors, setErrors] = useState({
    loanAmount: "",
    rate: "",
    loanTenure: "",
  });

  const formatNumber = (num: number) => num.toLocaleString("en-IN");
  const unformatNumber = (str: string) => parseFloat(str.replace(/,/g, ""));

  const calculateEMI = () => {
    let hasError = false;
    const newErrors = {
      loanAmount: "",
      rate: "",
      loanTenure: "",
    };

    const principal = unformatNumber(loanAmount);
    const interestRate = typeof rate === "string" ? parseFloat(rate) : rate;
    const tenure = parseInt(loanTenure);
    const months = timeUnit === "years" ? tenure * 12 : tenure;
    const monthlyRate = interestRate / 12 / 100;

    if (!principal || principal <= 0) {
      newErrors.loanAmount = "Enter a valid loan amount.";
      hasError = true;
    }

    if (!interestRate || interestRate <= 0) {
      newErrors.rate = "Enter a valid interest rate.";
      hasError = true;
    }

    if (!tenure || tenure <= 0 || tenure > 1000) {
      newErrors.loanTenure = "Enter a valid loan tenure (1 - 1000).";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const emiCalc =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPay = emiCalc * months;
    const totalInt = totalPay - principal;

    setEmi(Math.round(emiCalc));
    setTotalPayment(Math.round(totalPay));
    setTotalInterest(Math.round(totalInt));

    let remainingPrincipal = principal;
    const breakdownData: BreakdownEntry[] = [];

    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let i = 1; i <= months; i++) {
      const interestPaid = remainingPrincipal * monthlyRate;
      const principalPaid = emiCalc - interestPaid;
      remainingPrincipal -= principalPaid;

      if (timeUnit === "years") {
        yearlyInterest += interestPaid;
        yearlyPrincipal += principalPaid;

        if (i % 12 === 0 || i === months) {
          breakdownData.push({
            yearOrMonth: Math.ceil(i / 12),
            interestPaid: yearlyInterest,
            principalPaid: yearlyPrincipal,
            balance: Math.max(remainingPrincipal, 0),
          });
          yearlyInterest = 0;
          yearlyPrincipal = 0;
        }
      } else {
        breakdownData.push({
          yearOrMonth: i,
          interestPaid,
          principalPaid,
          balance: Math.max(remainingPrincipal, 0),
        });
      }
    }

    setBreakdown(breakdownData);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">LOAN CALCULATOR</h2>

            {/* Loan Amount Input */}
            <div className="mb-3">
              <label className="form-label">Loan Amount (₹):</label>
              <input
                type="text"
                className="form-control"
                value={loanAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(raw)) {
                    const num = parseFloat(raw);
                    setLoanAmount(raw === "" ? "" : formatNumber(num));
                  }
                }}
              />
              {errors.loanAmount && (
                <div className="text-danger small">{errors.loanAmount}</div>
              )}
            </div>

            {/* Interest Rate */}
            <div className="mb-3">
              <label className="form-label">Interest Rate (%):</label>
              <input
                type="number"
                className="form-control"
                min={0}
                max={100}
                value={rate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setRate("");
                  } else {
                    const num = Number(val);
                    if (!isNaN(num)) setRate(num);
                  }
                }}
              />
              {errors.rate && (
                <div className="text-danger small">{errors.rate}</div>
              )}
            </div>

            {/* Loan Tenure */}
            <div className="mb-3">
              <label className="form-label">Loan Tenure:</label>
              <div className="input-group">
                <select
                  className="form-select"
                  value={timeUnit}
                  onChange={(e) =>
                    setTimeUnit(e.target.value as "years" | "months")
                  }
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  value={loanTenure}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      if (val === "" || parseInt(val) <= 1000)
                        setLoanTenure(val);
                    }
                  }}
                />
              </div>
              {errors.loanTenure && (
                <div className="text-danger small">{errors.loanTenure}</div>
              )}
            </div>

            <button className="btn btn-primary w-100" onClick={calculateEMI}>
              Calculate EMI
            </button>

            {/* Results Display */}
            <div className="mt-4 p-3 bg-light border rounded">
              <h5 className="text-center mb-3">EMI Calculation Result</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between text-success fw-bold">
                  <span>Monthly EMI</span>
                  <span>₹{formatNumber(emi)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between text-success fw-bold">
                  <span>Total Interest</span>
                  <span>₹{formatNumber(totalInterest)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between text-success fw-bold">
                  <span>Total Payment</span>
                  <span>₹{formatNumber(totalPayment)}</span>
                </li>
              </ul>
            </div>

            {/* Breakdown Table */}
            {breakdown.length > 0 && (
              <div className="mt-4">
                <h5 className="text-center">Interest Breakdown</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm table-striped text-center">
                    <thead>
                      <tr>
                        <th>{timeUnit === "years" ? "Year" : "Month"}</th>
                        <th>Interest Paid (₹)</th>
                        <th>Principal Paid (₹)</th>
                        <th>Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.yearOrMonth}</td>
                          <td>
                            {formatNumber(Math.round(entry.interestPaid))}
                          </td>
                          <td>
                            {formatNumber(Math.round(entry.principalPaid))}
                          </td>
                          <td>{formatNumber(Math.round(entry.balance))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Chart */}
            {breakdown.length > 0 && (
              <div className="mt-5">
                <h5 className="text-center mb-3">
                  Principal vs Interest Over Time
                </h5>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={breakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="yearOrMonth"
                        label={{
                          value: timeUnit === "years" ? "Year" : "Month",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `₹${formatNumber(value)}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="principalPaid"
                        stroke="#28a745"
                        fill="#28a745"
                        name="Principal Paid"
                      />
                      <Area
                        type="monotone"
                        dataKey="interestPaid"
                        stroke="#dc3545"
                        fill="#dc3545"
                        name="Interest Paid"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LOANCalculator;
