
export type WinType = 'None' | 'Ambo' | 'Terno' | 'Quaterna' | 'Cinquina' | 'Tombola';

export type GameRole = 'Host' | 'Player' | 'Selecting';

export interface PlayerInfo {
  id: string;
  name: string;
  cards: TombolaCard[];
  lastWin: WinType;
}

export interface CardCell {
  value: number | null;
  marked: boolean;
}

export interface TombolaCard {
  id: string;
  grid: CardCell[][];
  lastWin: WinType;
}

export interface PeerMessage {
  type: 'DRAW_NUMBER' | 'WIN_CLAIM' | 'SYNC_STATE' | 'PLAYER_JOINED' | 'CARD_SYNC';
  payload: any;
}
