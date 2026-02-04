import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook, FaGithub, FaDiscord } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import './Footer.css'; // Make sure file is named Footer.css not footer.css

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
    <footer className="footer-container border-t border-gray-800 mt-10">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Crypto<span className="text-[#00d9ff]">Hub</span>.</h2>
            <p className="text-gray-400 text-sm">Your gateway to the world of digital assets.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><Link to="/contact" className="hover:text-[#00d9ff]">Feedback</Link></li>
              <li><Link to="/api" className="hover:text-[#00d9ff]">API</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-4 py-2 flex-1 outline-none focus:border-[#00d9ff]"
                placeholder="Enter email"
              />
              <button type="submit" className="bg-[#00d9ff] text-black px-4 py-2 rounded font-bold"><FiSend /></button>
            </form>
            {status === "success" && <p className="text-green-500 text-xs mt-2">Subscribed!</p>}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-10 text-gray-500 text-sm">
          <p>© {currentYear} CryptoHub. All rights reserved.</p>
          <div className="flex gap-4 text-xl">
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;s
