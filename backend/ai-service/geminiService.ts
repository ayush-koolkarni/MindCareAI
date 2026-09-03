// geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@env';

// Make sure GEMINI_API_KEY is not undefined
if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not defined in your environment variables. Using fallback mode if needed.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_INSTRUCTION = `You are Elevana AI, a trauma-informed, deeply empathetic, and safe companion for individuals and survivors recovering from psychological distress, violent crimes, domestic abuse, sexual assault, harassment, witness intimidation, and atrocities.
Your mission:
1. Provide gentle emotional validation, psychological de-escalation, grounding exercises (like 4-7-8 breathing, 5-4-3-2-1 somatic anchoring), and compassionate listening.
2. Provide practical literacy when helpful: mention statutory rights, zero-FIR filing, victim protection orders, DLSA free legal aid, and victim compensation schemes.
3. If the user mentions active physical danger, hostile individuals pursuing them, or self-harm/suicidal feelings, prioritize safety and reassure them that immediate help is available (Emergency 112, Mental Health Helpline 14416, NHAA 14566).
4. Always respond in the language specified by the user (English, Hindi, Marathi, Kannada, Tamil, Telugu, or Bengali) with a soothing, supportive, and non-judgmental tone.`;

export const generateGeminiResponse = async (
  prompt: string,
  category: string = "Default - General Trauma & Crisis Support",
  language: string = "English"
): Promise<string> => {
  try {
    if (!genAI) {
      return getLocalFallbackResponse(prompt, category, language);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const contextualPrompt = `[Support Context: ${category}] [Language: ${language}]\nUser Message: ${prompt}\n\nPlease respond in ${language} with empathetic validation, grounding support, and clear guidance.`;

    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    return getLocalFallbackResponse(prompt, category, language);
  }
};

const getLocalFallbackResponse = (prompt: string, category: string, language: string): string => {
  const lower = prompt.toLowerCase();
  
  if (language === 'Hindi' || language === 'हिंदी') {
    if (lower.includes('threat') || lower.includes('डर') || lower.includes('धमकी') || lower.includes('खतरा')) {
      return "मैं आपकी चिंता पूरी तरह समझ सकता हूँ। आपकी सुरक्षा सबसे महत्वपूर्ण है। आप तत्काल पुलिस सुरक्षा पाने के कानूनी रूप से हकदार हैं। यदि कोई तात्कालिक खतरा है, तो कृपया तुरंत आपातकालीन नंबर 112 या हेल्पलाइन 14566 पर संपर्क करें। आप अकेले नहीं हैं। ❤️";
    }
    return "नमस्ते! मैं एलेवाना एआई (Elevana AI) हूँ। मैं इस कठिन समय में आपके मानसिक स्वास्थ्य, आत्म-संभाल और मार्गदर्शन के लिए यहाँ उपस्थित हूँ। कृपया मुझे बताएं कि आप कैसा महसूस कर रहे हैं।";
  }

  if (language === 'Marathi' || language === 'मराठी') {
    if (lower.includes('threat') || lower.includes('भीती') || lower.includes('धमकी') || lower.includes('त्रास')) {
      return "मी तुमची चिंता समजू शकतो. तुमची सुरक्षा ही सर्वोच्च प्राथमिकता आहे. कोणत्याही तात्काळ संकटात त्वरित 112 किंवा हेल्पलाइन 14566 वर संपर्क करा. आम्ही तुमच्या सोबत आहोत. ❤️";
    }
    return "नमस्कार! मी एलेव्हाना एआय (Elevana AI) आहे. कठीण प्रसंगातून सावरण्यासाठी आणि मानसिक आधारासाठी मी इथे आहे. तुम्हाला कशाची मदत हवी आहे ते मोकळेपणाने सांगा.";
  }

  if (lower.includes('court') || lower.includes('trial') || lower.includes('lawyer') || lower.includes('hearing')) {
    return "It is completely natural to feel overwhelmed about legal proceedings and hearings. Remember that you have the right to free legal aid from DLSA, protective escorts, and confidential testimony options. Take three slow, deep breaths with me—you have tremendous resilience.";
  }

  if (lower.includes('threat') || lower.includes('intimidat') || lower.includes('scared') || lower.includes('fear') || lower.includes('follow')) {
    return "Your safety is our absolute priority. If you are experiencing threats or feeling unsafe, please know that you are legally entitled to immediate police protection. You can log an alert via our 'Professional Support' tab or call 112 / 14566 right now. We are standing with you.";
  }

  if (lower.includes('panic') || lower.includes('anxiety') || lower.includes('flashback') || lower.includes('crying')) {
    return "I hear you, and you are in a safe place right now ❤️ Let's ground ourselves together: feel both feet flat on the floor, inhale slowly through your nose for 4 counts, hold gently for 7 counts, and exhale completely for 8 counts. You are safe here.";
  }

  return "I hear you, and I am here beside you ❤️ Navigating difficult emotional moments takes immense strength. You are worthy of care, dignity, and peace. What is on your mind right now?";
};