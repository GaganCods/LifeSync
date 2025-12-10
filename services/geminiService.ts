import { GoogleGenAI } from "@google/genai";
import { DailyLog } from "../types";

export const generateMentorInsight = async (recentLogs: DailyLog[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Sort logs by date ascending
    const sortedLogs = [...recentLogs].sort((a, b) => a.date.localeCompare(b.date));
    const formattedData = JSON.stringify(sortedLogs, null, 2);

    const prompt = `
      You are a strict but encouraging lifestyle mentor and accountability partner. 
      Your goal is to help the user stop being lazy, reduce Instagram addiction, and study more effectively.
      
      Analyze the following JSON data representing the user's last few days of habits.
      
      Data:
      ${formattedData}

      Please provide a response (max 200 words) using the following structure:
      
      ### 🔎 Reality Check
      (Analyze their "Study vs Instagram" ratio. If Instagram > Study, call them out. If they studied well, praise them.)

      ### 💡 Pattern Spotted
      (Connect their Sleep Quality or Mood to their productivity. e.g. "You focus better when you wake up before 8 AM" or "Late nights are killing your focus.")

      ### ⚔️ Tomorrow's Mission
      (Give one specific, hard challenge for tomorrow. e.g. "0 minutes of Instagram before 6 PM" or "2 hours deep work".)

      Be direct, concise, and motivational. Use Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate an insight right now. Keep tracking!";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Start tracking your habits to unlock AI insights! (Or check if your API key is valid).";
  }
};