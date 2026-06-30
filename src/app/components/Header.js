"use client";

import { Tv } from "lucide-react";

export default function Header({ isScrolled }) {
  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <header id="main-header" className={isScrolled ? "scrolled" : ""}>
      <div 
        className="header-logo" 
        onClick={handleLogoClick}
        onKeyDown={(e) => handleKeyDown(e, handleLogoClick)}
        role="button"
        tabIndex={0}
        aria-label="SportsFlix Home, scroll to top"
      >
        <Tv size={26} strokeWidth={2.5} style={{ color: 'var(--netflix-red)' }} />
        <span>SPORTSFLIX</span>
      </div>
      <nav className="header-nav" aria-label="Main Navigation">
        <span 
          className="nav-item active" 
          role="button" 
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, () => {})}
        >
          Home
        </span>
        <span 
          className="nav-item" 
          role="button" 
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, () => {})}
        >
          Live
        </span>
        <span 
          className="nav-item" 
          role="button" 
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, () => {})}
        >
          Schedule
        </span>
      </nav>
    </header>
  );
}
