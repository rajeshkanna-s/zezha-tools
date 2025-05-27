import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const PercentageCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [part, setPart] = useState<number>(0);
  const [total, setTotal] = useState<number>(100);
  const [percentage, setPercentage] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    part: "",
    total: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const calculatePercentage = () => {
    let hasError = false;
    const newErrors = {
      part: "",
      total: "",
    };

    if (part < 0) {
      newErrors.part = "Enter a valid number.";
      hasError = true;
    }
    if (total <= 0) {
      newErrors.total = "Total must be greater than zero.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const result = (part / total) * 100;
    setPercentage(Number(result.toFixed(2)));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">Percentage Calculator</h2>

            <div className="mb-3">
              <label className="form-label">Part:</label>
              <input
                type="number"
                className="form-control"
                value={isNaN(part) ? "" : part}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setPart(NaN);
                  } else {
                    setPart(Number(value.replace(/^0+(?=\d)/, "")));
                  }
                }}
              />
              {errors.part && (
                <div className="text-danger small">{errors.part}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Total:</label>
              <input
                type="number"
                className="form-control"
                value={isNaN(total) ? "" : total}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setTotal(NaN);
                  } else {
                    setTotal(Number(value.replace(/^0+(?=\d)/, "")));
                  }
                }}
              />
              {errors.total && (
                <div className="text-danger small">{errors.total}</div>
              )}
            </div>

            <button
              onClick={calculatePercentage}
              className="btn btn-primary w-100"
            >
              Calculate Percentage
            </button>

            {percentage !== null && (
              <div className="mt-4 p-3 bg-light border rounded">
                <h5 className="text-center mb-3">Result</h5>
                <p className="text-center fs-4 fw-bold text-success">
                  <strong>{percentage}%</strong>
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
