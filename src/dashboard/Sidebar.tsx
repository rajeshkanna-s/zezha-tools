import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    "EMI Calculator",
    "FD Calculator",
    "RD Calculator",
    "SIP Calculator",
    "TDS Calculator",
    "Old Regime Tax Calc",
    "New Regime Tax Calc",
    "Tax Comparison Calculator",
    "Persontage Calculator",
    "Value Of Persontage",
    "DOB Calculator",
    "Loan Calculator",
  ];

  // Close popup if clicked outside
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
        <span className="brand-name">ZEZHA TOOLS</span>
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
          {menuItems.map((item) => (
            <button key={item} className="menu-item">
              {item}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
