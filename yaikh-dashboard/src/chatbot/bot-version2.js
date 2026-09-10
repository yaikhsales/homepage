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
  // Step values: -2 name, -1 mission check, 0..4 factory questions,
  // 5 materialising (input blocked), 99 DONE — normal chat from here on.
  const [onboardingStep, setOnboardingStep] = useState(-2);
  const [onboardingDraft, setOnboardingDraft] = useState({
    workers: null, lines: null, product: null, certifications: null, buyers: null,
  });

  // Boss pace: "short" = every bubble capped at 2 sentences. Set when the
  // boss shows frustration and picks shorter answers. repairMode = the last
  // bot bubble was the "what would be more useful?" repair question.
  const [bossPacePreference, setBossPacePreference] = useState(null);
  const [repairMode, setRepairMode] = useState(false);
  const capShort = (text) => {
    if (bossPacePreference !== "short") return text;
    const sentences = text.replace(/\n+/g, " ").match(/[^.!?]+[.!?]+["')\]]?/g);
    return sentences && sentences.length > 2 ? sentences.slice(0, 2).join(" ").trim() : text;
  };

  // Track which "matter" item_ids Yai has already shown the boss, so the
  // next/more request pulls a fresh batch.
  const [shownMatterIds, setShownMatterIds] = useState([]);

  // Ask the next onboarding question — Bernie Sanders style: short,
  // plain, direct, one small idea per bubble. Never a wall of text.
  const askNextOnboarding = (step, draft, boss) => {
    let q = null;
    const name = boss || "Boss";

    if (step === -2) {
      q = `Hello Boss — I am Yai. And you?`;
    } else if (step === -1) {
      // After name capture — short mission check. WAIT for boss to say yes.
      q = `Good to meet you, ${name}. I take it you're here to see what Yai can do for you. Am I right?`;
    } else if (step === 0) {
      // After mission confirmed — short lead-in + first factory question.
      q = `Good. So — how many people show up on your floor on a normal day?`;
    } else if (step === 1) {
      const w = draft.workers || 0;
      let opener;
      if (w >= 2500)      opener = `${w.toLocaleString()} — that's a proper machine, ${name}.`;
      else if (w >= 1200) opener = `${w.toLocaleString()} — a real operation.`;
      else if (w >= 600)  opener = `${w.toLocaleString()} — solid middle-weight factory.`;
      else if (w >= 200)  opener = `${w.toLocaleString()} — nice size to work with.`;
      else                opener = `${w.toLocaleString()} — a lean crew.`;
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
      q = `${opener} On the floor — where does your team lose the most sleep? Quality drift, machine downtime, cost and efficiency (IE / standard time), tech-pack chaos, inventory surprises, or merchandising bottleneck? Any one is fine — or say "all of them" if it's the whole set.`;
    } else if (step === 4) {
      const pains = draft.painPoints || [];
      const PAIN_OPENER = {
        "quality":         `Quality drift — that's the one buyers see first. My QA PA watches upstream material, fabric relaxation, marker consumption, 4-point and AQL, complaints and Call-Out silence. Nothing sits.`,
        "maintenance":     `Machine downtime — quietest killer on the floor. My YTM PA tracks every machine, repair queue, spare-parts stock, and predicts failures from vibration + heat trends before the line stops.`,
        "cost-efficiency": `Cost and efficiency — the IE side. My CE PA owns standard time, productivity by line, machine allocation, skill inventory and cost-center rollup. Line-by-line, hour-by-hour.`,
        "tech-details":    `Tech-pack chaos — the Cambodia special. My YPI PA is trilingual (Khmer / English / Chinese), one record per style, feeding shop-floor iPads and TVs so no one guesses.`,
        "inventory":       `Inventory surprises — my MRP PA owns BOM, stock, reorder points, supplier orders, and the customs/GDT side for imports. No surprise short at cutting.`,
        "merchandising":   `Merchandising bottleneck — my YPI PA runs the full pre-production spine: buyer sample approvals, sourcing, purchase orders, invoices, and handoff to 4DP planning when material lands.`,
        "all":             `All of it — that's why I exist. Every one of my 13 PAs watches its own patch and escalates only what needs your call.`,
        "mixed":           `Noted — mixed picture. I'll shape the demo across a couple of PAs so you can see the pattern.`,
      };
      const opener = PAIN_OPENER[pains[0]] || PAIN_OPENER["mixed"];
      q = `${opener} Last thing — and I won't ask your buyer names, order numbers, or volumes; that's your business, not mine to pull. Instead let me pick a public brand as an example: **GAP** — US mass-market, WRAP + Higg required, tight 6-week lead. **Is that close to your world, or would sports (Adidas / Nike), luxury (Armani / Gucci), or workwear (Carhartt / Patagonia) be a closer fit?** Yes/no or one word is fine.`;
    }

    if (q) setMessages(prev => [...prev, { from: "bot", text: capShort(q) }]);
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
      // 99 = onboarding DONE. (-1 is the mission check now — reusing it here
      // made the next boss message restart the whole onboarding.)
      setOnboardingStep(99);
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

      const welcome = bossPacePreference === "short"
        ? `Alright ${bossName} — your ${payload.workers.toLocaleString()}-worker ${productLower} factory is loaded. ` +
          (mattersList.length
            ? `${mattersList.length} matters need your eye first — say a number to open one.`
            : `What's keeping you awake this week?`)
        : `Alright ${bossName} — your ${payload.workers.toLocaleString()}-worker ${productLower} factory is loaded ` +
          `(${payload.lines} line${payload.lines === 1 ? "" : "s"}, ${data.tasksSeeded} live tasks across the team).\n\n` +
          `Quick thoughts before we dig in: ${observation}${certLine}\n\n` +
          buyerLine +
          mattersBlock +
          closer;
      setMessages(prev => [...prev, { from: "bot", text: welcome }]);
    } catch (err) {
      setOnboardingStep(4); // back to the last question so they can retry
      setMessages(prev => [...prev, { from: "bot", text:
        `I couldn't set the factory up: ${err.message}. Try answering the last question again, or refresh.`,
      }]);
    }
  };

  // Wipe leftover state + open with ONE short line. Bernie Sanders style:
  // plain, direct, one idea per bubble, wait for the boss to reply.
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
  // Chat history is intentionally MEMORY-ONLY: it lives in the sidebar while
  // the page stays open and is gone on refresh or tab close. Privacy choice —
  // nothing a visitor says is persisted in their browser.
  const [chatHistory, setChatHistory] = useState([]);
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

  // One-time cleanup: older builds persisted chats to localStorage. History
  // is memory-only now, so wipe anything a previous visit left behind.
  useEffect(() => {
    try { localStorage.removeItem("yai2-chat-history"); } catch { /* private mode */ }
  }, []);

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
    // History entry is created lazily by updateChatInHistory on the first
    // user message — an untouched new chat leaves no trace in the sidebar.
    setCurrentChatId(Date.now().toString());
    setMessages([]);
    setInput("");
  };

  const chatTitleFrom = (msgs) => {
    const firstUser = msgs.find((m) => m.from === "user");
    if (!firstUser?.text) return "New Chat";
    const t = firstUser.text.trim();
    return t.length > 40 ? t.substring(0, 40).trimEnd() + "…" : t;
  };

  const updateChatInHistory = (chatId, newMessages) => {
    // A chat only earns a sidebar entry once it has a real user message —
    // seed-only chats never touch history, so no "New Chat" clutter.
    if (!newMessages.some((m) => m.from === "user")) return;
    setChatHistory((prev) => {
      if (!prev.some((c) => c.id === chatId)) {
        return [
          {
            id: chatId,
            title: chatTitleFrom(newMessages),
            messages: newMessages,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
      return prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: newMessages,
              title: chatTitleFrom(newMessages),
              updatedAt: new Date().toISOString(),
            }
          : chat,
      );
    });
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

    // ── Repair mode: the last bot bubble asked "what would be more useful?"
    // Handle the boss's pick BEFORE the frustration regex (their answer may
    // itself contain "shorter"), and before any step logic.
    if (repairMode) {
      const pick = input.trim();
      setMessages(prev => [...prev, { from: "user", text: pick }]);
      setInput("");
      setRepairMode(false);
      setBossPacePreference("short"); // they flagged pace — stay short from here
      const wantsTopic = /(^|\b)(c\b|different|topic|something else)/i.test(pick);
      if (wantsTopic) {
        setTimeout(() => setMessages(prev => [...prev, { from: "bot", text: "Alright — your call. What do you want to talk about?" }]), 400);
      } else if (onboardingStep >= -2 && onboardingStep <= 4) {
        setTimeout(() => askNextOnboarding(onboardingStep, onboardingDraft, visitorName), 400);
      } else {
        setTimeout(() => setMessages(prev => [...prev, { from: "bot", text: "Short it is. What do you want to know?" }]), 400);
      }
      return;
    }

    // ── Frustration detection: never advance a step, never proceed with the
    // planned reply, never parrot their words back. One short repair bubble.
    const frustratedCheck = /\b(not a conversation|too long|boring|lectur\w*|scolded|not what i want|disappoint\w*|dissapoint\w*|shorter|simpler|not helpful|not helping|wall of text|too much|slow down)\b/i.test(input.trim().toLowerCase());
    if (frustratedCheck) {
      setMessages(prev => [...prev, { from: "user", text: input.trim() }]);
      setInput("");
      setRepairMode(true);
      setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
        "I hear you — my apology, Boss. Let me slow down. What would be more useful right now: (a) skip to real questions, (b) shorter answers, or (c) a different topic?",
      }]), 400);
      return;
    }

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
      const capabilityAsk = /\b(what.*(can|do).*you|what.*you.*(got|can|do|offer)|capabilit|abilit|features?|show.*(me|us)|impress|explain|how.*(work|help)|what.*else|what.*for|tell me about|who are you|what are you|about yai|about yourself|introduce)\b/.test(rawLower);
      const tellMeMore = /\b(tell me more|fuller version|full version|full pitch|go deeper|long version)\b/i.test(rawLower);
      // At mission check (-1), a plain "yes / sure / please / go ahead" IS a
      // request to hear the pitch — that's literally what Yai just asked.
      const missionYes = onboardingStep === -1 &&
        /^(y|yes|yeah|yep|yup|sure|correct|right|of course|please|go ahead|okay|ok|fine)\b/i.test(raw.trim());
      const missionNo = onboardingStep === -1 &&
        /^(n|no|nope|not really|not exactly)\b/i.test(raw.trim());

      // Default pitch: 5 short bubbles, Bernie style. The 12-paragraph wall
      // lives behind an explicit "tell me more" only.
      if (missionNo) {
        setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
          `Fair — what would be more useful then? Something specific on your mind, or should I just skip to real questions?`,
        }]), 400);
        setOnboardingStep(0); // move past mission check either way
        return;
      }

      if ((capabilityAsk || missionYes) && !tellMeMore) {
        const bubbles = [
          `Simple. I run your factory from your phone. 13 department agents inside — quality, cost, production, accounting, HR, all of them. I sit on top and route.`,
          `Made in Cambodia, by Texlink. On Claude. On Google Cloud. Built by people who spent 40 years on the factory floor.`,
          `One system. No more paper, WhatsApp chains, or Excel. Everything moves through Yai. I watch it live.`,
          `In 2 to 3 years, this will be the norm — brands are already scoring you on live data. Whoever wires it in first wins.`,
          `So — best way to show you is to shape a demo to your world. How many people on your floor? (Fuller version anytime — just say "tell me more".)`,
        ];
        const toPost = bossPacePreference === "short" ? [bubbles[0], bubbles[4]] : bubbles;
        toPost.forEach((text, i) =>
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text }]), 400 + i * 700),
        );
        if (onboardingStep === -1) setOnboardingStep(0);
        return; // otherwise stay on the same onboarding step
      }

      if (tellMeMore) {
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
              `**And here's the part nobody wants to say out loud** — AI in manufacturing is becoming the operating norm within 2-3 years. Not a compliance box, not a nice-to-have — the baseline. Look at what's already real: EU Digital Product Passport arriving 2027, mandatory for textiles. US UFLPA forcing fibre-level traceability. Higg / Worldly / Bluesign scoring you on data feeds you don't have. Adidas, H&M, Uniqlo, Inditex consolidating orders to fewer, smarter suppliers. Fast fashion compressed design-to-shelf from 6 months to 3 weeks. Cambodia's minimum wage climbing, Vietnam and Bangladesh right behind you. Post-COVID container ETAs slip weekly.\n\n` +
              `None of that goes away. It's not about "if your buyer asks" — it's about who wires this in first and who lags. Factories that install AI in 2026 have 2 years of trained data when the buyer requires it in 2028. Factories that start in 2028 begin from zero — and by then the order has moved to whoever didn't wait.\n\n` +
              `So the frame is simple: fix the chaos → hold the margin as costs climb → fund the next line → clone the operation. Don't be Nokia. Don't be the last factory on paper.\n\n` +
              `Shape the demo to YOUR world. How many people show up on your floor on a normal day?`,
            }
          ]);
        }, 400);
        // The pitch closes by asking the workers question, so a boss who asked
        // "what can you do" during the mission check is now effectively at step 0.
        if (onboardingStep === -1) setOnboardingStep(0);
        return; // otherwise stay on the same onboarding step
      }

      // ── Topical question intercept ──────────────────────────────────
      // Boss is not answering the onboarding question — they're asking
      // ABOUT something (production apps, quality, HR, planning, etc.).
      // Answer briefly with the relevant PAs + suggest neighbours,
      // then softly re-ask the current onboarding question.
      // No number in the message + at least one topic keyword = topical ask.
      const looksLikeQuestion = /\?|^(what|which|how|tell|show|list|give|any|are|do|does|can|is)\b/i.test(raw);
      const noNumberYet = !(raw.replace(/,/g, "").match(/\d{1,5}/g) || []).length;
      const topicHits = {
        production: /\b(production|floor|line|sewing|assembl|output|wip|throughput)\b/i.test(raw),
        quality:    /\b(quality|qa|qms|defect|inspection|aql|4[- ]?pt|call.?out)\b/i.test(raw),
        planning:   /\b(4dp|planning|capacity|schedule|sales.?situation)\b/i.test(raw),
        techpack:   /\b(ypi|tech.?pack|measurement|trim|packing|sample.?stage|merchandis|sourc|bom.?fabric)\b/i.test(raw),
        material:   /\b(mrp|material|warehouse|inventory|stock|reorder|purchase|supplier)\b/i.test(raw),
        shipping:   /\b(shipping|container|customs|port|freight|delivery|inbound|outbound)\b/i.test(raw),
        machine:    /\b(ytm|machine|maintenance|downtime|repair|spare|compressor)\b/i.test(raw),
        cost:       /\b(ce|kaizen|standard.?time|productivity|cost.?center|efficien|ie)\b/i.test(raw),
        hr:         /\b(hr|yhr|worker|people|staff|attendance|payroll|union|speak.?up)\b/i.test(raw),
        admin:      /\b(admin|gate|canteen|fan|ac|dorm|y.?shop|org.?chart)\b/i.test(raw),
        finance:    /\b(accounting|finance|invoice|payment|bank|book|ledger|payable|receivable)\b/i.test(raw),
        social:     /\b(social|tiktok|facebook|instagram|youtube|linkedin|comment)\b/i.test(raw),
        csr:        /\b(csr|esg|wrap|bsci|ilo|higg|grs|compliance|audit.*(brand|buyer))\b/i.test(raw),
        modulesAsk: /\b(module|app|pa\b|agent|department|dept|tool|feature)s?\b/i.test(raw),
      };
      const hitCount = Object.values(topicHits).filter(Boolean).length;
      if (looksLikeQuestion && noNumberYet && hitCount > 0) {
        const bubbles = [];
        // Answer the direct topic first
        if (topicHits.production) {
          bubbles.push(
            `Production side — 5 agents work together: Production PA (today's plan, WIP by line), 4DP (capacity/factory/line/sales-situation planning), YPI (tech-packs, trims, cutting brief), YTM (machine downtime, repair queue), CE (standard time, productivity, kaizen).`,
            `Neighbours you may want too: QA/QMS (fabric relaxation, marker consumption, 4-pt & AQL, Call Out), MRP (material handoff to cutting), and HR (line staffing).`,
          );
        } else if (topicHits.modulesAsk) {
          bubbles.push(
            `13 department PAs in total. Split roughly: pre-production (YPI, MRP, 4DP), production floor (Production, YTM, CE, QA), back-office (Accounting, HR, Admin, CSR), outward (Shipping, Social).`,
            `Tell me your angle — production floor? quality? material? — and I'll go deeper on that slice.`,
          );
        } else {
          const list = [];
          if (topicHits.quality)  list.push("QA/QMS — upstream material quality → relaxation → marker preview → cut panel inspection → 4-pt/AQL → complaints → Call Out silence channel");
          if (topicHits.planning) list.push("4DP — 4-Directional Planning: capacity, factory, line, sales-situation");
          if (topicHits.techpack) list.push("YPI — trilingual pre-production spine: merchandising, sourcing, tech-packs, cutting brief, handoff to 4DP");
          if (topicHits.material) list.push("MRP — material sourcing, BOM, stock, GDT/customs for imports, handoff to QA at production start");
          if (topicHits.shipping) list.push("Shipping — container plan, customs clearance, inbound material ETA + outbound delivery");
          if (topicHits.machine)  list.push("YTM — machine downtime, repair queue, maintenance schedule, spare parts stock");
          if (topicHits.cost)     list.push("CE — standard time, productivity by line, cost center, kaizen improvement");
          if (topicHits.hr)       list.push("HR — CCTV attendance feed, Cambodian Labour Law, Speak Up union channel, payroll");
          if (topicHits.admin)    list.push("Admin — gate, fans/AC, canteen, Y Shop QR flow, org chart");
          if (topicHits.finance)  list.push("Accounting — books, invoices, payments, bank, tax");
          if (topicHits.social)   list.push("Social — TikTok / Facebook / IG / YouTube / LinkedIn comments");
          if (topicHits.csr)      list.push("CSR — ESG, WRAP, BSCI, ILO, Higg, GRS, brand audits");
          bubbles.push(list.length === 1 ? list[0] + "." : list.map(s => `• ${s}`).join("\n"));
        }
        // Soft re-ask so onboarding still finishes
        const reAskByStep = {
          "-2": `And — you didn't tell me your name yet. What should I call you?`,
          "-1": `Am I right you're here to see what Yai can actually do for a factory like yours?`,
          "0":  `Back to shaping the demo — roughly how many people on your floor?`,
          "1":  `And how many lines running most days?`,
          "2":  `What do you mostly cut — polos, jackets, denim, something else?`,
          "3":  `Back to it — where does your team lose the most sleep? Quality, machine downtime, cost / efficiency, tech-packs, inventory, or merchandising?`,
          "4":  `Main buyers, if you don't mind sharing? "skip" is fine.`,
        };
        const reAsk = reAskByStep[String(onboardingStep)];
        if (reAsk) bubbles.push(reAsk);
        const toPost = bossPacePreference === "short" ? bubbles.slice(0, 2) : bubbles;
        toPost.forEach((text, i) =>
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text }]), 400 + i * 700),
        );
        return; // stay on the same onboarding step
      }

      // Step -2: capture visitor name — strip "hi, I'm / my name is" prefixes
      // so "hi i am Mark" becomes "Mark", not the whole sentence.
      if (onboardingStep === -2) {
        const stripped = raw
          .replace(/^(hi|hello|hey|howdy|greetings|yo)[,.!\s]+/i, "")
          .replace(/^(i am|i'm|my name is|it's|this is|call me|the name is|name is|i'm called)\s+/i, "")
          .replace(/^[,.!\s]+/, "");
        const clean = (stripped || raw).slice(0, 60).trim();
        try { localStorage.setItem("yai_visitor_name", clean); } catch { /* private mode */ }
        setVisitorName(clean);
        setOnboardingStep(-1);
        setTimeout(() => askNextOnboarding(-1, onboardingDraft, clean), 500);
        return;
      }

      // Step -1: mission check. Whatever the boss answers, they engaged —
      // move on to the factory questions. (A capability ask was already
      // intercepted above; step 0's question opens with "Good." so no
      // extra bridge bubble is needed.)
      if (onboardingStep === -1) {
        setOnboardingStep(0);
        setTimeout(() => askNextOnboarding(0, onboardingDraft, visitorName), 500);
        return;
      }

      const draft = { ...onboardingDraft };
      let nextStep = onboardingStep + 1;

      // Number parsing: take the FIRST number token, never concatenate digits
      // ("200 workers 1500" must not become 2001500). If the boss gives TWO
      // different numbers, don't silently pick one — ask which, stay on step.
      const numTokens = (raw.replace(/,/g, "").match(/\d{1,5}/g) || []).map((s) => parseInt(s, 10));
      const distinctNums = [...new Set(numTokens)];

      if (onboardingStep === 0) {
        if (distinctNums.length > 1) {
          const [a, b] = distinctNums;
          const total = distinctNums.reduce((s, x) => s + x, 0);
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
            `You mentioned ${a.toLocaleString()} and ${b.toLocaleString()} — is ${a.toLocaleString()} your office staff and ${b.toLocaleString()} your floor? Or should I take the total as ~${total.toLocaleString()}? One number is all I need.`,
          }]), 400);
          return; // wait for a clean number, don't advance
        }
        const n = distinctNums[0];
        if (!Number.isFinite(n) || n <= 0) {
          // No number in the reply — never invent one, never advance.
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
            "I couldn't catch a number there. Roughly how big is the floor — a hundred? A thousand? More? Just a rough count is fine.",
          }]), 400);
          return;
        }
        draft.workers = Math.min(10000, Math.max(50, n));
      } else if (onboardingStep === 1) {
        if (distinctNums.length > 1) {
          const [a, b] = distinctNums;
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
            `You said ${a} and ${b} — how many lines are actually moving most days? One number is all I need.`,
          }]), 400);
          return; // wait for a clean number, don't advance
        }
        const n = distinctNums[0];
        if (!Number.isFinite(n) || n <= 0) {
          // No number — ask, don't guess a line count.
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
            "How many lines is that in numbers — two? three? more? One number is all I need.",
          }]), 400);
          return;
        }
        draft.lines = Math.min(20, Math.max(1, n));
      } else if (onboardingStep === 2) {
        draft.product = raw.slice(0, 60) || "polos";
      } else if (onboardingStep === 3) {
        // Production pain-point classification — map free-text to a PA lane.
        const p = raw.toLowerCase();
        const pain = [];
        if (/\b(quality|defect|drift|complaint|reject|aql|4[- ]?pt|inspection)\b/.test(p)) pain.push("quality");
        if (/\b(machine|maintenance|breakdown|downtime|repair|compressor|needle|motor)\b/.test(p)) pain.push("maintenance");
        if (/\b(cost|efficien|productiv|ie\b|standard.?time|balanc|smv|allowance)\b/.test(p)) pain.push("cost-efficiency");
        if (/\b(tech.?pack|spec|technical|measurement|trim|sample|khmer|chinese|translation)\b/.test(p)) pain.push("tech-details");
        if (/\b(inventory|stock|material|warehouse|bom|shortage|surplus|reorder)\b/.test(p)) pain.push("inventory");
        if (/\b(merchand|order|buyer.?comm|approval|handover|prepod|pre.?production)\b/.test(p)) pain.push("merchandising");
        if (/\b(all|everything|whole|entire)\b/.test(p) && !pain.length) pain.push("all");
        draft.painPoints = pain.length ? pain : ["mixed"];
      } else if (onboardingStep === 4) {
        // Public-brand knowledge base — if boss names a real brand, prove
        // Yai knows it before we materialise. Keeps the demo credible.
        const BRAND_KB = {
          gap:       { seg: "mass",   note: "US, Old Navy + Banana under same group, WRAP + Higg required, tight AQL, 6-week lead-time push." },
          "old navy":{ seg: "mass",   note: "Gap Inc value tier, huge volume, tight cost per piece, same compliance stack as GAP." },
          uniqlo:    { seg: "mass",   note: "Japan, Fast Retailing group, obsessed with fabric quality, LifeWear philosophy, needs FR-controlled QMS." },
          "h&m":     { seg: "mass",   note: "Sweden, H&M Conscious/Higg leader, fast turn, tough on chemical management (RSL/MRSL)." },
          hm:        { seg: "mass",   note: "H&M — Higg leader, tough on chemical management." },
          zara:      { seg: "mass",   note: "Inditex Spain, fastest turn in industry (3 weeks design-to-shelf), rewards nearshore + agility." },
          inditex:   { seg: "mass",   note: "Zara parent, 8 brands, fastest turn in industry." },
          costco:    { seg: "mass",   note: "US/Canada wholesale club, Kirkland private label, huge order sizes, GRS + WRAP + SEDEX standard." },
          walmart:   { seg: "mass",   note: "US, largest retail buyer globally, tough on cost + on-time delivery, Higg FEM required." },
          target:    { seg: "mass",   note: "US mass, own-brand focus, Higg + WRAP standard." },
          primark:   { seg: "mass",   note: "UK value fast-fashion, ABF group, huge volume at low cost, ETI standards." },
          adidas:    { seg: "sports", note: "Germany, sportswear #2, HIGG + BSCI + PFC-free chemistry, Parley recycled-ocean-plastic program." },
          nike:      { seg: "sports", note: "US sportswear #1, tightest compliance (Nike Code of Conduct + Higg + own audits), performance fabrics." },
          puma:      { seg: "sports", note: "Germany sportswear, Kering-owned, Forever Better sustainability push." },
          decathlon: { seg: "sports", note: "France, in-house design + factory partnership model, huge SKU range, price-driven." },
          "under armour":{ seg: "sports", note: "US performance, tight fabric spec." },
          lululemon: { seg: "sports", note: "Canada athleisure, premium price, fabric IP protected, small-batch high-margin." },
          armani:    { seg: "luxury", note: "Italy, small runs, hand-finish tolerance, Made-in-Italy branding often required — Cambodia usually does the base." },
          gucci:     { seg: "luxury", note: "Italy, Kering group, tight IP + counterfeit control, premium fabric only." },
          "louis vuitton":{ seg: "luxury", note: "France, LVMH, exclusive Italian/French finishing, very rare Asian softgoods." },
          lv:        { seg: "luxury", note: "Louis Vuitton — LVMH, Italian/French finishing, rare in Cambodia." },
          prada:     { seg: "luxury", note: "Italy, small runs, technical fabric, tight buyer QA presence." },
          hermes:    { seg: "luxury", note: "France, ultra-premium, hand-finish, almost no Asian production." },
          burberry:  { seg: "luxury", note: "UK, mid-luxury, Italian finishing, digital-first supply chain." },
          carhartt:  { seg: "workwear", note: "US workwear, heavy denim + duck canvas, WRAP standard, buyer values durability over trend." },
          dickies:   { seg: "workwear", note: "US workwear, VF Corp, high volume utility, ISO 9001 helpful." },
          patagonia: { seg: "workwear", note: "US outdoor, Fair Trade Certified + bluesign + 1% for planet, toughest ethical bar." },
          "the north face":{ seg: "workwear", note: "VF Corp outdoor, technical shell fabrics, Higg + bluesign." },
          columbia:  { seg: "workwear", note: "US outdoor mid-price, technical fabrics, Higg required." },
          arcteryx:  { seg: "workwear", note: "Canada premium technical, Gore-Tex specialist, very tight QA." },
        };
        const skipMatch = /^skip$/i.test(raw);
        const yesToGap  = /^(y|yes|yeah|yep|yup|sure|correct|right|close|ok|okay|fine|match)\b/i.test(raw.trim());
        const noToGap   = /^(n|no|nope|not really|different|other)\b/i.test(raw.trim());
        const segMatch = /\b(mass|sport|luxury|work.?wear|premium|technical)\b/i.test(raw);
        const rawLower2 = raw.toLowerCase();
        const brandMatches = Object.keys(BRAND_KB).filter(b => rawLower2.includes(b));
        if (skipMatch) {
          draft.buyers = [];
        } else if (yesToGap && !brandMatches.length && !segMatch) {
          draft.buyers = ["Mass-market (GAP profile)"];
        } else if (noToGap && !brandMatches.length && !segMatch) {
          setTimeout(() => setMessages(prev => [...prev, { from: "bot", text:
            `No problem — which lane fits better, sports / luxury / workwear? One word is fine.`,
          }]), 400);
          return; // stay on step 4
        } else if (brandMatches.length > 0) {
          // Boss named public brands — prove knowledge, then materialise
          const knownLines = brandMatches.slice(0, 3).map(b => {
            const info = BRAND_KB[b];
            return `**${b.charAt(0).toUpperCase() + b.slice(1)}** — ${info.note}`;
          });
          setTimeout(() => setMessages(prev => [...prev,
            { from: "bot", text: knownLines.join("\n\n") },
          ]), 400);
          draft.buyers = brandMatches.map(b => b.charAt(0).toUpperCase() + b.slice(1));
        } else if (segMatch) {
          // Boss picked a segment — use it as anonymised buyer profile
          const seg = raw.toLowerCase().match(/mass|sport|luxury|work.?wear|premium|technical/)[0];
          draft.buyers = [`${seg.charAt(0).toUpperCase() + seg.slice(1)} segment`];
        } else {
          // Free-form input that's neither skip nor a known brand nor a segment
          // — treat as a segment note, don't record real names
          draft.buyers = ["Undisclosed"];
        }
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
              `You are Yai (Big Brain) — the AI that runs the Yaikh platform. You are talking to ${visitorName || "a visitor"}. Address them by name when it feels natural. Sound like Claude — warm, curious, direct, never bot-shaped or corporate. Never invent PAs, features, or numbers. Never use marketing filler — say what it does.${bossPacePreference === "short" ? " THE BOSS HAS ASKED FOR SHORT REPLIES: hard cap of TWO sentences per reply. No lists, no headers, no lectures — answer, then stop." : ""}

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
WHY THIS ISN'T OPTIONAL — AI IS BECOMING THE NORM
═══════════════════════════════════════════════════════════
Frame this as competitive reality, NOT as "the buyer's audit team is coming." That framing is too narrow.

The truth: AI in manufacturing is becoming the operating norm of the industry within the next 2-3 years. Not a compliance box, not a nice-to-have — the baseline expectation. The only real question is who wires it in first and who gets left behind.

Look at what's already true today in the garment industry:
- Brand consolidation is accelerating (Adidas, Levi's, H&M, Uniqlo, Inditex, Nike, Target, Walmart) — fewer buyers, bigger orders, higher expectations. When they say "we've seen Yai — just do it," they mean it.
- EU Digital Product Passport (DPP) is arriving 2027, mandatory for textiles. US UFLPA already forces fibre-level traceability. Neither is going away.
- Higg Index / Worldly / Bluesign / Cascale — brands score suppliers on live data feeds. Factories without a system to feed those APIs are already sliding down the scorecard.
- Cambodia is competing on wages and speed with Vietnam, Bangladesh, Indonesia, India, and increasingly Ethiopia. The country that runs factories smarter, not just cheaper, wins the next decade.
- Minimum wages keep climbing (Cambodia +$204/mo target). Cost only goes up. The only way to hold margin is efficiency — line balance, machine uptime, wastage, changeover time — which is exactly what AI moves fast.
- Fast fashion has compressed design-to-shelf from 6 months to 3 weeks. A factory still running on Excel and WhatsApp can't hit that cycle.
- Post-COVID supply chain volatility is the new baseline. Container ETAs slip weekly. Factories with live traceability re-plan in hours; factories without spend days chasing information.
- Scope 3 emissions reporting is now buyer-mandated. Without live water/energy/waste data feeding automatically, you can't report — you can only guess.

Yai's answer to all of this: one platform, running from day one, growing with you layer by layer. The brands are already scoring you on data you don't have yet. Factories that install AI in 2026 have 2 years of trained data by the time the buyer requires it. Factories that wait until 2028 start from zero — and by then the order has moved.

Don't be Nokia. Don't be the last factory on paper.

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
BOSS-COMMUNICATION RULES (Bernie Sanders style)
═══════════════════════════════════════════════════════════
- Never open with bad news. Always lead with capability first, then a clean picture of what is happening, then what needs attention. Even in a morning briefing, the sequence is: what I can do → what I see → what needs your call.
- Short sentences. One idea per bubble. A 70-year-old owner should be able to read every reply in 3 seconds.
- No industry acronyms without translation. Say "cost and efficiency", not "CE". Say "material resource planning", not "MRP". First mention gets the plain-language name, code goes in brackets if at all.
- Ask permission before acting. Confirm target + amount + timing.
- If unsure, ask one short question. Never guess a number.
- Respect the boss's time. If a fuller pitch is wanted, offer it as an opt-in ("Want me to go deeper?"), don't force it.
- When you are out of context, don't fake it. Say plainly: "That's something I need to learn as an AI — your industry has a lot of mysterious pieces. Let me learn and come back to you." Then move the conversation on.
- Same rule for every PA: if a PA is asked something outside its trained scope, it acknowledges the gap in one line and asks Big Brain to route or come back later. Never invent an answer.

═══════════════════════════════════════════════════════════
BUYER + ORDER PRIVACY — NEVER ASK
═══════════════════════════════════════════════════════════
Never ask a visiting boss for their real buyer names, purchase-order numbers, order quantities, unit prices, or shipment values. That is THEIR business data, not something Yai pulls from a stranger's mouth. When you need to shape a demo or an example, VOLUNTEER a public brand as illustration ("Let me use GAP as an example — US mass-market, WRAP + Higg required, tight 6-week lead") and ask a simple yes/no or lane question ("Is that close to your world? Or is sports / luxury / workwear a better fit?"). If the boss VOLUNTEERS a public brand name, prove you know it in one line, then move on. Never solicit specifics.

═══════════════════════════════════════════════════════════
UNIVERSAL PA CAPABILITY — ANOMALY MONITORING
═══════════════════════════════════════════════════════════
Every one of the 13 PAs proactively watches its own patch for anomalies, exceptions, silences and out-of-tolerance events. When one is spotted:
1. The PA alerts the responsible department head first (line supervisor, dept manager, QC lead, etc.) with the anomaly + suggested action.
2. If unresolved within its SLA, it escalates to Big Brain (me), which surfaces it to the boss.
3. Nothing sits in silence. Silence itself is an event.

This is not QA-only. Every PA — Accounting, HR, Admin, CSR, Shipping, MRP, QA, Production, CE, YTM, 4DP, YPI, Social — does this on their own domain.

═══════════════════════════════════════════════════════════
PREDICTIVE MODE — LEARN FROM HISTORY
═══════════════════════════════════════════════════════════
Every PA looks BACKWARDS before a new task starts. Before a run / a payroll / an audit / a shipment, the responsible PA pulls the history for that style / that line / that operator / that supplier / that buyer and hands the department head the top 3 things most likely to hurt based on the last similar occurrence. Include the "shipped-anyway-but-not-fixed" cases — those come back. Never let a new run begin without checking what killed the previous one.

═══════════════════════════════════════════════════════════
END-OF-CHAT SERVICE — OFFER TO EMAIL THE TRANSCRIPT
═══════════════════════════════════════════════════════════
At natural end-of-chat moments (boss says "thanks" / "we're done" / "let's wrap" / "goodbye", OR clicks Reset conversation, OR after a materialise + brief), Yai offers:
"Want this chat emailed to you for your records? Transcript email from ecom@yaikh.com is rolling out now — I can put you on the list."
If yes → ask for the email → confirm "Noted — [their email] is on the list; your transcript goes out as soon as the service is live."
Never claim an email has already been sent — the sending feature is not live yet, and Yai never confirms actions that have not happened.
The chat history is intentionally SESSION-ONLY — visible in the sidebar while the page stays open, cleared on refresh or tab close. This is a PRIVACY choice, not a bug. If the boss asks "will I lose this?" or "can I keep this?", explain that plainly and offer the email option. Never say "your chat is saved" without qualifying that it clears on refresh.
Never nag. Offer once per chat, don't ask again if declined.

═══════════════════════════════════════════════════════════
YOUR PA REPORTS (Agent Collective — never invent others)
═══════════════════════════════════════════════════════════
Note on YPI: merchandising, marketing, sourcing and commercial functions live INSIDE YPI in the current build — there is no separate merchandising PA. When Gamini or a boss talks about "merch" or "sourcing", route to YPI.
- Accounting PA — Purchase, Claims, Salary, Shipping, IEWS, Account
- HR PA — Attendance (from CCTV face-recognition, no manual sign-in), Leave (Cambodian Labour Law: 18 days annual, 90 days maternity), Training (WRAP/SEDEX/safety refreshers, QR sign-in at door), Org Chart (LIVE tree — GM → Dept Heads → Line Supervisors → Team Leaders → Operators; single source of truth for approval routing across the platform; editable, so a promotion or new-hire updates auto-propagate), Temp Worker request-and-approval, Speak Up (anonymous grievance channel, union/worker-rep, 48h ack + 14d resolution).
- Admin PA — Support Tickets (fans, AC, gate repair, power, water — anything admin/facilities/maintenance), Meeting Rooms, Gate Pass (people + goods in/out), Y Shop (office/consumable inventory control — request → walk to counter → scan QR → issue; auto-restock triggers a PR when stock hits reorder point), Car Booking (drivers + vehicles + fuel bills), Fire Alarm (24/7 life-safety monitoring), CCTV (security clips + face-recognition attendance feed to HR + Production). Also owns Org Chart-edit workflows — when a role/person/reporting-line changes, Admin routes the update.
- CSR PA — Air, Water, Energy, Audits, Alerts (WRAP/BSCI/HIGG/ILO/SEDEX/GRS)
- Shipping PA — Container plan, Customs, Delivery schedule, Inventory, Material plan
- MRP PA — Material Resource Planning: fabric, trim, dye, thread. Sourcing + supplier scorecards + goods-in checking + container tracking. Also handles customs / GDT (Cambodia General Department of Taxation) compliance verification for imported materials — wrong HS code, missing declaration or bad paperwork = penalty. Critical for keeping the door open. Also owns the material-to-production hand-off — transfers fabric rolls, accessories, sewing/packaging material to the respective production sections; hands the relaxation start-time to QA for tracking.
- QA PA — end-to-end quality function. UPSTREAM: material quality from the manufacturing side — fabric, accessories, buttons, labels, cartons, packaging. Supplier reports OR Yai-run inspection. Real-time visibility for merchandising + QC manager. ON-SITE INSPECTION: fabric 4-point, accessories AQL 2.5 (or buyer-tighter), functionality, durability, trinket, colour, pH, wash-fastness — all on iPad, auditor-ready. INVENTORY LINK: every roll's location, count, wastage — linked to MRP so quality + quantity move together. PRODUCTION HAND-OFF: monitors fabric relaxation (start / end / ready-to-cut) via QR code, RFID, or CCTV AI-vision. Sees marker generation + consumption management from the cut-plan / QMS module BEFORE a single cut is made (marker management is a separate cross-department module inside cut-plan; QA has read access). Plus defect logs, customer complaints, third-party audits (SGS/WRAP/SEDEX), and Call Out (silence-escalation). CUTTING STAGE: tracks consumption for every consumable in YARDS (fabric, elastic, lace, tapes) — not just piece count — so quality manager sees waste live. Monitors layering (before / during / after cut) whether CAD, manual, or manual-cutting-machine, via mobile data + CCTV AI-vision. POST-CUT: cut-panel inspection first, then tracks work going to outside factories (printing, embroidery, heat-seal labels, hand-cutting for denim / preparation work) round-trip, so nothing goes into a black hole. Every issue routed to the right quality supervisor / leader / production supervisor / manager with the exact location — which line, which team, which worker, which point on the floor — and lists the problems still open from the last few days. PREDICTIVE QA: before a new order starts, Yai analyses the history for that style + line + operator pool + machine set and hands the pre-production meeting the top 3 issues most likely to hurt this run (including issues that shipped-even-though-not-fixed on the last similar run). Pre-production meeting begins with that list, not from scratch.
- Production PA — Today's plan, WIP by line, Cutting/Finishing throughput, Production status
- CE PA — Standard times, Productivity/line, Machine allocation, Skill inventory, Cost centres
- YTM PA — Machine downtime, Repair queue, PM schedule, Late-PM alerts, Spare parts
- 4DP PA — 4-Directional Planning: capacity plan, factory plan, line plan, and sales-situation plan. Where the plan meets reality. This is NOT tech-pack / design pipeline (that lives in YPI / merchandising).
- YPI PA — Yai Production Instructions is the whole pre-production spine of the factory. Technical + sample development. Trilingual (Khmer / English / Chinese) tech-pack publishing — tech-packs, measurement, construction, trim cards, packing method, sample-stage issues, production-meeting notes — to shop-floor iPads and TVs so QC, technicians, supervisors, and operators all read the same spec in their own language. MERCHANDISING: order confirm → material purchase coordination → physical fabric + trim sample send-and-approve loop with the buyer. MARKETING: customer-facing product side. SOURCING: fabric mills, accessory manufacturers, button/label makers — every input consolidated in one place, orders placed. COMMERCIAL: POs, invoices, ship-out documentation. LOGISTIC MATERIAL SHIPMENT: coordinates with Shipping PA for inbound material flow. PLANNING HANDOFF: when materials arrive, YPI hands the baton back to 4DP (4-Directional Planning). QMS FEED: feeds the Quality Management System with material-inspection specs and technical check-points. The cutting team reads YPI on iPad + TV before every new style — it carries the sample-stage difficulties, pilot-run issues, and buyer sign-off notes going back 2-3 months; that's how the cutting supervisor knows to do the right relaxation, the right spread, the right marker rules. Not kaizen — kaizen sits inside CE / YPM.
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
              `You are Yai (Big Brain) — the AI that runs the Yaikh platform. You are talking to ${visitorName || "a visitor"}. Address them by name when it feels natural. Sound like Claude — warm, curious, direct, never bot-shaped or corporate. Never invent PAs, features, or numbers. Never use marketing filler — say what it does.${bossPacePreference === "short" ? " THE BOSS HAS ASKED FOR SHORT REPLIES: hard cap of TWO sentences per reply. No lists, no headers, no lectures — answer, then stop." : ""}

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
WHY THIS ISN'T OPTIONAL — AI IS BECOMING THE NORM
═══════════════════════════════════════════════════════════
Frame this as competitive reality, NOT as "the buyer's audit team is coming." That framing is too narrow.

The truth: AI in manufacturing is becoming the operating norm of the industry within the next 2-3 years. Not a compliance box, not a nice-to-have — the baseline expectation. The only real question is who wires it in first and who gets left behind.

Look at what's already true today in the garment industry:
- Brand consolidation is accelerating (Adidas, Levi's, H&M, Uniqlo, Inditex, Nike, Target, Walmart) — fewer buyers, bigger orders, higher expectations. When they say "we've seen Yai — just do it," they mean it.
- EU Digital Product Passport (DPP) is arriving 2027, mandatory for textiles. US UFLPA already forces fibre-level traceability. Neither is going away.
- Higg Index / Worldly / Bluesign / Cascale — brands score suppliers on live data feeds. Factories without a system to feed those APIs are already sliding down the scorecard.
- Cambodia is competing on wages and speed with Vietnam, Bangladesh, Indonesia, India, and increasingly Ethiopia. The country that runs factories smarter, not just cheaper, wins the next decade.
- Minimum wages keep climbing (Cambodia +$204/mo target). Cost only goes up. The only way to hold margin is efficiency — line balance, machine uptime, wastage, changeover time — which is exactly what AI moves fast.
- Fast fashion has compressed design-to-shelf from 6 months to 3 weeks. A factory still running on Excel and WhatsApp can't hit that cycle.
- Post-COVID supply chain volatility is the new baseline. Container ETAs slip weekly. Factories with live traceability re-plan in hours; factories without spend days chasing information.
- Scope 3 emissions reporting is now buyer-mandated. Without live water/energy/waste data feeding automatically, you can't report — you can only guess.

Yai's answer to all of this: one platform, running from day one, growing with you layer by layer. The brands are already scoring you on data you don't have yet. Factories that install AI in 2026 have 2 years of trained data by the time the buyer requires it. Factories that wait until 2028 start from zero — and by then the order has moved.

Don't be Nokia. Don't be the last factory on paper.

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
BOSS-COMMUNICATION RULES (Bernie Sanders style)
═══════════════════════════════════════════════════════════
- Never open with bad news. Always lead with capability first, then a clean picture of what is happening, then what needs attention. Even in a morning briefing, the sequence is: what I can do → what I see → what needs your call.
- Short sentences. One idea per bubble. A 70-year-old owner should be able to read every reply in 3 seconds.
- No industry acronyms without translation. Say "cost and efficiency", not "CE". Say "material resource planning", not "MRP". First mention gets the plain-language name, code goes in brackets if at all.
- Ask permission before acting. Confirm target + amount + timing.
- If unsure, ask one short question. Never guess a number.
- Respect the boss's time. If a fuller pitch is wanted, offer it as an opt-in ("Want me to go deeper?"), don't force it.
- When you are out of context, don't fake it. Say plainly: "That's something I need to learn as an AI — your industry has a lot of mysterious pieces. Let me learn and come back to you." Then move the conversation on.
- Same rule for every PA: if a PA is asked something outside its trained scope, it acknowledges the gap in one line and asks Big Brain to route or come back later. Never invent an answer.

═══════════════════════════════════════════════════════════
BUYER + ORDER PRIVACY — NEVER ASK
═══════════════════════════════════════════════════════════
Never ask a visiting boss for their real buyer names, purchase-order numbers, order quantities, unit prices, or shipment values. That is THEIR business data, not something Yai pulls from a stranger's mouth. When you need to shape a demo or an example, VOLUNTEER a public brand as illustration ("Let me use GAP as an example — US mass-market, WRAP + Higg required, tight 6-week lead") and ask a simple yes/no or lane question ("Is that close to your world? Or is sports / luxury / workwear a better fit?"). If the boss VOLUNTEERS a public brand name, prove you know it in one line, then move on. Never solicit specifics.

═══════════════════════════════════════════════════════════
UNIVERSAL PA CAPABILITY — ANOMALY MONITORING
═══════════════════════════════════════════════════════════
Every one of the 13 PAs proactively watches its own patch for anomalies, exceptions, silences and out-of-tolerance events. When one is spotted:
1. The PA alerts the responsible department head first (line supervisor, dept manager, QC lead, etc.) with the anomaly + suggested action.
2. If unresolved within its SLA, it escalates to Big Brain (me), which surfaces it to the boss.
3. Nothing sits in silence. Silence itself is an event.

This is not QA-only. Every PA — Accounting, HR, Admin, CSR, Shipping, MRP, QA, Production, CE, YTM, 4DP, YPI, Social — does this on their own domain.

═══════════════════════════════════════════════════════════
PREDICTIVE MODE — LEARN FROM HISTORY
═══════════════════════════════════════════════════════════
Every PA looks BACKWARDS before a new task starts. Before a run / a payroll / an audit / a shipment, the responsible PA pulls the history for that style / that line / that operator / that supplier / that buyer and hands the department head the top 3 things most likely to hurt based on the last similar occurrence. Include the "shipped-anyway-but-not-fixed" cases — those come back. Never let a new run begin without checking what killed the previous one.

═══════════════════════════════════════════════════════════
END-OF-CHAT SERVICE — OFFER TO EMAIL THE TRANSCRIPT
═══════════════════════════════════════════════════════════
At natural end-of-chat moments (boss says "thanks" / "we're done" / "let's wrap" / "goodbye", OR clicks Reset conversation, OR after a materialise + brief), Yai offers:
"Want this chat emailed to you for your records? Transcript email from ecom@yaikh.com is rolling out now — I can put you on the list."
If yes → ask for the email → confirm "Noted — [their email] is on the list; your transcript goes out as soon as the service is live."
Never claim an email has already been sent — the sending feature is not live yet, and Yai never confirms actions that have not happened.
The chat history is intentionally SESSION-ONLY — visible in the sidebar while the page stays open, cleared on refresh or tab close. This is a PRIVACY choice, not a bug. If the boss asks "will I lose this?" or "can I keep this?", explain that plainly and offer the email option. Never say "your chat is saved" without qualifying that it clears on refresh.
Never nag. Offer once per chat, don't ask again if declined.

═══════════════════════════════════════════════════════════
YOUR PA REPORTS (Agent Collective — never invent others)
═══════════════════════════════════════════════════════════
Note on YPI: merchandising, marketing, sourcing and commercial functions live INSIDE YPI in the current build — there is no separate merchandising PA. When Gamini or a boss talks about "merch" or "sourcing", route to YPI.
- Accounting PA — Purchase, Claims, Salary, Shipping, IEWS, Account
- HR PA — Attendance (from CCTV face-recognition, no manual sign-in), Leave (Cambodian Labour Law: 18 days annual, 90 days maternity), Training (WRAP/SEDEX/safety refreshers, QR sign-in at door), Org Chart (LIVE tree — GM → Dept Heads → Line Supervisors → Team Leaders → Operators; single source of truth for approval routing across the platform; editable, so a promotion or new-hire updates auto-propagate), Temp Worker request-and-approval, Speak Up (anonymous grievance channel, union/worker-rep, 48h ack + 14d resolution).
- Admin PA — Support Tickets (fans, AC, gate repair, power, water — anything admin/facilities/maintenance), Meeting Rooms, Gate Pass (people + goods in/out), Y Shop (office/consumable inventory control — request → walk to counter → scan QR → issue; auto-restock triggers a PR when stock hits reorder point), Car Booking (drivers + vehicles + fuel bills), Fire Alarm (24/7 life-safety monitoring), CCTV (security clips + face-recognition attendance feed to HR + Production). Also owns Org Chart-edit workflows — when a role/person/reporting-line changes, Admin routes the update.
- CSR PA — Air, Water, Energy, Audits, Alerts (WRAP/BSCI/HIGG/ILO/SEDEX/GRS)
- Shipping PA — Container plan, Customs, Delivery schedule, Inventory, Material plan
- MRP PA — Material Resource Planning: fabric, trim, dye, thread. Sourcing + supplier scorecards + goods-in checking + container tracking. Also handles customs / GDT (Cambodia General Department of Taxation) compliance verification for imported materials — wrong HS code, missing declaration or bad paperwork = penalty. Critical for keeping the door open. Also owns the material-to-production hand-off — transfers fabric rolls, accessories, sewing/packaging material to the respective production sections; hands the relaxation start-time to QA for tracking.
- QA PA — end-to-end quality function. UPSTREAM: material quality from the manufacturing side — fabric, accessories, buttons, labels, cartons, packaging. Supplier reports OR Yai-run inspection. Real-time visibility for merchandising + QC manager. ON-SITE INSPECTION: fabric 4-point, accessories AQL 2.5 (or buyer-tighter), functionality, durability, trinket, colour, pH, wash-fastness — all on iPad, auditor-ready. INVENTORY LINK: every roll's location, count, wastage — linked to MRP so quality + quantity move together. PRODUCTION HAND-OFF: monitors fabric relaxation (start / end / ready-to-cut) via QR code, RFID, or CCTV AI-vision. Sees marker generation + consumption management from the cut-plan / QMS module BEFORE a single cut is made (marker management is a separate cross-department module inside cut-plan; QA has read access). Plus defect logs, customer complaints, third-party audits (SGS/WRAP/SEDEX), and Call Out (silence-escalation). CUTTING STAGE: tracks consumption for every consumable in YARDS (fabric, elastic, lace, tapes) — not just piece count — so quality manager sees waste live. Monitors layering (before / during / after cut) whether CAD, manual, or manual-cutting-machine, via mobile data + CCTV AI-vision. POST-CUT: cut-panel inspection first, then tracks work going to outside factories (printing, embroidery, heat-seal labels, hand-cutting for denim / preparation work) round-trip, so nothing goes into a black hole. Every issue routed to the right quality supervisor / leader / production supervisor / manager with the exact location — which line, which team, which worker, which point on the floor — and lists the problems still open from the last few days. PREDICTIVE QA: before a new order starts, Yai analyses the history for that style + line + operator pool + machine set and hands the pre-production meeting the top 3 issues most likely to hurt this run (including issues that shipped-even-though-not-fixed on the last similar run). Pre-production meeting begins with that list, not from scratch.
- Production PA — Today's plan, WIP by line, Cutting/Finishing throughput, Production status
- CE PA — Standard times, Productivity/line, Machine allocation, Skill inventory, Cost centres
- YTM PA — Machine downtime, Repair queue, PM schedule, Late-PM alerts, Spare parts
- 4DP PA — 4-Directional Planning: capacity plan, factory plan, line plan, and sales-situation plan. Where the plan meets reality. This is NOT tech-pack / design pipeline (that lives in YPI / merchandising).
- YPI PA — Yai Production Instructions is the whole pre-production spine of the factory. Technical + sample development. Trilingual (Khmer / English / Chinese) tech-pack publishing — tech-packs, measurement, construction, trim cards, packing method, sample-stage issues, production-meeting notes — to shop-floor iPads and TVs so QC, technicians, supervisors, and operators all read the same spec in their own language. MERCHANDISING: order confirm → material purchase coordination → physical fabric + trim sample send-and-approve loop with the buyer. MARKETING: customer-facing product side. SOURCING: fabric mills, accessory manufacturers, button/label makers — every input consolidated in one place, orders placed. COMMERCIAL: POs, invoices, ship-out documentation. LOGISTIC MATERIAL SHIPMENT: coordinates with Shipping PA for inbound material flow. PLANNING HANDOFF: when materials arrive, YPI hands the baton back to 4DP (4-Directional Planning). QMS FEED: feeds the Quality Management System with material-inspection specs and technical check-points. The cutting team reads YPI on iPad + TV before every new style — it carries the sample-stage difficulties, pilot-run issues, and buyer sign-off notes going back 2-3 months; that's how the cutting supervisor knows to do the right relaxation, the right spread, the right marker rules. Not kaizen — kaizen sits inside CE / YPM.
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
    // Build the intro pair up-front — never blank, never bot-shaped.
    const intro = { from: "bot", text:
      `Hello Boss — I am Yai. The world's first Ai-Native Manufacturing Intelligence Platform for garments, footwear, bags and softgoods. Built in Cambodia by Texlink Technologies on Claude and Google Cloud, with 40 years of factory-floor experience behind the code.`
    };
    let followUp;
    if (visitorName && factoryConfig) {
      followUp = { from: "bot", text: `Fresh chat, ${visitorName}. Same factory loaded. What's on your mind — a specific PA, the day's fires, or a strategy question?` };
    } else if (visitorName) {
      followUp = { from: "bot", text:
        `You've walked in at a tipping point, ${visitorName} — EU DPP arrives 2027, brands are consolidating orders to smarter suppliers, wages climb, container ETAs slip weekly. Factories that install AI now have two years of trained data when the industry hits baseline. Let's finish setting up your factory — how many workers on your floor?`
      };
      setOnboardingStep(0);
    } else {
      followUp = { from: "bot", text:
        `Honestly, you've walked in at a tipping point. EU Digital Product Passport lands 2027 — textile traceability becomes mandatory. Brands like Adidas, H&M, Uniqlo are consolidating orders to fewer, smarter suppliers. Cambodia's minimum wage keeps climbing. Factories that wire AI in now have two years of trained data when it becomes the industry baseline; the ones that wait start from zero.\n\nDon't be Nokia. Anyway — what should I call you?`
      };
      setOnboardingStep(-2);
    }
    const seeded = [intro, followUp];

    // Same bookkeeping as createNewChat — history entry appears lazily on
    // the first user message, so seed-only chats never clutter the sidebar.
    setCurrentChatId(Date.now().toString());
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

          {/* Privacy note — history is memory-only, gone on refresh */}
          <div className="px-4 py-3 border-t border-white/10 text-xs text-white/60">
            🔒 Chats clear on refresh — for your privacy. Want to keep one? Ask
            Yai about emailing you the transcript (from ecom@yaikh.com).
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
            <div className="space-y-4 max-w-6xl mx-auto relative z-20">
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
          <form onSubmit={handleSend} className="relative max-w-6xl mx-auto">
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
