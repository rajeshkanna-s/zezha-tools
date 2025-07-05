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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Submenu items for menu groups
  const menuGroups = [
    {
      label: "Dashboard",
      path: "/Dashboard",
    },
    {
      label: "ChatBot",
      path: "/chat-bot",
    },

    {
      label: "Calculators",
      submenu: [
        { label: "Calculator", path: "/basiccalc-calculator" },
        { label: "EMI Calculator", path: "/emi-calculator" },
        { label: "FD Calculator", path: "/fd-calculator" },
        { label: "RD Calculator", path: "/rd-calculator" },
        { label: "SIP Calculator", path: "/sip-calculator" },
        { label: "TDS Calculator", path: "/tds-calculator" },
        { label: "Currency Calculator", path: "/currency-calculator" },
      ],
    },
    {
      label: "Tax Tools",
      submenu: [
        { label: "Old Regime Tax", path: "/old-regime-tax" },
        { label: "New Regime Tax", path: "/new-regime-tax" },
        { label: "Tax Compare", path: "/taxcompare-calculator" },
      ],
    },
    {
      label: "Loan Tools",
      submenu: [
        { label: "Loan Calculator", path: "/loan-calculator" },
        { label: "Interest Breakdown", path: "/interest-breakdown" },
      ],
    },
    {
      label: "Conversions",
      submenu: [
        { label: "Percentage Calculator", path: "/percentage-calculator" },
        { label: "Value Of Percentage", path: "/value-of-percentage" },
      ],
    },
    {
      label: "Get Img/Video",
      submenu: [
        { label: "Image Download", path: "/image-downloader" },
        { label: "Video Download", path: "/video-downloader" },
      ],
    },
    {
      label: "Date Tools",
      submenu: [
        { label: "DOB Calculator", path: "/dob-calculator" },
        { label: "FIND DAY Calculator", path: "/dayfind-calculator" },
      ],
    },
    {
      label: "Reports",
      path: "/reports",
    },
    {
      label: "Notifications",
      path: "/notifications",
    },
    {
      label: "Settings",
      path: "/settings",
    },
    {
      label: "Help",
      path: "/help",
    },
    {
      label: "Resume Tools",
      path: "https://zezhatools.lovable.app/",
    },
  ];

  useEffect(() => {
    // Auto-expand submenu if route matches any submenu path
    const newOpenMenus: { [key: string]: boolean } = {};
    menuGroups.forEach((group) => {
      if (group.submenu) {
        newOpenMenus[group.label] = group.submenu.some(
          (item) => item.path === location.pathname
        );
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

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

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleProfilePopup = () => setShowProfilePopup((prev) => !prev);

  return (
    <>
      <div className="sidebar-header-fixed">
        <span
          className="menu-icon ti-menu"
          onClick={toggleSidebar}
          role="button"
          aria-label="Toggle sidebar"
        >
          {isOpen ? "◀" : "☰"}
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
            >
              🌐 <span>TAX Calc</span>
            </div>
            <div
              className="profile-menu-option"
              onClick={() =>
                window.open("https://rajeshkanna.in/emicalc", "_blank")
              }
            >
              🔗 <span>EMI calc</span>
            </div>
          </div>
        )}
      </div>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <nav className="menu-list">
          {menuGroups.map((group) =>
            group.submenu ? (
              <div key={group.label}>
                <button
                  className={`menu-item ${
                    openMenus[group.label] ? "active" : ""
                  }`}
                  onClick={() => toggleMenu(group.label)}
                >
                  {group.label} {openMenus[group.label] ? "▾" : "▸"}
                </button>
                {openMenus[group.label] && (
                  <div className="submenu">
                    {group.submenu.map(({ label, path }) => (
                      <button
                        key={label}
                        className={`submenu-item ${
                          location.pathname === path ? "active" : ""
                        }`}
                        onClick={() => navigate(path)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={group.label}
                className={`menu-item ${
                  location.pathname === group.path ? "active" : ""
                }`}
                onClick={() => {
                  if (group.path?.startsWith("http")) {
                    window.open(group.path, "_blank");
                  } else {
                    navigate(group.path!);
                  }
                }}
              >
                {group.label}
              </button>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
