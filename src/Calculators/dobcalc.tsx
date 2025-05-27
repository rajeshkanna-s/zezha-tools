import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";

const DOBCalculator: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [dob, setDob] = useState<string>("");

  const [ageYears, setAgeYears] = useState<number | null>(null);
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [ageDays, setAgeDays] = useState<number | null>(null);
  const [ageWeeks, setAgeWeeks] = useState<number | null>(null);
  const [ageHours, setAgeHours] = useState<number | null>(null);
  const [ageMinutes, setAgeMinutes] = useState<number | null>(null);
  const [ageSeconds, setAgeSeconds] = useState<number | null>(null);

  const [error, setError] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setCurrentDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const calculateAge = () => {
    if (!dob) {
      setError("Please select Date of Birth.");
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date(currentDate);

    if (birthDate > today) {
      setError("DOB cannot be after today's date.");
      return;
    }

    setError("");

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAgeYears(years);
    setAgeMonths(months);
    setAgeDays(days);

    // Extended calculation
    const diffInMs = today.getTime() - birthDate.getTime();

    const totalSeconds = Math.floor(diffInMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    setAgeWeeks(totalWeeks);
    setAgeHours(totalHours);
    setAgeMinutes(totalMinutes);
    setAgeSeconds(totalSeconds);
  };

  const formatNumber = (value: number | null) =>
    value !== null ? value.toLocaleString() : "-";

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="card shadow p-4 mt-4">
            <h2 className="text-center mb-4">DOB CALCULATOR</h2>

            <div className="mb-3">
              <label className="form-label">Date of Birth:</label>
              <input
                type="date"
                className="form-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Current Date (Today):</label>
              <input
                type="date"
                className="form-control"
                value={currentDate}
                readOnly
              />
            </div>

            {error && <div className="text-danger mb-3">{error}</div>}

            <button onClick={calculateAge} className="btn btn-primary w-100">
              Calculate Age
            </button>

            {ageYears !== null && (
              <>
                <div className="mt-4 p-3 bg-light border rounded">
                  <h5 className="text-center mb-3">Age Calculation Result</h5>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Years:</span>
                      <strong>{formatNumber(ageYears)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Months:</span>
                      <strong>{formatNumber(ageMonths)}</strong>
                    </li>

                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Days:</span>
                      <strong>{formatNumber(ageDays)}</strong>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-light border rounded">
                  <h5 className="text-center mb-3">Additional Details</h5>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Weeks:</span>
                      <strong>{formatNumber(ageWeeks)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Hours:</span>
                      <strong>{formatNumber(ageHours)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Minutes:</span>
                      <strong>{formatNumber(ageMinutes)}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                      <span>Seconds:</span>
                      <strong>{formatNumber(ageSeconds)}</strong>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DOBCalculator;
