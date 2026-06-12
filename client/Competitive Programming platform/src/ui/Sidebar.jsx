import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiBookmark,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";

const sidebarItems = [
  { label: "Dashboard", path: "/", icon: <FiHome /> },
  { label: "Upcoming Contests", path: "/", icon: <FiCalendar /> },
  { label: "CP Sheets", path: "/sheets", icon: <FiFileText /> },
  { label: "Bookmarks", path: "#", icon: <FiBookmark /> },
  { label: "Rating Tracker", path: "#", icon: <FiTrendingUp /> },
  { label: "Settings", path: "#", icon: <FiSettings /> },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Dark overlay on mobile when sidebar is open */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-section">
          <div className="sidebar-label">Navigation</div>
          <ul className="sidebar-nav">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path && item.path !== "#" ? "active" : ""}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
