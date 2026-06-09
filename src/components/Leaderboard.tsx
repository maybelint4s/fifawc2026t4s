import React from "react";
import { Employee, EmployeeScore, Match, Prediction } from "../types";
import { Trophy, Medal, Star, Flame, Eye } from "lucide-react";

interface LeaderboardProps {
  employees: Employee[];
  matches: Match[];
  predictions: Prediction[];
  activeEmployeeId: string;
  onSelectEmployee: (id: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  employees,
  matches,
  predictions,
  activeEmployeeId,
  onSelectEmployee,
}) => {
  // Calculate employee scores dynamically
  const leaderboardData: EmployeeScore[] = employees.map((emp) => {
    let totalPoints = 0;
    let exactMatchesCount = 0;
    let winnerMatchesCount = 0;

    // Get finished matches
    const finishedMatches = matches.filter((m) => m.status === "Finished");

    finishedMatches.forEach((match) => {
      // Find this employee's prediction
      const pred = predictions.find(
        (p) => p.matchId === match.id && p.employeeId === emp.id
      );

      if (pred && match.scoreA !== null && match.scoreB !== null && match.scoreA !== undefined && match.scoreB !== undefined) {
        const realA = match.scoreA;
        const realB = match.scoreB;
        const predA = pred.predictedScoreA;
        const predB = pred.predictedScoreB;

        const isExact = predA === realA && predB === realB;
        if (isExact) {
          totalPoints += 3;
          exactMatchesCount += 1;
        } else {
          // Check correct winner
          const realWinner = realA > realB ? "A" : realA < realB ? "B" : "Draw";
          const predWinner = predA > predB ? "A" : predA < predB ? "B" : "Draw";

          if (realWinner === predWinner) {
            totalPoints += 1;
            winnerMatchesCount += 1;
          }
        }
      }
    });

    return {
      employeeId: emp.id,
      name: emp.name,
      role: emp.role,
      avatar: emp.avatar,
      totalPoints,
      exactMatchesCount,
      winnerMatchesCount,
    };
  });

  // Sort by points desc, then by exact match desc, then by name
  const sortedLeaderboard = [...leaderboardData].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.exactMatchesCount !== a.exactMatchesCount) {
      return b.exactMatchesCount - a.exactMatchesCount;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div id="leaderboard-container" className="bg-worldcup-card border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 id="leaderboard-title" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-worldcup-accent" />
          Tabla de Clasificación
        </h2>
        <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          Mundial 2026
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
        Los puntos se actualizan solos al finalizar los encuentros. Haz clic en un miembro para predecir como él/ella.
      </p>

      {/* Leaderboard list */}
      <div id="leaderboard-list" className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {sortedLeaderboard.map((item, index) => {
          const isActive = item.employeeId === activeEmployeeId;
          const isTop3 = index < 3;
          
          return (
            <div
              key={item.employeeId}
              id={`leaderboard-item-${item.employeeId}`}
              onClick={() => onSelectEmployee(item.employeeId)}
              className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                isActive
                  ? "bg-slate-900/90 border-worldcup-accent ring-2 ring-worldcup-accent/30 shadow-md transform scale-[1.01]"
                  : "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Position Badge */}
                <div className="w-6 text-center">
                  {index === 0 && <Medal className="w-5 h-5 text-yellow-500 mx-auto" />}
                  {index === 1 && <Medal className="w-5 h-5 text-slate-300 mx-auto" />}
                  {index === 2 && <Medal className="w-5 h-5 text-amber-700 mx-auto" />}
                  {index > 2 && <span className="text-sm font-mono font-bold text-slate-400">{index + 1}</span>}
                </div>

                {/* Avatar */}
                <span className="text-2xl select-none">{item.avatar}</span>

                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                    {item.name}
                    {isActive && (
                      <span className="text-[10px] bg-worldcup-accent/20 text-worldcup-accent border border-worldcup-accent/30 px-1.5 py-0.2 rounded font-sans uppercase tracking-widest font-bold">
                        Tú
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-sans">{item.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Exact Score & Winner Hits stats */}
                <div className="text-right flex flex-col items-end">
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-emerald-400" title="Resultados Exactos (3 pts)">
                      🎯 <strong className="font-mono text-white">{item.exactMatchesCount}</strong>
                    </span>
                    <span className="flex items-center gap-0.5 text-blue-400" title="Ganadores acertados (1 pt)">
                      👍 <strong className="font-mono text-white">{item.winnerMatchesCount}</strong>
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 min-w-[50px] text-center">
                  <span className="block text-xs text-slate-500 font-mono font-bold leading-none uppercase">Pts</span>
                  <span className="text-sm font-black text-worldcup-accent font-mono leading-none">{item.totalPoints}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scoring rule explanation box */}
      <div className="mt-5 p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-worldcup-accent fill-worldcup-accent" />
          Sistema de Puntuación
        </h3>
        <ul className="text-xs space-y-1.5 text-slate-300">
          <li className="flex items-center justify-between">
            <span>🎯 Resultado Exacto</span>
            <span className="font-mono font-bold text-worldcup-accent">+3 Ptos</span>
          </li>
          <li className="flex items-center justify-between">
            <span>👍 Ganador o Empate</span>
            <span className="font-mono font-bold text-slate-300">+1 Pto</span>
          </li>
          <li className="text-[10px] text-slate-500 border-t border-slate-900 mt-1.5 pt-1.5 leading-tight">
            * Se bloquean las predicciones exactamente al iniciar el partido.
          </li>
        </ul>
      </div>
    </div>
  );
};
