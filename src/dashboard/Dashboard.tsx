import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "../assets/CSS/commonstyle.css";

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
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Zezha Tools</h1>
            <p>Your all-in-one platform for tax, finance, and utility tools</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Tax Tools</h3>
              <ul>
                <li>Old vs New Regime Calculator</li>
                <li>TDS Calculator</li>
                <li>Tax Comparison Tool</li>
              </ul>
            </div>

            <div className="dashboard-card">
              <h3>Finance Tools</h3>
              <ul>
                <li>EMI Calculator</li>
                <li>FD Calculator</li>
                <li>RD Calculator</li>
                <li>SIP Calculator</li>
              </ul>
            </div>
          </div>

          <div className="dashboard-summary">
            <p>More tools coming soon. Stay tuned!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
