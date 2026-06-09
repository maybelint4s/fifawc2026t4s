import React, { useEffect, useRef, useState, useCallback } from "react";
import { Match, Prediction, Employee } from "../types";
import { INITIAL_TEAMS } from "../data";
import { Lock, Unlock, Users } from "lucide-react";
import { motion } from "motion/react";
import { animate, stagger } from "animejs";

interface BracketTreeProps {
  matches: Match[];
  predictions: Prediction[];
  employees: Employee[];
  activeEmployeeId: string;
  simulatedTime: string;
  onUpdatePrediction: (matchId: string, teamAVal: number, teamBVal: number) => void;
  onOpenSimulationModal: (match: Match) => void;
}

const ROUNDS = [
  { key: "FG", label: "Grupos", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { key: "8vos", label: "Octavos", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { key: "CF", label: "Cuartos", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { key: "SF", label: "Semis", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { key: "F", label: "Final", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
] as const;

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
  simulatedTime,
  onUpdatePrediction,
  onOpenSimulationModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeRound, setActiveRound] = useState<string>("FG");
  const [focusMode, setFocusMode] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasAnimated = useRef(false);
  const isDrag = useRef(false);

  const isMatchLocked = (match: Match): boolean => {
    return new Date(simulatedTime) >= new Date(match.datetimeISO);
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

  const scrollToRound = useCallback(
    (roundKey: string) => {
      setActiveRound(roundKey);
      // Clicking "Grupos" resets to the initial full-tree view (zoom out)
      setFocusMode(roundKey !== "FG");
      const col = columnRefs.current.get(roundKey);
      const container = scrollRef.current;
      if (!col || !container) return;
      const target = col.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: target, behavior: "smooth" });
    },
    []
  );

  const onPointerDown = (e: React.PointerEvent) => {
    isDrag.current = false;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft || 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 5) isDrag.current = true;
    if (isDrag.current) setFocusMode(false);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx * 1.2;
    }
  };

  const onPointerUp = () => {
    setIsDragging(false);
    if (!isDrag.current) return;
    const container = scrollRef.current;
    if (!container) return;
    let closest = "FG";
    let minDist = Infinity;
    ROUNDS.forEach((r) => {
      const col = columnRefs.current.get(r.key);
      if (!col) return;
      const dist = Math.abs(col.offsetLeft - container.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = r.key;
      }
    });
    setActiveRound(closest);
  };

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
    }, 120);
    return () => clearTimeout(t);
  }, []);

  const knockoutMatches = {
    "8vos": matches.filter((m) => m.stage === "8vos"),
    CF: matches.filter((m) => m.stage === "CF"),
    SF: matches.filter((m) => m.stage === "SF"),
    F: matches.filter((m) => m.stage === "F"),
  };

  const getColumnAnimation = (roundKey: string) => {
    if (!focusMode) {
      return { scale: 1, opacity: 1, filter: "blur(0px)" };
    }
    const activeIndex = ROUNDS.findIndex((r) => r.key === activeRound);
    const colIndex = ROUNDS.findIndex((r) => r.key === roundKey);
    const dist = Math.abs(activeIndex - colIndex);

    if (dist === 0) {
      return { scale: 1, opacity: 1, filter: "blur(0px)" };
    }
    if (dist === 1) {
      return { scale: 0.9, opacity: 0.25, filter: "blur(4px)" };
    }
    return { scale: 0.8, opacity: 0, filter: "blur(8px)" };
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
          className={`relative bg-[#111936] hover:bg-[#18234a] border ${
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
                <span className="text-lg">{match.teamA.flag || "🏳️"}</span>
                <span
                  className={`text-xs truncate ${
                    match.teamA.isPlaceholder ? "text-slate-400 italic" : "text-white font-semibold"
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
                <span className="text-lg">{match.teamB.flag || "🏳️"}</span>
                <span
                  className={`text-xs truncate ${
                    match.teamB.isPlaceholder ? "text-slate-400 italic" : "text-white font-semibold"
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
                    className="w-8 h-6 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-white font-mono focus:border-worldcup-accent focus:outline-none"
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
                    className="w-8 h-6 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-white font-mono focus:border-worldcup-accent focus:outline-none"
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

          <button
            onClick={() => onOpenSimulationModal(match)}
            className="mt-2 w-full text-center py-1 rounded bg-slate-900/60 hover:bg-slate-950/90 border border-white/5 hover:border-slate-700 text-[11px] font-medium text-slate-300 transition-colors"
          >
            ⚙️ Gestionar Resultado
          </button>
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
        className="bracket-group-card bg-[#111936] border border-slate-800/80 rounded-xl p-2.5 hover:border-slate-700 transition-colors"
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
                <span className="text-base leading-none">{team.flag}</span>
                <span className={`truncate ${i < 2 ? "text-white font-semibold" : "text-slate-400"}`}>{team.name}</span>
              </span>
              <span className="font-mono font-bold text-slate-300">{team.pts}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 bracket-nav-scroll">
        {ROUNDS.map((r) => {
          const isActive = activeRound === r.key;
          return (
            <button
              key={r.key}
              onClick={() => scrollToRound(r.key)}
              className={`flex-shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                isActive
                  ? `${r.bg} ${r.color} ${r.border} shadow-lg scale-105`
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Horizontal Scroll Tree */}
      <div
        ref={scrollRef}
        className="bracket-scroll-container relative rounded-2xl border border-slate-800/60 bg-slate-950/30"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="flex items-stretch px-2 sm:px-4 py-4 sm:py-6 gap-2 min-h-[500px] sm:min-h-[620px]">
          {/* ==================== FG Column ==================== */}
          <motion.div
            ref={(el) => {
              if (el) columnRefs.current.set("FG", el);
            }}
            animate={getColumnAnimation("FG")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-round-column w-[220px] sm:w-[280px] md:w-[300px] flex flex-col gap-2 sm:gap-3 shrink-0"
          >
            <div className="sticky top-0 z-10 text-center py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Fase de Grupos</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 content-start">
              {["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"].map((g) => (
                <div key={g}>
                  <GroupMiniCard groupName={g} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ==================== Octavos ==================== */}
          <motion.div
            ref={(el) => {
              if (el) columnRefs.current.set("8vos", el);
            }}
            animate={getColumnAnimation("8vos")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-round-column w-[200px] sm:w-[240px] md:w-[260px] flex flex-col shrink-0"
          >
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
          </motion.div>

          {/* Connector 8vos → CF */}
          <motion.div
            animate={getColumnAnimation("8vos")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-connector shrink-0 hidden md:flex flex-col"
          >
            <KnockoutConnector count={4} />
          </motion.div>

          {/* ==================== Cuartos ==================== */}
          <motion.div
            ref={(el) => {
              if (el) columnRefs.current.set("CF", el);
            }}
            animate={getColumnAnimation("CF")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-round-column w-[200px] sm:w-[240px] md:w-[260px] flex flex-col shrink-0"
          >
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
          </motion.div>

          {/* Connector CF → SF */}
          <motion.div
            animate={getColumnAnimation("CF")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-connector shrink-0 hidden md:flex flex-col"
          >
            <KnockoutConnector count={2} />
          </motion.div>

          {/* ==================== Semis ==================== */}
          <motion.div
            ref={(el) => {
              if (el) columnRefs.current.set("SF", el);
            }}
            animate={getColumnAnimation("SF")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-round-column w-[200px] sm:w-[240px] md:w-[260px] flex flex-col shrink-0"
          >
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
          </motion.div>

          {/* Connector SF → F */}
          <motion.div
            animate={getColumnAnimation("SF")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-connector shrink-0 hidden md:flex flex-col"
          >
            <KnockoutConnector count={1} />
          </motion.div>

          {/* ==================== Final ==================== */}
          <motion.div
            ref={(el) => {
              if (el) columnRefs.current.set("F", el);
            }}
            animate={getColumnAnimation("F")}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="bracket-round-column w-[220px] sm:w-[260px] md:w-[280px] flex flex-col shrink-0 pr-2 sm:pr-4"
          >
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};
