import React from 'react';
import Link from 'next/link';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <svg className="brand-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#3B82F6" strokeWidth="2" />
              <path d="M15.5 9.5L9.5 15.5M15.5 15.5L9.5 9.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 7V17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 12H17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1 className="brand-name">Steam Common Games</h1>
          </div>
          <nav className="nav-links">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="https://github.com/your-username/steam-common-games" className="nav-link">GitHub</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;