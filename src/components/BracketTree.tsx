import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Match, Prediction, Employee, Team } from "../types";
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
  { key: "FG", label: "Grupos", color: "text-emerald-400", pill: "bg-emerald-400", headerClass: "border-emerald-500/20 bg-emerald-500/10", headerLabel: "Fase de Grupos" },
  { key: "16vos", label: "Dieciseisavos", color: "text-indigo-400", pill: "bg-indigo-400", headerClass: "border-indigo-500/20 bg-indigo-500/10", headerLabel: "Dieciseisavos" },
  { key: "8vos", label: "Octavos", color: "text-sky-400", pill: "bg-sky-400", headerClass: "border-sky-500/20 bg-sky-500/10", headerLabel: "Octavos de Final" },
  { key: "CF", label: "Cuartos", color: "text-violet-400", pill: "bg-violet-400", headerClass: "border-violet-500/20 bg-violet-500/10", headerLabel: "Cuartos de Final" },
  { key: "SF", label: "Semis", color: "text-purple-400", pill: "bg-purple-400", headerClass: "border-purple-500/20 bg-purple-500/10", headerLabel: "Semifinales" },
  { key: "F", label: "Final", color: "text-yellow-400", pill: "bg-yellow-400", headerClass: "border-yellow-500/20 bg-yellow-500/10", headerLabel: "🏆 Finales" },
] as const;

// Spring transitions (values from prompt-bracket-arbol.md)
const TRACK_SPRING = { type: "spring", stiffness: 85, damping: 18, mass: 0.9 } as const;
const LANE_SPRING = { type: "spring", stiffness: 120, damping: 20 } as const;
const PILL_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const isMatchLocked = (match: Match): boolean =>
  match.status === "Finished" || match.status === "Live" || new Date() >= new Date(match.datetimeISO);

type GroupStanding = Team & { pts: number; gf: number; gd: number };

const computeGroupStandings = (groupName: string, matches: Match[]): GroupStanding[] => {
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
};

// Scale/opacity of a lane based on its distance to the active round.
// Active: scale 1 / opacity 1. Others shrink + dim proportionally (depth).
const laneAnim = (roundKey: string, activeRound: string) => {
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

/* ------------------------------------------------------------------
   Module-scope components: defined once (stable identity) so that a
   re-render of BracketTree (SWR revalidation, typing a score, …) only
   re-renders them with new props instead of remounting them. Remounting
   was re-triggering the entrance animations -> flicker + input focus loss.
   ------------------------------------------------------------------ */

interface MatchCardProps {
  match: Match;
  index: number;
  prediction?: Prediction;
  predictionCount: number;
  activeEmployeeName?: string;
  onUpdatePrediction: (matchId: string, teamAVal: number, teamBVal: number) => void;
  onOpenSimulationModal: (match: Match) => void;
  canManageResults: boolean;
}

const MatchCard = React.memo(function MatchCard({
  match,
  index,
  prediction,
  predictionCount,
  activeEmployeeName,
  onUpdatePrediction,
  onOpenSimulationModal,
  canManageResults,
}: MatchCardProps) {
  const locked = isMatchLocked(match);
  const hasResult = match.status === "Finished" || match.status === "Live";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 40 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.32, 0.72, 0, 1] }}
      className="relative w-full"
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
              👤 {activeEmployeeName?.split(" ")[0]} <span className="text-slate-600">(Pred.)</span>
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
                <Users className="w-3 h-3" /> {predictionCount}
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
});

const GroupMiniCard = React.memo(function GroupMiniCard({
  groupName,
  standings,
}: {
  groupName: string;
  standings: GroupStanding[];
}) {
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
});

const LANE_WIDTH: Record<string, string> = {
  FG: "w-[220px] sm:w-[280px] md:w-[300px]",
  F: "w-[220px] sm:w-[260px] md:w-[280px]",
};
const DEFAULT_LANE_WIDTH = "w-[200px] sm:w-[240px] md:w-[260px]";

