import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  Plus,
  Grid3x3,
  Mic,
  Copy,
  Edit2,
  RefreshCw,
  MoreVertical,
  Database,
  Menu,
  Clock,
  Trash2,
  Search,
  ChevronRight,
} from "lucide-react";
import { generateGeminiResponse, generateChatResponse, generateBossOrChat, shouldUseGemini } from "./gemini-api";
import { KHMER_NEW_YEAR } from "../thems";
import { useKhmerTTS } from "./useKhmerTTS";
import { Volume2, VolumeX } from "lucide-react";

// Visitor name is captured on first open and persisted; no default value.

const BotVersion2 = ({
  onClose,
  moduleContext,
  onVersionChange,
  currentVersion = "yai2",
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryPinned, setIsHistoryPinned] = useState(false);
  // Font-size preference for the chat bubbles (12–24px). Persists in localStorage.
  const [chatFontSize, setChatFontSize] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem("yai_chat_font_size") || "", 10);
      return Number.isFinite(v) && v >= 12 && v <= 24 ? v : 15;
    } catch { return 15; }
  });
  useEffect(() => {
    try { localStorage.setItem("yai_chat_font_size", String(chatFontSize)); } catch { /* private mode */ }
  }, [chatFontSize]);

  // Visitor name — captured once, persisted, drives the Big Brain greeting
  const [visitorName, setVisitorName] = useState(() => {
    try { return localStorage.getItem("yai_visitor_name") || ""; } catch { return ""; }
  });
  const [nameDraft, setNameDraft] = useState("");

  // Factory config persisted across sessions.
  const [factoryConfig, setFactoryConfig] = useState(() => {
    try { const s = localStorage.getItem("yai_factory_config"); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  // Conversational onboarding — chat-based, not a form.
  //   -2 = ask visitor's name, -1 = done,
  //    0 = ask workers, 1 = ask lines, 2 = ask product,
  //    3 = ask certifications, 4 = ask buyers, 5 = materialising
  const [onboardingStep, setOnboardingStep] = useState(() => {
    try {
      if (localStorage.getItem("yai_factory_config")) return -1;
      if (localStorage.getItem("yai_visitor_name")) return 0;
      return -2;
    } catch { return -2; }
  });
  const [onboardingDraft, setOnboardingDraft] = useState({
    workers: null, lines: null, product: null, certifications: null, buyers: null,
  });

  // Track which "matter" item_ids Yai has already shown the boss, so the
  // next/more request pulls a fresh batch.
  const [shownMatterIds, setShownMatterIds] = useState([]);

  // Ask the next onboarding question — warm + reactive, references the last answer.
  const askNextOnboarding = (step, draft, boss) => {
    let q = null;
    if (step === -2) {
      q = `Hello Boss — I am Yai. And you?`;
    } else if (step === 0) {
      q = `Nice to meet you, ${boss || "Boss"}. Tell me a little about your factory — how many people on the floor?`;
    } else if (step === 1) {
      const w = draft.workers || 0;
      const flavour = w >= 2000 ? `That's a proper operation` : w >= 800 ? `Solid size` : w >= 300 ? `A tidy crew` : `A small, sharp team`;
      q = `${flavour} — ${w.toLocaleString()} workers. How many production lines are running today?`;
    } else if (step === 2) {
      const l = draft.lines || 0;
      const perLine = draft.workers && l ? Math.round(draft.workers / l) : 0;
      const flavour = perLine ? ` (about ${perLine} per line)` : "";
      q = `${l} line${l === 1 ? "" : "s"}${flavour}. What are you making — polos, jackets, trousers, or a mix?`;
    } else if (step === 3) {
      q = `${draft.product ? `${draft.product.charAt(0).toUpperCase() + draft.product.slice(1)} — good to know.` : "Got it."} Any certifications your buyers care about? WRAP, BSCI, HIGG, SEDEX, GRS — list what you have, or say "none".`;
    } else if (step === 4) {
      const certs = draft.certifications || [];
      const flavour = certs.length ? `${certs.join(", ")} — nice, that opens a lot of buyer doors.` : `No worries, most factories add those over time.`;
      q = `${flavour} Last thing — who are your main buyers? Comma-separated names, or say "skip" if you'd rather not.`;
    }
    if (q) setMessages(prev => [...prev, { from: "bot", text: q }]);
  };

  // After all 5 answers, POST to materialize + confirm.
  const materialiseFactory = async (draft, boss) => {
    setOnboardingStep(5);
    setMessages(prev => [...prev, { from: "bot", text: "Materialising your factory across all 13 PAs…" }]);
    try {
      const payload = {
        visitor: boss || "Boss",
        workers: draft.workers || 1000,
        lines: draft.lines || 3,
        product: draft.product || "polos",
        certifications: draft.certifications || [],
        buyers: draft.buyers || [],
        hasWarehouse: true,
      };
      const res = await fetch("/api/factory/materialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "materialise failed");
      try { localStorage.setItem("yai_factory_config", JSON.stringify(payload)); } catch { /* private mode */ }
      setFactoryConfig(payload);
      setOnboardingStep(-1);
      // Compose a warm, curious opening — Yai has thoughts about YOUR factory,
      // not a dashboard dump. Pulls context from the boss's own answers.
      const perLine = payload.workers && payload.lines ? Math.round(payload.workers / payload.lines) : 0;
      const bossName = boss || "Boss";
      const productLower = (payload.product || "polos").toLowerCase();
      const certs = payload.certifications || [];
      const buyers = payload.buyers || [];
      const bigCerts = ["WRAP", "BSCI", "HIGG", "SEDEX", "GRS"];
      const missingCerts = bigCerts.filter(c => !certs.some(x => x.toUpperCase().includes(c)));
      const observations = [];
      if (perLine >= 400) {
        observations.push(`${perLine} people per line is on the heavier side — bottlenecks show up fast when someone calls in sick`);
      } else if (perLine && perLine < 200) {
        observations.push(`only ${perLine} per line — lean, quick to re-balance but you'll feel any absentee hard`);
      } else if (perLine) {
        observations.push(`about ${perLine} per line — that's a healthy balance`);
      }
      if (productLower.includes("polo")) {
        observations.push(`polo runs love long unbroken flows — style changeovers are usually the biggest hidden cost`);
      } else if (productLower.includes("jacket")) {
        observations.push(`jackets are trim-heavy — most of your headaches will come from MRP + 4DP coordination`);
      } else if (productLower.includes("trouser")) {
        observations.push(`trousers live and die on cutting accuracy — your CE + MRP loop is the one to watch`);
      }
      const observation = observations.length
        ? observations.join(", and ") + "."
        : "";

      const buyerLine = buyers.length
        ? `${buyers.join(" and ")} — do they pull from the same styles or is each one its own book?`
        : `You haven't mentioned buyers yet — is that because you're still hunting, or you prefer to keep them off the record?`;

      const certLine = missingCerts.length && certs.length
        ? ` I noticed you have ${certs.join(", ")} but not ${missingCerts.slice(0, 2).join(" or ")} — buyers not asking, or is that on the roadmap?`
        : missingCerts.length === bigCerts.length
        ? ` No certifications yet — is that a "next year" thing, or are your buyers happy without them?`
        : ``;

      // Proactively pull the top 3 matters so Yai brings them up unprompted.
      let mattersBlock = "";
      let mattersList = [];
      let totalOpen = 0;
      try {
        const attRes = await fetch("/api/factory/attention?limit=3");
        const attJson = await attRes.json();
        if (attJson?.ok && Array.isArray(attJson.matters) && attJson.matters.length) {
          mattersList = attJson.matters;
          totalOpen = attJson.totalOpen || 0;
          setShownMatterIds(mattersList.map((m) => m.item_id));
          const rendered = attJson.matters.map((m, i) =>
            `${i + 1}. **${m.pa_label} · ${m.pill}**${m.burning ? " 🔥" : ""} — ${m.summary} _(${m.age_days}d old)_`
          ).join("\n\n");
          mattersBlock =
            `\n\nWhile I was walking the floor I spotted 3 matters worth your attention first (${totalOpen} open across all 13 PAs):\n\n${rendered}`;
        }
      } catch {
        // silent — welcome message just skips the matters section
      }

      const closer = mattersList.length
        ? `\n\nWant to start with one of those (say the number)? Say "next" to see the next 3, or tell me what's actually keeping you awake this week.`
        : `\n\nWhat's keeping you awake this week?`;

      setMessages(prev => [...prev, { from: "bot", text:
        `Alright ${bossName} — your ${payload.workers.toLocaleString()}-worker ${productLower} factory is loaded ` +
        `(${payload.lines} line${payload.lines === 1 ? "" : "s"}, ${data.tasksSeeded} live tasks across the team).\n\n` +
        `Quick thoughts before we dig in: ${observation}${certLine}\n\n` +
        buyerLine +
        mattersBlock +
        closer,
      }]);
    } catch (err) {
      setOnboardingStep(4); // back to the last question so they can retry
      setMessages(prev => [...prev, { from: "bot", text:
        `I couldn't set the factory up: ${err.message}. Try answering the last question again, or refresh.`,
      }]);
    }
  };

  // Seed the very first bot message when the chat opens fresh — no static
  // welcome screen, Yai speaks first in the chat itself.
  useEffect(() => {
    if (messages.length > 0) return; // don't stomp an existing conversation
    if (onboardingStep === -2) {
      // Brand-new visitor — Yai introduces itself and asks their name.
      setMessages([{ from: "bot", text: `Hello Boss — I am Yai. And you?` }]);
    } else if (onboardingStep === -1 && visitorName && factoryConfig) {
      // Returning visitor — warm come-back line, no re-onboarding.
      setMessages([{ from: "bot", text: `Welcome back, ${visitorName} — your factory is loaded. Ask me anything.` }]);
    } else if (onboardingStep >= 0 && onboardingStep <= 4 && visitorName) {
      // Half-done onboarding (name was saved but factory wasn't materialised).
      askNextOnboarding(onboardingStep, onboardingDraft, visitorName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chat history state
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("yai2-chat-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);

  // Website-related suggested actions
  const suggestedActions = [
    { text: "Planning Status", highlight: true },
    { text: "Messenger" },
    { text: "Group Chat" },
    { text: "Meeting" },
    { text: "Your Follow Up" },
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { speak, stop, isSpeaking } = useKhmerTTS();
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("yai2-chat-history");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      // Sanitize out Base64 payload blobs to prevent LocalStorage QuotaExceededError
      const sanitizedHistory = chatHistory.map(chat => ({
        ...chat,
        messages: chat.messages.map(msg => {
          if (msg.from === 'user' && typeof msg.text === 'string' && msg.text.includes('[IMAGE_DATA:')) {
            return {
              ...msg,
              text: msg.text.replace(/\[IMAGE_DATA:.*?\]/g, '[Image Attached]').trim()
            };
          }
          return msg;
        })
      }));
      localStorage.setItem("yai2-chat-history", JSON.stringify(sanitizedHistory));
    }
  }, [chatHistory]);

  // Save current chat when messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      updateChatInHistory(currentChatId, messages);
    }
  }, [messages, currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setInput("");
  };

  const updateChatInHistory = (chatId, newMessages) => {
    setChatHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const firstUserMessage = newMessages.find((m) => m.from === "user");
          return {
            ...chat,
            messages: newMessages,
            title: firstUserMessage?.text?.substring(0, 50) || "New Chat",
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      }),
    );
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setIsHistoryOpen(false);
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  // Helper function to parse and render markdown content (tables, formatting, etc.)
  const renderMarkdownContent = (text) => {
    if (!text) return { __html: "" };

    // More flexible table regex - matches tables with various formats
    // Pattern 1: Standard markdown table with separator line
    const tableRegex1 =
      /(\|[^\n\r]+\|[\r\n]+(?:\|[\s\-:]+\|[\r\n]+)(?:\|[^\n\r]+\|[\r\n]*)+)/g;
    // Pattern 2: Table without explicit separator (just multiple pipe rows)
    const tableRegex2 = /((?:\|[^\n\r]+\|[\r\n]+){2,})/g;

    let processedText = text;
    let tableIndex = 0;

    // Replace tables with placeholders first
    const tables = [];

    // Try pattern 1 first (with separator)
    processedText = processedText.replace(tableRegex1, (match) => {
      const tableId = `__TABLE_${tableIndex}__`;
      tables.push({ id: tableId, content: match });
      tableIndex++;
      return tableId;
    });

    // Then try pattern 2 (without separator, but multiple pipe rows)
    processedText = processedText.replace(tableRegex2, (match) => {
      // Check if this looks like a table (has at least 2 rows with pipes)
      const lines = match.split(/\r?\n/).filter((l) => l.trim().includes("|"));
      if (lines.length >= 2 && !tables.some((t) => t.content.includes(match))) {
        const tableId = `__TABLE_${tableIndex}__`;
        tables.push({ id: tableId, content: match });
        tableIndex++;
        return tableId;
      }
      return match; // Not a table, keep original
    });

    // Pattern 3: Convert numbered lists to tables (especially purchase requests, etc.)
    const numberedListRegex = /((?:^\d+\.\s+[^\n]+(?:\n|$)){3,})/gm;
    processedText = processedText.replace(numberedListRegex, (match) => {
      const lines = match
        .trim()
        .split(/\r?\n/)
        .filter((l) => l.trim());
      // Check if this looks like structured data (e.g., "1. Request #PR001: "Description"")
      // More lenient: check if most lines have a colon or hash symbol (indicating structured data)
      const structuredLines = lines.filter((line) => {
        const trimmed = line.trim();
        return (
          /^\d+\.\s+.+[#:].+/.test(trimmed) ||
          /^\d+\.\s+Request\s+#/.test(trimmed) ||
          /^\d+\.\s+.+:\s*/.test(trimmed)
        );
      });
      const hasStructuredPattern =
        structuredLines.length >= Math.min(3, Math.max(1, lines.length * 0.5));

      // Also check if it's a simple numbered list (even without colons/hashes) with 5+ items
      const isLongList = lines.length >= 5;

      if (
        (hasStructuredPattern && lines.length >= 3) ||
        (isLongList && hasStructuredPattern)
      ) {
        // Try to extract structured data
        const rows = [];
        lines.forEach((line) => {
          const trimmed = line.trim();
          // Match: "1. Request #PR001: "New Office Furniture""
          const match1 = trimmed.match(
            /^\d+\.\s+Request\s+#([A-Z0-9]+):\s*"([^"]+)"(.*)$/,
          );
          // Match: "1. Request #PR001: Description" (without quotes)
          const match2 = trimmed.match(
            /^\d+\.\s+Request\s+#([A-Z0-9]+):\s*(.+)$/,
          );
          // Match: "1. Item #ID: Description"
          const match3 = trimmed.match(/^\d+\.\s+.+?#([A-Z0-9]+):\s*(.+)$/);
          // Match: "1. Item: Description"
          const match4 = trimmed.match(/^\d+\.\s+(.+?):\s*(.+)$/);

          if (match1) {
            rows.push({
              number: trimmed.match(/^\d+/)[0],
              id: match1[1],
              description: match1[2],
              extra: match1[3],
            });
          } else if (match2) {
            rows.push({
              number: trimmed.match(/^\d+/)[0],
              id: match2[1],
              description: match2[2].trim(),
            });
          } else if (match3) {
            rows.push({
              number: trimmed.match(/^\d+/)[0],
              id: match3[1],
              description: match3[2].trim(),
            });
          } else if (match4) {
            rows.push({
              number: trimmed.match(/^\d+/)[0],
              description: match4[1] + ": " + match4[2],
            });
          } else {
            // Fallback: just extract number and rest of text
            const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
            if (numMatch) {
              rows.push({ number: numMatch[1], description: numMatch[2] });
            }
          }
        });

        if (rows.length >= 3) {
          // Convert to table
          const tableId = `__TABLE_${tableIndex}__`;
          const hasAnyId = rows.some((r) => r.id);
          let tableContent = "| No. |";
          if (hasAnyId) {
            tableContent += " Request ID |";
          }
          tableContent += " Description |\n|";
          if (hasAnyId) {
            tableContent += " --- |";
          }
          tableContent += " --- | --- |\n";
          rows.forEach((row) => {
            tableContent += `| ${row.number} |`;
            if (hasAnyId) {
              tableContent += ` ${row.id ? "#" + row.id : ""} |`;
            }
            tableContent += ` ${(row.description || "").replace(/"/g, "").trim()} |\n`;
          });
          tables.push({ id: tableId, content: tableContent });
          tableIndex++;
          return tableId;
        }
      }
      return match; // Not structured enough, keep original
    });

    // Process other markdown formatting (but preserve table placeholders)
    let html = processedText
      // Bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italic text (but not if it's part of bold)
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto border border-gray-200"><code class="text-xs">$1</code></pre>',
      )
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>',
      )
      // Line breaks (but preserve table placeholders)
      .replace(/\n/g, "<br />");

    // Replace table placeholders with rendered HTML tables
    tables.forEach(({ id, content }) => {
      const tableHtml = parseMarkdownTable(content);
      html = html.replace(id, tableHtml);
    });

    return { __html: html };
  };

  // Helper function to parse markdown table into HTML
  const parseMarkdownTable = (markdownTable) => {
    const lines = markdownTable
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim());
    if (lines.length < 2) return markdownTable; // Not a valid table

    // Parse header - handle tables with or without leading/trailing pipes
    const headerLine = lines[0].trim();
    let headers = headerLine.split("|").map((h) => h.trim());

    // Remove empty first/last elements if table has leading/trailing pipes
    if (headers[0] === "") headers = headers.slice(1);
    if (headers[headers.length - 1] === "") headers = headers.slice(0, -1);

    // Filter out separator-only cells
    headers = headers.filter((h) => h && !h.match(/^[\s\-:]+$/));

    if (headers.length === 0) return markdownTable; // Invalid table

    // Check if second line is a separator (contains dashes/colons)
    const secondLine = lines[1] ? lines[1].trim() : "";
    const isSeparatorLine = secondLine.match(/^[|\s\-:]+$/);

    // Skip separator line if present, otherwise start from line 1
    const dataLines = isSeparatorLine
      ? lines.slice(2).filter((line) => {
          const trimmed = line.trim();
          return trimmed && !trimmed.match(/^[|\s\-:]+$/);
        })
      : lines.slice(1).filter((line) => {
          const trimmed = line.trim();
          return trimmed && !trimmed.match(/^[|\s\-:]+$/);
        });

    // Build HTML table with proper styling
    let tableHtml =
      '<div class="overflow-x-auto my-4" style="border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); background: white;">';
    tableHtml +=
      '<table class="min-w-full" style="border-collapse: collapse; width: 100%;">';

    // Header row with gradient background
    tableHtml +=
      '<thead><tr style="background: linear-gradient(to right, #3b82f6, #4f46e5);">';
    headers.forEach((header) => {
      const escapedHeader = header.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      tableHtml += `<th style="border-bottom: 2px solid #1e40af; padding: 12px 16px; text-align: left; font-weight: 700; font-size: 0.875rem; color: white;">${escapedHeader}</th>`;
    });
    tableHtml += "</tr></thead>";

    // Data rows
    tableHtml += "<tbody>";
    dataLines.forEach((line, rowIndex) => {
      let cells = line.split("|").map((c) => c.trim());

      // Remove empty first/last elements if table has leading/trailing pipes
      if (cells[0] === "") cells = cells.slice(1);
      if (cells[cells.length - 1] === "") cells = cells.slice(0, -1);

      // Filter out separator-only cells
      cells = cells.filter((c) => c && !c.match(/^[\s\-:]+$/));

      if (cells.length === 0) return;

      // Skip rows with just "..." or similar placeholders
      if (cells.every((cell) => cell.match(/^\.{2,}$/))) return;

      const rowClass = rowIndex % 2 === 0 ? "table-row-even" : "table-row-odd";
      tableHtml += `<tr class="${rowClass}">`;

      // Ensure we have the right number of cells (pad if needed)
      const paddedCells = [...cells];
      while (paddedCells.length < headers.length) {
        paddedCells.push("");
      }

      paddedCells.slice(0, headers.length).forEach((cell, cellIndex) => {
        // Handle status colors and styling
        let cellContent = (cell || "")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        let cellStyle =
          "border-bottom: 1px solid #e5e7eb; padding: 12px 16px; font-size: 0.875rem; color: #374151;";

        const cellLower = cellContent.toLowerCase();
        if (cellLower.includes("pending") || cellLower.includes("waiting")) {
          cellStyle += " color: #ea580c; font-weight: 600;";
        } else if (
          cellLower.includes("approved") ||
          cellLower.includes("completed")
        ) {
          cellStyle += " color: #16a34a; font-weight: 600;";
        } else if (
          cellLower.includes("rejected") ||
          cellLower.includes("cancelled")
        ) {
          cellStyle += " color: #dc2626; font-weight: 600;";
        } else if (
          cellLower.includes("in progress") ||
          cellLower.includes("processing")
        ) {
          cellStyle += " color: #2563eb; font-weight: 600;";
        } else if (cellIndex === 0) {
          // First column (usually ID) - make it slightly bold
          cellStyle += " font-weight: 500; color: #111827;";
        }

        tableHtml += `<td style="${cellStyle}">${cellContent}</td>`;
      });
      tableHtml += "</tr>";
    });
    tableHtml += "</tbody></table></div>";

    return tableHtml;
  };

  // Helper function to stream text like ChatGPT (token/word-based chunks with natural pacing)
  const streamBotResponse = (fullText) => {
    // Create initial bot message with empty text
    const initialMessage = {
      from: "bot",
      text: "",
      isStreaming: true,
    };

    // Add the initial message to state
    setMessages((prev) => [...prev, initialMessage]);
    setIsTyping(false);

    // Stream in token/word chunks (like ChatGPT - more natural and faster)
    // Split text into natural chunks (words with punctuation)
    const tokens = [];
    const words = fullText.split(/(\s+)/);

    // Group words into chunks (1-3 words per chunk for natural flow like ChatGPT)
    let currentChunk = "";
    for (let i = 0; i < words.length; i++) {
      currentChunk += words[i];
      // Create chunk after 1-3 words, or at punctuation, or at sentence end
      const wordCount = currentChunk
        .trim()
        .split(/\s+/)
        .filter((w) => w).length;
      const shouldChunk =
        (wordCount >= 2 && Math.random() > 0.4) ||
        /[.!?]\s*$/.test(currentChunk) ||
        wordCount >= 3;

      if (shouldChunk && currentChunk.trim()) {
        tokens.push(currentChunk);
        currentChunk = "";
      }
    }
    // Add remaining chunk
    if (currentChunk.trim()) {
      tokens.push(currentChunk);
    }

    // If no tokens created (very short text), split by words
    if (tokens.length === 0) {
      tokens.push(...words.filter((w) => w.trim()));
    }

    let currentText = "";
    let tokenIndex = 0;

    const streamNextChunk = () => {
      if (tokenIndex >= tokens.length) {
        // Streaming complete
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (
            lastMessage &&
            lastMessage.from === "bot" &&
            lastMessage.isStreaming
          ) {
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              text: fullText,
              isStreaming: false,
            };
          }
          // Update chat history when streaming completes
          if (currentChatId) {
            updateChatInHistory(currentChatId, updatedMessages);
          }
          return updatedMessages;
        });
        return;
      }

      const chunk = tokens[tokenIndex];
      currentText += chunk;
      tokenIndex++;

      // Calculate delay based on chunk characteristics (like ChatGPT's token streaming)
      let delay = 20; // Base delay in milliseconds

      const chunkLength = chunk.trim().length;
      const hasPunctuation = /[.,!?;:]/.test(chunk);
      const isSentenceEnd = /[.!?]\s*$/.test(chunk);

      // Faster for short chunks (common words appear quickly)
      if (chunkLength <= 5) {
        delay = 15 + Math.random() * 15; // 15-30ms
      }
      // Medium for medium chunks
      else if (chunkLength <= 15) {
        delay = 25 + Math.random() * 20; // 25-45ms
      }
      // Slightly slower for long chunks
      else {
        delay = 35 + Math.random() * 25; // 35-60ms
      }

      // Add pause for punctuation (thinking time)
      if (hasPunctuation) {
        delay += 20 + Math.random() * 15; // Extra 20-35ms
      }

      // Longer pause after sentence endings (like ChatGPT's natural pause)
      if (isSentenceEnd) {
        delay += 40 + Math.random() * 30; // Extra 40-70ms pause after sentences
      }

      // Add some randomness for natural variation
      delay += Math.random() * 10;

      // Update the last message with current text
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (
          lastMessage &&
          lastMessage.from === "bot" &&
          lastMessage.isStreaming
        ) {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: currentText,
          };
        }
        return updatedMessages;
      });

      // Schedule next chunk
      setTimeout(streamNextChunk, delay);
    };

    // Start streaming after a small initial delay (like ChatGPT's thinking time)
    setTimeout(streamNextChunk, 30 + Math.random() * 20);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // ── Conversational onboarding intercept ───────────────────────────
    // Steps -2..4 = capture answers via chat, then materialise.
    // Step 5 = in-flight materialise, block input. Step -1 = done.
    if (onboardingStep >= -2 && onboardingStep <= 4) {
      const raw = input.trim();
      const userMsg = { from: "user", text: raw };
      setMessages(prev => [...prev, userMsg]);
      setInput("");

      // Step -2: capture visitor name
      if (onboardingStep === -2) {
        const clean = raw.slice(0, 60);
        try { localStorage.setItem("yai_visitor_name", clean); } catch { /* private mode */ }
        setVisitorName(clean);
        setOnboardingStep(0);
        setTimeout(() => askNextOnboarding(0, onboardingDraft, clean), 500);
        return;
      }

      const draft = { ...onboardingDraft };
      let nextStep = onboardingStep + 1;

      if (onboardingStep === 0) {
        const n = parseInt(raw.replace(/[^\d]/g, ""), 10);
        draft.workers = Number.isFinite(n) && n > 0 ? Math.min(10000, Math.max(50, n)) : 1000;
      } else if (onboardingStep === 1) {
        const n = parseInt(raw.replace(/[^\d]/g, ""), 10);
        draft.lines = Number.isFinite(n) && n > 0 ? Math.min(20, Math.max(1, n)) : Math.max(1, Math.round((draft.workers || 1000) / 300));
      } else if (onboardingStep === 2) {
        draft.product = raw.slice(0, 60) || "polos";
      } else if (onboardingStep === 3) {
        const list = /^none$/i.test(raw) ? [] : raw.split(/[,;]/).map(s => s.trim()).filter(Boolean).slice(0, 20);
        draft.certifications = list;
      } else if (onboardingStep === 4) {
        const list = /^skip$/i.test(raw) ? [] : raw.split(/[,;]/).map(s => s.trim()).filter(Boolean).slice(0, 20);
        draft.buyers = list;
      }

      setOnboardingDraft(draft);
      if (nextStep <= 4) {
        setOnboardingStep(nextStep);
        setTimeout(() => askNextOnboarding(nextStep, draft, visitorName), 500);
      } else {
        materialiseFactory(draft, visitorName);
      }
      return;
    }
    if (onboardingStep === 5) return; // materialising — block extra input

    // ── "Matters for attention" quick intercept ───────────────────────
    // Boss asks for suggestions / next batch / more matters — fetch fresh
    // items, excluding what's already been shown.
    const askText = input.trim().toLowerCase();
    const nextBatchIntent = /^(next|more|show me more|what else|another|continue|keep going)\b/.test(askText);
    const attentionIntent = nextBatchIntent
      || /\b(suggest|matter|attend|attention|what should i|show me|pull.*red|red flag|priorit|urgent|on fire|burning)\b/.test(askText)
      || /^(yes|yeah|yep|sure|go ahead|ok(ay)?|please do)\b/.test(askText);
    if (attentionIntent && factoryConfig) {
      const userMsg = { from: "user", text: input.trim() };
      setMessages(prev => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      const excludeParam = shownMatterIds.length ? `&exclude=${encodeURIComponent(shownMatterIds.join(","))}` : "";
      fetch(`/api/factory/attention?limit=3${excludeParam}`)
        .then(r => r.json())
        .then(d => {
          setIsTyping(false);
          if (!d?.ok) throw new Error(d?.error || "attention lookup failed");
          const matters = d.matters || [];
          if (matters.length === 0) {
            setMessages(prev => [...prev, { from: "bot", text: `That's every open matter across the 13 PAs cleared out of my head, ${visitorName || "Boss"}. Ask me anything, or name a PA to dig in.` }]);
            return;
          }
          setShownMatterIds(prev => [...prev, ...matters.map((m) => m.item_id)]);
          const list = matters.map((m, i) =>
            `${i + 1}. **${m.pa_label} · ${m.pill}**${m.burning ? " 🔥" : ""} — ${m.summary} _(${m.age_days}d old, from ${m.origin_pa || "unknown"}, ref ${m.item_id})_`,
          ).join("\n\n");
          const remaining = Math.max(0, (d.totalOpen || 0) - shownMatterIds.length - matters.length);
          const opener = nextBatchIntent
            ? `Next 3 matters, ${visitorName || "Boss"}${remaining ? ` (${remaining} still on the board after these)` : ""}:\n\n${list}\n\nSay "next" for the next 3, a number to drill in, or name a PA.`
            : `Here are ${matters.length} matters I'd bring to your attention first, ${visitorName || "Boss"}:\n\n${list}\n\nSay the number to drill in, "next" for more, or name a PA.`;
          setMessages(prev => [...prev, { from: "bot", text: opener }]);
        })
        .catch(err => {
          setIsTyping(false);
          setMessages(prev => [...prev, { from: "bot", text: `Couldn't pull the attention list: ${err.message}` }]);
        });
      return;
    }

    // Create new chat if none exists
    if (!currentChatId) {
      createNewChat();
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
    }

    let finalInput = input.trim();
    if (uploadedImage) finalInput += ` [IMAGE_DATA:${uploadedImage}]`;
    const userMessage = { from: "user", text: finalInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Generate website-related response
    setTimeout(
      async () => {
        let botResponse = uploadedImage ? null : generateWebsiteResponse(input.trim());
        const lowerInput = input.trim().toLowerCase();

        // Check if we should use Gemini API (when no predefined response found)
        const hasPredefinedResponse =
          lowerInput.includes("planning status") ||
          lowerInput.includes("messenger") ||
          lowerInput.includes("group chat") ||
          lowerInput.includes("meeting") ||
          lowerInput.includes("follow up") ||
          lowerInput.includes("planning") ||
          lowerInput.includes("platform") ||
          lowerInput.includes("module") ||
          lowerInput.includes("feature") ||
          lowerInput.includes("navigate") ||
          lowerInput.includes("use") ||
          lowerInput.includes("how") ||
          lowerInput.includes("architecture") ||
          lowerInput.includes("system") ||
          lowerInput.includes("structure") ||
          lowerInput.includes("capability");

        if (
          !hasPredefinedResponse ||
          shouldUseGemini(input.trim(), hasPredefinedResponse)
        ) {
          try {
            // Generate response using Gemini API
            const geminiResponse = await generateBossOrChat(
              input.trim(),
              "Big Brain",
              `You are the Big Brain agent for the Yaikh platform — the boss of thirteen specialist PA agents. You are talking to ${visitorName || "a visitor"}. Address them by name when it feels natural. When users ask about a specific domain, tell them which PA can help.

Your PA reports (Agent Collective):
- Accounting PA — Purchase, Claims, Salary, Shipping, IEWS, Account
- HR PA — Attend, Leave, Training, Org, Temp, Speak Up
- Admin PA — Tickets, Rooms, Gates, Y Shop, Visitors
- CSR PA — Air, Water, Energy, Audits, Alerts
- Shipping PA — Container plan, Customs clearance, Delivery schedule, Inventory levels, Material plan
- MRP PA — Material plan, BOM review, Stock alerts, Supplier orders, Reorder points
- QA PA — Recent defect inspections, Customer complaints, Open call-outs, Third-party audits, Quality reports
- Production PA — Today's production plan, WIP by line, Cutting/Finishing throughput, Production status
- CE PA — Standard time updates, Productivity by line, Machine allocation, Skill inventory, Cost centre summary
- YTM PA — Machine downtime, Repair queue, Maintenance schedule, Late maintenance alerts, Spare parts stock
- 4DP PA — Sample approvals, Pattern review queue, Spec sheets, Trim approvals, Design roadmap
- YPI PA — Open Kaizen projects, SOP review queue, Efficiency audits, Process optimisation, Improvement KPIs
- Social PA — TikTok, Facebook, YouTube, Instagram, LinkedIn comments

Answer general/strategy questions yourself. For domain-specific asks, name the PA the user should visit in the Agent Collective. Keep replies SHORT (2-4 sentences). Never invent PAs that aren't in this list.`,
              newMessages.slice(0, -1), // history
              visitorName,
            );

            botResponse = geminiResponse;
          } catch (error) {
            console.error("Error calling Gemini API:", error);
            // Keep the predefined response if API fails
          }
        }

        // Use streaming for the response
        streamBotResponse(botResponse);
      },
      1000 + Math.random() * 500,
    );
  };

  const generateWebsiteResponse = (_userInput) => {
    // All canned "bot" responses removed 2026-09-07.
    // Every user message now flows through the M1 → Gemini router so the
    // Big Brain agent (with its 13-PA roster prompt) answers accurately
    // and never mentions the removed "specialized bots" wording.
    return null;
    // eslint-disable-next-line no-unreachable
    const lowerInput = _userInput.toLowerCase().trim();

    // 1. Planning Status
    if (
      lowerInput.includes("planning status") ||
      (lowerInput.includes("planning") && lowerInput.includes("status"))
    ) {
      return `⚠️ Planning Status Alert\n\n🔴 Please check the following delay alerts:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📋 Alert Details:\n\n  • Order #7796: Material Delay\n  • Order #8486: Shipment Alert\n  • Order #445: Fabric Reject\n  • Order #8689: PPC Meeting - Critical Issue\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⏰ Action Required:\n  Immediate attention needed for these items.\n\n  Please review each alert and take appropriate action.`;
    }

    // 2. Messenger
    if (
      lowerInput.includes("messenger") ||
      lowerInput === "messenger" ||
      lowerInput.includes("message")
    ) {
      return `💬 Messenger Overview\n\n📨 Your Messages:\n\n• Unread Messages: 5\n• New Conversations: 2\n• Pending Replies: 3\n\n📋 Recent Conversations:\n\n  • John Smith: "Can we schedule a meeting?"\n    Time: 2 hours ago\n    Status: ⏳ Pending reply\n\n  • Sarah Johnson: "Please review the document"\n    Time: 5 hours ago\n    Status: ⏳ Pending reply\n\n  • Mike Wilson: "Project update needed"\n    Time: 1 day ago\n    Status: ✅ Replied\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⏰ Action Required:\n  You have 5 unread messages that need your attention.`;
    }

    // 3. Group Chat
    if (
      lowerInput.includes("group chat") ||
      lowerInput === "group chat" ||
      (lowerInput.includes("group") && lowerInput.includes("chat"))
    ) {
      return `👥 Group Chat Overview\n\n📊 Active Group Chats:\n\n• Production Team: 12 members\n  Last Activity: 30 minutes ago\n  Unread: 3 messages\n\n• Management Team: 8 members\n  Last Activity: 1 hour ago\n  Unread: 1 message\n\n• QA Department: 15 members\n  Last Activity: 2 hours ago\n  Unread: 0 messages\n\n📋 Recent Group Activity:\n\n  • Production Team:\n    "Meeting scheduled for tomorrow"\n    Posted by: Manager\n    Time: 30 minutes ago\n\n  • Management Team:\n    "Quarterly review next week"\n    Posted by: Director\n    Time: 1 hour ago\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💬 Total Unread: 4 messages across 2 groups`;
    }

    // 4. Meeting
    if (lowerInput.includes("meeting") || lowerInput === "meeting") {
      return `📅 Meeting Schedule\n\n📋 Upcoming Meetings:\n\n• Team Standup\n  Date: Today, 10:00 AM\n  Duration: 30 minutes\n  Participants: 8 people\n  Status: ✅ Confirmed\n\n• Project Review\n  Date: Tomorrow, 2:00 PM\n  Duration: 1 hour\n  Participants: 12 people\n  Status: ✅ Confirmed\n\n• Client Presentation\n  Date: Next Monday, 11:00 AM\n  Duration: 45 minutes\n  Participants: 6 people\n  Status: ⏳ Pending confirmation\n\n📊 Meeting Summary:\n• Today: 1 meeting\n• This Week: 5 meetings\n• Next Week: 3 meetings\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⏰ Next Meeting: Team Standup in 2 hours`;
    }

    // 5. Your Follow Up
    if (
      lowerInput.includes("your follow up") ||
      lowerInput === "your follow up" ||
      lowerInput.includes("follow up") ||
      lowerInput.includes("follow-up")
    ) {
      return `📌 Your Follow-Up Items\n\n🔴 High Priority:\n\n  • Follow up with client ABC Corp\n    Due: Today\n    Status: ⚠️ Overdue\n    Action: Call to discuss project status\n\n  • Review proposal for XYZ Ltd\n    Due: Tomorrow\n    Status: 🔴 Urgent\n    Action: Complete review and send feedback\n\n🟡 Medium Priority:\n\n  • Schedule meeting with supplier\n    Due: This Friday\n    Status: ⏳ In progress\n    Action: Send meeting invitation\n\n  • Update project documentation\n    Due: Next Monday\n    Status: ⏳ Pending\n    Action: Review and update files\n\n🟢 Low Priority:\n\n  • Send thank you email\n    Due: Next Wednesday\n    Status: ✅ Scheduled\n    Action: Draft and send email\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📊 Summary:\n• Total Items: 5\n• Overdue: 1\n• Urgent: 1\n• In Progress: 1\n• Pending: 2`;
    }

    if (lowerInput.includes("planning") || lowerInput.includes("platform")) {
      return `This is the Yaikh Dashboard - a comprehensive enterprise management platform. It provides various modules for different departments including Finance, Admin, CSR, PPC, Productions, YTM, PD, Sales, QMS, and Social Media management. The platform offers real-time analytics, workflow automation, and integrated tools for efficient business operations.`;
    }

    if (lowerInput.includes("module") || lowerInput.includes("feature")) {
      return `The platform includes multiple modules: Finance Bot for financial management, Admin Bot for operations, CSR Bot for corporate responsibility, PPC Bot for marketing campaigns, Productions Bot for manufacturing, YTM Bot for yield tracking, PD Bot for product development, Sale Bot for sales management, QMS Bot for quality control, and Social Bot for social media. Each module is designed to streamline specific business processes.`;
    }

    if (
      lowerInput.includes("navigate") ||
      lowerInput.includes("use") ||
      lowerInput.includes("how")
    ) {
      return `To navigate the dashboard: Click on any module card to access its features. Use the search bar to find specific modules quickly. The chatbot icon (Yai 2) provides AI assistance - Yai 1 shows multiple specialized bots, while Yai 2 provides a single comprehensive assistant. Each module has its own interface tailored to its specific function.`;
    }

    if (
      lowerInput.includes("architecture") ||
      lowerInput.includes("system") ||
      lowerInput.includes("structure")
    ) {
      return `The system architecture is built on a modern tech stack with React for the frontend, providing a responsive and interactive user experience. It features modular design allowing each department to have specialized tools. The platform supports real-time data updates, secure authentication, and scalable infrastructure to handle enterprise-level operations efficiently.`;
    }

    if (lowerInput.includes("feature") || lowerInput.includes("capability")) {
      return `Key features include: Multi-module dashboard, AI-powered chatbots (Yai 2), Real-time analytics and reporting, Workflow automation, Task management, Document management, Integration capabilities, Role-based access control, Mobile-responsive design, and Customizable modules for different business needs.`;
    }

    // Default response
    return `I'm here to help you understand and navigate the Yaikh Dashboard platform. You can ask me about the website features, available modules, how to use the system, or any specific questions about the platform's capabilities. What would you like to know?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleSuggestionClick = (actionText) => {
    if (!currentChatId) {
      createNewChat();
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
    }

    const userMessage = { from: "user", text: actionText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(
      async () => {
        let botResponse = generateWebsiteResponse(actionText);
        const lowerInput = actionText.toLowerCase();

        // Check if we should use Gemini API (when no predefined response found)
        const hasPredefinedResponse =
          lowerInput.includes("planning status") ||
          lowerInput.includes("messenger") ||
          lowerInput.includes("group chat") ||
          lowerInput.includes("meeting") ||
          lowerInput.includes("follow up") ||
          lowerInput.includes("planning") ||
          lowerInput.includes("platform") ||
          lowerInput.includes("module") ||
          lowerInput.includes("feature") ||
          lowerInput.includes("navigate") ||
          lowerInput.includes("use") ||
          lowerInput.includes("how") ||
          lowerInput.includes("architecture") ||
          lowerInput.includes("system") ||
          lowerInput.includes("structure") ||
          lowerInput.includes("capability");

        if (
          !hasPredefinedResponse ||
          shouldUseGemini(actionText, hasPredefinedResponse)
        ) {
          try {
            // Generate response using Gemini API
            const geminiResponse = await generateBossOrChat(
              actionText,
              "Big Brain",
              `You are the Big Brain agent for the Yaikh platform — the boss of thirteen specialist PA agents. You are talking to ${visitorName || "a visitor"}. Address them by name when it feels natural. When users ask about a specific domain, tell them which PA can help.

Your PA reports (Agent Collective):
- Accounting PA — Purchase, Claims, Salary, Shipping, IEWS, Account
- HR PA — Attend, Leave, Training, Org, Temp, Speak Up
- Admin PA — Tickets, Rooms, Gates, Y Shop, Visitors
- CSR PA — Air, Water, Energy, Audits, Alerts
- Shipping PA — Container plan, Customs clearance, Delivery schedule, Inventory levels, Material plan
- MRP PA — Material plan, BOM review, Stock alerts, Supplier orders, Reorder points
- QA PA — Recent defect inspections, Customer complaints, Open call-outs, Third-party audits, Quality reports
- Production PA — Today's production plan, WIP by line, Cutting/Finishing throughput, Production status
- CE PA — Standard time updates, Productivity by line, Machine allocation, Skill inventory, Cost centre summary
- YTM PA — Machine downtime, Repair queue, Maintenance schedule, Late maintenance alerts, Spare parts stock
- 4DP PA — Sample approvals, Pattern review queue, Spec sheets, Trim approvals, Design roadmap
- YPI PA — Open Kaizen projects, SOP review queue, Efficiency audits, Process optimisation, Improvement KPIs
- Social PA — TikTok, Facebook, YouTube, Instagram, LinkedIn comments

Answer general/strategy questions yourself. For domain-specific asks, name the PA the user should visit in the Agent Collective. Keep replies SHORT (2-4 sentences). Never invent PAs that aren't in this list.`,
              newMessages.slice(0, -1), // history
              visitorName,
            );

            botResponse = geminiResponse;
          } catch (error) {
            console.error("Error calling Gemini API:", error);
            // Keep the predefined response if API fails
          }
        }

        // Use streaming for the response
        streamBotResponse(botResponse);
      },
      1000 + Math.random() * 500,
    );
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const hasMessages = messages.length > 0;

  // Prevent body scroll when this component is mounted
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex overflow-hidden bg-[#050505] text-white"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        position: "fixed",
        zIndex: 200,
      }}
    >
      {/* Markdown and Table Styling */}
      <style>{`
        /* Markdown content styling */
        .markdown-content {
          line-height: 1.6;
        }
        
        .markdown-content strong {
          font-weight: 600;
          color: inherit;
        }
        
        .markdown-content em {
          font-style: italic;
        }
        
        .markdown-content code {
          font-family: 'Courier New', monospace;
        }
        
        .markdown-content pre {
          font-size: 0.875rem;
        }
        
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .markdown-content table th {
          font-weight: 600;
          text-align: left;
        }
        
        .markdown-content table td,
        .markdown-content table th {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .markdown-content table tbody tr:last-child td {
          border-bottom: none;
        }
        
        /* Table row hover effects */
        .table-row-even {
          background-color: #ffffff;
          transition: background-color 0.15s ease;
        }
        
        .table-row-odd {
          background-color: #f9fafb;
          transition: background-color 0.15s ease;
        }
        
        .table-row-even:hover,
        .table-row-odd:hover {
          background-color: #dbeafe !important;
        }
      `}</style>

      {/* Solar System Animation removed 2026-09-07 */}

      {/* Sidebar - Chat History (pushed further down so it clears the
          Yai Agents / Agent Collective / Big Brain header row) */}
      <div
        className={`fixed left-0 z-50 w-80 bg-[#050505] border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          isHistoryOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "220px", bottom: "0", height: "calc(100vh - 220px)" }}
      >
        <div className="flex flex-col h-full w-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsHistoryPinned((p) => !p)}
                title={isHistoryPinned ? "Unpin (auto-close on click outside)" : "Pin (keep open)"}
                className={`p-2 rounded-full transition ${
                  isHistoryPinned
                    ? "bg-yai-blue/30 text-yai-blue"
                    : "hover:bg-white/10 text-white/70"
                }`}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>
                  {isHistoryPinned ? "📌" : "📍"}
                </span>
              </button>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X size={20} className="text-white/70" />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-white/10">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              <Plus size={18} className="text-white/70" />
              <span className="text-sm text-white">New Chat</span>
            </button>
          </div>

          {/* Text size — A slider A */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-center text-xs text-white/60 mb-2">
              {chatFontSize === 15 ? "Default" : `${chatFontSize}px`}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/70" style={{ fontSize: 12 }}>A</span>
              <input
                type="range"
                min={12}
                max={24}
                step={1}
                value={chatFontSize}
                onChange={(e) => setChatFontSize(parseInt(e.target.value, 10))}
                className="flex-1 accent-yai-blue cursor-pointer"
              />
              <span className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>A</span>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="p-4 text-center text-white/50 text-sm">
                No chat history yet
              </div>
            ) : (
              <div className="p-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition ${
                      currentChatId === chat.id ? "bg-white/10" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/10 transition"
                    >
                      <Trash2 size={14} className="text-white/50" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open — suppressed when pinned so the
          user can keep interacting with the chat behind it. */}
      {isHistoryOpen && !isHistoryPinned && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Back Button - Top Left (Fixed Position) */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-[250] flex items-center gap-2 px-4 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-lg backdrop-blur-sm transition-colors font-medium shadow-lg"
      >
        <ChevronRight size={18} className="rotate-180" /> Back
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full h-full min-h-0 flex-shrink relative z-20 pt-4">
        {/* Header with Bot Name and Avatar */}
        <div className={`flex-shrink-0 flex flex-col px-4 sm:px-6 py-3 pt-16 sm:pt-20 border-b ${KHMER_NEW_YEAR.isActive ? 'border-red-500/30 bg-gradient-to-b from-red-900/40 via-orange-900/20 to-[#050505]/80' : 'border-white/10 bg-[#050505]/80'} backdrop-blur-sm w-full h-auto relative z-30`}>
          <style>{`
                        @keyframes float {
                            0%, 100% { transform: translateY(0px) rotate(0deg); }
                            50% { transform: translateY(-10px) rotate(5deg); }
                        }
                        @keyframes pulse-glow {
                            0%, 100% { 
                                box-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
                                           0 0 40px rgba(139, 92, 246, 0.3),
                                           0 0 60px rgba(59, 130, 246, 0.2);
                            }
                            50% { 
                                box-shadow: 0 0 30px rgba(59, 130, 246, 0.8),
                                           0 0 60px rgba(139, 92, 246, 0.5),
                                           0 0 90px rgba(59, 130, 246, 0.3);
                            }
                        }
                        @keyframes rotate-ring {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes sparkle {
                            0%, 100% { opacity: 0; transform: scale(0); }
                            50% { opacity: 1; transform: scale(1); }
                        }
                        .bot-icon-container-v2 {
                            position: relative;
                            animation: float 3s ease-in-out infinite;
                        }
                        .bot-icon-glow-v2 {
                            animation: pulse-glow 2s ease-in-out infinite;
                        }
                        .rotating-ring-v2 {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 72px;
                            height: 72px;
                            border: 2px solid transparent;
                            border-top-color: rgba(59, 130, 246, 0.6);
                            border-right-color: rgba(139, 92, 246, 0.6);
                            border-radius: 50%;
                            animation: rotate-ring 3s linear infinite;
                            pointer-events: none;
                        }
                        .rotating-ring-2-v2 {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 80px;
                            height: 80px;
                            border: 2px solid transparent;
                            border-bottom-color: rgba(139, 92, 246, 0.4);
                            border-left-color: rgba(59, 130, 246, 0.4);
                            border-radius: 50%;
                            animation: rotate-ring 4s linear infinite reverse;
                            pointer-events: none;
                        }
                        .sparkle-v2 {
                            position: absolute;
                            width: 4px;
                            height: 4px;
                            background: white;
                            border-radius: 50%;
                            animation: sparkle 2s ease-in-out infinite;
                        }
                        .sparkle-1-v2 { top: 10%; left: 20%; animation-delay: 0s; }
                        .sparkle-2-v2 { top: 20%; right: 15%; animation-delay: 0.5s; }
                        .sparkle-3-v2 { bottom: 15%; left: 25%; animation-delay: 1s; }
                        .sparkle-4-v2 { bottom: 10%; right: 20%; animation-delay: 1.5s; }
                    `}</style>

          {/* Yai Data with Dropdown - First Row */}
          <div className="flex items-center gap-4 mb-3 pointer-events-none relative">
            <div
              className={`relative ${isDropdownOpen ? "" : "bot-icon-container-v2"} pointer-events-auto`}
            >
              {/* Rotating Rings - Only show when dropdown is closed */}
              {!isDropdownOpen && (
                <>
                  <div className="rotating-ring-v2"></div>
                  <div className="rotating-ring-2-v2"></div>

                  {/* Sparkles - Only show when dropdown is closed */}
                  <div className="sparkle-v2 sparkle-1-v2"></div>
                  <div className="sparkle-v2 sparkle-2-v2"></div>
                  <div className="sparkle-v2 sparkle-3-v2"></div>
                  <div className="sparkle-v2 sparkle-4-v2"></div>
                </>
              )}

              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`relative rounded-full hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 z-10 pointer-events-auto ${isDropdownOpen ? "" : "bot-icon-glow-v2"}`}
                aria-label="Yai Agents"
              >
                <img
                  src="/assets/modules-image/yai2.png"
                  alt="Yai Agents"
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400/60 relative z-10"
                />
                {/* Gradient Overlay - Emerald (Big Brain context) */}
                {!isDropdownOpen && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/30 via-green-400/20 to-emerald-500/30 mix-blend-screen pointer-events-none"></div>
                )}
              </button>
            </div>
            <span
              className="text-white font-bold text-lg tracking-wide drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent pointer-events-auto whitespace-nowrap"
            >
              Yai Agents
            </span>

            {/* Inline row — Agent Collective + Big Brain always visible */}
            {onVersionChange && (
              <>
                <div
                  onClick={() => onVersionChange("yai1")}
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800/80 backdrop-blur-sm hover:bg-yai-blue/20 cursor-pointer transition-all border border-yai-blue/40 pointer-events-auto"
                >
                  <img
                    src="assets/modules-image/yai1.png"
                    alt="Yai 1"
                    className="w-12 h-12 rounded-full object-cover border-2 border-yai-blue/60 flex-shrink-0"
                  />
                  <span className="bg-gradient-to-r from-yai-blue via-blue-400 to-yai-blue bg-clip-text text-transparent font-bold text-lg whitespace-nowrap">Agent Collective</span>
                </div>
                <div
                  onClick={() => onVersionChange("yai2")}
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800/80 backdrop-blur-sm hover:bg-emerald-500/20 cursor-pointer transition-all border border-emerald-400/40 pointer-events-auto"
                >
                  <img
                    src="assets/modules-image/yai2.png"
                    alt="Big Brain"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/60 flex-shrink-0"
                  />
                  <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent font-bold text-lg whitespace-nowrap">Big Brain</span>
                </div>
              </>
            )}
          </div>

          {/* Second Row: Menu buttons and Bot Info */}
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 transition"
                title="Chat history"
              >
                <Menu size={20} className="text-white/70" />
              </button>
              <button
                onClick={handleNewChat}
                className="px-3 py-1.5 rounded-full hover:bg-white/10 transition text-xs font-medium text-white/70"
                title="Menu"
              >
                Menu
              </button>
            </div>
            {/* Bot Avatar and Name - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full ${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500' : 'bg-gradient-to-br from-emerald-500 to-green-600'} flex items-center justify-center border-2 border-emerald-400/60 shadow-md`}>
                  <img
                    src="assets/modules-image/yai2.png"
                    alt="Big Brain"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {KHMER_NEW_YEAR.isActive && (
                  <div className="absolute -top-1 -right-1 z-10 text-xs drop-shadow-md">🌸</div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/90">Big Brain</span>
                <span className="text-xs text-white/60 hidden sm:block">
                  Boss of 13 PA agents
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-8 bg-[#050505]/60 backdrop-blur-sm relative z-20 min-h-0 w-full flex-shrink">
          {!hasMessages ? (
            // Rare — messages have't been seeded yet. Should self-correct on next tick.
            <div className="pt-16 max-w-md mx-auto text-center text-white/60 text-sm">
              …
            </div>
          ) : (
            // Messages Display
            <div className="space-y-4 max-w-3xl mx-auto relative z-20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 group ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                      <Database size={16} className="text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[85%]">
                    <div
                      style={{ fontSize: `${chatFontSize}px`, lineHeight: 1.45 }}
                      className={`rounded-2xl px-4 py-2.5 ${
                        msg.from === "user"
                          ? KHMER_NEW_YEAR.isActive
                              ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900 border border-yellow-300 rounded-br-none shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                              : "bg-blue-500 text-white rounded-br-none"
                          : KHMER_NEW_YEAR.isActive
                              ? "bg-white/5 border-l-2 border-r border-t border-b border-l-red-500 border-white/10 text-white rounded-bl-none overflow-hidden relative shadow-[0_0_5px_rgba(220,38,38,0.1)]"
                              : "bg-white/5 border border-white/10 text-white rounded-bl-none"
                      }`}
                    >
                      {msg.from === "bot" ? (
                        <div className="markdown-content">
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={renderMarkdownContent(
                              msg.text,
                            )}
                          />
                        </div>
                      ) : msg.from === 'user' && typeof msg.text === 'string' && msg.text.includes('[IMAGE_DATA:') ? (
                        <>
                          <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                            <img src={msg.text.match(/\[IMAGE_DATA:(.*?)\]/)?.[1]} alt="Uploaded" className="max-w-full max-h-48 object-contain" />
                          </div>
                          <div className="whitespace-pre-wrap">{msg.text.replace(/\[IMAGE_DATA:.*?\]/g, '').trim()}</div>
                        </>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}
                    </div>
                    {msg.from === "bot" && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                          title="Copy"
                        >
                          <Copy size={14} className="text-white/70" />
                        </button>
                        <button
                          onClick={() => isSpeaking ? stop() : speak(msg.text)}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center"
                          title="Read Aloud in Khmer"
                        >
                          {isSpeaking ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-white/70" />}
                        </button>
                        <button
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} className="text-white/70" />
                        </button>
                        <button
                          onClick={() => {
                            handleSuggestionClick(msg.text);
                          }}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                          title="Regenerate"
                        >
                          <RefreshCw size={14} className="text-white/70" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                          title="More"
                        >
                          <MoreVertical size={14} className="text-white/70" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.from === "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-white">
                        U
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                    <Database size={16} className="text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-4 py-2">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Field with Thinking Status */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-white/10 bg-[#050505] w-full">
          <form onSubmit={handleSend} className="relative max-w-3xl mx-auto">
        {uploadedImage && (
          <div className="absolute bottom-full mb-3 left-0 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-start gap-2 shadow-xl">
              <img src={uploadedImage} alt="Upload preview" className="h-24 w-auto object-contain rounded-lg" />
              <button onClick={() => setUploadedImage(null)} type="button" className="p-1 hover:bg-white/20 rounded-full transition-colors" title="Remove attachment">
                  <X size={16} className="text-white" />
              </button>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <div className="flex items-center px-4 py-3 rounded-full border border-white/15 bg-white/5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <button
                type="button"
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors mr-2"
              >
                <Plus size={18} className="text-white/70" />
              </button>
              <textarea
                ref={inputRef}
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Enter sends, Shift+Enter inserts a newline
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask about the website... (Shift+Enter for new line)"
                className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-white/50 text-base resize-none leading-6 py-2"
                style={{ minHeight: "8.4rem", maxHeight: "14rem" }}
              />
              {!input.trim() && (
                <>
                  <span className="text-xs text-white/50 mr-2">
                    {isTyping ? "Thinking" : "Fast"}
                  </span>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors ml-2"
                  >
                    <Grid3x3 size={18} className="text-white/70" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors ml-2"
                  >
                    <Mic size={18} className="text-white/70" />
                  </button>
                </>
              )}
              {input.trim() && (
                <button
                  type="submit"
                  className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors ml-2"
                >
                  <Send size={18} className="text-white" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BotVersion2;
