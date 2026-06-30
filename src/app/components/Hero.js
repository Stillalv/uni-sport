"use client";

import { CalendarDays, Play } from "lucide-react";

export default function Hero({ featuredMatch, featuredTimeText, status, onWatchClick }) {
  if (!featuredMatch) return null;

  return (
    <div id="hero-banner">
      <div 
        className="hero-bg" 
        style={{ 
          backgroundImage: featuredMatch.poster 
            ? `url('${featuredMatch.poster}')` 
            : "linear-gradient(135deg, #1f212a 0%, #0e0f14 100%)" 
        }}
        aria-hidden="true"
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-badge-row">
          <span className={`status-badge ${status.isLive ? "status-live" : "status-upcoming"}`}>
            {status.badgeText}
          </span>
          <div className="hero-league">{featuredMatch.league || "FEATURED MATCH"}</div>
        </div>
        <h1 className="hero-title">{featuredMatch.tag}</h1>
        <div className="hero-time">
          <CalendarDays size={18} style={{ color: '#ffcc00' }} />
          <span>{featuredTimeText}</span>
        </div>
        <div className="hero-buttons">
          <button 
            className="hero-btn watch-btn" 
            onClick={onWatchClick}
            aria-label={`Watch ${featuredMatch.tag} now`}
          >
            <Play size={18} fill="currentColor" /> Watch Now
          </button>
        </div>
      </div>
    </div>
  );
}
