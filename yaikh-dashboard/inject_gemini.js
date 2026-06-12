const fs = require('fs');

const file = 'src/chatbot/bot-modules.js';
let content = fs.readFileSync(file, 'utf8');

// The replacement logic:
// When an API call is made and it returns apiResponse, we want to intercept "USE_GEMINI_FALLBACK"
// and call generateGeminiResponse instead.

const replacement = `.then(apiResponse => {
                    if (apiResponse === "USE_GEMINI_FALLBACK") {
                        const botName = PREDEFINED_BOTS.find(b => b.id === botId)?.name || botId;
                        const botContext = \`You are \${botName}, an AI assistant for the \${moduleToUse || 'general'} module. The user is running a demo and clicking on suggested prompts. Generate a realistic, helpful, and naturally phrased mock/demo response based on their query. Include some realistic fake statistics or data if appropriate for the query.\`;
                        
                        // We need chatHistoryForGemini which was populated right before the API call
                        generateGeminiResponse(message, botName, botContext, chatHistoryForGemini || [])
                            .then(geminiResp => streamBotResponse(botId, geminiResp))
                            .catch(err => {
                                console.error('Gemini fallback failed:', err);
                                streamBotResponse(botId, "Here is a sample answer for your demo: The current data shows 1,245 processed items.");
                            });
                    } else {
                        streamBotResponse(botId, apiResponse);
                    }
                })`;

// Admin PA
content = content.replace(/\.then\(apiResponse\s*=>\s*\{\s*streamBotResponse\(botId,\s*apiResponse\);\s*\}\)/g, replacement);

fs.writeFileSync(file, content);
console.log('Updated API calls in bot-modules.js');
