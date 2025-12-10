import { useState, useRef } from 'react';
import { Plus, Trash2, Play, Upload, X } from 'lucide-react';
import type { Participant } from '../types';
import { createParticipant } from '../utils/tournamentLogic';
import NeonInput from './NeonInput';
import NeonButton from './NeonButton';
import { motion, AnimatePresence } from 'framer-motion';

interface TournamentSetupProps {
  onStart: (participants: Participant[], groupCount: number) => void;
}

const TournamentSetup = ({ onStart }: TournamentSetupProps) => {
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [groupCount, setGroupCount] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!name.trim()) return;
    setParticipants([...participants, createParticipant(name)]);
    setName('');
  };

  const handleRemove = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all participants?')) {
      setParticipants([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Simple CSV parser
      // Assumes one name per line or comma separated values
      const lines = text.split(/\r?\n/);
      const newParticipants: Participant[] = [];

      lines.forEach(line => {
        // Handle comma separated values - take the first column if multiple present
        const values = line.split(',');
        values.forEach(val => {
          const cleanName = val.trim();
          if (cleanName && cleanName.length > 0) {
            newParticipants.push(createParticipant(cleanName));
          }
        });
      });

      if (newParticipants.length > 0) {
        setParticipants(prev => [...prev, ...newParticipants]);
        alert(`Imported ${newParticipants.length} participants successfully!`);
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="space-y-6">
          <h2 className="text-2xl font-orbitron text-neon-blue mb-4">Add Bladers</h2>
          
          <div className="flex gap-2">
            <NeonInput 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Blader Name"
              className="flex-1"
            />
            <NeonButton onClick={handleAdd} variant="primary" className="px-3">
              <Plus className="w-6 h-6" />
            </NeonButton>
          </div>

          <div className="flex items-center gap-4 py-4 border-y border-gray-800">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt"
              className="hidden"
            />
            <NeonButton 
              onClick={() => fileInputRef.current?.click()} 
              variant="secondary" 
              className="flex-1 gap-2 text-sm"
            >
              <Upload className="w-4 h-4" /> Import CSV/Text
            </NeonButton>
            
            {participants.length > 0 && (
              <NeonButton 
                onClick={handleClearAll}
                variant="danger" 
                className="gap-2 text-sm px-3"
              >
                <X className="w-4 h-4" /> Clear
              </NeonButton>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-orbitron text-neon-purple mb-4">Settings</h3>
            <div className="flex items-center gap-4 bg-dark-surface p-4 rounded-lg border border-gray-800">
              <span className="text-gray-300">Number of Groups:</span>
              <input 
                type="number" 
                min="1" 
                max="8" 
                value={groupCount}
                onChange={(e) => setGroupCount(parseInt(e.target.value) || 1)}
                className="w-20 bg-dark-bg border border-gray-700 rounded px-2 py-1 text-white focus:border-neon-purple outline-none"
              />
            </div>
          </div>

          <div className="pt-8">
            <NeonButton 
              onClick={() => onStart(participants, groupCount)}
              disabled={participants.length < 2}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              variant="secondary"
            >
              <Play className="w-5 h-5" /> Start Tournament
            </NeonButton>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="bg-dark-surface/50 rounded-xl p-4 border border-gray-800 h-[500px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-orbitron text-gray-400 mb-4 sticky top-0 bg-dark-surface/95 p-2 backdrop-blur-sm z-10 flex justify-between items-center">
            <span>Participants</span>
            <span className="text-sm bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">{participants.length}</span>
          </h3>
          
          <div className="space-y-2">
            <AnimatePresence>
              {participants.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between bg-dark-card p-3 rounded border border-gray-800 hover:border-neon-blue/50 transition-colors group"
                >
                  <span className="font-exo font-medium">{p.name}</span>
                  <button 
                    onClick={() => handleRemove(p.id)}
                    className="text-gray-500 hover:text-neon-pink transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {participants.length === 0 && (
              <div className="text-center text-gray-600 py-10 italic">
                No participants added yet.
                <br />
                <span className="text-xs text-gray-700 mt-2 block">Upload a file or add manually</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentSetup;