const Lane = ({
  roundKey,
  activeRound,
  onFocus,
  registerRef,
  children,
}: {
  roundKey: string;
  activeRound: string;
  onFocus: (roundKey: string) => void;
  registerRef: (roundKey: string, el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) => {
  const round = ROUNDS.find((r) => r.key === roundKey)!;
  const isActive = activeRound === roundKey;
  const width = LANE_WIDTH[roundKey] ?? DEFAULT_LANE_WIDTH;
  return (
    <motion.div
      ref={(el) => registerRef(roundKey, el)}
      onClick={() => !isActive && onFocus(roundKey)}
      animate={laneAnim(roundKey, activeRound)}
      transition={LANE_SPRING}
      className={`bracket-lane origin-top shrink-0 h-full min-h-0 overflow-y-auto overflow-x-hidden flex flex-col ${width} ${
        isActive ? "" : "cursor-pointer"
      }`}
    >
      <div className={`sticky top-0 z-10 text-center py-2 rounded-xl border backdrop-blur-sm ${round.headerClass}`}>
        <span className={`text-xs font-black uppercase tracking-widest ${round.color}`}>{round.headerLabel}</span>
      </div>
      {children}
    </motion.div>
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

  const activeEmployee = employees.find((e) => e.id === activeEmployeeId);

  const registerRef = useCallback((roundKey: string, el: HTMLDivElement | null) => {
    if (el) columnRefs.current.set(roundKey, el);
    else columnRefs.current.delete(roundKey);
  }, []);

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
    const lane = columnRefs.current.get(roundKey);
    if (lane) lane.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Anime.js entrance animation (group cards) — runs once.
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
      recompute();
    }, 120);
    return () => clearTimeout(t);
  }, [recompute]);

  const knockoutMatches: Record<string, Match[]> = {
    "16vos": matches.filter((m) => m.stage === "16vos"),
    "8vos": matches.filter((m) => m.stage === "8vos"),
    CF: matches.filter((m) => m.stage === "CF"),
    SF: matches.filter((m) => m.stage === "SF"),
    F: matches.filter((m) => m.stage === "F"),
  };

  const renderMatch = (match: Match, index: number) => (
    <div key={match.id} className="shrink-0">
      <MatchCard
        match={match}
        index={index}
        prediction={predictions.find((p) => p.matchId === match.id && p.employeeId === activeEmployeeId)}
        predictionCount={predictions.filter((p) => p.matchId === match.id).length}
        activeEmployeeName={activeEmployee?.name}
        onUpdatePrediction={onUpdatePrediction}
        onOpenSimulationModal={onOpenSimulationModal}
        canManageResults={canManageResults}
      />
    </div>
  );

  const GROUPS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H", "Grupo I", "Grupo J", "Grupo K", "Grupo L"];

  return (
    <div className="flex flex-col gap-4 select-none min-w-0">
      {/* Round pills — control, with a sliding active background (layoutId) */}
      <div className="flex justify-center min-w-0">
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
        Toca una ronda para acercarte · cada ronda se desplaza por dentro.
      </p>

      {/* Viewport: fixed-height window. The track slides in X to center the
          active lane; each lane scrolls in Y on its own, so the container
          never grows (vertically or horizontally). */}
      <div
        ref={viewportRef}
        className="bracket-viewport relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/30 h-[560px] sm:h-[620px] w-full max-w-full"
      >
        <motion.div
          className="relative flex items-stretch gap-2 py-4 sm:py-6 h-full"
          style={{ paddingInline: "12vw" }}
          animate={{ x }}
          transition={TRACK_SPRING}
        >
          <Lane roundKey="FG" activeRound={activeRound} onFocus={focusRound} registerRef={registerRef}>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 content-start pt-2 pb-2">
              {GROUPS.map((g) => (
                <div key={g}>
                  <GroupMiniCard groupName={g} standings={computeGroupStandings(g, matches)} />
                </div>
              ))}
            </div>
          </Lane>

          <Lane roundKey="16vos" activeRound={activeRound} onFocus={focusRound} registerRef={registerRef}>
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-2 pb-2">
              {knockoutMatches["16vos"].map(renderMatch)}
            </div>
          </Lane>

          <Lane roundKey="8vos" activeRound={activeRound} onFocus={focusRound} registerRef={registerRef}>
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-2 pb-2">
              {knockoutMatches["8vos"].map(renderMatch)}
            </div>
          </Lane>

          <Lane roundKey="CF" activeRound={activeRound} onFocus={focusRound} registerRef={registerRef}>
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-2 pb-2">
              {knockoutMatches["CF"].map(renderMatch)}
            </div>
          </Lane>

          <Lane roundKey="SF" activeRound={activeRound} onFocus={focusRound} registerRef={registerRef}>
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-2 pb-2">
              {knockoutMatches["SF"].map(renderMatch)}
            </div>
          </Lane>

          <Lane roundKey="F" activeRound={activeRound} onFocus={focusRound} registerRef={registerRef}>
            <div className="flex flex-col justify-center gap-4 min-h-full pt-2 pb-2">
              {knockoutMatches["F"].map((match, i) => (
                <div key={match.id} className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-500/70">
                    {match.id === "F_1" ? "Gran Final" : "3er Lugar"}
                  </span>
                  <div className="w-full">
                    <MatchCard
                      match={match}
                      index={i}
                      prediction={predictions.find((p) => p.matchId === match.id && p.employeeId === activeEmployeeId)}
                      predictionCount={predictions.filter((p) => p.matchId === match.id).length}
                      activeEmployeeName={activeEmployee?.name}
                      onUpdatePrediction={onUpdatePrediction}
                      onOpenSimulationModal={onOpenSimulationModal}
                      canManageResults={canManageResults}
                    />
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
