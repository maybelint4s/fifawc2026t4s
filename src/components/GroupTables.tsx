import React from "react";
import { Team, Match } from "../types";
import { INITIAL_TEAMS } from "../data";

interface GroupTablesProps {
  teams: Team[];
  matches: Match[];
}

export const GroupTables: React.FC<GroupTablesProps> = ({ teams, matches }) => {
  // Compute group standings dynamically based on real results of Finished matches in FG stage!
  const calculateStandings = () => {
    // Clone raw teams list
    const standings: Record<string, Team> = {};
    INITIAL_TEAMS.forEach((t) => {
      standings[t.id] = { ...t, pts: 0, gf: 0 };
    });

    // Process finished FG matches
    const fgMatches = matches.filter((m) => m.stage === "FG" && m.status === "Finished");
    
    fgMatches.forEach((match) => {
      const idA = match.teamA.id;
      const idB = match.teamB.id;
      const scoreA = match.scoreA ?? 0;
      const scoreB = match.scoreB ?? 0;

      if (standings[idA] && standings[idB]) {
        standings[idA].gf = (standings[idA].gf ?? 0) + scoreA;
        standings[idB].gf = (standings[idB].gf ?? 0) + scoreB;

        if (scoreA > scoreB) {
          standings[idA].pts = (standings[idA].pts ?? 0) + 3;
        } else if (scoreB > scoreA) {
          standings[idB].pts = (standings[idB].pts ?? 0) + 3;
        } else {
          standings[idA].pts = (standings[idA].pts ?? 0) + 1;
          standings[idB].pts = (standings[idB].pts ?? 0) + 1;
        }
      }
    });

    // Group teams
    const groups: Record<string, Team[]> = {};
    Object.values(standings).forEach((t) => {
      if (!groups[t.group]) {
        groups[t.group] = [];
      }
      groups[t.group].push(t);
    });

    // Sort each group
    Object.keys(groups).forEach((gName) => {
      groups[gName].sort((a, b) => {
        if ((b.pts ?? 0) !== (a.pts ?? 0)) {
          return (b.pts ?? 0) - (a.pts ?? 0);
        }
        if ((b.gf ?? 0) !== (a.gf ?? 0)) {
          return (b.gf ?? 0) - (a.gf ?? 0);
        }
        return a.name.localeCompare(b.name);
      });
    });

    return groups;
  };

  const groupStandings = calculateStandings();

  return (
    <div id="group-standings-tables" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupStandings).map(([groupName, groupTeams]) => (
        <div
          key={groupName}
          id={`table-${groupName.replace(/\s+/g, "-")}`}
          className="bg-worldcup-bracket-container/80 p-4 rounded-xl border border-slate-800/80"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-sm font-black text-worldcup-accent ">{groupName}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400">PTS</span>
          </div>

          {/* Teams list */}
          <div className="space-y-1.5">
            {groupTeams.map((team, tIdx) => (
              <div
                key={team.id}
                className="flex items-center justify-between py-1.5 px-2.5 rounded hover:bg-slate-900/60 transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 w-3">{tIdx + 1}</span>
                  <span className="text-lg select-none">{team.flag}</span>
                  <span className="font-semibold text-white">{team.name}</span>
                </div>

                <div className="flex items-center gap-4 font-mono font-bold text-slate-350">
                  <span className="text-[10px] text-slate-500 font-normal">({team.gf} GF)</span>
                  <span className="text-worldcup-accent text-sm w-4 text-right">
                    {team.pts}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
