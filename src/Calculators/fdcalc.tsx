import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const FDCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [investment, setInvestment] = useState<string>("1,00,000");
  const [rate, setRate] = useState<string | number>(5);
  const [timePeriod, setTimePeriod] = useState<string>("3");
  const [timeUnit, setTimeUnit] = useState<string>("years");

  const [principal, setPrincipal] = useState<number>(0);
  const [returns, setReturns] = useState<number>(0);
  const [maturity, setMaturity] = useState<number>(0);

  const [errors, setErrors] = useState({
    investment: "",
    rate: "",
    timePeriod: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const formatNumber = (num: number) => num.toLocaleString("en-IN");
  const unformatNumber = (str: string) => parseFloat(str.replace(/,/g, ""));

  const calculateFD = () => {
    let hasError = false;
    const newErrors = { investment: "", rate: "", timePeriod: "" };

    const inv = unformatNumber(investment);
    const interestRate = typeof rate === "string" ? parseFloat(rate) : rate;
    const period = parseFloat(timePeriod);

    const maxPeriod = timeUnit === "years" ? 50 : 600;

    if (!inv || inv < 500) {
      newErrors.investment = "Please enter a valid investment amount (≥ 500).";
      hasError = true;
    }
    if (!interestRate || interestRate <= 0) {
      newErrors.rate = "Please enter a valid interest rate.";
      hasError = true;
    }
    if (!period || period <= 0 || period > maxPeriod) {
      newErrors.timePeriod = `Please enter a valid time period (1 - ${maxPeriod}).`;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    let months = period;
    if (timeUnit === "years") months *= 12;

    const n = 4; // Quarterly compounding
    const calculatedMaturity = Math.round(
      inv * Math.pow(1 + interestRate / 100 / n, (n * months) / 12)
    );
    const calculatedReturn = Math.round(calculatedMaturity - inv);

    setPrincipal(inv);
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
                type="text"
                className="form-control"
                value={investment}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(raw)) {
                    if (raw === "") {
                      setInvestment("");
                    } else {
                      const num = parseFloat(raw);
                      if (!isNaN(num)) {
                        setInvestment(formatNumber(num));
                      }
                    }
                  }
                }}
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
                  type="text"
                  className="form-control"
                  value={timePeriod}
                  onChange={(e) => {
                    const val = e.target.value;
                    const maxVal = timeUnit === "years" ? 50 : 600;
                    if (/^\d*$/.test(val)) {
                      if (val === "" || parseInt(val) <= maxVal) {
                        setTimePeriod(val);
                      }
                    }
                  }}
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
                <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                  <span>Total Investment</span>
                  <strong>₹{principal.toLocaleString("en-IN")}</strong>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default FDCalculator;
