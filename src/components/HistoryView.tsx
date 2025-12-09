import { useState } from 'react';
import type { Tournament } from '../types';
import NeonCard from './NeonCard';
import GroupStage from './GroupStage';
import BracketView from './BracketView';
import { Calendar, Trophy, ArrowLeft } from 'lucide-react';

interface HistoryViewProps {
  history: Tournament[];
  onBack: () => void;
}

const HistoryView = ({ history, onBack }: HistoryViewProps) => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  if (selectedTournament) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedTournament(null)}
          className="flex items-center gap-2 text-neon-blue hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-orbitron text-white mb-2">{selectedTournament.name}</h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(selectedTournament.date).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="text-2xl font-orbitron text-neon-purple mb-6 text-center">Group Stage</h3>
            <GroupStage 
              groups={selectedTournament.groups} 
              onMatchUpdate={() => {}} 
              onFinish={() => {}} 
              readOnly={true} 
            />
          </section>

          <section>
            <h3 className="text-2xl font-orbitron text-neon-pink mb-6 text-center">Bracket Stage</h3>
            <BracketView 
              bracket={selectedTournament.bracket} 
              participants={selectedTournament.participants}
              onMatchUpdate={() => {}}
              readOnly={true}
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-orbitron text-white">Tournament History</h2>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neon-blue hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No past tournaments found.
          </div>
        ) : (
          history.map((tournament) => (
            <NeonCard 
              key={tournament.id} 
              variant="purple"
              className="p-6 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedTournament(tournament)}
            >
              <div className="flex justify-between items-start mb-4">
                <Trophy className="w-8 h-8 text-neon-yellow" />
                <span className="text-xs text-gray-400 border border-gray-700 px-2 py-1 rounded">
                  {new Date(tournament.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-xl font-orbitron text-white mb-2 truncate">{tournament.name}</h3>
              
              <div className="text-sm text-gray-400 space-y-1">
                <p>{tournament.participants.length} Participants</p>
                <p>{tournament.groups.length} Groups</p>
                <p className="text-neon-green mt-2">
                  Winner: {(() => {
                    const final = tournament.bracket.find(m => m.round === 1);
                    if (final?.result) {
                      const winnerId = final.result.p1Score > final.result.p2Score ? final.p1Id : final.p2Id;
                      return tournament.participants.find(p => p.id === winnerId)?.name || 'Unknown';
                    }
                    return 'Incomplete';
                  })()}
                </p>
              </div>
            </NeonCard>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
