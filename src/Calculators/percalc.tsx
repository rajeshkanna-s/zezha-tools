import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const PercentageCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [partStr, setPartStr] = useState("0");
  const [totalStr, setTotalStr] = useState("100");
  const [percentage, setPercentage] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    part: "",
    total: "",
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

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setPartStr(formatNumberWithCommas(rawValue));
    }
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setTotalStr(formatNumberWithCommas(rawValue));
    }
  };

  const calculatePercentage = () => {
    const part = Number(partStr.replace(/,/g, ""));
    const total = Number(totalStr.replace(/,/g, ""));

    let hasError = false;
    const newErrors = {
      part: "",
      total: "",
    };

    if (isNaN(part) || part < 0) {
      newErrors.part = "Enter a valid number.";
      hasError = true;
    }

    if (isNaN(total) || total <= 0) {
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
                type="text"
                className="form-control"
                value={partStr}
                onChange={handlePartChange}
                placeholder="Enter part value"
              />
              {errors.part && (
                <div className="text-danger small">{errors.part}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Total:</label>
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
