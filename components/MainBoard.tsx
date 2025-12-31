
import React from 'react';

interface MainBoardProps {
  drawnNumbers: number[];
  lastDrawn: number | null;
}

const MainBoard: React.FC<MainBoardProps> = ({ drawnNumbers, lastDrawn }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="w-3 h-8 bg-emerald-500 rounded-full"></span>
        Tabellone
      </h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
          const isDrawn = drawnNumbers.includes(num);
          const isLast = lastDrawn === num;
          
          return (
            <div
              key={num}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-300
                ${isLast ? 'bg-amber-400 text-white scale-110 shadow-lg z-10 animate-pulse' : 
                  isDrawn ? 'bg-emerald-500 text-white shadow-sm' : 
                  'bg-gray-50 text-gray-300 border border-gray-100'}
              `}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainBoard;
