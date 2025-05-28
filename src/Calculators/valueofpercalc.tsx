import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const PercentageCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [totalStr, setTotalStr] = useState("0");
  const [percentage, setPercentage] = useState<number | null>(0);
  const [result, setResult] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    total: "",
    percentage: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const formatNumberWithCommas = (value: string) => {
    const num = value.replace(/,/g, "");
    if (!isNaN(Number(num))) {
      return Number(num).toLocaleString("en-IN");
    }
    return value;
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setTotalStr(formatNumberWithCommas(rawValue));
    }
  };

  const calculateValue = () => {
    const total = Number(totalStr.replace(/,/g, ""));

    let hasError = false;
    const newErrors = {
      total: "",
      percentage: "",
    };

    if (isNaN(total) || total <= 0) {
      newErrors.total = "Enter a valid total value.";
      hasError = true;
    }

    if (percentage === null || isNaN(percentage) || percentage < 0) {
      newErrors.percentage = "Enter a valid percentage.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setResult(null);
      return;
    }

    const value = (total * percentage!) / 100;
    setResult(Number(value.toFixed(2)));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">Percentage of Total Value</h2>

            <div className="mb-3">
              <label className="form-label">Percentage (%):</label>
              <input
                type="number"
                className="form-control"
                min={0}
                max={100}
                value={percentage ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setPercentage(null);
                  } else {
                    const numericValue = Number(value);
                    if (numericValue >= 0 && numericValue <= 100) {
                      setPercentage(numericValue);
                    }
                  }
                }}
              />
              {errors.percentage && (
                <div className="text-danger small">{errors.percentage}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Total Value:</label>
              <input
                type="text"
                className="form-control"
                value={totalStr}
                onChange={handleTotalChange}
                placeholder="Enter total value"
              />
              {errors.total && (
                <div className="text-danger small">{errors.total}</div>
              )}
            </div>

            <button onClick={calculateValue} className="btn btn-primary w-100">
              Calculate Value
            </button>

            {result !== null && (
              <div className="mt-4 p-3 bg-light border rounded">
                <h5 className="text-center mb-3">Result</h5>
                <p className="text-center fs-4 fw-bold text-success">
                  <strong>
                    {percentage}% of ₹{totalStr} is ₹
                    {result.toLocaleString("en-IN")}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PercentageCalculator;
