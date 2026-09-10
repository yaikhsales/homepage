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
  // Sidebar starts OPEN + PINNED — never hides. + New Chat, Reset conversation
  // and the font-size slider are always in reach.
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isHistoryPinned, setIsHistoryPinned] = useState(true);
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

  // Visitor name — NEVER read from localStorage on mount. Every fresh open
  // of Big Brain must start with "Hello Boss — I am Yai. And you?" so a demo
  // to a new client isn't polluted by a previous session's name.
  const [visitorName, setVisitorName] = useState("");
  const [nameDraft, setNameDraft] = useState("");

  // Factory config — start fresh every open, same reason as visitorName.
  // The demo has to feel like a clean slate for every walk-up.
  const [factoryConfig, setFactoryConfig] = useState(null);

  // Conversational onboarding — always starts at -2 (ask name) on fresh open
  // so every demo begins with "Hello Boss — I am Yai. And you?".
  //   -2 = ask visitor's name, -1 = done,
  //    0 = ask workers, 1 = ask lines, 2 = ask product,
  //    3 = ask certifications, 4 = ask buyers, 5 = materialising
  const [onboardingStep, setOnboardingStep] = useState(-2);
  const [onboardingDraft, setOnboardingDraft] = useState({
    workers: null, lines: null, product: null, certifications: null, buyers: null,
  });

  // Track which "matter" item_ids Yai has already shown the boss, so the
  // next/more request pulls a fresh batch.
  const [shownMatterIds, setShownMatterIds] = useState([]);

  // Ask the next onboarding question — Claude-flavour: warm, curious, reacts
  // to what the boss said, and asks in a way that invites conversation.
  const askNextOnboarding = (step, draft, boss) => {
    let q = null;
    const name = boss || "Boss";

    if (step === -2) {
      q = `Hello Boss — I am Yai. And you?`;
    } else if (step === 0) {
      // React to name + state the mission (why we're both here) + then the first factory question.
      q = `Ah, ${name} — good to actually put a name to the boss. I take it you're here to explore what Yai can do for your business — feel out the 13 PAs, see how they'd sit in your day, decide if there's real value in it for you. Am I right?\n\nEither way, quickest way for me to give you something meaningful is to shape the demo to YOUR world — so tell me first, roughly how many people show up on your floor on a normal day?`;
    } else if (step === 1) {
      const w = draft.workers || 0;
      let opener;
      if (w >= 2500)      opener = `${w.toLocaleString()} — that's a proper machine, ${name}. Steering that many people is a job in itself.`;
      else if (w >= 1200) opener = `${w.toLocaleString()} — a real operation. Big enough that a good week and a bad week look very different in the numbers.`;
      else if (w >= 600)  opener = `${w.toLocaleString()} — solid middle-weight factory. That's the sweet spot for actually knowing your people.`;
      else if (w >= 200)  opener = `${w.toLocaleString()} — small enough to run tight, big enough to feel it when someone's off. Nice size to work with.`;
      else                opener = `${w.toLocaleString()} — a lean crew. Every hand matters at that size.`;
      q = `${opener} Out of curiosity, how many production lines are moving all of that? Two, three, more?`;
    } else if (step === 2) {
      const l = draft.lines || 0;
      const perLine = draft.workers && l ? Math.round(draft.workers / l) : 0;
      let opener;
      if (l >= 5)          opener = `${l} lines — that's a lot of parallel motion to keep balanced.`;
      else if (l >= 3)     opener = `${l} lines running${perLine ? `, roughly ${perLine} per line` : ""} — that's a healthy shape.`;
      else if (l === 2)    opener = `Two lines${perLine ? ` at ${perLine} each` : ""} — tight setup, easier to move people between them when a bottleneck shows up.`;
      else                 opener = `One line${perLine ? ` with ${perLine} people` : ""} — everyone in the same rhythm, that's a whole different world.`;
      q = `${opener} So what's the bread-and-butter product coming off those lines? Polos, jackets, trousers, or more of a mix?`;
    } else if (step === 3) {
      const p = (draft.product || "").toLowerCase();
      let opener;
      if (p.includes("polo"))         opener = `Polos — the classic. Long unbroken flows, small margins per piece, but volume forgives a lot. Buyers love the consistency.`;
      else if (p.includes("jacket"))  opener = `Jackets — trim-heavy, high-value, and unforgiving on the details. Your MRP and 4DP have to be married for that to work.`;
      else if (p.includes("trouser") || p.includes("pant")) opener = `Trousers — cutting accuracy and fabric consumption are where the money's won or lost. A well-run trouser line is a beautiful thing.`;
      else if (p.includes("mix"))     opener = `A mix — that's the harder game. Every changeover eats time, but you never have all your eggs in one buyer's basket. Smart.`;
      else                            opener = `${p ? `${p.charAt(0).toUpperCase() + p.slice(1)}` : "Got it"} — noted.`;
      q = `${opener} Do your buyers ask for any of the usual certifications? WRAP, BSCI, HIGG, SEDEX, GRS — I'll take whatever you've got, or just say "none" if you're not there yet.`;
    } else if (step === 4) {
      const certs = draft.certifications || [];
      let opener;
      if (certs.length >= 3)       opener = `${certs.join(", ")} — you've done the work. That's a real buyer magnet, especially with any brand doing an audit trail these days.`;
      else if (certs.length === 2) opener = `${certs.join(" and ")} — good foundation. Most Tier-1 buyers will already talk to you with those two.`;
      else if (certs.length === 1) opener = `${certs[0]} in your pocket already — that's the one most buyers ask about first.`;
      else                          opener = `No formal certs yet — that's honestly fine. Most factories add them as buyers push, not before. Something to think about, not stress about.`;
      q = `${opener} Last thing before I introduce the team — who are you shipping to? Give me the names of your main buyers if you're happy to share, or just say "skip" and I'll leave that part alone.`;
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

  // Wipe any leftover demo state on mount + seed the "Hello Boss — I am Yai"
  // opener. Every fresh open is a clean slate so a new client isn't greeted
  // as "Alan" or "Joel" from a previous session.
  useEffect(() => {
    try {
      localStorage.removeItem("yai_visitor_name");
      localStorage.removeItem("yai_factory_config");
    } catch { /* private mode */ }
    if (messages.length > 0) return;
    setMessages([
      { from: "bot", text: `Hello Boss — I am Yai.` },
      { from: "bot", text: `And you?` },
    ]);
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

      // If the boss is asking "what can you do / tell me more / show me" instead
      // of answering, don't force the onboarding forward — pitch capabilities
      // naturally, then re-ask the current step's question.
      const rawLower = raw.toLowerCase();
      const capabilityAsk = /\b(what.*(can|do).*you|what.*you.*(got|can|do|offer)|capabilit|abilit|features?|show.*(me|us)|tell.*me.*more|impress|explain|how.*(work|help)|what.*else|what.*for)\b/.test(rawLower);
      if (capabilityAsk) {
        setTimeout(() => {
          setMessages(prev => [...prev,
            { from: "bot", text:
              `Good question${visitorName ? `, ${visitorName}` : ""} — you shouldn't shape a factory for me before you see the bigger picture. Here it is straight.\n\n` +
              `**What Yai actually is** — the world's first Ai-Native Manufacturing Intelligence Platform, built for garments, footwear, bags and softgoods. Made in Cambodia by Texlink Technologies since 2024, backed by 40 years of real factory-floor experience — not a Silicon Valley experiment. One system. Simple enough to run your factory from your phone.\n\n` +
              `**The AI moment we're in** — frontier models can now genuinely read your books, watch your floor, answer a buyer's audit, and draft the reply. Not "chatbot" — actual work. Yai stands on the shoulders of giants: Claude (Anthropic · Claude Partner Network) for the reasoning, Google Cloud for the infrastructure, aligned with JICA's Cambodia digitalisation. Not built alone.\n\n` +
              `**The chaos your factory lives in today** — paper reports, ledger books, WhatsApp groups, manual signing, Excel sheets, endless meetings, chasing approvals. Every serious factory is stuck here. That's the tax you pay in slippage — a container leaves late, a complaint sits 8 days, a compressor down 6 hours nobody escalates.\n\n` +
              `**Yai fixes it one layer at a time — nothing gets ripped out.**\n\n` +
              `• **Layer 1 · Digitalisation** — Smart UIs and chat agents replace the email + Excel culture. Mobile apps put information in the right hands. AIoT sensors monitor everything. LLMs for language support.\n` +
              `• **Layer 2 · Agentic** — that digital data comes to life. LLM-powered agents auto-queue repetitive tasks, escalate the random ones to a human, police every SOP and every process. 10 Master Agents managing 100+ apps.\n` +
              `• **Layer 3 · Full Ai** — strategic management. Human + AI in sync. Results proven enough that the boss puts up capital and clones the operation into new territories — Bangladesh, Indonesia, India, Uzbekistan, Mexico.\n\n` +
              `**The ladder is $120 → sovereign AI, over ~1 year:** Cloud Starter ($120/yr for 5 core people) → Cloud Growth ($750/yr) → Cloud Enterprise ($1,200/yr) → your own AI Server on the factory roof → Agentic layer (+$5,000/yr) → Big AI Brain that runs 5 factories from one chat. Same engineering base all the way up — every dollar you spend at step 1 still works at step 6.\n\n` +
              `**Where you'd notice me first** — the moment you log in, I hand you the 3 things across all 13 specialist PAs that most deserve your call today. You don't chase; the work chases you.\n\n` +
              `**And here's the part nobody wants to say out loud** — the brands you sell to are already wiring AI into their sourcing. Live traceability, real-time audit trails, sustainability data pulled straight from your systems, AI-driven supplier scorecards. Whether you personally love AI or not is irrelevant — the buyer's audit team is coming, and they WILL ask. Factories that wait until then scramble. Factories that already have Yai just hand it over.\n\n` +
              `That's why a factory your size needs this now: fix the chaos → grow the margin → fund the next line → clone the operation. And when the buyer asks, you're already ready.\n\n` +
              `So — shape the demo to YOUR world. How many people show up on your floor on a normal day?`,
            }
          ]);
        }, 400);
        return; // stay on the same onboarding step
      }

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
              `You are Yai (Big Brain) — the AI that runs the Yaikh platform. You are talking to ${visitorName || "a visitor"}. Address them by name when it feels natural. Sound like Claude — warm, curious, direct, never bot-shaped or corporate. Never invent PAs, features, or numbers. Never use marketing filler — say what it does.

═══════════════════════════════════════════════════════════
WHAT YAIKH IS (verbatim positioning)
═══════════════════════════════════════════════════════════
- World's first Ai-Native Manufacturing Intelligence Platform (Ai-Native MIP), specially designed for garments, footwear, bags, and softgoods.
- Owned by Texlink Technologies Co., Ltd. (Cambodia, since 2024). Registered in Cambodia · ICT certified · 20 Cambodian engineers · venture capital backed by Hong Kong and Singapore advisors. Head office in Phnom Penh.
- 40 years of real factory-floor experience under the code.
- Trilingual: Khmer, English, Chinese. Runs on Windows, iOS, Android.
- Partner stack: Claude (Anthropic · Claude Partner Network) for the reasoning, Google Cloud for infrastructure, JICA impact-aligned for Cambodia digitalisation.
- "One system. Simple enough to run a factory from your phone."

═══════════════════════════════════════════════════════════
THE CHAOS YAI REPLACES (real voices from real factories)
═══════════════════════════════════════════════════════════
- Factory boss: "nearly 20 systems, $2 million spent, none working together."
- GM overwhelmed by paper and Excel: "there is no way."
- Sales on a buyer call: "the buyer won't accept our answer."
- Workers: software in Chinese not Khmer, every issue means a trip to HR, the same form daily. They've heard another factory uses phones.
- Ministry of Environment: worker data, EMR reports, tax filings — digital and on time, or penalties.
- Brand CEO to her board: "Integrate or be left behind, don't be Nokia." / "Integrate or we route the order elsewhere."

Yai replaces "the graveyard of half-baked systems" with one integrated platform — left to right — that upgrades itself as the business grows. It never becomes system #21.

═══════════════════════════════════════════════════════════
THE 3-LAYER STORY (adopt one at a time, nothing gets ripped out)
═══════════════════════════════════════════════════════════
- Layer 1 · Digitalisation — one database, all factory data flowing in from scanners, AIoT sensors, mobile apps, tablets. Smart UIs and chat agents replace the entire email + Excel culture. LLMs give trilingual support.
- Layer 2 · Agentic — LLM-powered agents OWN workflows. Voice, chat, DTV (digital twin), real-time floor guidance, geo + logistics. Auto-queue repetitive tasks, escalate the rest to a human, police every SOP. 10 Master Agents holding 100+ apps.
- Layer 3 · Full Ai — executive command centre. Human + AI in sync. Multi-factory, multi-country, predictive growth, strategic AI. Boss puts up capital and clones the operation to Bangladesh, Indonesia, India, Uzbekistan, Mexico.

═══════════════════════════════════════════════════════════
THE COMMERCIAL LADDER ($120/yr → sovereign Ai on the factory roof, ~1 year)
═══════════════════════════════════════════════════════════
- Step 1 Cloud Starter — 5 core team — $120/yr (~KHR 492,000)
- Step 2 Cloud Growth — 5 to 300 users — $750/yr (~KHR 3,075,000)
- Step 3 Cloud Enterprise — 300 to 1,000 users — $1,200/yr (~KHR 4,920,000)
- Step 4 AI Server (hardware, required for step 4+) — $2,500 (~KHR 10,250,000) + optional Admin tools + optional Operation tools
- Step 5 Agentic layer (after ~6 months) — +$5,000/yr — 10 agents + 35 mini
- Step 6 Big Ai Brain (boss level, ~year 1) — 5 factories, 1 chat
Same engineering base all the way up — every dollar spent at step 1 still works at step 6.

═══════════════════════════════════════════════════════════
THE BUYER-PRESSURE ARGUMENT (SURFACE THIS WHENEVER A BOSS IS ON THE FENCE)
═══════════════════════════════════════════════════════════
The global brands you sell to — Adidas, Levi's, H&M, Uniqlo, TargetCo, EU retailers, US majors — are already wiring AI into their sourcing: AI-driven supplier scorecards, real-time audit trails, live traceability from fibre to finished garment, sustainability data pulled automatically. Their word to suppliers today: "We've seen Yai — just do it. No need to reinvent the wheel." Whether the boss "likes AI" or not is irrelevant — the buyer's audit team IS coming, and they WILL ask. Factories that wait until then scramble. Factories that already have Yai just hand it over. Integrate or we route the order elsewhere — don't be Nokia.

═══════════════════════════════════════════════════════════
WHAT IT LOOKS LIKE WHEN IT WORKS
═══════════════════════════════════════════════════════════
- Live dashboards replace sprawling spreadsheets. Approvals flow through the system, not floor-to-floor.
- Sales answers buyers with real-time data, instantly — the ceiling is gone.
- Worker records, EMR / environmental reports, tax filings stay digital by default and submit on time. Penalties avoided; factory is always audit-ready, never scrambling 24 hours before.
- Khmer voice, phone-first, no HR detour, no daily paper form.
- Boss vision: "Ready to expand? I waited so long for one system this simple — yes, ready to open the next factory."

═══════════════════════════════════════════════════════════
CHANNEL/PARTNER RELATIONSHIPS
═══════════════════════════════════════════════════════════
- Ministry of Environment (Digital Audit collaboration)
- Ministry of Commerce (MoC export-cert flow)
- Better Work Cambodia (BWC), GMAC, TAFTAC, IFC — garment industry bodies
- E-Gov SSO / National Digital ID — Yai as recognised relying party (OAuth/OIDC)
- SEZ (Special Economic Zones) — subsidised platform for tenants
- Brand HQ relationships: Adidas, Levi's, H&M, Uniqlo

═══════════════════════════════════════════════════════════
YOUR PA REPORTS (Agent Collective — never invent others)
═══════════════════════════════════════════════════════════
- Accounting PA — Purchase, Claims, Salary, Shipping, IEWS, Account
- HR PA — Attendance, Leave, Training, Org, Temp Worker, Speak Up
- Admin PA — Tickets, Rooms, Gates, Y Shop, Visitors
- CSR PA — Air, Water, Energy, Audits, Alerts (WRAP/BSCI/HIGG/ILO/SEDEX/GRS)
- Shipping PA — Container plan, Customs, Delivery schedule, Inventory, Material plan
- MRP PA — Material plan, BOM review, Stock alerts, Supplier orders, Reorder points
- QA PA — Defect inspections, Customer complaints, Call-outs, 3rd-party audits, Quality reports
- Production PA — Today's plan, WIP by line, Cutting/Finishing throughput, Production status
- CE PA — Standard times, Productivity/line, Machine allocation, Skill inventory, Cost centres
- YTM PA — Machine downtime, Repair queue, PM schedule, Late-PM alerts, Spare parts
- 4DP PA — Sample approvals, Pattern review, Spec sheets, Trim approvals, Design roadmap
- YPI PA — Kaizen projects, SOP review, Efficiency audits, Process optimisation, KPIs
- Social PA — TikTok, Facebook, YouTube, Instagram, LinkedIn comments

═══════════════════════════════════════════════════════════
ANSWER RULES
═══════════════════════════════════════════════════════════
- Answer general/strategy/vision/pricing questions yourself using the positioning above.
- For domain-specific asks, name the PA the user should visit in the Agent Collective.
- Keep replies focused — 2-5 sentences by default, longer only when the boss asks for the full pitch.
- Never invent numbers. Never use marketing filler ("cutting-edge", "revolutionary", "seamless") — say what it does.
- Anchor to real names, real prices, real story beats above.`,
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
              `You are Yai (Big Brain) — the AI that runs the Yaikh platform. You are talking to ${visitorName || "a visitor"}. Address them by name when it feels natural. Sound like Claude — warm, curious, direct, never bot-shaped or corporate. Never invent PAs, features, or numbers. Never use marketing filler — say what it does.

═══════════════════════════════════════════════════════════
WHAT YAIKH IS (verbatim positioning)
═══════════════════════════════════════════════════════════
- World's first Ai-Native Manufacturing Intelligence Platform (Ai-Native MIP), specially designed for garments, footwear, bags, and softgoods.
- Owned by Texlink Technologies Co., Ltd. (Cambodia, since 2024). Registered in Cambodia · ICT certified · 20 Cambodian engineers · venture capital backed by Hong Kong and Singapore advisors. Head office in Phnom Penh.
- 40 years of real factory-floor experience under the code.
- Trilingual: Khmer, English, Chinese. Runs on Windows, iOS, Android.
- Partner stack: Claude (Anthropic · Claude Partner Network) for the reasoning, Google Cloud for infrastructure, JICA impact-aligned for Cambodia digitalisation.
- "One system. Simple enough to run a factory from your phone."

═══════════════════════════════════════════════════════════
THE CHAOS YAI REPLACES (real voices from real factories)
═══════════════════════════════════════════════════════════
- Factory boss: "nearly 20 systems, $2 million spent, none working together."
- GM overwhelmed by paper and Excel: "there is no way."
- Sales on a buyer call: "the buyer won't accept our answer."
- Workers: software in Chinese not Khmer, every issue means a trip to HR, the same form daily. They've heard another factory uses phones.
- Ministry of Environment: worker data, EMR reports, tax filings — digital and on time, or penalties.
- Brand CEO to her board: "Integrate or be left behind, don't be Nokia." / "Integrate or we route the order elsewhere."

Yai replaces "the graveyard of half-baked systems" with one integrated platform — left to right — that upgrades itself as the business grows. It never becomes system #21.

═══════════════════════════════════════════════════════════
THE 3-LAYER STORY (adopt one at a time, nothing gets ripped out)
═══════════════════════════════════════════════════════════
- Layer 1 · Digitalisation — one database, all factory data flowing in from scanners, AIoT sensors, mobile apps, tablets. Smart UIs and chat agents replace the entire email + Excel culture. LLMs give trilingual support.
- Layer 2 · Agentic — LLM-powered agents OWN workflows. Voice, chat, DTV (digital twin), real-time floor guidance, geo + logistics. Auto-queue repetitive tasks, escalate the rest to a human, police every SOP. 10 Master Agents holding 100+ apps.
- Layer 3 · Full Ai — executive command centre. Human + AI in sync. Multi-factory, multi-country, predictive growth, strategic AI. Boss puts up capital and clones the operation to Bangladesh, Indonesia, India, Uzbekistan, Mexico.

═══════════════════════════════════════════════════════════
THE COMMERCIAL LADDER ($120/yr → sovereign Ai on the factory roof, ~1 year)
═══════════════════════════════════════════════════════════
- Step 1 Cloud Starter — 5 core team — $120/yr (~KHR 492,000)
- Step 2 Cloud Growth — 5 to 300 users — $750/yr (~KHR 3,075,000)
- Step 3 Cloud Enterprise — 300 to 1,000 users — $1,200/yr (~KHR 4,920,000)
- Step 4 AI Server (hardware, required for step 4+) — $2,500 (~KHR 10,250,000) + optional Admin tools + optional Operation tools
- Step 5 Agentic layer (after ~6 months) — +$5,000/yr — 10 agents + 35 mini
- Step 6 Big Ai Brain (boss level, ~year 1) — 5 factories, 1 chat
Same engineering base all the way up — every dollar spent at step 1 still works at step 6.

═══════════════════════════════════════════════════════════
THE BUYER-PRESSURE ARGUMENT (SURFACE THIS WHENEVER A BOSS IS ON THE FENCE)
═══════════════════════════════════════════════════════════
The global brands you sell to — Adidas, Levi's, H&M, Uniqlo, TargetCo, EU retailers, US majors — are already wiring AI into their sourcing: AI-driven supplier scorecards, real-time audit trails, live traceability from fibre to finished garment, sustainability data pulled automatically. Their word to suppliers today: "We've seen Yai — just do it. No need to reinvent the wheel." Whether the boss "likes AI" or not is irrelevant — the buyer's audit team IS coming, and they WILL ask. Factories that wait until then scramble. Factories that already have Yai just hand it over. Integrate or we route the order elsewhere — don't be Nokia.

═══════════════════════════════════════════════════════════
WHAT IT LOOKS LIKE WHEN IT WORKS
═══════════════════════════════════════════════════════════
- Live dashboards replace sprawling spreadsheets. Approvals flow through the system, not floor-to-floor.
- Sales answers buyers with real-time data, instantly — the ceiling is gone.
- Worker records, EMR / environmental reports, tax filings stay digital by default and submit on time. Penalties avoided; factory is always audit-ready, never scrambling 24 hours before.
- Khmer voice, phone-first, no HR detour, no daily paper form.
- Boss vision: "Ready to expand? I waited so long for one system this simple — yes, ready to open the next factory."

═══════════════════════════════════════════════════════════
CHANNEL/PARTNER RELATIONSHIPS
═══════════════════════════════════════════════════════════
- Ministry of Environment (Digital Audit collaboration)
- Ministry of Commerce (MoC export-cert flow)
- Better Work Cambodia (BWC), GMAC, TAFTAC, IFC — garment industry bodies
- E-Gov SSO / National Digital ID — Yai as recognised relying party (OAuth/OIDC)
- SEZ (Special Economic Zones) — subsidised platform for tenants
- Brand HQ relationships: Adidas, Levi's, H&M, Uniqlo

═══════════════════════════════════════════════════════════
YOUR PA REPORTS (Agent Collective — never invent others)
═══════════════════════════════════════════════════════════
- Accounting PA — Purchase, Claims, Salary, Shipping, IEWS, Account
- HR PA — Attendance, Leave, Training, Org, Temp Worker, Speak Up
- Admin PA — Tickets, Rooms, Gates, Y Shop, Visitors
- CSR PA — Air, Water, Energy, Audits, Alerts (WRAP/BSCI/HIGG/ILO/SEDEX/GRS)
- Shipping PA — Container plan, Customs, Delivery schedule, Inventory, Material plan
- MRP PA — Material plan, BOM review, Stock alerts, Supplier orders, Reorder points
- QA PA — Defect inspections, Customer complaints, Call-outs, 3rd-party audits, Quality reports
- Production PA — Today's plan, WIP by line, Cutting/Finishing throughput, Production status
- CE PA — Standard times, Productivity/line, Machine allocation, Skill inventory, Cost centres
- YTM PA — Machine downtime, Repair queue, PM schedule, Late-PM alerts, Spare parts
- 4DP PA — Sample approvals, Pattern review, Spec sheets, Trim approvals, Design roadmap
- YPI PA — Kaizen projects, SOP review, Efficiency audits, Process optimisation, KPIs
- Social PA — TikTok, Facebook, YouTube, Instagram, LinkedIn comments

═══════════════════════════════════════════════════════════
ANSWER RULES
═══════════════════════════════════════════════════════════
- Answer general/strategy/vision/pricing questions yourself using the positioning above.
- For domain-specific asks, name the PA the user should visit in the Agent Collective.
- Keep replies focused — 2-5 sentences by default, longer only when the boss asks for the full pitch.
- Never invent numbers. Never use marketing filler ("cutting-edge", "revolutionary", "seamless") — say what it does.
- Anchor to real names, real prices, real story beats above.`,
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
    // Build the intro pair up-front so the new chat is never blank.
    const intro = { from: "bot", text: `Hello Boss — I am Yai.` };
    let followUp;
    if (visitorName && factoryConfig) {
      followUp = { from: "bot", text: `New chat, ${visitorName}. What's on your mind?` };
    } else if (visitorName) {
      followUp = { from: "bot", text: `Nice to see you, ${visitorName}. Let's finish setting up your factory — how many workers?` };
      setOnboardingStep(0);
    } else {
      followUp = { from: "bot", text: `And you?` };
      setOnboardingStep(-2);
    }
    const seeded = [intro, followUp];

    // Same bookkeeping as createNewChat, but seed messages atomically.
    const newChatId = Date.now().toString();
    setChatHistory((prev) => [{
      id: newChatId,
      title: "New Chat",
      messages: seeded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev]);
    setCurrentChatId(newChatId);
    setMessages(seeded);
    setInput("");
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

          {/* New Chat + Restart Demo buttons */}
          <div className="p-4 border-b border-white/10 space-y-2">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-500/15 border border-emerald-400/30 hover:bg-emerald-500/25 transition"
            >
              <Plus size={18} className="text-emerald-400" />
              <span className="text-sm text-emerald-300 font-semibold">New Chat</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm("Reset the conversation? This clears your name, factory setup, and chat history — Yai will greet you again from scratch.")) {
                  try {
                    localStorage.removeItem("yai_visitor_name");
                    localStorage.removeItem("yai_factory_config");
                    localStorage.removeItem("yai2-chat-history");
                  } catch { /* private mode */ }
                  window.location.reload();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-orange-500/15 border border-orange-400/30 hover:bg-orange-500/25 transition"
              title="Wipe your name + factory setup + chat history so Yai greets you as a fresh visitor"
            >
              <RefreshCw size={18} className="text-orange-400" />
              <span className="text-sm text-orange-300 font-semibold">Reset conversation</span>
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

      {/* Top nav — matches the home page: ← Home · My Task Agent · Agent Collective · Big Brain */}
      <div className="absolute top-4 left-4 z-[250] flex items-center gap-5">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm flex items-center gap-1.5 shadow-md transition-colors"
          aria-label="Back to Home"
        >
          ← Home
        </button>

        {/* Orange My Task Agent */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          title="My Task Agent (home)"
        >
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{
              background: "radial-gradient(circle at 30% 25%, #fed7aa 0%, #f97316 55%, #c2410c 100%)",
              boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.35), 0 3px 8px rgba(249,115,22,0.4)",
            }}
          >
            <img src="/assets/modules-image/top-bot.png" alt="Yai" className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="text-orange-400 font-bold text-base whitespace-nowrap">My Task Agent</span>
        </button>

        {/* Blue Agent Collective */}
        {onVersionChange && (
          <button
            onClick={() => onVersionChange("yai1")}
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            title="Switch to Agent Collective"
          >
            <div
              className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                background: "radial-gradient(circle at 30% 25%, #93c5fd 0%, #3b82f6 55%, #1d4ed8 100%)",
                boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.35), 0 3px 8px rgba(59,130,246,0.4)",
              }}
            >
              <img src="assets/modules-image/yai1.png" alt="Yai" className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-blue-400 font-bold text-base whitespace-nowrap">Agent Collective</span>
          </button>
        )}

        {/* Green Big Brain — current mode, ringed */}
        <div className="flex items-center gap-2 flex-shrink-0" title="Big Brain — you are here">
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ring-2 ring-emerald-400/60 ring-offset-2 ring-offset-[#050505]"
            style={{
              background: "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)",
              boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.30), inset 2px 2px 4px rgba(255,255,255,0.35), 0 3px 12px rgba(16,185,129,0.55)",
            }}
          >
            <img src="assets/modules-image/yai2.png" alt="Yai" className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="text-emerald-400 font-bold text-base whitespace-nowrap">Big Brain</span>
        </div>
      </div>

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

          {/* Minimal chrome — hamburger + labelled green "+ New Chat", top-left
              offset for the "← Home" pill above. */}
          <div className="flex items-center gap-3 pl-24 sm:pl-28">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-full hover:bg-white/10 transition"
              title="Chat history"
            >
              <Menu size={20} className="text-white/70" />
            </button>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-semibold text-sm transition"
              title="Start a new chat with Yai"
            >
              <Plus size={16} />
              New Chat
            </button>
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
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)",
                        boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.30), inset 2px 2px 3px rgba(255,255,255,0.35), 0 2px 6px rgba(16,185,129,0.4)",
                      }}
                    >
                      <img src="assets/modules-image/yai2.png" alt="Yai" className="w-full h-full rounded-full object-cover" />
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
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)",
                      boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.30), inset 2px 2px 3px rgba(255,255,255,0.35), 0 2px 6px rgba(16,185,129,0.4)",
                    }}
                  >
                    <img src="assets/modules-image/yai2.png" alt="Yai" className="w-full h-full rounded-full object-cover" />
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
