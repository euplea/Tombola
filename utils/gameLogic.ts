
/**
 * Copyright (c) 2026 Fabio Orengo. All rights reserved.
 * Licensed under the MIT License.
 */

import { TombolaCard, CardCell, WinType } from '../types';

/**
 * Priority map for win types to ensure we always return the highest achieved win.
 */
export const WIN_PRIORITY: Record<WinType, number> = {
  'None': 0,
  'Ambo': 1,
  'Terno': 2,
  'Quaterna': 3,
  'Cinquina': 4,
  'Tombola': 5
};

/**
 * Generates a standard Tombola card with 15 numbers (3 rows of 5)
 */
export const generateCard = (): TombolaCard => {
  const id = Math.random().toString(36).substr(2, 9);
  const grid: CardCell[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, marked: false }))
  );

  // For each column (0-8), pick numbers from specific ranges (1-9, 10-19, etc.)
  const columns: number[][] = Array.from({ length: 9 }, (_, i) => {
    const start = i === 0 ? 1 : i * 10;
    const end = i === 8 ? 90 : (i * 10) + 9;
    const range = Array.from({ length: end - start + 1 }, (_, k) => start + k);
    return range.sort(() => Math.random() - 0.5);
  });

  // Assign 15 numbers (3 per row usually, but we need 5 per row)
  for (let r = 0; r < 3; r++) {
    const colsForRow = Array.from({ length: 9 }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .sort((a, b) => a - b);

    colsForRow.forEach(c => {
      const val = columns[c].pop()!;
      grid[r][c].value = val;
    });
  }

  // Sort columns vertically to follow traditional Tombola layout rules
  for (let c = 0; c < 9; c++) {
    const vals = grid.map(row => row[c].value).filter(v => v !== null) as number[];
    vals.sort((a, b) => a - b);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      if (grid[r][c].value !== null) {
        grid[r][c].value = vals[idx++];
      }
    }
  }

  return { id, grid, lastWin: 'None' };
};

/**
 * Accurately detects the highest win type for a given card based on drawn numbers.
 */
export const checkWin = (card: TombolaCard, drawnNumbers: number[]): WinType => {
  let highestWin: WinType = 'None';
  let totalMarkedOnCard = 0;

  for (const row of card.grid) {
    const markedInRow = row.filter(cell => cell.value !== null && drawnNumbers.includes(cell.value)).length;
    totalMarkedOnCard += markedInRow;

    let currentRowWin: WinType = 'None';
    if (markedInRow === 2) currentRowWin = 'Ambo';
    else if (markedInRow === 3) currentRowWin = 'Terno';
    else if (markedInRow === 4) currentRowWin = 'Quaterna';
    else if (markedInRow === 5) currentRowWin = 'Cinquina';

    // Update global highest win if this row has a better one
    if (WIN_PRIORITY[currentRowWin] > WIN_PRIORITY[highestWin]) {
      highestWin = currentRowWin;
    }
  }

  // Tombola is achieved if all 15 numbers on the card are marked
  if (totalMarkedOnCard === 15) {
    return 'Tombola';
  }

  return highestWin;
};
