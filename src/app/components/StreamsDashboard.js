"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import Hero from "./Hero";
import SportRow from "./SportRow";
import VideoPlayer from "./VideoPlayer";
import { parseKickoffDate } from "../utils/date";

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
  const [isScrolled, setIsScrolled] = useState(false);

  // Safe initialData object fallback to prevent runtime crashes
  const safeData = useMemo(() => {
    if (!initialData || typeof initialData !== "object" || Array.isArray(initialData)) {
      return {};
    }
    return initialData;
  }, [initialData]);

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

  // Flat list of matches with category context
  const allMatches = useMemo(() => {
    const list = [];
    Object.keys(safeData).forEach(sport => {
      if (Array.isArray(safeData[sport])) {
        safeData[sport].forEach(match => {
          list.push({ ...match, category: sport });
        });
      }
    });
    return list;
  }, [safeData]);

  // Find first live match, or fallback to the first upcoming match
  const featuredMatch = useMemo(() => {
    if (allMatches.length === 0) return null;
    const live = allMatches.find(m => {
      const kickoff = parseKickoffDate(m.kickoff);
      return (kickoff - now) <= 0;
    });
    return live || allMatches[0];
  }, [allMatches, now]);

  // Find index in flat list for featured watch button
  const featuredMatchIndex = useMemo(() => {
    if (!featuredMatch) return -1;
    return allMatches.findIndex(
      m => m.tag === featuredMatch.tag && m.kickoff === featuredMatch.kickoff
    );
  }, [featuredMatch, allMatches]);

  const handleOpenPlayer = (matchIndex) => {
    const match = allMatches[matchIndex];
    if (match) {
      setActiveMatch(match);
      setActiveServerIndex(0);
    }
  };

  const handleClosePlayer = async () => {
    setActiveMatch(null);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {}
  };

  const getMatchStatus = (kickoffStr) => {
    const kickoff = parseKickoffDate(kickoffStr);
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
    const kickoff = parseKickoffDate(featuredMatch.kickoff);
    const timeString = kickoff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const dateString = kickoff.toLocaleDateString([], { day: "numeric", month: "short" });
    return `${dateString} • ${timeString}`;
  }, [featuredMatch]);

  const featuredStatus = useMemo(() => {
    if (!featuredMatch) return { isLive: false, badgeText: "UPCOMING" };
    return getMatchStatus(featuredMatch.kickoff);
  }, [featuredMatch, now]);

  return (
    <>
      <Header isScrolled={isScrolled} />

      {featuredMatch && (
        <Hero
          featuredMatch={featuredMatch}
          featuredTimeText={featuredTimeText}
          status={featuredStatus}
          onWatchClick={() => handleOpenPlayer(featuredMatchIndex)}
        />
      )}

      {/* Rows Container */}
      <div className="container">
        <div id="view-dashboard">
          {Object.keys(safeData).map(sport => (
            <SportRow
              key={sport}
              sport={sport}
              matches={safeData[sport]}
              allMatches={allMatches}
              getMatchStatus={getMatchStatus}
              onCardClick={handleOpenPlayer}
              sportIcons={sportIcons}
            />
          ))}
        </div>
      </div>

      {activeMatch && (
        <VideoPlayer
          activeMatch={activeMatch}
          activeServerIndex={activeServerIndex}
          onClosePlayer={handleClosePlayer}
          setActiveServerIndex={setActiveServerIndex}
        />
      )}
    </>
  );
}
