import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { documentText, question, history } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "dummy-key") {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        const systemInstruction = "You are Doc2Action Assistant. Answer the user's question directly, accurately, and concisely based ONLY on the analyzed document provided below.\nIf the information is not present in the document, reply EXACTLY with: \"This is not specified in the document.\"\nDo not hallucinate or guess.\n\nDocument Content:\n" + (documentText?.slice(0, 50000) || "No document provided.");

        const contents = [];
        
        if (history && history.length > 0) {
           for (const h of history) {
             contents.push({
               role: h.role === "assistant" ? "model" : "user",
               parts: [{ text: h.content }]
             });
           }
        }
        
        contents.push({
          role: "user",
          parts: [{ text: question }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.1
          }
        });

        const answer = response.text;
        
        if (answer) {
          return NextResponse.json({ success: true, answer, source: "ai" });
        }
      } catch (e) {
        console.warn("AI Chat API failed, using fallback answer generator:", e);
      }
    }

    const qLower = question.toLowerCase();
    let answer = "This is not specified in the document.";
    
    return NextResponse.json({ success: true, answer, source: "mock" });

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to answer question: " + errMessage }, { status: 500 });
  }
}

