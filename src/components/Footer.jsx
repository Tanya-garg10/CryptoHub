import React, { useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApplePay,
  FaGooglePay,
} from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    // Simple validation check
    if (!email || !email.includes("@")) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000); // Clear error after 3s
      return;
    }

    // UX-only logic for now
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(null), 5000); // Clear success message after 5s
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Main Grid */}
        <div className="footer-main">

          {/* Brand & Payments */}
          <div className="footer-brand">
            <h2 className="footer-logo">
              Crypto<span>Hub</span>.
            </h2>
            <p>
              Real-time crypto tracking, advanced analytics,
              market insights & portfolio tools.
            </p>

            <div className="payment-methods">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
              <FaApplePay />
              <FaGooglePay />
            </div>
          </div>

          {/* Markets Column */}
          <div className="footer-links">
            <h4>Markets</h4>
            <ul>
              <li><Link to="/trending">Trending Coins</Link></li>
              <li><Link to="/gainers">Top Gainers</Link></li>
              <li><Link to="/losers">Top Losers</Link></li>
              <li><Link to="/new">New Listings</Link></li>
            </ul>
          </div>

          {/* Product Column */}
          <div className="footer-links">
            <h4>Product</h4>
            <ul>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/api">API Access</Link></li>
              <li><Link to="/contact">Feedback</Link></li>
            </ul>
          </div>

          {/* Updated Newsletter Form */}
          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Weekly crypto insights & market updates</p>

            <form onSubmit={handleNewsletterSubmit}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe">
                  <FiSend />
                </button>
              </div>

              {status === "success" && (
                <p className="newsletter-msg success">Thanks for subscribing!</p>
              )}
              {status === "error" && (
                <p className="newsletter-msg error">Please enter a valid email.</p>
              )}
            </form>
          </div>
        </div>

        {/* Socials & Copyright */}
        <div className="footer-bottom-section">
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://github.com/KaranUnique/CryptoHub" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
          </div>

          <div className="footer-bottom">
            <p>
              <Link to="/privacy">Privacy Policy</Link> |{" "}
              <Link to="/terms">Terms of Service</Link> |{" "}
              <Link to="/cookies">Cookies</Link>
            </p>
            <p>© {currentYear} CryptoHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
