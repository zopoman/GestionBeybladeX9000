import { useState } from 'react';
import type { MatchResult } from '../types';
import NeonButton from './NeonButton';

interface MatchResultFormProps {
  initialResult?: MatchResult | null;
  p1Name: string;
  p2Name: string;
  onSave: (result: MatchResult) => void;
  onCancel: () => void;
}

const MatchResultForm = ({ initialResult, p1Name, p2Name, onSave, onCancel }: MatchResultFormProps) => {
  const [p1Score, setP1Score] = useState(initialResult?.p1Score || 0);
  const [p2Score, setP2Score] = useState(initialResult?.p2Score || 0);
  const [p1XF, setP1XF] = useState(initialResult?.p1XtremeFinishes || 0);
  const [p2XF, setP2XF] = useState(initialResult?.p2XtremeFinishes || 0);

  const handleSave = () => {
    onSave({
      p1Score,
      p2Score,
      p1XtremeFinishes: p1XF,
      p2XtremeFinishes: p2XF,
      finishType: (p1XF > 0 || p2XF > 0) ? 'xtreme' : 'normal',
    });
  };

  return (
    <div className="bg-black/30 p-2 md:p-3 rounded animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-center gap-3 md:gap-6 mb-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-neon-blue uppercase truncate max-w-[80px]">{p1Name}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setP1Score(Math.max(0, p1Score - 1))}
              className="w-10 h-10 md:w-8 md:h-8 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-blue flex items-center justify-center text-lg"
            >-</button>
            <span className="text-xl font-bold w-8 text-center font-orbitron">{p1Score}</span>
            <button 
              onClick={() => setP1Score(p1Score + 1)}
              className="w-10 h-10 md:w-8 md:h-8 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-blue flex items-center justify-center text-lg"
            >+</button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-neon-blue uppercase truncate max-w-[80px]">{p2Name}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setP2Score(Math.max(0, p2Score - 1))}
              className="w-10 h-10 md:w-8 md:h-8 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-blue flex items-center justify-center text-lg"
            >-</button>
            <span className="text-xl font-bold w-8 text-center font-orbitron">{p2Score}</span>
            <button 
              onClick={() => setP2Score(p2Score + 1)}
              className="w-10 h-10 md:w-8 md:h-8 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-blue flex items-center justify-center text-lg"
            >+</button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 md:gap-6 mb-3 items-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-neon-pink uppercase">P1 XF</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setP1XF(Math.max(0, p1XF - 1))}
              className="w-8 h-8 md:w-6 md:h-6 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-pink flex items-center justify-center"
            >-</button>
            <span className="text-sm font-bold w-4 text-center">{p1XF}</span>
            <button 
              onClick={() => setP1XF(p1XF + 1)}
              className="w-8 h-8 md:w-6 md:h-6 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-pink flex items-center justify-center"
            >+</button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-neon-pink uppercase">P2 XF</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setP2XF(Math.max(0, p2XF - 1))}
              className="w-8 h-8 md:w-6 md:h-6 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-pink flex items-center justify-center"
            >-</button>
            <span className="text-sm font-bold w-4 text-center">{p2XF}</span>
            <button 
              onClick={() => setP2XF(p2XF + 1)}
              className="w-8 h-8 md:w-6 md:h-6 rounded bg-dark-surface border border-gray-600 text-white hover:border-neon-pink flex items-center justify-center"
            >+</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <NeonButton onClick={handleSave} className="w-full py-2 text-xs md:py-1">Save</NeonButton>
        <button onClick={onCancel} className="text-gray-400 text-xs hover:text-white px-2">Cancel</button>
      </div>
    </div>
  );
};

export default MatchResultForm;
