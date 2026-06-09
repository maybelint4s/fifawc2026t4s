import { Team, Match, Employee, Prediction } from "./types";

export const INITIAL_TEAMS: Team[] = [
  // Grupo A
  { id: "MEX", name: "México", flag: "🇲🇽", group: "Grupo A", pts: 0, gf: 0 },
  { id: "RSA", name: "Sudáfrica", flag: "🇿🇦", group: "Grupo A", pts: 0, gf: 0 },
  { id: "KOR", name: "Corea del Sur", flag: "🇰🇷", group: "Grupo A", pts: 0, gf: 0 },
  { id: "CZE", name: "Chequia", flag: "🇨🇿", group: "Grupo A", pts: 0, gf: 0 },

  // Grupo B
  { id: "CAN", name: "Canadá", flag: "🇨🇦", group: "Grupo B", pts: 0, gf: 0 },
  { id: "BIH", name: "Bosnia-Herz.", flag: "🇧🇦", group: "Grupo B", pts: 0, gf: 0 },
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

  // Grupo E
  { id: "ARG", name: "Argentina", flag: "🇦🇷", group: "Grupo E", pts: 0, gf: 0 },
  { id: "FRA", name: "Francia", flag: "🇫🇷", group: "Grupo E", pts: 0, gf: 0 },
  { id: "AUS", name: "Australia", flag: "🇦🇺", group: "Grupo E", pts: 0, gf: 0 },
  { id: "CRC", name: "Costa Rica", flag: "🇨🇷", group: "Grupo E", pts: 0, gf: 0 },

  // Grupo F
  { id: "GER", name: "Alemania", flag: "🇩🇪", group: "Grupo F", pts: 0, gf: 0 },
  { id: "ESP", name: "España", flag: "🇪🇸", group: "Grupo F", pts: 0, gf: 0 },
  { id: "CMR", name: "Camerún", flag: "🇨🇲", group: "Grupo F", pts: 0, gf: 0 },
  { id: "URU", name: "Uruguay", flag: "🇺🇾", group: "Grupo F", pts: 0, gf: 0 },

  // Grupo G
  { id: "POR", name: "Portugal", flag: "🇵🇹", group: "Grupo G", pts: 0, gf: 0 },
  { id: "NED", name: "Países Bajos", flag: "🇳🇱", group: "Grupo G", pts: 0, gf: 0 },
  { id: "SEN", name: "Senegal", flag: "🇸🇳", group: "Grupo G", pts: 0, gf: 0 },
  { id: "IRN", name: "Irán", flag: "🇮🇷", group: "Grupo G", pts: 0, gf: 0 },

  // Grupo H
  { id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "Grupo H", pts: 0, gf: 0 },
  { id: "BEL", name: "Bélgica", flag: "🇧🇪", group: "Grupo H", pts: 0, gf: 0 },
  { id: "CRO", name: "Croacia", flag: "🇭🇷", group: "Grupo H", pts: 0, gf: 0 },
  { id: "ECU", name: "Ecuador", flag: "🇪🇨", group: "Grupo H", pts: 0, gf: 0 },
];

export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: "emp1", name: "Carlos Mendoza", role: "Frontend Lead", avatar: "👨‍💻" },
  { id: "emp2", name: "Sofía Martínez", role: "Product Manager", avatar: "👩‍💼" },
  { id: "emp3", name: "Andrés Silva", role: "DevOps Engineer", avatar: "🚀" },
  { id: "emp4", name: "Laura Gómez", role: "QA Lead", avatar: "🔍" },
];

