import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../assets/CSS/commonstyle.css";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "EMI Calculator", path: "/emi-calculator" },
    { label: "FD Calculator", path: "/fd-calculator" },
    { label: "RD Calculator", path: "/rd-calculator" },
    { label: "SIP Calculator", path: "/sip-calculator" },
    { label: "TDS Calculator", path: "/tds-calculator" },
    { label: "Old Regime Tax Calc", path: "/old-regime-tax" },
    { label: "New Regime Tax Calc", path: "/new-regime-tax" },
    { label: "Tax Compare Calculator", path: "/taxcompare-calculator" },
    { label: "Persontage Calculator", path: "/percentage-calculator" },
    { label: "Value Of Persontage", path: "/value-of-percentage" },
    { label: "DOB Calculator", path: "/dob-calculator" },
    { label: "Loan Calculator", path: "/loan-calculator" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopup(false);
      }
    }
    if (showProfilePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup]);

  const toggleProfilePopup = () => {
    setShowProfilePopup((prev) => !prev);
  };

  return (
    <>
      <div className="sidebar-header-fixed">
        <span
          className="menu-icon ti-menu"
          onClick={toggleSidebar}
          role="button"
          aria-label="Toggle sidebar"
        >
          ☰
        </span>
        <span className="brand-name-uniq">ZEZHA TOOLS</span>
        <span
          className="dropdown-arrow"
          onClick={toggleProfilePopup}
          role="button"
          aria-label="Toggle profile popup"
        >
          ▾
        </span>

        {/* Profile popup */}
        {showProfilePopup && (
          <div className="profile-popup" ref={popupRef}>
            <div className="profile-info">
              <strong>Zezha Technology</strong>
            </div>

            <div
              className="profile-menu-option"
              onClick={() =>
                window.open("https://rajeshkanna.in/taxcalc", "_blank")
              }
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter")
                  window.open("https://rajeshkanna.in/taxcalc", "_blank");
              }}
            >
              <span className="option-icon" aria-hidden="true">
                🌐
              </span>
              <span className="option-text">TAX Calc</span>
            </div>

            <div
              className="profile-menu-option"
              onClick={() =>
                window.open("https://rajeshkanna.in/emicalc", "_blank")
              }
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter")
                  window.open("https://rajeshkanna.in/emicalc", "_blank");
              }}
            >
              <span className="option-icon" aria-hidden="true">
                🔗
              </span>
              <span className="option-text">EMI calc</span>
            </div>
          </div>
        )}
      </div>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <nav className="menu-list">
          {menuItems.map(({ label, path }) => (
            <button
              key={label}
              className={`menu-item ${
                location.pathname === path ? "active" : ""
              }`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
