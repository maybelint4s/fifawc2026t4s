import type { Match } from "../types";
import mascotMessages from "../data/mascotMessages.json";

export type MascotMessageCategory = keyof typeof mascotMessages;

const TEAM_POWER: Record<string, number> = {
  ARG: 98,
  FRA: 97,
  BRA: 96,
  ENG: 95,
  ESP: 94,
  POR: 93,
  GER: 92,
  NED: 91,
  BEL: 90,
  URU: 89,
  CRO: 88,
  COL: 87,
  MAR: 86,
  SUI: 85,
  USA: 84,
  MEX: 83,
  JPN: 82,
  SEN: 81,
  ECU: 80,
  AUT: 79,
  TUR: 78,
  SWE: 77,
  KOR: 76,
  IRN: 75,
  AUS: 74,
  CZE: 73,
  CIV: 72,
  CAN: 71,
  PAR: 70,
  NOR: 69,
  ALG: 68,
  GHA: 67,
  BIH: 66,
  SCO: 65,
  TUN: 64,
  EGY: 63,
  QAT: 62,
  RSA: 61,
  UZB: 60,
  PAN: 59,
  COD: 58,
  IRQ: 57,
  NZL: 56,
  KSA: 55,
  HAI: 54,
  JOR: 53,
  CPV: 52,
  CUW: 51
};

const getRandomMessage = (category: MascotMessageCategory) => {
  const messages = mascotMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
};

const classifyPrediction = (match: Match, scoreA: number, scoreB: number): MascotMessageCategory => {
  const totalGoals = scoreA + scoreB;
  const goalDifference = Math.abs(scoreA - scoreB);

  if (scoreA === scoreB) return "draw";
  if (totalGoals >= 6 || goalDifference >= 4 || scoreA >= 5 || scoreB >= 5) return "wildScore";

  const predictedWinnerId = scoreA > scoreB ? match.teamA.id : match.teamB.id;
  const predictedLoserId = scoreA > scoreB ? match.teamB.id : match.teamA.id;
  const winnerPower = TEAM_POWER[predictedWinnerId] ?? 50;
  const loserPower = TEAM_POWER[predictedLoserId] ?? 50;

  if (winnerPower - loserPower >= 8) return "safeBet";

  return "saved";
};

export const getMascotPredictionMessage = (match: Match, scoreA: number, scoreB: number) => {
  const category = classifyPrediction(match, scoreA, scoreB);
  return {
    category,
    text: getRandomMessage(category)
  };
};
