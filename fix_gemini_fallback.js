const fs = require('fs');

const file = 'src/chatbot/bot-modules.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Ensure generateDirectGeminiResponse is used instead of generateGeminiResponse in the fallback handler
content = content.replace(/generateGeminiResponse\(message, botName, botContext, chatHistoryForGemini \|\| \[\]\)/g, 'generateDirectGeminiResponse(message, botName, botContext, chatHistoryForGemini || [])');

// 2. Modify the catch blocks of the API calls to return USE_GEMINI_FALLBACK instead of throwing a generic error
const catchPatternAdmin = /catch \((error)\) \{\s*console\.error\('API Error:', \1\);\s*return `Sorry, I encountered an error: \$\{\1\.message\}\. Please try again later\.`;\s*\}/g;
content = content.replace(catchPatternAdmin, `catch (error) {
            console.error('API Error:', error);
            return "USE_GEMINI_FALLBACK";
        }`);

// 3. Update cleanAPIResponse to be more robust in catching backend errors
const cleanAPIIntercept = `// Intercept backend database tool connection errors for the demo
        const lowerCleaned = cleaned.toLowerCase();
        if (lowerCleaned.includes("apologize") && (lowerCleaned.includes("database tools") || lowerCleaned.includes("server right now") || lowerCleaned.includes("trouble connecting"))) {
            return "USE_GEMINI_FALLBACK";
        }`;

// Replace the old intercept logic
content = content.replace(/\/\/ Intercept backend database tool connection errors for the demo[\s\S]*?return "USE_GEMINI_FALLBACK";\s*\}/, cleanAPIIntercept);

fs.writeFileSync(file, content);
console.log('Fixed Gemini fallback logic in bot-modules.js');
