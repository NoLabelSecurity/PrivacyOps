import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  summary: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedAction: string;
}

export async function analyzePrivacyRequest(requestData: any): Promise<AnalysisResult> {
  const prompt = `
    Analyze this privacy request and provide a professional assessment.
    Request Data: ${JSON.stringify(requestData)}
    
    Format your response as JSON with these keys: 
    - summary (string)
    - riskLevel (one of: LOW, MEDIUM, HIGH)
    - recommendedAction (string)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            riskLevel: { 
              type: Type.STRING,
              enum: ['LOW', 'MEDIUM', 'HIGH']
            },
            recommendedAction: { type: Type.STRING }
          },
          required: ['summary', 'riskLevel', 'recommendedAction']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      summary: result.summary || 'Unable to generate summary.',
      riskLevel: result.riskLevel || 'MEDIUM',
      recommendedAction: result.recommendedAction || 'Monitor request state.'
    };
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return {
      summary: 'Analysis engine offline.',
      riskLevel: 'MEDIUM',
      recommendedAction: 'Perform manual review.'
    };
  }
}
