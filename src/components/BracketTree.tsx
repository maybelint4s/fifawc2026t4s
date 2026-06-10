import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Match, Prediction, Employee } from "../types";
import { INITIAL_TEAMS } from "../data";
import { Lock, Unlock, Users } from "lucide-react";
import { motion } from "motion/react";
import { animate, stagger } from "animejs";
import { TeamFlag } from "./TeamFlag";

interface BracketTreeProps {
  matches: Match[];
  predictions: Prediction[];
  employees: Employee[];
  activeEmployeeId: string;
  onUpdatePrediction: (matchId: string, teamAVal: number, teamBVal: number) => void;
  onOpenSimulationModal: (match: Match) => void;
  canManageResults?: boolean;
}

const ROUNDS = [
  { key: "FG", label: "Grupos", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", pill: "bg-emerald-400" },
  { key: "16vos", label: "Dieciseisavos", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", pill: "bg-indigo-400" },
  { key: "8vos", label: "Octavos", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", pill: "bg-sky-400" },
  { key: "CF", label: "Cuartos", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", pill: "bg-violet-400" },
  { key: "SF", label: "Semis", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", pill: "bg-purple-400" },
  { key: "F", label: "Final", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", pill: "bg-yellow-400" },
] as const;

// Spring transitions (values from prompt-bracket-arbol.md)
const TRACK_SPRING = { type: "spring", stiffness: 85, damping: 18, mass: 0.9 } as const;
const LANE_SPRING = { type: "spring", stiffness: 120, damping: 20 } as const;
const PILL_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

/* ============================================================
   Connector between two knockout rounds.
   Each connector block joins 2 matches from the left round
   into 1 match on the right round.
   ============================================================ */
const KnockoutConnector = ({ count }: { count: number }) => {
  return (
    <div className="w-10 h-full flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 relative">
          {/* line coming from top-left match */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 border-r-2 border-b-2 border-slate-700 rounded-br-md" />
          {/* line coming from bottom-left match */}
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 border-r-2 border-t-2 border-slate-700 rounded-tr-md" />
          {/* horizontal exit line to the right */}
          <div className="absolute right-0 top-1/2 w-1/2 h-0.5 bg-slate-700 -translate-y-1/2" />
        </div>
      ))}
    </div>
  );
};

export const BracketTree: React.FC<BracketTreeProps> = ({
  matches,
  predictions,
  employees,
  activeEmployeeId,
  onUpdatePrediction,
  onOpenSimulationModal,
  canManageResults = false,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeRound, setActiveRound] = useState<string>("FG");
  const [x, setX] = useState(0);
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasAnimated = useRef(false);

  const isMatchLocked = (match: Match): boolean => {
    return match.status === "Finished" || match.status === "Live" || new Date() >= new Date(match.datetimeISO);
  };

  const activeEmployee = employees.find((e) => e.id === activeEmployeeId);

  const getGroupStandings = useCallback(
    (groupName: string) => {
      const groupTeams = INITIAL_TEAMS.filter((t) => t.group === groupName);
      const groupMatches = matches.filter((m) => m.groupName === groupName && m.status === "Finished");

      const standings = groupTeams.map((team) => {
        let pts = 0;
        let gf = 0;
        let ga = 0;
        groupMatches.forEach((m) => {
          if (m.teamA.id === team.id) {
            gf += m.scoreA ?? 0;
            ga += m.scoreB ?? 0;
            const a = m.scoreA ?? 0;
            const b = m.scoreB ?? 0;
            if (a > b) pts += 3;
            else if (a === b) pts += 1;
          } else if (m.teamB.id === team.id) {
            gf += m.scoreB ?? 0;
            ga += m.scoreA ?? 0;
            const a = m.scoreA ?? 0;
            const b = m.scoreB ?? 0;
            if (b > a) pts += 3;
            else if (a === b) pts += 1;
          }
        });
        return { ...team, pts, gf, gd: gf - ga };
      });

      return standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    },
    [matches]
  );

  // --- Horizontal zoom effect: translate the track to center the active lane ---
  // Uses offsetLeft/offsetWidth (layout metrics) so the measurement is stable
  // even while the lanes are scaled via transform.
  const recompute = useCallback(() => {
    const vp = viewportRef.current;
    const lane = columnRefs.current.get(activeRound);
    if (!vp || !lane) return;
    const center = lane.offsetLeft + lane.offsetWidth / 2;
    setX(vp.clientWidth / 2 - center);
  }, [activeRound]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [recompute]);

  // Focus a round (from a pill or by clicking a non-active lane).
  const focusRound = useCallback((roundKey: string) => {
    setActiveRound(roundKey);
  }, []);

  // Anime.js entrance animation (connectors + group cards)
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const t = setTimeout(() => {
      animate(".bracket-group-card", {
        opacity: [0, 1],
        translateX: [-24, 0],
        scale: [0.92, 1],
        duration: 650,
        delay: stagger(55, { from: "first" }),
        ease: "outCubic",
      });
      animate(".bracket-connector", {
        opacity: [0, 1],
        scaleX: [0, 1],
        duration: 700,
        delay: stagger(100, { from: "first" }),
        ease: "inOutCubic",
      });
      // Lanes may have shifted after the entrance; re-center the active one.
      recompute();
    }, 120);
    return () => clearTimeout(t);
  }, [recompute]);

  const knockoutMatches = {
    "16vos": matches.filter((m) => m.stage === "16vos"),
    "8vos": matches.filter((m) => m.stage === "8vos"),
    CF: matches.filter((m) => m.stage === "CF"),
    SF: matches.filter((m) => m.stage === "SF"),
    F: matches.filter((m) => m.stage === "F"),
  };

  // Scale/opacity of a lane based on its distance to the active round.
  // Active: scale 1 / opacity 1. Others shrink + dim proportionally (depth).
  const laneAnim = (roundKey: string) => {
    const activeIndex = ROUNDS.findIndex((r) => r.key === activeRound);
    const colIndex = ROUNDS.findIndex((r) => r.key === roundKey);
    const dist = Math.abs(activeIndex - colIndex);
    const isActive = dist === 0;
    return {
      scale: isActive ? 1 : Math.max(0.78, 0.9 - dist * 0.04),
      opacity: isActive ? 1 : Math.max(0.28, 0.55 - dist * 0.1),
      filter: isActive ? "saturate(1)" : "saturate(0.65)",
    };
  };

  const MatchCard = ({ match, index }: { match: Match; index: number }) => {
    const locked = isMatchLocked(match);
    const hasResult = match.status === "Finished" || match.status === "Live";
    const prediction = predictions.find((p) => p.matchId === match.id && p.employeeId === activeEmployeeId);
    const matchPredictions = predictions.filter((p) => p.matchId === match.id);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.85, x: 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, delay: index * 0.04, ease: [0.32, 0.72, 0, 1] }}
        className="relative h-full flex items-center"
      >
        <div
          className={`relative bg-worldcup-card hover:bg-worldcup-card-hover border ${
            hasResult
              ? "border-emerald-700/60"
              : locked
              ? "border-amber-700/40"
              : "border-slate-800/90 hover:border-slate-700"
          } rounded-xl p-3 transition-colors w-full text-left shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono font-bold tracking-tight border-b border-white/5 pb-1.5 text-slate-400">
            <span className="truncate">
              {match.date} · {match.time}
            </span>
            <span className={`flex items-center gap-0.5 ${locked ? "text-red-400" : "text-emerald-400"}`}>
              {locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {locked ? "Cerrado" : "Abierto"}
            </span>
          </div>
          {/* Teams */}
          <div className="space-y-1.5 mb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <TeamFlag flag={match.teamA.flag || "🏳️"} className="text-lg" />
                <span
                  className={`text-xs truncate ${
                    match.teamA.isPlaceholder ? "text-slate-400 italic" : "text-slate-100 font-semibold"
                  }`}
                >
                  {match.teamA.name}
                </span>
              </div>
              <span
                className={`font-mono text-sm font-bold px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 ${
                  hasResult && (match.scoreA ?? 0) > (match.scoreB ?? 0) ? "text-emerald-400" : "text-slate-300"
                }`}
              >
                {hasResult ? match.scoreA : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <TeamFlag flag={match.teamB.flag || "🏳️"} className="text-lg" />
                <span
                  className={`text-xs truncate ${
                    match.teamB.isPlaceholder ? "text-slate-400 italic" : "text-slate-100 font-semibold"
                  }`}
                >
                  {match.teamB.name}
                </span>
              </div>
              <span
                className={`font-mono text-sm font-bold px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 ${
                  hasResult && (match.scoreB ?? 0) > (match.scoreA ?? 0) ? "text-emerald-400" : "text-slate-300"
                }`}
              >
                {hasResult ? match.scoreB : "-"}
              </span>
            </div>
          </div>

          {/* Prediction mini form */}
          <div className="bg-slate-950/85 rounded-lg p-2 border border-slate-900 text-[11px]">
            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-white/5 mb-1">
              <span>
                👤 {activeEmployee?.name.split(" ")[0]} <span className="text-slate-600">(Pred.)</span>
              </span>
              {prediction && hasResult && (
                <span className="font-mono font-bold text-worldcup-accent">
                  {(() => {
                    if (match.scoreA === null || match.scoreB === null) return "";
                    const exact = prediction.predictedScoreA === match.scoreA && prediction.predictedScoreB === match.scoreB;
                    if (exact) return "🎉 +3";
                    const rW = match.scoreA > match.scoreB ? "A" : match.scoreA < match.scoreB ? "B" : "D";
                    const pW =
                      prediction.predictedScoreA > prediction.predictedScoreB
                        ? "A"
                        : prediction.predictedScoreA < prediction.predictedScoreB
                        ? "B"
                        : "D";
                    return rW === pW ? "👍 +1" : "❌ 0";
                  })()}
                </span>
              )}
            </div>
            {!locked ? (
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-slate-500">Pronóstico:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={prediction?.predictedScoreA ?? ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                      onUpdatePrediction(match.id, val, prediction?.predictedScoreB ?? 0);
                    }}
                    className="w-8 h-6 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-slate-100 font-mono focus:border-worldcup-accent focus:outline-none"
                  />
                  <span className="text-slate-600">-</span>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={prediction?.predictedScoreB ?? ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                      onUpdatePrediction(match.id, prediction?.predictedScoreA ?? 0, val);
                    }}
                    className="w-8 h-6 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-slate-100 font-mono focus:border-worldcup-accent focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {prediction ? (
                  <span className="font-mono text-xs font-bold text-slate-300">
                    Predijo:{" "}
                    <span className="text-worldcup-accent">
                      {prediction.predictedScoreA} - {prediction.predictedScoreB}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[10px] italic">Sin predicción</span>
                )}
                <span className="flex items-center gap-0.5 text-[10px] text-blue-400 font-mono">
                  <Users className="w-3 h-3" /> {matchPredictions.length}
                </span>
              </div>
            )}
          </div>

          {canManageResults && (
          <button
            onClick={() => onOpenSimulationModal(match)}
            className="mt-2 w-full text-center py-1 rounded bg-slate-900/60 hover:bg-slate-950/90 border border-white/5 hover:border-slate-700 text-[11px] font-medium text-slate-300 transition-colors"
          >
            ⚙️ Gestionar Resultado
          </button>
          )}
        </div>
      </motion.div>
    );
  };

  const GroupMiniCard = ({ groupName }: { groupName: string }) => {
    const standings = getGroupStandings(groupName);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92, x: -30 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="bracket-group-card bg-worldcup-card border border-slate-800/80 rounded-xl p-2.5 hover:border-slate-700 transition-colors"
      >
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center justify-between">
          <span>{groupName}</span>
          <span className="text-[9px] font-mono text-slate-500">PTS</span>
        </div>
        <div className="space-y-1">
          {standings.map((team, i) => (
            <div key={team.id} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i === 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : i === 1
                      ? "bg-sky-500/20 text-sky-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                <TeamFlag flag={team.flag} className="text-base" />
                <span className={`truncate ${i < 2 ? "text-slate-100 font-semibold" : "text-slate-400"}`}>{team.name}</span>
              </span>
              <span className="font-mono font-bold text-slate-300">{team.pts}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Wraps a round lane: registers its ref, applies the depth animation and
  // makes non-active lanes clickable to focus them.
  const Lane = ({ roundKey, className, children }: { roundKey: string; className?: string; children: React.ReactNode }) => {
    const isActive = activeRound === roundKey;
    return (
      <motion.div
        ref={(el) => {
          if (el) columnRefs.current.set(roundKey, el);
        }}
        onClick={() => !isActive && focusRound(roundKey)}
        animate={laneAnim(roundKey)}
        transition={LANE_SPRING}
        className={`bracket-round-column origin-center shrink-0 ${isActive ? "" : "cursor-pointer"} ${className ?? ""}`}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Round pills — control, with a sliding active background (layoutId) */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-slate-800 bg-slate-950/60 p-1 bracket-nav-scroll max-w-full">
          {ROUNDS.map((r) => {
            const isActive = activeRound === r.key;
            return (
              <button
                key={r.key}
                onClick={() => focusRound(r.key)}
                className={`relative flex-shrink-0 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="bracket-round-pill"
                    className={`absolute inset-0 rounded-full ${r.pill}`}
                    transition={PILL_SPRING}
                  />
                )}
                <span className="relative z-10">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px] sm:text-[11px] text-slate-500 font-sans -mt-1">
        Toca una ronda o un carril para acercarte.
      </p>

      {/* Viewport + sliding track (centers the active lane via translateX) */}
      <div
        ref={viewportRef}
        className="bracket-scroll-container relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30"
      >
        <motion.div
          className="relative flex items-stretch gap-2 py-4 sm:py-6 min-h-[500px] sm:min-h-[620px]"
          style={{ paddingInline: "12vw" }}
          animate={{ x }}
          transition={TRACK_SPRING}
        >
          {/* ==================== FG Column ==================== */}
          <Lane roundKey="FG" className="w-[220px] sm:w-[280px] md:w-[300px] flex flex-col gap-2 sm:gap-3">
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Fase de Grupos</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 content-start">
              {["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H", "Grupo I", "Grupo J", "Grupo K", "Grupo L"].map((g) => (
                <div key={g}>
                  <GroupMiniCard groupName={g} />
                </div>
              ))}
            </div>
          </Lane>

          {/* ==================== 16vos ==================== */}
          <Lane roundKey="16vos" className="w-[200px] sm:w-[240px] md:w-[260px] flex flex-col">
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-sm mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Dieciseisavos</span>
            </div>
            <div className="flex-1 flex flex-col">
              {knockoutMatches["16vos"].map((match, i) => (
                <div key={match.id} className="flex-1 flex items-center py-1">
                  <MatchCard match={match} index={i} />
                </div>
              ))}
            </div>
          </Lane>

          {/* Connector 16vos → 8vos */}
          <div className="bracket-connector shrink-0 hidden md:flex flex-col">
            <KnockoutConnector count={8} />
          </div>

          {/* ==================== Octavos ==================== */}
          <Lane roundKey="8vos" className="w-[200px] sm:w-[240px] md:w-[260px] flex flex-col">
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-sky-400">Octavos de Final</span>
            </div>
            <div className="flex-1 flex flex-col">
              {knockoutMatches["8vos"].map((match, i) => (
                <div key={match.id} className="flex-1 flex items-center py-1">
                  <MatchCard match={match} index={i} />
                </div>
              ))}
            </div>
          </Lane>

          {/* Connector 8vos → CF */}
          <div className="bracket-connector shrink-0 hidden md:flex flex-col">
            <KnockoutConnector count={4} />
          </div>

          {/* ==================== Cuartos ==================== */}
          <Lane roundKey="CF" className="w-[200px] sm:w-[240px] md:w-[260px] flex flex-col">
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-violet-500/20 bg-violet-500/10 backdrop-blur-sm mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-violet-400">Cuartos de Final</span>
            </div>
            <div className="flex-1 flex flex-col">
              {knockoutMatches["CF"].map((match, i) => (
                <div key={match.id} className="flex-1 flex items-center py-1">
                  <MatchCard match={match} index={i} />
                </div>
              ))}
            </div>
          </Lane>

          {/* Connector CF → SF */}
          <div className="bracket-connector shrink-0 hidden md:flex flex-col">
            <KnockoutConnector count={2} />
          </div>

          {/* ==================== Semis ==================== */}
          <Lane roundKey="SF" className="w-[200px] sm:w-[240px] md:w-[260px] flex flex-col">
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-purple-500/20 bg-purple-500/10 backdrop-blur-sm mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-purple-400">Semifinales</span>
            </div>
            <div className="flex-1 flex flex-col">
              {knockoutMatches["SF"].map((match, i) => (
                <div key={match.id} className="flex-1 flex items-center py-1">
                  <MatchCard match={match} index={i} />
                </div>
              ))}
            </div>
          </Lane>

          {/* Connector SF → F */}
          <div className="bracket-connector shrink-0 hidden md:flex flex-col">
            <KnockoutConnector count={1} />
          </div>

          {/* ==================== Final ==================== */}
          <Lane roundKey="F" className="w-[220px] sm:w-[260px] md:w-[280px] flex flex-col">
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-yellow-400">🏆 Finales</span>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              {knockoutMatches["F"].map((match, i) => (
                <div key={match.id} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-500/70">
                    {match.id === "F_1" ? "Gran Final" : "3er Lugar"}
                  </span>
                  <div className="w-full">
                    <MatchCard match={match} index={i} />
                  </div>
                </div>
              ))}
            </div>
          </Lane>
        </motion.div>

        {/* Edge fade (depth cue) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-20" />
      </div>
    </div>
  );
};
