import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboardPage = location.pathname === "/dashboard";

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [logout, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    { to: "/contributors", label: "Contributors" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Brand Left */}
        <Link to="/" className="navbar-logo">
          <img src="/favicon.svg" alt="CryptoHub" className="logo-img" />
          <span>CryptoHub</span>
        </Link>

        {/* Centered Menu */}
        <ul className="navbar-menu">
          {navLinks.map((link) => (
            <li key={link.to} className="navbar-item">
              <Link
                to={link.to}
                className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          <Link to="/login" className="btn-login">
            Login
          </Link>
          <Link to="/signup" className="btn-grow">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
