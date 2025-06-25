import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "../assets/CSS/commonstyle.css";

const toolCategories = [
  {
    items: [
      { label: "EMI Calculator", path: "/emi-calculator", icon: "📈" },
      { label: "FD Calculator", path: "/fd-calculator", icon: "🏦" },
      { label: "RD Calculator", path: "/rd-calculator", icon: "💰" },
      { label: "SIP Calculator", path: "/sip-calculator", icon: "📊" },
      { label: "TDS Calculator", path: "/tds-calculator", icon: "🧾" },
      { label: "Old Regime Tax", path: "/old-regime-tax", icon: "📜" },
      { label: "New Regime Tax", path: "/new-regime-tax", icon: "🧮" },
      { label: "Tax Compare", path: "/taxcompare-calculator", icon: "🔍" },
      { label: "Loan Calculator", path: "/loan-calculator", icon: "🏠" },
      {
        label: "Percentage Calculator",
        path: "/percentage-calculator",
        icon: "📐",
      },
      {
        label: "Value Of Percentage",
        path: "/value-of-percentage",
        icon: "🔢",
      },
      { label: "DOB Calculator", path: "/dob-calculator", icon: "🎂" },
      { label: "Interest Breakdown", path: "/interest-breakdown", icon: "💹" },
      { label: "Find Day Calculator", path: "/dayfind-calculator", icon: "⏳" },
      { label: "Loan Calculator", path: "/loan-calculator", icon: "🏠" },
    ],
  },
];

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`main-area ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="main-content">
          <h3 className="prompt">What would you like to use?</h3>

          {toolCategories.map((category, catIdx) => (
            <div key={catIdx} className="tool-category">
              <div className="tool-grid">
                {category.items.map((item, itemIdx) => (
                  <Link to={item.path} key={itemIdx} className="tool-card-link">
                    <div className="tool-card">
                      <div className="tool-icon">{item.icon}</div>
                      <div className="tool-label">{item.label}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
