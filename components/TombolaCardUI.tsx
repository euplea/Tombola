
/**
 * Copyright (c) 2026 Fabio Orengo. All rights reserved.
 * Licensed under the MIT License.
 */

import React from 'react';
import { TombolaCard } from '../types';
import { WIN_LABELS } from '../constants';

interface CardProps {
  card: TombolaCard;
  drawnNumbers: number[];
}

const TombolaCardUI: React.FC<CardProps> = ({ card, drawnNumbers }) => {
  // Determine the very last number drawn to animate only that specific cell
  const lastDrawnNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null;

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-200 p-4 relative overflow-hidden transition-all hover:shadow-xl group">
      {/* Inject custom animation styles */}
      <style>{`
        @keyframes stamp-in {
            0% { transform: scale(2); opacity: 0; }
            60% { transform: scale(0.9); opacity: 1; }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .animate-stamp {
            animation: stamp-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-slate-400 font-bold tracking-widest group-hover:text-slate-600 transition-colors">
          ID: {card.id}
        </span>
        {card.lastWin !== 'None' && (
          <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-wider animate-bounce shadow-sm flex items-center gap-1">
            <span className="text-amber-500">★</span> {WIN_LABELS[card.lastWin]}
          </span>
        )}
      </div>

      {/* Card Grid Container - Simulates the physical card tray */}
      <div className="grid grid-rows-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
        {card.grid.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-9 gap-1 h-12">
            {row.map((cell, cIdx) => {
              const isMarked = cell.value !== null && drawnNumbers.includes(cell.value);
              const isJustMarked = isMarked && cell.value === lastDrawnNumber;

              return (
                <div
                  key={cIdx}
                  className={`
                    relative flex items-center justify-center rounded-md text-lg font-bold select-none overflow-hidden
                    ${cell.value === null ? 'bg-transparent' : 'shadow-sm border border-slate-200/60'}
                    ${isMarked
                      ? 'bg-gradient-to-b from-red-500 to-red-600 text-white border-red-700 shadow-inner'
                      : 'bg-white text-slate-700 hover:bg-slate-50'}
                    ${isJustMarked ? 'animate-stamp z-10 ring-2 ring-red-300 ring-offset-1' : 'transition-all duration-300'}
                  `}
                >
                  {/* Glossy effect for marked cells */}
                  {isMarked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
                  )}

                  {/* The Number */}
                  <span className={isMarked ? 'drop-shadow-md transform scale-105' : ''}>
                    {cell.value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TombolaCardUI;
