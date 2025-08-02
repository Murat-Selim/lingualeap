import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Message } from '../types';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const conversationSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        role: {
          type: Type.STRING,
          description: "The speaker's role, either 'ai' or 'user'.",
          enum: ['ai', 'user'],
        },
        english: {
          type: Type.STRING,
          description: "The message in English.",
        },
        azerbaijani: {
          type: Type.STRING,
          description: "The message translated into Azerbaijani.",
        },
      },
      required: ['role', 'english', 'azerbaijani'],
    },
};


export const generateConversation = async (topic: string, difficulty: Difficulty): Promise<Omit<Message, 'id'>[]> => {
    try {
        const prompt = `Create a natural-sounding dialogue with 5 turns about "${topic}". The conversation is for an English language learner whose native language is Azerbaijani. The difficulty level should be ${difficulty}. The turns should alternate between the AI tutor ('ai') and the student ('user'), starting with the AI tutor.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: conversationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedResponse)) {
            throw new Error("API response is not an array");
        }
        
        return parsedResponse;

    } catch (error) {
        console.error("Error generating conversation:", error);
        // Fallback in case of API error
        return [
            {
                role: 'ai',
                english: 'Sorry, I had trouble starting a conversation. Please try again.',
                azerbaijani: 'Bağışlayın, söhbətə başlaya bilmədim. Zəhmət olmasa, yenidən cəhd edin.'
            }
        ];
    }
};