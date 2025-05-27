import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const PercentageCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [total, setTotal] = useState<number | null>(0);
  const [percentage, setPercentage] = useState<number | null>(0);
  const [result, setResult] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    total: "",
    percentage: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const calculateValue = () => {
    let hasError = false;
    const newErrors = {
      total: "",
      percentage: "",
    };

    if (total === null || isNaN(total) || total <= 0) {
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

    const value = (total! * percentage!) / 100;
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
                    setPercentage(null); // Allow empty value
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
                type="number"
                className="form-control"
                min={1}
                max={100}
                value={total === null || isNaN(total) ? "" : total}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setTotal(null);
                  } else {
                    setTotal(Number(value.replace(/^0+(?=\d)/, "")));
                  }
                }}
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
                    {percentage}% of {total} is {result}
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
