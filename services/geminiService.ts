
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let chat: Chat | null = null;

export const generateSampleDialogue = async (topic: string, difficulty: string): Promise<ChatMessage[]> => {
    const prompt = `Generate a short, 4-5 message example conversation in English between two friends.
    One friend, named Alex (the AI), is helping their native Azerbaijani-speaking friend practice English.
    The topic is "${topic}".
    The proficiency level of the learner is ${difficulty}.
    The conversation should be casual, natural, and encouraging, like a normal chat between friends.
    The first message should be from Alex.
    For EVERY message (both 'user' and 'ai'), the 'text' field MUST contain the English message, followed by a newline, and then the Azerbaijani translation in parentheses. Example for any message: "Let's talk about traveling.\\n(Gəlin səyahət haqqında danışaq.)"
    Provide the output as a JSON array of objects, where each object has a "sender" ('user' or 'ai') and a "text" (the message) field.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            sender: {
                                type: Type.STRING,
                                enum: ['user', 'ai'],
                                description: "Either 'user' or 'ai'",
                            },
                            text: {
                                type: Type.STRING,
                                description: "The content of the message.",
                            },
                        },
                        required: ["sender", "text"],
                    },
                },
            },
        });

        const jsonString = response.text;
        const dialogue = JSON.parse(jsonString);
        if (Array.isArray(dialogue) && dialogue.every(msg => 'sender' in msg && 'text' in msg)) {
            return dialogue as ChatMessage[];
        } else {
            throw new Error("Invalid format for sample dialogue");
        }
    } catch (error) {
        console.error("Error generating sample dialogue:", error);
        return [
            { sender: 'ai', text: `Hello! I see you want to talk about ${topic}.\n(Salam! Görürəm ki, ${topic} haqqında danışmaq istəyirsiniz.)` },
            { sender: 'ai', text: 'To get us started, what is one thing you find interesting about it?\n(Başlamaq üçün, bu mövzuda sizə maraqlı gələn bir şey nədir?)' },
        ];
    }
};


export const startChatSession = (topic: string, difficulty: string, history: ChatMessage[]): Chat => {
    const systemInstruction = `You are Alex, an AI conversation partner. 
    You are chatting with a friend who is a native Azerbaijani speaker and wants to practice their English.
    The chosen topic is: "${topic}".
    Their proficiency level is: ${difficulty}.
    
    Your primary goals are:
    1.  Engage your friend in a casual, natural, and friendly conversation in English, like you would with any friend.
    2.  Keep your language appropriate for their proficiency level.
    3.  Focus on having a normal, flowing conversation. Do not act like a formal teacher or correct their mistakes. The goal is practice, not a lesson.
    4.  For EVERY response you provide, you MUST follow this format: first, the English sentence, then a newline character '\\n', and then the Azerbaijani translation in parentheses. For example: "That's a great perspective.\\n(Bu əla bir perspektivdir)".
    5.  A sample conversation has been provided as history. Continue the conversation naturally from where it left off, maintaining the required response format. 
    6.  Do not use markdown in your response.`;

    const formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: formattedHistory,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return chat;
};

export const sendMessageStream = async (message: string) => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startChatSession first.");
    }
    return await chat.sendMessageStream({ message });
};
