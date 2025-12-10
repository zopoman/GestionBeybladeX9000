import { useState } from 'react';
import type { Group, Match, MatchResult } from '../types';
import { calculateStandings } from '../utils/tournamentLogic';
import NeonCard from './NeonCard';
import NeonButton from './NeonButton';
import MatchResultForm from './MatchResultForm';
import { Trophy, Swords, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface GroupStageProps {
  groups: Group[];
  onMatchUpdate: (groupIndex: number, matchId: string, result: MatchResult) => void;
  onFinish: () => void;
  readOnly?: boolean;
}

const GroupStage = ({ groups, onMatchUpdate, onFinish, readOnly = false }: GroupStageProps) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const activeGroup = groups[activeGroupIndex];
  const standings = calculateStandings(activeGroup.participants);

  // Local state for match entry forms (map matchId -> form state)
  const [editingMatch, setEditingMatch] = useState<string | null>(null);

  const handleEditClick = (match: Match) => {
    setEditingMatch(match.id);
  };




  const allGroupsComplete = groups.every(g => g.matches.every(m => m.isCompleted));

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Group Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {groups.map((group, idx) => (
          <button
            key={group.id}
            onClick={() => setActiveGroupIndex(idx)}
            className={cn(
              "px-6 py-2 rounded-full font-orbitron text-sm transition-all whitespace-nowrap",
              activeGroupIndex === idx 
                ? "bg-neon-purple text-white shadow-[0_0_10px_#bc13fe]" 
                : "bg-dark-surface text-gray-400 hover:text-white"
            )}
          >
            {group.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standings Table */}
        <NeonCard variant="blue" className="h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-neon-yellow w-6 h-6" />
            <h3 className="text-xl font-orbitron text-white">Standings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 font-exo">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Blader</th>
                  <th className="pb-2 text-center">W</th>
                  <th className="pb-2 text-center">L</th>
                  <th className="pb-2 text-center">Diff</th>
                  <th className="pb-2 text-center">PF</th>
                  <th className="pb-2 text-center">PA</th>
                  <th className="pb-2 text-center">XF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {standings.map((p, i) => (
                  <tr key={p.id} className={cn(
                    "hover:bg-white/5 transition-colors",
                    i < 2 ? "text-neon-blue font-bold" : "text-gray-300" // Top 2 highlight
                  )}>
                    <td className="py-2 md:py-3">{i + 1}</td>
                    <td className="py-2 md:py-3">{p.name}</td>
                    <td className="py-2 md:py-3 text-center">{p.stats.wins}</td>
                    <td className="py-2 md:py-3 text-center">{p.stats.losses}</td>
                    <td className="py-2 md:py-3 text-center">{p.stats.pointsDiff}</td>
                    <td className="py-2 md:py-3 text-center text-gray-400">{p.stats.pointsFor}</td>
                    <td className="py-2 md:py-3 text-center text-gray-400">{p.stats.pointsAgainst}</td>
                    <td className="py-2 md:py-3 text-center text-neon-pink">{p.stats.xtremeFinishes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Top 2 advance automatically. Best 3rd places may qualify.</span>
          </div>
        </NeonCard>

        {/* Matches List */}
        <NeonCard variant="purple" className="h-fit max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-6 sticky top-0 bg-dark-card/95 backdrop-blur-sm z-10 py-2">
            <Swords className="text-neon-purple w-6 h-6" />
            <h3 className="text-xl font-orbitron text-white">Matches</h3>
          </div>

          <div className="space-y-6">
            {Object.entries(
              activeGroup.matches.reduce((acc, match) => {
                const round = match.round || 1;
                if (!acc[round]) acc[round] = [];
                acc[round].push(match);
                return acc;
              }, {} as Record<number, Match[]>)
            )
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([round, matches]) => (
              <div key={round} className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <div className="h-[1px] bg-gray-800 flex-1" />
                  <span className="text-neon-blue font-orbitron text-xs tracking-widest uppercase">
                    Fecha {round}
                  </span>
                  <div className="h-[1px] bg-gray-800 flex-1" />
                </div>
                
                {matches.map((match) => {
                  const p1 = activeGroup.participants.find(p => p.id === match.p1Id);
                  const p2 = activeGroup.participants.find(p => p.id === match.p2Id);
                  const isEditing = editingMatch === match.id;

                  return (
                    <div key={match.id} className="bg-dark-surface p-3 md:p-4 rounded-lg border border-gray-800 hover:border-neon-purple/30 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <span className={cn("font-bold w-1/3 text-right truncate", match.result && match.result.p1Score > match.result.p2Score ? "text-neon-green" : "text-white")}>
                          {p1?.name}
                        </span>
                        <span className="text-gray-500 text-xs px-2">VS</span>
                        <span className={cn("font-bold w-1/3 text-left truncate", match.result && match.result.p2Score > match.result.p1Score ? "text-neon-green" : "text-white")}>
                          {p2?.name}
                        </span>
                      </div>

                      {isEditing ? (
                        <MatchResultForm
                          initialResult={match.result}
                          p1Name={p1?.name || 'P1'}
                          p2Name={p2?.name || 'P2'}
                          onSave={(result) => {
                            onMatchUpdate(activeGroupIndex, match.id, result);
                            setEditingMatch(null);
                          }}
                          onCancel={() => setEditingMatch(null)}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          {match.isCompleted ? (
                            <>
                              <div className="text-2xl font-orbitron font-bold text-white">
                                {match.result?.p1Score} - {match.result?.p2Score}
                              </div>
                              <div className="text-xs uppercase tracking-widest text-neon-blue">
                                {match.result?.finishType} Finish
                              </div>
                              {!readOnly && (
                                <button onClick={() => handleEditClick(match)} className="text-xs text-gray-500 hover:text-white underline mt-1">
                                  Edit Result
                                </button>
                              )}
                            </>
                          ) : (
                            !readOnly && (
                              <NeonButton onClick={() => handleEditClick(match)} variant="secondary" className="py-1 px-4 text-xs">
                                Enter Result
                              </NeonButton>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </NeonCard>
      </div>

      {allGroupsComplete && !readOnly && (
        <div className="mt-8 flex justify-center animate-in zoom-in duration-500">
          <NeonButton onClick={onFinish} variant="danger" glow className="text-lg px-12 py-4">
            GENERATE BRACKET
          </NeonButton>
        </div>
      )}
    </div>
  );
};

export default GroupStage;
