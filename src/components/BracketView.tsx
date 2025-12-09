import { useState } from 'react';
import type { BracketMatch, MatchResult, Participant } from '../types';
import NeonCard from './NeonCard';
import MatchResultForm from './MatchResultForm';
import { Trophy, Crown } from 'lucide-react';
import { cn } from '../utils/cn';

interface BracketViewProps {
  bracket: BracketMatch[];
  participants: Participant[];
  onMatchUpdate: (matchId: string, result: MatchResult) => void;
  onTournamentFinish?: () => void;
  readOnly?: boolean;
}

const BracketView = ({ bracket, participants, onMatchUpdate, onTournamentFinish, readOnly = false }: BracketViewProps) => {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);

  // Group matches by round
  // Round 1 = Quarter Finals (if 8), Round 2 = Semis, etc.
  // We need to determine the max round to label them correctly.
  // Assuming round numbers in bracket are 4, 2, 1 (matches count) or 1, 2, 3 (round index).
  // My generator used "matchesInRound" as round ID. So 4 = QF, 2 = SF, 1 = Final.
  // Round 0 is 3rd Place.
  
  const rounds = Array.from(new Set(bracket.map(m => m.round))).sort((a, b) => b - a).filter(r => r > 0);
  const thirdPlaceMatch = bracket.find(m => m.round === 0);
  const finalMatch = bracket.find(m => m.round === 1);
  const isTournamentComplete = finalMatch?.result && (thirdPlaceMatch ? thirdPlaceMatch.result : true);
  
  const getRoundName = (matchesCount: number) => {
    if (matchesCount === 1) return 'Final';
    if (matchesCount === 2) return 'Semi Finals';
    if (matchesCount === 4) return 'Quarter Finals';
    return `Round of ${matchesCount * 2}`;
  };

  const getParticipantName = (id: string | null) => {
    if (!id) return 'TBD';
    return participants.find(p => p.id === id)?.name || 'Unknown';
  };

  const handleAdvance = (match: BracketMatch) => {
    // Auto-win for the present player
    const result: MatchResult = {
      p1Score: match.p1Id ? 1 : 0,
      p2Score: match.p2Id ? 1 : 0,
      p1XtremeFinishes: 0,
      p2XtremeFinishes: 0,
      finishType: 'normal',
    };
    onMatchUpdate(match.id, result);
  };



  return (
    <div className="w-full max-w-7xl mx-auto p-4 overflow-x-auto">
      <div className="flex justify-between items-start min-w-[800px] gap-8">
        {rounds.map((roundMatchesCount) => {
          const roundMatches = bracket.filter(m => m.round === roundMatchesCount);
          
          return (
            <div key={roundMatchesCount} className="flex-1 flex flex-col justify-around min-h-[600px]">
              <h3 className="text-center text-neon-blue font-orbitron mb-8 text-xl">
                {getRoundName(roundMatchesCount)}
              </h3>
              
              <div className="flex flex-col justify-around flex-grow gap-8">
                {roundMatches.map((match) => (
                  <NeonCard 
                    key={match.id} 
                    variant={match.result ? "purple" : "blue"}
                    className={cn(
                      "relative p-3 md:p-4 flex flex-col gap-2 min-w-[200px]",
                      match.result ? "opacity-70" : "opacity-100"
                    )}
                  >
                    {editingMatch === match.id ? (
                      <MatchResultForm
                        initialResult={match.result}
                        p1Name={getParticipantName(match.p1Id)}
                        p2Name={getParticipantName(match.p2Id)}
                        onSave={(result) => {
                          onMatchUpdate(match.id, result);
                          setEditingMatch(null);
                        }}
                        onCancel={() => setEditingMatch(null)}
                      />
                    ) : (
                      <>
                        <div className="flex justify-between items-center bg-dark-bg/50 p-2 rounded border border-gray-700">
                          <span className={cn(
                            "font-exo font-bold truncate max-w-[100px]",
                            match.result?.p1Score && match.result.p1Score > match.result.p2Score ? "text-neon-green" : "text-white"
                          )}>
                            {getParticipantName(match.p1Id)}
                          </span>
                          {match.result && <span className="text-neon-blue font-bold">{match.result.p1Score}</span>}
                        </div>

                        <div className="flex justify-between items-center bg-dark-bg/50 p-2 rounded border border-gray-700">
                          <span className={cn(
                            "font-exo font-bold truncate max-w-[100px]",
                            match.result?.p2Score && match.result.p2Score > match.result.p1Score ? "text-neon-green" : "text-white"
                          )}>
                            {getParticipantName(match.p2Id)}
                          </span>
                          {match.result && <span className="text-neon-blue font-bold">{match.result.p2Score}</span>}
                        </div>

                        {!readOnly && !match.result && match.p1Id && match.p2Id && (
                          <div className="flex justify-center mt-2">
                            <button 
                              onClick={() => setEditingMatch(match.id)}
                              className="text-xs text-neon-blue hover:text-white border border-neon-blue rounded px-2 py-1"
                            >
                              Enter Result
                            </button>
                          </div>
                        )}

                        {!readOnly && !match.result && ((match.p1Id && !match.p2Id) || (!match.p1Id && match.p2Id)) && (
                          <div className="flex justify-center mt-2">
                            <button 
                              onClick={() => handleAdvance(match)}
                              className="text-xs text-neon-green hover:text-white border border-neon-green rounded px-2 py-1"
                            >
                              Advance
                            </button>
                          </div>
                        )}

                        {match.result && (
                          <div className="absolute -top-3 -right-3 bg-dark-bg border border-neon-yellow rounded-full p-1">
                            <Trophy className="w-4 h-4 text-neon-yellow" />
                          </div>
                        )}
                      </>
                    )}
                  </NeonCard>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Champion Column if Final is done */}
        {bracket.find(m => m.round === 1 && m.result) && (
           <div className="flex-1 flex flex-col justify-center items-center min-h-[600px] animate-in zoom-in duration-700">
             <h3 className="text-neon-yellow font-orbitron text-2xl mb-4">CHAMPION</h3>
             <div className="relative">
               <Crown className="w-20 h-20 text-neon-yellow animate-bounce" />
               <div className="absolute inset-0 blur-xl bg-neon-yellow/30 rounded-full" />
             </div>
             <div className="mt-4 text-3xl font-bold text-white font-orbitron text-center">
               {(() => {
                 const final = bracket.find(m => m.round === 1);
                 if (!final || !final.result) return '';
                 const winnerId = final.result.p1Score > final.result.p2Score ? final.p1Id : final.p2Id;
                 return getParticipantName(winnerId);
               })()}
             </div>

             {/* 3rd Place Display */}
             {thirdPlaceMatch && thirdPlaceMatch.result && (
               <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
                 <h4 className="text-neon-orange font-orbitron text-xl mb-2 text-center">3rd Place</h4>
                 <div className="text-xl font-bold text-white font-exo text-center">
                   {(() => {
                     const winnerId = thirdPlaceMatch.result!.p1Score > thirdPlaceMatch.result!.p2Score ? thirdPlaceMatch.p1Id : thirdPlaceMatch.p2Id;
                     return getParticipantName(winnerId);
                   })()}
                 </div>
               </div>
             )}

             {!readOnly && isTournamentComplete && onTournamentFinish && (
               <div className="mt-12 animate-in fade-in slide-in-from-bottom-8">
                 <button
                   onClick={onTournamentFinish}
                   className="px-8 py-3 bg-neon-yellow/20 hover:bg-neon-yellow/40 border border-neon-yellow text-neon-yellow hover:text-white rounded-xl font-orbitron font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                 >
                   FINISH TOURNAMENT
                 </button>
               </div>
             )}
           </div>
        )}
      </div>

      {/* 3rd Place Match Section (if exists and not finished or just always show if exists) */}
      {thirdPlaceMatch && !thirdPlaceMatch.result && (
        <div className="mt-12 flex flex-col items-center">
          <h3 className="text-neon-orange font-orbitron text-xl mb-4">3rd Place Match</h3>
          <NeonCard 
            key={thirdPlaceMatch.id} 
            variant="orange"
            className="relative p-4 flex flex-col gap-2 min-w-[300px]"
          >
            {editingMatch === thirdPlaceMatch.id ? (
              <MatchResultForm
                initialResult={thirdPlaceMatch.result}
                p1Name={getParticipantName(thirdPlaceMatch.p1Id)}
                p2Name={getParticipantName(thirdPlaceMatch.p2Id)}
                onSave={(result) => {
                  onMatchUpdate(thirdPlaceMatch.id, result);
                  setEditingMatch(null);
                }}
                onCancel={() => setEditingMatch(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-center bg-dark-bg/50 p-2 rounded border border-gray-700">
                  <span className="font-exo font-bold truncate max-w-[100px] text-white">
                    {getParticipantName(thirdPlaceMatch.p1Id)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-dark-bg/50 p-2 rounded border border-gray-700">
                  <span className="font-exo font-bold truncate max-w-[100px] text-white">
                    {getParticipantName(thirdPlaceMatch.p2Id)}
                  </span>
                </div>

                {!readOnly && !thirdPlaceMatch.result && thirdPlaceMatch.p1Id && thirdPlaceMatch.p2Id && (
                  <div className="flex justify-center mt-2">
                    <button 
                      onClick={() => setEditingMatch(thirdPlaceMatch.id)}
                      className="text-xs text-neon-orange hover:text-white border border-neon-orange rounded px-2 py-1"
                    >
                      Enter Result
                    </button>
                  </div>
                )}
              </>
            )}
          </NeonCard>
        </div>
      )}
    </div>
  );
};

export default BracketView;
