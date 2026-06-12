import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiMenu,
  FiCode,
  FiAward,
  FiFileText,
  FiGrid,
  FiUser,
  FiLogOut
} from "react-icons/fi";

export default function TopNavbar({ onToggleSidebar }) {
  const location = useLocation();
  const userid = localStorage.getItem("userid");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { name: "Contests", path: "/", icon: <FiAward /> },
    { name: "Sheets", path: "/sheets", icon: <FiFileText /> },
    { name: "Problems", path: "/sheets", icon: <FiGrid /> },
    { name: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  return (
    <nav className="top-navbar">
      {/* Hamburger — mobile only */}
      <button className="nav-hamburger" onClick={onToggleSidebar}>
        <FiMenu />
      </button>

      {/* Logo */}
      <Link to="/" className="nav-logo">
        <FiCode />
        <span>CP Platform</span>
      </Link>

      {/* Nav Links */}
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={location.pathname === link.path ? "active" : ""}
            >
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-spacer" />

      {/* Search */}
      <div className="nav-search">
        <FiSearch className="nav-search-icon" />
        <input type="text" placeholder="Search problems..." />
      </div>

      {/* Auth Links (shown when logged out) */}
      {!userid && (
        <div className="nav-auth-links">
          <Link to="/login" className="nav-auth-link">Login</Link>
          <Link to="/signup" className="nav-auth-link-button">Sign Up</Link>
        </div>
      )}

      {/* Avatar & Dropdown */}
      <div className="nav-avatar-container" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)} 
          className="nav-avatar-btn"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          {userid ? userid.charAt(0).toUpperCase() : "?"}
        </button>

        {dropdownOpen && (
          <div className="nav-dropdown">
            {userid ? (
              <>
                <div className="nav-dropdown-header">
                  <div className="nav-dropdown-username">{userid}</div>
                  <div className="nav-dropdown-status">Logged In</div>
                </div>
                <div className="nav-dropdown-divider" />
                <Link to="/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FiUser /> My Profile
                </Link>
                <Link to="/sheets" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FiFileText /> My Progress
                </Link>
                <div className="nav-dropdown-divider" />
                <Link to="/logout" className="nav-dropdown-item logout" onClick={() => setDropdownOpen(false)}>
                  <FiLogOut /> Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
