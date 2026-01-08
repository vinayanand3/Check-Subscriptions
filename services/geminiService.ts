import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisSettings } from "../types";
import { fileToBase64, readFileAsText } from "../utils";

const MODEL_NAME = "gemini-3-flash-preview";

export const analyzeBankStatements = async (files: File[], settings: AnalysisSettings): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Separate processing for visual docs (PDF/Images) and text docs (CSV/TXT)
    const contentParts = [];

    for (const file of files) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        contentParts.push({
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        });
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.type === 'text/plain') {
        const textContent = await readFileAsText(file);
        contentParts.push({
          text: `\n--- START OF FILE: ${file.name} ---\n${textContent}\n--- END OF FILE ---\n`
        });
      }
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const promptText = `
      You are an expert financial analyst. Analyze the provided bank statements.
      Today's date is ${currentDate}.
      
      User Settings & Rules:
      - Include specific transactions matching these keywords (force as subscription): ${JSON.stringify(settings.includeKeywords)}
      - Exclude transactions matching these keywords (ignore even if they look like subs): ${JSON.stringify(settings.excludeKeywords)}

      Your tasks:
      1. Identify all ACTIVE subscriptions. Look for recurring payments to services like Netflix, Spotify, AWS, Gyms, SaaS products, Utilities. 
      2. Apply the user's Include/Exclude rules strictly.
      3. For each subscription, identify the LAST payment date.
      4. CALCULATE the NEXT payment date based on the frequency and the last payment date. If the last payment was a long time ago but the subscription is active, project the next payment to the future relative to Today's Date (${currentDate}).
      5. Calculate monthly expenditure statistics.
      6. Categorize spending (Entertainment, Software, Utilities, Food, Shopping, etc.).
      7. Provide a financial summary.

      Return the data strictly in the following JSON structure.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          ...contentParts,
          { text: promptText }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subscriptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                  frequency: { type: Type.STRING, enum: ["Monthly", "Yearly", "Weekly", "Unknown"] },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  lastPaymentDate: { type: Type.STRING, description: "YYYY-MM-DD" },
                  nextPaymentDate: { type: Type.STRING, description: "YYYY-MM-DD" }
                },
                required: ["name", "amount", "currency", "frequency", "category"]
              }
            },
            monthlyStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  totalSpend: { type: Type.NUMBER },
                  subscriptionSpend: { type: Type.NUMBER }
                },
                required: ["month", "totalSpend", "subscriptionSpend"]
              }
            },
            categoryStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["name", "value"]
              }
            },
            totalActiveSubscriptions: { type: Type.NUMBER },
            totalMonthlySubscriptionCost: { type: Type.NUMBER },
            financialSummary: { type: Type.STRING }
          },
          required: ["subscriptions", "monthlyStats", "categoryStats", "totalActiveSubscriptions", "totalMonthlySubscriptionCost", "financialSummary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");

    const parsedData = JSON.parse(text);

    // Add colors
    const colors = [
      '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'
    ];
    
    parsedData.categoryStats = parsedData.categoryStats.map((stat: any, index: number) => ({
      ...stat,
      color: colors[index % colors.length]
    }));

    return parsedData as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing bank statements:", error);
    throw error;
  }
};