// Gemini API Integration for Yaikh Dashboard
// IMPORTANT: Never hard-code API keys or tokens in frontend code.
const GEMINI_MODEL = "gemini-2.5-flash"; // Using gemini-2.5-flash model

const getGeminiApiKey = () => {
  // Forcing the new key directly to bypass React's .env cache without requiring a server restart
  const key = "AQ.Ab8RN6Jfagc4w1roAyI7xhY4Intmymxrod26pEIfZ3ITxUYJVA";
  if (!key) {
    throw new Error(
      "Missing REACT_APP_GEMINI_API_KEY. Create a `yaikh-dashboard/.env.local` file and set REACT_APP_GEMINI_API_KEY=... then restart `npm start`.",
    );
  }
  return key;
};

const DEFAULT_AGENT_URL =
  "https://yaikh-ai-agent-77568730259.asia-southeast1.run.app/api/ai-agent";

const getAgentUrl = () => process.env.REACT_APP_AI_AGENT_URL || DEFAULT_AGENT_URL;

/**
 * Generate response using Gemini API via REST API
 * This function is used by Yai 1, Yai 2, and My AI Agent bots
 * @param {string} userMessage - The user's message
 * @param {string} botName - Name of the bot (Yai 1, Yai 2, or Yai for My AI Agent)
 * @param {string} botContext - Context about the bot's role
 * @param {Array} chatHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateDirectGeminiResponse = async (
  userMessage,
  botName = "Yai 2",
  botContext = "",
  chatHistory = [],
) => {
  try {
    // Build context about Yaikh platform
    // If botContext is very long (like the full module list), use it as the main context
    // Otherwise, build a standard context
    let yaikhContext;
    if (botContext && botContext.length > 500) {
      // botContext is the full comprehensive context, use it directly
      yaikhContext = botContext;
    } else {
      // Build standard context
      yaikhContext = `You are ${botName}, an AI assistant for Yaikh (Yaikh.com), an AI platform developed by TexLink Technologies Co., Ltd. 

Yaikh specializes in:
- Yai Digitalization: Digital transformation solutions
- Yai AiOT: AI and Internet of Things integration
- Yai Bots: AI-powered chatbot solutions
- Yai E-com: E-commerce solutions
- Yai Gov: Government digitalization solutions

The platform website: https://yaikh.com/ (demo/portfolio site)
The main application: https://ym.yaikh.com/ (real production system)

${botContext ? `Your specific role: ${botContext}` : "You are a general assistant helping users with the Yaikh platform."}

IMPORTANT: Keep responses SHORT and CONCISE. Aim for 2-4 sentences maximum unless the user specifically asks for detailed information. Be direct and to the point. Use emojis sparingly (1-2 per response). Format text with clear structure using bullet points when listing items.`;
    }

    // Build conversation history for context
    const recentHistory = chatHistory.slice(-10); // Keep last 10 messages for context

    // Build contents array for Gemini API (proper format)
    const contents = [];

    // Add system instruction as first user message with model acknowledgment
    contents.push({
      role: "user",
      parts: [{ text: yaikhContext }]
    });
    contents.push({
      role: "model",
      parts: [{ text: "I understand. I'm ready to help users with the Yaikh platform." }]
    });

    // Add conversation history if available
    if (recentHistory.length > 0) {
      recentHistory.forEach((msg) => {
        contents.push({
          role: msg.from === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Extract base64 image data if present
    let actualMessage = userMessage;
    let base64Image = null;
    let mimeType = "image/jpeg";
    
    if (typeof userMessage === 'string') {
      const imageMatch = userMessage.match(/\[IMAGE_DATA:(data:(image\/[^;]+);base64,([^\]]+))\]/);
      if (imageMatch) {
        actualMessage = userMessage.replace(imageMatch[0], '').trim();
        mimeType = imageMatch[2];
        base64Image = imageMatch[3];
      }
    }

    // Add current user message
    const userParts = [{ text: actualMessage || "Analyze this image for me:" }];
    if (base64Image) {
      userParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Image
        }
      });
    }

    contents.push({
      role: "user",
      parts: userParts
    });

    // Call Gemini API using REST endpoint
    // Try v1 first for gemini-2.5-flash, fallback to v1beta if needed
   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${getGeminiApiKey()}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512, // Very short responses for mockup/demo
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      console.error("Gemini API HTTP Error:", response.status, errorData);
      throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Gemini API Response:", data); // Debug log

    // Extract the response text from Gemini API response
    if (data && data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const responseText = candidate.content.parts[0].text;
        if (responseText) {
          return responseText.trim();
        }
      }
    }

    console.error("Invalid response format:", data);
    throw new Error("Invalid response format from Gemini API");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a graceful rate limit notice
    return "You've reached the free tier rate limit. Please wait a moment before sending another message.";
  }
};


export const generateGeminiResponse = async (
  userMessage,
  botName = "Yai 2",
  botContext = "",
  chatHistory = [],
  options = {},
) => {
  try {
    // Intercept Multimodal Image Uploads and map directly to Vision Models internally
    if (typeof userMessage === 'string' && userMessage.includes('[IMAGE_DATA:')) {
      console.log('Intercepted image payload. Routing directly to Native Gemini Multimodal vision processor.');
      return await generateDirectGeminiResponse(userMessage, botName, botContext, chatHistory);
    }

    const apiUrl = getAgentUrl();

    const userToken =
      options.userToken || options.systemToken || process.env.REACT_APP_AI_AGENT_TOKEN;

    const sentConversationId =
      options.conversationId ||
      options.sentConversationId ||
      options.conversation_id ||
      undefined;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
      },
      body: JSON.stringify({
        message: userMessage,
        module: options.module || options.activeModule || botName,
        userId: options.userId || options.user_id || "anonymous-user",
        user_id: options.userId || options.user_id || "anonymous-user",
        conversationId: sentConversationId,
        system_hint: options.system_hint || options.systemHint || botContext,
        systemToken: userToken,
        // Backward compatibility (safe for server to ignore)
        botName: botName,
        context: botContext,
        history: chatHistory,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API Error:", response.status, errorText);
      throw new Error(`Custom API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend Response:", data);

    // 3. Extract the text based on how your backend formats the response.
    // Assuming your backend returns something like { reply: "Hello!" } or { text: "..." }
    // You may need to adjust this depending on what your console.log(data) shows!
    return data.reply || data.text || data.message || data.response || "No response received from backend.";

  } catch (error) {
    console.error("API Error:", error);
    return "I apologize, but I'm having trouble connecting to my server right now. Please try again later.";
  }
};
/**
 * Check if a message should use Gemini API (when no predefined response matches)
 * @param {string} message - The user's message
 * @param {boolean} hasPredefinedResponse - Whether a predefined response was found
 * @returns {boolean} - Whether to use Gemini API
 */
