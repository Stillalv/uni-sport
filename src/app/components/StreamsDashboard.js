"use client";

import { useState, useEffect, useMemo } from "react";

// Iconify/Material Design Icons Mapping for Sports (No emojis)
const sportIcons = {
  football: 'mdi:soccer',
  basketball: 'mdi:basketball',
  amfootball: 'mdi:football',
  baseball: 'mdi:baseball',
  badminton: 'mdi:badminton',
  volleyball: 'mdi:volleyball',
  tennis: 'mdi:tennis',
  race: 'mdi:flag-checkered',
  fight: 'mdi:boxing-glove',
  other: 'mdi:target'
};

export default function StreamsDashboard({ initialData }) {
  const [now, setNow] = useState(new Date());
  const [activeMatch, setActiveMatch] = useState(null);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Poll current time every 10 seconds to update card badges and timers
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll handler for translucent header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Frame-Busting Redirect Interceptor
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeMatch) {
        e.preventDefault();
        e.returnValue = "Preventing automatic redirect ad.";
        return "Preventing automatic redirect ad.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeMatch]);

  // Fullscreen orientation lock handler
  useEffect(() => {
    const handleFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape");
          }
        } else {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        }
      } catch (err) {}
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("webkitfullscreenchange", handleFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("webkitfullscreenchange", handleFullscreen);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsDropdownActive(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Flat list of matches with category context
  const allMatches = useMemo(() => {
    const list = [];
    Object.keys(initialData).forEach(sport => {
      if (Array.isArray(initialData[sport])) {
        initialData[sport].forEach(match => {
          list.push({ ...match, category: sport });
        });
      }
    });
    return list;
  }, [initialData]);

  // Find first live match, or fallback to the first upcoming match
  const featuredMatch = useMemo(() => {
    if (allMatches.length === 0) return null;
    const live = allMatches.find(m => {
      const kickoff = new Date(m.kickoff.replace(" ", "T") + "+07:00");
      return (kickoff - now) <= 0;
    });
    return live || allMatches[0];
  }, [allMatches, now]);

  // Find index in flat list for featured watch button
  const featuredMatchIndex = useMemo(() => {
    if (!featuredMatch) return -1;
    return allMatches.findIndex(m => m.tag === featuredMatch.tag && m.kickoff === featuredMatch.kickoff);
  }, [featuredMatch, allMatches]);

  const handleOpenPlayer = (matchIndex) => {
    const match = allMatches[matchIndex];
    if (match) {
      setActiveMatch(match);
      setActiveServerIndex(0);
      setIsDropdownActive(false);
    }
  };

  const handleClosePlayer = async () => {
    setActiveMatch(null);
    setIsDropdownActive(false);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (e) {}
  };

  const getMatchStatus = (kickoffStr) => {
    const kickoff = new Date(kickoffStr.replace(" ", "T") + "+07:00");
    const diff = kickoff - now;

    if (diff <= 0) {
      return { isLive: true, badgeText: "LIVE", timeText: "🔴 LIVE", timeColor: "#ef4444" };
    } else {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      let timerText = "";
      if (d > 0) {
        timerText = `${d}d ${h}h`;
      } else if (h > 0) {
        timerText = `${h}h ${m}m`;
      } else {
        timerText = `${m}m`;
      }
      return { isLive: false, badgeText: "UPCOMING", timeText: `⏳ ${timerText}`, timeColor: "#ffcc00" };
    }
  };

  // Process featured match time text
  const featuredTimeText = useMemo(() => {
    if (!featuredMatch) return "";
    const kickoff = new Date(featuredMatch.kickoff.replace(" ", "T") + "+07:00");
    const timeString = kickoff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const dateString = kickoff.toLocaleDateString([], { day: "numeric", month: "short" });
    return `${dateString} • ${timeString}`;
  }, [featuredMatch]);

  return (
    <>
      {/* Sticky Header */}
      <header id="main-header" className={isScrolled ? "scrolled" : ""}>
        <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <iconify-icon icon="mdi:television-play"></iconify-icon>
          <span>SPORTSFLIX</span>
        </div>
        <div className="header-nav">
          <span className="nav-item active">Home</span>
          <span className="nav-item">Live</span>
          <span className="nav-item">Schedule</span>
        </div>
      </header>

      {/* Featured Hero Banner */}
      {featuredMatch && (
        <div id="hero-banner">
          <div 
            className="hero-bg" 
            style={{ 
              backgroundImage: featuredMatch.poster 
                ? `url('${featuredMatch.poster}')` 
                : "linear-gradient(135deg, #1f212a 0%, #0e0f14 100%)" 
            }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge-row">
              <span className={`status-badge ${getMatchStatus(featuredMatch.kickoff).isLive ? "status-live" : "status-upcoming"}`}>
                {getMatchStatus(featuredMatch.kickoff).badgeText}
              </span>
              <div className="hero-league">{featuredMatch.league || "FEATURED MATCH"}</div>
            </div>
            <h1 className="hero-title">{featuredMatch.tag}</h1>
            <div className="hero-time">
              <iconify-icon icon="mdi:calendar-clock"></iconify-icon>
              <span>{featuredTimeText}</span>
            </div>
            <div className="hero-buttons">
              <button className="hero-btn watch-btn" onClick={() => handleOpenPlayer(featuredMatchIndex)}>
                <iconify-icon icon="mdi:play"></iconify-icon> Watch Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rows Container */}
      <div className="container">
        <div id="view-dashboard">
          {Object.keys(initialData).map(sport => {
            const matches = initialData[sport];
            if (!Array.isArray(matches) || matches.length === 0) return null;

            return (
              <div className="netflix-row" key={sport}>
                <h3 className="row-title">
                  <iconify-icon icon={sportIcons[sport] || 'mdi:target'}></iconify-icon>
                  {sport}
                </h3>
                <div className="row-cards-container">
                  {matches.map(match => {
                    // Find flat index
                    const globalIdx = allMatches.findIndex(m => m.tag === match.tag && m.kickoff === match.kickoff);
                    const status = getMatchStatus(match.kickoff);

                    return (
                      <div 
                        className="netflix-card" 
                        key={`${match.tag}-${match.kickoff}`}
                        onClick={() => handleOpenPlayer(globalIdx)}
                      >
                        <div className="card-img-wrapper">
                          <div className="card-badge-overlay">
                            <span className={`status-badge ${status.isLive ? "status-live" : "status-upcoming"}`}>
                              {status.badgeText}
                            </span>
                          </div>
                          
                          {match.poster ? (
                            <img 
                              className="card-img" 
                              src={match.poster} 
                              alt={match.tag}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          
                          <div className="card-img-placeholder" style={match.poster ? { display: "none" } : {}}>
                            <iconify-icon icon={sportIcons[sport] || 'mdi:target'}></iconify-icon>
                          </div>

                          <div className="card-info-overlay">
                            <h4 class="card-title">{match.tag}</h4>
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
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Player Overlay */}
      {activeMatch && (
        <div id="player-view">
          <div className="player-header">
            <button className="back-btn" onClick={handleClosePlayer}>
              <iconify-icon icon="mdi:arrow-left"></iconify-icon>Back
            </button>
            <div className="player-title">{activeMatch.tag}</div>
            
            <div className="player-controls-right">
              {/* Custom HTML Dropdown */}
              <div 
                className={`custom-select ${isDropdownActive ? "active" : ""}`}
                id="custom-server-select"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownActive(!isDropdownActive);
                }}
              >
                <div className="select-trigger">
                  <iconify-icon icon="mdi:server-network" className="select-icon"></iconify-icon>
                  <span>
                    {activeMatch.iframes && activeMatch.iframes[activeServerIndex] 
                      ? (activeMatch.iframes[activeServerIndex].server || `Server ${activeServerIndex + 1}`) 
                      : "No Server"}
                  </span>
                  <iconify-icon icon="mdi:chevron-down" className="select-arrow"></iconify-icon>
                </div>
                
                {activeMatch.iframes && activeMatch.iframes.length > 0 && (
                  <div className="select-options-list">
                    {activeMatch.iframes.map((server, idx) => (
                      <div 
                        className={`select-option-item ${idx === activeServerIndex ? "selected" : ""}`}
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveServerIndex(idx);
                          setIsDropdownActive(false);
                        }}
                      >
                        {server.server || `Server ${idx + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Tab Button */}
              {activeMatch.iframes && activeMatch.iframes[activeServerIndex] && (
                <button 
                  className="player-action-btn"
                  onClick={() => window.open(activeMatch.iframes[activeServerIndex].url, "_blank")}
                >
                  <iconify-icon icon="mdi:open-in-new"></iconify-icon>New Tab
                </button>
              )}
            </div>
          </div>

          {/* Warning Info Banner */}
          <div className="player-banner">
            <iconify-icon icon="mdi:information-outline"></iconify-icon>
            <span>Tip: If the video is blank or fails to play, try switching the <strong>Server</strong> or click <strong>New Tab</strong>.</span>
          </div>

          {/* Iframe Video Container */}
          <div className="video-wrapper">
            {activeMatch.iframes && activeMatch.iframes[activeServerIndex] ? (
              <iframe
                id="stream-player"
                src={activeMatch.iframes[activeServerIndex].url}
                allowFullScreen
                allow="encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div style={{ color: "#aaa" }}>No streams available for this match.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
