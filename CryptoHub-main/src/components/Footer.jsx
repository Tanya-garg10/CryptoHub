import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import './Footer.css'; 

const Footer = () => {
  const [email, setEmail] = useState("");
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
    <footer className="footer-container border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-2xl font-bold">CryptoHub<span className="text-[#00d9ff]">.</span></h2>
            <p className="text-gray-400 mt-2 text-sm">Insights and tracking for the future of finance.</p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold">Company</h4>
            <Link to="/contact" className="text-gray-400 hover:text-[#00d9ff] text-sm">Feedback</Link>
            <Link to="/about" className="text-gray-400 hover:text-[#00d9ff] text-sm">About Us</Link>
          </div>

          <div>
            <h4 className="font-bold mb-4">Join Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="bg-gray-900 border border-gray-700 p-2 rounded flex-1 text-sm outline-none focus:border-[#00d9ff]"
              />
              <button type="submit" className="bg-[#00d9ff] text-black px-4 py-2 rounded">
                <FiSend />
              </button>
            </form>
            {status === "success" && <p className="text-green-500 text-xs mt-2">Success!</p>}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
          <p>© {currentYear} CryptoHub. All rights reserved.</p>
          <div className="flex gap-4 text-lg">
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
