import { v4 as uuidv4 } from 'uuid';
import type { Participant, Group, MatchResult, BracketMatch } from '../types';

export const createParticipant = (name: string): Participant => ({
  id: uuidv4(),
  name,
  stats: {
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    xtremeFinishes: 0,
    pointsDiff: 0,
  },
});

export const generateGroups = (participants: Participant[], groupCount: number): Group[] => {
  const shuffled = [...participants].sort(() => 0.5 - Math.random());
  const groups: Group[] = Array.from({ length: groupCount }, (_, i) => ({
    id: uuidv4(),
    name: `Group ${String.fromCharCode(65 + i)}`,
    participants: [],
    matches: [],
  }));

  shuffled.forEach((p, i) => {
    groups[i % groupCount].participants.push(p);
  });

  // Generate Round Robin Matches
  groups.forEach(group => {
    // Implement Circle Method for Round Robin
    const ps = [...group.participants];
    const n = ps.length;
    
    // Add dummy participant if odd number
    if (n % 2 !== 0) {
      ps.push({
        id: 'BYE',
        name: 'BYE',
        stats: {
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          xtremeFinishes: 0,
          pointsDiff: 0,
        }
      });
    }
    
    const numParticipants = ps.length; // Always even now
    const rounds = numParticipants - 1;
    const half = numParticipants / 2;
    
    for (let r = 0; r < rounds; r++) {
      for (let i = 0; i < half; i++) {
        const p1 = ps[i];
        const p2 = ps[numParticipants - 1 - i];
        
        // Don't create matches with BYE
        if (p1.id !== 'BYE' && p2.id !== 'BYE') {
          group.matches.push({
            id: uuidv4(),
            p1Id: p1.id,
            p2Id: p2.id,
            result: null,
            isCompleted: false,
            round: r + 1 // 1-indexed
          });
        }
      }
      
      // Rotate participants (keep first fixed)
      // [0, 1, 2, 3] -> slice(1) -> [1, 2, 3] -> pop -> 3, unshift -> [3, 1, 2]
      // New array -> [0, 3, 1, 2]
      if (ps.length > 1) {
        const fixed = ps[0];
        const rotating = ps.slice(1);
        const last = rotating.pop();
        if (last) rotating.unshift(last);
        ps.splice(0, ps.length, fixed, ...rotating);
      }
    }
  });

  return groups;
};

export const updateParticipantStats = (group: Group): Group => {
  // Reset stats first
  const participants = group.participants.map(p => ({
    ...p,
    stats: {
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      xtremeFinishes: 0,
      pointsDiff: 0,
    }
  }));

  group.matches.forEach(match => {
    if (match.isCompleted && match.result) {
      const p1 = participants.find(p => p.id === match.p1Id);
      const p2 = participants.find(p => p.id === match.p2Id);

      if (p1 && p2) {
        p1.stats.matchesPlayed++;
        p2.stats.matchesPlayed++;

        p1.stats.pointsFor += match.result.p1Score;
        p1.stats.pointsAgainst += match.result.p2Score;
        p1.stats.pointsDiff = p1.stats.pointsFor - p1.stats.pointsAgainst;

        p2.stats.pointsFor += match.result.p2Score;
        p2.stats.pointsAgainst += match.result.p1Score;
        p2.stats.pointsDiff = p2.stats.pointsFor - p2.stats.pointsAgainst;

        p1.stats.xtremeFinishes += match.result.p1XtremeFinishes || 0;
        p2.stats.xtremeFinishes += match.result.p2XtremeFinishes || 0;

        if (match.result.p1Score > match.result.p2Score) {
          p1.stats.wins++;
          p2.stats.losses++;
        } else if (match.result.p2Score > match.result.p1Score) {
          p2.stats.wins++;
          p1.stats.losses++;
        } else {
          p1.stats.draws++;
          p2.stats.draws++;
        }
      }
    }
  });

  return { ...group, participants };
};

export const calculateStandings = (participants: Participant[]): Participant[] => {
  return [...participants].sort((a, b) => {
    // 1. Victories
    if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
    // 2. Point Diff
    if (b.stats.pointsDiff !== a.stats.pointsDiff) return b.stats.pointsDiff - a.stats.pointsDiff;
    // 3. Xtreme Finishes
    if (b.stats.xtremeFinishes !== a.stats.xtremeFinishes) return b.stats.xtremeFinishes - a.stats.xtremeFinishes;
    // 4. Points For
    if (b.stats.pointsFor !== a.stats.pointsFor) return b.stats.pointsFor - a.stats.pointsFor;
    // 5. Points Against (Less is better)
    return a.stats.pointsAgainst - b.stats.pointsAgainst;
  });
};

