
import { SMORFIA_DEFINITIONS } from '../constants';

export const getSmorfiaMeaning = async (num: number): Promise<string> => {
  // Returns the meaning from the static list (simulating async for compatibility)
  const meaning = SMORFIA_DEFINITIONS[num];
  
  if (meaning) {
    return `${num}: ${meaning}`;
  }
  
  return `${num}: Tradizione`;
};
