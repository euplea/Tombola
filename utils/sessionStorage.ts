/**
 * Copyright (c) 2026 Fabio Orengo. All rights reserved.
 * Licensed under the MIT License.
 */

import { GameRole, PlayerInfo, TombolaCard } from '../types';

export const SESSION_KEY = 'tombola_session_v1';

export interface SessionData {
  role: GameRole;
  userName: string;
  roomId: string;
  myCards: TombolaCard[];
  drawnNumbers: number[];
  lastDrawn: number | null;
  smorfia: string | null;
  players: PlayerInfo[];
  totalNetworkCards: number;
  myPeerId?: string;
}

export const saveSession = (data: SessionData) => {
  try {
    const serialized = JSON.stringify(data);
    sessionStorage.setItem(SESSION_KEY, serialized);
  } catch (e) {
    console.warn('Failed to save session:', e);
  }
};

export const loadSession = (): SessionData | null => {
  try {
    const serialized = sessionStorage.getItem(SESSION_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (e) {
    console.warn('Failed to load session:', e);
    return null;
  }
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};