export const INITIAL_MATCHES: Match[] = [
  // ========================
  // FASE DE GRUPOS
  // ========================

  // --- GRUPO A ---
  { id: "FG_A1", stage: "FG", groupName: "Grupo A", teamA: { id: "MEX", name: "México", flag: "🇲🇽" }, teamB: { id: "RSA", name: "Sudáfrica", flag: "🇿🇦" }, scoreA: 2, scoreB: 1, status: "Finished", date: "Jue, jun 11", time: "4:00 p.m.", datetimeISO: "2026-06-11T16:00:00" },
  { id: "FG_A2", stage: "FG", groupName: "Grupo A", teamA: { id: "KOR", name: "Corea del Sur", flag: "🇰🇷" }, teamB: { id: "CZE", name: "Chequia", flag: "🇨🇿" }, scoreA: 1, scoreB: 1, status: "Finished", date: "Vie, jun 12", time: "1:00 p.m.", datetimeISO: "2026-06-12T13:00:00" },
  { id: "FG_A3", stage: "FG", groupName: "Grupo A", teamA: { id: "MEX", name: "México", flag: "🇲🇽" }, teamB: { id: "KOR", name: "Corea del Sur", flag: "🇰🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 17", time: "5:00 p.m.", datetimeISO: "2026-06-17T17:00:00" },
  { id: "FG_A4", stage: "FG", groupName: "Grupo A", teamA: { id: "RSA", name: "Sudáfrica", flag: "🇿🇦" }, teamB: { id: "CZE", name: "Chequia", flag: "🇨🇿" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 17", time: "8:00 p.m.", datetimeISO: "2026-06-17T20:00:00" },
  { id: "FG_A5", stage: "FG", groupName: "Grupo A", teamA: { id: "MEX", name: "México", flag: "🇲🇽" }, teamB: { id: "CZE", name: "Chequia", flag: "🇨🇿" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "3:00 p.m.", datetimeISO: "2026-06-22T15:00:00" },
  { id: "FG_A6", stage: "FG", groupName: "Grupo A", teamA: { id: "RSA", name: "Sudáfrica", flag: "🇿🇦" }, teamB: { id: "KOR", name: "Corea del Sur", flag: "🇰🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "6:00 p.m.", datetimeISO: "2026-06-22T18:00:00" },

  // --- GRUPO B ---
  { id: "FG_B1", stage: "FG", groupName: "Grupo B", teamA: { id: "CAN", name: "Canadá", flag: "🇨🇦" }, teamB: { id: "BIH", name: "Bosnia-Herz.", flag: "🇧🇦" }, scoreA: 3, scoreB: 0, status: "Finished", date: "Vie, jun 12", time: "4:30 p.m.", datetimeISO: "2026-06-12T16:30:00" },
  { id: "FG_B2", stage: "FG", groupName: "Grupo B", teamA: { id: "QAT", name: "Catar", flag: "🇶🇦" }, teamB: { id: "SUI", name: "Suiza", flag: "🇨🇭" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 13", time: "3:00 p.m.", datetimeISO: "2026-06-13T15:00:00" },
  { id: "FG_B3", stage: "FG", groupName: "Grupo B", teamA: { id: "CAN", name: "Canadá", flag: "🇨🇦" }, teamB: { id: "QAT", name: "Catar", flag: "🇶🇦" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "5:00 p.m.", datetimeISO: "2026-06-18T17:00:00" },
  { id: "FG_B4", stage: "FG", groupName: "Grupo B", teamA: { id: "BIH", name: "Bosnia-Herz.", flag: "🇧🇦" }, teamB: { id: "SUI", name: "Suiza", flag: "🇨🇭" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "8:00 p.m.", datetimeISO: "2026-06-18T20:00:00" },
  { id: "FG_B5", stage: "FG", groupName: "Grupo B", teamA: { id: "CAN", name: "Canadá", flag: "🇨🇦" }, teamB: { id: "SUI", name: "Suiza", flag: "🇨🇭" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "3:00 p.m.", datetimeISO: "2026-06-23T15:00:00" },
  { id: "FG_B6", stage: "FG", groupName: "Grupo B", teamA: { id: "BIH", name: "Bosnia-Herz.", flag: "🇧🇦" }, teamB: { id: "QAT", name: "Catar", flag: "🇶🇦" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "6:00 p.m.", datetimeISO: "2026-06-23T18:00:00" },

  // --- GRUPO C ---
  { id: "FG_C1", stage: "FG", groupName: "Grupo C", teamA: { id: "BRA", name: "Brasil", flag: "🇧🇷" }, teamB: { id: "MAR", name: "Marruecos", flag: "🇲🇦" }, scoreA: 2, scoreB: 0, status: "Finished", date: "Sáb, jun 13", time: "6:00 p.m.", datetimeISO: "2026-06-13T18:00:00" },
  { id: "FG_C2", stage: "FG", groupName: "Grupo C", teamA: { id: "HAI", name: "Haití", flag: "🇭🇹" }, teamB: { id: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 14", time: "1:00 p.m.", datetimeISO: "2026-06-14T13:00:00" },
  { id: "FG_C3", stage: "FG", groupName: "Grupo C", teamA: { id: "BRA", name: "Brasil", flag: "🇧🇷" }, teamB: { id: "HAI", name: "Haití", flag: "🇭🇹" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 19", time: "5:00 p.m.", datetimeISO: "2026-06-19T17:00:00" },
  { id: "FG_C4", stage: "FG", groupName: "Grupo C", teamA: { id: "MAR", name: "Marruecos", flag: "🇲🇦" }, teamB: { id: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 19", time: "8:00 p.m.", datetimeISO: "2026-06-19T20:00:00" },
  { id: "FG_C5", stage: "FG", groupName: "Grupo C", teamA: { id: "BRA", name: "Brasil", flag: "🇧🇷" }, teamB: { id: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "3:00 p.m.", datetimeISO: "2026-06-24T15:00:00" },
  { id: "FG_C6", stage: "FG", groupName: "Grupo C", teamA: { id: "MAR", name: "Marruecos", flag: "🇲🇦" }, teamB: { id: "HAI", name: "Haití", flag: "🇭🇹" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "6:00 p.m.", datetimeISO: "2026-06-24T18:00:00" },

  // --- GRUPO D ---
  { id: "FG_D1", stage: "FG", groupName: "Grupo D", teamA: { id: "USA", name: "EE. UU.", flag: "🇺🇸" }, teamB: { id: "PAR", name: "Paraguay", flag: "🇵🇾" }, scoreA: 1, scoreB: 1, status: "Finished", date: "Dom, jun 14", time: "4:30 p.m.", datetimeISO: "2026-06-14T16:30:00" },
  { id: "FG_D2", stage: "FG", groupName: "Grupo D", teamA: { id: "ITA", name: "Italia", flag: "🇮🇹" }, teamB: { id: "JPN", name: "Japón", flag: "🇯🇵" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 15", time: "1:00 p.m.", datetimeISO: "2026-06-15T13:00:00" },
  { id: "FG_D3", stage: "FG", groupName: "Grupo D", teamA: { id: "USA", name: "EE. UU.", flag: "🇺🇸" }, teamB: { id: "ITA", name: "Italia", flag: "🇮🇹" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 20", time: "5:00 p.m.", datetimeISO: "2026-06-20T17:00:00" },
  { id: "FG_D4", stage: "FG", groupName: "Grupo D", teamA: { id: "PAR", name: "Paraguay", flag: "🇵🇾" }, teamB: { id: "JPN", name: "Japón", flag: "🇯🇵" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 20", time: "8:00 p.m.", datetimeISO: "2026-06-20T20:00:00" },
  { id: "FG_D5", stage: "FG", groupName: "Grupo D", teamA: { id: "USA", name: "EE. UU.", flag: "🇺🇸" }, teamB: { id: "JPN", name: "Japón", flag: "🇯🇵" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "3:00 p.m.", datetimeISO: "2026-06-25T15:00:00" },
  { id: "FG_D6", stage: "FG", groupName: "Grupo D", teamA: { id: "PAR", name: "Paraguay", flag: "🇵🇾" }, teamB: { id: "ITA", name: "Italia", flag: "🇮🇹" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "6:00 p.m.", datetimeISO: "2026-06-25T18:00:00" },

  // --- GRUPO E ---
  { id: "FG_E1", stage: "FG", groupName: "Grupo E", teamA: { id: "ARG", name: "Argentina", flag: "🇦🇷" }, teamB: { id: "FRA", name: "Francia", flag: "🇫🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 15", time: "6:00 p.m.", datetimeISO: "2026-06-15T18:00:00" },
  { id: "FG_E2", stage: "FG", groupName: "Grupo E", teamA: { id: "AUS", name: "Australia", flag: "🇦🇺" }, teamB: { id: "CRC", name: "Costa Rica", flag: "🇨🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 16", time: "1:00 p.m.", datetimeISO: "2026-06-16T13:00:00" },
  { id: "FG_E3", stage: "FG", groupName: "Grupo E", teamA: { id: "ARG", name: "Argentina", flag: "🇦🇷" }, teamB: { id: "AUS", name: "Australia", flag: "🇦🇺" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "5:00 p.m.", datetimeISO: "2026-06-21T17:00:00" },
  { id: "FG_E4", stage: "FG", groupName: "Grupo E", teamA: { id: "FRA", name: "Francia", flag: "🇫🇷" }, teamB: { id: "CRC", name: "Costa Rica", flag: "🇨🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "8:00 p.m.", datetimeISO: "2026-06-21T20:00:00" },
  { id: "FG_E5", stage: "FG", groupName: "Grupo E", teamA: { id: "ARG", name: "Argentina", flag: "🇦🇷" }, teamB: { id: "CRC", name: "Costa Rica", flag: "🇨🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "3:00 p.m.", datetimeISO: "2026-06-26T15:00:00" },
  { id: "FG_E6", stage: "FG", groupName: "Grupo E", teamA: { id: "FRA", name: "Francia", flag: "🇫🇷" }, teamB: { id: "AUS", name: "Australia", flag: "🇦🇺" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "6:00 p.m.", datetimeISO: "2026-06-26T18:00:00" },

  // --- GRUPO F ---
  { id: "FG_F1", stage: "FG", groupName: "Grupo F", teamA: { id: "GER", name: "Alemania", flag: "🇩🇪" }, teamB: { id: "ESP", name: "España", flag: "🇪🇸" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 16", time: "6:00 p.m.", datetimeISO: "2026-06-16T18:00:00" },
  { id: "FG_F2", stage: "FG", groupName: "Grupo F", teamA: { id: "CMR", name: "Camerún", flag: "🇨🇲" }, teamB: { id: "URU", name: "Uruguay", flag: "🇺🇾" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 17", time: "1:00 p.m.", datetimeISO: "2026-06-17T13:00:00" },
  { id: "FG_F3", stage: "FG", groupName: "Grupo F", teamA: { id: "GER", name: "Alemania", flag: "🇩🇪" }, teamB: { id: "CMR", name: "Camerún", flag: "🇨🇲" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "8:00 p.m.", datetimeISO: "2026-06-22T20:00:00" },
  { id: "FG_F4", stage: "FG", groupName: "Grupo F", teamA: { id: "ESP", name: "España", flag: "🇪🇸" }, teamB: { id: "URU", name: "Uruguay", flag: "🇺🇾" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "1:00 p.m.", datetimeISO: "2026-06-23T13:00:00" },
  { id: "FG_F5", stage: "FG", groupName: "Grupo F", teamA: { id: "GER", name: "Alemania", flag: "🇩🇪" }, teamB: { id: "URU", name: "Uruguay", flag: "🇺🇾" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 27", time: "3:00 p.m.", datetimeISO: "2026-06-27T15:00:00" },
  { id: "FG_F6", stage: "FG", groupName: "Grupo F", teamA: { id: "ESP", name: "España", flag: "🇪🇸" }, teamB: { id: "CMR", name: "Camerún", flag: "🇨🇲" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 27", time: "6:00 p.m.", datetimeISO: "2026-06-27T18:00:00" },

  // --- GRUPO G ---
  { id: "FG_G1", stage: "FG", groupName: "Grupo G", teamA: { id: "POR", name: "Portugal", flag: "🇵🇹" }, teamB: { id: "NED", name: "Países Bajos", flag: "🇳🇱" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 18", time: "1:00 p.m.", datetimeISO: "2026-06-18T13:00:00" },
  { id: "FG_G2", stage: "FG", groupName: "Grupo G", teamA: { id: "SEN", name: "Senegal", flag: "🇸🇳" }, teamB: { id: "IRN", name: "Irán", flag: "🇮🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 18", time: "4:30 p.m.", datetimeISO: "2026-06-18T16:30:00" },
  { id: "FG_G3", stage: "FG", groupName: "Grupo G", teamA: { id: "POR", name: "Portugal", flag: "🇵🇹" }, teamB: { id: "SEN", name: "Senegal", flag: "🇸🇳" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "8:00 p.m.", datetimeISO: "2026-06-23T20:00:00" },
  { id: "FG_G4", stage: "FG", groupName: "Grupo G", teamA: { id: "NED", name: "Países Bajos", flag: "🇳🇱" }, teamB: { id: "IRN", name: "Irán", flag: "🇮🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "1:00 p.m.", datetimeISO: "2026-06-24T13:00:00" },
  { id: "FG_G5", stage: "FG", groupName: "Grupo G", teamA: { id: "POR", name: "Portugal", flag: "🇵🇹" }, teamB: { id: "IRN", name: "Irán", flag: "🇮🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 28", time: "3:00 p.m.", datetimeISO: "2026-06-28T15:00:00" },
  { id: "FG_G6", stage: "FG", groupName: "Grupo G", teamA: { id: "NED", name: "Países Bajos", flag: "🇳🇱" }, teamB: { id: "SEN", name: "Senegal", flag: "🇸🇳" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 28", time: "6:00 p.m.", datetimeISO: "2026-06-28T18:00:00" },

  // --- GRUPO H ---
  { id: "FG_H1", stage: "FG", groupName: "Grupo H", teamA: { id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, teamB: { id: "BEL", name: "Bélgica", flag: "🇧🇪" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 19", time: "1:00 p.m.", datetimeISO: "2026-06-19T13:00:00" },
  { id: "FG_H2", stage: "FG", groupName: "Grupo H", teamA: { id: "CRO", name: "Croacia", flag: "🇭🇷" }, teamB: { id: "ECU", name: "Ecuador", flag: "🇪🇨" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 19", time: "4:30 p.m.", datetimeISO: "2026-06-19T16:30:00" },
  { id: "FG_H3", stage: "FG", groupName: "Grupo H", teamA: { id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, teamB: { id: "CRO", name: "Croacia", flag: "🇭🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "8:00 p.m.", datetimeISO: "2026-06-24T20:00:00" },
  { id: "FG_H4", stage: "FG", groupName: "Grupo H", teamA: { id: "BEL", name: "Bélgica", flag: "🇧🇪" }, teamB: { id: "ECU", name: "Ecuador", flag: "🇪🇨" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 25", time: "1:00 p.m.", datetimeISO: "2026-06-25T13:00:00" },
  { id: "FG_H5", stage: "FG", groupName: "Grupo H", teamA: { id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, teamB: { id: "ECU", name: "Ecuador", flag: "🇪🇨" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 29", time: "3:00 p.m.", datetimeISO: "2026-06-29T15:00:00" },
  { id: "FG_H6", stage: "FG", groupName: "Grupo H", teamA: { id: "BEL", name: "Bélgica", flag: "🇧🇪" }, teamB: { id: "CRO", name: "Croacia", flag: "🇭🇷" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 29", time: "6:00 p.m.", datetimeISO: "2026-06-29T18:00:00" },

  // ========================
  // OCTAVOS DE FINAL (8 partidos = 16 equipos)
  // ========================
  { id: "R16_1", stage: "8vos", teamA: { id: "1A", name: "1° Grupo A", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2B", name: "2° Grupo B", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 28", time: "3:00 p.m.", datetimeISO: "2026-06-28T15:00:00", nextMatchId: "CF_1", nextMatchPosition: "teamA" },
  { id: "R16_2", stage: "8vos", teamA: { id: "1C", name: "1° Grupo C", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2D", name: "2° Grupo D", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 28", time: "6:00 p.m.", datetimeISO: "2026-06-28T18:00:00", nextMatchId: "CF_1", nextMatchPosition: "teamB" },
  { id: "R16_3", stage: "8vos", teamA: { id: "1E", name: "1° Grupo E", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2F", name: "2° Grupo F", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 29", time: "3:00 p.m.", datetimeISO: "2026-06-29T15:00:00", nextMatchId: "CF_2", nextMatchPosition: "teamA" },
  { id: "R16_4", stage: "8vos", teamA: { id: "1G", name: "1° Grupo G", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2H", name: "2° Grupo H", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 29", time: "6:00 p.m.", datetimeISO: "2026-06-29T18:00:00", nextMatchId: "CF_2", nextMatchPosition: "teamB" },
  { id: "R16_5", stage: "8vos", teamA: { id: "1B", name: "1° Grupo B", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2A", name: "2° Grupo A", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 30", time: "3:00 p.m.", datetimeISO: "2026-06-30T15:00:00", nextMatchId: "CF_3", nextMatchPosition: "teamA" },
  { id: "R16_6", stage: "8vos", teamA: { id: "1D", name: "1° Grupo D", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2C", name: "2° Grupo C", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 30", time: "6:00 p.m.", datetimeISO: "2026-06-30T18:00:00", nextMatchId: "CF_3", nextMatchPosition: "teamB" },
  { id: "R16_7", stage: "8vos", teamA: { id: "1F", name: "1° Grupo F", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2E", name: "2° Grupo E", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jul 1", time: "3:00 p.m.", datetimeISO: "2026-07-01T15:00:00", nextMatchId: "CF_4", nextMatchPosition: "teamA" },
  { id: "R16_8", stage: "8vos", teamA: { id: "1H", name: "1° Grupo H", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2G", name: "2° Grupo G", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jul 1", time: "6:00 p.m.", datetimeISO: "2026-07-01T18:00:00", nextMatchId: "CF_4", nextMatchPosition: "teamB" },

  // ========================
  // CUARTOS DE FINAL (4 partidos = 8 equipos)
  // ========================
  { id: "CF_1", stage: "CF", teamA: { id: "W49", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W50", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jul 3", time: "3:00 p.m.", datetimeISO: "2026-07-03T15:00:00", nextMatchId: "SF_1", nextMatchPosition: "teamA" },
  { id: "CF_2", stage: "CF", teamA: { id: "W51", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W52", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jul 3", time: "6:00 p.m.", datetimeISO: "2026-07-03T18:00:00", nextMatchId: "SF_1", nextMatchPosition: "teamB" },
  { id: "CF_3", stage: "CF", teamA: { id: "W53", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W54", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jul 4", time: "3:00 p.m.", datetimeISO: "2026-07-04T15:00:00", nextMatchId: "SF_2", nextMatchPosition: "teamA" },
  { id: "CF_4", stage: "CF", teamA: { id: "W55", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W56", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jul 4", time: "6:00 p.m.", datetimeISO: "2026-07-04T18:00:00", nextMatchId: "SF_2", nextMatchPosition: "teamB" },

  // ========================
  // SEMIFINALES (2 partidos = 4 equipos)
  // ========================
  { id: "SF_1", stage: "SF", teamA: { id: "W57", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W58", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jul 7", time: "3:00 p.m.", datetimeISO: "2026-07-07T15:00:00", nextMatchId: "F_1", nextMatchPosition: "teamA" },
  { id: "SF_2", stage: "SF", teamA: { id: "W59", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W60", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jul 8", time: "3:00 p.m.", datetimeISO: "2026-07-08T15:00:00", nextMatchId: "F_1", nextMatchPosition: "teamB" },

  // ========================
  // FINALES
  // ========================
  { id: "F_1", stage: "F", teamA: { id: "W61", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W62", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jul 12", time: "3:00 p.m.", datetimeISO: "2026-07-12T15:00:00" },
  { id: "F_3rd", stage: "F", teamA: { id: "L61", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "L62", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jul 11", time: "3:00 p.m.", datetimeISO: "2026-07-11T15:00:00" },
];

// Preloaded background predictions for other colleagues to make the app alive!
export const PRELOADED_PREDICTIONS: Prediction[] = [
  // Carlos Mendoza (emp1)
  { matchId: "FG_A1", employeeId: "emp1", predictedScoreA: 2, predictedScoreB: 1 },
  { matchId: "FG_A2", employeeId: "emp1", predictedScoreA: 2, predictedScoreB: 0 },
  { matchId: "FG_B1", employeeId: "emp1", predictedScoreA: 2, predictedScoreB: 1 },
  { matchId: "FG_A3", employeeId: "emp1", predictedScoreA: 1, predictedScoreB: 2 },

  // Sofía Martínez (emp2)
  { matchId: "FG_A1", employeeId: "emp2", predictedScoreA: 1, predictedScoreB: 1 },
  { matchId: "FG_A2", employeeId: "emp2", predictedScoreA: 1, predictedScoreB: 1 },
  { matchId: "FG_B1", employeeId: "emp2", predictedScoreA: 3, predictedScoreB: 0 },
  { matchId: "FG_A3", employeeId: "emp2", predictedScoreA: 2, predictedScoreB: 0 },
  { matchId: "FG_A4", employeeId: "emp2", predictedScoreA: 1, predictedScoreB: 2 },

  // Andrés Silva (emp3)
  { matchId: "FG_A1", employeeId: "emp3", predictedScoreA: 3, predictedScoreB: 1 },
  { matchId: "FG_A2", employeeId: "emp3", predictedScoreA: 2, predictedScoreB: 2 },
  { matchId: "FG_B1", employeeId: "emp3", predictedScoreA: 1, predictedScoreB: 1 },
  { matchId: "FG_A3", employeeId: "emp3", predictedScoreA: 3, predictedScoreB: 1 },

  // Laura Gómez (emp4)
  { matchId: "FG_A1", employeeId: "emp4", predictedScoreA: 2, predictedScoreB: 1 },
  { matchId: "FG_A2", employeeId: "emp4", predictedScoreA: 0, predictedScoreB: 2 },
  { matchId: "FG_B1", employeeId: "emp4", predictedScoreA: 2, predictedScoreB: 0 },
  { matchId: "FG_A3", employeeId: "emp4", predictedScoreA: 1, predictedScoreB: 1 },
];
