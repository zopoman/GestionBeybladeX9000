import { useState, useEffect } from 'react';
import type { Tournament, Participant, MatchResult } from './types';
import { generateGroups, generateBracket, advanceBracket, updateParticipantStats } from './utils/tournamentLogic';
import NeonCard from './components/NeonCard';
import TournamentSetup from './components/TournamentSetup';
import GroupStage from './components/GroupStage';
import BracketView from './components/BracketView';
import HistoryView from './components/HistoryView';
import { Trophy, Users, Swords, GitBranch, History } from 'lucide-react';

function App() {
  const [view, setView] = useState<'current' | 'history'>('current');
  const [history, setHistory] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('tournament_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [tournament, setTournament] = useState<Tournament>({
    id: '1',
    name: 'Beyblade X Tournament',
    date: new Date().toISOString(),
    status: 'active',
    stage: 'setup',
    participants: [],
    groups: [],
    bracket: [],
  });

  useEffect(() => {
    localStorage.setItem('tournament_history', JSON.stringify(history));
  }, [history]);

  const handleStartTournament = (participants: Participant[], groupCount: number) => {
    const groups = generateGroups(participants, groupCount);
    setTournament(prev => ({
      ...prev,
      stage: 'groups',
      participants,
      groups,
    }));
  };

  const handleGroupMatchUpdate = (groupIndex: number, matchId: string, result: MatchResult) => {
    setTournament(prev => {
      const newGroups = [...prev.groups];
      const group = newGroups[groupIndex];
      const matchIndex = group.matches.findIndex(m => m.id === matchId);
      
      if (matchIndex !== -1) {
        group.matches[matchIndex] = {
          ...group.matches[matchIndex],
          result,
          isCompleted: true
        };
        
        // Recalculate stats for the group
        newGroups[groupIndex] = updateParticipantStats(group);
      }
      
      return { ...prev, groups: newGroups };
    });
  };

  const handleGroupFinish = () => {
    const bracket = generateBracket(tournament.groups);
    setTournament(prev => ({
      ...prev,
      stage: 'bracket',
      bracket,
    }));
  };

  const handleBracketMatchUpdate = (matchId: string, result: MatchResult) => {
    const newBracket = advanceBracket(tournament.bracket, matchId, result);
    setTournament(prev => ({
      ...prev,
      bracket: newBracket
    }));
  };

  const handleFinishTournament = () => {
    const finishedTournament: Tournament = {
      ...tournament,
      status: 'finished',
      date: new Date().toISOString(),
    };

    setHistory(prev => [finishedTournament, ...prev]);
    
    // Reset for new tournament
    setTournament({
      id: crypto.randomUUID(),
      name: 'Beyblade X Tournament',
      date: new Date().toISOString(),
      status: 'active',
      stage: 'setup',
      participants: [],
      groups: [],
      bracket: [],
    });
    
    setView('history');
  };

  if (view === 'history') {
    return (
      <div className="min-h-screen bg-dark-bg text-white p-4 md:p-8 bg-[url('/bg-grid.svg')] bg-fixed font-exo">
        <HistoryView history={history} onBack={() => setView('current')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white p-4 md:p-8 bg-[url('/bg-grid.svg')] bg-fixed font-exo">
      <header className="max-w-7xl mx-auto mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between border-b border-neon-blue/20 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <Trophy className="w-10 h-10 text-neon-yellow animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent text-center md:text-left">
            BEYBLADE X MANAGER
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-sm md:text-base">
            <div className={`flex items-center gap-2 ${tournament.stage === 'setup' ? 'text-neon-blue font-bold' : 'text-gray-600'}`}>
              <Users className="w-4 h-4 md:w-5 md:h-5" /> Setup
            </div>
            <div className="w-4 md:w-8 h-[2px] bg-gray-800 self-center" />
            <div className={`flex items-center gap-2 ${tournament.stage === 'groups' ? 'text-neon-purple font-bold' : 'text-gray-600'}`}>
              <Swords className="w-4 h-4 md:w-5 md:h-5" /> Groups
            </div>
            <div className="w-4 md:w-8 h-[2px] bg-gray-800 self-center" />
            <div className={`flex items-center gap-2 ${tournament.stage === 'bracket' ? 'text-neon-pink font-bold' : 'text-gray-600'}`}>
              <GitBranch className="w-4 h-4 md:w-5 md:h-5" /> Bracket
            </div>
          </div>
          
          <button 
            onClick={() => setView('history')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            title="View History"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <NeonCard className="min-h-[600px] flex flex-col p-2 md:p-6">
          {tournament.stage === 'setup' && (
            <TournamentSetup onStart={handleStartTournament} />
          )}
          {tournament.stage === 'groups' && (
            <GroupStage 
              groups={tournament.groups} 
              onMatchUpdate={handleGroupMatchUpdate} 
              onFinish={handleGroupFinish} 
            />
          )}
          {tournament.stage === 'bracket' && (
            <BracketView 
              bracket={tournament.bracket} 
              participants={tournament.participants}
              onMatchUpdate={handleBracketMatchUpdate}
              onTournamentFinish={handleFinishTournament}
            />
          )}
        </NeonCard>
      </main>
    </div>
  );
}

export default App;
