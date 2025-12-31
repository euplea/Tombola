import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TOTAL_NUMBERS } from './constants';
import { WinType, TombolaCard, GameRole, PlayerInfo, PeerMessage } from './types';
import { generateCard, checkWin } from './utils/gameLogic';
import { getSmorfiaMeaning } from './services/geminiService';
import MainBoard from './components/MainBoard';
import TombolaCardUI from './components/TombolaCardUI';
import GameManual from './components/GameManual';
import PrintableCards from './components/PrintableCards';
import PrizePool from './components/PrizePool';
import { Play, Pause, RotateCcw, Plus, Users, Wifi, Monitor, User, Info, ArrowRight, Volume2, Trophy, BookOpen, Printer, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Peer } from 'peerjs';

const App: React.FC = () => {
  const [role, setRole] = useState<GameRole>('Selecting');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lastDrawn, setLastDrawn] = useState<number | null>(null);
  const [smorfia, setSmorfia] = useState<string | null>(null);
  const [myCards, setMyCards] = useState<TombolaCard[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [showPrinter, setShowPrinter] = useState(false);
  const [totalNetworkCards, setTotalNetworkCards] = useState(0);
  
  const timerRef = useRef<any>(null);

  // Derived state for Total Cards (Host Logic vs Player Logic)
  const totalCardsInGame = role === 'Host' 
    ? myCards.length + players.reduce((acc, p) => acc + p.cards.length, 0)
    : totalNetworkCards;

  // Voice Synthesis Function
  const speakItalian = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.9; // Slightly slower for clarity
    
    // Find an Italian voice if possible
    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find(v => v.lang.startsWith('it'));
    if (italianVoice) utterance.voice = italianVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  // Simplified Room ID generation
  const generateSimpleRoomId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'TOMBOLA-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Initialize Peer
  const initPeer = (customId?: string) => {
    const p = new Peer(customId);
    p.on('open', (id: string) => {
      setRoomId(id);
      setPeer(p);
    });
    p.on('error', (err: any) => {
      setError(`Errore di connessione: ${err.type}`);
    });
    return p;
  };

  // Player logic to sync cards to host
  useEffect(() => {
    if (role === 'Player' && connections.host && myCards.length > 0) {
      connections.host.send({
        type: 'CARD_SYNC',
        payload: { cards: myCards }
      });
    }
  }, [myCards, role, connections.host]);

  // Visual Effect Trigger
  const triggerWinEffect = (type: WinType) => {
    if (type === 'Tombola') {
      // Grand Finale Animation for Tombola
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    } else {
      // Standard burst for intermediate wins
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'], // Red, Amber, Emerald, Blue
        disableForReducedMotion: true
      });
    }
  };

  // Handle Win Claims Logic (Unified verification for 'Tombola')
  const handleWinClaim = useCallback((claimantId: string, claimantName: string, winType: WinType) => {
    // Trigger visual effect immediately
    triggerWinEffect(winType);

    if (winType === 'Tombola') {
      // Logic for Tombola: check all participants for shared winners
      const winners: string[] = [];

      // Check Host
      const hostHasTombola = myCards.some(c => checkWin(c, drawnNumbers) === 'Tombola');
      if (hostHasTombola) winners.push(`${userName} (Host)`);

      // Check all connected players
      players.forEach(p => {
        const hasTombola = p.cards.some(c => checkWin(c, drawnNumbers) === 'Tombola');
        if (hasTombola) {
          winners.push(p.name);
        }
      });

      if (winners.length > 1) {
        const winnerList = winners.join(', ');
        speakItalian(`Vittoria condivisa! Hanno fatto Tombola: ${winnerList}! Complimenti a tutti!`);
        alert(`VITTORIA CONDIVISA! Vincitori: ${winnerList}`);
      } else if (winners.length === 1) {
        speakItalian(`Tombola! Il vincitore unico è ${winners[0]}!`);
        alert(`TOMBOLA! Vincitore: ${winners[0]}`);
      } else {
        // This shouldn't happen if the claim is valid, but for safety:
        speakItalian(`${claimantName} ha dichiarato Tombola, ma i numeri non corrispondono.`);
      }

      // Update state for all verified winners in player list
      setPlayers(prev => prev.map(p => 
        winners.includes(p.name) ? { ...p, lastWin: 'Tombola' } : p
      ));
    } else {
      // Standard announcement for Ambo, Terno, etc.
      speakItalian(`Attenzione! ${claimantName} ha fatto ${winType}!`);
      
      setPlayers(prev => prev.map(p => 
        p.id === claimantId ? { ...p, lastWin: winType } : p
      ));
      
      alert(`${claimantName} dichiara: ${winType}!`);
    }
  }, [userName, myCards, players, drawnNumbers]);

  // Host Logic
  useEffect(() => {
    if (role === 'Host' && peer) {
      peer.on('connection', (conn: any) => {
        conn.on('open', () => {
          setConnections(prev => ({ ...prev, [conn.peer]: conn }));
          conn.send({
            type: 'SYNC_STATE',
            payload: { drawnNumbers, lastDrawn, smorfia, totalCards: totalCardsInGame }
          });
        });

        conn.on('data', (data: PeerMessage) => {
          if (data.type === 'PLAYER_JOINED') {
            setPlayers(prev => {
              const exists = prev.find(p => p.id === conn.peer);
              if (exists) return prev;
              return [...prev, { ...data.payload, id: conn.peer, lastWin: 'None' }];
            });
          }
          if (data.type === 'CARD_SYNC') {
            setPlayers(prev => prev.map(p => 
              p.id === conn.peer ? { ...p, cards: data.payload.cards } : p
            ));
          }
          if (data.type === 'WIN_CLAIM') {
            const { playerName, winType } = data.payload;
            handleWinClaim(conn.peer, playerName, winType);
          }
        });

        conn.on('close', () => {
          setConnections(prev => {
            const newConns = { ...prev };
            delete newConns[conn.peer];
            return newConns;
          });
          setPlayers(prev => prev.filter(p => p.id !== conn.peer));
        });
      });
    }
  }, [role, peer, drawnNumbers, lastDrawn, smorfia, handleWinClaim, totalCardsInGame]);

  // Player Logic
  const connectToHost = (id: string) => {
    if (!peer) return;
    const conn = peer.connect(id);
    conn.on('open', () => {
      setConnections({ host: conn });
      conn.send({
        type: 'PLAYER_JOINED',
        payload: { name: userName, cards: myCards }
      });
      setRole('Player');
    });

    conn.on('data', (data: PeerMessage) => {
      if (data.type === 'SYNC_STATE' || data.type === 'DRAW_NUMBER') {
        const { drawnNumbers: syncedDrawn, lastDrawn: syncedLast, smorfia: syncedSmorfia, totalCards } = data.payload;
        setDrawnNumbers(syncedDrawn);
        setLastDrawn(syncedLast);
        setSmorfia(syncedSmorfia);
        if (totalCards !== undefined) setTotalNetworkCards(totalCards);
      }
    });
  };

  const drawNumber = useCallback(async () => {
    if (drawnNumbers.length >= TOTAL_NUMBERS) {
      setIsAutoPlaying(false);
      speakItalian("Gioco terminato. Tutti i numeri sono stati estratti.");
      return;
    }

    const available = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
      .filter(n => !drawnNumbers.includes(n));
    
    const next = available[Math.floor(Math.random() * available.length)];
    const newDrawn = [...drawnNumbers, next];
    const meaning = await getSmorfiaMeaning(next);

    setDrawnNumbers(newDrawn);
    setLastDrawn(next);
    setSmorfia(meaning);

    const speechText = `Numero ${next}. ${meaning.split(':').pop()?.trim() || ''}`;
    speakItalian(speechText);

    Object.values(connections).forEach((conn: any) => {
      conn.send({
        type: 'DRAW_NUMBER',
        payload: { drawnNumbers: newDrawn, lastDrawn: next, smorfia: meaning, totalCards: totalCardsInGame }
      });
    });
  }, [drawnNumbers, connections, totalCardsInGame]);

  useEffect(() => {
    if (isAutoPlaying && role === 'Host') {
      timerRef.current = setInterval(drawNumber, 5000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, drawNumber, role]);

  const claimWin = (winType: WinType) => {
    if (role === 'Player' && connections.host) {
      connections.host.send({
        type: 'WIN_CLAIM',
        payload: { playerName: userName, winType }
      });
    } else if (role === 'Host') {
      // If host claims, use the shared win detection logic immediately
      handleWinClaim(peer?.id || 'host', userName, winType);
      
      setMyCards(prev => prev.map(c => {
         const currentWin = checkWin(c, drawnNumbers);
         if (currentWin === winType) return { ...c, lastWin: winType };
         return c;
      }));
    }
  };

  const handleStartHost = () => {
    if (!userName) return alert('Inserisci il tuo nome');
    initPeer(generateSimpleRoomId());
    setRole('Host');
  };

  const handleJoinGame = () => {
    if (!userName || !roomId) return alert('Inserisci nome e Codice Tombola');
    initPeer();
    setTimeout(() => connectToHost(roomId.toUpperCase()), 1000);
  };

  if (role === 'Selecting') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.3),transparent_70%)]"></div>
        
        <div className="max-w-4xl w-full z-10 space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-6xl font-serif font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
              Tombola Royale
            </h1>
            <p className="text-slate-400 text-lg">Esperienza Multiplayer Tradizionale</p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl hover:border-red-500/50 transition-all group">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Monitor className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Crea Partita</h2>
              <p className="text-slate-400 mb-8">Gestisci il tabellone principale. La tua voce chiamerà i numeri in Italiano.</p>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Tuo Nome (Host)" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
                <button 
                  onClick={handleStartHost}
                  className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                >
                  Crea Stanza <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl hover:border-amber-500/50 transition-all group">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Partecipa</h2>
              <p className="text-slate-400 mb-8">Inserisci il "Codice Network" mostrato sull'host per ricevere le tue cartelle digitali.</p>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Tuo Nome" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all mb-2"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Codice Tombola (es. TOMBOLA-ABCD)" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                />
                <button 
                  onClick={handleJoinGame}
                  className="w-full bg-amber-500 hover:bg-amber-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
                >
                  Entra <Wifi size={20} />
                </button>
              </div>
            </div>
          </div>

          <footer className="text-center text-slate-500 text-sm flex items-center justify-center gap-4">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Peer-to-Peer Attivo</div>
             <div className="h-4 w-px bg-slate-700"></div>
             <div className="flex items-center gap-2"><Volume2 size={16} /> Chiamate Vocali in Italiano</div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Manual Modal */}
      {showManual && <GameManual onClose={() => setShowManual(false)} />}
      
      {/* Printer Modal */}
      {showPrinter && <PrintableCards onClose={() => setShowPrinter(false)} />}

      <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg text-white font-black text-xl shadow-lg">90</div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-red-700 hidden sm:block">Tombola Royale</h1>
          <div className="ml-4 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-mono font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {role === 'Host' ? 'Annunciatore' : 'Giocatore'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Codice Network</span>
            <span className="font-mono font-black text-slate-900 bg-amber-100 px-3 py-0.5 rounded-lg border border-amber-200">{roomId || '...'}</span>
          </div>

          {/* Host Tools */}
          {role === 'Host' && (
            <>
                <button 
                onClick={() => setShowPrinter(true)}
                className="p-2.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors mr-1"
                title="Stampa Cartelle"
                >
                <Printer size={20} />
                </button>

                <button 
                onClick={() => setShowManual(true)}
                className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors mr-1"
                title="Apri Manuale"
                >
                <BookOpen size={20} />
                </button>

                <button 
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${isAutoPlaying ? 'bg-amber-100 text-amber-700' : 'bg-red-600 text-white shadow-md'}`}
                >
                {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
            </>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid grid-cols-1 ${role === 'Host' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
          
          <div className={`${role === 'Host' ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'} space-y-8`}>
            
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] border-b-8 border-red-900/30">
              {lastDrawn ? (
                <div className="text-center z-10 animate-in fade-in zoom-in duration-300">
                  <div className="text-sm font-medium tracking-[0.2em] uppercase opacity-70 mb-2 font-mono">Numero Estratto</div>
                  <div className="text-[140px] font-black leading-none drop-shadow-2xl mb-4 tabular-nums">
                    {lastDrawn}
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-2xl text-2xl font-serif italic inline-block border border-white/20 shadow-inner">
                    {smorfia || '...'}
                  </div>
                </div>
              ) : (
                <div className="text-center z-10 py-10">
                  <p className="text-3xl font-serif italic mb-4">In attesa della prima estrazione...</p>
                  <div className="flex justify-center gap-3">
                    <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* PRIZE POOL DISPLAY - Visible to Everyone */}
            <PrizePool totalCards={totalCardsInGame} />

            {role === 'Host' && <MainBoard drawnNumbers={drawnNumbers} lastDrawn={lastDrawn} />}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-800">
                    {role === 'Host' ? 'Le Mie Cartelle (Host)' : 'Le Mie Cartelle'}
                </h2>
                <button 
                  onClick={() => setMyCards([...myCards, generateCard()])}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <Plus size={20} /> 
                  <span className="flex flex-col items-start leading-none">
                     <span>Compra Cartella</span>
                     <span className="text-[10px] opacity-80 font-mono">-10 Token</span>
                  </span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myCards.length === 0 ? (
                  <div className="md:col-span-2 py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <Trophy size={48} className="mb-4 opacity-20" />
                    <p>Non hai ancora nessuna cartella.</p>
                    <p className="text-sm mt-2 text-emerald-600 font-bold">Acquista una cartella per incrementare il Montepremi!</p>
                  </div>
                ) : (
                  myCards.map(card => {
                    const achievedWin = checkWin(card, drawnNumbers);
                    const canClaim = achievedWin !== 'None' && achievedWin !== card.lastWin;

                    return (
                      <div key={card.id} className="space-y-4">
                         <TombolaCardUI card={card} drawnNumbers={drawnNumbers} />
                         {canClaim && (
                           <button 
                              onClick={() => claimWin(achievedWin)}
                              className="w-full py-4 bg-amber-500 text-white font-black rounded-xl uppercase tracking-widest animate-pulse shadow-lg shadow-amber-500/30 text-lg active:scale-95 transition-transform"
                           >
                              Dichiara {achievedWin}!
                           </button>
                         )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {role === 'Host' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 min-h-[500px]">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users size={20} className="text-blue-500" />
                    Giocatori ({Object.keys(connections).length})
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                    <Volume2 size={12} /> LIVE SYNC
                  </div>
                </div>
                
                <div className="space-y-3">
                  {Object.keys(connections).length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                        <Wifi className="text-slate-300" size={32} />
                      </div>
                      <p className="text-slate-400 text-sm mb-4">Condividi il Codice Network per far entrare i giocatori:</p>
                      <div className="bg-slate-900 text-white p-4 rounded-2xl font-mono text-xl font-black tracking-widest shadow-xl ring-4 ring-slate-100">
                        {roomId}
                      </div>
                    </div>
                  ) : (
                    players.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-11 h-11 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tighter">ID: {p.id.slice(-6)}</p>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                                    {p.cards.length} Cartelle
                                </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          {p.lastWin !== 'None' ? (
                            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ring-amber-200 flex items-center gap-1 animate-pulse">
                              <Trophy size={10} /> {p.lastWin}
                            </div>
                          ) : (
                            <div className="text-[9px] font-bold text-slate-300 uppercase italic">Nessun punto</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                   <div className="flex items-start gap-3">
                      <Info className="text-blue-600 mt-0.5" size={16} />
                      <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        Ogni cartella acquistata (sia tua che dei giocatori) aggiunge 10 Token al Montepremi comune visualizzato in alto.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-2xl border border-slate-200/50 px-10 py-4 rounded-full shadow-2xl flex items-center gap-12 z-50 ring-1 ring-white">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estratti</span>
            <span className="text-2xl font-black text-red-600">{drawnNumbers.length}<span className="text-slate-300 text-sm font-normal">/90</span></span>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          
          {role === 'Host' ? (
            <button 
              onClick={drawNumber}
              disabled={isAutoPlaying || drawnNumbers.length >= 90}
              className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/20 active:scale-95"
            >
              <Plus size={20} /> Prossimo Numero
            </button>
          ) : (
             <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sei Connesso come</span>
              <span className="text-2xl font-black text-emerald-600">{userName}</span>
            </div>
          )}
        </div>
    </div>
  );
};

export default App;