import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Creating Notes from Prompt => /api/v1/notes
export const createNotes = catchAsyncErrors(async (req, res, next) => {
  console.log("test")
  console.log("Api",process.env.GEMINI_API_KEY)
  let { messages, prompt } = req.body;

  // Convert prompt to messages if needed
  if (!messages && prompt) {
    if (Array.isArray(prompt)) {
      messages = prompt.map((p) => ({ role: "user", content: p }));
    } else {
      messages = [{ role: "user", content: prompt }];
    }
  }

  if (!messages || !Array.isArray(messages)) {
    return next(new ErrorHandler("Please send messages array or prompt", 400));
  }

  // Convert into Gemini-friendly "contents" format
  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  let response;
  try {
    response = await ai.models.generateContent({
      // model: "gemini-2.0-flash-001",
      model: "gemini-2.5-flash",
      contents,
    });
  } catch (err) {
    console.error("Gemini API Error:", err);

    // ✅ Detect quota exceeded
    if (err?.message?.includes("RESOURCE_EXHAUSTED") || err?.code === 429) {
      return res.status(429).json({
        message: "Quota exceeded. Please retry later or upgrade your plan.",
        details: err?.response?.data || err.message,
      });
    }

    // Network errors
    if (
      err.code === "ENOTFOUND" ||
      err.code === "ECONNREFUSED" ||
      (err.message && err.message.toLowerCase().includes("fetch"))
    ) {
      return next(new ErrorHandler("Network error – check your connection", 503));
    }

    // Fallback for other errors
    return next(new ErrorHandler(err.message || "Something went wrong", 500));
  }

  // Extract text safely
  const notes = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return res.status(200).json({
    success: true,
    result: notes,
  });
});
