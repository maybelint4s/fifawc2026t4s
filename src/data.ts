import { Team, Match, Employee, Prediction } from "./types";

export const INITIAL_TEAMS: Team[] = [
  // Grupo A
  { id: "MEX", name: "México", flag: "mx", group: "Grupo A", pts: 0, gf: 0 },
  { id: "RSA", name: "Sudáfrica", flag: "za", group: "Grupo A", pts: 0, gf: 0 },
  { id: "KOR", name: "Corea del Sur", flag: "kr", group: "Grupo A", pts: 0, gf: 0 },
  { id: "CZE", name: "Chequia", flag: "cz", group: "Grupo A", pts: 0, gf: 0 },

  // Grupo B
  { id: "CAN", name: "Canadá", flag: "ca", group: "Grupo B", pts: 0, gf: 0 },
  { id: "BIH", name: "Bosnia-Herz.", flag: "ba", group: "Grupo B", pts: 0, gf: 0 },
  { id: "QAT", name: "Catar", flag: "qa", group: "Grupo B", pts: 0, gf: 0 },
  { id: "SUI", name: "Suiza", flag: "ch", group: "Grupo B", pts: 0, gf: 0 },

  // Grupo C
  { id: "BRA", name: "Brasil", flag: "br", group: "Grupo C", pts: 0, gf: 0 },
  { id: "MAR", name: "Marruecos", flag: "ma", group: "Grupo C", pts: 0, gf: 0 },
  { id: "HAI", name: "Haití", flag: "ht", group: "Grupo C", pts: 0, gf: 0 },
  { id: "SCO", name: "Escocia", flag: "gb-sct", group: "Grupo C", pts: 0, gf: 0 },

  // Grupo D
  { id: "USA", name: "EE. UU.", flag: "us", group: "Grupo D", pts: 0, gf: 0 },
  { id: "PAR", name: "Paraguay", flag: "py", group: "Grupo D", pts: 0, gf: 0 },
  { id: "AUS", name: "Australia", flag: "au", group: "Grupo D", pts: 0, gf: 0 },
  { id: "TUR", name: "Türkiye", flag: "tr", group: "Grupo D", pts: 0, gf: 0 },

  // Grupo E
  { id: "GER", name: "Alemania", flag: "de", group: "Grupo E", pts: 0, gf: 0 },
  { id: "CUW", name: "Curazao", flag: "cw", group: "Grupo E", pts: 0, gf: 0 },
  { id: "CIV", name: "Costa de Marfil", flag: "ci", group: "Grupo E", pts: 0, gf: 0 },
  { id: "ECU", name: "Ecuador", flag: "ec", group: "Grupo E", pts: 0, gf: 0 },

  // Grupo F
  { id: "NED", name: "Países Bajos", flag: "nl", group: "Grupo F", pts: 0, gf: 0 },
  { id: "JPN", name: "Japón", flag: "jp", group: "Grupo F", pts: 0, gf: 0 },
  { id: "SWE", name: "Suecia", flag: "se", group: "Grupo F", pts: 0, gf: 0 },
  { id: "TUN", name: "Túnez", flag: "tn", group: "Grupo F", pts: 0, gf: 0 },

  // Grupo G
  { id: "BEL", name: "Bélgica", flag: "be", group: "Grupo G", pts: 0, gf: 0 },
  { id: "EGY", name: "Egipto", flag: "eg", group: "Grupo G", pts: 0, gf: 0 },
  { id: "IRN", name: "Irán", flag: "ir", group: "Grupo G", pts: 0, gf: 0 },
  { id: "NZL", name: "Nueva Zelanda", flag: "nz", group: "Grupo G", pts: 0, gf: 0 },

  // Grupo H
  { id: "ESP", name: "España", flag: "es", group: "Grupo H", pts: 0, gf: 0 },
  { id: "CPV", name: "Cabo Verde", flag: "cv", group: "Grupo H", pts: 0, gf: 0 },
  { id: "KSA", name: "Arabia Saudita", flag: "sa", group: "Grupo H", pts: 0, gf: 0 },
  { id: "URU", name: "Uruguay", flag: "uy", group: "Grupo H", pts: 0, gf: 0 },

  // Grupo I
  { id: "FRA", name: "Francia", flag: "fr", group: "Grupo I", pts: 0, gf: 0 },
  { id: "SEN", name: "Senegal", flag: "sn", group: "Grupo I", pts: 0, gf: 0 },
  { id: "IRQ", name: "Irak", flag: "iq", group: "Grupo I", pts: 0, gf: 0 },
  { id: "NOR", name: "Noruega", flag: "no", group: "Grupo I", pts: 0, gf: 0 },

  // Grupo J
  { id: "ARG", name: "Argentina", flag: "ar", group: "Grupo J", pts: 0, gf: 0 },
  { id: "ALG", name: "Argelia", flag: "dz", group: "Grupo J", pts: 0, gf: 0 },
  { id: "AUT", name: "Austria", flag: "at", group: "Grupo J", pts: 0, gf: 0 },
  { id: "JOR", name: "Jordania", flag: "jo", group: "Grupo J", pts: 0, gf: 0 },

  // Grupo K
  { id: "POR", name: "Portugal", flag: "pt", group: "Grupo K", pts: 0, gf: 0 },
  { id: "COL", name: "Colombia", flag: "co", group: "Grupo K", pts: 0, gf: 0 },
  { id: "UZB", name: "Uzbekistán", flag: "uz", group: "Grupo K", pts: 0, gf: 0 },
  { id: "COD", name: "RD Congo", flag: "cd", group: "Grupo K", pts: 0, gf: 0 },

  // Grupo L
  { id: "ENG", name: "Inglaterra", flag: "gb-eng", group: "Grupo L", pts: 0, gf: 0 },
  { id: "CRO", name: "Croacia", flag: "hr", group: "Grupo L", pts: 0, gf: 0 },
  { id: "GHA", name: "Ghana", flag: "gh", group: "Grupo L", pts: 0, gf: 0 },
  { id: "PAN", name: "Panamá", flag: "pa", group: "Grupo L", pts: 0, gf: 0 },
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

  // --- GRUPO A (México, Sudáfrica, Corea del Sur, Chequia) ---
  { id: "FG_A1", stage: "FG", groupName: "Grupo A", teamA: { id: "MEX", name: "México", flag: "mx" }, teamB: { id: "RSA", name: "Sudáfrica", flag: "za" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 11", time: "5:00 p.m.", datetimeISO: "2026-06-11T17:00:00", venue: "Estadio Azteca, CDMX" },
  { id: "FG_A2", stage: "FG", groupName: "Grupo A", teamA: { id: "KOR", name: "Corea del Sur", flag: "kr" }, teamB: { id: "CZE", name: "Chequia", flag: "cz" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 11", time: "8:00 p.m.", datetimeISO: "2026-06-11T20:00:00", venue: "Estadio Akron, Guadalajara" },
  { id: "FG_A3", stage: "FG", groupName: "Grupo A", teamA: { id: "MEX", name: "México", flag: "mx" }, teamB: { id: "KOR", name: "Corea del Sur", flag: "kr" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "5:00 p.m.", datetimeISO: "2026-06-18T17:00:00", venue: "Estadio Akron, Guadalajara" },
  { id: "FG_A4", stage: "FG", groupName: "Grupo A", teamA: { id: "CZE", name: "Chequia", flag: "cz" }, teamB: { id: "RSA", name: "Sudáfrica", flag: "za" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "8:00 p.m.", datetimeISO: "2026-06-18T20:00:00", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: "FG_A5", stage: "FG", groupName: "Grupo A", teamA: { id: "CZE", name: "Chequia", flag: "cz" }, teamB: { id: "MEX", name: "México", flag: "mx" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "5:00 p.m.", datetimeISO: "2026-06-24T17:00:00", venue: "Estadio Azteca, CDMX" },
  { id: "FG_A6", stage: "FG", groupName: "Grupo A", teamA: { id: "RSA", name: "Sudáfrica", flag: "za" }, teamB: { id: "KOR", name: "Corea del Sur", flag: "kr" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "5:00 p.m.", datetimeISO: "2026-06-24T17:00:00", venue: "Estadio BBVA, Monterrey" },

  // --- GRUPO B (Canadá, Bosnia-Herz., Catar, Suiza) ---
  { id: "FG_B1", stage: "FG", groupName: "Grupo B", teamA: { id: "CAN", name: "Canadá", flag: "ca" }, teamB: { id: "BIH", name: "Bosnia-Herz.", flag: "ba" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 12", time: "5:00 p.m.", datetimeISO: "2026-06-12T17:00:00", venue: "BMO Field, Toronto" },
  { id: "FG_B2", stage: "FG", groupName: "Grupo B", teamA: { id: "QAT", name: "Catar", flag: "qa" }, teamB: { id: "SUI", name: "Suiza", flag: "ch" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 13", time: "3:00 p.m.", datetimeISO: "2026-06-13T15:00:00", venue: "Levi's Stadium, Santa Clara" },
  { id: "FG_B3", stage: "FG", groupName: "Grupo B", teamA: { id: "CAN", name: "Canadá", flag: "ca" }, teamB: { id: "QAT", name: "Catar", flag: "qa" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "5:00 p.m.", datetimeISO: "2026-06-18T17:00:00", venue: "BC Place, Vancouver" },
  { id: "FG_B4", stage: "FG", groupName: "Grupo B", teamA: { id: "SUI", name: "Suiza", flag: "ch" }, teamB: { id: "BIH", name: "Bosnia-Herz.", flag: "ba" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "8:00 p.m.", datetimeISO: "2026-06-18T20:00:00", venue: "SoFi Stadium, Los Ángeles" },
  { id: "FG_B5", stage: "FG", groupName: "Grupo B", teamA: { id: "SUI", name: "Suiza", flag: "ch" }, teamB: { id: "CAN", name: "Canadá", flag: "ca" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "3:00 p.m.", datetimeISO: "2026-06-24T15:00:00", venue: "BC Place, Vancouver" },
  { id: "FG_B6", stage: "FG", groupName: "Grupo B", teamA: { id: "BIH", name: "Bosnia-Herz.", flag: "ba" }, teamB: { id: "QAT", name: "Catar", flag: "qa" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "3:00 p.m.", datetimeISO: "2026-06-24T15:00:00", venue: "BMO Field, Toronto" },

  // --- GRUPO C (Brasil, Marruecos, Haití, Escocia) ---
  { id: "FG_C1", stage: "FG", groupName: "Grupo C", teamA: { id: "BRA", name: "Brasil", flag: "br" }, teamB: { id: "MAR", name: "Marruecos", flag: "ma" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 13", time: "6:00 p.m.", datetimeISO: "2026-06-13T18:00:00", venue: "MetLife Stadium, Nueva Jersey" },
  { id: "FG_C2", stage: "FG", groupName: "Grupo C", teamA: { id: "HAI", name: "Haití", flag: "ht" }, teamB: { id: "SCO", name: "Escocia", flag: "gb-sct" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 13", time: "1:00 p.m.", datetimeISO: "2026-06-13T13:00:00", venue: "Gillette Stadium, Boston" },
  { id: "FG_C3", stage: "FG", groupName: "Grupo C", teamA: { id: "BRA", name: "Brasil", flag: "br" }, teamB: { id: "HAI", name: "Haití", flag: "ht" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 19", time: "5:00 p.m.", datetimeISO: "2026-06-19T17:00:00", venue: "Lincoln Financial, Filadelfia" },
  { id: "FG_C4", stage: "FG", groupName: "Grupo C", teamA: { id: "SCO", name: "Escocia", flag: "gb-sct" }, teamB: { id: "MAR", name: "Marruecos", flag: "ma" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 19", time: "8:00 p.m.", datetimeISO: "2026-06-19T20:00:00", venue: "Gillette Stadium, Boston" },
  { id: "FG_C5", stage: "FG", groupName: "Grupo C", teamA: { id: "SCO", name: "Escocia", flag: "gb-sct" }, teamB: { id: "BRA", name: "Brasil", flag: "br" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "8:00 p.m.", datetimeISO: "2026-06-24T20:00:00", venue: "Hard Rock Stadium, Miami" },
  { id: "FG_C6", stage: "FG", groupName: "Grupo C", teamA: { id: "MAR", name: "Marruecos", flag: "ma" }, teamB: { id: "HAI", name: "Haití", flag: "ht" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 24", time: "8:00 p.m.", datetimeISO: "2026-06-24T20:00:00", venue: "Mercedes-Benz Stadium, Atlanta" },

  // --- GRUPO D (EE. UU., Paraguay, Australia, Türkiye) ---
  { id: "FG_D1", stage: "FG", groupName: "Grupo D", teamA: { id: "USA", name: "EE. UU.", flag: "us" }, teamB: { id: "PAR", name: "Paraguay", flag: "py" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 12", time: "8:00 p.m.", datetimeISO: "2026-06-12T20:00:00", venue: "SoFi Stadium, Los Ángeles" },
  { id: "FG_D2", stage: "FG", groupName: "Grupo D", teamA: { id: "AUS", name: "Australia", flag: "au" }, teamB: { id: "TUR", name: "Türkiye", flag: "tr" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 13", time: "3:00 p.m.", datetimeISO: "2026-06-13T15:00:00", venue: "BC Place, Vancouver" },
  { id: "FG_D3", stage: "FG", groupName: "Grupo D", teamA: { id: "USA", name: "EE. UU.", flag: "us" }, teamB: { id: "AUS", name: "Australia", flag: "au" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 19", time: "5:00 p.m.", datetimeISO: "2026-06-19T17:00:00", venue: "Lumen Field, Seattle" },
  { id: "FG_D4", stage: "FG", groupName: "Grupo D", teamA: { id: "TUR", name: "Türkiye", flag: "tr" }, teamB: { id: "PAR", name: "Paraguay", flag: "py" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 19", time: "8:00 p.m.", datetimeISO: "2026-06-19T20:00:00", venue: "Levi's Stadium, Santa Clara" },
  { id: "FG_D5", stage: "FG", groupName: "Grupo D", teamA: { id: "TUR", name: "Türkiye", flag: "tr" }, teamB: { id: "USA", name: "EE. UU.", flag: "us" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "8:00 p.m.", datetimeISO: "2026-06-25T20:00:00", venue: "SoFi Stadium, Los Ángeles" },
  { id: "FG_D6", stage: "FG", groupName: "Grupo D", teamA: { id: "PAR", name: "Paraguay", flag: "py" }, teamB: { id: "AUS", name: "Australia", flag: "au" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "8:00 p.m.", datetimeISO: "2026-06-25T20:00:00", venue: "Levi's Stadium, Santa Clara" },

  // --- GRUPO E (Alemania, Curazao, Costa de Marfil, Ecuador) ---
  { id: "FG_E1", stage: "FG", groupName: "Grupo E", teamA: { id: "GER", name: "Alemania", flag: "de" }, teamB: { id: "CUW", name: "Curazao", flag: "cw" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 14", time: "3:00 p.m.", datetimeISO: "2026-06-14T15:00:00", venue: "NRG Stadium, Houston" },
  { id: "FG_E2", stage: "FG", groupName: "Grupo E", teamA: { id: "CIV", name: "Costa de Marfil", flag: "ci" }, teamB: { id: "ECU", name: "Ecuador", flag: "ec" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 14", time: "6:00 p.m.", datetimeISO: "2026-06-14T18:00:00", venue: "Lincoln Financial, Filadelfia" },
  { id: "FG_E3", stage: "FG", groupName: "Grupo E", teamA: { id: "GER", name: "Alemania", flag: "de" }, teamB: { id: "CIV", name: "Costa de Marfil", flag: "ci" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 20", time: "5:00 p.m.", datetimeISO: "2026-06-20T17:00:00", venue: "BMO Field, Toronto" },
  { id: "FG_E4", stage: "FG", groupName: "Grupo E", teamA: { id: "ECU", name: "Ecuador", flag: "ec" }, teamB: { id: "CUW", name: "Curazao", flag: "cw" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 20", time: "8:00 p.m.", datetimeISO: "2026-06-20T20:00:00", venue: "Arrowhead Stadium, Kansas City" },
  { id: "FG_E5", stage: "FG", groupName: "Grupo E", teamA: { id: "CUW", name: "Curazao", flag: "cw" }, teamB: { id: "CIV", name: "Costa de Marfil", flag: "ci" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "5:00 p.m.", datetimeISO: "2026-06-25T17:00:00", venue: "Lincoln Financial, Filadelfia" },
  { id: "FG_E6", stage: "FG", groupName: "Grupo E", teamA: { id: "ECU", name: "Ecuador", flag: "ec" }, teamB: { id: "GER", name: "Alemania", flag: "de" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "5:00 p.m.", datetimeISO: "2026-06-25T17:00:00", venue: "MetLife Stadium, Nueva Jersey" },

  // --- GRUPO F (Países Bajos, Japón, Suecia, Túnez) ---
  { id: "FG_F1", stage: "FG", groupName: "Grupo F", teamA: { id: "NED", name: "Países Bajos", flag: "nl" }, teamB: { id: "JPN", name: "Japón", flag: "jp" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 14", time: "8:00 p.m.", datetimeISO: "2026-06-14T20:00:00", venue: "AT&T Stadium, Dallas" },
  { id: "FG_F2", stage: "FG", groupName: "Grupo F", teamA: { id: "SWE", name: "Suecia", flag: "se" }, teamB: { id: "TUN", name: "Túnez", flag: "tn" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 14", time: "1:00 p.m.", datetimeISO: "2026-06-14T13:00:00", venue: "Estadio Akron, Guadalajara" },
  { id: "FG_F3", stage: "FG", groupName: "Grupo F", teamA: { id: "NED", name: "Países Bajos", flag: "nl" }, teamB: { id: "SWE", name: "Suecia", flag: "se" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 20", time: "5:00 p.m.", datetimeISO: "2026-06-20T17:00:00", venue: "NRG Stadium, Houston" },
  { id: "FG_F4", stage: "FG", groupName: "Grupo F", teamA: { id: "TUN", name: "Túnez", flag: "tn" }, teamB: { id: "JPN", name: "Japón", flag: "jp" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "3:00 p.m.", datetimeISO: "2026-06-21T15:00:00", venue: "Estadio Akron, Guadalajara" },
  { id: "FG_F5", stage: "FG", groupName: "Grupo F", teamA: { id: "JPN", name: "Japón", flag: "jp" }, teamB: { id: "SWE", name: "Suecia", flag: "se" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "5:00 p.m.", datetimeISO: "2026-06-25T17:00:00", venue: "AT&T Stadium, Dallas" },
  { id: "FG_F6", stage: "FG", groupName: "Grupo F", teamA: { id: "TUN", name: "Túnez", flag: "tn" }, teamB: { id: "NED", name: "Países Bajos", flag: "nl" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 25", time: "5:00 p.m.", datetimeISO: "2026-06-25T17:00:00", venue: "Arrowhead Stadium, Kansas City" },

  // --- GRUPO G (Bélgica, Egipto, Irán, Nueva Zelanda) ---
  { id: "FG_G1", stage: "FG", groupName: "Grupo G", teamA: { id: "BEL", name: "Bélgica", flag: "be" }, teamB: { id: "EGY", name: "Egipto", flag: "eg" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 15", time: "3:00 p.m.", datetimeISO: "2026-06-15T15:00:00", venue: "Lumen Field, Seattle" },
  { id: "FG_G2", stage: "FG", groupName: "Grupo G", teamA: { id: "IRN", name: "Irán", flag: "ir" }, teamB: { id: "NZL", name: "Nueva Zelanda", flag: "nz" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 15", time: "6:00 p.m.", datetimeISO: "2026-06-15T18:00:00", venue: "SoFi Stadium, Los Ángeles" },
  { id: "FG_G3", stage: "FG", groupName: "Grupo G", teamA: { id: "BEL", name: "Bélgica", flag: "be" }, teamB: { id: "IRN", name: "Irán", flag: "ir" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "6:00 p.m.", datetimeISO: "2026-06-21T18:00:00", venue: "SoFi Stadium, Los Ángeles" },
  { id: "FG_G4", stage: "FG", groupName: "Grupo G", teamA: { id: "NZL", name: "Nueva Zelanda", flag: "nz" }, teamB: { id: "EGY", name: "Egipto", flag: "eg" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "3:00 p.m.", datetimeISO: "2026-06-21T15:00:00", venue: "BC Place, Vancouver" },
  { id: "FG_G5", stage: "FG", groupName: "Grupo G", teamA: { id: "EGY", name: "Egipto", flag: "eg" }, teamB: { id: "IRN", name: "Irán", flag: "ir" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "5:00 p.m.", datetimeISO: "2026-06-26T17:00:00", venue: "Lumen Field, Seattle" },
  { id: "FG_G6", stage: "FG", groupName: "Grupo G", teamA: { id: "NZL", name: "Nueva Zelanda", flag: "nz" }, teamB: { id: "BEL", name: "Bélgica", flag: "be" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "5:00 p.m.", datetimeISO: "2026-06-26T17:00:00", venue: "BC Place, Vancouver" },

  // --- GRUPO H (España, Cabo Verde, Arabia Saudita, Uruguay) ---
  { id: "FG_H1", stage: "FG", groupName: "Grupo H", teamA: { id: "ESP", name: "España", flag: "es" }, teamB: { id: "CPV", name: "Cabo Verde", flag: "cv" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 15", time: "3:00 p.m.", datetimeISO: "2026-06-15T15:00:00", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: "FG_H2", stage: "FG", groupName: "Grupo H", teamA: { id: "KSA", name: "Arabia Saudita", flag: "sa" }, teamB: { id: "URU", name: "Uruguay", flag: "uy" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 15", time: "6:00 p.m.", datetimeISO: "2026-06-15T18:00:00", venue: "Hard Rock Stadium, Miami" },
  { id: "FG_H3", stage: "FG", groupName: "Grupo H", teamA: { id: "ESP", name: "España", flag: "es" }, teamB: { id: "KSA", name: "Arabia Saudita", flag: "sa" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "8:00 p.m.", datetimeISO: "2026-06-21T20:00:00", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: "FG_H4", stage: "FG", groupName: "Grupo H", teamA: { id: "URU", name: "Uruguay", flag: "uy" }, teamB: { id: "CPV", name: "Cabo Verde", flag: "cv" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 21", time: "8:00 p.m.", datetimeISO: "2026-06-21T20:00:00", venue: "Hard Rock Stadium, Miami" },
  { id: "FG_H5", stage: "FG", groupName: "Grupo H", teamA: { id: "CPV", name: "Cabo Verde", flag: "cv" }, teamB: { id: "KSA", name: "Arabia Saudita", flag: "sa" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "8:00 p.m.", datetimeISO: "2026-06-26T20:00:00", venue: "NRG Stadium, Houston" },
  { id: "FG_H6", stage: "FG", groupName: "Grupo H", teamA: { id: "URU", name: "Uruguay", flag: "uy" }, teamB: { id: "ESP", name: "España", flag: "es" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "8:00 p.m.", datetimeISO: "2026-06-26T20:00:00", venue: "Estadio Akron, Guadalajara" },

  // --- GRUPO I (Francia, Senegal, Irak, Noruega) ---
  { id: "FG_I1", stage: "FG", groupName: "Grupo I", teamA: { id: "FRA", name: "Francia", flag: "fr" }, teamB: { id: "SEN", name: "Senegal", flag: "sn" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 16", time: "6:00 p.m.", datetimeISO: "2026-06-16T18:00:00", venue: "MetLife Stadium, Nueva Jersey" },
  { id: "FG_I2", stage: "FG", groupName: "Grupo I", teamA: { id: "IRQ", name: "Irak", flag: "iq" }, teamB: { id: "NOR", name: "Noruega", flag: "no" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 16", time: "3:00 p.m.", datetimeISO: "2026-06-16T15:00:00", venue: "Gillette Stadium, Boston" },
  { id: "FG_I3", stage: "FG", groupName: "Grupo I", teamA: { id: "FRA", name: "Francia", flag: "fr" }, teamB: { id: "IRQ", name: "Irak", flag: "iq" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "5:00 p.m.", datetimeISO: "2026-06-22T17:00:00", venue: "Lincoln Financial, Filadelfia" },
  { id: "FG_I4", stage: "FG", groupName: "Grupo I", teamA: { id: "NOR", name: "Noruega", flag: "no" }, teamB: { id: "SEN", name: "Senegal", flag: "sn" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "8:00 p.m.", datetimeISO: "2026-06-22T20:00:00", venue: "MetLife Stadium, Nueva Jersey" },
  { id: "FG_I5", stage: "FG", groupName: "Grupo I", teamA: { id: "NOR", name: "Noruega", flag: "no" }, teamB: { id: "FRA", name: "Francia", flag: "fr" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "3:00 p.m.", datetimeISO: "2026-06-26T15:00:00", venue: "Gillette Stadium, Boston" },
  { id: "FG_I6", stage: "FG", groupName: "Grupo I", teamA: { id: "SEN", name: "Senegal", flag: "sn" }, teamB: { id: "IRQ", name: "Irak", flag: "iq" }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jun 26", time: "3:00 p.m.", datetimeISO: "2026-06-26T15:00:00", venue: "BMO Field, Toronto" },

  // --- GRUPO J (Argentina, Argelia, Austria, Jordania) ---
  { id: "FG_J1", stage: "FG", groupName: "Grupo J", teamA: { id: "ARG", name: "Argentina", flag: "ar" }, teamB: { id: "ALG", name: "Argelia", flag: "dz" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 17", time: "3:00 p.m.", datetimeISO: "2026-06-17T15:00:00", venue: "Hard Rock Stadium, Miami" },
  { id: "FG_J2", stage: "FG", groupName: "Grupo J", teamA: { id: "AUT", name: "Austria", flag: "at" }, teamB: { id: "JOR", name: "Jordania", flag: "jo" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 17", time: "6:00 p.m.", datetimeISO: "2026-06-17T18:00:00", venue: "AT&T Stadium, Dallas" },
  { id: "FG_J3", stage: "FG", groupName: "Grupo J", teamA: { id: "ARG", name: "Argentina", flag: "ar" }, teamB: { id: "AUT", name: "Austria", flag: "at" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "3:00 p.m.", datetimeISO: "2026-06-22T15:00:00", venue: "Hard Rock Stadium, Miami" },
  { id: "FG_J4", stage: "FG", groupName: "Grupo J", teamA: { id: "JOR", name: "Jordania", flag: "jo" }, teamB: { id: "ALG", name: "Argelia", flag: "dz" }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 22", time: "6:00 p.m.", datetimeISO: "2026-06-22T18:00:00", venue: "Arrowhead Stadium, Kansas City" },
  { id: "FG_J5", stage: "FG", groupName: "Grupo J", teamA: { id: "ALG", name: "Argelia", flag: "dz" }, teamB: { id: "AUT", name: "Austria", flag: "at" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 27", time: "3:00 p.m.", datetimeISO: "2026-06-27T15:00:00", venue: "AT&T Stadium, Dallas" },
  { id: "FG_J6", stage: "FG", groupName: "Grupo J", teamA: { id: "JOR", name: "Jordania", flag: "jo" }, teamB: { id: "ARG", name: "Argentina", flag: "ar" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 27", time: "3:00 p.m.", datetimeISO: "2026-06-27T17:00:00", venue: "Hard Rock Stadium, Miami" },

  // --- GRUPO K (Portugal, Colombia, Uzbekistán, RD Congo) ---
  { id: "FG_K1", stage: "FG", groupName: "Grupo K", teamA: { id: "POR", name: "Portugal", flag: "pt" }, teamB: { id: "COL", name: "Colombia", flag: "co" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 17", time: "8:00 p.m.", datetimeISO: "2026-06-17T20:00:00", venue: "MetLife Stadium, Nueva Jersey" },
  { id: "FG_K2", stage: "FG", groupName: "Grupo K", teamA: { id: "UZB", name: "Uzbekistán", flag: "uz" }, teamB: { id: "COD", name: "RD Congo", flag: "cd" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "1:00 p.m.", datetimeISO: "2026-06-18T13:00:00", venue: "NRG Stadium, Houston" },
  { id: "FG_K3", stage: "FG", groupName: "Grupo K", teamA: { id: "POR", name: "Portugal", flag: "pt" }, teamB: { id: "UZB", name: "Uzbekistán", flag: "uz" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "5:00 p.m.", datetimeISO: "2026-06-23T17:00:00", venue: "Estadio Azteca, CDMX" },
  { id: "FG_K4", stage: "FG", groupName: "Grupo K", teamA: { id: "COL", name: "Colombia", flag: "co" }, teamB: { id: "COD", name: "RD Congo", flag: "cd" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "8:00 p.m.", datetimeISO: "2026-06-23T20:00:00", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: "FG_K5", stage: "FG", groupName: "Grupo K", teamA: { id: "COD", name: "RD Congo", flag: "cd" }, teamB: { id: "POR", name: "Portugal", flag: "pt" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 27", time: "8:00 p.m.", datetimeISO: "2026-06-27T20:00:00", venue: "NRG Stadium, Houston" },
  { id: "FG_K6", stage: "FG", groupName: "Grupo K", teamA: { id: "COL", name: "Colombia", flag: "co" }, teamB: { id: "UZB", name: "Uzbekistán", flag: "uz" }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jun 27", time: "8:00 p.m.", datetimeISO: "2026-06-27T20:00:00", venue: "Estadio BBVA, Monterrey" },

  // --- GRUPO L (Inglaterra, Croacia, Ghana, Panamá) ---
  { id: "FG_L1", stage: "FG", groupName: "Grupo L", teamA: { id: "ENG", name: "Inglaterra", flag: "gb-eng" }, teamB: { id: "CRO", name: "Croacia", flag: "hr" }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jun 17", time: "1:00 p.m.", datetimeISO: "2026-06-17T13:00:00", venue: "Lincoln Financial, Filadelfia" },
  { id: "FG_L2", stage: "FG", groupName: "Grupo L", teamA: { id: "GHA", name: "Ghana", flag: "gh" }, teamB: { id: "PAN", name: "Panamá", flag: "pa" }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jun 18", time: "3:00 p.m.", datetimeISO: "2026-06-18T15:00:00", venue: "Arrowhead Stadium, Kansas City" },
  { id: "FG_L3", stage: "FG", groupName: "Grupo L", teamA: { id: "ENG", name: "Inglaterra", flag: "gb-eng" }, teamB: { id: "GHA", name: "Ghana", flag: "gh" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "3:00 p.m.", datetimeISO: "2026-06-23T15:00:00", venue: "Lincoln Financial, Filadelfia" },
  { id: "FG_L4", stage: "FG", groupName: "Grupo L", teamA: { id: "PAN", name: "Panamá", flag: "pa" }, teamB: { id: "CRO", name: "Croacia", flag: "hr" }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 23", time: "6:00 p.m.", datetimeISO: "2026-06-23T18:00:00", venue: "Lumen Field, Seattle" },
  { id: "FG_L5", stage: "FG", groupName: "Grupo L", teamA: { id: "PAN", name: "Panamá", flag: "pa" }, teamB: { id: "ENG", name: "Inglaterra", flag: "gb-eng" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 27", time: "5:00 p.m.", datetimeISO: "2026-06-27T17:00:00", venue: "Gillette Stadium, Boston" },
  { id: "FG_L6", stage: "FG", groupName: "Grupo L", teamA: { id: "CRO", name: "Croacia", flag: "hr" }, teamB: { id: "GHA", name: "Ghana", flag: "gh" }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 27", time: "5:00 p.m.", datetimeISO: "2026-06-27T17:00:00", venue: "Arrowhead Stadium, Kansas City" },

  // ========================
  // 16vos DE FINAL (16 partidos → 32 equipos avanzan del formato 48)
  // ========================
  { id: "R32_1", stage: "16vos", teamA: { id: "1A", name: "1° Grupo A", flag: "🏳️", isPlaceholder: true }, teamB: { id: "3CDI", name: "3° Grupo C/D/I", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 28", time: "3:00 p.m.", datetimeISO: "2026-06-28T15:00:00", nextMatchId: "R16_1", nextMatchPosition: "teamA" },
  { id: "R32_2", stage: "16vos", teamA: { id: "2A", name: "2° Grupo A", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2B", name: "2° Grupo B", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jun 28", time: "6:00 p.m.", datetimeISO: "2026-06-28T18:00:00", nextMatchId: "R16_1", nextMatchPosition: "teamB" },
  { id: "R32_3", stage: "16vos", teamA: { id: "1C", name: "1° Grupo C", flag: "🏳️", isPlaceholder: true }, teamB: { id: "3ABI", name: "3° Grupo A/B/I", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 29", time: "3:00 p.m.", datetimeISO: "2026-06-29T15:00:00", nextMatchId: "R16_2", nextMatchPosition: "teamA" },
  { id: "R32_4", stage: "16vos", teamA: { id: "2C", name: "2° Grupo C", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2D", name: "2° Grupo D", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Dom, jun 29", time: "6:00 p.m.", datetimeISO: "2026-06-29T18:00:00", nextMatchId: "R16_2", nextMatchPosition: "teamB" },
  { id: "R32_5", stage: "16vos", teamA: { id: "1B", name: "1° Grupo B", flag: "🏳️", isPlaceholder: true }, teamB: { id: "3ABF", name: "3° Grupo A/B/F", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 30", time: "3:00 p.m.", datetimeISO: "2026-06-30T15:00:00", nextMatchId: "R16_3", nextMatchPosition: "teamA" },
  { id: "R32_6", stage: "16vos", teamA: { id: "1D", name: "1° Grupo D", flag: "🏳️", isPlaceholder: true }, teamB: { id: "3DEF", name: "3° Grupo D/E/F", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Lun, jun 30", time: "6:00 p.m.", datetimeISO: "2026-06-30T18:00:00", nextMatchId: "R16_3", nextMatchPosition: "teamB" },
  { id: "R32_7", stage: "16vos", teamA: { id: "1E", name: "1° Grupo E", flag: "🏳️", isPlaceholder: true }, teamB: { id: "3EGH", name: "3° Grupo E/G/H", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jul 1", time: "3:00 p.m.", datetimeISO: "2026-07-01T15:00:00", nextMatchId: "R16_4", nextMatchPosition: "teamA" },
  { id: "R32_8", stage: "16vos", teamA: { id: "2E", name: "2° Grupo E", flag: "🏳️", isPlaceholder: true }, teamB: { id: "2F", name: "2° Grupo F", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jul 1", time: "6:00 p.m.", datetimeISO: "2026-07-01T18:00:00", nextMatchId: "R16_4", nextMatchPosition: "teamB" },

  // ========================
  // OCTAVOS DE FINAL – 8 partidos
  // ========================
  { id: "R16_1", stage: "8vos", teamA: { id: "W49", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W50", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jul 4", time: "3:00 p.m.", datetimeISO: "2026-07-04T15:00:00", nextMatchId: "CF_1", nextMatchPosition: "teamA" },
  { id: "R16_2", stage: "8vos", teamA: { id: "W51", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W52", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jul 4", time: "6:00 p.m.", datetimeISO: "2026-07-04T18:00:00", nextMatchId: "CF_1", nextMatchPosition: "teamB" },
  { id: "R16_3", stage: "8vos", teamA: { id: "W53", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W54", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jul 5", time: "3:00 p.m.", datetimeISO: "2026-07-05T15:00:00", nextMatchId: "CF_2", nextMatchPosition: "teamA" },
  { id: "R16_4", stage: "8vos", teamA: { id: "W55", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W56", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jul 5", time: "6:00 p.m.", datetimeISO: "2026-07-05T18:00:00", nextMatchId: "CF_2", nextMatchPosition: "teamB" },

  // ========================
  // CUARTOS DE FINAL (4 partidos)
  // ========================
  { id: "CF_1", stage: "CF", teamA: { id: "W57", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W58", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jul 9", time: "3:00 p.m.", datetimeISO: "2026-07-09T15:00:00", nextMatchId: "SF_1", nextMatchPosition: "teamA" },
  { id: "CF_2", stage: "CF", teamA: { id: "W59", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W60", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Jue, jul 10", time: "3:00 p.m.", datetimeISO: "2026-07-10T15:00:00", nextMatchId: "SF_1", nextMatchPosition: "teamB" },

  // ========================
  // SEMIFINALES (2 partidos)
  // ========================
  { id: "SF_1", stage: "SF", teamA: { id: "W61", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W62", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mar, jul 14", time: "3:00 p.m.", datetimeISO: "2026-07-14T15:00:00", nextMatchId: "F_1", nextMatchPosition: "teamA" },
  { id: "SF_2", stage: "SF", teamA: { id: "W63", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W64", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Mié, jul 15", time: "3:00 p.m.", datetimeISO: "2026-07-15T15:00:00", nextMatchId: "F_1", nextMatchPosition: "teamB" },

  // ========================
  // FINALES
  // ========================
  { id: "F_1", stage: "F", teamA: { id: "W65", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "W66", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Sáb, jul 19", time: "3:00 p.m.", datetimeISO: "2026-07-19T15:00:00", venue: "MetLife Stadium, Nueva Jersey" },
  { id: "F_3rd", stage: "F", teamA: { id: "L65", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, teamB: { id: "L66", name: "Por determinar", flag: "🏳️", isPlaceholder: true }, scoreA: null, scoreB: null, status: "Pending", date: "Vie, jul 18", time: "3:00 p.m.", datetimeISO: "2026-07-18T15:00:00", venue: "Hard Rock Stadium, Miami" },
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
