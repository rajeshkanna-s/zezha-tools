import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const FindDayCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState<string>("");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Set today's date as default on component mount
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(formattedToday);
  }, []);

  const handleFindDay = () => {
    if (!selectedDate) {
      setDayOfWeek("Please select a valid date.");
      return;
    }

    const date = new Date(selectedDate);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    setDayOfWeek(days[date.getDay()]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">FIND DAY CALCULATOR</h2>

            <div className="mb-3">
              <label className="form-label">Select Any Date (1900–2999):</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="1900-01-01"
                max="2999-12-31"
              />
            </div>

            <button onClick={handleFindDay} className="btn btn-success w-100">
              Find Day
            </button>

            {dayOfWeek && (
              <div className="alert alert-info text-center mt-4 fs-5 fw-bold">
                📅 Day is: <span className="text-primary">{dayOfWeek}</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindDayCalculator;
