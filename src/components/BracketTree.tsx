import React from "react";
import { Match, Prediction, Employee } from "../types";
import { Lock, Unlock, Users, ChevronRight, AlertCircle, Sparkles } from "lucide-react";

interface BracketTreeProps {
  matches: Match[];
  predictions: Prediction[];
  employees: Employee[];
  activeEmployeeId: string;
  simulatedTime: string; // ISO String
  onUpdatePrediction: (matchId: string, teamAVal: number, teamBVal: number) => void;
  onOpenSimulationModal: (match: Match) => void;
}

export const BracketTree: React.FC<BracketTreeProps> = ({
  matches,
  predictions,
  employees,
  activeEmployeeId,
  simulatedTime,
  onUpdatePrediction,
  onOpenSimulationModal,
}) => {
  // Check if a match is locked (current simulated time has passed start time)
  const isMatchLocked = (match: Match): boolean => {
    return new Date(simulatedTime) >= new Date(match.datetimeISO);
  };

  // Switch to format time beautifully
  const formatMatchTime = (isoString: string) => {
    const d = new Date(isoString);
    // Spanish terms
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const dayName = days[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12;
    hours = hours ? hours : 12; // standard 12 hr
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${dayName}, ${monthName} ${dateNum} · ${hours}:${minutesStr} ${ampm}`;
  };

  // Extract rounds
  const round_16 = matches.filter((m) => m.stage === "8vos");
  const quarter_finals = matches.filter((m) => m.stage === "CF");
  const semi_finals = matches.filter((m) => m.stage === "SF");
  const finals = matches.filter((m) => m.stage === "F");

  // Get active user info
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId);

  // Helper to render a match card
  const renderMatchCard = (match: Match) => {
    const locked = isMatchLocked(match);
    const hasResult = match.status === "Finished" || match.status === "Live";

    // Find current user prediction
    const prediction = predictions.find(
      (p) => p.matchId === match.id && p.employeeId === activeEmployeeId
    );

    // Get all predictions for this match (if locked)
    const matchPredictions = predictions.filter((p) => p.matchId === match.id);

    return (
      <div
        key={match.id}
        className={`relative group bg-worldcup-card hover:bg-worldcup-card-hover border ${
          hasResult
            ? "border-emerald-700/60 shadow- emerald-800/10"
            : locked
            ? "border-amber-700/40 shadow-sm"
            : "border-slate-800/90 hover:border-slate-700"
        } rounded-xl p-3.5 transition-all w-[240px] md:w-[260px] text-left shrink-0 shadow-lg`}
      >
        {/* Header of card: date and status */}
        <div className="flex items-center justify-between mb-2.5 text-[10px] font-mono font-bold tracking-tight border-b border-white/5 pb-1.5 text-slate-400">
          <span className="truncate">{formatMatchTime(match.datetimeISO)}</span>
          
          <div className="flex items-center gap-1">
            {locked ? (
              <span className="flex items-center gap-0.5 text-red-400 font-sans" title="Predicciones bloqueadas">
                <Lock className="w-3 h-3" /> Cerrado
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-emerald-400 font-sans" title="Predicciones abiertas">
                <Unlock className="w-3 h-3" /> Abierto
              </span>
            )}
          </div>
        </div>

        {/* Content / Match Teams */}
        <div className="space-y-2 mb-3">
          {/* Team A */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[150px]">
              <span className="text-xl select-none" role="img">{match.teamA.flag || "🏳️"}</span>
              <span className={`text-xs md:text-sm truncate ${match.teamA.isPlaceholder ? "text-slate-400 font-sans italic" : "text-white font-semibold"}`}>
                {match.teamA.name}
              </span>
            </div>
            
            {/* Real score or placeholder */}
            <div className="flex items-center gap-1 font-mono">
              {match.status === "Finished" || match.status === "Live" ? (
                <span className={`text-base font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-white/5 ${match.scoreA! > match.scoreB! ? "text-emerald-400 font-black" : "text-slate-300"}`}>
                  {match.scoreA}
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-bold bg-slate-950/40 px-2 py-0.5 rounded border border-white/5">
                  -
                </span>
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[150px]">
              <span className="text-xl select-none" role="img">{match.teamB.flag || "🏳️"}</span>
              <span className={`text-xs md:text-sm truncate ${match.teamB.isPlaceholder ? "text-slate-400 font-sans italic" : "text-white font-semibold"}`}>
                {match.teamB.name}
              </span>
            </div>
            
            {/* Real score */}
            <div className="flex items-center gap-1 font-mono">
              {match.status === "Finished" || match.status === "Live" ? (
                <span className={`text-base font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-white/5 ${match.scoreB! > match.scoreA! ? "text-emerald-400 font-black" : "text-slate-300"}`}>
                  {match.scoreB}
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-bold bg-slate-950/40 px-2 py-0.5 rounded border border-white/5">
                  -
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Prediction section for this card */}
        <div className="bg-slate-950/85 rounded-lg p-2 border border-slate-900 flex flex-col justify-center text-xs mt-2.5">
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/5 mb-1 text-slate-400">
            <span className="truncate flex items-center gap-0.5">
              <span>👤 {activeEmployee?.name.split(" ")[0]} </span>
              <span className="text-[9px] text-slate-500">(Predicción)</span>
            </span>
            {prediction && hasResult && (
              <span className="font-mono font-bold text-worldcup-accent decoration-none">
                {/* Calculate points for hover summary */}
                {(() => {
                  if (match.scoreA === null || match.scoreB === null) return "";
                  const exact = prediction.predictedScoreA === match.scoreA && prediction.predictedScoreB === match.scoreB;
                  if (exact) return "🎉 +3 Pts";
                  const rWinner = match.scoreA > match.scoreB ? "A" : match.scoreA < match.scoreB ? "B" : "D";
                  const pWinner = prediction.predictedScoreA > prediction.predictedScoreB ? "A" : prediction.predictedScoreA < prediction.predictedScoreB ? "B" : "D";
                  return rWinner === pWinner ? "👍 +1 Pt" : "❌ +0 Pts";
                })()}
              </span>
            )}
          </div>

          {/* Actual score inputs or display */}
          {!locked ? (
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] text-slate-500 font-sans">Elige tu pronóstico:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={prediction?.predictedScoreA ?? ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    onUpdatePrediction(match.id, val, prediction?.predictedScoreB ?? 0);
                  }}
                  className="w-8 h-6 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-white font-mono focus:border-worldcup-accent focus:outline-none"
                  placeholder="0"
                />
                <span className="text-slate-600 font-sans">-</span>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={prediction?.predictedScoreB ?? ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    onUpdatePrediction(match.id, prediction?.predictedScoreA ?? 0, val);
                  }}
                  className="w-8 h-6 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-white font-mono focus:border-worldcup-accent focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {prediction ? (
                <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded font-mono text-xs font-bold text-slate-300">
                  <span>Predijo: </span>
                  <span className="text-worldcup-accent">{prediction.predictedScoreA}</span>
                  <span className="text-slate-600">-</span>
                  <span className="text-worldcup-accent">{prediction.predictedScoreB}</span>
                </div>
              ) : (
                <span className="text-slate-500 font-sans text-[10px] italic">Sin predicción (Cerrado)</span>
              )}
              
              {/* Other employees link indicator */}
              <div className="flex items-center gap-1 text-[10px] text-blue-400 font-mono">
                <Users className="w-3 h-3" />
                <span>{matchPredictions.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Click to open simulate modal if admin */}
        <div className="mt-2.5 flex items-center justify-between">
          <button
            onClick={() => onOpenSimulationModal(match)}
            className="w-full text-center py-1 rounded bg-slate-900/60 hover:bg-slate-950/90 border border-white/5 hover:border-slate-700 text-[11px] font-medium text-slate-300 flex items-center justify-center gap-1 transition-all"
          >
            ⚙️ Gestionar Resultado
          </button>
        </div>

        {/* Live results showing predictions once started */}
        {locked && (
          <div className="mt-2 border-t border-white/5 pt-2">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1">
              Pronósticos de Compañeros
            </span>
            <div id={`coworker-predictions-${match.id}`} className="max-h-[80px] overflow-y-auto space-y-1 pr-1">
              {employees.map((emp) => {
                const empPred = predictions.find((p) => p.matchId === match.id && p.employeeId === emp.id);
                if (!empPred) return null;
                const isUser = emp.id === activeEmployeeId;
                return (
                  <div key={emp.id} className={`flex items-center justify-between text-[10px] py-0.5 px-1.5 rounded ${isUser ? "bg-slate-950/80 border border-worldcup-accent/20" : "bg-slate-950/40"}`}>
                    <span className="text-slate-300 truncate max-w-[120px] flex items-center gap-1">
                      <span>{emp.avatar}</span>
                      <span>{emp.name}</span>
                    </span>
                    <strong className="font-mono text-white text-right">
                      {empPred.predictedScoreA} - {empPred.predictedScoreB}
                    </strong>
                  </div>
                );
              })}
              {matchPredictions.length === 0 && (
                <span className="text-[10px] text-slate-500 font-sans italic">Nadie predijo para este partido</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="bracket-tree-canvas" className="overflow-x-auto w-full py-4 px-2" style={{ contentVisibility: "auto" }}>
      {/* Dynamic bracket columns resembling lines */}
      <div className="flex gap-8 md:gap-11 min-w-[1020px] pb-6 justify-between items-stretch">
        
        {/* Column 1: Octavos (8vos) */}
        <div className="flex flex-col gap-6 justify-around">
          <div className="text-center font-mono text-sm tracking-wider font-extrabold text-white border-b border-slate-800 pb-1.5 uppercase flex items-center justify-center gap-1.5 bg-slate-900 py-1 rounded-t-lg">
            <span>8vos de Final</span>
            <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded">1/8</span>
          </div>
          <div className="space-y-6 flex flex-col justify-around h-full">
            {round_16.slice(0, 4).map((match) => (
              <div key={match.id} className="relative flex items-center">
                {renderMatchCard(match)}
                {/* Tree Line Connector to CF */}
                <div className="hidden lg:block absolute left-full w-4 md:w-6 h-0.5 bg-slate-800" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Cuartos de Final (CF) */}
        <div className="flex flex-col gap-6 justify-around">
          <div className="text-center font-mono text-sm tracking-wider font-extrabold text-white border-b border-slate-800 pb-1.5 uppercase flex items-center justify-center gap-1.5 bg-slate-900 py-1 rounded-t-lg">
            <span>Cuartos de Final</span>
            <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.2 rounded">1/4</span>
          </div>
          <div className="space-y-12 flex flex-col justify-around h-full">
            {quarter_finals.slice(0, 2).map((match) => (
              <div key={match.id} className="relative flex items-center">
                {/* Line coming from previous rounds */}
                <div className="hidden lg:block absolute right-full w-4 md:w-6 h-0.5 bg-slate-800" />
                {renderMatchCard(match)}
                {/* Link going forward */}
                <div className="hidden lg:block absolute left-full w-4 md:w-6 h-0.5 bg-slate-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Semifinales (SF) */}
        <div className="flex flex-col gap-6 justify-around">
          <div className="text-center font-mono text-sm tracking-wider font-extrabold text-white border-b border-slate-800 pb-1.5 uppercase flex items-center justify-center gap-1.5 bg-slate-900 py-1 rounded-t-lg">
            <span>Semifinales</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.2 rounded">1/2</span>
          </div>
          <div className="space-y-24 flex flex-col justify-around h-full">
            {semi_finals.map((match) => (
              <div key={match.id} className="relative flex items-center">
                <div className="hidden lg:block absolute right-full w-4 md:w-6 h-0.5 bg-slate-700" />
                {renderMatchCard(match)}
                <div className="hidden lg:block absolute left-full w-4 md:w-6 h-0.5 bg-slate-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Final & Tercer Lugar (F) */}
        <div className="flex flex-col gap-6 justify-around">
          <div className="text-center font-mono text-sm tracking-wider font-extrabold text-worldcup-accent border-b border-slate-800 pb-1.5 uppercase flex items-center justify-center gap-1.5 bg-slate-900 py-1 rounded-t-lg">
            <span>🏆 Final</span>
            <span className="text-[10px] bg-yellow-500/20 text-worldcup-accent px-1.5 py-0.2 rounded">FIN</span>
          </div>
          <div className="space-y-8 flex flex-col justify-center h-full">
            {finals.map((match) => (
              <div key={match.id} className="relative flex flex-col bg-slate-900/50 p-2 rounded-xl mb-4 text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-worldcup-accent mb-1">
                  {match.id === "F_1" ? "🏆 Gran Final Mundialista" : "🥉 Partido 3er Lugar"}
                </span>
                <div className="relative flex items-center">
                  <div className="hidden lg:block absolute right-full w-4 md:w-6 h-0.5 bg-slate-600" />
                  {renderMatchCard(match)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Side info bar highlighting progression */}
      <div className="mt-4 p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl max-w-2xl mx-auto flex items-center gap-3 text-slate-300">
        <AlertCircle className="w-5 h-5 text-worldcup-accent shrink-0" />
        <p className="text-xs leading-relaxed font-sans">
          <strong>Árbol Interactivo 2026:</strong> Al finalizar un partido con resultado real, el equipo ganador avanzará automáticamente a la siguiente etapa de las eliminatorias (ej. de 8vos a Cuartos, Semis, etc.), conectando el torneo entero. ¡Simula resultados reales para ver el árbol actualizarse en tiempo real!
        </p>
      </div>
    </div>
  );
};
