import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const RDCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(1000);
  const [rate, setRate] = useState<number>(5);
  const [timePeriod, setTimePeriod] = useState<number>(1);
  const [timeUnit, setTimeUnit] = useState<string>("years");

  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [returns, setReturns] = useState<number>(0);
  const [maturity, setMaturity] = useState<number>(0);

  const [errors, setErrors] = useState({
    monthlyInvestment: "",
    rate: "",
    timePeriod: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const calculateRD = () => {
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
    if (!rate || rate <= 0) {
      newErrors.rate = "Enter a valid interest rate.";
      hasError = true;
    }
    if (!timePeriod || timePeriod <= 0) {
      newErrors.timePeriod = "Enter a valid time period.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const n = 4; // Quarterly compounding
    let months = timeUnit === "years" ? timePeriod * 12 : timePeriod;
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
                type="number"
                className="form-control"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
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
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
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
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
                <input
                  type="number"
                  className="form-control"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                />
              </div>
              {errors.timePeriod && (
                <div className="text-danger small">{errors.timePeriod}</div>
              )}
            </div>

            <button onClick={calculateRD} className="btn btn-success w-100">
              Calculate RD
            </button>

            <div className="mt-4 p-3 bg-light border rounded">
              <h5 className="text-center mb-3">RD Calculation Result</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total Investment</span>
                  <strong>₹{totalInvestment.toLocaleString("en-IN")}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Return Earned</span>
                  <strong>₹{returns.toLocaleString("en-IN")}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Maturity Amount</span>
                  <strong>₹{maturity.toLocaleString("en-IN")}</strong>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RDCalculator;
