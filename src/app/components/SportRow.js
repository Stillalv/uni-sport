"use client";

import { Icon } from "@iconify/react";
import MatchCard from "./MatchCard";

export default function SportRow({ 
  sport, 
  matches, 
  allMatches, 
  getMatchStatus, 
  onCardClick, 
  sportIcons 
}) {
  if (!Array.isArray(matches) || matches.length === 0) return null;

  return (
    <div className="netflix-row" key={sport}>
      <h3 className="row-title">
        <Icon icon={sportIcons[sport] || 'mdi:target'} />
        {sport}
      </h3>
      <div className="row-cards-container">
        {matches.map(match => {
          // Find flat index in the global allMatches array
          const globalIdx = allMatches.findIndex(
            m => m.tag === match.tag && m.kickoff === match.kickoff
          );
          const status = getMatchStatus(match.kickoff);

          return (
            <MatchCard
              key={`${match.tag}-${match.kickoff}`}
              match={match}
              sport={sport}
              status={status}
              onClick={() => onCardClick(globalIdx)}
              sportIcons={sportIcons}
            />
          );
        })}
      </div>
    </div>
  );
}
