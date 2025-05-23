import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar"; // Adjust path as needed
import "../dashboard/Dashboard.css";

interface TDSSection {
  name: string;
  threshold: number;
  rate?: number;
  rate_individual?: number;
  rate_non_individual?: number;
}

const tdsData: Record<string, TDSSection> = {
  "193": { name: "Interest on securities", threshold: 10000, rate: 0.1 },
  "194A_senior": {
    name: "Interest other than securities (Senior Citizens)",
    threshold: 100000,
    rate: 0.1,
  },
  "194A_others": {
    name: "Interest other than securities (Others)",
    threshold: 50000,
    rate: 0.1,
  },
  "194": { name: "Dividend", threshold: 10000, rate: 0.1 },
  "194K": { name: "Income from Mutual Funds", threshold: 10000, rate: 0.1 },
  "194B": { name: "Winning from Lottery", threshold: 10000, rate: 0.3 },
  "194BB": { name: "Winning from Horse Race", threshold: 10000, rate: 0.3 },
  "194D": { name: "Insurance Commission", threshold: 20000, rate: 0.1 },
  "194G": {
    name: "Commission on Lottery Tickets",
    threshold: 20000,
    rate: 0.05,
  },
  "194H": { name: "Commission or Brokerage", threshold: 20000, rate: 0.05 },
  "194I": { name: "Rent on Property", threshold: 600000, rate: 0.02 },
  "194J": {
    name: "Professional or Technical Fees",
    threshold: 50000,
    rate: 0.1,
  },
  "194LA": {
    name: "Compensation on Land Acquisition",
    threshold: 500000,
    rate: 0.1,
  },
  "194C": {
    name: "Payment to Contractors",
    threshold: 100000,
    rate_individual: 0.01,
    rate_non_individual: 0.02,
  },
  "194M": {
    name: "Payments to Professionals/Contractors (Individuals)",
    threshold: 5000000,
    rate: 0.02,
  },
  "194Q": {
    name: "Purchase of Goods (Business Transactions)",
    threshold: 5000000,
    rate: 0.001,
  },
};

const TDSCalculator: React.FC = () => {
  const [pan, setPan] = useState("yes");
  const [section, setSection] = useState("193");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCalculate = () => {
    const amt = parseFloat(amount);
    setError("");
    setResult(null);

    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const data = tdsData[section];
    const threshold = data.threshold;
    const rate = data.rate ?? data.rate_individual ?? 0;

    if (amt > threshold) {
      let tds = amt * rate;
      if (pan === "no") tds *= 2;
      setResult(`₹${tds.toFixed(2)}`);
    } else {
      setResult("No TDS applicable");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4 max-w-xl mx-auto">
            <h2 className="text-center mb-4">TDS Calculator</h2>

            <label className="form-label">Is PAN Available?</label>
            <select
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="form-select mb-3"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <label className="form-label">Select TDS Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="form-select mb-3"
            >
              {Object.entries(tdsData).map(([code, { name }]) => (
                <option key={code} value={code}>
                  Section {code} - {name}
                </option>
              ))}
            </select>

            <label className="form-label">Enter Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-control mb-2"
              placeholder="Enter amount"
            />
            {error && <div className="text-danger small mb-2">{error}</div>}

            <button onClick={handleCalculate} className="btn btn-success w-100">
              Calculate TDS
            </button>

            {result && (
              <div className="mt-4 p-3 bg-light border rounded text-center">
                <strong>Result:</strong> {result}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TDSCalculator;
