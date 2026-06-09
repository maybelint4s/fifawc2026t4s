import { Team, Match, Employee, Prediction } from "./types";

export const INITIAL_TEAMS: Team[] = [
  // Grupo A
  { id: "MEX", name: "México", flag: "🇲🇽", group: "Grupo A", pts: 0, gf: 0 },
  { id: "RSA", name: "Sudáfrica", flag: "🇿🇦", group: "Grupo A", pts: 0, gf: 0 },
  { id: "KOR", name: "Corea del Sur", flag: "🇰🇷", group: "Grupo A", pts: 0, gf: 0 },
  { id: "CZE", name: "Chequia", flag: "🇨🇿", group: "Grupo A", pts: 0, gf: 0 },
  
  // Grupo B
  { id: "CAN", name: "Canadá", flag: "🇨🇦", group: "Grupo B", pts: 0, gf: 0 },
  { id: "BIH", name: "Bosnia-Herzegovina", flag: "🇧🇦", group: "Grupo B", pts: 0, gf: 0 },
  { id: "QAT", name: "Catar", flag: "🇶🇦", group: "Grupo B", pts: 0, gf: 0 },
  { id: "SUI", name: "Suiza", flag: "🇨🇭", group: "Grupo B", pts: 0, gf: 0 },
  
  // Grupo C
  { id: "BRA", name: "Brasil", flag: "🇧🇷", group: "Grupo C", pts: 0, gf: 0 },
  { id: "MAR", name: "Marruecos", flag: "🇲🇦", group: "Grupo C", pts: 0, gf: 0 },
  { id: "HAI", name: "Haití", flag: "🇭🇹", group: "Grupo C", pts: 0, gf: 0 },
  { id: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "Grupo C", pts: 0, gf: 0 },

  // Grupo D
  { id: "USA", name: "EE. UU.", flag: "🇺🇸", group: "Grupo D", pts: 0, gf: 0 },
  { id: "PAR", name: "Paraguay", flag: "🇵🇾", group: "Grupo D", pts: 0, gf: 0 },
  { id: "ITA", name: "Italia", flag: "🇮🇹", group: "Grupo D", pts: 0, gf: 0 },
  { id: "JPN", name: "Japón", flag: "🇯🇵", group: "Grupo D", pts: 0, gf: 0 },
];

export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: "emp1", name: "Carlos Mendoza", role: "Frontend Lead", avatar: "👨‍💻" },
  { id: "emp2", name: "Sofía Martínez", role: "Product Manager", avatar: "👩‍💼" },
  { id: "emp3", name: "Andrés Silva", role: "DevOps Engineer", avatar: "🚀" },
  { id: "emp4", name: "Laura Gómez", role: "QA Lead", avatar: "🔍" },
];

