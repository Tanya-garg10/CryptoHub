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
  const [openDropdown, setOpenDropdown] = useState(null);
 

  const isDashboardPage = location.pathname === "/dashboard";

  const handleDropdownEnter = (label) => {
  setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
    };

  const handleDropdownClick = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };


  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.navbar-item')) {
        setOpenDropdown(null);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openDropdown]);

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
    setOpenDropdown(null);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    {
      label: "More",
      dropdown:[
    { to: "/contributors", label: "Contributors" },
    { to: "/contactus", label: "Contact Us" },
    { to: "/faq", label: "FAQ" },
      ],
    }
    
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
