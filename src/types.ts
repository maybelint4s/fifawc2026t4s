export interface Team {
  id: string;
  name: string;
  flag: string;
  group: string;
  pts?: number;
  gf?: number; // goles a favor for sorting
}

export interface MatchParticipant {
  id: string; // "MEX" etc, or placeholder code "1A", "2B"
  name: string;
  flag: string; // Emoji
  isPlaceholder?: boolean;
}

export interface Match {
  id: string;
  stage: "FG" | "16vos" | "8vos" | "CF" | "SF" | "F"; // updated to support World Cup 2026 format (48 teams = 16vos added)
  groupName?: string; // e.g. "Grupo A", only for group stage
  teamA: MatchParticipant;
  teamB: MatchParticipant;
  scoreA?: number | null;
  scoreB?: number | null;
  status: "Pending" | "Live" | "Finished";
  date: string; // e.g., "Sáb, jul 4"
  time: string; // e.g., "5:00 p.m."
  datetimeISO: string; // e.g. "2026-07-04T17:00:00" - used with simulated corporate time
  venue?: string; // e.g., "Estadio Azteca, CDMX"
  nextMatchId?: string; // id of match that advances
  nextMatchPosition?: "teamA" | "teamB"; // position in next match (teamA or teamB)
}

export interface Prediction {
  matchId: string;
  employeeId: string;
  predictedScoreA: number;
  predictedScoreB: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string; // emoji or design style avatar
}

export interface EmployeeScore {
  employeeId: string;
  name: string;
  role: string;
  avatar: string;
  totalPoints: number;
  exactMatchesCount: number; // 3 points
  winnerMatchesCount: number; // 1 point
}
