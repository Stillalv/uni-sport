"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function MatchCard({ match, sport, status, onClick, sportIcons }) {
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const currentIcon = sportIcons[sport] || "mdi:target";

  return (
    <div 
      className="netflix-card" 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Watch ${match.tag}, league ${match.league || "Unknown"}. Status is ${status.badgeText}. Kickoff time is ${status.timeText}`}
    >
      <div className="card-img-wrapper">
        <div className="card-badge-overlay">
          <span className={`status-badge ${status.isLive ? "status-live" : "status-upcoming"}`}>
            {status.badgeText}
          </span>
        </div>
        
        {match.poster && !imageError ? (
          <img 
            className="card-img" 
            src={match.poster} 
            alt={`Poster for ${match.tag}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="card-img-placeholder">
            <Icon icon={currentIcon} />
          </div>
        )}

        <div className="card-info-overlay">
          <h4 className="card-title">{match.tag}</h4>
          <div className="card-sub">
            <span>{match.league}</span>
            <span className="card-time" style={{ color: status.timeColor }}>
              {status.timeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