export const INITIAL_MATCHES: Match[] = [
  // --- GRUPO A (FG - Fase de Grupos) ---
  {
    id: "FG_A1",
    stage: "FG",
    groupName: "Grupo A",
    teamA: { id: "MEX", name: "México", flag: "🇲🇽" },
    teamB: { id: "RSA", name: "Sudáfrica", flag: "🇿🇦" },
    scoreA: 2,
    scoreB: 1,
    status: "Finished",
    date: "Jue, jun 11",
    time: "4:00 p.m.",
    datetimeISO: "2026-06-11T16:00:00",
  },
  {
    id: "FG_A2",
    stage: "FG",
    groupName: "Grupo A",
    teamA: { id: "KOR", name: "Corea del Sur", flag: "🇰🇷" },
    teamB: { id: "CZE", name: "Chequia", flag: "🇨🇿" },
    scoreA: 1,
    scoreB: 1,
    status: "Finished",
    date: "Vie, jun 12",
    time: "1:00 p.m.",
    datetimeISO: "2026-06-12T13:00:00",
  },
  {
    id: "FG_A3",
    stage: "FG",
    groupName: "Grupo A",
    teamA: { id: "MEX", name: "México", flag: "🇲🇽" },
    teamB: { id: "CZE", name: "Chequia", flag: "🇨🇿" },
    scoreA: null,
    scoreB: null,
    status: "Pending", // Locked under future dates
    date: "Mié, jun 17",
    time: "5:00 p.m.",
    datetimeISO: "2026-06-17T17:00:00",
  },
  {
    id: "FG_A4",
    stage: "FG",
    groupName: "Grupo A",
    teamA: { id: "RSA", name: "Sudáfrica", flag: "🇿🇦" },
    teamB: { id: "KOR", name: "Corea del Sur", flag: "🇰🇷" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Mié, jun 17",
    time: "8:00 p.m.",
    datetimeISO: "2026-06-17T20:00:00",
  },

  // --- GRUPO B (FG - Fase de Grupos) ---
  {
    id: "FG_B1",
    stage: "FG",
    groupName: "Grupo B",
    teamA: { id: "CAN", name: "Canadá", flag: "🇨🇦" },
    teamB: { id: "BIH", name: "Bosnia-Herzegovina", flag: "🇧🇦" },
    scoreA: 3,
    scoreB: 0,
    status: "Finished",
    date: "Vie, jun 12",
    time: "4:30 p.m.",
    datetimeISO: "2026-06-12T16:30:00",
  },
  {
    id: "FG_B2",
    stage: "FG",
    groupName: "Grupo B",
    teamA: { id: "QAT", name: "Catar", flag: "🇶🇦" },
    teamB: { id: "SUI", name: "Suiza", flag: "🇨🇭" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Sáb, jun 13",
    time: "3:00 p.m.",
    datetimeISO: "2026-06-13T15:00:00",
  },

  // --- 16VOS DE FINAL (16vos) ---
  {
    id: "R32_1",
    stage: "16vos",
    teamA: { id: "MEX", name: "México", flag: "🇲🇽" },
    teamB: { id: "SUI", name: "Suiza", flag: "🇨🇭" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Dom, jun 28",
    time: "3:00 p.m.",
    datetimeISO: "2026-06-28T15:00:00",
    nextMatchId: "R16_1",
    nextMatchPosition: "teamA",
  },
  {
    id: "R32_2",
    stage: "16vos",
    teamA: { id: "BRA", name: "Brasil", flag: "🇧🇷" },
    teamB: { id: "CZE", name: "Chequia", flag: "🇨🇿" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Lun, jun 29",
    time: "4:30 p.m.",
    datetimeISO: "2026-06-29T16:30:00",
    nextMatchId: "R16_1",
    nextMatchPosition: "teamB",
  },
  {
    id: "R32_3",
    stage: "16vos",
    teamA: { id: "CAN", name: "Canadá", flag: "🇨🇦" },
    teamB: { id: "PAR", name: "Paraguay", flag: "🇵🇾" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Lun, jun 29",
    time: "9:00 p.m.",
    datetimeISO: "2026-06-29T21:00:00",
    nextMatchId: "R16_2",
    nextMatchPosition: "teamA",
  },
  {
    id: "R32_4",
    stage: "16vos",
    teamA: { id: "USA", name: "EE. UU.", flag: "🇺🇸" },
    teamB: { id: "KOR", name: "Corea del Sur", flag: "🇰🇷" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Mar, jun 30",
    time: "5:00 p.m.",
    datetimeISO: "2026-06-30T17:00:00",
    nextMatchId: "R16_2",
    nextMatchPosition: "teamB",
  },
  {
    id: "R32_5",
    stage: "16vos",
    teamA: { id: "ITA", name: "Italia", flag: "🇮🇹" },
    teamB: { id: "MAR", name: "Marruecos", flag: "🇲🇦" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Jue, jul 2",
    time: "3:00 p.m.",
    datetimeISO: "2026-07-02T15:00:00",
    nextMatchId: "R16_3",
    nextMatchPosition: "teamA",
  },
  {
    id: "R32_6",
    stage: "16vos",
    teamA: { id: "JPN", name: "Japón", flag: "🇯🇵" },
    teamB: { id: "RSA", name: "Sudáfrica", flag: "🇿🇦" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Jue, jul 2",
    time: "7:00 p.m.",
    datetimeISO: "2026-07-02T19:00:00",
    nextMatchId: "R16_3",
    nextMatchPosition: "teamB",
  },

  // --- OCTAVOS DE FINAL (8vos) ---
  {
    id: "R16_1",
    stage: "8vos",
    teamA: { id: "TBD_R32_1", name: "Determinar R32 #1", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_R32_2", name: "Determinar R32 #2", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Sáb, jul 4",
    time: "1:00 p.m.",
    datetimeISO: "2026-07-04T13:00:00",
    nextMatchId: "CF_1",
    nextMatchPosition: "teamA",
  },
  {
    id: "R16_2",
    stage: "8vos",
    teamA: { id: "TBD_R32_3", name: "Determinar R32 #3", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_R32_4", name: "Determinar R32 #4", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Sáb, jul 4",
    time: "5:00 p.m.",
    datetimeISO: "2026-07-04T17:00:00",
    nextMatchId: "CF_1",
    nextMatchPosition: "teamB",
  },
  {
    id: "R16_3",
    stage: "8vos",
    teamA: { id: "TBD_R32_5", name: "Determinar R32 #5", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_R32_6", name: "Determinar R32 #6", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Dom, jul 5",
    time: "4:00 p.m.",
    datetimeISO: "2026-07-05T16:00:00",
    nextMatchId: "CF_2",
    nextMatchPosition: "teamA",
  },
  {
    id: "R16_4",
    stage: "8vos",
    teamA: { id: "FRA", name: "Francia", flag: "🇫🇷" },
    teamB: { id: "SCO", name: "Escocia", flag: "🏴" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Dom, jul 5",
    time: "8:00 p.m.",
    datetimeISO: "2026-07-05T20:00:00",
    nextMatchId: "CF_2",
    nextMatchPosition: "teamB",
  },
  {
    id: "R16_5",
    stage: "8vos",
    teamA: { id: "ESP", name: "España", flag: "🇪🇸" },
    teamB: { id: "ARG", name: "Argentina", flag: "🇦🇷" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Lun, jul 6",
    time: "3:00 p.m.",
    datetimeISO: "2026-07-06T15:00:00",
    nextMatchId: "CF_3",
    nextMatchPosition: "teamA",
  },
  {
    id: "R16_6",
    stage: "8vos",
    teamA: { id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    teamB: { id: "GER", name: "Alemania", flag: "🇩🇪" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Lun, jul 6",
    time: "8:00 p.m.",
    datetimeISO: "2026-07-06T20:00:00",
    nextMatchId: "CF_3",
    nextMatchPosition: "teamB",
  },

  // --- CUARTOS DE FINAL (CF) ---
  {
    id: "CF_1",
    stage: "CF",
    teamA: { id: "TBD_R16_1", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_R16_2", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Jue, jul 9",
    time: "4:00 p.m.",
    datetimeISO: "2026-07-09T16:00:00",
    nextMatchId: "SF_1",
    nextMatchPosition: "teamA",
  },
  {
    id: "CF_2",
    stage: "CF",
    teamA: { id: "TBD_R16_3", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_R16_4", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Vie, jul 10",
    time: "3:00 p.m.",
    datetimeISO: "2026-07-10T15:00:00",
    nextMatchId: "SF_1",
    nextMatchPosition: "teamB",
  },
  {
    id: "CF_3",
    stage: "CF",
    teamA: { id: "TBD_R16_5", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_R16_6", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Sáb, jul 11",
    time: "5:00 p.m.",
    datetimeISO: "2026-07-11T17:00:00",
    nextMatchId: "SF_2",
    nextMatchPosition: "teamA",
  },
  {
    id: "CF_4",
    stage: "CF",
    teamA: { id: "URU", name: "Uruguay", flag: "🇺🇾" },
    teamB: { id: "POR", name: "Portugal", flag: "🇵🇹" },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Sáb, jul 11",
    time: "8:00 p.m.",
    datetimeISO: "2026-07-11T20:00:00",
    nextMatchId: "SF_2",
    nextMatchPosition: "teamB",
  },

  // --- SEMIFINAL (SF) ---
  {
    id: "SF_1",
    stage: "SF",
    teamA: { id: "TBD_CF_1", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_CF_2", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Mar, jul 14",
    time: "3:00 p.m.",
    datetimeISO: "2026-07-14T15:00:00",
    nextMatchId: "F_1",
    nextMatchPosition: "teamA",
  },
  {
    id: "SF_2",
    stage: "SF",
    teamA: { id: "TBD_CF_3", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_CF_4", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Mié, jul 15",
    time: "3:00 p.m.",
    datetimeISO: "2026-07-15T15:00:00",
    nextMatchId: "F_1",
    nextMatchPosition: "teamB",
  },

  // --- FINAL (F) ---
  {
    id: "F_1",
    stage: "F",
    teamA: { id: "TBD_SF_1", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_SF_2", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Dom, jul 19",
    time: "3:00 p.m.",
    datetimeISO: "2026-07-19T15:00:00",
  },
  {
    id: "F_3rd",
    stage: "F",
    teamA: { id: "TBD_SF_3_L", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    teamB: { id: "TBD_SF_4_L", name: "Por determinar", flag: "🏳️", isPlaceholder: true },
    scoreA: null,
    scoreB: null,
    status: "Pending",
    date: "Sáb, jul 18",
    time: "5:00 p.m.",
    datetimeISO: "2026-07-18T17:00:00",
  }
];

// Preloaded background predictions for other colleagues to make the app alive!
export const PRELOADED_PREDICTIONS: Prediction[] = [
  // --- Carlos Mendoza (emp1) ---
  { matchId: "FG_A1", employeeId: "emp1", predictedScoreA: 2, predictedScoreB: 1 }, // Exact match! -> +3pt
  { matchId: "FG_A2", employeeId: "emp1", predictedScoreA: 2, predictedScoreB: 0 }, // Wrong (ended 1-1) -> 0pt
  { matchId: "FG_B1", employeeId: "emp1", predictedScoreA: 2, predictedScoreB: 1 }, // Correct winner (predicted CAN wins, CAN won 3-0) -> +1pt
  { matchId: "FG_A3", employeeId: "emp1", predictedScoreA: 1, predictedScoreB: 2 }, // Pending

  // --- Sofía Martínez (emp2) ---
  { matchId: "FG_A1", employeeId: "emp2", predictedScoreA: 1, predictedScoreB: 1 }, // Wrong -> 0pt
  { matchId: "FG_A2", employeeId: "emp2", predictedScoreA: 1, predictedScoreB: 1 }, // Exact match! (ended 1-1) -> +3pt
  { matchId: "FG_B1", employeeId: "emp2", predictedScoreA: 3, predictedScoreB: 0 }, // Exact match! (ended 3-0) -> +3pt
  { matchId: "FG_A3", employeeId: "emp2", predictedScoreA: 2, predictedScoreB: 0 }, // Pending
  { matchId: "FG_A4", employeeId: "emp2", predictedScoreA: 1, predictedScoreB: 2 }, // Pending

  // --- Andrés Silva (emp3) ---
  { matchId: "FG_A1", employeeId: "emp3", predictedScoreA: 3, predictedScoreB: 1 }, // Correct winner (predicted MEX, ended 2-1) -> +1pt
  { matchId: "FG_A2", employeeId: "emp3", predictedScoreA: 2, predictedScoreB: 2 }, // Correct outcome (predicted Draw, ended 1-1) -> +1pt
  { matchId: "FG_B1", employeeId: "emp3", predictedScoreA: 1, predictedScoreB: 1 }, // Wrong (CAN won 3-0) -> 0pt
  { matchId: "FG_A3", employeeId: "emp3", predictedScoreA: 3, predictedScoreB: 1 }, // Pending

  // --- Laura Gómez (emp4) ---
  { matchId: "FG_A1", employeeId: "emp4", predictedScoreA: 2, predictedScoreB: 1 }, // Exact match! -> +3pt
  { matchId: "FG_A2", employeeId: "emp4", predictedScoreA: 0, predictedScoreB: 2 }, // Wrong -> 0pt
  { matchId: "FG_B1", employeeId: "emp4", predictedScoreA: 2, predictedScoreB: 0 }, // Correct winner (predicted CAN, ended 3-0) -> +1pt
  { matchId: "FG_A3", employeeId: "emp4", predictedScoreA: 1, predictedScoreB: 1 }, // Pending
];
