import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const RDCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [monthlyInvestmentStr, setMonthlyInvestmentStr] = useState("1,000");
  const [rateStr, setRateStr] = useState("5");
  const [timePeriodStr, setTimePeriodStr] = useState("1");
  const [timeUnit, setTimeUnit] = useState<"years" | "months">("years");

  const [totalInvestment, setTotalInvestment] = useState(0);
  const [returns, setReturns] = useState(0);
  const [maturity, setMaturity] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [errors, setErrors] = useState({
    monthlyInvestment: "",
    rate: "",
    timePeriod: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const formatNumber = (num: number) => num.toLocaleString("en-IN");
  const unformatNumber = (str: string) => parseFloat(str.replace(/,/g, ""));

  const calculateRD = () => {
    const monthlyInvestment = unformatNumber(monthlyInvestmentStr);
    const rate = parseFloat(rateStr);
    const timePeriod = parseFloat(timePeriodStr);

    let hasError = false;
    const newErrors = {
      monthlyInvestment: "",
      rate: "",
      timePeriod: "",
    };

    if (!monthlyInvestment || monthlyInvestment < 500) {
      newErrors.monthlyInvestment =
        "Enter a valid monthly investment (≥ ₹500).";
      hasError = true;
    }
    if (!rate || rate <= 0 || rate > 100) {
      newErrors.rate = "Enter a valid interest rate (0–100%).";
      hasError = true;
    }
    if (!timePeriod || timePeriod <= 0) {
      newErrors.timePeriod = "Enter a valid time period.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      setShowResult(false);
      return;
    }

    const n = 4; // Quarterly compounding
    const months = timeUnit === "years" ? timePeriod * 12 : timePeriod;
    let maturityAmount = 0;

    for (let i = 1; i <= months; i++) {
      const t = (months - i + 1) / 12;
      maturityAmount += monthlyInvestment * Math.pow(1 + rate / 100 / n, n * t);
    }

    maturityAmount = Math.round(maturityAmount);
    const invested = monthlyInvestment * months;
    const earned = maturityAmount - invested;

    setTotalInvestment(invested);
    setReturns(Math.round(earned));
    setMaturity(maturityAmount);
    setShowResult(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">RD CALCULATOR</h2>

            <div className="mb-3">
              <label className="form-label">Monthly Investment (₹):</label>
              <input
                type="text"
                className="form-control"
                value={monthlyInvestmentStr}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(raw)) {
                    if (raw === "") {
                      setMonthlyInvestmentStr("");
                    } else {
                      const num = parseFloat(raw);
                      if (!isNaN(num)) {
                        setMonthlyInvestmentStr(formatNumber(num));
                      }
                    }
                  }
                }}
                placeholder="Enter monthly investment"
              />
              {errors.monthlyInvestment && (
                <div className="text-danger small">
                  {errors.monthlyInvestment}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Rate of Interest (%):</label>
              <input
                type="number"
                className="form-control"
                value={rateStr}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setRateStr("");
                    return;
                  }
                  const numeric = parseFloat(value);
                  if (!isNaN(numeric) && numeric >= 0 && numeric <= 100) {
                    setRateStr(value);
                  }
                }}
                placeholder="Enter interest rate"
              />
              {errors.rate && (
                <div className="text-danger small">{errors.rate}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Time Period:</label>
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
                  value={timePeriodStr}
                  onChange={(e) => setTimePeriodStr(e.target.value)}
                  placeholder="Enter duration"
                />
              </div>
              {errors.timePeriod && (
                <div className="text-danger small">{errors.timePeriod}</div>
              )}
            </div>

            <button onClick={calculateRD} className="btn btn-success w-100">
              Calculate RD
            </button>

            {showResult && (
              <div className="mt-4 p-3 bg-light border rounded">
                <h5 className="text-center mb-3">RD Calculation Result</h5>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Total Investment</span>
                    <strong>₹{totalInvestment.toLocaleString("en-IN")}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Return Earned</span>
                    <strong>₹{returns.toLocaleString("en-IN")}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Maturity Amount</span>
                    <strong>₹{maturity.toLocaleString("en-IN")}</strong>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RDCalculator;
