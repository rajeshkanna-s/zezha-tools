import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";
import "../assets/CSS/BasicCalculator.css"; // for custom styling

const BasicCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClick = (value: string) => {
    if (value === "C") {
      setInput("");
    } else if (value === "=") {
      try {
        // Replace × and ÷ for eval-friendly symbols
        const result = eval(input.replace(/×/g, "*").replace(/÷/g, "/"));
        setInput(result.toString());
      } catch {
        setInput("Error");
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "×",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
    "C",
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4 calculator-container">
            <h2 className="text-center mb-4">Basic Calculator</h2>

            <input
              type="text"
              className="form-control mb-3 text-end fs-4"
              value={input}
              readOnly
            />

            <div className="calculator-grid">
              {buttons.map((btn, idx) => (
                <button
                  key={idx}
                  className={`btn btn-outline-dark calc-btn ${
                    btn === "=" ? "btn-success" : ""
                  } ${btn === "C" ? "btn-danger" : ""}`}
                  onClick={() => handleClick(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BasicCalculator;
