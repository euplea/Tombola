
import React from 'react';
import { TombolaCard, WinType } from '../types';
import { WIN_LABELS } from '../constants';

interface CardProps {
  card: TombolaCard;
  drawnNumbers: number[];
}

const TombolaCardUI: React.FC<CardProps> = ({ card, drawnNumbers }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-200 p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-gray-400">ID: {card.id}</span>
        {card.lastWin !== 'None' && (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold animate-bounce">
            {WIN_LABELS[card.lastWin]}
          </span>
        )}
      </div>
      
      <div className="grid grid-rows-3 gap-1">
        {card.grid.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-9 gap-1">
            {row.map((cell, cIdx) => {
              const isMarked = cell.value !== null && drawnNumbers.includes(cell.value);
              return (
                <div
                  key={cIdx}
                  className={`
                    h-12 w-full flex items-center justify-center rounded text-base font-bold transition-colors
                    ${cell.value === null ? 'bg-gray-50/50' : 
                      isMarked ? 'bg-red-500 text-white shadow-inner' : 
                      'bg-white border border-gray-200 text-gray-700'}
                  `}
                >
                  {cell.value}
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
