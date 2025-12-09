export type Participant = {
  id: string;
  name: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    pointsFor: number;
    pointsAgainst: number;
    xtremeFinishes: number;
    pointsDiff: number;
  };
};

export type MatchResult = {
  p1Score: number;
  p2Score: number;
  p1XtremeFinishes: number;
  p2XtremeFinishes: number;
  finishType: 'normal' | 'spin' | 'over' | 'xtreme' | 'burst' | null;
};

export type Match = {
  id: string;
  p1Id: string;
  p2Id: string;
  result: MatchResult | null;
  isCompleted: boolean;
};

export type Group = {
  id: string;
  name: string;
  participants: Participant[];
  matches: Match[];
};

export type BracketMatch = {
  id: string;
  round: number; // 0 = Final, 1 = Semis, 2 = Quarters, etc. (or reverse, we'll decide in logic)
  p1Id: string | null; // null if waiting for previous match
  p2Id: string | null;
  result: MatchResult | null;
  nextMatchId: string | null;
  loserNextMatchId?: string | null;
};

export type TournamentStage = 'setup' | 'groups' | 'bracket' | 'completed';

export type Tournament = {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'finished';
  stage: TournamentStage;
  participants: Participant[];
  groups: Group[];
  bracket: BracketMatch[];
};
