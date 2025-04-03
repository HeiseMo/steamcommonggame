import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-name">Steam Common</span>
          </div>
          <div className="footer-links">
            <a href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Steam Store
            </a>
            <a href="https://steamcommunity.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Community
            </a>
            <a href="https://developer.valvesoftware.com/wiki/Steam_Web_API" target="_blank" rel="noopener noreferrer" className="footer-link">
              API
            </a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
          </div>
        </div>
        <div className="footer-copyright">
          &copy; {currentYear} Steam Common. Not affiliated with Valve Corporation.
        </div>
      </div>
    </footer>
  );
}

export default Footer;