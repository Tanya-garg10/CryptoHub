import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook, FaGithub, FaDiscord } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <footer className="footer-container">
      <div className="footer-content max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-brand">
            <h2 className="text-2xl font-bold">Crypto<span className="text-[#00d9ff]">Hub</span>.</h2>
            <p className="mt-4 text-gray-400 text-sm">Real-time crypto tracking and insights.</p>
          </div>
          
          <div className="footer-links">
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/api">API Access</Link></li>
              <li><Link to="/contact">Feedback</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter md:col-span-2">
            <h4 className="font-bold mb-4">Subscribe</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                className="bg-gray-800 p-2 rounded flex-1 outline-none border border-gray-700 focus:border-[#00d9ff]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
              <button type="submit" className="bg-[#00d9ff] p-2 rounded text-black"><FiSend /></button>
            </form>
            {status === "success" && <p className="text-green-400 text-xs mt-2">Success!</p>}
            {status === "error" && <p className="text-red-400 text-xs mt-2">Invalid Email.</p>}
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <div className="flex gap-4 mb-4 md:mb-0 text-lg">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaGithub /></a>
            <a href="#"><FaDiscord /></a>
          </div>
          <p>© {currentYear} CryptoHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
