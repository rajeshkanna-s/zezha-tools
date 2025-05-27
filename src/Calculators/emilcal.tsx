import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const EMICalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loanAmount, setLoanAmount] = useState<string>("5,00,000");
  const [rate, setRate] = useState<string | number>(8.5);
  const [loanTenure, setLoanTenure] = useState<string>("1");
  const [timeUnit, setTimeUnit] = useState<string>("years");

  const [emi, setEmi] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  const [errors, setErrors] = useState({
    loanAmount: "",
    rate: "",
    loanTenure: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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

    const months = timeUnit === "years" ? tenure * 12 : tenure;
    const monthlyRate = interestRate / 12 / 100;

    const emiCalc =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPay = emiCalc * months;
    const totalInt = totalPay - principal;

    setEmi(Math.round(emiCalc));
    setTotalPayment(Math.round(totalPay));
    setTotalInterest(Math.round(totalInt));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">EMI CALCULATOR</h2>

            <div className="mb-3">
              <label className="form-label">Loan Amount (₹):</label>
              <input
                type="text"
                className="form-control"
                value={loanAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(raw)) {
                    if (raw === "") {
                      setLoanAmount("");
                    } else {
                      const num = parseFloat(raw);
                      if (!isNaN(num)) {
                        setLoanAmount(formatNumber(num));
                      }
                    }
                  }
                }}
              />
              {errors.loanAmount && (
                <div className="text-danger small">{errors.loanAmount}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Rate of Interest (%):</label>
              <input
                type="number"
                className="form-control"
                min={0}
                max={100}
                value={rate === "" ? "" : rate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setRate("");
                    return;
                  }
                  const num = Number(val);
                  if (!isNaN(num) && num >= 0 && num <= 100) {
                    setRate(num);
                  }
                }}
              />
              {errors.rate && (
                <div className="text-danger small">{errors.rate}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Loan Tenure:</label>
              <div className="input-group">
                <select
                  className="form-select"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
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
                      if (val === "" || parseInt(val) <= 1000) {
                        setLoanTenure(val);
                      }
                    }
                  }}
                />
              </div>
              {errors.loanTenure && (
                <div className="text-danger small">{errors.loanTenure}</div>
              )}
            </div>

            <button onClick={calculateEMI} className="btn btn-success w-100">
              Calculate EMI
            </button>

            <div className="mt-4 p-3 bg-light border rounded">
              <h5 className="text-center mb-3">EMI Calculation Result</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                  <span>Monthly EMI</span>
                  <strong>₹{emi.toLocaleString("en-IN")}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                  <span>Total Interest</span>
                  <strong>₹{totalInterest.toLocaleString("en-IN")}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                  <span>Total Payment</span>
                  <strong>₹{totalPayment.toLocaleString("en-IN")}</strong>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EMICalculator;
