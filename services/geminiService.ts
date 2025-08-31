import { GoogleGenAI, Type } from "@google/genai";
import { ATSAnalysis } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 representing how well the resume matches the job description for an ATS.",
        },
        summary: {
            type: Type.STRING,
            description: "A brief, two-sentence summary of the resume's strengths and weaknesses against the job description.",
        },
        matchingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of important keywords from the job description that were found in the resume.",
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of important keywords from the job description that are missing from the resume.",
        },
        suggestions: {
            type: Type.STRING,
            description: "Actionable suggestions for improving the resume, formatted as a single string with bullet points (e.g., '- Suggestion 1\n- Suggestion 2').",
        },
    },
    required: ["score", "summary", "matchingKeywords", "missingKeywords", "suggestions"],
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<ATSAnalysis> => {
    try {
        const prompt = `
            Analyze the following resume against the provided job description from the perspective of an Applicant Tracking System (ATS) and a recruiter.
            Provide a detailed analysis based on keyword matching, relevance, and formatting.

            **Job Description:**
            ${jobDescription}

            **Resume:**
            ${resumeText}

            Please return your analysis in a JSON object with the specified schema. The score should be an integer between 0 and 100.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation
        if (typeof parsedJson.score !== 'number' || !Array.isArray(parsedJson.matchingKeywords)) {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedJson as ATSAnalysis;

    } catch (error) {
        console.error("Error analyzing resume with Gemini API:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for more details.");
    }
};

export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content with Gemini API:", error);
        throw new Error("Failed to generate content from AI.");
    }
};
