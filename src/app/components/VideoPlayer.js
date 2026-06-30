"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Server, 
  ChevronDown, 
  ExternalLink, 
  Info 
} from "lucide-react";

export default function VideoPlayer({ 
  activeMatch, 
  activeServerIndex, 
  onClosePlayer, 
  setActiveServerIndex 
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownActive(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  if (!activeMatch) return null;

  const currentServerUrl = activeMatch.iframes && activeMatch.iframes[activeServerIndex]
    ? activeMatch.iframes[activeServerIndex].url
    : null;

  return (
    <div id="player-view">
      <div className="player-header">
        <button 
          className="back-btn" 
          onClick={onClosePlayer}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={18} />Back
        </button>
        <div className="player-title" tabIndex={0} aria-label={`Currently watching ${activeMatch.tag}`}>
          {activeMatch.tag}
        </div>
        
        <div className="player-controls-right">
          {/* Custom HTML Dropdown */}
          <div 
            className={`custom-select ${isDropdownActive ? "active" : ""}`}
            id="custom-server-select"
            ref={dropdownRef}
          >
            <div 
              className="select-trigger"
              onClick={() => setIsDropdownActive(!isDropdownActive)}
              onKeyDown={(e) => handleKeyDown(e, () => setIsDropdownActive(!isDropdownActive))}
              role="combobox"
              aria-expanded={isDropdownActive}
              aria-haspopup="listbox"
              tabIndex={0}
              aria-label={`Select stream server. Current server: ${
                activeMatch.iframes && activeMatch.iframes[activeServerIndex] 
                  ? (activeMatch.iframes[activeServerIndex].server || `Server ${activeServerIndex + 1}`) 
                  : "No Server"
              }`}
            >
              <Server size={18} className="select-icon" />
              <span>
                {activeMatch.iframes && activeMatch.iframes[activeServerIndex] 
                  ? (activeMatch.iframes[activeServerIndex].server || `Server ${activeServerIndex + 1}`) 
                  : "No Server"}
              </span>
              <ChevronDown size={18} className="select-arrow" />
            </div>
            
            {activeMatch.iframes && activeMatch.iframes.length > 0 && (
              <div 
                className="select-options-list"
                role="listbox"
                aria-label="Stream servers"
              >
                {activeMatch.iframes.map((server, idx) => (
                  <div 
                    className={`select-option-item ${idx === activeServerIndex ? "selected" : ""}`}
                    key={idx}
                    onClick={() => {
                      setActiveServerIndex(idx);
                      setIsDropdownActive(false);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      setActiveServerIndex(idx);
                      setIsDropdownActive(false);
                    })}
                    role="option"
                    aria-selected={idx === activeServerIndex}
                    tabIndex={0}
                  >
                    {server.server || `Server ${idx + 1}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Tab Button */}
          {currentServerUrl && (
            <button 
              className="player-action-btn"
              onClick={() => window.open(currentServerUrl, "_blank")}
              aria-label="Open stream in a new tab"
            >
              <ExternalLink size={18} />New Tab
            </button>
          )}
        </div>
      </div>

      {/* Warning Info Banner */}
      <div className="player-banner" tabIndex={0}>
        <Info size={18} />
        <span>Tip: If the video is blank or fails to play, try switching the <strong>Server</strong> or click <strong>New Tab</strong>.</span>
      </div>

      {/* Iframe Video Container */}
      <div className="video-wrapper">
        {currentServerUrl ? (
          <iframe
            id="stream-player"
            src={currentServerUrl}
            allowFullScreen
            allow="encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div style={{ color: "#aaa" }} tabIndex={0}>No streams available for this match.</div>
        )}
      </div>
    </div>
  );
}
