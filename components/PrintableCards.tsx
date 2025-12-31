
import React, { useState, useEffect } from 'react';
import { X, Printer, RefreshCw, Minus, Plus } from 'lucide-react';
import { generateCard } from '../utils/gameLogic';
import { TombolaCard } from '../types';

interface PrintableCardsProps {
  onClose: () => void;
}

const PrintableCards: React.FC<PrintableCardsProps> = ({ onClose }) => {
  const [numCards, setNumCards] = useState(6);
  const [cards, setCards] = useState<TombolaCard[]>([]);

  // Generate cards when number changes
  useEffect(() => {
    const newCards = Array.from({ length: numCards }, () => generateCard());
    setCards(newCards);
  }, [numCards]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white overflow-y-auto">
      {/* Controls - Hidden during print */}
      <div className="print:hidden sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-4">
            <div className="bg-slate-100 p-2 rounded-lg">
                <Printer className="text-slate-700" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stampa Cartelle Cartacee</h2>
                <p className="text-sm text-slate-500">Genera cartelle per i giocatori senza smartphone</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button 
                    onClick={() => setNumCards(Math.max(1, numCards - 1))}
                    className="p-2 hover:bg-white rounded-md shadow-sm transition-all text-slate-600"
                >
                    <Minus size={18} />
                </button>
                <span className="font-mono font-bold w-8 text-center">{numCards}</span>
                <button 
                    onClick={() => setNumCards(numCards + 1)}
                    className="p-2 hover:bg-white rounded-md shadow-sm transition-all text-slate-600"
                >
                    <Plus size={18} />
                </button>
            </div>

            <button 
                onClick={() => setCards(Array.from({ length: numCards }, () => generateCard()))}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Rigenera numeri"
            >
                <RefreshCw size={18} /> Rigenera
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
                <Printer size={20} /> Stampa
            </button>

            <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
                <X size={24} />
            </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="p-8 min-h-screen bg-slate-50 print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none">
            
            {/* Print Header */}
            <div className="hidden print:flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-serif font-bold">Tombola Royale</h1>
                <span className="text-sm">Cartelle di Gioco</span>
            </div>

            <div className="grid grid-cols-2 gap-8 print:block print:gap-0">
                {cards.map((card, idx) => (
                    <div key={card.id} className="bg-white border-2 border-slate-800 p-4 rounded-xl print:rounded-none print:border-2 print:border-black print:mb-8 print:break-inside-avoid shadow-sm print:shadow-none">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-xs font-mono font-bold text-slate-400 print:text-black">ID: {card.id.toUpperCase().slice(0, 6)}</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 print:text-black">Tombola Royale</span>
                        </div>
                        
                        <div className="grid grid-rows-3 border border-slate-800 print:border-black bg-slate-100 print:bg-transparent">
                            {card.grid.map((row, rIdx) => (
                                <div key={rIdx} className="grid grid-cols-9 h-12 print:h-14">
                                    {row.map((cell, cIdx) => (
                                        <div 
                                            key={cIdx} 
                                            className={`
                                                flex items-center justify-center text-xl print:text-2xl font-bold border-r border-b border-slate-300 last:border-r-0 print:border-black
                                                ${rIdx === 2 ? 'border-b-0' : ''}
                                                ${cell.value === null ? 'bg-slate-50/50 print:bg-transparent' : 'bg-white print:bg-transparent'}
                                            `}
                                        >
                                            {cell.value || ''}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="hidden print:block text-center mt-8 text-xs text-gray-500">
                Generato con Tombola Royale Web App
            </div>
        </div>
      </div>

      <style>{`
        @media print {
            @page {
                margin: 1.5cm;
                size: A4;
            }
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .print\\:hidden {
                display: none !important;
            }
            .print\\:block {
                display: block !important;
            }
            .print\\:flex {
                display: flex !important;
            }
            .print\\:bg-white {
                background-color: white !important;
            }
            .print\\:text-black {
                color: black !important;
            }
            .print\\:border-black {
                border-color: black !important;
            }
            .print\\:shadow-none {
                box-shadow: none !important;
            }
        }
      `}</style>
    </div>
  );
};

export default PrintableCards;
