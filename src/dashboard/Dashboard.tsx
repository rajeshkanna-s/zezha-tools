import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* Pass state & toggle handler to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Adjust main content class based on sidebar state */}
      <main
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h1>Welcome to Zezha Tools</h1>
        {/* Your existing main content layout */}
      </main>
    </div>
  );
};

export default Dashboard;