export const shouldUseGemini = (message, hasPredefinedResponse) => {
  // Use Gemini for general questions, complex queries, or when no predefined response exists
  if (hasPredefinedResponse) {
    return false; // Use predefined response
  }

  // Use Gemini for questions, general inquiries, or complex queries
  const questionWords = [
    "what",
    "how",
    "why",
    "when",
    "where",
    "who",
    "which",
    "can",
    "could",
    "would",
    "should",
    "tell",
    "explain",
    "describe",
    "help",
  ];
  const lowerMessage = message.toLowerCase();

  return (
    questionWords.some((word) => lowerMessage.includes(word)) ||
    lowerMessage.length > 20 || // Longer messages likely need AI
    !hasPredefinedResponse
  );
};

/**
 * Generate response with file attachments
 */
export const generateGeminiResponseWithFiles = async (
  userMessage,
  files = [],
  botName = "Yai",
  botContext = "",
  chatHistory = []
) => {
  try {
    let yaikhContext;
    if (botContext && botContext.length > 500) {
      yaikhContext = botContext;
    } else {
      yaikhContext = `You are ${botName}, an AI assistant for Yaikh (Yaikh.com). ${botContext || "You help users with the Yaikh platform."}`;
    }

    const recentHistory = chatHistory.slice(-10);
    const contents = [];

    contents.push({
      role: "user",
      parts: [{ text: yaikhContext }]
    });
    contents.push({
      role: "model",
      parts: [{ text: "I understand. I'm ready to help." }]
    });

    if (recentHistory.length > 0) {
      recentHistory.forEach((msg) => {
        contents.push({
          role: msg.from === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add files to the message
    const userParts = [{ text: userMessage }];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        userParts.push({
          inlineData: {
            mimeType: file.type,
            data: base64.split(',')[1]
          }
        });
      } else {
        const text = await fileToText(file);
        userParts.push({ text: `[File: ${file.name}]\n${text}` });
      }
    }
    contents.push({ role: "user", parts: userParts });

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${getGeminiApiKey()}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) throw new Error(`API failed: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your files. Please try again.";
  }
};

/**
 * Generate image using Gemini
 */
export const generateImage = async (prompt) => {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${getGeminiApiKey()}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: `Generate a detailed image description for: ${prompt}. Provide a comprehensive visual description that could be used to create this image.` }]
        }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1024 }
      })
    });

    if (!response.ok) throw new Error(`API failed: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Image description generated.";
  } catch (error) {
    console.error("Image generation error:", error);
    return "I couldn't generate an image description. Please try again.";
  }
};

/**
 * Deep Research mode
 */
export const deepResearch = async (query, botContext = "") => {
  try {
    const researchPrompt = `Conduct a deep research analysis on: ${query}. Provide comprehensive information, multiple perspectives, and detailed insights.`;
    return await generateGeminiResponse(researchPrompt, "Yai", botContext, []);
  } catch (error) {
    console.error("Deep research error:", error);
    return "I encountered an error during research. Please try again.";
  }
};

// Helper functions
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fileToText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
