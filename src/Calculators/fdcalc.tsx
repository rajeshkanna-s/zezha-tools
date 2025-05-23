import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const FDCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [investment, setInvestment] = useState<number>(100000);
  const [rate, setRate] = useState<number>(5);
  const [timePeriod, setTimePeriod] = useState<number>(3);
  const [timeUnit, setTimeUnit] = useState<string>("years");

  const [principal, setPrincipal] = useState<number>(0);
  const [returns, setReturns] = useState<number>(0);
  const [maturity, setMaturity] = useState<number>(0);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [errors, setErrors] = useState({
    investment: "",
    rate: "",
    timePeriod: "",
  });

  const calculateFD = () => {
    let hasError = false;
    const newErrors = { investment: "", rate: "", timePeriod: "" };

    if (!investment || investment < 500) {
      newErrors.investment = "Please enter a valid investment amount (>= 500).";
      hasError = true;
    }
    if (!rate || rate <= 0) {
      newErrors.rate = "Please enter a valid interest rate.";
      hasError = true;
    }
    if (!timePeriod || timePeriod <= 0) {
      newErrors.timePeriod = "Please enter a valid time period.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    let months = timePeriod;
    if (timeUnit === "years") months *= 12;

    const n = 4; // Quarterly compounding
    const calculatedMaturity = Math.round(
      investment * Math.pow(1 + rate / 100 / n, (n * months) / 12)
    );
    const calculatedReturn = Math.round(calculatedMaturity - investment);

    setPrincipal(investment);
    setReturns(calculatedReturn);
    setMaturity(calculatedMaturity);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">FD CALCULATOR</h2>

            <div className="mb-3">
              <label className="form-label">Total Investment (₹):</label>
              <input
                type="number"
                className="form-control"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
              />
              {errors.investment && (
                <div className="text-danger small">{errors.investment}</div>
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

            <button onClick={calculateFD} className="btn btn-success w-100">
              Calculate FD
            </button>

            <div className="mt-4 p-3 bg-light border rounded">
              <h5 className="text-center mb-3">FD Calculation Result</h5>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total Investment</span>
                  <strong>₹{principal.toLocaleString("en-IN")}</strong>
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

export default FDCalculator;
