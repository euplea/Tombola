
import React from 'react';
import { Coins, Trophy } from 'lucide-react';

interface PrizePoolProps {
  totalCards: number;
}

const TOKEN_COST = 10;

const PrizePool: React.FC<PrizePoolProps> = ({ totalCards }) => {
  const totalPot = totalCards * TOKEN_COST;

  // Prize distribution percentages
  // Ambo: 8%, Terno: 12%, Quaterna: 20%, Cinquina: 25%, Tombola: 35%
  const prizes = {
    ambo: Math.floor(totalPot * 0.08),
    terno: Math.floor(totalPot * 0.12),
    quaterna: Math.floor(totalPot * 0.20),
    cinquina: Math.floor(totalPot * 0.25),
    tombola: Math.ceil(totalPot * 0.35) // Ensure the rest goes to Tombola or round up
  };

  const PrizeCard = ({ label, amount, colorClass, icon }: { label: string, amount: number, colorClass: string, icon?: React.ReactNode }) => (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${colorClass} bg-white shadow-sm min-w-[80px] flex-1`}>
      <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</span>
      <div className="text-xl font-black text-slate-800 flex items-center gap-1">
        {icon}
        {amount}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
            <Coins size={20} />
          </div>
          Montepremi <span className="text-sm font-normal text-slate-500">({totalCards} cartelle in gioco)</span>
        </h3>
        <div className="text-2xl font-black text-slate-800 bg-white px-4 py-1 rounded-lg border border-slate-200 shadow-sm">
           {totalPot} <span className="text-xs font-bold text-yellow-600 uppercase">Token</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-center">
        <PrizeCard label="Ambo" amount={prizes.ambo} colorClass="border-slate-100" />
        <PrizeCard label="Terno" amount={prizes.terno} colorClass="border-slate-100" />
        <PrizeCard label="Quaterna" amount={prizes.quaterna} colorClass="border-slate-100" />
        <PrizeCard label="Cinquina" amount={prizes.cinquina} colorClass="border-slate-100" />
        <div className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-yellow-400 bg-yellow-50 shadow-md min-w-[100px] flex-[1.5] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
                <Trophy size={12} className="text-yellow-600" />
            </div>
            <span className="text-[10px] uppercase font-bold text-yellow-700 mb-1 tracking-widest">Tombola</span>
            <div className="text-2xl font-black text-yellow-600 flex items-center gap-1">
                {prizes.tombola}
            </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-[10px] text-slate-400">
            Il montepremi è generato astrattamente: <span className="font-bold text-slate-600">{TOKEN_COST} Token</span> per ogni cartella acquistata.
        </p>
      </div>
    </div>
  );
};

export default PrizePool;
