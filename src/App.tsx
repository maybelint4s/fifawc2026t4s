import { useState, useEffect } from "react";
import { Team, Match, Employee, Prediction } from "./types";
import { INITIAL_TEAMS, DEFAULT_EMPLOYEES, INITIAL_MATCHES, PRELOADED_PREDICTIONS } from "./data";
import { Leaderboard } from "./components/Leaderboard";
import { ControlCenter } from "./components/ControlCenter";
import { GroupTables } from "./components/GroupTables";
import { BracketTree } from "./components/BracketTree";
import { FloatingMascot } from "./components/FloatingMascot";
import {
  Trophy,
  Sparkles,
  Calendar,
  Users,
  HelpCircle,
  TrendingUp,
  Lock,
  Unlock,
  Undo,
  Eye,
  BadgeAlert,
  Settings,
  Check,
  Info,
  CalendarDays,
  Plus,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // --------- STATE STORAGE & PERSISTENCE ---------
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("fifa_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("fifa_theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("fifa_employees_v1");
    return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem("fifa_matches_v1");
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [predictions, setPredictions] = useState<Prediction[]>(() => {
    const saved = localStorage.getItem("fifa_predictions_v1");
    return saved ? JSON.parse(saved) : PRELOADED_PREDICTIONS;
  });

  const [activeEmployeeId, setActiveEmployeeId] = useState<string>(() => {
    const saved = localStorage.getItem("fifa_active_emp_v1");
    return saved || "emp1";
  });

  const [simulatedTime, setSimulatedTime] = useState<string>(() => {
    const saved = localStorage.getItem("fifa_simulated_time_v1");
    return saved || "2026-06-11T12:00:00"; // Begins day of Opener
  });

  // Active UI Tabs: "ARBOL" (Interactive bracket tree) or "LISTA" (Fixtures list & group tables)
  const [activeTab, setActiveTab] = useState<"ARBOL" | "LISTA">("ARBOL");

  // Highlighting specific stage filter under LISTA mode: "FG" | "16vos" | "8vos" | "CF" | "SF" | "F"
  const [stageFilter, setStageFilter] = useState<"FG" | "8vos" | "CF" | "SF" | "F">("FG");

  // State for administrative results modal
  const [selectedSimulateMatch, setSelectedSimulateMatch] = useState<Match | null>(null);
  const [adminScoreA, setAdminScoreA] = useState<number>(0);
  const [adminScoreB, setAdminScoreB] = useState<number>(0);
  const [adminStatus, setAdminStatus] = useState<"Pending" | "Live" | "Finished">("Finished");
  const [adminTieWinner, setAdminTieWinner] = useState<"teamA" | "teamB">("teamA");

  // Notification Banner
  const [bannerMsg, setBannerMsg] = useState<{ text: string; type: "success" | "info" | "error" } | null>({
    text: "¡Bienvenido al Prode de la FIFA 2026! Predice marcadores, simula partidos y vive la emoción corporativa.",
    type: "info"
  });

  // Sync state to local storage when changed
  useEffect(() => {
    localStorage.setItem("fifa_employees_v1", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("fifa_matches_v1", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("fifa_predictions_v1", JSON.stringify(predictions));
  }, [predictions]);

  useEffect(() => {
    localStorage.setItem("fifa_active_emp_v1", activeEmployeeId);
  }, [activeEmployeeId]);

  useEffect(() => {
    localStorage.setItem("fifa_simulated_time_v1", simulatedTime);
  }, [simulatedTime]);

  const triggerToast = (text: string, type: "success" | "info" | "error" = "success") => {
    setBannerMsg({ text, type });
    setTimeout(() => {
      setBannerMsg((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // --------- HANDLERS ---------
  const handleSelectEmployee = (id: string) => {
    setActiveEmployeeId(id);
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      triggerToast(`Cargada la sesión de ${emp.name}. ¡Puedes realizar tus predicciones!`, "success");
    }
  };

  const handleAddEmployee = (name: string, role: string, avatar: string) => {
    const newId = `emp_${Date.now()}`;
    const newEmp: Employee = { id: newId, name, role, avatar };
    setEmployees((prev) => [...prev, newEmp]);
    setActiveEmployeeId(newId);
    triggerToast(`¡Bienvenido ${name} al Prode de la Empresa! Se ha creado tu perfil.`, "success");
  };

  const handleChangeSimulatedTime = (isoString: string) => {
    setSimulatedTime(isoString);
    const formatted = new Date(isoString).toLocaleDateString("es-ES", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    triggerToast(`Reloj oficial corporativo cambiado a: ${formatted}`, "info");
  };

  // Add/Update prediction
  const handleUpdatePrediction = (matchId: string, scoreA: number, scoreB: number) => {
    // Double check if locked based on simulated time
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    const isLocked = new Date(simulatedTime) >= new Date(match.datetimeISO);
    if (isLocked) {
      triggerToast("Este partido ya comenzó. Tu predicción quedó bloqueada.", "error");
      return;
    }

    setPredictions((prev) => {
      // Check if already exists
      const filtered = prev.filter(
        (p) => !(p.matchId === matchId && p.employeeId === activeEmployeeId)
      );
      return [
        ...filtered,
        {
          matchId,
          employeeId: activeEmployeeId,
          predictedScoreA: scoreA,
          predictedScoreB: scoreB,
        },
      ];
    });
  };

  // Open administrative simulate dialog
  const handleOpenSimulateModal = (match: Match) => {
    setSelectedSimulateMatch(match);
    setAdminScoreA(match.scoreA ?? 0);
    setAdminScoreB(match.scoreB ?? 0);
    setAdminStatus(match.status);
    setAdminTieWinner("teamA");
  };

  // Reset all matches and standings simulation back to default
  const handleResetSimulation = () => {
    if (window.confirm("¿Seguro que deseas reiniciar todos los resultados del Mundial a su estado inicial? Se conservarán los participantes y predicciones.")) {
      setMatches(INITIAL_MATCHES);
      triggerToast("Resultados oficiales reiniciados. ¡El árbol volvió al estado pendiente!", "info");
    }
  };

  // Submit Administrative real outcome
  const handleSaveRealScore = () => {
    if (!selectedSimulateMatch) return;

    const matchId = selectedSimulateMatch.id;
    let winnerId = "";
    let winnerName = "";
    let winnerFlag = "";

    // Determine visual knockout advancing team
    if (adminScoreA > adminScoreB) {
      winnerId = selectedSimulateMatch.teamA.id;
      winnerName = selectedSimulateMatch.teamA.name;
      winnerFlag = selectedSimulateMatch.teamA.flag;
    } else if (adminScoreB > adminScoreA) {
      winnerId = selectedSimulateMatch.teamB.id;
      winnerName = selectedSimulateMatch.teamB.name;
      winnerFlag = selectedSimulateMatch.teamB.flag;
    } else {
      // In case of a draw, check if it's knockout
      if (selectedSimulateMatch.stage !== "FG") {
        if (adminTieWinner === "teamA") {
          winnerId = selectedSimulateMatch.teamA.id;
          winnerName = selectedSimulateMatch.teamA.name + " (P)";
          winnerFlag = selectedSimulateMatch.teamA.flag;
        } else {
          winnerId = selectedSimulateMatch.teamB.id;
          winnerName = selectedSimulateMatch.teamB.name + " (P)";
          winnerFlag = selectedSimulateMatch.teamB.flag;
        }
      }
    }

    const updatedMatches = matches.map((m) => {
      // 1. Update this match details
      if (m.id === matchId) {
        return {
          ...m,
          scoreA: adminStatus === "Finished" || adminStatus === "Live" ? adminScoreA : null,
          scoreB: adminStatus === "Finished" || adminStatus === "Live" ? adminScoreB : null,
          status: adminStatus,
        };
      }

      // 2. Advance winner in the tree if current match has a successor target
      if (adminStatus === "Finished" && selectedSimulateMatch.nextMatchId && m.id === selectedSimulateMatch.nextMatchId) {
        const flagEmoji = winnerFlag || "🏳️";
        if (selectedSimulateMatch.nextMatchPosition === "teamA") {
          return {
            ...m,
            teamA: { id: winnerId, name: winnerName, flag: flagEmoji, isPlaceholder: false },
          };
        } else {
          return {
            ...m,
            teamB: { id: winnerId, name: winnerName, flag: flagEmoji, isPlaceholder: false },
          };
        }
      }

      return m;
    });

    setMatches(updatedMatches);
    setSelectedSimulateMatch(null);
    triggerToast(
      `Resultado de ${selectedSimulateMatch.teamA.name} vs ${selectedSimulateMatch.teamB.name} actualizado: ${adminScoreA}-${adminScoreB}. Puntos de la tabla recalculados.`,
      "success"
    );
  };

  // Check if a match is locked (date comparison)
  const isMatchLocked = (match: Match): boolean => {
    return new Date(simulatedTime) >= new Date(match.datetimeISO);
  };

  // Helper to format match headers
  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "FG": return "Fase de Grupos";
      case "16vos": return "Dieciseisavos (1/16)";
      case "8vos": return "Octavos de Final (1/8)";
      case "CF": return "Cuartos de Final (1/4)";
      case "SF": return "Semifinales";
      case "F": return "Finales";
      default: return stage;
    }
  };

  // Filter list matches based on selected stage
  const filteredMatchesForList = matches.filter(
    (m) => m.stage === stageFilter
  );

  return (
    <div className="min-h-screen bg-worldcup-dark text-slate-100 flex flex-col font-sans transition-all duration-300">

      {/* HEADER BANNER */}
      <header id="app-header" className="relative bg-gradient-to-r from-worldcup-header-from via-worldcup-header-via to-worldcup-header-to border-b border-worldcup-toast-border/85 shadow-2xl py-4 px-3 sm:py-6 sm:px-4 md:px-8">
        {/* Glow ball backdrop */}
        <div className="absolute top-1/2 left-10 sm:left-20 -translate-y-1/2 w-28 sm:w-44 h-28 sm:h-44 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 sm:right-20 -translate-y-1/2 w-28 sm:w-44 h-28 sm:h-44 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* World Cup Trophy styled logo */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center relative group overflow-hidden shrink-0">
              <img
                src="/resources/wct4sicon.ico"
                alt="FIFA World Cup 2026"
                className="w-full h-full object-contain select-none"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[9px] sm:text-[10px] bg-worldcup-accent/25 text-worldcup-accent border border-worldcup-accent/30 font-mono font-black uppercase px-1.5 sm:px-2 py-0.5 rounded tracking-widest">
                  EMPRESARIAL
                </span>
                <span className="text-[9px] sm:text-[10px] bg-slate-800 text-slate-300 font-mono font-medium px-1.5 sm:px-2 py-0.5 rounded">
                  EDICIÓN 2026
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-0.5 mt-1 leading-tight">
                Copa Mundial de la FIFA 2026
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-300 max-w-xl leading-snug hidden sm:block">
                Pronósticos de la copa mundial de fútbol, tabla general de clasificación y árbol interactivo conectados para fomentar la cultura corporativa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-900/60 text-slate-300 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title={theme === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span className="hidden xs:inline">{theme === "dark" ? "Claro" : "Oscuro"}</span>
            </button>

            {/* Reset simulator state */}
            <button
              onClick={handleResetSimulation}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-red-950/40 hover:bg-red-950/20 text-red-400 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Volver los marcadores reales a pendientes"
            >
              <Undo className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            {/* Quick stats totals */}
            <div className="bg-slate-950/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-900 text-right ml-auto md:ml-0">
              <span className="text-[9px] sm:text-[10px] text-slate-500 block uppercase tracking-wider font-bold">Participantes</span>
              <span className="text-base sm:text-lg font-black text-white font-mono">{employees.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* TOAST NOTIFICATION WINDOW */}
      {bannerMsg && (
        <div className="bg-worldcup-toast border-y border-worldcup-toast-border px-4 py-2.5 text-center transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-xs md:text-sm font-sans">
            {bannerMsg.type === "success" && <span className="text-emerald-400">✔️</span>}
            {bannerMsg.type === "info" && <span className="text-worldcup-accent">✨</span>}
            {bannerMsg.type === "error" && <span className="text-red-400">⚠️</span>}
            <span className="text-slate-200">
              {bannerMsg.text}
            </span>
            <button
              onClick={() => setBannerMsg(null)}
              className="text-slate-500 hover:text-white px-2 hover:bg-slate-900 rounded font-mono text-xs font-bold transition-all ml-2"
            >
              x
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6">

        {/* LEFT COMPONENT COLUMN (Tabs, Brackets, Group stages) */}
        <div className="flex-1 space-y-6">

          {/* TABS SELECTOR FOR BRACKET vs LIST/GROUPS */}
          <div className="flex flex-row p-1 bg-slate-950/90 rounded-2xl border border-slate-800 gap-1">
            <button
              onClick={() => setActiveTab("ARBOL")}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-[11px] sm:text-sm tracking-tight transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${activeTab === "ARBOL"
                ? "bg-worldcup-active-tab text-worldcup-accent border border-worldcup-active-tab-border shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Árbol de Partidos Interactivo</span>
              <span className="sm:hidden">Árbol</span>
            </button>

            <button
              onClick={() => setActiveTab("LISTA")}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-[11px] sm:text-sm tracking-tight transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${activeTab === "LISTA"
                ? "bg-worldcup-active-tab text-worldcup-accent border border-worldcup-active-tab-border shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Fase de Grupos & Fechas</span>
              <span className="sm:hidden">Grupos</span>
            </button>
          </div>

          {/* RENDERING OPTION A: BRACKET TREE */}
          {activeTab === "ARBOL" && (
            <div className="bg-worldcup-bracket-container/40 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-2 sm:p-4 md:p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-indigo-900/10 text-indigo-400 text-[10px] font-mono border-l border-b border-indigo-950 rounded-bl-xl uppercase font-bold">
                Knockout Tree
              </div>

              <div className="mb-5">
                <h2 className="text-xl font-black text-white flex items-center gap-1.5">
                  Fase Avanzada & Eliminatorias Directas
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed">
                  Conexiones del torneo para las fases eliminatorias. En cada tarjeta puedes predecir o cambiar el marcador real de los partidos y avanzar de etapa.
                </p>
              </div>

              {/* Bracket view component */}
              <BracketTree
                matches={matches}
                predictions={predictions}
                employees={employees}
                activeEmployeeId={activeEmployeeId}
                simulatedTime={simulatedTime}
                onUpdatePrediction={handleUpdatePrediction}
                onOpenSimulationModal={handleOpenSimulateModal}
              />
            </div>
          )}

          {/* RENDERING OPTION B: LIST VIEW & GROUP STANDINGS */}
          {activeTab === "LISTA" && (
            <div className="space-y-6">

              {/* Sub Stage Selector BAR */}
              <div id="substage-select-bar" className="flex flex-wrap gap-1 sm:gap-1.5 justify-start bg-slate-950/60 p-1.5 sm:p-2 border border-slate-800 rounded-xl sm:rounded-2xl">
                {(["FG", "8vos", "CF", "SF", "F"] as const).map((stage) => {
                  const isActive = stageFilter === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => setStageFilter(stage)}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all uppercase ${isActive
                        ? "bg-worldcup-accent text-slate-900 shadow"
                        : "bg-slate-900/50 text-slate-405 hover:bg-slate-900/90 text-slate-200"
                        }`}
                    >
                      {stage === "FG" ? "Fase de Grupos" : stage}
                    </button>
                  );
                })}
              </div>

              {/* Group Standings Section (Only visible for FG Tab) */}
              {stageFilter === "FG" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">
                        Tablas de Posición Simbólicas
                      </h3>
                      <p className="text-xs text-slate-400 font-sans">
                        La clasificación de grupos se altera en vivo al simular resultados reales de los partidos del Grupo A y B.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic tables list */}
                  <GroupTables teams={INITIAL_TEAMS} matches={matches} />
                </div>
              )}

              {/* Matches list for current selected sub-stage */}
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚽ Encuentros de:</span>
                    <span className="text-worldcup-accent text-xs bg-worldcup-accent/15 px-2.5 py-0.5 border border-worldcup-accent/30 rounded">
                      {getStageLabel(stageFilter)}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 font-sans bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-full font-mono">
                    {filteredMatchesForList.length} Encuentro(s)
                  </span>
                </div>

                {/* Fixture custom Cards rendering */}
                <div id="fixtures-list-container" className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {filteredMatchesForList.map((match) => {
                    const locked = isMatchLocked(match);
                    const finished = match.status === "Finished";

                    // Predict values
                    const pred = predictions.find(
                      (p) => p.matchId === match.id && p.employeeId === activeEmployeeId
                    );

                    // All coworkers predictions
                    const allPredsCount = predictions.filter((p) => p.matchId === match.id).length;

                    return (
                      <div
                        key={match.id}
                        id={`fixture-card-${match.id}`}
                        className={`bg-worldcup-card hover:bg-worldcup-card-hover border p-4 rounded-2xl transition-all flex flex-col justify-between ${finished
                          ? "border-emerald-700/60 shadow-lg shadow-emerald-950/20"
                          : locked
                            ? "border-amber-700/50 shadow"
                            : "border-slate-800 hover:border-slate-700"
                          }`}
                      >
                        <div>
                          {/* Card top details */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2 border-b border-white/5 mb-3">
                            <span className="flex items-center gap-1">
                              📅 {match.date} · {match.time}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {match.groupName && (
                                <span className="text-xs font-sans text-worldcup-accent bg-worldcup-accent/10 px-2 rounded">
                                  {match.groupName}
                                </span>
                              )}
                              {locked ? (
                                <span className="text-red-400 flex items-center gap-0.5 font-bold font-sans">
                                  <Lock className="w-3 h-3" /> Cerrado
                                </span>
                              ) : (
                                <span className="text-emerald-400 flex items-center gap-0.5 font-sans">
                                  <Unlock className="w-3 h-3" /> Abierto
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Matching layout */}
                          <div className="flex items-center justify-between mb-4">
                            {/* Team A display */}
                            <div className="flex flex-col items-center flex-1 max-w-[40%] text-center">
                              <span className="text-3xl mb-1.5 select-none">{match.teamA.flag || "🏳️"}</span>
                              <span className={`text-xs font-extrabold truncate w-full ${match.teamA.isPlaceholder ? "text-slate-500 italic" : "text-white"}`}>
                                {match.teamA.name}
                              </span>
                            </div>

                            {/* Versus score box */}
                            <div className="flex flex-col items-center justify-center px-4">
                              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-black">Marcador</span>
                              <div className="flex items-center gap-2 font-mono font-black text-xl py-1">
                                {finished || match.status === "Live" ? (
                                  <>
                                    <span className="text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-white/5">{match.scoreA}</span>
                                    <span className="text-slate-600">-</span>
                                    <span className="text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-white/5">{match.scoreB}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-500 text-xs px-2.5 py-0.5 rounded bg-slate-950/50">VS</span>
                                )}
                              </div>
                              {match.status === "Live" && (
                                <span className="text-[9px] bg-red-600 text-white px-1.5 rounded font-bold animate-pulse">EN VIVO</span>
                              )}
                            </div>

                            {/* Team B display */}
                            <div className="flex flex-col items-center flex-1 max-w-[40%] text-center">
                              <span className="text-3xl mb-1.5 select-none">{match.teamB.flag || "🏳️"}</span>
                              <span className={`text-xs font-extrabold truncate w-full ${match.teamB.isPlaceholder ? "text-slate-505 italic" : "text-white"}`}>
                                {match.teamB.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Prediction state / interactive form */}
                        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-900/60 text-xs text-slate-350">
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/5">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                              Tú Predicción
                            </span>
                            {pred && finished && (
                              <span className="font-mono text-xs font-bold text-worldcup-accent">
                                {pred.predictedScoreA === match.scoreA && pred.predictedScoreB === match.scoreB ? "💎 Exacto (+3 Pts)" : "🥈 Ganador (+1 Pt)"}
                              </span>
                            )}
                          </div>

                          {!locked ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-slate-400 text-[10px] leading-tight">Introduce tus marcadores esperados:</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="15"
                                  placeholder="0"
                                  value={pred?.predictedScoreA ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                    handleUpdatePrediction(match.id, val, pred?.predictedScoreB ?? 0);
                                  }}
                                  className="w-10 h-7 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-white font-mono focus:border-worldcup-accent focus:outline-none"
                                />
                                <span className="text-slate-600">-</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="15"
                                  placeholder="0"
                                  value={pred?.predictedScoreB ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                                    handleUpdatePrediction(match.id, pred?.predictedScoreA ?? 0, val);
                                  }}
                                  className="w-10 h-7 bg-slate-900 border border-slate-700/80 rounded text-center text-xs text-white font-mono focus:border-worldcup-accent focus:outline-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span>Tu pronóstico almacenado:</span>
                                {pred ? (
                                  <span className="font-mono font-black text-worldcup-accent bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                                    {pred.predictedScoreA} - {pred.predictedScoreB}
                                  </span>
                                ) : (
                                  <span className="text-red-400 italic text-[10px]">Sin predicción</span>
                                )}
                              </div>

                              {/* Coworkers list block */}
                              <div className="pt-2 border-t border-slate-900/60">
                                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">
                                  Predicciones de tus compañeros de oficina ({allPredsCount}):
                                </span>
                                <div className="space-y-1">
                                  {employees.map((emp) => {
                                    const empPred = predictions.find((p) => p.matchId === match.id && p.employeeId === emp.id);
                                    if (!empPred) return null;
                                    const isActiveUser = emp.id === activeEmployeeId;
                                    return (
                                      <div key={emp.id} className={`flex items-center justify-between text-[10px] px-2 py-1 rounded bg-slate-950/50 ${isActiveUser ? "border border-worldcup-accent/30 bg-slate-900/80" : ""}`}>
                                        <span className="flex items-center gap-1 text-slate-300">
                                          <span>{emp.avatar}</span>
                                          <span className="truncate">{emp.name}</span>
                                        </span>
                                        <span className="font-mono text-white text-right">
                                          {empPred.predictedScoreA} - {empPred.predictedScoreB}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Admin Trigger */}
                        <button
                          onClick={() => handleOpenSimulateModal(match)}
                          className="mt-3 py-1 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900/40 border border-slate-900 rounded-lg text-xs font-mono transition-all text-center block w-full"
                        >
                          ⚙️ Registrar Resultado Oficial
                        </button>
                      </div>
                    );
                  })}
                </div>

                {filteredMatchesForList.length === 0 && (
                  <div className="text-center py-12 bg-worldcup-card/30 border border-slate-800/80 rounded-2xl text-slate-400">
                    <p className="text-sm">No hay partidos configurados para esta etapa actualmente.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN (Control Center, Leaderboard standings) */}
        <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 space-y-4 sm:space-y-6">

          {/* Active Employee selector & system simulated time configs */}
          <ControlCenter
            employees={employees}
            activeEmployeeId={activeEmployeeId}
            simulatedTime={simulatedTime}
            onSelectEmployee={handleSelectEmployee}
            onAddEmployee={handleAddEmployee}
            onChangeSimulatedTime={handleChangeSimulatedTime}
          />

          {/* Dynamic leaderboard ranking table */}
          <Leaderboard
            employees={employees}
            matches={matches}
            predictions={predictions}
            activeEmployeeId={activeEmployeeId}
            onSelectEmployee={handleSelectEmployee}
          />

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-8 px-4 text-center border-t border-slate-900 text-xs text-slate-500 font-sans mt-12">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© 2026 Copa Mundial de la FIFA - Prode de Integración Laboral. Todos los derechos reservados.</p>
          <p>Optimizado para Chrome, Safari, Firefox y visualización móvil responsive en Google AI Studio.</p>
        </div>
      </footer>

      {/* MODAL overlay: Simulated results administration */}
      <AnimatePresence>
        {selectedSimulateMatch && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-worldcup-card border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-black text-white flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
                🏆 Panel de Resultados Oficiales
              </h3>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
                Como Administrador o Simulado, registra el resultado real de este partido. Esto bloqueará el partido, calculará en vivo los puntajes de los empleados y los actualizará en el árbol.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 mb-4 text-center space-y-3">
                <div className="text-[10px] font-mono text-worldcup-accent uppercase tracking-widest font-black">
                  {selectedSimulateMatch.stage === "FG" ? `${selectedSimulateMatch.groupName} - ` : ""}{getStageLabel(selectedSimulateMatch.stage)}
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm font-sans">
                  {/* Team A */}
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-3xl select-none mb-1">{selectedSimulateMatch.teamA.flag || "🏳️"}</span>
                    <span className="font-bold text-white truncate max-w-[120px]">{selectedSimulateMatch.teamA.name}</span>
                  </div>

                  {/* Input Score fields */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={adminScoreA}
                      onChange={(e) => setAdminScoreA(parseInt(e.target.value, 10) || 0)}
                      className="w-12 h-10 bg-slate-900 border-2 border-slate-700 focus:border-worldcup-accent rounded-xl text-center font-mono font-black text-lg text-white"
                    />
                    <span className="text-slate-500 font-bold font-mono">-</span>
                    <input
                      type="number"
                      min="0"
                      value={adminScoreB}
                      onChange={(e) => setAdminScoreB(parseInt(e.target.value, 10) || 0)}
                      className="w-12 h-10 bg-slate-900 border-2 border-slate-700 focus:border-worldcup-accent rounded-xl text-center font-mono font-black text-lg text-white"
                    />
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-3xl select-none mb-1">{selectedSimulateMatch.teamB.flag || "🏳️"}</span>
                    <span className="font-bold text-white truncate max-w-[120px]">{selectedSimulateMatch.teamB.name}</span>
                  </div>
                </div>

                {/* Tie winner selector for Knockout matches if score draw */}
                {selectedSimulateMatch.stage !== "FG" && adminScoreA === adminScoreB && (
                  <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-900/40 text-left mt-3">
                    <label className="block text-[10px] text-indigo-300 font-bold uppercase mb-1">
                      Definir Ganador por Penales (Requerido para el Árbol):
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setAdminTieWinner("teamA")}
                        className={`py-1 px-2 rounded text-xs truncate transition-all ${adminTieWinner === "teamA"
                          ? "bg-worldcup-accent text-slate-950 font-bold"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                          }`}
                      >
                        {selectedSimulateMatch.teamA.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminTieWinner("teamB")}
                        className={`py-1 px-2 rounded text-xs truncate transition-all ${adminTieWinner === "teamB"
                          ? "bg-worldcup-accent text-slate-950 font-bold"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                          }`}
                      >
                        {selectedSimulateMatch.teamB.name}
                      </button>
                    </div>
                  </div>
                )}

                {/* Match Status option */}
                <div className="pt-2 border-t border-slate-900 text-left">
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Estado del Partido:</label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded p-1.5 text-xs text-white"
                  >
                    <option value="Finished">Finalizado (Calcula puntos)</option>
                    <option value="Live">En Vivo</option>
                    <option value="Pending">Pendiente</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedSimulateMatch(null)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 transition-all text-center"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveRealScore}
                  className="flex-1 py-2 bg-worldcup-accent hover:bg-yellow-500 text-slate-900 font-bold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1"
                >
                  Confirmar Marcador
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Mascot — visible globally */}
      <FloatingMascot
      sizeClassName="w-32 md:w-48"
      />

    </div>
  );
}
