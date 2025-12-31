
import React from 'react';
import { X, Wifi, Monitor, Users, Trophy, Info } from 'lucide-react';

interface GameManualProps {
  onClose: () => void;
}

const GameManual: React.FC<GameManualProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3">
            <span className="bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-lg">?</span>
            Manuale di Gioco
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8 space-y-8 text-slate-600 leading-relaxed">
          
          {/* Intro */}
          <section>
            <p className="text-lg text-slate-700">
              Benvenuti in <strong>Tombola Royale</strong>, la reinterpretazione moderna della classica Tombola napoletana con funzionalità Multiplayer Peer-to-Peer e Intelligenza Artificiale.
            </p>
          </section>

          {/* Connection Guide */}
          <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
              <Wifi className="text-blue-500" /> Guida alla Connessione
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Scenario A: Stessa rete Wi-Fi (Consigliato per feste)</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Un PC funge da <strong>Host</strong> (crea la partita).</li>
                  <li>Per far collegare gli smartphone, il PC e i telefoni devono essere sullo stesso Wi-Fi.</li>
                  <li>Se l'Host usa "localhost", gli altri non potranno collegarsi. L'Host deve condividere il proprio <strong>Indirizzo IP locale</strong> (es. <code>192.168.1.x:1234</code>) oppure usare un servizio di hosting.</li>
                </ul>
              </div>
              
              <div className="h-px bg-blue-200/50"></div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Scenario B: Gioco Remoto</h4>
                <p className="text-sm">
                  Se l'applicazione è pubblicata online (es. Vercel), basta condividere il link del sito e il <strong>Codice Network</strong> mostrato in alto a destra.
                </p>
              </div>
            </div>
          </section>

          {/* How to Play */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Trophy className="text-amber-500" /> Come Giocare
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">1</div>
                <h4 className="font-bold text-slate-900">Crea Stanza</h4>
                <p className="text-sm">L'Host crea la partita. Viene generato un codice univoco (es. TOMBOLA-A1B2).</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">2</div>
                <h4 className="font-bold text-slate-900">Partecipa</h4>
                <p className="text-sm">I giocatori inseriscono il codice per ricevere le cartelle sincronizzate.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">3</div>
                <h4 className="font-bold text-slate-900">Vinci</h4>
                <p className="text-sm">Il sistema verifica automaticamente Ambo, Terno, ecc. Clicca su "Dichiara" quando il pulsante appare!</p>
              </div>
            </div>
          </section>

          {/* Roles */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 p-5 rounded-2xl">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Monitor className="text-red-500" size={20} /> Ruolo Host
              </h4>
              <p className="text-sm text-slate-600">Gestisce il tabellone, estrae i numeri (manuale o auto) e vede la lista dei partecipanti in tempo reale.</p>
            </div>
            <div className="border border-slate-200 p-5 rounded-2xl">
               <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Users className="text-emerald-500" size={20} /> Ruolo Giocatore
              </h4>
              <p className="text-sm text-slate-600">Riceve i numeri estratti, segna le caselle e dichiara le vincite. Può avere più cartelle.</p>
            </div>
          </section>

          {/* Features */}
          <section className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
               <Info size={18} /> Note Tecniche
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
               <li><strong>Smorfia AI:</strong> I significati sono generati live da Google Gemini.</li>
               <li><strong>Sintesi Vocale:</strong> Assicurati di avere il volume alto per sentire i numeri chiamati in Italiano.</li>
               <li><strong>Vittoria Condivisa:</strong> Se più persone fanno Tombola con lo stesso numero, il sistema assegna la vittoria a tutti.</li>
            </ul>
          </section>

        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
                Chiudi Manuale
            </button>
        </div>
      </div>
    </div>
  );
};

export default GameManual;
