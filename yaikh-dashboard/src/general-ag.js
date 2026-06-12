import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Sparkles,
  Plus,
  Menu,
  Trash2,
  Mic,
  Image as ImageIcon,
  FileText,
  Search,
  Zap,
  BookOpen,
  Palette,
  Settings,
  ChevronDown,
  Paperclip,
  HardDrive,
  Camera,
  Notebook,
} from "lucide-react";
import {
  generateGeminiResponse,
  generateGeminiResponseWithFiles,
  generateImage,
  deepResearch,
} from "./chatbot/gemini-api";
import { DASHBOARD_DATA } from "./data/module";
import { KHMER_NEW_YEAR } from "./thems";

const GeneralAIAgent = ({ onClose, moduleContext = null }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [responseSpeed, setResponseSpeed] = useState("fast");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Generate module-specific suggestions
  const getSuggestions = () => {
    if (!moduleContext) {
      return [
        {
          text: "Tell me about Digital Audit",
          question: "Tell me about the Digital Audit module and its features.",
        },
        {
          text: "How to use Purchase Request?",
          question: "How do I use the Purchase Request module?",
        },
        {
          text: "Track Energy and Water",
          question: "How can I track Energy and Water consumption in Yaikh?",
        },
        {
          text: "Account, HR & Salary Info",
          question:
            "What information can I find in the Accountant, HR, and Salary Bill modules?",
        },
        {
          text: "Support Ticket & Y Shop",
          question: "How do I create a Support Ticket or use the Y Shop?",
        },
        {
          text: "Air, Waste & Chemical",
          question:
            "Tell me about Air, Waste, and Chemical management modules.",
        },
      ];
    }

    const context = moduleContext.toLowerCase();

    // ACCOUNTANT module suggestions
    if (context === "accountant") {
      return [
        {
          text: "What is ACCOUNTANT module?",
          question: "What is the ACCOUNTANT module and what does it do?",
        },
        {
          text: "What are the sub-modules?",
          question: "What are the sub-modules in ACCOUNTANT module?",
        },
        {
          text: "How to verify PR?",
          question: "How do I verify purchase requests in ACCOUNTANT module?",
        },
      ];
    }

    // Verify PR suggestions
    if (context.includes("verify pr") || context === "verify pr") {
      return [
        {
          text: "What is Verify PR?",
          question: "What is Verify PR and how does it work?",
        },
        {
          text: "How to verify requests?",
          question: "How do I verify purchase requests in Verify PR?",
        },
        {
          text: "What can I check?",
          question:
            "What information can I check when verifying purchase requests?",
        },
      ];
    }

    // Approval PR suggestions
    if (context.includes("approval pr") || context === "approval pr") {
      return [
        {
          text: "What is Approval PR?",
          question: "What is Approval PR and how does it work?",
        },
        {
          text: "How to approve requests?",
          question: "How do I approve purchase requests in Approval PR?",
        },
        {
          text: "What is the approval process?",
          question: "What is the approval process for purchase requests?",
        },
      ];
    }

    // Pay PR suggestions
    if (context.includes("pay pr") || context === "pay pr") {
      return [
        {
          text: "What is Pay PR?",
          question: "What is Pay PR and how does it work?",
        },
        {
          text: "How to pay requests?",
          question:
            "How do I process payments for purchase requests in Pay PR?",
        },
        {
          text: "What is the payment process?",
          question:
            "What is the payment process for approved purchase requests?",
        },
      ];
    }

    // TB Monthly Yearly suggestions
    if (context.includes("tb monthly") || context.includes("tb yearly")) {
      return [
        {
          text: "What is TB Monthly Yearly?",
          question: "What is TB Monthly Yearly and how does it work?",
        },
        {
          text: "How to view reports?",
          question: "How do I view monthly and yearly trial balance reports?",
        },
        {
          text: "What reports are available?",
          question:
            "What trial balance reports are available in TB Monthly Yearly?",
        },
      ];
    }

    // TOI suggestions
    if (context === "toi") {
      return [
        {
          text: "What is TOI?",
          question:
            "What is TOI (Transfer of Information) and how does it work?",
        },
        {
          text: "How to transfer data?",
          question: "How do I transfer information using TOI?",
        },
        {
          text: "What is global connection?",
          question: "What is the global connection feature in TOI?",
        },
      ];
    }

    // Factory Accounting suggestions
    if (context.includes("factory accounting")) {
      return [
        {
          text: "What is Factory Accounting?",
          question: "What is Factory Accounting and how does it work?",
        },
        {
          text: "How to manage factory accounts?",
          question: "How do I manage factory-level accounting operations?",
        },
        {
          text: "What operations are available?",
          question:
            "What accounting operations are available in Factory Accounting?",
        },
      ];
    }

    // TAX Reporting suggestions
    if (context.includes("tax reporting")) {
      return [
        {
          text: "What is TAX Reporting?",
          question: "What is TAX Reporting and how does it work?",
        },
        {
          text: "How to generate tax reports?",
          question: "How do I generate tax reports in TAX Reporting?",
        },
        {
          text: "What reports are available?",
          question: "What tax reports are available in TAX Reporting?",
        },
      ];
    }

    // Default suggestions for any other module
    return [
      {
        text: `What is ${moduleContext}?`,
        question: `What is ${moduleContext} and how does it work?`,
      },
      {
        text: `How to use ${moduleContext}?`,
        question: `How do I use the ${moduleContext} module?`,
      },
      {
        text: `What features does it have?`,
        question: `What features are available in ${moduleContext}?`,
      },
    ];
  };

  // Chat history state
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("general-ai-agent-chat-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);

  // Scroll to bottom when messages change (only when not streaming, like Yai 1 bot)
  useEffect(() => {
    const isStreaming = messages.some((msg) => msg.isStreaming);
    if (!isStreaming && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("general-ai-agent-chat-history");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  // Update chat in history (defined early for use in useEffect)
  const updateChatInHistory = useCallback((chatId, newMessages) => {
    setChatHistory((prev) => {
      const updated = prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: newMessages,
              updatedAt: new Date().toISOString(),
            }
          : chat,
      );
      return updated;
    });
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(
        "general-ai-agent-chat-history",
        JSON.stringify(chatHistory),
      );
    }
  }, [chatHistory]);

  // Note: Chat history is saved during streaming completion, not on every message change
  // This prevents side effects during streaming (like Yai 1 bot)
  // Build context - focused for module-specific, comprehensive for general
  const buildYaikhContext = useCallback(() => {
    // If moduleContext is provided, build focused context like Yai 1 bot
    if (moduleContext) {
      // Map module names to bot names and descriptions
      const moduleToBotMap = {
        ACCOUNTANT: {
          botName: "Finance PA",
          description:
            "AI assistant for financial management, budgeting, and accounting. Handles ACCOUNTANT module including Verify PR, Approval PR, Pay PR, TB Monthly Yearly, TOI, Factory Accounting, and TAX Reporting.",
        },
        "Verify PR": {
          botName: "Finance PA",
          description:
            "AI assistant for Verify PR sub-module. Helps with checking and verifying purchase requests, reviewing details, invoices, and attached documents.",
        },
        "Approval PR": {
          botName: "Finance PA",
          description:
            "AI assistant for Approval PR sub-module. Helps with approving or rejecting purchase requests with status tracking.",
        },
        "Pay PR": {
          botName: "Finance PA",
          description:
            "AI assistant for Pay PR sub-module. Helps with processing payments for approved purchase requests.",
        },
        "PURCHASE REQUEST": {
          botName: "Admin PA",
          description:
            "AI assistant for Purchase Request module. Helps with creating and managing purchase requests, administrative operations, and related tasks.",
        },
        YHR: {
          botName: "HR PA",
          description:
            "AI assistant for YHR (Human Resources) module. Helps with recruitment, interview, onboarding, attendance, benefit profile, payroll, NSSF, visa and work permit, FWCMS, and canteen management.",
        },
        CE: {
          botName: "CE Assistant",
          description:
            "AI assistant for CE (Cost Engineering) module. Helps with standard time analysis, product development, garment analysis, productivity tracking, machine allocation, skill inventory, team performance, learning curves, downtimes, cost centers, CPM, and style costing.",
        },
        YTM: {
          botName: "YTM PA",
          description:
            "AI assistant for YTM (Yield to Maturity) module. Helps with machine location, setup and repair, routine maintenance, system setup, data management, TV displays, transfers, downloads, analysis, and reports.",
        },
        "Salary Bill": {
          botName: "HR PA",
          description:
            "AI assistant for Salary Bill module. Helps with monthly salary, weekly incentive, permit fee, and resign payment management.",
        },
      };

      const botInfo = moduleToBotMap[moduleContext] || {
        botName: moduleContext,
        description: `AI assistant for ${moduleContext} module. Helps users with ${moduleContext} related tasks and questions.`,
      };

      // Build focused context (under 500 chars to use simpler format, but still informative)
      return `You are ${botInfo.botName}, an AI assistant for Yaikh (Yaikh.com), an AI platform developed by TexLink Technologies Co., Ltd. 

Yaikh specializes in:
- Yai Digitalization: Digital transformation solutions
- Yai AiOT: AI and Internet of Things integration
- Yai Bots: AI-powered chatbot solutions
- Yai E-com: E-commerce solutions
- Yai Gov: Government digitalization solutions

The platform website: https://yaikh.com/ (demo/portfolio site)
The main application: https://ym.yaikh.com/ (real production system)

Your specific role: ${botInfo.description}

IMPORTANT: 
- Provide helpful, accurate, and comprehensive information about ${moduleContext}
- Be professional yet friendly and conversational
- Format text with clear structure using bullet points or numbered lists when appropriate
- If you don't know something specific about the module, offer to help with general Yaikh navigation`;
    }

    // General context (comprehensive for general queries)
    let context = `You are Yai, a general AI assistant for Yaikh (Yaikh.com), an AI platform developed by TexLink Technologies Co., Ltd.

Yaikh Platform Information:
- Website: https://yaikh.com/ (demo/portfolio site)
- Main Application: https://ym.yaikh.com/ (real production system)
- Company: TexLink Technologies Co., Ltd.
- Location: Phnom Penh, Cambodia
- Contact: [email protected], +855 96 575 4574

Yaikh Specializations:
- Yai Digitalization: Digital transformation solutions
- Yai AiOT: AI and Internet of Things integration
- Yai Bots: AI-powered chatbot solutions
- Yai E-com: E-commerce solutions
- Yai Gov: Government digitalization solutions

Available Modules in Yaikh Dashboard:
`;

    // Extract all modules from DASHBOARD_DATA with detailed sub-modules
    DASHBOARD_DATA.forEach((section) => {
      context += `${section.title.toUpperCase()}:\n`;
      section.groups?.forEach((group) => {
        context += `  ${group.title}:\n`;
        group.modules?.forEach((module) => {
          context += `    - ${module.title}${module.sub ? ` (${module.sub})` : ""}\n`;

          // Add sub-modules for specific modules
          if (module.id === "pr-module" || module.title === "Accountant") {
            context += `      Sub-modules: Verify PR, Approval PR, Pay PR, TB Monthly Yearly, TOI, Factory Accounting, TAX Reporting\n`;
          }
        });
      });
      context += "\n";
    });

    context += `DETAILED MODULE INFORMATION:

ACCOUNTANT Module (Finance PA):
- Verify PR: Check and verify purchase requests, review details, invoices, and attached documents
- Approval PR: Approve or reject purchase requests with status tracking
- Pay PR: Process payments for approved purchase requests
- TB Monthly Yearly: Trial Balance reports for monthly and yearly accounting periods
- TOI: Transfer of Information - global connection and data transfer
- Factory Accounting: Factory-level accounting operations and calculations
- TAX Reporting: Tax reports and compliance documentation

ADMIN Module (Admin PA):
- Purchase Request: Create and manage purchase requests
- Y Shop: Stationery and office supplies shopping
- Support Ticket: Create and track support tickets
- Bill Record: Record and manage bills
- Gate Pass: Manage visitor and vehicle gate passes
- Meeting Room: Book and manage meeting rooms
- My Car Booking: Book company vehicles
- Fire Alarm: Fire alarm system monitoring
- CCTV: Security camera and face scan management

HR Module (HR PA):
- YHR: Human resources management system
  Sub-modules: Recruitment, Interview, Onboarding, Attendant, Benefit Profile, Payroll, NSSF, Visa and Work Permit, FWCMS, Canteen
- Salary Bill: Salary and payment management
- Org Chart: Organizational chart visualization
- Training: Department-based training programs
- Temp Work Request: Temporary worker requests
- Speak Up: Employee feedback and communication

CSR Module (CSR PA):
- Digital Audit: Audit management with sub-modules: Audit Plan, Digital Audit, Compliance Certificate, Checklist 6s
- Energy: Energy monitoring with Meters, Solar Dashboard, Switch Board monitoring, Energy Source
- Air: Air quality monitoring
- Water: Water consumption tracking (In/Out)
- Waste: Waste management and Boiler monitoring
- Chemical: Chemical management

QA Module (QMS PA):
- YQMS: Quality management system
- Call Out: Quality call-out management

Operations Module (PPC PA, Production PA):
- Internal Logistics: Material and inventory management
- Production: Production planning and control
- PPC: Production planning with Master Plan, Line Plan
- YTPM: Total productive maintenance
- YTM Shop: Maintenance shop management
- DT Sync: Data synchronization
- PPM: Production planning management
- TEC PACK: Technical packaging
- PPS: Production planning system
- Sample: Sample management
- Material Purchase: Material purchasing

AI Assistant Bots:
- Finance PA: Handles ACCOUNTANT module (Verify PR, Approval PR, Pay PR, TB Monthly Yearly, TOI, Factory Accounting, TAX Reporting), E-Invoicing, financial management, budgeting, purchase requests, invoices, payments
- Admin PA: Handles ADMIN module (Purchase Request, Y Shop, Support Ticket, Bill Record, Gate Pass, Meeting Room, My Car Booking, Fire Alarm, CCTV), administrative operations, support tickets, car fuel tracking, security issues
- HR PA: Handles HR module (YHR with all sub-modules, Salary Bill, Org Chart, Training, Temp Work Request, Speak Up), recruitment, payroll, attendance, benefits
- CSR PA: Handles CSR module (Digital Audit, Energy, Air, Water, Waste, Chemical), corporate social responsibility, induction training, 6S reports, compliance certificates, audit checklists
- QMS PA: Handles QA module (YQMS, Call Out), quality management, defect inspections, third-party audits, buyer visits
- PPC PA: Handles production planning (Master Plan, Line Plan, PPM, PPS), order status, delay alerts, action items, supplier alerts
- Production PA: Handles production operations, scheduling, inventory tracking, workflow optimization, quality metrics monitoring
- Sale PA: Sales order management, buyer communications, quotations, email management, customer factory visits
- Social PA: Social media management for TikTok, Facebook, YouTube, Instagram, LinkedIn
- YTM PA: Yield to maturity tracking, machine maintenance schedules, repair status, late maintenance alerts

You can answer questions about:
1. Any Yaikh modules and their functions
2. How to use the platform and navigate modules
3. General information and knowledge about any topic
4. Website-related questions about Yaikh
5. World information, current events, and general knowledge
6. Technical questions and explanations
7. Business and enterprise management topics
8. Any other questions users may have

RESPONSE FORMATTING RULES:
- Be helpful, comprehensive, and professional
- Use a natural, conversational tone
- Format text with clear structure using bullet points or numbered lists when appropriate
- Do not limit responses to 1-2 sentences; provide detailed answers when requested`;

    return context;
  }, [moduleContext]);

  // Create new chat
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
    setIsHistoryOpen(false);
  };

  // Load chat from history
  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setCurrentChatId(chatId);
      setIsHistoryOpen(false);
    }
  };

  // Delete chat from history
  const deleteChat = (chatId) => {
    setChatHistory((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
  };

  // Stream bot response token-by-token (exactly like Yai 1 bot - smooth ChatGPT-like streaming)
  const streamBotResponse = useCallback(
    (fullText) => {
      // Create initial bot message with empty text (exactly like Yai 1 bot)
      const initialMessage = {
        from: "bot",
        text: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      // Add the initial message to state (exactly like Yai 1 bot)
      setMessages((prev) => {
        // Remove any existing streaming bot messages to prevent duplicates
        const filtered = prev.filter(
          (msg) => !(msg.from === "bot" && msg.isStreaming),
        );
        return [...filtered, initialMessage];
      });
      setIsTyping(false); // Set to false like Yai 1 bot (typing indicator is handled by isStreaming)

      // Stream token-by-token like ChatGPT (tokens can be parts of words, whole words, or punctuation)
      // Split text into tokens (words, punctuation, spaces) for natural ChatGPT-like streaming
      const tokenize = (text) => {
        // Split by word boundaries, keeping punctuation and spaces
        const tokens = [];
        const regex = /(\S+|\s+)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          tokens.push(match[0]);
        }
        return tokens;
      };

      const tokens = tokenize(fullText);
      let currentText = "";
      let tokenIndex = 0;

      // For very long responses, batch more tokens for smoother display
      const totalTokens = tokens.length;
      const isVeryLong = totalTokens > 200;
      const isExtremelyLong = totalTokens > 500;
      // Batch more tokens for longer responses to reduce re-renders and choppiness
      const batchSize = isExtremelyLong ? 5 : isVeryLong ? 3 : 1;

      const streamNextToken = () => {
        if (tokenIndex >= tokens.length) {
          // Streaming complete
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (
              lastMessage &&
              lastMessage.from === "bot" &&
              lastMessage.isStreaming
            ) {
              updated[updated.length - 1] = {
                ...lastMessage,
                text: fullText,
                isStreaming: false,
                timestamp: new Date().toISOString(),
              };
            }

            // Save to chat history only after streaming completes (deferred to avoid blocking)
            setTimeout(() => {
              if (currentChatId) {
                updateChatInHistory(currentChatId, updated);
              } else {
                // Create new chat
                const newChat = {
                  id: Date.now().toString(),
                  title:
                    updated.length > 0 && updated[0].from === "user"
                      ? updated[0].text.slice(0, 50)
                      : "New Chat",
                  messages: updated,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                setChatHistory((prev) => [newChat, ...prev]);
                setCurrentChatId(newChat.id);
              }
            }, 0);

            return updated;
          });
          return;
        }

        // Add next token(s) - batch for very long responses (ChatGPT-like token streaming) - exactly like Yai 1 bot
        const tokensToAdd = Math.min(batchSize, tokens.length - tokenIndex);
        for (let i = 0; i < tokensToAdd; i++) {
          if (tokenIndex < tokens.length) {
            currentText += tokens[tokenIndex];
            tokenIndex++;
          }
        }

        // Calculate delay based on batch size and token type for smoother streaming
        const currentToken = tokens[tokenIndex - 1] || "";
        // Base delay adjusted for batch size - longer batches need less delay per token
        let delay = isExtremelyLong ? 8 : isVeryLong ? 10 : 10;

        // Faster for spaces/whitespace tokens
        if (/^\s+$/.test(currentToken)) {
          delay = isExtremelyLong ? 3 : 5;
        }
        // Slight pause at sentence endings (natural thinking pause)
        else if (/[.!?]\s*$/.test(currentToken)) {
          delay = isExtremelyLong ? 10 : isVeryLong ? 15 : 30;
        }
        // Minimal pause at commas and semicolons
        else if (/[,;]\s*$/.test(currentToken)) {
          delay = isExtremelyLong ? 5 : isVeryLong ? 8 : 15;
        }
        // Minimal pause for colons
        else if (/[:]\s*$/.test(currentToken)) {
          delay = isExtremelyLong ? 6 : isVeryLong ? 10 : 20;
        }
        // Slight pause at newlines
        else if (currentToken.includes("\n")) {
          delay = isExtremelyLong ? 6 : isVeryLong ? 10 : 25;
        }
        // Fast for regular word tokens - adjusted for batch size
        else {
          const tokenLength = currentToken.length;
          if (tokenLength <= 3) {
            delay = isExtremelyLong
              ? 3
              : isVeryLong
                ? 4
                : 5 + Math.random() * 5;
          } else if (tokenLength <= 8) {
            delay = isExtremelyLong
              ? 5
              : isVeryLong
                ? 6
                : 8 + Math.random() * 7;
          } else {
            delay = isExtremelyLong
              ? 8
              : isVeryLong
                ? 10
                : 12 + Math.random() * 8;
          }
        }

        // For very long responses, reduce delay further to maintain smooth flow
        if (isExtremelyLong) {
          delay = Math.max(2, delay * 0.6); // Reduce delay by 40% for extremely long responses
        } else if (isVeryLong) {
          delay = Math.max(3, delay * 0.7); // Reduce delay by 30% for very long responses
        }

        // Update the last message with current text (optimized with requestAnimationFrame for smooth rendering)
        requestAnimationFrame(() => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (
              lastMessage &&
              lastMessage.from === "bot" &&
              lastMessage.isStreaming
            ) {
              updated[updated.length - 1] = {
                ...lastMessage,
                text: currentText,
                isStreaming: true,
              };
            }
            return updated;
          });

          // Auto-scroll during streaming (silent, no animation, like Yai 1 bot)
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
              behavior: "auto",
              block: "nearest",
            });
          }
        });

        // Schedule next token
        setTimeout(streamNextToken, delay);
      };

      // Start streaming token by token immediately (ChatGPT-like instant start) - exactly like Yai 1 bot
      setTimeout(streamNextToken, 0);
    },
    [currentChatId, updateChatInHistory],
  );
  // Handle send message with enhanced features (tools, files, etc.)
  const handleSend = useCallback(
    async (manualMessage = null) => {
      const messageToSubmit = manualMessage || input.trim();
      if ((!messageToSubmit && attachedFiles.length === 0) || isTyping) return;

      const userMessage = messageToSubmit || "Analyze the attached files";
      setInput("");

      const newUserMessage = {
        from: "user",
        text: userMessage,
        timestamp: new Date().toISOString(),
        files: attachedFiles.length > 0 ? attachedFiles.map((f) => f.name) : [],
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsTyping(true);

      setTimeout(async () => {
        try {
          setMessages((currentMessages) => {
            const yaikhContext = buildYaikhContext();
            const chatHistoryForGemini = currentMessages
              .filter((msg) => msg.text && msg.text.trim())
              .map((msg) => ({
                from: msg.from === "user" ? "user" : "bot",
                text: msg.text,
              }));

            let responsePromise;

            // Handle different tools
            if (selectedTool === "deep-research") {
              responsePromise = deepResearch(userMessage, yaikhContext);
            } else if (selectedTool === "create-images") {
              responsePromise = generateImage(userMessage);
            } else if (attachedFiles.length > 0) {
              responsePromise = generateGeminiResponseWithFiles(
                userMessage,
                attachedFiles,
                "Yai",
                yaikhContext,
                chatHistoryForGemini,
              );
            } else {
              // Determine bot name based on module context (like Yai 1 bot)
              let botName = "Yai";
              if (moduleContext) {
                const moduleToBotMap = {
                  ACCOUNTANT: "Finance PA",
                  "Verify PR": "Finance PA",
                  "Approval PR": "Finance PA",
                  "Pay PR": "Finance PA",
                  "PURCHASE REQUEST": "Admin PA",
                  YHR: "HR PA",
                  CE: "CE Assistant",
                  YTM: "YTM PA",
                  "Salary Bill": "HR PA",
                };
                botName = moduleToBotMap[moduleContext] || moduleContext;
              }

              responsePromise = generateGeminiResponse(
                userMessage,
                botName,
                yaikhContext,
                chatHistoryForGemini,
              );
            }

            responsePromise
              .then((geminiResponse) => {
                streamBotResponse(geminiResponse);
                setAttachedFiles([]);
                setSelectedTool(null);
              })
              .catch((error) => {
                console.error("Error:", error);
                streamBotResponse("I encountered an error. Please try again.");
                setAttachedFiles([]);
                setSelectedTool(null);
              });

            return currentMessages;
          });
        } catch (error) {
          console.error("Error:", error);
          streamBotResponse("I encountered an error. Please try again.");
          setAttachedFiles([]);
          setSelectedTool(null);
        }
      }, 500);
    },
    [
      input,
      isTyping,
      streamBotResponse,
      attachedFiles,
      selectedTool,
      buildYaikhContext,
      moduleContext,
    ],
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        document.activeElement === inputRef.current
      ) {
        e.preventDefault();
        if (input.trim() && !isTyping) {
          handleSend();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [input, isTyping, handleSend]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Voice Recognition Setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? " " : "") + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setIsToolsOpen(false);
        setIsContentMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Voice Input Handlers
  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end bg-transparent animate-in fade-in duration-300">
      {/* Overlay - click to close (transparent, no blur) */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      {/* Phone Frame Container - Right Side */}
      <div
        className="relative z-10 h-full flex items-center justify-end pr-4 sm:pr-6 md:pr-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone Frame - Bigger */}
        <div className="relative w-[420px] h-[92vh] max-h-[900px] bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-900 flex flex-col">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black rounded-b-lg z-10"></div>

          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col relative">
            {/* Chat History Sidebar - Inside Phone Frame (like Yai 1) */}
            <div
              className={`absolute inset-0 z-50 w-full sm:w-64 bg-gradient-to-br from-slate-50 to-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
                isHistoryOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-800">
                    Chat History
                  </h2>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-1.5 rounded-full hover:bg-black/5 transition"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* New Chat Button */}
                <div className="p-3 border-b border-gray-200">
                  <button
                    onClick={() => {
                      handleNewChat();
                      setIsHistoryOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-gray-200 hover:opacity-80 transition shadow-sm"
                  >
                    <Plus size={14} className="text-gray-700" />
                    <span className="text-xs font-medium text-gray-700">
                      New Chat
                    </span>
                  </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {chatHistory.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-xs">
                      No chat history yet
                    </div>
                  ) : (
                    <div className="p-2">
                      {chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => {
                            loadChat(chat.id);
                            setIsHistoryOpen(false);
                          }}
                          className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-black/5 transition ${
                            currentChatId === chat.id
                              ? "bg-gradient-to-r from-orange-100 to-amber-100"
                              : ""
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-800 font-medium truncate">
                              {chat.title || "Untitled Chat"}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {new Date(chat.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 transition"
                          >
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overlay when sidebar is open */}
            {isHistoryOpen && (
              <div
                className="absolute inset-0 bg-black/20 z-40"
                onClick={() => setIsHistoryOpen(false)}
              />
            )}

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-amber-500 relative z-10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">
                    {moduleContext ? moduleContext : "Yai AI Agent"}
                  </h2>
                  <p className="text-white/80 text-xs">
                    {moduleContext
                      ? `${moduleContext} Assistant`
                      : "General Assistant"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative z-10">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {moduleContext ? moduleContext : "Yai AI Agent"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {moduleContext
                      ? `Ask me anything about ${moduleContext} module and its sub-modules!`
                      : "Ask me anything about Yaikh modules, general questions, or any topic!"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {getSuggestions().map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleSend(suggestion.question);
                        }}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                        : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text.split("\n").map((line, lineIndex, array) => {
                        const trimmedLine = line.trim();

                        // Check if line looks like a list item (bullet or numbered)
                        if (
                          /^[-•*]\s/.test(trimmedLine) ||
                          /^\d+\.\s/.test(trimmedLine)
                        ) {
                          const cleanText = trimmedLine
                            .replace(/^[-•*]\s/, "")
                            .replace(/^\d+\.\s/, "");
                          // Check for bold text **text**
                          const parts = cleanText.split(/(\*\*[^*]+\*\*)/g);
                          return (
                            <div
                              key={lineIndex}
                              className="flex items-start gap-2 mb-1.5"
                            >
                              <span
                                className={`mt-0.5 flex-shrink-0 ${msg.from === "user" ? "text-white" : "text-orange-500"}`}
                              >
                                •
                              </span>
                              <span className="flex-1">
                                {parts.map((part, partIndex) =>
                                  part.startsWith("**") &&
                                  part.endsWith("**") ? (
                                    <strong
                                      key={partIndex}
                                      className={
                                        msg.from === "user"
                                          ? "text-white font-semibold"
                                          : "text-gray-900 font-semibold"
                                      }
                                    >
                                      {part.slice(2, -2)}
                                    </strong>
                                  ) : (
                                    <span key={partIndex}>{part}</span>
                                  ),
                                )}
                              </span>
                            </div>
                          );
                        }

                        // Check for bold text in regular paragraphs
                        if (trimmedLine.includes("**")) {
                          const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/g);
                          return (
                            <p
                              key={lineIndex}
                              className={
                                lineIndex < array.length - 1 && trimmedLine
                                  ? "mb-2"
                                  : ""
                              }
                            >
                              {parts.map((part, partIndex) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                  <strong
                                    key={partIndex}
                                    className={
                                      msg.from === "user"
                                        ? "text-white font-semibold"
                                        : "text-gray-900 font-semibold"
                                    }
                                  >
                                    {part.slice(2, -2)}
                                  </strong>
                                ) : (
                                  <span key={partIndex}>{part}</span>
                                ),
                              )}
                            </p>
                          );
                        }

                        // Regular paragraph
                        return (
                          <p
                            key={lineIndex}
                            className={
                              lineIndex < array.length - 1 && trimmedLine
                                ? "mb-2"
                                : ""
                            }
                          >
                            {line ||
                              (lineIndex < array.length - 1 ? "" : "\u00A0")}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator only shows when waiting for API response, not during streaming */}
              {isTyping && !messages.some((msg) => msg.isStreaming) && (
                <div className="mb-4 flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attached Files Display */}
            {attachedFiles.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-lg"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-800 truncate max-w-[100px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() =>
                        setAttachedFiles((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white relative z-10 flex-shrink-0">
              {/* Tools and Content Menu Row */}
              <div className="flex items-center gap-2 mb-2">
                {/* Content Menu Button */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setIsContentMenuOpen(!isContentMenuOpen);
                      setIsToolsOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Add Content"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  {isContentMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsContentMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <Paperclip className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">
                          Upload files
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          alert("Google Drive integration coming soon!");
                          setIsContentMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <HardDrive className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">
                          Add from Drive
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsContentMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <Camera className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">Photos</span>
                      </button>
                      <button
                        onClick={() => {
                          alert("NotebookLM integration coming soon!");
                          setIsContentMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <Notebook className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">
                          NotebookLM
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tools Button */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setIsToolsOpen(!isToolsOpen);
                      setIsContentMenuOpen(false);
                    }}
                    className={`px-3 py-2 flex items-center gap-2 rounded-lg transition-colors ${
                      selectedTool
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                    aria-label="Tools"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-xs font-medium">Tools</span>
                  </button>
                  {isToolsOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                      <div className="px-3 py-2 border-b border-gray-200">
                        <span className="text-xs font-semibold text-gray-700">
                          Tools
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTool("deep-research");
                          setIsToolsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <Search className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">
                          Deep Research
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTool("create-images");
                          setIsToolsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <ImageIcon className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-gray-800">
                          Create images
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTool("canvas");
                          setIsToolsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <Palette className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">Canvas</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTool("guided-learning");
                          setIsToolsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <BookOpen className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-800">
                          Guided Learning
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Response Speed Dropdown */}
                <div className="relative ml-auto dropdown-container">
                  <button
                    onClick={() => {
                      const speeds = ["fast", "standard", "slow"];
                      const currentIndex = speeds.indexOf(responseSpeed);
                      setResponseSpeed(
                        speeds[(currentIndex + 1) % speeds.length],
                      );
                    }}
                    className="px-3 py-2 flex items-center gap-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {responseSpeed === "fast"
                        ? "Fast"
                        : responseSpeed === "standard"
                          ? "Standard"
                          : "Slow"}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Main Input Row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Chat History"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-500"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => {
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isRecording
                        ? "bg-red-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    aria-label="Voice Input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`p-1.5 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'}`}
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setAttachedFiles((prev) => [...prev, ...files]);
                }}
              />
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAIAgent;
