
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmorfiaMeaning = async (num: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Qual è il significato del numero ${num} nella Smorfia Napoletana? Rispondi solo con il titolo tradizionale in italiano. Esempio: "1: L'Italia". Non aggiungere traduzioni in inglese o altre spiegazioni.`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text?.trim() || `${num}: Tradizione`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `${num}: Tradizione`;
  }
};