export const generateBracket = (groups: Group[]): BracketMatch[] => {
  // 1. Get all participants with updated stats
  const processedGroups = groups.map(updateParticipantStats);
  
  // 2. Identify qualifiers
  let qualifiers: Participant[] = [];
  const thirdPlaces: Participant[] = [];

  processedGroups.forEach(group => {
    const sorted = calculateStandings(group.participants);
    if (sorted.length >= 1) qualifiers.push(sorted[0]);
    if (sorted.length >= 2) qualifiers.push(sorted[1]);
    if (sorted.length >= 3) thirdPlaces.push(sorted[2]);
  });

  // 3. Determine bracket size
  const totalQualified = qualifiers.length;
  let bracketSize = 2;
  while (bracketSize < totalQualified) bracketSize *= 2;

  // 4. Fill with best 3rds
  const slotsNeeded = bracketSize - totalQualified;
  if (slotsNeeded > 0 && thirdPlaces.length > 0) {
    const sortedThirds = calculateStandings(thirdPlaces);
    qualifiers.push(...sortedThirds.slice(0, slotsNeeded));
  }

  // 5. Sort qualifiers for seeding
  qualifiers = calculateStandings(qualifiers);
  const seeds = new Array(bracketSize).fill(null).map((_, i) => qualifiers[i] || null);


  const rounds = Math.log2(bracketSize);

  // Helper to create matches for a round
  // We generate from Final (Round 1) backwards to First Round?
  // Or First Round to Final?
  // Easier to generate First Round, then Second, etc.
  
  // Let's generate all matches first, then link them.
  // Round 1 (First Round): bracketSize / 2 matches.
  // Round 2: bracketSize / 4 matches.
  // ...
  // Round N (Final): 1 match.
  
  // We need to store matches to link them.
  // matches[round][index]
  const matchesByRound: BracketMatch[][] = [];

  for (let r = rounds; r >= 1; r--) { // r = matches count in round? No.
    // Let's use "matches count" as round identifier to match UI.
    // Round with 8 matches, Round with 4, etc.
    const matchesInRound = Math.pow(2, r - 1);
    const roundMatches: BracketMatch[] = [];

    for (let i = 0; i < matchesInRound; i++) {
      roundMatches.push({
        id: uuidv4(),
        round: matchesInRound, // 4 = QF, 2 = SF, 1 = Final
        p1Id: null,
        p2Id: null,
        result: null,
        nextMatchId: null,
      });
    }
    matchesByRound.push(roundMatches);
  }
  
  // matchesByRound[0] is First Round (e.g. 8 matches)
  // matchesByRound[1] is Second Round (e.g. 4 matches)
  
  // Link matches
  for (let i = 0; i < matchesByRound.length - 1; i++) {
    const currentRound = matchesByRound[i];
    const nextRound = matchesByRound[i+1];
    
    currentRound.forEach((match, index) => {
      const nextMatchIndex = Math.floor(index / 2);
      match.nextMatchId = nextRound[nextMatchIndex].id;
    });
  }

  // Populate First Round with Seeds
  const firstRound = matchesByRound[0];
  const matchesCount = firstRound.length;
  
  for (let i = 0; i < matchesCount; i++) {
    const p1 = seeds[i];
    const p2 = seeds[bracketSize - 1 - i];
    
    firstRound[i].p1Id = p1 ? p1.id : null;
    firstRound[i].p2Id = p2 ? p2.id : null;
  }

  // 3rd Place Match Logic
  // If we have Semi-Finals (Round 2 matches), we need a 3rd place match.
  // Semi-Finals are in matchesByRound where matchesInRound === 2.
  const semiFinalRound = matchesByRound.find(round => round.length === 2);
  let thirdPlaceMatch: BracketMatch | null = null;

  if (semiFinalRound) {
    thirdPlaceMatch = {
      id: uuidv4(),
      round: 0, // Special round ID for 3rd place
      p1Id: null,
      p2Id: null,
      result: null,
      nextMatchId: null,
    };
    
    // Link losers of semi-finals to this match
    semiFinalRound.forEach(match => {
      match.loserNextMatchId = thirdPlaceMatch!.id;
    });
  }

  const flatBracket = matchesByRound.flat();
  if (thirdPlaceMatch) {
    flatBracket.push(thirdPlaceMatch);
  }

  return flatBracket;
};

export const advanceBracket = (bracket: BracketMatch[], matchId: string, result: MatchResult): BracketMatch[] => {
  const matchIndex = bracket.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return bracket;

  const updatedBracket = [...bracket];
  const match = { ...updatedBracket[matchIndex], result, isCompleted: true }; // Assuming Match type has isCompleted, but BracketMatch definition in types might need check.
  updatedBracket[matchIndex] = match;

  // If there is a next match, update it
  if (match.nextMatchId) {
    const nextMatchIndex = updatedBracket.findIndex(m => m.id === match.nextMatchId);
    if (nextMatchIndex !== -1) {
      const nextMatch = { ...updatedBracket[nextMatchIndex] };
      const winnerId = result.p1Score > result.p2Score ? match.p1Id : match.p2Id;
      
      if (!nextMatch.p1Id) {
        nextMatch.p1Id = winnerId;
      } else if (!nextMatch.p2Id) {
        nextMatch.p2Id = winnerId;
      }
      updatedBracket[nextMatchIndex] = nextMatch;
    }
  }

  // Handle Loser Progression (3rd Place)
  if (match.loserNextMatchId) {
    const nextMatchIndex = updatedBracket.findIndex(m => m.id === match.loserNextMatchId);
    if (nextMatchIndex !== -1) {
      const nextMatch = { ...updatedBracket[nextMatchIndex] };
      const loserId = result.p1Score > result.p2Score ? match.p2Id : match.p1Id;
      
      if (!nextMatch.p1Id) {
        nextMatch.p1Id = loserId;
      } else if (!nextMatch.p2Id) {
        nextMatch.p2Id = loserId;
      }
      updatedBracket[nextMatchIndex] = nextMatch;
    }
  }

  return updatedBracket;
};
