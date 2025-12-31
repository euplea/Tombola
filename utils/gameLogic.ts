
import { TombolaCard, CardCell, WinType } from '../types';

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
  const numberPositions: [number, number][] = [];
  
  // Rule: each row must have 5 numbers, each column must have at least 1 number
  // Total numbers = 15
  
  // Simplified robust card gen:
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

  // Sort columns
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

// Fix comparison error by checking win levels in ascending order and removing redundant checks
export const checkWin = (card: TombolaCard, drawnNumbers: number[]): WinType => {
  let maxWin: WinType = 'None';
  let totalMarked = 0;

  for (const row of card.grid) {
    const markedInRow = row.filter(cell => cell.value && drawnNumbers.includes(cell.value)).length;
    totalMarked += markedInRow;

    // Check for row-based wins in increasing order of priority
    if (markedInRow === 2) {
      if (maxWin === 'None') maxWin = 'Ambo';
    } else if (markedInRow === 3) {
      if (maxWin === 'None' || maxWin === 'Ambo') maxWin = 'Terno';
    } else if (markedInRow === 4) {
      if (maxWin === 'None' || maxWin === 'Ambo' || maxWin === 'Terno') maxWin = 'Quaterna';
    } else if (markedInRow === 5) {
      maxWin = 'Cinquina';
    }
  }

  // Tombola is the highest possible win
  if (totalMarked === 15) return 'Tombola';
  
  return maxWin;
};
