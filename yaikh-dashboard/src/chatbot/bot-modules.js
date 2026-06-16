import React, { useState, useRef, useEffect } from 'react';
import {
    X, Plus, Grid3x3, Mic, Send, Sparkles, Paperclip,
    Wallet, UserCog, HeartHandshake, Factory,
    BarChart3, Lightbulb, ClipboardCheck, MessageCircle,
    Users, Truck, Package, TrendingUp, Heart, Leaf,
    Copy, Edit2, RefreshCw, MoreVertical,
    Menu, Trash2, ChevronRight, ChevronDown, Volume2
} from 'lucide-react';
import { generateGeminiResponse, generateDirectGeminiResponse, shouldUseGemini } from './gemini-api';
import { KHMER_NEW_YEAR } from '../thems';
import { useKhmerTTS } from "./useKhmerTTS";
import { VolumeX } from "lucide-react";

// 13 PA agents — single source of truth. The earlier hardcoded
// per-PA module-selection branches (Admin PA / Finance PA / CSR PA /
// HR PA) are now dead code: their bot names no longer exist in this
// list, so those `if` branches never fire and every agent renders
// uniformly from its own `suggestedActions`. To extend, add an entry
// here — no other file needs to change.
const PREDEFINED_BOTS = [
    {
        id: 'accounting-bot',
        name: 'Accounting PA',
        description: 'Finance, AP/AR, invoicing, and accounting assistant',
        icon: Wallet,
        bgGradient: 'from-green-500 to-emerald-500',
        lightBg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
        lightAccent: 'from-green-200 to-emerald-200',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        suggestedActions: [
            { text: 'Purchase Request', highlight: true },
            { text: 'Bill Claim' },
            { text: 'Salary Bill' },
            { text: 'Shipping Bill' },
            { text: 'IEWS' },
            { text: 'Accountant' },
        ],
    },
    {
        id: 'hr-bot',
        name: 'HR PA',
        description: 'Attendance, payroll, training, and people-operations assistant',
        icon: Users,
        bgGradient: 'from-indigo-500 to-blue-500',
        lightBg: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50',
        lightAccent: 'from-indigo-200 to-blue-200',
        textColor: 'text-indigo-800',
        borderColor: 'border-indigo-200',
        suggestedActions: [
            { text: 'Attendance today', highlight: true },
            { text: 'Open leave requests' },
            { text: 'Training schedule' },
            { text: 'Org chart updates' },
            { text: 'Temp worker requests' },
        ],
    },
    {
        id: 'admin-bot',
        name: 'Admin PA',
        description: 'Daily ops: tickets, gate-pass, meeting rooms, transport',
        icon: UserCog,
        bgGradient: 'from-blue-500 to-cyan-500',
        lightBg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50',
        lightAccent: 'from-blue-200 to-cyan-200',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        suggestedActions: [
            { text: 'Open support tickets', highlight: true },
            { text: 'Meeting room bookings' },
            { text: 'Gate passes today' },
            { text: 'Y Shop orders' },
            { text: 'Visitors today' },
        ],
    },
    {
        id: 'csr-bot',
        name: 'CSR PA',
        description: 'CSR / sustainability: air, water, energy, waste',
        icon: HeartHandshake,
        bgGradient: 'from-purple-500 to-pink-500',
        lightBg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50',
        lightAccent: 'from-purple-200 to-pink-200',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200',
        suggestedActions: [
            { text: 'Air temperature today', highlight: true },
            { text: 'Water usage log' },
            { text: 'Energy consumption' },
            { text: 'Compliance audits' },
            { text: 'Environmental alerts' },
        ],
    },
    {
        id: 'shipping-bot',
        name: 'Shipping PA',
        description: 'Container plans, customs clearance, dispatch tracking',
        icon: Truck,
        bgGradient: 'from-cyan-500 to-sky-500',
        lightBg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50',
        lightAccent: 'from-cyan-200 to-sky-200',
        textColor: 'text-cyan-800',
        borderColor: 'border-cyan-200',
        suggestedActions: [
            { text: 'Container plan', highlight: true },
            { text: 'Customs clearance' },
            { text: 'Delivery schedule' },
            { text: 'Inventory levels' },
            { text: 'Material plan' },
        ],
    },
    {
        id: 'mrp-bot',
        name: 'MRP PA',
        description: 'Material requirements planning, BOM, inventory, supplier orders',
        icon: Package,
        bgGradient: 'from-red-500 to-orange-500',
        lightBg: 'bg-gradient-to-br from-red-50 via-orange-50 to-amber-50',
        lightAccent: 'from-red-200 to-orange-200',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        suggestedActions: [
            { text: 'Material plan', highlight: true },
            { text: 'BOM review' },
            { text: 'Stock alerts' },
            { text: 'Supplier orders' },
            { text: 'Reorder points' },
        ],
    },
    {
        id: 'qa-bot',
        name: 'QA PA',
        description: 'Quality assurance, defect inspection, third-party audits',
        icon: ClipboardCheck,
        bgGradient: 'from-violet-500 to-purple-500',
        lightBg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50',
        lightAccent: 'from-violet-200 to-purple-200',
        textColor: 'text-violet-800',
        borderColor: 'border-violet-200',
        suggestedActions: [
            { text: 'Recent defect inspections', highlight: true },
            { text: 'Customer complaints' },
            { text: 'Open call-outs' },
            { text: 'Third-party audits' },
            { text: 'Quality reports' },
        ],
    },
    {
        id: 'production-bot',
        name: 'Production PA',
        description: 'Line planning, workflow, throughput, daily production',
        icon: Factory,
        bgGradient: 'from-orange-500 to-amber-500',
        lightBg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
        lightAccent: 'from-orange-200 to-amber-200',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
        suggestedActions: [
            { text: "Today's production plan", highlight: true },
            { text: 'WIP by line' },
            { text: 'Cutting throughput' },
            { text: 'Finishing throughput' },
            { text: 'Production status' },
        ],
    },
    {
        id: 'ce-bot',
        name: 'CE PA',
        description: 'Customer Engagement: visits, feedback, satisfaction',
        icon: Heart,
        bgGradient: 'from-pink-500 to-rose-500',
        lightBg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50',
        lightAccent: 'from-pink-200 to-rose-200',
        textColor: 'text-pink-800',
        borderColor: 'border-pink-200',
        suggestedActions: [
            { text: 'Standard time updates', highlight: true },
            { text: 'Productivity by line' },
            { text: 'Machine allocation' },
            { text: 'Skill inventory' },
            { text: 'Cost center summary' },
        ],
    },
    {
        id: 'ytm-bot',
        name: 'YTM PA',
        description: 'Maintenance, repairs, machine analytics',
        icon: BarChart3,
        bgGradient: 'from-teal-500 to-cyan-500',
        lightBg: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50',
        lightAccent: 'from-teal-200 to-cyan-200',
        textColor: 'text-teal-800',
        borderColor: 'border-teal-200',
        suggestedActions: [
            { text: 'Machine downtime', highlight: true },
            { text: 'Repair queue' },
            { text: 'Maintenance schedule' },
            { text: 'Late maintenance alerts' },
            { text: 'Spare parts stock' },
        ],
    },
    {
        id: '4dp-bot',
        name: '4DP PA',
        description: 'Design / pattern / sample / spec — the 4DP design pipeline',
        icon: Lightbulb,
        bgGradient: 'from-amber-500 to-yellow-500',
        lightBg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-50',
        lightAccent: 'from-amber-200 to-yellow-200',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200',
        suggestedActions: [
            { text: 'Sample approvals', highlight: true },
            { text: 'Pattern review queue' },
            { text: 'Spec sheets' },
            { text: 'Trim approvals' },
            { text: 'Design roadmap' },
        ],
    },
    {
        id: 'ypi-bot',
        name: 'YPI PA',
        description: 'Yai Process Improvement: kaizen, SOP, efficiency',
        icon: TrendingUp,
        bgGradient: 'from-lime-500 to-green-500',
        lightBg: 'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50',
        lightAccent: 'from-lime-200 to-green-200',
        textColor: 'text-lime-800',
        borderColor: 'border-lime-200',
        suggestedActions: [
            { text: 'Open Kaizen projects', highlight: true },
            { text: 'SOP review queue' },
            { text: 'Efficiency audits' },
            { text: 'Process optimization' },
            { text: 'Improvement KPIs' },
        ],
    },
    {
        id: 'social-bot',
        name: 'Social PA',
        description: 'Social media: TikTok, Facebook, YouTube, Instagram, LinkedIn',
        icon: MessageCircle,
        bgGradient: 'from-sky-500 to-blue-500',
        lightBg: 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50',
        lightAccent: 'from-sky-200 to-blue-200',
        textColor: 'text-sky-800',
        borderColor: 'border-sky-200',
        suggestedActions: [
            { text: 'TikTok comments', highlight: true },
            { text: 'Facebook comments' },
            { text: 'YouTube comments' },
            { text: 'Instagram comments' },
            { text: 'LinkedIn comments' },
        ],
    },
];
// eslint-disable-next-line no-unused-vars
const _UNUSED_ICONS = Leaf; // keep Leaf imported for future agents

// Default greeting target when no auth context is available.
// Once login lands, pass the logged-in user's name to getDynamicGreeting
// directly; until then everyone is a "Guest".
const GREETING_NAME = 'Guest';

/* Dynamic greeting — date-aware (holidays first, then time-of-day) and
 * user-aware (logged-in name, else "Visitor"). When the auth layer
 * lands, pass the current user's name in via prop/context instead of
 * GREETING_NAME. Returns { line1, line2, festive } so the renderer can
 * apply festive styling when a holiday is in season.
 */
function getDynamicGreeting(name) {
    const who = name || 'Visitor';
    const now = new Date();
    const m = now.getMonth() + 1; // 1-12
    const d = now.getDate();
    const hour = now.getHours();

    // ── Holidays (highest priority) ─────────────────────────
    // Friendly day-greetings only. Never a "How may I help" question —
    // these are well-wishes, not service prompts. The user picks a topic
    // pill or types a message when they're ready.
    // Khmer New Year (Apr 13–16) — and lead-up week (Apr 7–12)
    if (m === 4 && d >= 13 && d <= 16) {
        return {
            line1: `🌸 Sok San Khmer New Year, ${who}!`,
            line2: 'Wishing you health and prosperity.',
            festive: 'khmer-ny',
        };
    }
    if (m === 4 && d >= 7 && d <= 12) {
        return {
            line1: `🌸 Khmer New Year is coming, ${who}!`,
            line2: 'May your week wind down peacefully.',
            festive: 'khmer-ny',
        };
    }
    // Western New Year — Jan 1
    if (m === 1 && d === 1) {
        return {
            line1: `🎉 Happy New Year ${now.getFullYear()}, ${who}!`,
            line2: 'Wishing you a year full of wins.',
            festive: 'new-year',
        };
    }
    // Christmas / NYE week (Dec 24 – Jan 2)
    if ((m === 12 && d >= 24) || (m === 1 && d === 2)) {
        return {
            line1: `🎄 Happy Holidays, ${who}!`,
            line2: 'Wishing you a warm, restful break.',
            festive: 'holidays',
        };
    }
    // Mid-Autumn approx (Sept 15–30)
    if (m === 9 && d >= 15 && d <= 30) {
        return {
            line1: `🌕 Happy Mid-Autumn, ${who}!`,
            line2: 'Wishing you a bright, peaceful season.',
            festive: 'mid-autumn',
        };
    }
    // Pchum Ben — Cambodia Ancestor Day, ~mid Sept to early Oct (varies)
    // Skipping precise window for now; calc lunar date later if needed.

    // ── Default: time-of-day greeting ───────────────────────
    let timeWord = 'Hello';
    if (hour < 12) timeWord = 'Good morning';
    else if (hour < 17) timeWord = 'Good afternoon';
    else timeWord = 'Good evening';

    return {
        line1: `${timeWord}, ${who}`,
        line2: 'Wishing you a productive day.',
        festive: null,
    };
}

// Phone Frame Component with Gemini Chatbot Inside
const PhoneFrame = ({
    bot,
    messages,
    onSendMessage,
    inputValue,
    setInputValue,
    isTyping,
    onNewChat,
    chatHistory,
    onLoadChat,
    onDeleteChat,
    currentChatId,
    botId,
    onShowInvoice,
    adminPAModule,
    adminPAModules,
    adminPAUsedActions,
    onMarkActionUsed,
    financePAModule,
    financePAModules,
    financePAUsedActions,
    onMarkFinanceActionUsed,
    csrPAModule,
    csrPAModules,
    csrPAUsedActions,
    onMarkCsrActionUsed,
    hrPAModule,
    hrPAModules,
    hrPAUsedActions,
    onMarkHrActionUsed,
    onResetAdminPAModule,
    onResetFinancePAModule,
    onResetCsrPAModule,
    onResetHrPAModule,
    botLanguage,
    languages,
    onUpdateBotLanguage,
    // Agentic in-chat pending-items flow (Accounting PA).
    // onPostBotMessage appends a new bot message to the conversation
    // (used to surface pending items as a chat card list rather than a
    // popup modal). onUpdateBotMessage lets us mutate a specific
    // already-posted message — e.g. remove a row when its Approve
    // button is clicked and the action persists in Mongo.
    onPostBotMessage,
    onUpdateBotMessage,
}) => {
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = useRef(null);

    // Accounting PA topic-filter mode. Tapping a starter pill SETS the
    // active topic instead of firing the pill text as a chat message.
    // The textarea placeholder updates ("Ask about <topic>"); submitting
    // a typed message prepends "[Topic: <topic>] " so Gemini scopes its
    // answer. Notif counts come from /api/notifications/accounting and
    // render as a small red badge inside each pill when > 0.
    const [activeTopic, setActiveTopic] = useState(null);
    const [notifCounts, setNotifCounts] = useState({});
    // Pending Items modal — opens when user taps a pill that has a
    // count badge. Lets them act on the records (Approve / Advance) without
    // typing into chat.
    const [pendingModalTopic, setPendingModalTopic] = useState(null);

    const refreshNotifCounts = React.useCallback(() => {
        if (botId !== 'accounting-bot') return;
        fetch('/api/notifications/accounting')
            .then(r => r.json())
            .then(d => { if (d?.ok) setNotifCounts(d.counts || {}); })
            .catch(() => {});
    }, [botId]);

    useEffect(() => {
        if (botId !== 'accounting-bot') return;
        let cancelled = false;
        fetch('/api/notifications/accounting')
            .then(r => r.json())
            .then(d => { if (!cancelled && d?.ok) setNotifCounts(d.counts || {}); })
            .catch(() => { /* silent — badge just doesn't render */ });
        return () => { cancelled = true; };
    }, [botId]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Microphone access is not supported in this browser.");
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.lang = currentLanguageCode === 'kh' ? 'km-KH' : (currentLanguageCode === 'ch' ? 'zh-CN' : 'en-US');
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
        };
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
        
        recognition.start();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result);
            reader.readAsDataURL(file);
        }
    };
    
    // Track current language - update when botLanguage prop changes
    const [currentLanguageCode, setCurrentLanguageCode] = useState(() => botLanguage?.code || 'en');
    const [currentLanguageName, setCurrentLanguageName] = useState(() => botLanguage?.name || 'English');
    
    // Update local state when botLanguage prop changes
    useEffect(() => {
        if (botLanguage?.code) {
            console.log(`PhoneFrame ${botId} - botLanguage prop changed:`, botLanguage);
            setCurrentLanguageCode(botLanguage.code);
            setCurrentLanguageName(botLanguage.name);
        }
    }, [botId, botLanguage]);
    
    // Get current language info - use local state for reactivity
    const selectedLanguageCode = currentLanguageCode;
    const selectedLanguageObj = languages.find(lang => lang.code === selectedLanguageCode) || languages[0];
    const selectedLanguage = currentLanguageName || selectedLanguageObj.name;
    
    // Ensure flag image updates when language changes
    const flagImage = selectedLanguageObj.flagImage || languages[0].flagImage;
    
    // Debug: Log language changes to help troubleshoot
    useEffect(() => {
        console.log(`PhoneFrame ${botId} - Language state:`, {
            botLanguage,
            currentLanguageCode,
            currentLanguageName,
            selectedLanguageCode,
            selectedLanguage,
            flagImage
        });
    }, [botId, botLanguage, currentLanguageCode, currentLanguageName, selectedLanguageCode, selectedLanguage, flagImage]);
    
    // Helper function to parse and render markdown content (tables, formatting, etc.)
    const renderMarkdownContent = (text) => {
        if (!text) return { __html: '' };
        
        // More flexible table regex - matches tables with various formats
        // Pattern 1: Standard markdown table with separator line
        const tableRegex1 = /(\|[^\n\r]+\|[\r\n]+(?:\|[\s\-:]+\|[\r\n]+)(?:\|[^\n\r]+\|[\r\n]*)+)/g;
        // Pattern 2: Table without explicit separator (just multiple pipe rows)
        const tableRegex2 = /((?:\|[^\n\r]+\|[\r\n]+){2,})/g;
        // Pattern 1b: Table with headers like "Request # | Description | Status" followed by data rows
        const headerDataTableRegex = /((?:Request\s*#|Request\s+ID|Request|ID|No\.|Number|Request\s+Number)[^|\n]*\|[^|\n]*(?:Description|Desc)[^|\n]*\|[^|\n]*(?:Status|State)[^|\n]*\s*\n(?:(?:PR\d+|#?\w+\d+|\d+)[^|\n]*\|[^|\n]+\|[^|\n]+\s*\n?)+)/gi;
        
        // Pattern 3: Numbered lists that look like data (e.g., "1. Request #PR001: "Description"")
        // This pattern matches numbered lists with at least 3 items that have a structured format
        // More flexible: handles both \n and \r\n line endings, and also matches lists that might have text before them
        // Also handles patterns like "PR001 | Description" (pipe-separated format)
        const numberedListRegex = /((?:^\d+\.\s+[^\n]+(?:\r?\n|$)){3,})/gm;
        // Also detect pipe-separated format like "PR001 | New Office Furniture" (without numbers)
        const pipeSeparatedRegex = /((?:^[A-Z0-9]+\s*\|\s*[^\n]+(?:\r?\n|$)){3,})/gm;
        
        let processedText = text;
        let tableIndex = 0;
        
        // Replace tables with placeholders first
        const tables = [];
        
        // Try pattern 1b first (header + data rows format like "Request # | Description | Status")
        processedText = processedText.replace(headerDataTableRegex, (match) => {
            // Skip if already processed
            if (match.includes('__TABLE_')) return match;
            
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim() && l.includes('|'));
            if (lines.length >= 2) {
                // First line should be headers
                const headerLine = lines[0];
                const headers = headerLine.split('|').map(h => h.trim()).filter(h => h && !h.match(/^[\s\-:]+$/));
                
                if (headers.length >= 2) {
                    let tableContent = '| ' + headers.join(' | ') + ' |\n|';
                    headers.forEach(() => {
                        tableContent += ' --- |';
                    });
                    tableContent += '\n';
                    
                    // Add data rows
                    lines.slice(1).forEach(line => {
                        const parts = line.split('|').map(p => p.trim()).filter(p => p && !p.match(/^[\s\-:]+$/));
                        if (parts.length > 0) {
                            // Pad to match header count
                            while (parts.length < headers.length) {
                                parts.push('');
                            }
                            tableContent += '| ' + parts.slice(0, headers.length).join(' | ') + ' |\n';
                        }
                    });
                    
                    const tableId = `__TABLE_${tableIndex}__`;
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return tableId;
                }
            }
            return match;
        });
        
        // Try pattern 1 first (with separator)
        processedText = processedText.replace(tableRegex1, (match) => {
            // Skip if already processed
            if (match.includes('__TABLE_')) return match;
            const tableId = `__TABLE_${tableIndex}__`;
            tables.push({ id: tableId, content: match });
            tableIndex++;
            return tableId;
        });
        
        // Then try pattern 2 (without separator, but multiple pipe rows)
        processedText = processedText.replace(tableRegex2, (match) => {
            // Skip if already processed
            if (match.includes('__TABLE_')) return match;
            // Check if this looks like a table (has at least 2 rows with pipes)
            const lines = match.split(/\r?\n/).filter(l => l.trim().includes('|'));
            if (lines.length >= 2 && !tables.some(t => t.content.includes(match))) {
                const tableId = `__TABLE_${tableIndex}__`;
                tables.push({ id: tableId, content: match });
                tableIndex++;
                return tableId;
            }
            return match; // Not a table, keep original
        });
        
        // Try pattern 3: Convert numbered lists to tables (especially purchase requests, etc.)
        processedText = processedText.replace(numberedListRegex, (match) => {
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim());
            // Check if this looks like structured data (e.g., "1. Request #PR001: "Description"")
            // More lenient: check if most lines have a colon or hash symbol (indicating structured data)
            const structuredLines = lines.filter(line => {
                const trimmed = line.trim();
                return /^\d+\.\s+.+[#:].+/.test(trimmed) || /^\d+\.\s+Request\s+#/.test(trimmed) || /^\d+\.\s+.+:\s*/.test(trimmed);
            });
            const hasStructuredPattern = structuredLines.length >= Math.min(3, Math.max(1, lines.length * 0.5)); // At least 50% should be structured, or at least 3 lines
            
            // Also check if it's a simple numbered list (even without colons/hashes) with 5+ items
            const isLongList = lines.length >= 5;
            
            if ((hasStructuredPattern && lines.length >= 3) || isLongList) {
                // Try to extract structured data
                const rows = [];
                lines.forEach(line => {
                    const trimmed = line.trim();
                    // Match: "1. Request #PR001: "New Office Furniture""
                    const match1 = trimmed.match(/^\d+\.\s+Request\s+#([A-Z0-9]+):\s*"([^"]+)"(.*)$/);
                    // Match: "1. Request #PR001: Description" (without quotes)
                    const match2 = trimmed.match(/^\d+\.\s+Request\s+#([A-Z0-9]+):\s*(.+)$/);
                    // Match: "1. PR001: Description (Status)" - direct PR format without "Request #"
                    const match2b = trimmed.match(/^\d+\.\s+PR([A-Z0-9]+):\s*(.+)$/);
                    // Match: "1. Item #ID: Description"
                    const match3 = trimmed.match(/^\d+\.\s+.+?#([A-Z0-9]+):\s*(.+)$/);
                    // Match: "1. Item: Description"
                    const match4 = trimmed.match(/^\d+\.\s+(.+?):\s*(.+)$/);
                    
                    if (match1) {
                        rows.push({ number: trimmed.match(/^\d+/)[0], id: match1[1], description: match1[2], extra: match1[3] });
                    } else if (match2) {
                        rows.push({ number: trimmed.match(/^\d+/)[0], id: match2[1], description: match2[2].trim() });
                    } else if (match2b) {
                        // Handle "1. PR001: Description (Status)" format
                        const fullDesc = match2b[2].trim();
                        rows.push({ number: trimmed.match(/^\d+/)[0], id: match2b[1], description: fullDesc });
                    } else if (match3) {
                        rows.push({ number: trimmed.match(/^\d+/)[0], id: match3[1], description: match3[2].trim() });
                    } else if (match4) {
                        rows.push({ number: trimmed.match(/^\d+/)[0], description: match4[1] + ': ' + match4[2] });
                    } else {
                        // Fallback: just extract number and rest of text
                        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
                        if (numMatch) {
                            rows.push({ number: numMatch[1], description: numMatch[2] });
                        }
                    }
                });
                
                if (rows.length >= 3) {
                    // Convert to table - single column format like the image (all info in one cell)
                    const tableId = `__TABLE_${tableIndex}__`;
                    let tableContent = '| Complete List: |\n| --- |\n';
                    rows.forEach(row => {
                        // Format: "PR001: New Office Furniture (Pending GM Approval)" - all in one cell
                        let rowContent = '';
                        if (row.id) {
                            // PR code in bold (will be styled as bold blue in CSS)
                            rowContent += `<strong>PR${row.id}</strong>: `;
                        }
                        // Description - extract description and status if status is in parentheses
                        let description = (row.description || '').replace(/"/g, '').trim();
                        // Check if description contains status in parentheses (e.g., "New Office Furniture (Pending GM Approval)")
                        const statusMatch = description.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
                        if (statusMatch) {
                            // Split description and status
                            description = statusMatch[1].trim();
                            const status = statusMatch[2].trim();
                            rowContent += description;
                            rowContent += ` (${status})`;
                        } else {
                            // No status in description, use as is
                            rowContent += description;
                            // Add status if present in extra field
                            if (row.extra && row.extra.trim()) {
                                const extraStatusMatch = row.extra.match(/\(([^)]+)\)/);
                                if (extraStatusMatch) {
                                    rowContent += ` (${extraStatusMatch[1]})`;
                                } else {
                                    rowContent += ` ${row.extra.trim()}`;
                                }
                            }
                        }
                        tableContent += `| ${rowContent} |\n`;
                    });
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return tableId;
                }
            }
            return match; // Not structured enough, keep original
        });
        
        // Pattern 3b: Handle pipe-separated format like "PR001 | New Office Furniture | Status" (with multiple columns)
        processedText = processedText.replace(pipeSeparatedRegex, (match) => {
            // Skip if already processed
            if (match.includes('__TABLE_')) return match;
            
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim() && l.includes('|') && !l.match(/^[\s\-:]+$/));
            if (lines.length >= 3) {
                // Check if it's a multi-column table (e.g., "Request # | Description | Status")
                const firstLineParts = lines[0].split('|').map(p => p.trim()).filter(p => p);
                const isMultiColumn = firstLineParts.length >= 3;
                
                if (isMultiColumn) {
                    // Multi-column table - use first line as headers if it looks like headers
                    const firstLine = lines[0].trim();
                    const looksLikeHeaders = /request|description|status|id|number|no\./i.test(firstLine);
                    
                    if (looksLikeHeaders) {
                        // First line is headers, rest are data rows
                        const headers = firstLineParts;
                        let tableContent = '| ' + headers.join(' | ') + ' |\n|';
                        headers.forEach(() => {
                            tableContent += ' --- |';
                        });
                        tableContent += '\n';
                        
                        lines.slice(1).forEach(line => {
                            const parts = line.split('|').map(p => p.trim()).filter(p => p);
                            if (parts.length > 0) {
                                // Pad to match header count
                                while (parts.length < headers.length) {
                                    parts.push('');
                                }
                                tableContent += '| ' + parts.slice(0, headers.length).join(' | ') + ' |\n';
                            }
                        });
                        
                        const tableId = `__TABLE_${tableIndex}__`;
                        tables.push({ id: tableId, content: tableContent });
                        tableIndex++;
                        return tableId;
                    }
                }
                
                // Fallback: treat as simple ID | Description format
                const rows = [];
                lines.forEach(line => {
                    const parts = line.split('|').map(p => p.trim()).filter(p => p);
                    if (parts.length >= 2) {
                        const id = parts[0].trim();
                        const description = parts.slice(1).join(' | ').trim();
                        // Check if first part looks like an ID (PR001, PR002, #PR001, etc.)
                        if (/^[#]?[A-Z]{0,3}[0-9]+$/.test(id) || id.includes('PR') || id.startsWith('#')) {
                            rows.push({ id: id.replace(/#/g, ''), description: description });
                        } else {
                            rows.push({ description: line });
                        }
                    } else if (parts.length === 1 && parts[0]) {
                        rows.push({ description: parts[0] });
                    }
                });
                
                if (rows.length >= 3) {
                    const tableId = `__TABLE_${tableIndex}__`;
                    const hasAnyId = rows.some(r => r.id);
                    let tableContent = '|';
                    if (hasAnyId) {
                        tableContent += ' Request ID |';
                    }
                    tableContent += ' Description |\n|';
                    if (hasAnyId) {
                        tableContent += ' --- |';
                    }
                    tableContent += ' --- |\n';
                    rows.forEach((row) => {
                        tableContent += '|';
                        if (hasAnyId) {
                            tableContent += ` ${row.id || ''} |`;
                        }
                        tableContent += ` ${row.description} |\n`;
                    });
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return tableId;
                }
            }
            return match;
        });
        
        // Pattern 3c: Handle table format with headers like "Request # | Description | Status" followed by data rows
        const headerTableRegex = /((?:Request\s*#|Request\s+ID|Request|ID|No\.|Number)[^|\n]*\|[^|\n]*Description[^|\n]*\|[^|\n]*Status[^|\n]*\n(?:(?:PR\d+|#?\w+\d+)[^|\n]*\|[^|\n]+\|[^|\n]+\n?)+)/gi;
        processedText = processedText.replace(headerTableRegex, (match) => {
            // Skip if already processed
            if (match.includes('__TABLE_')) return match;
            
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim() && l.includes('|'));
            if (lines.length >= 2) {
                // First line should be headers
                const headerLine = lines[0];
                const headers = headerLine.split('|').map(h => h.trim()).filter(h => h && !h.match(/^[\s\-:]+$/));
                
                if (headers.length >= 2) {
                    let tableContent = '| ' + headers.join(' | ') + ' |\n|';
                    headers.forEach(() => {
                        tableContent += ' --- |';
                    });
                    tableContent += '\n';
                    
                    // Add data rows
                    lines.slice(1).forEach(line => {
                        const parts = line.split('|').map(p => p.trim()).filter(p => p && !p.match(/^[\s\-:]+$/));
                        if (parts.length > 0) {
                            // Pad to match header count
                            while (parts.length < headers.length) {
                                parts.push('');
                            }
                            tableContent += '| ' + parts.slice(0, headers.length).join(' | ') + ' |\n';
                        }
                    });
                    
                    const tableId = `__TABLE_${tableIndex}__`;
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return tableId;
                }
            }
            return match;
        });
        
        // Pattern 4: Also handle numbered lists that might be in a single paragraph or have text before them
        // This pattern looks for sequences like "1. Item 2. Item 3. Item" even in continuous text
        const inlineNumberedListRegex = /([^|])((?:\d+\.\s+[^0-9\n]+(?:\.\s+|:\s*|$)){5,})/g;
        processedText = processedText.replace(inlineNumberedListRegex, (prefix, match) => {
            // Skip if already processed
            if (match.includes('__TABLE_')) return prefix + match;
            
            // Try to split by number patterns
            const items = match.match(/\d+\.\s+[^0-9]+?(?=\d+\.|$)/g);
            if (items && items.length >= 5) {
                const rows = [];
                let hasIdPattern = false;
                
                items.forEach(item => {
                    const trimmed = item.trim();
                    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
                    if (numMatch) {
                        const rest = numMatch[2].trim();
                        const idMatch = rest.match(/#([A-Z0-9]+)/);
                        if (idMatch) {
                            hasIdPattern = true;
                            let description = rest.replace(/^[^:]*:\s*/, '').replace(/^"/, '').replace(/"$/, '').trim();
                            if (!description) description = rest.replace(/#[A-Z0-9]+/, '').replace(/^[^:]*:\s*/, '').trim();
                            rows.push({ number: numMatch[1], id: idMatch[1], description: description || rest });
                        } else {
                            const colonMatch = rest.match(/^[^:]+:\s*(.+)$/);
                            rows.push({ number: numMatch[1], description: colonMatch ? colonMatch[1].replace(/"/g, '').trim() : rest });
                        }
                    }
                });
                
                if (rows.length >= 5) {
                    const tableId = `__TABLE_${tableIndex}__`;
                    let tableContent = '| No. |';
                    if (hasIdPattern && rows[0].id) {
                        tableContent += ' Request ID |';
                    }
                    tableContent += ' Description |\n|';
                    if (hasIdPattern && rows[0].id) {
                        tableContent += ' --- |';
                    }
                    tableContent += ' --- | --- |\n';
                    rows.forEach(row => {
                        tableContent += `| ${row.number} |`;
                        if (hasIdPattern && row.id) {
                            tableContent += ` #${row.id} |`;
                        }
                        tableContent += ` ${row.description.replace(/"/g, '').trim()} |\n`;
                    });
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return prefix + tableId;
                }
            }
            return prefix + match;
        });
        
        // Pattern 5: Fallback - catch any numbered list with 5+ items and convert to simple table
        // This is more aggressive and will catch lists that pattern 3 might miss
        const fallbackNumberedListRegex = /((?:^\d+\.\s+[^\n]+(?:\r?\n|$)){5,})/gm;
        processedText = processedText.replace(fallbackNumberedListRegex, (match) => {
            // Skip if already processed as a table
            if (match.includes('__TABLE_')) return match;
            
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim() && /^\d+\./.test(l.trim()));
            if (lines.length >= 5) {
                const rows = [];
                let hasIdPattern = false;
                
                lines.forEach(line => {
                    const trimmed = line.trim();
                    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
                    if (numMatch) {
                        const rest = numMatch[2];
                        // Check for ID pattern (#PR001, #ID, etc.)
                        const idMatch = rest.match(/#([A-Z0-9]+)/);
                        if (idMatch) {
                            hasIdPattern = true;
                            // Extract description - remove quotes and clean up
                            let description = rest.replace(/^[^:]*:\s*/, '').replace(/^"/, '').replace(/"$/, '').trim();
                            if (!description) {
                                description = rest.replace(/#[A-Z0-9]+/, '').replace(/^[^:]*:\s*/, '').trim();
                            }
                            if (!description) description = rest;
                            rows.push({ number: numMatch[1], id: idMatch[1], description: description });
                        } else {
                            // Extract description after colon
                            const colonMatch = rest.match(/^[^:]+:\s*(.+)$/);
                            if (colonMatch) {
                                let desc = colonMatch[1].replace(/^"/, '').replace(/"$/, '').trim();
                                rows.push({ number: numMatch[1], description: desc || rest });
                            } else {
                                rows.push({ number: numMatch[1], description: rest });
                            }
                        }
                    }
                });
                
                if (rows.length >= 5) {
                    const tableId = `__TABLE_${tableIndex}__`;
                    let tableContent = '| No. |';
                    if (hasIdPattern && rows[0].id) {
                        tableContent += ' Request ID |';
                    }
                    tableContent += ' Description |\n|';
                    if (hasIdPattern && rows[0].id) {
                        tableContent += ' --- |';
                    }
                    tableContent += ' --- | --- |\n';
                    rows.forEach(row => {
                        tableContent += `| ${row.number} |`;
                        if (hasIdPattern && row.id) {
                            tableContent += ` #${row.id} |`;
                        }
                        tableContent += ` ${row.description.replace(/"/g, '').trim()} |\n`;
                    });
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return tableId;
                }
            }
            return match;
        });
        
        // Pattern 4: Also detect simple numbered lists without Request prefix (more flexible)
        // This catches lists that might not have "Request" in them but are still structured
        const simpleNumberedListRegex = /((?:^\d+\.\s+[^\n]+(?:\r?\n|$)){5,})/gm;
        processedText = processedText.replace(simpleNumberedListRegex, (match) => {
            // Skip if already processed as a table
            if (match.includes('__TABLE_')) return match;
            
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim());
            // Check if it's a simple numbered list (at least 5 items)
            if (lines.length >= 5) {
                const rows = [];
                let hasIdPattern = false;
                
                lines.forEach(line => {
                    const trimmed = line.trim();
                    // Try to extract number and description
                    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
                    if (numMatch) {
                        const rest = numMatch[2];
                        // Check if it has an ID pattern like #PR001, #ID, etc.
                        const idMatch = rest.match(/#([A-Z0-9]+)/);
                        if (idMatch) {
                            hasIdPattern = true;
                            const description = rest.replace(/^[^:]+:\s*/, '').replace(/^[^"]*"/, '').replace(/"[^"]*$/, '').trim();
                            rows.push({ number: numMatch[1], id: idMatch[1], description: description || rest });
                        } else {
                            // Extract description after colon if present
                            const colonMatch = rest.match(/^[^:]+:\s*(.+)$/);
                            if (colonMatch) {
                                const desc = colonMatch[1].replace(/^"/, '').replace(/"$/, '').trim();
                                rows.push({ number: numMatch[1], description: desc || rest });
                            } else {
                                rows.push({ number: numMatch[1], description: rest });
                            }
                        }
                    }
                });
                
                if (rows.length >= 5) {
                    // Convert to table
                    const tableId = `__TABLE_${tableIndex}__`;
                    let tableContent = '| No. |';
                    if (hasIdPattern && rows[0].id) {
                        tableContent += ' Request ID |';
                    }
                    tableContent += ' Description |\n|';
                    if (hasIdPattern && rows[0].id) {
                        tableContent += ' --- |';
                    }
                    tableContent += ' --- | --- |\n';
                    rows.forEach(row => {
                        tableContent += `| ${row.number} |`;
                        if (hasIdPattern && row.id) {
                            tableContent += ` #${row.id} |`;
                        }
                        tableContent += ` ${row.description.replace(/"/g, '')} |\n`;
                    });
                    tables.push({ id: tableId, content: tableContent });
                    tableIndex++;
                    return tableId;
                }
            }
            return match;
        });
        
        // Process other markdown formatting (but preserve table placeholders)
        let html = processedText
            // Bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            // Italic text (but not if it's part of bold)
            .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic">$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto border border-gray-200"><code class="text-xs">$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
            // Line breaks (but preserve table placeholders)
            .replace(/\n/g, '<br />');
        
        // Replace table placeholders with rendered HTML tables
        tables.forEach(({ id, content }) => {
            const tableHtml = parseMarkdownTable(content);
            html = html.replace(id, tableHtml);
        });
        
        return { __html: html };
    };
    
    // Helper function to parse markdown table into HTML
    const parseMarkdownTable = (markdownTable) => {
        const lines = markdownTable.trim().split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) return markdownTable; // Not a valid table
        
        // Parse header - handle tables with or without leading/trailing pipes
        const headerLine = lines[0].trim();
        let headers = headerLine.split('|').map(h => h.trim());
        
        // Remove empty first/last elements if table has leading/trailing pipes
        if (headers[0] === '') headers = headers.slice(1);
        if (headers[headers.length - 1] === '') headers = headers.slice(0, -1);
        
        // Filter out separator-only cells
        headers = headers.filter(h => h && !h.match(/^[\s\-:]+$/));
        
        if (headers.length === 0) return markdownTable; // Invalid table
        
        // Check if second line is a separator (contains dashes/colons)
        const secondLine = lines[1] ? lines[1].trim() : '';
        const isSeparatorLine = secondLine.match(/^[|\s\-:]+$/);
        
        // Skip separator line if present, otherwise start from line 1
        const dataLines = isSeparatorLine 
            ? lines.slice(2).filter(line => {
                const trimmed = line.trim();
                return trimmed && !trimmed.match(/^[|\s\-:]+$/);
            })
            : lines.slice(1).filter(line => {
                const trimmed = line.trim();
                return trimmed && !trimmed.match(/^[|\s\-:]+$/);
            });
        
        // Build HTML table with clean, minimalist styling (like the example image - card-like with rounded corners)
        // Calculate minimum width based on number of columns (150px per column minimum)
        const minTableWidth = headers.length * 150;
        let tableHtml = '<div class="table-container-wrapper my-4" style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch; max-width: 100%; width: 100%; position: relative;">';
        tableHtml += `<table class="data-table" style="border-collapse: collapse; width: 100%; min-width: ${Math.max(600, minTableWidth)}px; table-layout: auto; margin: 0; background: white; border-spacing: 0; border-radius: 8px; overflow: hidden;">`;
        
        // Header row with light gray background (like the example)
        tableHtml += '<thead><tr>';
        headers.forEach((header, idx) => {
            const escapedHeader = header.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            // Set appropriate column widths to prevent truncation
            let colWidth = '';
            if (idx === 0) {
                colWidth = 'min-width: 100px; width: 15%;'; // First column
            } else if (idx === headers.length - 1) {
                colWidth = 'min-width: 180px; width: 25%;'; // Last column
            } else {
                colWidth = 'min-width: 200px; width: auto;'; // Middle columns - flexible
            }
            tableHtml += `<th style="border-bottom: 1px solid #e5e7eb; padding: 12px 16px; text-align: left; font-weight: 700; font-size: 0.875rem; color: #111827; white-space: nowrap; background: #f9fafb; ${colWidth}">${escapedHeader}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        // Data rows
        tableHtml += '<tbody>';
        dataLines.forEach((line, rowIndex) => {
            let cells = line.split('|').map(c => c.trim());
            
            // Remove empty first/last elements if table has leading/trailing pipes
            if (cells[0] === '') cells = cells.slice(1);
            if (cells[cells.length - 1] === '') cells = cells.slice(0, -1);
            
            // Filter out separator-only cells
            cells = cells.filter(c => c && !c.match(/^[\s\-:]+$/));
            
            if (cells.length === 0) return;
            
            // Skip rows with just "..." or similar placeholders
            if (cells.every(cell => cell.match(/^\.{2,}$/))) return;
            
            // Clean row styling - white background with horizontal line only (like the example)
            tableHtml += '<tr>';
            
            // Ensure we have the right number of cells (pad if needed)
            const paddedCells = [...cells];
            while (paddedCells.length < headers.length) {
                paddedCells.push('');
            }
            
            paddedCells.slice(0, headers.length).forEach((cell, cellIndex) => {
                // Handle cell styling - clean and minimalist (like the example image)
                let cellContent = cell || '';
                
                // For single-column tables (like "Complete List:"), format the content nicely BEFORE escaping
                if (headers.length === 1 && cellContent) {
                    // Extract PR codes and make them bold blue, status in parentheses
                    cellContent = cellContent.replace(/(PR\d+)/g, '<strong style="color: #1e40af; font-weight: 700;">$1</strong>');
                    // Color code status in parentheses
                    cellContent = cellContent.replace(/\(([^)]+)\)/g, (match, status) => {
                        const statusLower = status.toLowerCase();
                        let statusColor = '#374151';
                        if (statusLower.includes('pending') || statusLower.includes('pend') || statusLower.includes('waiting')) {
                            statusColor = '#d97706';
                        } else if (statusLower.includes('approved') || statusLower.includes('apprn') || statusLower.includes('completed')) {
                            statusColor = '#059669';
                        } else if (statusLower.includes('rejected') || statusLower.includes('reject') || statusLower.includes('cancelled')) {
                            statusColor = '#dc2626';
                        } else if (statusLower.includes('in progress') || statusLower.includes('processing')) {
                            statusColor = '#2563eb';
                        }
                        return `(<span style="color: ${statusColor};">${status}</span>)`;
                    });
                } else {
                    // For multi-column tables, escape HTML
                    cellContent = cellContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                
                // Clean, minimalist cell styling - horizontal line only, no vertical borders (like the example)
                let cellStyle = `border-bottom: 1px solid #e5e7eb; border-left: none; border-right: none; border-top: none; padding: 12px 16px; font-size: 0.875rem; color: #374151; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.5; vertical-align: middle; background: white; font-weight: 400;`;
                
                // All cells have same clean styling (like the example - no vertical borders)
                tableHtml += `<td style="${cellStyle}">${cellContent}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table></div>';
        
        return tableHtml;
    };
    
    // Get suggested actions based on Admin PA module selection
    let suggestedActions = bot.suggestedActions || [
        { text: 'Create image', highlight: true },
        { text: 'Create video' },
        { text: 'Write anything' },
        { text: 'Help me learn' },
        { text: 'Boost my day' }
    ];
    
    // For Admin PA, show module-specific actions if a module is selected, filtering out used ones
    if (botId === 'admin-bot' && adminPAModule && adminPAModules && adminPAModules[adminPAModule]) {
        const allActions = adminPAModules[adminPAModule].suggestedActions;
        const usedActions = adminPAUsedActions && adminPAUsedActions[adminPAModule] ? adminPAUsedActions[adminPAModule] : [];
        // Filter out actions that have been used
        suggestedActions = allActions.filter(action => !usedActions.includes(action.text));
    }
    
    // For Finance PA, show module-specific actions if a module is selected, filtering out used ones
    if (botId === 'finance-bot' && financePAModule && financePAModules && financePAModules[financePAModule]) {
        const allActions = financePAModules[financePAModule].suggestedActions;
        const usedActions = financePAUsedActions && financePAUsedActions[financePAModule] ? financePAUsedActions[financePAModule] : [];
        // Filter out actions that have been used
        suggestedActions = allActions.filter(action => !usedActions.includes(action.text));
    }
    
    // For CSR PA, show module-specific actions if a module is selected, filtering out used ones
    if (botId === 'csr-bot' && csrPAModule && csrPAModules && csrPAModules[csrPAModule]) {
        const allActions = csrPAModules[csrPAModule].suggestedActions;
        const usedActions = csrPAUsedActions && csrPAUsedActions[csrPAModule] ? csrPAUsedActions[csrPAModule] : [];
        // Filter out actions that have been used
        suggestedActions = allActions.filter(action => !usedActions.includes(action.text));
    }
    
    // For HR PA, show module-specific actions if a module is selected, filtering out used ones
    if (botId === 'hr-bot' && hrPAModule && hrPAModules && hrPAModules[hrPAModule]) {
        const allActions = hrPAModules[hrPAModule].suggestedActions;
        const usedActions = hrPAUsedActions && hrPAUsedActions[hrPAModule] ? hrPAUsedActions[hrPAModule] : [];
        // Filter out actions that have been used
        suggestedActions = allActions.filter(action => !usedActions.includes(action.text));
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() && !uploadedImage) return;

        let finalMessage = inputValue.trim();
        // Accounting PA: if a topic filter is active, prepend it so the
        // backend (and Gemini) know the scope of the question.
        if (botId === 'accounting-bot' && activeTopic) {
            finalMessage = `[Topic: ${activeTopic}] ${finalMessage}`;
        }
        if (uploadedImage) {
            finalMessage += ` [IMAGE_DATA:${uploadedImage}]`;
        }

        onSendMessage(finalMessage);
        setInputValue('');
        setUploadedImage(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="relative w-full h-full flex items-stretch justify-center">
            {/* Phone Frame */}
            <div className="relative mx-auto bg-gray-900 rounded-[3rem] p-2 shadow-2xl phone-frame flex-shrink-0 w-full h-full">
                {/* Phone Screen */}
                <div className={`w-full h-full ${bot.lightBg || 'bg-gradient-to-br from-slate-50 to-gray-50'} rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl border-2 ${bot.borderColor || 'border-gray-200'}`}>
                    {/* Notch */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 ${bot.lightBg || 'bg-gradient-to-br from-slate-50 to-gray-50'} rounded-b-2xl z-20`}></div>

                    {/* Gemini Chatbot Interface */}
                    <div className={`flex flex-col h-full min-h-0 ${bot.lightBg || 'bg-gradient-to-br from-slate-50 to-gray-50'} ${bot.textColor || 'text-gray-800'} relative`}>
                        {/* History Sidebar */}
                        <div className={`absolute inset-y-0 left-0 z-50 w-64 ${bot.lightBg || 'bg-gradient-to-br from-slate-50 to-gray-50'} border-r ${bot.borderColor || 'border-gray-200'} transform transition-transform duration-300 ease-in-out ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}>
                            <div className="flex flex-col h-full">
                                {/* Sidebar Header */}
                                <div className={`flex items-center justify-between p-4 border-b ${bot.borderColor || 'border-gray-200'}`}>
                                    <h2 className={`text-sm font-semibold ${bot.textColor || 'text-gray-800'}`}>Chat History</h2>
                                    <button
                                        onClick={() => setIsHistoryOpen(false)}
                                        className={`p-1.5 rounded-full hover:bg-black/5 transition`}
                                    >
                                        <X size={16} className={bot.textColor || 'text-gray-600'} />
                                    </button>
                                </div>

                                {/* New Chat Button */}
                                <div className={`p-3 border-b ${bot.borderColor || 'border-gray-200'}`}>
                                    <button
                                        onClick={() => {
                                            if (onNewChat) onNewChat();
                                            setIsHistoryOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'} border ${bot.borderColor || 'border-gray-200'} hover:opacity-80 transition shadow-sm`}
                                    >
                                        <Plus size={14} className={bot.textColor || 'text-gray-700'} />
                                        <span className={`text-xs font-medium ${bot.textColor || 'text-gray-700'}`}>New Chat</span>
                                    </button>
                                </div>

                                {/* Chat List */}
                                <div className="flex-1 overflow-y-auto">
                                    {chatHistory && chatHistory.length === 0 ? (
                                        <div className={`p-4 text-center ${bot.textColor || 'text-gray-500'} text-xs`}>
                                            No chat history yet
                                        </div>
                                    ) : (
                                        <div className="p-2">
                                            {chatHistory && chatHistory.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    onClick={() => {
                                                        if (onLoadChat) onLoadChat(chat.id);
                                                        setIsHistoryOpen(false);
                                                    }}
                                                    className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-black/5 transition ${currentChatId === chat.id ? `bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'}` : ''
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs ${bot.textColor || 'text-gray-800'} font-medium truncate`}>{chat.title}</p>
                                                        <p className={`text-[10px] ${bot.textColor || 'text-gray-500'} mt-0.5`}>
                                                            {new Date(chat.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onDeleteChat) onDeleteChat(chat.id);
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
                        
                        {/* Overlay when language dropdown is open */}
                        {isLanguageDropdownOpen && (
                            <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsLanguageDropdownOpen(false)}
                            />
                        )}

                        {/* Header with Bot Name and Avatar */}
                        <div className={`flex-shrink-0 flex items-center justify-between px-4 pt-12 pb-3 border-b ${KHMER_NEW_YEAR.isActive ? 'border-red-400/50 bg-gradient-to-r from-red-600/10 via-orange-500/10 to-yellow-500/10' : bot.borderColor || 'border-gray-200'} relative z-10`}>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        // For Admin PA, Finance PA, HR PA, and CSR PA:
                                        // - If a module is selected, reset to show module selection
                                        // - If no module is selected, show chat history
                                        if (botId === 'admin-bot') {
                                            if (adminPAModule && onResetAdminPAModule) {
                                                onResetAdminPAModule();
                                            } else {
                                                setIsHistoryOpen(true);
                                            }
                                        } else if (botId === 'finance-bot') {
                                            if (financePAModule && onResetFinancePAModule) {
                                                onResetFinancePAModule();
                                            } else {
                                                setIsHistoryOpen(true);
                                            }
                                        } else if (botId === 'hr-bot') {
                                            if (hrPAModule && onResetHrPAModule) {
                                                onResetHrPAModule();
                                            } else {
                                                setIsHistoryOpen(true);
                                            }
                                        } else if (botId === 'csr-bot') {
                                            if (csrPAModule && onResetCsrPAModule) {
                                                onResetCsrPAModule();
                                            } else {
                                                setIsHistoryOpen(true);
                                            }
                                        } else {
                                            // For other bots, show chat history
                                            setIsHistoryOpen(true);
                                        }
                                    }}
                                    className={`p-2 rounded-full hover:bg-black/5 transition`}
                                    title={((botId === 'admin-bot' && adminPAModule) || (botId === 'finance-bot' && financePAModule) || (botId === 'hr-bot' && hrPAModule) || (botId === 'csr-bot' && csrPAModule)) ? "Show modules" : "Chat history"}
                                >
                                    <Menu size={18} className={bot.textColor || 'text-gray-600'} />
                                </button>
                                <button
                                    onClick={() => {
                                        setInputValue('');
                                        if (onNewChat) onNewChat();
                                    }}
                                    className={`px-3 py-1.5 rounded-full hover:bg-black/5 transition text-xs font-medium ${bot.textColor || 'text-gray-600'}`}
                                    title="Menu"
                                >
                                    Menu
                                </button>
                            </div>
                            {/* Bot Name - Centered. For Accounting PA, the
                                identity shifts to the active topic agent so the
                                user knows "I'm now talking to the Purchase
                                Request specialist", not the parent PA. */}
                            <div className="absolute left-1/2 transform -translate-x-1/2">
                                <span className={`text-sm font-semibold ${bot.textColor || 'text-gray-800'}`}>
                                    {botId === 'accounting-bot' && activeTopic
                                        ? `${activeTopic} PA`
                                        : bot.name}
                                </span>
                            </div>
                            {/* Right Side - Language Selector and Bot Avatar */}
                            <div className="flex items-center gap-2">
                                {/* Language Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                        className={`flex items-center gap-1 px-1.5 py-1.5 rounded-lg hover:bg-black/5 transition ${bot.textColor || 'text-gray-600'}`}
                                        title="Select Language"
                                    >
                                        <img 
                                            key={`flag-${selectedLanguageCode}-${botId}`}
                                            src={flagImage}
                                            alt={selectedLanguage}
                                            className="w-6 h-6 object-contain rounded-sm"
                                            onError={(e) => {
                                                console.error('Flag image failed to load:', flagImage);
                                                e.target.src = languages[0].flagImage;
                                            }}
                                        />
                                        <ChevronDown 
                                            size={10} 
                                            className={`${bot.textColor || 'text-gray-500'} transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                                        />
                                    </button>
                                    
                                    {/* Language Dropdown */}
                                    {isLanguageDropdownOpen && (
                                        <div className={`absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border ${bot.borderColor || 'border-gray-200'} z-50 overflow-hidden`}>
                                            <div className="max-h-64 overflow-y-auto">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            console.log(`Language selected: ${lang.code} (${lang.name}) for bot ${botId}`);
                                                            if (onUpdateBotLanguage) {
                                                                onUpdateBotLanguage(botId, lang.code);
                                                                // Update local state immediately for instant UI feedback
                                                                setCurrentLanguageCode(lang.code);
                                                                setCurrentLanguageName(lang.name);
                                                            }
                                                            setIsLanguageDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-black/5 transition ${
                                                            selectedLanguageCode === lang.code 
                                                                ? `bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'}` 
                                                                : ''
                                                        } ${bot.textColor || 'text-gray-700'}`}
                                                    >
                                                        <img 
                                                            src={lang.flagImage}
                                                            alt={lang.name}
                                                            className="w-5 h-5 object-contain rounded-sm flex-shrink-0"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <span className="text-xs font-medium flex-1">{lang.name}</span>
                                                        {selectedLanguageCode === lang.code && (
                                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${bot.bgGradient}`}></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Bot Avatar */}
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${KHMER_NEW_YEAR.isActive ? 'from-red-500 to-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : bot.bgGradient} flex items-center justify-center border-2 border-white/20 shadow-md`}>
                                        <bot.icon size={20} className="text-white" />
                                    </div>
                                    {KHMER_NEW_YEAR.isActive && <div className="absolute -top-1 -right-1 z-10 text-xs drop-shadow-md cursor-default pointer-events-none">🌸</div>}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 min-h-0">
                            {!hasMessages ? (
                                // Welcome Screen
                                <div className="space-y-6 pt-8">
                                    <div>
                                        {(() => {
                                            const g = getDynamicGreeting(GREETING_NAME);
                                            const festiveGradient = g.festive === 'khmer-ny'
                                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500'
                                                : g.festive === 'new-year' || g.festive === 'holidays'
                                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-rose-500'
                                                    : g.festive === 'mid-autumn'
                                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600'
                                                        : null;
                                            return (
                                                <>
                                                    <p className={`text-sm ${bot.textColor || 'text-gray-600'} mb-2`}>{g.line1}</p>
                                                    <h2 className={`text-2xl sm:text-3xl font-light leading-tight ${festiveGradient || bot.textColor || 'text-gray-800'}`}>
                                                        {g.line2}
                                                    </h2>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    {/* Legacy module-box flow disabled for the new 13-agent set —
                                        all bots now render their own `suggestedActions` uniformly. */}
                                    {false ? (
                                        // Module Boxes for Admin PA, Finance PA, CSR PA, or HR PA (dead code)
                                        <div className="space-y-4 mt-8">
                                            <p className={`text-sm ${bot.textColor || 'text-gray-600'} mb-4`}>Select a module:</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {Object.entries((botId === 'admin-bot' ? adminPAModules : botId === 'finance-bot' ? financePAModules : botId === 'csr-bot' ? csrPAModules : hrPAModules) || {}).map(([key, module]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => onSendMessage(module.name)}
                                                        className={`text-left px-5 py-4 rounded-xl bg-gradient-to-r ${module.lightColor} border-2 border-transparent hover:border-${module.color.split('-')[1]}-300 text-sm ${bot.textColor || 'text-gray-800'} hover:shadow-lg transition-all flex items-center gap-3 font-medium`}
                                                    >
                                                        <span className="text-2xl">{module.icon}</span>
                                                        <span className="flex-1">{module.name}</span>
                                                        <ChevronRight size={18} className="opacity-50" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Regular Suggested Actions or Admin PA Module Actions
                                        suggestedActions.length > 0 && (
                                            <div className="flex flex-col gap-2 mt-8">
                                                {suggestedActions.map((action, idx) => {
                                                    const isAccountingFilter = botId === 'accounting-bot';
                                                    const isActiveTopic = isAccountingFilter && activeTopic === action.text;
                                                    const badgeCount = isAccountingFilter ? (notifCounts[action.text] || 0) : 0;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                // Accounting PA: tapping a pill TOGGLES the topic filter
                                                                // — UNLESS that pill has a pending-items badge, in which
                                                                // case fetch the items and post them as an in-chat agent
                                                                // message with inline Approve buttons (no popup). The
                                                                // user can drive the queue right from the conversation.
                                                                if (isAccountingFilter) {
                                                                    if (badgeCount > 0 && onPostBotMessage) {
                                                                        // Optimistic loading message — replaced once the
                                                                        // fetch resolves.
                                                                        onPostBotMessage({
                                                                            from: 'bot',
                                                                            type: 'pending_items',
                                                                            topic: action.text,
                                                                            text: `Loading ${badgeCount} item${badgeCount === 1 ? '' : 's'} for "${action.text}"…`,
                                                                            items: [],
                                                                            collection: null,
                                                                            nextStatusMap: {},
                                                                            loading: true,
                                                                        });
                                                                        fetch(`/api/notifications/accounting/items?topic=${encodeURIComponent(action.text)}`)
                                                                            .then(r => r.json())
                                                                            .then(data => {
                                                                                if (!onUpdateBotMessage) return;
                                                                                // Update the most recently posted pending_items
                                                                                // message for this topic by mutating the last
                                                                                // message via a functional updater.
                                                                                const lastIdx = (messages?.length || 0);
                                                                                onUpdateBotMessage(lastIdx, (prev) => ({
                                                                                    ...prev,
                                                                                    text: data?.ok
                                                                                        ? `Here ${data.items.length === 1 ? 'is' : 'are'} ${data.items.length} ${action.text.toLowerCase()} item${data.items.length === 1 ? '' : 's'} awaiting action. Tap Approve to advance each one.`
                                                                                        : `Couldn't load items: ${data?.error || 'unknown error'}`,
                                                                                    items: data?.items || [],
                                                                                    collection: data?.collection || null,
                                                                                    nextStatusMap: data?.nextStatusMap || {},
                                                                                    loading: false,
                                                                                }));
                                                                            })
                                                                            .catch(() => {
                                                                                if (!onUpdateBotMessage) return;
                                                                                const lastIdx = (messages?.length || 0);
                                                                                onUpdateBotMessage(lastIdx, (prev) => ({
                                                                                    ...prev,
                                                                                    text: '(Network error fetching items.)',
                                                                                    loading: false,
                                                                                }));
                                                                            });
                                                                    } else {
                                                                        setActiveTopic(prev => prev === action.text ? null : action.text);
                                                                    }
                                                                    return;
                                                                }
                                                                // Mark action as used immediately for Admin PA modules
                                                                if (botId === 'admin-bot' && adminPAModule && onMarkActionUsed) {
                                                                    onMarkActionUsed(adminPAModule, action.text);
                                                                }
                                                                // Mark action as used immediately for Finance PA modules
                                                                if (botId === 'finance-bot' && financePAModule && onMarkFinanceActionUsed) {
                                                                    onMarkFinanceActionUsed(financePAModule, action.text);
                                                                }
                                                                // Mark action as used immediately for CSR PA modules
                                                                if (botId === 'csr-bot' && csrPAModule && onMarkCsrActionUsed) {
                                                                    onMarkCsrActionUsed(csrPAModule, action.text);
                                                                }
                                                                // Mark action as used immediately for HR PA modules
                                                                if (botId === 'hr-bot' && hrPAModule && onMarkHrActionUsed) {
                                                                    onMarkHrActionUsed(hrPAModule, action.text);
                                                                }
                                                                onSendMessage(action.text);
                                                            }}
                                                            className={`text-left px-5 py-3 rounded-full bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'} border ${bot.borderColor || 'border-gray-200'} text-sm ${bot.textColor || 'text-gray-800'} hover:opacity-80 hover:shadow-md transition flex items-center gap-2 font-medium ${isActiveTopic ? 'ring-2 ring-offset-1 ring-emerald-500 shadow-md' : ''}`}
                                                        >
                                                            {action.highlight && <Sparkles size={16} className={`text-${bot.bgGradient.split('-')[1]}-500`} />}
                                                            <span className="flex-1">{action.text}</span>
                                                            {badgeCount > 0 && (
                                                                <span
                                                                    className="ml-auto inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold leading-none shadow-sm"
                                                                    title={`${badgeCount} pending`}
                                                                >
                                                                    {badgeCount}
                                                                </span>
                                                            )}
                                                            {isActiveTopic && (
                                                                <X size={14} className="text-emerald-700/80 ml-1" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                // Messages Display
                                <div className="space-y-4">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex items-start gap-3 group ${msg.from === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                        >
                                            {msg.from === 'bot' && (
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${bot.bgGradient} flex items-center justify-center flex-shrink-0`}>
                                                    <bot.icon size={16} className="text-white" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1 max-w-[85%]">
                                                <div
                                                    className={`rounded-2xl px-4 py-2.5 text-sm ${msg.from === 'user'
                                                        ? `bg-gradient-to-r ${bot.bgGradient} text-white rounded-br-none shadow-lg`
                                                        : `bg-white border ${bot.borderColor || 'border-gray-200'} ${bot.textColor || 'text-gray-800'} rounded-bl-none shadow-sm`
                                                        }`}
                                                >
                                                    {msg.type !== 'social-media' && (
                                                        <div className="markdown-content">
                                                            {msg.from === 'user' && msg.text.includes('[IMAGE_DATA:') && (
                                                                <div className="mb-2 rounded-lg overflow-hidden border border-white/30 bg-white/10">
                                                                    <img src={msg.text.match(/\[IMAGE_DATA:(.*?)\]/)?.[1]} alt="Uploaded" className="max-w-full max-h-48 object-contain" />
                                                                </div>
                                                            )}
                                                            <div 
                                                                className="prose prose-sm max-w-none text-current"
                                                                style={{ color: msg.from === 'user' ? 'white' : undefined }}
                                                                dangerouslySetInnerHTML={renderMarkdownContent(msg.from === 'user' ? msg.text.replace(/\[IMAGE_DATA:.*?\]/g, '').trim() : msg.text)}
                                                            />
                                                        </div>
                                                    )}
                                                    {msg.type === 'button' && msg.buttonText && (
                                                        <button
                                                            onClick={() => {
                                                                // Handle pay button click
                                                                onSendMessage(`Pay for ${msg.text}`);
                                                            }}
                                                            className={`mt-2 px-4 py-2 rounded-lg bg-gradient-to-r ${bot.bgGradient} text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-md`}
                                                        >
                                                            {msg.buttonText}
                                                        </button>
                                                    )}
                                                    {msg.type === 'dropdown' && msg.dropdownItems && (
                                                        <div className="mt-2 space-y-2">
                                                            {msg.dropdownItems.map((item) => (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => {
                                                                        onSendMessage(`Generate ${item.text}`);
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'} border ${bot.borderColor || 'border-gray-200'} ${bot.textColor || 'text-gray-800'} text-xs hover:opacity-80 transition-opacity`}
                                                                >
                                                                    {item.text}
                                                                </button>
                                                            ))}
                                                            <button
                                                                onClick={() => {
                                                                    onSendMessage('Generate');
                                                                }}
                                                                className={`w-full px-3 py-2 rounded-lg bg-gradient-to-r ${bot.bgGradient} text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-md`}
                                                            >
                                                                Generate
                                                            </button>
                                                        </div>
                                                    )}
                                                    {msg.type === 'invoice-list' && msg.dropdownItems && (
                                                        <div className="mt-2 space-y-2">
                                                            {msg.dropdownItems.map((item) => (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => {
                                                                        // Show invoice image directly when clicked
                                                                        if (onShowInvoice) {
                                                                            onShowInvoice(item);
                                                                        } else {
                                                                            // Fallback: send message
                                                                            onSendMessage(`Show invoice: ${item.text}`);
                                                                        }
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'} border ${bot.borderColor || 'border-gray-200'} ${bot.textColor || 'text-gray-800'} text-xs hover:opacity-80 transition-opacity hover:shadow-md`}
                                                                >
                                                                    {item.text}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {msg.type === 'invoice-image' && msg.imageUrl && (
                                                        <div className="mt-2">
                                                            <div className="text-xs font-semibold mb-2 text-gray-700">{msg.invoiceName}</div>
                                                            <img
                                                                src={msg.imageUrl}
                                                                alt={msg.invoiceName || 'Invoice'}
                                                                className="w-full rounded-lg border-2 border-gray-200 shadow-lg max-h-96 object-contain bg-white"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const fallback = e.target.nextSibling;
                                                                    if (fallback) fallback.style.display = 'block';
                                                                }}
                                                            />
                                                            <div className="hidden text-xs text-gray-500 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                                Invoice preview: {msg.invoiceName}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {msg.type === 'ppc-image' && msg.imageUrl && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={msg.imageUrl}
                                                                alt={msg.imageName || 'PPC Image'}
                                                                className="w-full rounded-lg border-2 border-gray-200 shadow-lg max-h-96 object-contain bg-white"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const fallback = e.target.nextSibling;
                                                                    if (fallback) fallback.style.display = 'block';
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    onSendMessage(`See more: ${msg.imageName || 'Details'}`);
                                                                }}
                                                                className={`mt-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r ${bot.bgGradient} text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-md`}
                                                            >
                                                                See more
                                                            </button>
                                                            <div className="hidden text-xs text-gray-500 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                                Image preview: {msg.imageName}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {msg.type === 'ytm-image' && msg.imageUrl && (
                                                        <div className="mt-2">
                                                            <div className="text-xs font-semibold mb-2 text-gray-700">{msg.imageName}</div>
                                                            <img
                                                                src={msg.imageUrl}
                                                                alt={msg.imageName || 'YTM Image'}
                                                                className="w-full rounded-lg border-2 border-gray-200 shadow-lg max-h-96 object-contain bg-white"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const fallback = e.target.nextSibling;
                                                                    if (fallback) fallback.style.display = 'block';
                                                                }}
                                                            />
                                                            <div className="hidden text-xs text-gray-500 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                                Image preview: {msg.imageName}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {msg.type === 'pending_items' && (
                                                        <div className="mt-2 space-y-2">
                                                            {msg.loading && (
                                                                <div className="text-xs text-gray-500 italic">Loading…</div>
                                                            )}
                                                            {!msg.loading && (msg.items || []).length === 0 && (
                                                                <div className="text-xs text-gray-500 italic">No items to action — you're all caught up.</div>
                                                            )}
                                                            {!msg.loading && (msg.items || []).map((item) => {
                                                                const itemId = String(item._id);
                                                                const nextStatus = (msg.nextStatusMap || {})[item.status];
                                                                const headline = item.no || item.title || itemId.slice(-6);
                                                                const subline = [
                                                                    item.claimant || item.vendor || item.requester?.name || item.period,
                                                                    item.dept || item.category || item.cycle,
                                                                    item.description || item.note,
                                                                ].filter(Boolean).join(' · ');
                                                                const amount = item.amount ?? item.net ?? item.totalAmount;
                                                                const isAdvancing = msg.advancingId === itemId;
                                                                return (
                                                                    <div key={itemId} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                            <span className="font-mono text-[11px] text-gray-700">{headline}</span>
                                                                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-200">{item.status}</span>
                                                                            {typeof amount === 'number' && (
                                                                                <span className="ml-auto text-xs font-semibold text-gray-900">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                                            )}
                                                                        </div>
                                                                        {subline && (
                                                                            <div className="text-[11px] text-gray-600 mb-2 leading-snug">{subline}</div>
                                                                        )}
                                                                        <button
                                                                            onClick={() => {
                                                                                if (!nextStatus || !msg.collection || !onUpdateBotMessage) return;
                                                                                onUpdateBotMessage(idx, (prev) => ({ ...prev, advancingId: itemId }));
                                                                                fetch('/api/notifications/accounting/action', {
                                                                                    method: 'POST',
                                                                                    headers: { 'Content-Type': 'application/json' },
                                                                                    body: JSON.stringify({ collection: msg.collection, id: itemId, toStatus: nextStatus }),
                                                                                })
                                                                                    .then(r => r.json())
                                                                                    .then(d => {
                                                                                        if (!d?.ok) throw new Error(d?.error || 'Action failed');
                                                                                        onUpdateBotMessage(idx, (prev) => {
                                                                                            // Drop the row from this message if its new status
                                                                                            // is no longer in the "actionable" range (no next step).
                                                                                            const updatedItems = (prev.items || []).map(it =>
                                                                                                String(it._id) === itemId ? d.item : it
                                                                                            ).filter(it => (prev.nextStatusMap || {})[it.status]);
                                                                                            return { ...prev, items: updatedItems, advancingId: null };
                                                                                        });
                                                                                        // Tell the parent to refresh badge counts on the pills.
                                                                                        fetch('/api/notifications/accounting')
                                                                                            .then(r => r.json())
                                                                                            .then(nd => { if (nd?.ok) setNotifCounts(nd.counts || {}); })
                                                                                            .catch(() => {});
                                                                                    })
                                                                                    .catch(() => {
                                                                                        onUpdateBotMessage(idx, (prev) => ({ ...prev, advancingId: null }));
                                                                                    });
                                                                            }}
                                                                            disabled={!nextStatus || isAdvancing}
                                                                            className={`px-3 py-1.5 rounded-md text-[11px] font-semibold text-white transition-all ${
                                                                                nextStatus ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-md' : 'bg-gray-300 cursor-not-allowed'
                                                                            } ${isAdvancing ? 'opacity-60' : ''}`}
                                                                        >
                                                                            {isAdvancing ? '…' : (nextStatus ? `Approve → ${nextStatus}` : 'Done')}
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    {msg.type === 'social-media' && msg.iconUrl && (
                                                        <div className="flex items-start gap-3">
                                                            <img
                                                                src={msg.iconUrl}
                                                                alt={msg.platform || 'Social Media'}
                                                                className="w-10 h-10 rounded-lg object-contain flex-shrink-0 border border-gray-200 bg-white p-1"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                            <div className="flex-1">
                                                                <div className="text-sm font-semibold mb-1.5 text-gray-800">{msg.platform} Comments</div>
                                                                <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{msg.text}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Show suggested actions after module selection message for Admin PA, Finance PA, CSR PA, or HR PA */}
                                                    {msg.from === 'bot' && 
                                                     ((botId === 'admin-bot' && adminPAModule) || (botId === 'finance-bot' && financePAModule) || (botId === 'csr-bot' && csrPAModule) || (botId === 'hr-bot' && hrPAModule)) &&
                                                     msg.text && msg.text.includes('Selected:') && msg.text.includes('module. Choose an action below:') && (
                                                        (() => {
                                                            // Detect module from message text or use current module state
                                                            let currentModule = null;
                                                            let currentModules = null;
                                                            let currentUsedActions = null;
                                                            let currentMarkActionUsed = null;
                                                            
                                                            if (botId === 'admin-bot') {
                                                                currentModule = adminPAModule;
                                                                currentModules = adminPAModules;
                                                                currentUsedActions = adminPAUsedActions;
                                                                currentMarkActionUsed = onMarkActionUsed;
                                                                
                                                                if (!currentModule && msg.text) {
                                                                    if (msg.text.includes('Purchase Request')) currentModule = 'purchase';
                                                                    else if (msg.text.includes('Support Ticket')) currentModule = 'support_ticket';
                                                                    else if (msg.text.includes('Y-Shop')) currentModule = 'shop';
                                                                    else if (msg.text.includes('Gatepass')) currentModule = 'gatepass';
                                                                    else if (msg.text.includes('Car Booking')) currentModule = 'car_booking';
                                                                }
                                                            } else if (botId === 'finance-bot') {
                                                                currentModule = financePAModule;
                                                                currentModules = financePAModules;
                                                                currentUsedActions = financePAUsedActions;
                                                                currentMarkActionUsed = onMarkFinanceActionUsed;
                                                                
                                                                if (!currentModule && msg.text) {
                                                                    if (msg.text.includes('Accounts')) currentModule = 'accounts';
                                                                }
                                                            } else if (botId === 'csr-bot') {
                                                                currentModule = csrPAModule;
                                                                currentModules = csrPAModules;
                                                                currentUsedActions = csrPAUsedActions;
                                                                currentMarkActionUsed = onMarkCsrActionUsed;
                                                                
                                                                if (!currentModule && msg.text) {
                                                                    if (msg.text.includes('CSR') && !msg.text.includes('Air') && !msg.text.includes('Electricity') && !msg.text.includes('Water') && !msg.text.includes('Waste')) currentModule = 'csr';
                                                                    else if (msg.text.includes('Air Temperature') || msg.text.includes('Air')) currentModule = 'air';
                                                                    else if (msg.text.includes('Electricity')) currentModule = 'electricity';
                                                                    else if (msg.text.includes('Water')) currentModule = 'water';
                                                                    else if (msg.text.includes('Waste Management') || msg.text.includes('Waste')) currentModule = 'waste_management';
                                                                }
                                                            } else if (botId === 'hr-bot') {
                                                                currentModule = hrPAModule;
                                                                currentModules = hrPAModules;
                                                                currentUsedActions = hrPAUsedActions;
                                                                currentMarkActionUsed = onMarkHrActionUsed;
                                                                
                                                                if (!currentModule && msg.text) {
                                                                    if (msg.text.includes('HR') && !msg.text.includes('Training')) currentModule = 'hr';
                                                                    else if (msg.text.includes('Training')) currentModule = 'training';
                                                                }
                                                            }
                                                            
                                                            // Calculate suggested actions dynamically for this module
                                                            let moduleActions = [];
                                                            if (currentModule && currentModules && currentModules[currentModule]) {
                                                                const allActions = currentModules[currentModule].suggestedActions;
                                                                const usedActions = currentUsedActions && currentUsedActions[currentModule] ? currentUsedActions[currentModule] : [];
                                                                moduleActions = allActions.filter(action => !usedActions.includes(action.text));
                                                            }
                                                            
                                                            return moduleActions.length > 0 ? (
                                                                <div className="mt-3 space-y-2">
                                                                    {moduleActions.map((action, actionIdx) => (
                                                                        <button
                                                                            key={actionIdx}
                                                                            onClick={() => {
                                                                                // Mark action as used immediately
                                                                                if (currentMarkActionUsed && currentModule) {
                                                                                    currentMarkActionUsed(currentModule, action.text);
                                                                                }
                                                                                onSendMessage(action.text);
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 rounded-full bg-gradient-to-r ${bot.lightAccent || 'from-gray-100 to-gray-200'} border ${bot.borderColor || 'border-gray-200'} text-sm ${bot.textColor || 'text-gray-800'} hover:opacity-80 hover:shadow-md transition flex items-center gap-2 font-medium`}
                                                                        >
                                                                            {action.highlight && <Sparkles size={16} className={`text-${bot.bgGradient.split('-')[1]}-500`} />}
                                                                            {action.text}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : null;
                                                        })()
                                                    )}
                                                </div>
                                                {msg.from === 'bot' && (
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                                                        <button
                                                            onClick={() => {
                                                                const plainText = msg.text.replace(/<[^>]+>/g, '').replace(/\|/g, '').replace(/---/g, ''); 
                                                                const speech = new SpeechSynthesisUtterance(plainText);
                                                                speech.lang = currentLanguageCode === 'kh' ? 'km-KH' : (currentLanguageCode === 'ch' ? 'zh-CN' : 'en-US');
                                                                window.speechSynthesis.speak(speech);
                                                            }}
                                                            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors`}
                                                            title="Text to Speech"
                                                        >
                                                            <Volume2 size={14} className={bot.textColor || 'text-gray-600'} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(msg.text);
                                                            }}
                                                            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors`}
                                                            title="Copy"
                                                        >
                                                            <Copy size={14} className={bot.textColor || 'text-gray-600'} />
                                                        </button>
                                                        <button
                                                            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors`}
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className={bot.textColor || 'text-gray-600'} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                onSendMessage(msg.text);
                                                            }}
                                                            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors`}
                                                            title="Regenerate"
                                                        >
                                                            <RefreshCw size={14} className={bot.textColor || 'text-gray-600'} />
                                                        </button>
                                                        <button
                                                            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors`}
                                                            title="More"
                                                        >
                                                            <MoreVertical size={14} className={bot.textColor || 'text-gray-600'} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {msg.from === 'user' && (
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${bot.bgGradient} border-2 border-white shadow-md flex items-center justify-center flex-shrink-0`}>
                                                    <span className="text-xs font-semibold text-white">U</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex items-start gap-3 justify-start">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${bot.bgGradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                                <bot.icon size={16} className="text-white" />
                                            </div>
                                            <div className={`bg-white border ${bot.borderColor || 'border-gray-200'} rounded-2xl rounded-bl-none px-4 py-2 shadow-sm`}>
                                                <div className="flex gap-1.5">
                                                    <div className={`w-2 h-2 bg-gradient-to-r ${bot.bgGradient} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                                                    <div className={`w-2 h-2 bg-gradient-to-r ${bot.bgGradient} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                                                    <div className={`w-2 h-2 bg-gradient-to-r ${bot.bgGradient} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                            
                        </div>

                        {/* Input Field with Thinking Status */}
                        <div className={`flex-shrink-0 px-4 py-4 border-t ${bot.borderColor || 'border-gray-200'}`}>
                            {uploadedImage && (
                                <div className="relative inline-block mb-3 ml-4 border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                    <img src={uploadedImage} alt="Upload preview" className="h-16 w-auto object-cover bg-white" />
                                    <button onClick={() => setUploadedImage(null)} type="button" className="absolute top-1 right-1 bg-gray-900/60 p-1 rounded-full text-white hover:bg-gray-900">
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSend} className="relative">
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                <div className={`flex flex-col rounded-2xl border ${bot.borderColor || 'border-gray-200'} bg-white shadow-md focus-within:ring-2 focus-within:ring-opacity-30 focus-within:border-transparent transition-all ${bot.bgGradient.includes('green') ? 'focus-within:ring-green-400' :
                                        bot.bgGradient.includes('blue') ? 'focus-within:ring-blue-400' :
                                            bot.bgGradient.includes('purple') ? 'focus-within:ring-purple-400' :
                                                bot.bgGradient.includes('orange') ? 'focus-within:ring-orange-400' :
                                                    bot.bgGradient.includes('indigo') ? 'focus-within:ring-indigo-400' :
                                                        bot.bgGradient.includes('teal') ? 'focus-within:ring-teal-400' :
                                                            bot.bgGradient.includes('amber') ? 'focus-within:ring-amber-400' :
                                                                bot.bgGradient.includes('rose') ? 'focus-within:ring-rose-400' :
                                                                    bot.bgGradient.includes('violet') ? 'focus-within:ring-violet-400' :
                                                                        bot.bgGradient.includes('sky') ? 'focus-within:ring-sky-400' : 'focus-within:ring-blue-400'
                                    }`}
                                >
                                    <textarea
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder={
                                            botId === 'accounting-bot' && activeTopic
                                                ? `Ask about ${activeTopic}`
                                                : `Ask ${bot.name}`
                                        }
                                        rows={3}
                                        className={`w-full bg-transparent border-0 outline-none resize-none px-4 pt-3 pb-1 text-base leading-relaxed cursor-text ${bot.textColor || 'text-gray-800'} placeholder:${bot.textColor || 'text-gray-400'}`}
                                        style={{ minHeight: '4.5rem', maxHeight: '22.5rem', overflowY: 'auto' }}
                                    />
                                    <div className="flex items-center justify-end gap-1 px-3 pb-2">
                                        {(isListening || isTyping) && (
                                            <span className={`text-xs ${bot.textColor || 'text-gray-500'} mr-auto pl-1 animate-pulse`}>
                                                {isListening ? "Listening…" : "Thinking…"}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Attach photo or file"
                                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <Paperclip size={18} className={bot.textColor || 'text-gray-600'} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={startListening}
                                            disabled={isListening}
                                            title="Voice chat"
                                            className={`p-1.5 rounded-full transition-colors relative ${isListening ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-100'}`}
                                        >
                                            <Mic size={18} className={isListening ? 'text-white animate-pulse' : (bot.textColor || 'text-gray-600')} />
                                            {isListening && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim() && !uploadedImage}
                                            title="Send to agent"
                                            aria-label="Send"
                                            className={`p-0.5 rounded-full transition-all ml-1 ${
                                                (inputValue.trim() || uploadedImage)
                                                    ? 'opacity-100 hover:scale-110 cursor-pointer'
                                                    : 'opacity-40 cursor-not-allowed'
                                            }`}
                                        >
                                            <img
                                                src="/assets/modules-image/yai1.png"
                                                alt="Send"
                                                className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-yai-blue/50"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal flow superseded by in-chat agentic cards — keeping
                pendingModalTopic state slot harmless for now in case any
                other branch references it. */}
        </div>
    );
};

/* Pending Items modal — opens when the user taps an Accounting PA pill
 * that has a count badge. Fetches the records contributing to the count,
 * lets the user Approve/Advance each one inline, refreshes after each
 * action, and tells the parent to refresh badge counts on close. */
const PendingItemsModal = ({ topic, onClose, onAction }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [collection, setCollection] = useState(null);
    const [nextStatusMap, setNextStatusMap] = useState({});
    const [advancingId, setAdvancingId] = useState(null);

    const fetchItems = React.useCallback(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/notifications/accounting/items?topic=${encodeURIComponent(topic)}`)
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Failed to load');
                setItems(d.items || []);
                setCollection(d.collection);
                setNextStatusMap(d.nextStatusMap || {});
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, [topic]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const advance = (item) => {
        const toStatus = nextStatusMap[item.status];
        if (!toStatus || !collection) return;
        setAdvancingId(String(item._id));
        fetch('/api/notifications/accounting/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection, id: String(item._id), toStatus }),
        })
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Action failed');
                // Replace the row in place with the updated doc
                setItems(prev => prev.map(it =>
                    String(it._id) === String(item._id) ? d.item : it
                ).filter(it => {
                    // If the new status is now a "done" terminal for this topic,
                    // drop the row from the list so the modal reflects reality.
                    const stillActionable = !!nextStatusMap[it.status];
                    return stillActionable;
                }));
                if (onAction) onAction();
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setAdvancingId(null));
    };

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { if (onAction) onAction(); onClose(); }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{topic}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {loading ? 'Loading…' : `${items.length} item${items.length === 1 ? '' : 's'} awaiting action`}
                        </p>
                    </div>
                    <button onClick={() => { if (onAction) onAction(); onClose(); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {error && (
                        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {!loading && !error && items.length === 0 && (
                        <div className="text-center py-10 text-sm text-gray-500">
                            🎉 Nothing pending in this topic. You're all caught up.
                        </div>
                    )}
                    {items.map((it) => {
                        const nextStatus = nextStatusMap[it.status];
                        const id = String(it._id);
                        const isAdvancing = advancingId === id;
                        // Pretty-print a 1-line summary from common fields
                        const headline = it.no || it.title || id.slice(-6);
                        const subline = [
                            it.claimant || it.vendor || it.requester?.name || it.period,
                            it.dept || it.category || it.cycle,
                            it.description || it.note,
                        ].filter(Boolean).join(' · ');
                        const amount = it.amount ?? it.net ?? it.totalAmount;
                        return (
                            <div key={id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-gray-700">{headline}</span>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-200">{it.status}</span>
                                        {typeof amount === 'number' && (
                                            <span className="ml-auto text-sm font-semibold text-gray-900">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        )}
                                    </div>
                                    {subline && (
                                        <div className="text-xs text-gray-600 truncate">{subline}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => advance(it)}
                                    disabled={!nextStatus || isAdvancing}
                                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all ${
                                        nextStatus ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-md' : 'bg-gray-300 cursor-not-allowed'
                                    } ${isAdvancing ? 'opacity-60' : ''}`}
                                    title={nextStatus ? `Advance to ${nextStatus}` : 'No next step'}
                                >
                                    {isAdvancing ? '…' : (nextStatus ? `Approve → ${nextStatus}` : 'Done')}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                    <span>Tap × or outside to close. Actions persist to Mongo immediately.</span>
                    <button onClick={fetchItems} className="text-blue-600 hover:text-blue-700 font-medium">Refresh</button>
                </div>
            </div>
        </div>
    );
};

const BotModules = ({ onClose, moduleContext, onVersionChange, currentVersion = 'yai1' }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Auto-open the Yai Agents dropdown ~700ms after mount so the user
    // sees "Agent Collective" + "Big Brain" reveal themselves on every
    // fresh page load. [] deps keeps it limited to component mount, so
    // internal React Router nav that doesn't unmount BotModules won't
    // re-fire — refresh = re-fire, in-app nav = quiet.
    useEffect(() => {
        if (!onVersionChange) return; // no menu to show
        const t = setTimeout(() => setDropdownOpen(true), 700);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const scrollContainerRef = useRef(null);
    const scrollbarTrackRef = useRef(null);
    const scrollbarRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [thumbPosition, setThumbPosition] = useState(0);
    const [thumbWidth, setThumbWidth] = useState(100);
    
    // Language options with flag images - only 3 languages (in order: en, kh, ch)
    const languages = [
        { code: 'en', name: 'English', flagImage: '/assets/flags/en.svg' },
        { code: 'kh', name: 'Khmer', flagImage: '/assets/flags/kh.svg' },
        { code: 'ch', name: 'Chinese', flagImage: '/assets/flags/ch.svg' }
    ];
    
    // Language state per bot - initialize from localStorage or default to English
    const [botLanguages, setBotLanguages] = useState(() => {
        const languagesState = {};
        PREDEFINED_BOTS.forEach(bot => {
            const savedCode = localStorage.getItem(`bot-language-${bot.id}`) || 'en';
            languagesState[bot.id] = {
                code: savedCode,
                name: languages.find(lang => lang.code === savedCode)?.name || 'English'
            };
        });
        return languagesState;
    });
    
    // Function to update bot language
    // When language changes, all future API calls will use the new language code
    // The API endpoint (https://dev.yaikh.com/api/ai-agent) will translate responses based on the language parameter
    // Language codes: 'en' (English), 'kh' (Khmer), 'ch' (Chinese)
    const updateBotLanguage = (botId, languageCode) => {
        const language = languages.find(lang => lang.code === languageCode);
        if (!language) {
            console.error(`Language code ${languageCode} not found`);
            return;
        }
        
        console.log(`Updating language for bot ${botId} to ${languageCode} (${language.name})`);
        
        setBotLanguages(prev => {
            const updated = {
                ...prev,
                [botId]: {
                    code: languageCode,
                    name: language.name
                }
            };
            console.log('Updated botLanguages:', updated);
            return updated;
        });
        localStorage.setItem(`bot-language-${botId}`, languageCode);
        // All future API calls will automatically use the new language code
        // The backend API translates the response based on the 'language' parameter in the request body
    };
    
    // State for Admin PA module selection
    const [adminPAModule, setAdminPAModule] = useState(null); // 'purchase', 'support_ticket', 'shop', or null
    
    // Track used suggested actions per module
    const [adminPAUsedActions, setAdminPAUsedActions] = useState({
        purchase: [],
        support_ticket: [],
        shop: [],
        gatepass: [],
        car_booking: []
    });
    
    // Admin PA module configurations
    const adminPAModules = {
        purchase: {
            name: 'Purchase Request',
            icon: '📋',
            color: 'from-blue-500 to-cyan-500',
            lightColor: 'from-blue-100 to-cyan-100',
            suggestedActions: [
                { text: 'Show me all purchase requests', highlight: true },
                { text: 'How many requests are pending GM approval?' },
                { text: 'How many purchase requests were created this month?' },
                { text: 'How many requests have been approved by the accountant?' }
            ]
        },
        support_ticket: {
            name: 'Support Ticket',
            icon: '🎫',
            color: 'from-purple-500 to-pink-500',
            lightColor: 'from-purple-100 to-pink-100',
            suggestedActions: [
                { text: 'Show all tickets requested this month', highlight: true },
                { text: 'How many tickets are currently in progress?' },
                { text: 'Show all completed tickets' },
                { text: 'How many users are using the support ticket module?' },
                { text: 'How many tickets were requested by the admin department?' }
            ]
        },
        shop: {
            name: 'Y-Shop',
            icon: '🛒',
            color: 'from-orange-500 to-amber-500',
            lightColor: 'from-orange-100 to-amber-100',
            suggestedActions: [
                { text: 'Show all shop requests this month', highlight: true },
                { text: 'How many requests have been approved by the shop controller?' },
                { text: 'How many requests have been issued to requestors?' },
                { text: 'How many A4 items have been requested and issued?' },
                { text: 'How many total requests have been made by requestors?' }
            ]
        },
        gatepass: {
            name: 'Gatepass',
            icon: '🚪',
            color: 'from-indigo-500 to-purple-500',
            lightColor: 'from-indigo-100 to-purple-100',
            // Original suggested actions - commented out but kept for future use
            // suggestedActions: [
            //     { text: 'How many gatepass requests this month?', highlight: true },
            //     { text: 'Show me gatepass requests approved by controller' },
            //     { text: 'How many gatepass requests issued to requestors?' },
            //     { text: 'Show me gatepass A4 items requested and issued' },
            //     { text: 'What\'s the total gatepass requestor requests?' },
            //     { text: 'Give me gatepass statistics' }
            // ],
            suggestedActions: [
                { text: 'How many gatepass requests this month?', highlight: true },
                { text: 'Show me gatepass requests approved by controller' },
                { text: 'How many gatepass requests issued to requestors?' },
                { text: 'Show me gatepass A4 items requested and issued' },
                { text: 'What\'s the total gatepass requestor requests?' },
                { text: 'Give me gatepass statistics' }
            ]
        },
        car_booking: {
            name: 'Car Booking',
            icon: '🚗',
            color: 'from-teal-500 to-cyan-500',
            lightColor: 'from-teal-100 to-cyan-100',
            // Original suggested actions - commented out but kept for future use
            // suggestedActions: [
            //     { text: 'Show me car requests this month', highlight: true },
            //     { text: 'How many car booking requests approved by controller?' },
            //     { text: 'How many car bookings issued to requestors?' },
            //     { text: 'Show me car booking A4 items requested and issued' },
            //     { text: 'What\'s the total car booking requestor requests?' },
            //     { text: 'Give me car booking statistics' },
            //     { text: 'Show me vehicle booking information' }
            // ],
            suggestedActions: [
                { text: 'Show me car requests this month', highlight: true },
                { text: 'How many car booking requests approved by controller?' },
                { text: 'How many car bookings issued to requestors?' },
                { text: 'Show me car booking A4 items requested and issued' },
                { text: 'What\'s the total car booking requestor requests?' },
                { text: 'Give me car booking statistics' },
                { text: 'Show me vehicle booking information' }
            ]
        }
    };

    // State for Finance PA module selection
    const [financePAModule, setFinancePAModule] = useState(null); // 'accounts', or null
    
    // Track used suggested actions per module
    const [financePAUsedActions, setFinancePAUsedActions] = useState({
        accounts: []
    });
    
    // Finance PA module configurations
    const financePAModules = {
        accounts: {
            name: 'Accounts',
            icon: '💰',
            color: 'from-green-500 to-emerald-500',
            lightColor: 'from-green-100 to-emerald-100',
            suggestedActions: [
                { text: 'How many accounts requests this month?', highlight: true },
                { text: 'Show me accounts requests approved by controller' },
                { text: 'How many accounts requests issued to requestors?' },
                { text: 'Show me accounts A4 items requested and issued' },
                { text: 'What\'s the total accounts requestor requests?' },
                { text: 'Give me accounting department statistics' }
            ]
        }
    };

    // State for CSR PA module selection
    const [csrPAModule, setCsrPAModule] = useState(null); // 'csr', 'air', 'electricity', 'water', 'waste_management', or null
    
    // Track used suggested actions per module
    const [csrPAUsedActions, setCsrPAUsedActions] = useState({
        csr: [],
        air: [],
        electricity: [],
        water: [],
        waste_management: []
    });
    
    // CSR PA module configurations
    const csrPAModules = {
        csr: {
            name: 'CSR',
            icon: '🤝',
            color: 'from-purple-500 to-pink-500',
            lightColor: 'from-purple-100 to-pink-100',
            suggestedActions: [
                { text: 'How many CSR requests this month?', highlight: true },
                { text: 'Show me CSR requests approved by controller' },
                { text: 'How many CSR requests issued to requestors?' },
                { text: 'Show me CSR A4 items requested and issued' },
                { text: 'What\'s the total CSR requestor requests?' },
                { text: 'Give me CSR statistics' }
            ]
        },
        air: {
            name: 'Air Temperature & Humidity',
            icon: '🌡️',
            color: 'from-blue-500 to-cyan-500',
            lightColor: 'from-blue-100 to-cyan-100',
            suggestedActions: [
                { text: 'How many air monitoring requests this month?', highlight: true },
                { text: 'Show me air requests approved by controller' },
                { text: 'How many air requests issued to requestors?' },
                { text: 'Show me air A4 items requested and issued' },
                { text: 'What\'s the total air requestor requests?' },
                { text: 'Give me air temperature and humidity statistics' }
            ]
        },
        electricity: {
            name: 'Electricity',
            icon: '⚡',
            color: 'from-yellow-500 to-orange-500',
            lightColor: 'from-yellow-100 to-orange-100',
            suggestedActions: [
                { text: 'How many electricity requests this month?', highlight: true },
                { text: 'Show me electricity requests approved by controller' },
                { text: 'How many electricity requests issued to requestors?' },
                { text: 'Show me electricity A4 items requested and issued' },
                { text: 'What\'s the total electricity requestor requests?' },
                { text: 'Give me electricity usage statistics' }
            ]
        },
        water: {
            name: 'Water',
            icon: '💧',
            color: 'from-cyan-500 to-blue-500',
            lightColor: 'from-cyan-100 to-blue-100',
            suggestedActions: [
                { text: 'How many water requests this month?', highlight: true },
                { text: 'Show me water requests approved by controller' },
                { text: 'How many water requests issued to requestors?' },
                { text: 'Show me water A4 items requested and issued' },
                { text: 'What\'s the total water requestor requests?' },
                { text: 'Give me water system statistics' }
            ]
        },
        waste_management: {
            name: 'Waste Management',
            icon: '♻️',
            color: 'from-green-500 to-emerald-500',
            lightColor: 'from-green-100 to-emerald-100',
            suggestedActions: [
                { text: 'How many waste management requests this month?', highlight: true },
                { text: 'Show me waste requests approved by controller' },
                { text: 'How many waste management requests issued to requestors?' },
                { text: 'Show me waste A4 items requested and issued' },
                { text: 'What\'s the total waste management requestor requests?' },
                { text: 'Give me waste management statistics' }
            ]
        }
    };

    // State for HR PA module selection
    const [hrPAModule, setHrPAModule] = useState(null); // 'hr', 'training', or null
    
    // Track used suggested actions per module
    const [hrPAUsedActions, setHrPAUsedActions] = useState({
        hr: [],
        training: []
    });
    
    // HR PA module configurations
    const hrPAModules = {
        hr: {
            name: 'HR',
            icon: '👥',
            color: 'from-indigo-500 to-blue-500',
            lightColor: 'from-indigo-100 to-blue-100',
            suggestedActions: [
                { text: 'How many HR requests this month?', highlight: true },
                { text: 'Show me HR requests approved by controller' },
                { text: 'How many HR requests issued to requestors?' },
                { text: 'Show me HR A4 items requested and issued' },
                { text: 'What\'s the total HR requestor requests?' },
                { text: 'Give me HR department statistics' }
            ]
        },
        training: {
            name: 'Training',
            icon: '🎓',
            color: 'from-blue-500 to-indigo-500',
            lightColor: 'from-blue-100 to-indigo-100',
            suggestedActions: [
                { text: 'How many training requests this month?', highlight: true },
                { text: 'Show me training requests approved by controller' },
                { text: 'How many training requests issued to requestors?' },
                { text: 'Show me training A4 items requested and issued' },
                { text: 'What\'s the total training requestor requests?' },
                { text: 'Give me training program statistics' },
                { text: 'Show me employee training information' }
            ]
        }
    };

    // Load chat history from localStorage
    const loadChatHistory = (botId) => {
        const saved = localStorage.getItem(`yai1-chat-history-${botId}`);
        return saved ? JSON.parse(saved) : [];
    };

    // Save chat history to localStorage
    const saveChatHistory = (botId, history) => {
        try {
            // Strip out large base64 strings before saving
            const historyToSave = history.map(chat => ({
                ...chat,
                messages: chat.messages.map(msg => ({
                    ...msg,
                    text: msg.text ? msg.text.replace(/\[IMAGE_DATA:data:image\/[^;]+;base64,[^\]]+\]/g, '[IMAGE_DATA: Attached Image]') : msg.text
                }))
            }));
            
            localStorage.setItem(`yai1-chat-history-${botId}`, JSON.stringify(historyToSave));
        } catch (error) {
            console.error('Failed to save chat history to localStorage:', error);
            if (error.name === 'QuotaExceededError') {
                try {
                    // Critical fallback: clear older chats if quota is reached
                    if (history.length > 5) {
                        const reducedHistory = history.slice(0, 5).map(chat => ({
                            ...chat,
                            messages: chat.messages.map(msg => ({
                                ...msg,
                                text: msg.text ? msg.text.replace(/\[IMAGE_DATA:data:image\/[^;]+;base64,[^\]]+\]/g, '[IMAGE_DATA: Attached Image]') : msg.text
                            }))
                        }));
                        localStorage.setItem(`yai1-chat-history-${botId}`, JSON.stringify(reducedHistory));
                    }
                } catch (e) {
                    console.error('Still exceeded quota after reducing chat count', e);
                }
            }
        }
    };

    // State for each bot's messages, input, and chat history
    const [botStates, setBotStates] = useState(() => {
        const states = {};
        PREDEFINED_BOTS.forEach(bot => {
            const history = loadChatHistory(bot.id);
            states[bot.id] = {
                messages: [],
                input: '',
                isTyping: false,
                chatHistory: history,
                currentChatId: null
            };
        });
        return states;
    });

    // Save chat history whenever it changes
    useEffect(() => {
        PREDEFINED_BOTS.forEach(bot => {
            const botState = botStates[bot.id];
            if (botState && botState.chatHistory) {
                saveChatHistory(bot.id, botState.chatHistory);
            }
        });
    }, [botStates]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const createNewChat = (botId) => {
        const newChatId = Date.now().toString();
        const newChat = {
            id: newChatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setBotStates(prev => ({
            ...prev,
            [botId]: {
                ...prev[botId],
                messages: [],
                input: '',
                isTyping: false,
                chatHistory: [newChat, ...prev[botId].chatHistory],
                currentChatId: newChatId
            }
        }));
        
        // Reset module selection when creating new chat for Admin PA, Finance PA, HR PA, and CSR PA
        if (botId === 'admin-bot') {
            setAdminPAModule(null);
            setAdminPAUsedActions({
                purchase: [],
                support_ticket: [],
                shop: [],
                gatepass: [],
                car_booking: []
            });
        } else if (botId === 'finance-bot') {
            setFinancePAModule(null);
            setFinancePAUsedActions({ accounts: [] });
        } else if (botId === 'hr-bot') {
            setHrPAModule(null);
            setHrPAUsedActions({ hr: [], training: [] });
        } else if (botId === 'csr-bot') {
            setCsrPAModule(null);
            setCsrPAUsedActions({ csr: [], air: [], electricity: [], water: [], waste_management: [] });
        }
    };

    const updateChatInHistory = (botId, chatId, newMessages) => {
        setBotStates(prev => {
            const botState = prev[botId];
            const firstUserMessage = newMessages.find(m => m.from === 'user');
            const updatedHistory = botState.chatHistory.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: newMessages,
                        title: firstUserMessage?.text?.substring(0, 50) || 'New Chat',
                        updatedAt: new Date().toISOString()
                    };
                }
                return chat;
            });

            return {
                ...prev,
                [botId]: {
                    ...prev[botId],
                    chatHistory: updatedHistory
                }
            };
        });
    };

    const loadChat = (botId, chatId) => {
        setBotStates(prev => {
            const botState = prev[botId];
            const chat = botState.chatHistory.find(c => c.id === chatId);
            if (chat) {
                return {
                    ...prev,
                    [botId]: {
                        ...prev[botId],
                        messages: chat.messages,
                        currentChatId: chatId
                    }
                };
            }
            return prev;
        });
    };

    const deleteChat = (botId, chatId) => {
        setBotStates(prev => {
            const botState = prev[botId];
            const updatedHistory = botState.chatHistory.filter(chat => chat.id !== chatId);
            return {
                ...prev,
                [botId]: {
                    ...prev[botId],
                    chatHistory: updatedHistory,
                    messages: botState.currentChatId === chatId ? [] : botState.messages,
                    currentChatId: botState.currentChatId === chatId ? null : botState.currentChatId
                }
            };
        });
    };

    // Helper function to map internal module names to API-expected format
    // Helper function to check if a question is related to the selected module
    const isQuestionModuleRelated = (botId, moduleName, message) => {
        if (!moduleName || moduleName === 'global') {
            return false; // No module selected, use global
        }
        
        const messageLower = message.toLowerCase();
        
        // Admin PA module keywords
        if (botId === 'admin-bot') {
            const moduleKeywords = {
                'purchase': ['purchase', 'pr', 'request', 'buy', 'order', 'procurement', 'vendor', 'supplier', 'invoice', 'payment', 'approval', 'approved', 'pending', 'cancelled'],
                'support_ticket': ['ticket', 'support', 'issue', 'problem', 'help', 'bug', 'error', 'complaint', 'request', 'assistance'],
                'shop': ['shop', 'stationery', 'supplies', 'items', 'y-shop', 'stationary', 'office supplies'],
                'gatepass': ['gatepass', 'gate pass', 'visitor', 'entry', 'exit', 'access', 'permit'],
                'car_booking': ['car', 'vehicle', 'booking', 'reservation', 'driver', 'transport', 'fuel', 'mileage']
            };
            
            const keywords = moduleKeywords[moduleName] || [];
            return keywords.some(keyword => messageLower.includes(keyword));
        }
        
        // Finance PA module keywords
        if (botId === 'finance-bot') {
            const moduleKeywords = {
                'accounts': ['account', 'financial', 'budget', 'expense', 'revenue', 'transaction', 'balance', 'payment', 'invoice', 'billing', 'accounting']
            };
            
            const keywords = moduleKeywords[moduleName] || [];
            return keywords.some(keyword => messageLower.includes(keyword));
        }
        
        // CSR PA module keywords
        if (botId === 'csr-bot') {
            const moduleKeywords = {
                'csr': ['csr', 'corporate social responsibility', 'social', 'community', 'induction', 'training', '6s', 'compliance', 'certificate', 'audit', 'checklist'],
                'air': ['air', 'temperature', 'humidity', 'climate', 'ventilation', 'air quality'],
                'electricity': ['electricity', 'electric', 'power', 'energy', 'consumption', 'kwh', 'watt', 'voltage'],
                'water': ['water', 'usage', 'consumption', 'wastewater', 'treatment'],
                'waste_management': ['waste', 'garbage', 'trash', 'recycling', 'disposal', 'management']
            };
            
            const keywords = moduleKeywords[moduleName] || [];
            return keywords.some(keyword => messageLower.includes(keyword));
        }
        
        // HR PA module keywords
        if (botId === 'hr-bot') {
            const moduleKeywords = {
                'hr': ['hr', 'human resource', 'employee', 'staff', 'personnel', 'recruitment', 'hiring', 'job', 'application', 'candidate', 'salary', 'payroll'],
                'training': ['training', 'course', 'learn', 'education', 'skill', 'development', 'workshop', 'seminar']
            };
            
            const keywords = moduleKeywords[moduleName] || [];
            return keywords.some(keyword => messageLower.includes(keyword));
        }
        
        // Default: if we can't determine, assume it's related to the module
        return true;
    };

    const mapModuleToAPIFormat = (botId, moduleName) => {
        if (!moduleName || moduleName === 'global') {
            return 'global';
        }
        
        // Map Admin PA modules
        if (botId === 'admin-bot') {
            const moduleMap = {
                'purchase': 'purchase-request',
                'support_ticket': 'support-ticket',
                'shop': 'y-shop',
                'gatepass': 'gatepass',
                'car_booking': 'car-booking'
            };
            return moduleMap[moduleName] || moduleName;
        }
        
        // Map Finance PA modules
        if (botId === 'finance-bot') {
            const moduleMap = {
                'accounts': 'accounts'
            };
            return moduleMap[moduleName] || moduleName;
        }
        
        // Map CSR PA modules
        if (botId === 'csr-bot') {
            const moduleMap = {
                'csr': 'csr',
                'air': 'air',
                'electricity': 'electricity',
                'water': 'water',
                'waste_management': 'waste-management'
            };
            return moduleMap[moduleName] || moduleName;
        }
        
        // Map HR PA modules
        if (botId === 'hr-bot') {
            const moduleMap = {
                'hr': 'hr',
                'training': 'training'
            };
            return moduleMap[moduleName] || moduleName;
        }
        
        return moduleName;
    };

    // Helper function to get or generate user_id for a specific module
    const getUserIdForModule = (botId, moduleName) => {
        const storageKey = `user_id_${botId}_${moduleName || 'global'}`;
        let userId = localStorage.getItem(storageKey);
        if (!userId) {
            // Generate a unique user_id: timestamp + random number
            userId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem(storageKey, userId);
        }
        return userId;
    };

    // Helper function to stream text like ChatGPT (token/word-based chunks with natural pacing)
    const streamBotResponse = (botId, fullText, messageObj = {}) => {
        // Create initial bot message with empty text
        const initialMessage = {
            from: 'bot',
            text: '',
            isStreaming: true,
            ...messageObj
        };

        // Add the initial message to state
        setBotStates(prev => {
            const botState = prev[botId];
            if (!botState) return prev;
            const updatedMessages = [...botState.messages, initialMessage];
            const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
            ) : botState.chatHistory;
            return {
                ...prev,
                [botId]: {
                    ...prev[botId],
                    messages: updatedMessages,
                    isTyping: false,
                    chatHistory: updatedHistory
                }
            };
        });

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
        let currentText = '';
        let tokenIndex = 0;
        
        // For very long responses, batch tokens for faster display
        const totalTokens = tokens.length;
        const isVeryLong = totalTokens > 200;
        const batchSize = isVeryLong ? 2 : 1; // Batch 2 tokens for very long responses

        const streamNextToken = () => {
            if (tokenIndex >= tokens.length) {
                // Streaming complete
                setBotStates(prev => {
                    const botState = prev[botId];
                    if (!botState) return prev;
                    const updatedMessages = [...botState.messages];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if (lastMessage && lastMessage.from === 'bot' && lastMessage.isStreaming) {
                        updatedMessages[updatedMessages.length - 1] = {
                            ...lastMessage,
                            text: fullText,
                            isStreaming: false
                        };
                    }
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }

            // Add next token(s) - batch for very long responses (ChatGPT-like token streaming)
            const tokensToAdd = Math.min(batchSize, tokens.length - tokenIndex);
            for (let i = 0; i < tokensToAdd; i++) {
                if (tokenIndex < tokens.length) {
                    currentText += tokens[tokenIndex];
                    tokenIndex++;
                }
            }

            // ChatGPT-like token streaming speed (fast and natural)
            const currentToken = tokens[tokenIndex - 1] || '';
            let delay = 10; // Base delay: 10ms per token (ChatGPT-like speed)
            
            // Faster for spaces/whitespace tokens
            if (/^\s+$/.test(currentToken)) {
                delay = 5;
            }
            // Slight pause at sentence endings (natural thinking pause)
            else if (/[.!?]\s*$/.test(currentToken)) {
                delay = isVeryLong ? 15 : 30;
            }
            // Minimal pause at commas and semicolons
            else if (/[,;]\s*$/.test(currentToken)) {
                delay = isVeryLong ? 8 : 15;
            }
            // Minimal pause for colons
            else if (/[:]\s*$/.test(currentToken)) {
                delay = isVeryLong ? 10 : 20;
            }
            // Slight pause at newlines
            else if (currentToken.includes('\n')) {
                delay = isVeryLong ? 10 : 25;
            }
            // Fast for regular word tokens (ChatGPT-like token speed)
            else {
                // Shorter tokens appear faster, longer tokens slightly slower
                const tokenLength = currentToken.length;
                if (tokenLength <= 3) {
                    delay = 5 + Math.random() * 5; // 5-10ms for short tokens
                } else if (tokenLength <= 8) {
                    delay = 8 + Math.random() * 7; // 8-15ms for medium tokens
                } else {
                    delay = 12 + Math.random() * 8; // 12-20ms for long tokens
                }
            }

            // Update the last message with current text
            // Note: Markdown/table formatting will be applied when rendering via renderMarkdownContent
            setBotStates(prev => {
                const botState = prev[botId];
                if (!botState) return prev;
                const updatedMessages = [...botState.messages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage && lastMessage.from === 'bot' && lastMessage.isStreaming) {
                    updatedMessages[updatedMessages.length - 1] = {
                        ...lastMessage,
                        text: currentText,
                        // Ensure markdown rendering is applied during streaming
                        needsMarkdown: true
                    };
                }
                const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                    chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                ) : botState.chatHistory;
                return {
                    ...prev,
                    [botId]: {
                        ...prev[botId],
                        messages: updatedMessages,
                        chatHistory: updatedHistory
                    }
                };
            });

            // Schedule next token
            setTimeout(streamNextToken, delay);
        };

        // Start streaming token by token immediately (ChatGPT-like instant start)
        setTimeout(streamNextToken, 0);
        
        // Store timeout ID for cleanup if needed (component unmount, etc.)
        // Note: In a production app, you'd want to clean this up on unmount
    };

    // Helper function to clean up technical tool-call messages from API responses
    const cleanAPIResponse = (responseText) => {
        if (!responseText) return responseText;
        
        let cleaned = responseText;
        
        // Remove JSON tool call structures like {"name": "tool_name", "parameters": {}}
        // Match JSON objects with "name" and "parameters" fields (handles multi-line)
        cleaned = cleaned.replace(/\{[^}]*"name"\s*:\s*"[^"]+"\s*,\s*"parameters"\s*:\s*\{[^}]*\}\s*\}/gs, '').trim();
        // Also match with single quotes
        cleaned = cleaned.replace(/\{[^}]*'name'\s*:\s*'[^']+'\s*,\s*'parameters'\s*:\s*\{[^}]*\}\s*\}/gs, '').trim();
        // Match JSON arrays of tool calls (multi-line)
        cleaned = cleaned.replace(/\[\s*\{[^}]*"name"[^}]*\}\s*\]/gs, '').trim();
        // Match multiple JSON objects separated by "or"
        cleaned = cleaned.replace(/\{[^}]*"name"[^}]*\}\s*or\s*\{[^}]*"name"[^}]*\}/gs, '').trim();
        
        // Remove text that suggests using tool calls (multi-line patterns)
        cleaned = cleaned.replace(/It seems like the question.*?However, if you want.*?$/gims, '').trim();
        cleaned = cleaned.replace(/I'd recommend using:.*$/gims, '').trim();
        cleaned = cleaned.replace(/However, if you want to get.*$/gims, '').trim();
        cleaned = cleaned.replace(/It seems like the question.*$/gims, '').trim();
        cleaned = cleaned.replace(/rather than specific statistics.*$/gims, '').trim();
        
        // Check if the entire response is ONLY a technical message (most common case)
        const isOnlyTechnicalMessage = /^I (called|used) (the )?[`'"]?[\w_]+[`'"]? tool.*?\.?\s*$/gim.test(cleaned.trim());
        
        if (isOnlyTechnicalMessage) {
            // If the entire response is just a technical message, return a helpful fallback
            return "I'm processing your request. Please wait a moment for the information.";
        }
        
        // Remove technical messages about tool calls - comprehensive patterns
        const technicalPatterns = [
            // Pattern: "I called the `tool_name` tool to get this information."
            /I called the [`'"]?[\w_]+[`'"]? tool to get (this information|the information|the data|the count|the result)\.?\s*/gi,
            // Pattern: "I called the `tool_name` tool to get/retrieve..."
            /I called the [`'"]?[\w_]+[`'"]? tool to (get|retrieve|fetch|obtain) (this information|the information|the data|the count|the result)\.?\s*/gi,
            // Pattern: "I used the `tool_name` tool to get this information."
            /I used the [`'"]?[\w_]+[`'"]? tool to get (this information|the information|the data|the count|the result)\.?\s*/gi,
            // Pattern: "I used the `tool_name` tool to get/retrieve..."
            /I used the [`'"]?[\w_]+[`'"]? tool to (get|retrieve|fetch|obtain) (this information|the information|the data|the count|the result)\.?\s*/gi,
            // Pattern: "I called/used the `tool_name` tool..." (catch-all for any tool call message)
            /I (called|used) (the )?[`'"]?[\w_]+[`'"]? tool.*?\.?\s*/gi,
            // Pattern: "(I used the output of the tool call to format an answer to your original question)"
            /\(?\s*I used the output of the tool call to format an answer to your original question\s*\)?\s*/gi,
            // Pattern: "The output from the tool call was X, so I used..."
            /The output from the tool call was \d+, so I used that number in my response to answer the user's question naturally\.?\s*/gi,
            // Pattern: "This is based on the output from the tool call, which returned a count of X."
            /This is based on the output from the tool call, which returned a count of \d+\.?\s*/gi,
            // Pattern: "I used the output of the tool call to format an answer..."
            /I used the output of the tool call to format an answer to your original question\.?\s*/gi,
            // Pattern: "The output of the `tool` tool is X, which corresponds to... I used this information..."
            /The output of the [`'"]?[\w_]+[`'"]? tool is \d+, which corresponds to.*?I used this information to format a natural-sounding answer to the user's question\.?\s*/gis,
            // Pattern: "The output of the `tool` tool is used to format an answer..."
            /The output of the [`'"]?[\w_]+[`'"]? tool is used to format an answer to the original user question\.?\s*/gi,
            // Pattern: "I used the available tool to get the count of..."
            /I used the available tool to get the count of.*?\.?\s*/gi,
            // Pattern: "The output from the tool call was... so I used... in my response..."
            /The output from the tool call was.*?so I used.*?in my response.*?\.?\s*/gis,
            // Pattern: "This is based on the output from the tool call..."
            /This is based on the output from the tool call.*?\.?\s*/gis,
            // Pattern: Standalone parentheses with technical messages
            /\([^)]*(?:tool|output|call)[^)]*\)/gi,
            // Pattern: Remove sentences that mention "tool" and "recommend" or "suggest"
            /.*?(?:recommend|suggest).*?tool.*?\.?\s*/gi
        ];
        
        // Apply all technical patterns
        technicalPatterns.forEach(pattern => {
            cleaned = cleaned.replace(pattern, '').trim();
        });
        
        // Remove standalone empty parentheses or brackets
        cleaned = cleaned.replace(/^[([]\s*[)\]]\s*$/g, '').trim();
        cleaned = cleaned.replace(/^\s*[([]\s*$/g, '').trim();
        cleaned = cleaned.replace(/\s*[([]\s*$/g, '').trim();
        
        // Remove multiple consecutive spaces/newlines
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // Remove leading/trailing punctuation that might be left
        cleaned = cleaned.replace(/^[.,;:\s]+|[.,;:\s]+$/g, '').trim();
        
        // Intercept backend database tool connection errors for the demo
        const lowerCleaned = cleaned.toLowerCase();
        if (lowerCleaned.includes("apologize") && (lowerCleaned.includes("database tools") || lowerCleaned.includes("server right now") || lowerCleaned.includes("trouble connecting"))) {
            return "USE_GEMINI_FALLBACK";
        }

        // If after cleaning we have nothing meaningful
        if (!cleaned || cleaned.length < 3) {
            // Return a helpful fallback message
            return "I'm processing your request. Please wait a moment for the information.";
        }
        
        return cleaned;
    };

    // API call function for Admin PA modules
    // The languageCode parameter is sent to the API endpoint for translation
    // API endpoint: https://dev.yaikh.com/api/ai-agent
    // The backend translates the response based on the 'language' parameter ('en', 'kh', or 'ch')
    const callAdminPAAPI = async (message, module, languageCode = 'en') => {
        try {
            // Use "global" if no module is selected, otherwise use the module name
            const internalModule = module ? module : 'global';
            // Map to API-expected format
            const moduleParam = mapModuleToAPIFormat('admin-bot', internalModule);
            // Get user_id for this bot and module combination (use internal module name for storage)
            const userId = getUserIdForModule('admin-bot', internalModule);
            
            const response = await fetch('https://dev.yaikh.com/api/ai-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    module: moduleParam,
                    user_id: userId,
                    language: languageCode // Language code for translation: 'en', 'kh', or 'ch'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // API returns { response: "...", module: "..." }
            const rawResponse = data.response || data.message || 'I received your request, but the response format was unexpected.';
            // Clean up any technical tool-call messages
            return cleanAPIResponse(rawResponse);
        } catch (error) {
            console.error('API Error:', error);
            return "USE_GEMINI_FALLBACK";
        }
    };

    // Mark a suggested action as used for a specific module
    const markActionAsUsed = (module, actionText) => {
        setAdminPAUsedActions(prev => ({
            ...prev,
            [module]: [...(prev[module] || []), actionText]
        }));
    };

    // Mark a suggested action as used for Finance PA modules
    const markFinanceActionAsUsed = (module, actionText) => {
        setFinancePAUsedActions(prev => ({
            ...prev,
            [module]: [...(prev[module] || []), actionText]
        }));
    };

    // API call function for Finance PA modules
    // The languageCode parameter is sent to the API endpoint for translation
    // API endpoint: https://dev.yaikh.com/api/ai-agent
    // The backend translates the response based on the 'language' parameter ('en', 'kh', or 'ch')
    const callFinancePAAPI = async (message, module, languageCode = 'en') => {
        try {
            // Use "global" if no module is selected, otherwise use the module name
            const internalModule = module ? module : 'global';
            // Map to API-expected format
            const moduleParam = mapModuleToAPIFormat('finance-bot', internalModule);
            // Get user_id for this bot and module combination (use internal module name for storage)
            const userId = getUserIdForModule('finance-bot', internalModule);
            
            const response = await fetch('https://dev.yaikh.com/api/ai-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    module: moduleParam,
                    user_id: userId,
                    language: languageCode // Language code for translation: 'en', 'kh', or 'ch'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // API returns { response: "...", module: "..." }
            const rawResponse = data.response || data.message || 'I received your request, but the response format was unexpected.';
            // Clean up any technical tool-call messages
            return cleanAPIResponse(rawResponse);
        } catch (error) {
            console.error('API Error:', error);
            return "USE_GEMINI_FALLBACK";
        }
    };

    // Mark a suggested action as used for CSR PA modules
    const markCsrActionAsUsed = (module, actionText) => {
        setCsrPAUsedActions(prev => ({
            ...prev,
            [module]: [...(prev[module] || []), actionText]
        }));
    };

    // API call function for CSR PA modules
    // The languageCode parameter is sent to the API endpoint for translation
    // API endpoint: https://dev.yaikh.com/api/ai-agent
    // The backend translates the response based on the 'language' parameter ('en', 'kh', or 'ch')
    const callCsrPAAPI = async (message, module, languageCode = 'en') => {
        try {
            // Use "global" if no module is selected, otherwise use the module name
            const internalModule = module ? module : 'global';
            // Map to API-expected format
            const moduleParam = mapModuleToAPIFormat('csr-bot', internalModule);
            // Get user_id for this bot and module combination (use internal module name for storage)
            const userId = getUserIdForModule('csr-bot', internalModule);
            
            const response = await fetch('https://dev.yaikh.com/api/ai-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    module: moduleParam,
                    user_id: userId,
                    language: languageCode // Language code for translation: 'en', 'kh', or 'ch'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // API returns { response: "...", module: "..." }
            const rawResponse = data.response || data.message || 'I received your request, but the response format was unexpected.';
            // Clean up any technical tool-call messages
            return cleanAPIResponse(rawResponse);
        } catch (error) {
            console.error('API Error:', error);
            return "USE_GEMINI_FALLBACK";
        }
    };

    // Mark a suggested action as used for HR PA modules
    const markHrActionAsUsed = (module, actionText) => {
        setHrPAUsedActions(prev => ({
            ...prev,
            [module]: [...(prev[module] || []), actionText]
        }));
    };

    // API call function for HR PA modules
    // The languageCode parameter is sent to the API endpoint for translation
    // API endpoint: https://dev.yaikh.com/api/ai-agent
    // The backend translates the response based on the 'language' parameter ('en', 'kh', or 'ch')
    const callHrPAAPI = async (message, module, languageCode = 'en') => {
        try {
            // Use "global" if no module is selected, otherwise use the module name
            const internalModule = module ? module : 'global';
            // Map to API-expected format
            const moduleParam = mapModuleToAPIFormat('hr-bot', internalModule);
            // Get user_id for this bot and module combination (use internal module name for storage)
            const userId = getUserIdForModule('hr-bot', internalModule);
            
            const response = await fetch('https://dev.yaikh.com/api/ai-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    module: moduleParam,
                    user_id: userId,
                    language: languageCode // Language code for translation: 'en', 'kh', or 'ch'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // API returns { response: "...", module: "..." }
            const rawResponse = data.response || data.message || 'I received your request, but the response format was unexpected.';
            // Clean up any technical tool-call messages
            return cleanAPIResponse(rawResponse);
        } catch (error) {
            console.error('API Error:', error);
            return "USE_GEMINI_FALLBACK";
        }
    };

    const handleSendMessage = (botId, message) => {
        // Check for duplicate message first
        const currentBotState = botStates[botId];
        if (currentBotState && currentBotState.messages.length > 0) {
            const lastMessage = currentBotState.messages[currentBotState.messages.length - 1];
            if (lastMessage.from === 'user' && lastMessage.text.toLowerCase().trim() === message.toLowerCase().trim()) {
                return; // Don't process duplicate message
            }
        }

        // ────────────────────────────────────────────────────────────
        // Accounting PA — new Mongo-grounded Gemini backend.
        // Routes to yaikh-com /api/ai-chat/accounting, which reads the
        // PA's collections (PRs, bill claims, salary bills, shipping
        // bills) and calls Gemini 2.5 Flash. Bypasses the legacy
        // demo-rate-limit + Admin/Finance/CSR/HR module branches.
        // Other PAs continue on the old path until their own
        // /api/ai-chat/<pa> endpoint lands.
        if (botId === 'accounting-bot') {
            const priorMessages = currentBotState?.messages || [];
            const history = priorMessages
                .filter(m => m.from === 'user' || m.from === 'bot')
                .slice(-10)
                .map(m => ({
                    role: m.from === 'user' ? 'user' : 'model',
                    text: typeof m.text === 'string' ? m.text : ''
                }));

            setBotStates(prev => {
                const bs = prev[botId];
                const userMsg = { from: 'user', text: message };
                const updatedMessages = [...bs.messages, userMsg];
                const updatedHistory = bs.currentChatId
                    ? bs.chatHistory.map(chat =>
                        chat.id === bs.currentChatId
                            ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() }
                            : chat
                    )
                    : bs.chatHistory;
                return {
                    ...prev,
                    [botId]: {
                        ...bs,
                        messages: updatedMessages,
                        isTyping: true,
                        chatHistory: updatedHistory,
                    },
                };
            });

            fetch('/api/ai-chat/accounting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history }),
            })
                .then(r => r.json())
                .then(data => {
                    const replyText = data?.ok
                        ? data.reply
                        : `(Backend error: ${data?.error || 'unknown'})`;
                    setBotStates(prev => {
                        const bs = prev[botId];
                        const botMsg = { from: 'bot', text: replyText };
                        const updatedMessages = [...bs.messages, botMsg];
                        const updatedHistory = bs.currentChatId
                            ? bs.chatHistory.map(chat =>
                                chat.id === bs.currentChatId
                                    ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() }
                                    : chat
                            )
                            : bs.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...bs,
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory,
                            },
                        };
                    });
                })
                .catch(err => {
                    setBotStates(prev => {
                        const bs = prev[botId];
                        const botMsg = { from: 'bot', text: `(Network error: ${err?.message || String(err)})` };
                        return {
                            ...prev,
                            [botId]: {
                                ...bs,
                                messages: [...bs.messages, botMsg],
                                isTyping: false,
                            },
                        };
                    });
                });
            return;
        }
        // End Accounting PA intercept
        // ────────────────────────────────────────────────────────────

        // Demo Rate Limiting: Max 1 question per chat
        if (currentBotState) {
            const userMessageCount = currentBotState.messages.filter(msg => msg.from === 'user').length;
            if (userMessageCount >= 1) {
                setBotStates(prev => {
                    const botState = prev[botId];
                    const userMsg = { from: 'user', text: message };
                    const botMsg = { from: 'bot', text: "You have reached your limit of 1 question for this demo. If you want to chat more, please visit ChatGPT or Gemini directly." };
                    
                    const updatedMessages = [...botState.messages, userMsg, botMsg];
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return; // Prevent further processing
            }
        }
        
        // Handle Admin PA module selection
        if (botId === 'admin-bot') {
            const messageLower = message.toLowerCase().trim();
            
            // Only allow module switching if explicitly requested
            // If already in a module, only switch if message is EXACTLY a module name or explicit switch command
            const isExplicitModuleSwitch = 
                messageLower === 'purchase request' || messageLower === 'support ticket' || messageLower === 'y-shop' ||
                messageLower === 'gatepass' || messageLower === 'car booking' ||
                messageLower === 'switch to purchase request' || messageLower === 'switch to support ticket' || messageLower === 'switch to y-shop' ||
                messageLower === 'switch to gatepass' || messageLower === 'switch to car booking' ||
                messageLower === 'go to purchase request' || messageLower === 'go to support ticket' || messageLower === 'go to y-shop' ||
                messageLower === 'go to gatepass' || messageLower === 'go to car booking';
            
            // Check if user wants to select a module
            // If no module selected: allow any mention of module name
            // If module already selected: only allow exact match or explicit switch
            if (messageLower === 'purchase request' || 
                (!adminPAModule && messageLower.includes('purchase request')) ||
                (adminPAModule && isExplicitModuleSwitch && messageLower === 'purchase request')) {
                setAdminPAModule('purchase');
                // Add bot message showing module selected
                setBotStates(prev => {
                    const botState = prev[botId];
                    const botMsg = { from: 'bot', text: `Selected: ${adminPAModules.purchase.name} module. Choose an action below:` };
                    const lastMsg = botState.messages[botState.messages.length - 1];
                    const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                    // If user already selected this module (double click), don't add duplicates
                    if (
                        lastBotMsg?.from === 'bot' &&
                        typeof lastBotMsg.text === 'string' &&
                        lastBotMsg.text.includes(`Selected: ${adminPAModules.purchase.name} module`)
                    ) {
                        return prev;
                    }

                    const updatedMessages = [...botState.messages];
                    // Add the user message only if the last message isn't the same user message already
                    if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                        updatedMessages.push({ from: 'user', text: message });
                    }
                    updatedMessages.push(botMsg);
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }
            else if (messageLower === 'support ticket' || 
                     messageLower === 'create support ticket' ||
                     (!adminPAModule && (messageLower.includes('support ticket') || messageLower.includes('create support ticket'))) ||
                     (adminPAModule && isExplicitModuleSwitch && (messageLower === 'support ticket' || messageLower === 'create support ticket'))) {
                setAdminPAModule('support_ticket');
                setBotStates(prev => {
                    const botState = prev[botId];
                    const botMsg = { from: 'bot', text: `Selected: ${adminPAModules.support_ticket.name} module. Choose an action below:` };
                    const lastMsg = botState.messages[botState.messages.length - 1];
                    const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                    if (
                        lastBotMsg?.from === 'bot' &&
                        typeof lastBotMsg.text === 'string' &&
                        lastBotMsg.text.includes(`Selected: ${adminPAModules.support_ticket.name} module`)
                    ) {
                        return prev;
                    }

                    const updatedMessages = [...botState.messages];
                    if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                        updatedMessages.push({ from: 'user', text: message });
                    }
                    updatedMessages.push(botMsg);
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }
            else if (messageLower === 'y-shop' ||
                     (!adminPAModule && messageLower.includes('y-shop')) ||
                     (adminPAModule && isExplicitModuleSwitch && messageLower === 'y-shop')) {
                setAdminPAModule('shop');
                setBotStates(prev => {
                    const botState = prev[botId];
                    const botMsg = { from: 'bot', text: `Selected: ${adminPAModules.shop.name} module. Choose an action below:` };
                    const lastMsg = botState.messages[botState.messages.length - 1];
                    const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                    if (
                        lastBotMsg?.from === 'bot' &&
                        typeof lastBotMsg.text === 'string' &&
                        lastBotMsg.text.includes(`Selected: ${adminPAModules.shop.name} module`)
                    ) {
                        return prev;
                    }

                    const updatedMessages = [...botState.messages];
                    if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                        updatedMessages.push({ from: 'user', text: message });
                    }
                    updatedMessages.push(botMsg);
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }
            else if (messageLower === 'gatepass' ||
                     (!adminPAModule && messageLower.includes('gatepass')) ||
                     (adminPAModule && isExplicitModuleSwitch && messageLower === 'gatepass')) {
                setAdminPAModule('gatepass');
                setBotStates(prev => {
                    const botState = prev[botId];
                    const botMsg = { from: 'bot', text: `Selected: ${adminPAModules.gatepass.name} module. Choose an action below:` };
                    const lastMsg = botState.messages[botState.messages.length - 1];
                    const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                    if (
                        lastBotMsg?.from === 'bot' &&
                        typeof lastBotMsg.text === 'string' &&
                        lastBotMsg.text.includes(`Selected: ${adminPAModules.gatepass.name} module`)
                    ) {
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                isTyping: false
                            }
                        };
                    }

                    const updatedMessages = [...botState.messages];
                    if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                        updatedMessages.push({ from: 'user', text: message });
                    }
                    updatedMessages.push(botMsg);
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }
            else if (messageLower === 'car booking' ||
                     messageLower === 'car-booking' ||
                     (!adminPAModule && (messageLower.includes('car booking') || messageLower.includes('car-booking'))) ||
                     (adminPAModule && isExplicitModuleSwitch && (messageLower === 'car booking' || messageLower === 'car-booking'))) {
                setAdminPAModule('car_booking');
                setBotStates(prev => {
                    const botState = prev[botId];
                    const botMsg = { from: 'bot', text: `Selected: ${adminPAModules.car_booking.name} module. Choose an action below:` };
                    const lastMsg = botState.messages[botState.messages.length - 1];
                    const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                    if (
                        lastBotMsg?.from === 'bot' &&
                        typeof lastBotMsg.text === 'string' &&
                        lastBotMsg.text.includes(`Selected: ${adminPAModules.car_booking.name} module`)
                    ) {
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                isTyping: false
                            }
                        };
                    }

                    const updatedMessages = [...botState.messages];
                    if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                        updatedMessages.push({ from: 'user', text: message });
                    }
                    updatedMessages.push(botMsg);
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }
            // Check if user wants to go back to module selection
            else if (messageLower.includes('back') || messageLower === 'back' || messageLower.includes('menu')) {
                setAdminPAModule(null);
                setBotStates(prev => {
                    const botState = prev[botId];
                    const botMsg = { from: 'bot', text: 'Select a module to get started:' };
                    const updatedMessages = [...botState.messages, { from: 'user', text: message }, botMsg];
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false,
                            chatHistory: updatedHistory
                        }
                    };
                });
                return;
            }
        }

        let chatHistoryForGemini = [];
        
        setBotStates(prev => {
            const botState = prev[botId];
            
            // Check for duplicate message before adding
            if (botState.messages.length > 0) {
                const lastMsg = botState.messages[botState.messages.length - 1];
                if (lastMsg.from === 'user' && lastMsg.text.toLowerCase().trim() === message.toLowerCase().trim()) {
                    return prev; // Don't add duplicate
                }
            }
            
            let currentChatId = botState.currentChatId;
            const userMessage = { from: 'user', text: message };
            const updatedMessages = [...botState.messages, userMessage];
            
            // Store chat history for Gemini API (before adding user message)
            chatHistoryForGemini = botState.messages;

            // Create new chat if none exists
            if (!currentChatId) {
                currentChatId = Date.now().toString();
                const newChat = {
                    id: currentChatId,
                    title: message.substring(0, 50),
                    messages: updatedMessages,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                return {
                    ...prev,
                    [botId]: {
                        ...prev[botId],
                        messages: updatedMessages,
                        isTyping: true,
                        chatHistory: [newChat, ...prev[botId].chatHistory],
                        currentChatId: currentChatId
                    }
                };
            }

            // Update existing chat in history with user message
            const updatedHistory = botState.chatHistory.map(chat => {
                if (chat.id === currentChatId) {
                    return {
                        ...chat,
                        messages: updatedMessages,
                        updatedAt: new Date().toISOString()
                    };
                }
                return chat;
            });

            return {
                ...prev,
                [botId]: {
                    ...prev[botId],
                    messages: updatedMessages,
                    isTyping: true,
                    chatHistory: updatedHistory
                }
            };
        });

        setTimeout(async () => {
            const bot = PREDEFINED_BOTS.find(b => b.id === botId);
            let botResponse = `Hello! I'm ${bot.name}. You asked: "${message}". ${bot.description}. How can I help you today?`;
            let responseType = 'text'; // 'text', 'button', 'dropdown'
            let buttonText = null;
            let dropdownItems = null;
            let hasPredefinedResponse = false;

            // Track if we found a predefined response
            const originalResponse = botResponse;

            // Finance PA module selection handling
            if (botId === 'finance-bot') {
                const messageLower = message.toLowerCase().trim();
                
                // Only allow module switching if explicitly requested
                const isExplicitModuleSwitch = 
                    messageLower === 'accounts' ||
                    messageLower === 'switch to accounts' ||
                    messageLower === 'go to accounts';
                
                // Check if user wants to select Accounts module
                if (messageLower === 'accounts' || 
                    (!financePAModule && messageLower.includes('accounts')) ||
                    (financePAModule && isExplicitModuleSwitch && messageLower === 'accounts')) {
                    setFinancePAModule('accounts');
                    // Add bot message showing module selected
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${financePAModules.accounts.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${financePAModules.accounts.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }

                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return; // Exit early
                }
                
                // Handle "new chat" or "reset" to clear module selection
                if (messageLower === 'new chat' || messageLower === 'reset' || messageLower === 'start over') {
                    setFinancePAModule(null);
                    setFinancePAUsedActions({ accounts: [] });
                }
            }

            // CSR PA module selection handling
            if (botId === 'csr-bot') {
                const messageLower = message.toLowerCase().trim();
                
                // Only allow module switching if explicitly requested
                const isExplicitModuleSwitch = 
                    messageLower === 'csr' || messageLower === 'air' || messageLower === 'electricity' ||
                    messageLower === 'water' || messageLower === 'waste management' || messageLower === 'waste-management' ||
                    messageLower === 'switch to csr' || messageLower === 'switch to air' || messageLower === 'switch to electricity' ||
                    messageLower === 'switch to water' || messageLower === 'switch to waste management' ||
                    messageLower === 'go to csr' || messageLower === 'go to air' || messageLower === 'go to electricity' ||
                    messageLower === 'go to water' || messageLower === 'go to waste management';
                
                // Check if user wants to select CSR module
                if (messageLower === 'csr' || 
                    (!csrPAModule && messageLower.includes('csr')) ||
                    (csrPAModule && isExplicitModuleSwitch && messageLower === 'csr')) {
                    setCsrPAModule('csr');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${csrPAModules.csr.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${csrPAModules.csr.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                // Check if user wants to select Air module
                else if (messageLower === 'air' || messageLower === 'air temperature' || messageLower === 'air temperature & humidity' ||
                         (!csrPAModule && (messageLower.includes('air') && !messageLower.includes('chair'))) ||
                         (csrPAModule && isExplicitModuleSwitch && (messageLower === 'air' || messageLower === 'air temperature'))) {
                    setCsrPAModule('air');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${csrPAModules.air.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${csrPAModules.air.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                // Check if user wants to select Electricity module
                else if (messageLower === 'electricity' ||
                         (!csrPAModule && messageLower.includes('electricity')) ||
                         (csrPAModule && isExplicitModuleSwitch && messageLower === 'electricity')) {
                    setCsrPAModule('electricity');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${csrPAModules.electricity.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${csrPAModules.electricity.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                // Check if user wants to select Water module
                else if (messageLower === 'water' ||
                         (!csrPAModule && messageLower.includes('water')) ||
                         (csrPAModule && isExplicitModuleSwitch && messageLower === 'water')) {
                    setCsrPAModule('water');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${csrPAModules.water.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${csrPAModules.water.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                // Check if user wants to select Waste Management module
                else if (messageLower === 'waste management' || messageLower === 'waste-management' || messageLower === 'waste' ||
                         (!csrPAModule && (messageLower.includes('waste management') || messageLower.includes('waste-management'))) ||
                         (csrPAModule && isExplicitModuleSwitch && (messageLower === 'waste management' || messageLower === 'waste-management'))) {
                    setCsrPAModule('waste_management');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${csrPAModules.waste_management.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${csrPAModules.waste_management.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                
                // Handle "new chat" or "reset" to clear module selection
                if (messageLower === 'new chat' || messageLower === 'reset' || messageLower === 'start over') {
                    setCsrPAModule(null);
                    setCsrPAUsedActions({ csr: [], air: [], electricity: [], water: [], waste_management: [] });
                }
            }

            // HR PA module selection handling
            if (botId === 'hr-bot') {
                const messageLower = message.toLowerCase().trim();
                
                // Only allow module switching if explicitly requested
                const isExplicitModuleSwitch = 
                    messageLower === 'hr' || messageLower === 'training' ||
                    messageLower === 'switch to hr' || messageLower === 'switch to training' ||
                    messageLower === 'go to hr' || messageLower === 'go to training';
                
                // Check if user wants to select HR module
                if (messageLower === 'hr' || 
                    (!hrPAModule && messageLower.includes('hr') && !messageLower.includes('training')) ||
                    (hrPAModule && isExplicitModuleSwitch && messageLower === 'hr')) {
                    setHrPAModule('hr');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${hrPAModules.hr.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${hrPAModules.hr.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                // Check if user wants to select Training module
                else if (messageLower === 'training' ||
                         (!hrPAModule && messageLower.includes('training')) ||
                         (hrPAModule && isExplicitModuleSwitch && messageLower === 'training')) {
                    setHrPAModule('training');
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const botMsg = { from: 'bot', text: `Selected: ${hrPAModules.training.name} module. Choose an action below:` };
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        const lastBotMsg = lastMsg?.from === 'bot' ? lastMsg : botState.messages[botState.messages.length - 2];
                        if (
                            lastBotMsg?.from === 'bot' &&
                            typeof lastBotMsg.text === 'string' &&
                            lastBotMsg.text.includes(`Selected: ${hrPAModules.training.name} module`)
                        ) {
                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    isTyping: false
                                }
                            };
                        }
                        const updatedMessages = [...botState.messages];
                        if (!(lastMsg?.from === 'user' && lastMsg.text?.toLowerCase?.().trim?.() === messageLower)) {
                            updatedMessages.push({ from: 'user', text: message });
                        }
                        updatedMessages.push(botMsg);
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    return;
                }
                
                // Handle "new chat" or "reset" to clear module selection
                if (messageLower === 'new chat' || messageLower === 'reset' || messageLower === 'start over') {
                    setHrPAModule(null);
                    setHrPAUsedActions({ hr: [], training: [] });
                }
            }

            // Admin PA module API calls
            if (botId === 'admin-bot' && adminPAModule) {
                // Check if question is related to the selected module
                const isModuleRelated = isQuestionModuleRelated(botId, adminPAModule, message);
                // Use "global" if question is not related to the module, otherwise use the selected module
                const moduleToUse = isModuleRelated ? adminPAModule : null;
                
                // Mark this action as used immediately if it matches a suggested action
                if (adminPAModules[adminPAModule] && isModuleRelated) {
                    const matchingAction = adminPAModules[adminPAModule].suggestedActions.find(
                        action => action.text.toLowerCase() === message.toLowerCase().trim()
                    );
                    if (matchingAction) {
                        markActionAsUsed(adminPAModule, matchingAction.text);
                    }
                }
                
                if (message.includes("[IMAGE_DATA:")) {
                    // Bypass specific API call to let multimodal Gemini handle image analysis directly
                } else {
                    // User is asking a non-multimodal question - call API with appropriate module
                    // Add user message and set typing state
                    setBotStates(prev => {
                        const botState = prev[botId];
                        
                        // Check for duplicate message before adding
                        if (botState.messages.length > 0) {
                            const lastMsg = botState.messages[botState.messages.length - 1];
                            if (lastMsg.from === 'user' && lastMsg.text.toLowerCase().trim() === message.toLowerCase().trim()) {
                                return prev; // Don't add duplicate
                            }
                        }
                        
                        const userMsg = { from: 'user', text: message };
                        const updatedMessages = [...botState.messages, userMsg];
                        const updatedHistory = botState.currentChatId ? 
                            botState.chatHistory.map(chat => chat.id === botState.currentChatId ? 
                                { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                            ) : botState.chatHistory;
                            
                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: true,
                                chatHistory: updatedHistory
                            }
                        };
                    });
                    
                    // Call API with appropriate module (global if not module-related)
                    const languageCode = botLanguages[botId]?.code || 'en';
                    callAdminPAAPI(message, moduleToUse, languageCode)
                        .then(apiResponse => {
                    if (apiResponse === "USE_GEMINI_FALLBACK") {
                        const botName = PREDEFINED_BOTS.find(b => b.id === botId)?.name || botId;
                        const botContext = `You are ${botName}, an AI assistant for the ${moduleToUse || 'general'} module. The user is running a demo and clicking on suggested prompts. Generate a realistic, helpful, and naturally phrased mock/demo response based on their query. Include some realistic fake statistics or data if appropriate for the query.`;
                        
                        // We need chatHistoryForGemini which was populated right before the API call
                        generateDirectGeminiResponse(message, botName, botContext, chatHistoryForGemini || [])
                            .then(geminiResp => streamBotResponse(botId, geminiResp))
                            .catch(err => {
                                console.error('Gemini fallback failed:', err);
                                streamBotResponse(botId, "Here is a sample answer for your demo: The current data shows 1,245 processed items.");
                            });
                    } else {
                        streamBotResponse(botId, apiResponse);
                    }
                })
                        .catch(error => {
                            streamBotResponse(botId, `Sorry, I encountered an error: ${error.message}. Please try again later.`);
                        });
                    return; // Exit early - don't process further
                }
            }

            // Finance PA module API calls
            if (botId === 'finance-bot' && financePAModule) {
                // Check if question is related to the selected module
                const isModuleRelated = isQuestionModuleRelated(botId, financePAModule, message);
                // Use "global" if question is not related to the module, otherwise use the selected module
                const moduleToUse = isModuleRelated ? financePAModule : null;
                
                // Mark this action as used immediately if it matches a suggested action
                if (financePAModules[financePAModule] && isModuleRelated) {
                    const matchingAction = financePAModules[financePAModule].suggestedActions.find(
                        action => action.text.toLowerCase() === message.toLowerCase().trim()
                    );
                    if (matchingAction) {
                        markFinanceActionAsUsed(financePAModule, matchingAction.text);
                    }
                }
                
                if (message.includes("[IMAGE_DATA:")) {
                    // Bypass specific API call to let multimodal Gemini handle image analysis directly
                } else {
                    // User is asking a question - call API with appropriate module
                    // Add user message and set typing state
                    setBotStates(prev => {
                    const botState = prev[botId];
                    
                    // Check for duplicate message before adding
                    if (botState.messages.length > 0) {
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        if (lastMsg.from === 'user' && lastMsg.text.toLowerCase().trim() === message.toLowerCase().trim()) {
                            return prev; // Don't add duplicate
                        }
                    }
                    
                    const userMsg = { from: 'user', text: message };
                    const updatedMessages = [...botState.messages, userMsg];
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;
                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: true,
                            chatHistory: updatedHistory
                        }
                    };
                });

                // Call API with appropriate module (global if not module-related)
                const languageCode = botLanguages[botId]?.code || 'en';
                callFinancePAAPI(message, moduleToUse, languageCode).then(apiResponse => {
                    if (apiResponse === "USE_GEMINI_FALLBACK") {
                        const botName = PREDEFINED_BOTS.find(b => b.id === botId)?.name || botId;
                        const botContext = `You are ${botName}, an AI assistant for the ${moduleToUse || 'general'} module. The user is running a demo and clicking on suggested prompts. Generate a realistic, helpful, and naturally phrased mock/demo response based on their query. Include some realistic fake statistics or data if appropriate for the query.`;
                        
                        // We need chatHistoryForGemini which was populated right before the API call
                        generateDirectGeminiResponse(message, botName, botContext, chatHistoryForGemini || [])
                            .then(geminiResp => streamBotResponse(botId, geminiResp))
                            .catch(err => {
                                console.error('Gemini fallback failed:', err);
                                streamBotResponse(botId, "Here is a sample answer for your demo: The current data shows 1,245 processed items.");
                            });
                    } else {
                        streamBotResponse(botId, apiResponse);
                    }
                }).catch(error => {
                    streamBotResponse(botId, `Sorry, I encountered an error: ${error.message}. Please try again later.`);
                });
                return; // Exit early - don't process further
                }
            }

            // CSR PA module API calls
            if (botId === 'csr-bot' && csrPAModule) {
                // Check if question is related to the selected module
                const isModuleRelated = isQuestionModuleRelated(botId, csrPAModule, message);
                // Use "global" if question is not related to the module, otherwise use the selected module
                const moduleToUse = isModuleRelated ? csrPAModule : null;
                
                // Mark this action as used immediately if it matches a suggested action
                if (csrPAModules[csrPAModule] && isModuleRelated) {
                    const matchingAction = csrPAModules[csrPAModule].suggestedActions.find(
                        action => action.text.toLowerCase() === message.toLowerCase().trim()
                    );
                    if (matchingAction) {
                        markCsrActionAsUsed(csrPAModule, matchingAction.text);
                    }
                }
                
                if (message.includes("[IMAGE_DATA:")) {
                    // Bypass specific API call to let multimodal Gemini handle image analysis directly
                } else {
                    // User is asking a question - call API with appropriate module
                    // Add user message and set typing state
                    setBotStates(prev => {
                    const botState = prev[botId];
                    
                    // Check for duplicate message before adding
                    if (botState.messages.length > 0) {
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        if (lastMsg.from === 'user' && lastMsg.text.toLowerCase().trim() === message.toLowerCase().trim()) {
                            return prev; // Don't add duplicate
                        }
                    }
                    
                    const userMsg = { from: 'user', text: message };
                    const updatedMessages = [...botState.messages, userMsg];
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;

                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: true,
                            chatHistory: updatedHistory
                        }
                    };
                });

                // Call API with appropriate module (global if not module-related)
                const languageCode = botLanguages[botId]?.code || 'en';
                callCsrPAAPI(message, moduleToUse, languageCode).then(apiResponse => {
                    if (apiResponse === "USE_GEMINI_FALLBACK") {
                        const botName = PREDEFINED_BOTS.find(b => b.id === botId)?.name || botId;
                        const botContext = `You are ${botName}, an AI assistant for the ${moduleToUse || 'general'} module. The user is running a demo and clicking on suggested prompts. Generate a realistic, helpful, and naturally phrased mock/demo response based on their query. Include some realistic fake statistics or data if appropriate for the query.`;
                        
                        // We need chatHistoryForGemini which was populated right before the API call
                        generateDirectGeminiResponse(message, botName, botContext, chatHistoryForGemini || [])
                            .then(geminiResp => streamBotResponse(botId, geminiResp))
                            .catch(err => {
                                console.error('Gemini fallback failed:', err);
                                streamBotResponse(botId, "Here is a sample answer for your demo: The current data shows 1,245 processed items.");
                            });
                    } else {
                        streamBotResponse(botId, apiResponse);
                    }
                }).catch(error => {
                    streamBotResponse(botId, `Sorry, I encountered an error: ${error.message}. Please try again later.`);
                });
                return; // Exit early - don't process further
                }
            }

            // HR PA module API calls
            if (botId === 'hr-bot' && hrPAModule) {
                // Check if question is related to the selected module
                const isModuleRelated = isQuestionModuleRelated(botId, hrPAModule, message);
                // Use "global" if question is not related to the module, otherwise use the selected module
                const moduleToUse = isModuleRelated ? hrPAModule : null;
                
                // Mark this action as used immediately if it matches a suggested action
                if (hrPAModules[hrPAModule] && isModuleRelated) {
                    const matchingAction = hrPAModules[hrPAModule].suggestedActions.find(
                        action => action.text.toLowerCase() === message.toLowerCase().trim()
                    );
                    if (matchingAction) {
                        markHrActionAsUsed(hrPAModule, matchingAction.text);
                    }
                }
                
                if (message.includes("[IMAGE_DATA:")) {
                    // Bypass specific API call to let multimodal Gemini handle image analysis directly
                } else {
                    // User is asking a question - call API with appropriate module
                    // Add user message and set typing state
                    setBotStates(prev => {
                    const botState = prev[botId];
                    
                    // Check for duplicate message before adding
                    if (botState.messages.length > 0) {
                        const lastMsg = botState.messages[botState.messages.length - 1];
                        if (lastMsg.from === 'user' && lastMsg.text.toLowerCase().trim() === message.toLowerCase().trim()) {
                            return prev; // Don't add duplicate
                        }
                    }
                    
                    const userMsg = { from: 'user', text: message };
                    const updatedMessages = [...botState.messages, userMsg];
                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                    ) : botState.chatHistory;

                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: true,
                            chatHistory: updatedHistory
                        }
                    };
                });

                // Call API with appropriate module (global if not module-related)
                const languageCode = botLanguages[botId]?.code || 'en';
                callHrPAAPI(message, moduleToUse, languageCode).then(apiResponse => {
                    if (apiResponse === "USE_GEMINI_FALLBACK") {
                        const botName = PREDEFINED_BOTS.find(b => b.id === botId)?.name || botId;
                        const botContext = `You are ${botName}, an AI assistant for the ${moduleToUse || 'general'} module. The user is running a demo and clicking on suggested prompts. Generate a realistic, helpful, and naturally phrased mock/demo response based on their query. Include some realistic fake statistics or data if appropriate for the query.`;
                        
                        // We need chatHistoryForGemini which was populated right before the API call
                        generateDirectGeminiResponse(message, botName, botContext, chatHistoryForGemini || [])
                            .then(geminiResp => streamBotResponse(botId, geminiResp))
                            .catch(err => {
                                console.error('Gemini fallback failed:', err);
                                streamBotResponse(botId, "Here is a sample answer for your demo: The current data shows 1,245 processed items.");
                            });
                    } else {
                        streamBotResponse(botId, apiResponse);
                    }
                }).catch(error => {
                    streamBotResponse(botId, `Sorry, I encountered an error: ${error.message}. Please try again later.`);
                });
                return; // Exit early - don't process further
                }
            }

            // Finance PA specific responses (original predefined responses - commented out but kept)
            if (botId === 'finance-bot' && !financePAModule) {
                const messageLower = message.toLowerCase().trim();

                // 1. Purchase Request appr
                if (messageLower.includes('purchase request appr') || messageLower === 'purchase request appr') {
                    hasPredefinedResponse = true;
                    botResponse = 'PA: 776 waiting for payment';
                    buttonText = 'Pay';
                    responseType = 'button';

                    // Add first response immediately
                    setBotStates(prev => {
                        const botState = prev[botId];
                        const messageObj = { from: 'bot', text: botResponse, type: responseType, buttonText };
                        const updatedMessages = [...botState.messages, messageObj];
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;

                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });

                    // Second message after 3 seconds
                    setTimeout(() => {
                        setBotStates(prev => {
                            const botState = prev[botId];
                            if (!botState) return prev;
                            const updatedMessages = [...botState.messages, { from: 'bot', text: 'PA: ES packing payment 6500$ IMV 00078 pay data.' }];
                            const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                                chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                            ) : botState.chatHistory;

                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    messages: updatedMessages,
                                    chatHistory: updatedHistory
                                }
                            };
                        });
                    }, 3000);

                    // Third message after 3 more seconds (6 seconds total)
                    setTimeout(() => {
                        setBotStates(prev => {
                            const botState = prev[botId];
                            if (!botState) return prev;
                            const updatedMessages = [...botState.messages, { from: 'bot', text: 'Payment processed successfully. Transaction ID: TXN-776-001' }];
                            const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                                chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                            ) : botState.chatHistory;

                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    messages: updatedMessages,
                                    chatHistory: updatedHistory
                                }
                            };
                        });
                    }, 6000);
                    return; // Exit early, don't process default response
                }

                // 2. Supp Payment Request
                if (messageLower.includes('supp payment request') || messageLower === 'supp payment request') {
                    hasPredefinedResponse = true;
                    botResponse = 'PA: ES packing payment 6500$ IMV 00078';
                    buttonText = 'Pay';
                    responseType = 'button';

                    setBotStates(prev => {
                        const botState = prev[botId];
                        const messageObj = { from: 'bot', text: botResponse, type: responseType, buttonText };
                        const updatedMessages = [...botState.messages, messageObj];
                        const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                            chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                        ) : botState.chatHistory;

                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    });

                    // Second message after 3 seconds
                    setTimeout(() => {
                        setBotStates(prev => {
                            const botState = prev[botId];
                            if (!botState) return prev;
                            const updatedMessages = [...botState.messages, { from: 'bot', text: 'PA: ABC COL LLDT 2500$ ....' }];
                            const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                                chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                            ) : botState.chatHistory;

                            return {
                                ...prev,
                                [botId]: {
                                    ...prev[botId],
                                    messages: updatedMessages,
                                    chatHistory: updatedHistory
                                }
                            };
                        });
                    }, 3000);
                    return; // Exit early
                }

                // 3. E-invoice
                if (messageLower.includes('e-invoice') || messageLower === 'e-invoice' || messageLower === 'einvoice') {
                    hasPredefinedResponse = true;
                    botResponse = 'E-invoice received.';
                }
                // 4. Generate Invoice
                else if (messageLower.includes('generate invoice') || messageLower === 'generate invoice') {
                    hasPredefinedResponse = true;
                    botResponse = 'Select invoice to generate:';
                    responseType = 'invoice-list';
                    dropdownItems = [
                        {
                            id: 'inv-pr-001',
                            text: 'Invoice from Purchase Request appr',
                            source: 'purchase-request',
                            image: 'assets/modules-image/Verify-pr.png'
                        },
                        {
                            id: 'inv-spp-001',
                            text: 'Invoice from Supp Payment Request',
                            source: 'supp-payment',
                            image: 'assets/modules-image/Approval-pr.png'
                        }
                    ];
                }
                // Handle invoice display when user clicks on invoice name
                else if (messageLower.includes('show invoice:')) {
                    hasPredefinedResponse = true;
                    const invoiceText = message.substring(message.indexOf(':') + 1).trim();
                    if (invoiceText.includes('Purchase Request')) {
                        botResponse = `Invoice: ${invoiceText}`;
                        responseType = 'invoice-image';
                        dropdownItems = [{
                            id: 'inv-pr-img',
                            text: invoiceText,
                            image: 'assets/modules-image/Verify-pr.png'
                        }];
                    } else if (invoiceText.includes('Supp Payment')) {
                        botResponse = `Invoice: ${invoiceText}`;
                        responseType = 'invoice-image';
                        dropdownItems = [{
                            id: 'inv-spp-img',
                            text: invoiceText,
                            image: 'assets/modules-image/Approval-pr.png'
                        }];
                    }
                }
                // 5. Data
                else if (messageLower === 'data' || messageLower.includes('data')) {
                    hasPredefinedResponse = true;
                    botResponse = 'Monthly declaration';
                }
            }

            // Admin PA specific responses
            if (botId === 'admin-bot' && !adminPAModule) { // Only handle predefined if no module is selected
                const messageLower = message.toLowerCase().trim();

                // 1. Food Menu
                if (messageLower.includes('food menu') || messageLower === 'food menu') {
                    hasPredefinedResponse = true;
                    botResponse = 'Here is the menu:';
                    responseType = 'invoice-image';
                    dropdownItems = [{
                        id: 'menu-img',
                        text: 'Food Menu',
                        image: 'assets/modules-image/menu.png'
                    }];
                }
                // 5. Car fuel
                else if (messageLower.includes('car fuel') || messageLower === 'car fuel') {
                    hasPredefinedResponse = true;
                    botResponse = 'Car plate 1C-7782: Fuel overconsumption. GPS 167km/week: 1L = 6km [STD: 1L = 10km]';
                }
                // 6. Security Issue
                else if (messageLower.includes('security issue') || messageLower === 'security issue') {
                    hasPredefinedResponse = true;
                    botResponse = 'Security found 3 strangers trying to enter the factory during lunch time.';
                }
                // 7. 2 Applications Received for IE Job Post
                else if (messageLower.includes('2 applications received for ie job post') || 
                         messageLower.includes('2 applications recieve for ie jobs post') ||
                         messageLower.includes('applications received') ||
                         messageLower.includes('applications recieve')) {
                    hasPredefinedResponse = true;
                    botResponse = 'Do you want to review the 2 applications?';
                }
            }

            // PPC PA specific responses
            if (botId === 'ppc-bot') {
                const messageLower = message.toLowerCase().trim();

                // 1. Order Status
                if (messageLower.includes('order status') || messageLower === 'order status') {
                    hasPredefinedResponse = true;
                    botResponse = 'Order Status & Planning Gantt Chart';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'order-status-img',
                        text: 'Order Status',
                        image: 'assets/modules-image/order-status.png',
                        name: 'Order Status'
                    }];
                }
                // 2. Delay Alert
                else if (messageLower.includes('delay alert') || messageLower === 'delay alert') {
                    hasPredefinedResponse = true;
                    botResponse = 'Delay Alert Notification';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'delay-alert-img',
                        text: 'Delay Alert',
                        image: 'assets/modules-image/delay-alert.png',
                        name: 'Delay Alert'
                    }];
                }
                // 3. Need Your Action
                else if (messageLower.includes('need your action') || messageLower === 'need your action') {
                    hasPredefinedResponse = true;
                    botResponse = 'Action Required Notification';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'need-action-img',
                        text: 'Need Your Action',
                        image: 'assets/modules-image/need-action.png',
                        name: 'Need Your Action'
                    }];
                }
                // 4. Supplier Alert
                else if (messageLower.includes('supplier alert') || messageLower === 'supplier alert') {
                    hasPredefinedResponse = true;
                    botResponse = 'Supplier Alert Dashboard';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'supplier-alert-img',
                        text: 'Supplier Alert',
                        image: 'assets/modules-image/supplier-alert.png',
                        name: 'Supplier Alert'
                    }];
                }
                // 5. Master Plan
                else if (messageLower.includes('master plan') || messageLower === 'master plan') {
                    hasPredefinedResponse = true;
                    botResponse = 'Master Plan - Production Planning & Control';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'master-plan-img',
                        text: 'Master Plan',
                        image: 'assets/modules-image/master-plan.png',
                        name: 'Master Plan'
                    }];
                }
                // 6. Line Plan
                else if (messageLower.includes('line plan') || messageLower === 'line plan') {
                    hasPredefinedResponse = true;
                    botResponse = 'Monthly Line Plan - PPC Department';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'line-plan-img',
                        text: 'Line Plan',
                        image: 'assets/modules-image/Line-plan.png',
                        name: 'Line Plan'
                    }];
                }
            }

            // CSR PA specific responses
            if (botId === 'csr-bot' && !csrPAModule) { // Only handle predefined if no module is selected
                const messageLower = message.toLowerCase().trim();

                // 1. Induction Training
                if (messageLower.includes('induction training') || messageLower === 'induction training') {
                    hasPredefinedResponse = true;
                    botResponse = 'Factory Induction: Safety & Rules - Welcome!';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'induction-training-img',
                        text: 'Induction Training',
                        image: 'assets/modules-image/induction-training.png',
                        name: 'Induction Training'
                    }];
                }
                // 2. Monthly 6S Report
                else if (messageLower.includes('monthly 6s report') || messageLower === 'monthly 6s report' || messageLower.includes('6s report')) {
                    hasPredefinedResponse = true;
                    botResponse = 'Monthly 6S Report';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: '6s-report-img',
                        text: 'Monthly 6S Report',
                        image: 'assets/modules-image/6s.png',
                        name: 'Monthly 6S Report'
                    }];
                }
                // 3. Compliance Certificate
                else if (messageLower.includes('compliance certificate') || messageLower === 'compliance certificate') {
                    hasPredefinedResponse = true;
                    botResponse = 'Certificate of Compliance';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'certificate-compliance-img',
                        text: 'Compliance Certificate',
                        image: 'assets/modules-image/certificate-compliance.png',
                        name: 'Compliance Certificate'
                    }];
                }
                // 4. Audit Checklist
                else if (messageLower.includes('audit checklist') || messageLower === 'audit checklist') {
                    hasPredefinedResponse = true;
                    botResponse = 'CSR Audit Checklist';
                    responseType = 'ppc-image';
                    dropdownItems = [{
                        id: 'audit-checklist-img',
                        text: 'Audit Checklist',
                        image: 'assets/modules-image/audit-checklist.png',
                        name: 'Audit Checklist'
                    }];
                }
                // 5. CSR Equipment Handling
                else if (messageLower.includes('csr equipment handling') || messageLower === 'csr equipment handling' || messageLower.includes('equipment handling')) {
                    hasPredefinedResponse = true;
                    botResponse = 'CSR Equipment Handling:';
                    responseType = 'dropdown';
                    dropdownItems = [
                        {
                            id: 'equipment-1',
                            text: 'Smoke Detector and Fire Alarm'
                        },
                        {
                            id: 'equipment-2',
                            text: 'Fire Hose Reel Systems'
                        },
                        {
                            id: 'equipment-3',
                            text: 'Emergency Light and Exit'
                        },
                        {
                            id: 'equipment-4',
                            text: 'Fire Extinguishers'
                        },
                        {
                            id: 'equipment-5',
                            text: 'Sensor Humidity and Temperature'
                        }
                    ];
                }
            }

            // Production PA specific responses
            if (botId === 'productions-bot') {
                const messageLower = message.toLowerCase().trim();

                // 1. Plan production schedule
                if (messageLower.includes('plan production schedule') || messageLower === 'plan production schedule' || messageLower.includes('production schedule')) {
                    hasPredefinedResponse = true;
                    botResponse = '📅 Production Schedule Planning\n\n✅ Status: Initiated\n📊 Current Capacity: 85%\n⏰ Available Time Slots: Ready for scheduling\n\nNext Steps:\n• Review current production load\n• Allocate resources\n• Set timeline targets';
                }
                // 2. Track inventory levels
                else if (messageLower.includes('track inventory levels') || messageLower === 'track inventory levels' || messageLower.includes('inventory levels')) {
                    hasPredefinedResponse = true;
                    botResponse = '📦 Inventory Tracking Status\n\n📊 Current Stock Levels:\n• Raw Materials: 72%\n• Finished Goods: 68%\n• Work in Progress: 45%\n\n⚠️ Alert: Raw materials below optimal level (80%)';
                }
                // 3. Optimize workflow
                else if (messageLower.includes('optimize workflow') || messageLower === 'optimize workflow' || messageLower.includes('workflow')) {
                    hasPredefinedResponse = true;
                    botResponse = '⚙️ Workflow Optimization Analysis\n\n✅ Analysis Complete\n\n💡 Recommendations:\n• Reduce setup time by 15%\n• Improve material flow efficiency by 22%\n• Optimize machine utilization\n\n📈 Expected Impact: +18% overall efficiency';
                }
                // 4. Monitor quality metrics
                else if (messageLower.includes('monitor quality metrics') || messageLower === 'monitor quality metrics' || messageLower.includes('quality metrics')) {
                    hasPredefinedResponse = true;
                    botResponse = '📊 Quality Metrics Monitoring\n\n📈 Current Metrics:\n• Defect Rate: 2.3%\n• First Pass Yield: 97.7%\n• Customer Satisfaction: 94.5%\n\n✅ Status: All metrics within acceptable range\n🎯 Target: Maintain current performance';
                }
                // 5. Production Status
                else if (messageLower.includes('production status') || messageLower === 'production status') {
                    hasPredefinedResponse = true;
                    botResponse = '🏭 Production Status Overview\n\n📋 Current Status:\n• Active Lines: 8/10\n• Efficiency: 87%\n• On-time Delivery: 92%\n• Current Output: 1,250 units/day\n\n✅ Production running smoothly';
                }
            }

            // Sale PA specific responses
            if (botId === 'sale-bot') {
                const messageLower = message.toLowerCase().trim();

                // 1. Sale Order Update Status
                if (messageLower.includes('sale order update status') || messageLower === 'sale order update status' || messageLower.includes('order update status') || messageLower.includes('sale order')) {
                    hasPredefinedResponse = true;
                    botResponse = '📋 Sale Order Status Update\n\n📦 Order Details:\n• Order #SO-2024-001: ✅ Shipped\n• Order #SO-2024-002: ⚙️ In Production\n• Order #SO-2024-003: ⏳ Pending Payment\n• Order #SO-2024-004: ✅ Delivered\n\n📊 Summary: 2 completed, 1 in progress, 1 pending';
                }
                // 2. Buyer Replied
                else if (messageLower.includes('buyer replied') || messageLower === 'buyer replied' || messageLower.includes('buyer reply')) {
                    hasPredefinedResponse = true;
                    botResponse = '💬 Buyer Response Received\n\n👤 Buyer: ABC Corporation\n📝 Message: Requesting sample approval\n🔴 Priority: High\n⏰ Response Time: Within 24 hours\n\n✅ Action Required: Review and respond';
                }
                // 3. Quotation update
                else if (messageLower.includes('quotation update') || messageLower === 'quotation update' || messageLower.includes('quotation')) {
                    hasPredefinedResponse = true;
                    botResponse = '📄 Quotation Update\n\n📋 Updated Quotations:\n• #QT-2024-015: Updated pricing\n• #QT-2024-016: Revised delivery terms\n• #QT-2024-017: New product added\n\n⏳ Status: Pending buyer approval\n📅 Review deadline: 3 business days';
                }
                // 4. You got 3 email to replied
                else if (messageLower.includes('you got 3 email to replied') || messageLower === 'you got 3 email to replied' || messageLower.includes('3 email') || messageLower.includes('email to reply')) {
                    hasPredefinedResponse = true;
                    botResponse = '📧 You have 3 emails to reply\n\n1️⃣ From: Buyer XYZ Ltd\n   Subject: Order inquiry\n   Priority: Medium\n\n2️⃣ From: Customer ABC Corp\n   Subject: Delivery schedule\n   Priority: High\n\n3️⃣ From: Partner DEF Inc\n   Subject: Price negotiation\n   Priority: Medium\n\n⏰ Please respond within 24 hours';
                }
                // 5. Customer Factory Visit
                else if (messageLower.includes('customer factory visit') || messageLower === 'customer factory visit' || messageLower.includes('factory visit')) {
                    hasPredefinedResponse = true;
                    botResponse = '🏭 Customer Factory Visit Scheduled\n\n👥 Customer: Global Textiles Inc\n📅 Date: Next Friday, 10:00 AM\n👤 Attendees: 5 people\n🎯 Purpose: Quality inspection\n✅ Status: Confirmed\n\n📋 Preparation checklist sent';
                }
            }

            // QMS PA specific responses
            if (botId === 'qms-bot') {
                const messageLower = message.toLowerCase().trim();

                // 1. High Defect Rate Inspection
                if (messageLower.includes('hight defect rate inspection') || messageLower === 'hight defect rate inspection' || messageLower.includes('high defect rate') || messageLower.includes('defect rate inspection')) {
                    hasPredefinedResponse = true;
                    botResponse = '⚠️ High Defect Rate Inspection Alert\n\n📊 Current Status:\n• Defect Rate: 3.8% (Threshold: 2.5%)\n• Status: ⚠️ Above threshold\n• Affected Line: Line 4\n• Defect Type: Stitching issues\n\n🔧 Action Required:\n• Immediate inspection\n• Corrective measures needed\n• Root cause analysis\n\n📅 Scheduled Inspection: Today, 2:00 PM';
                }
                // 2. Third party schedule
                else if (messageLower.includes('thirt party schedule') || messageLower === 'thirt party schedule' || messageLower.includes('third party schedule') || messageLower.includes('third party')) {
                    hasPredefinedResponse = true;
                    botResponse = '🔍 Third Party Audit Schedule\n\n👤 Auditor: SGS Certification Services\n📅 Date: Next Monday, 9:00 AM\n📋 Type: ISO 9001:2015 Audit\n⏱️ Duration: 3 days\n\n📊 Preparation Status:\n• Progress: 85% complete\n• Documents: ✅ Ready\n• Team briefing: Scheduled\n\n✅ All systems ready for audit';
                }
                // 3. Buyer Visit
                else if (messageLower.includes('buyer visit') || messageLower === 'buyer visit') {
                    hasPredefinedResponse = true;
                    botResponse = '👥 Buyer Visit Scheduled\n\n🏢 Buyer: Fashion Retail Group\n📅 Date: This Thursday, 11:00 AM\n👤 Attendees: 3 representatives\n🎯 Purpose: Quality assessment and factory tour\n\n📋 Focus Areas:\n• Production process\n• Quality control\n• Compliance standards\n\n✅ Status: Confirmed';
                }
                // 4. Pre Production Meeting Schedule
                else if (messageLower.includes('pre production meeting schedule') || messageLower === 'pre production meeting schedule' || messageLower.includes('pre production meeting') || messageLower.includes('pre-production meeting')) {
                    hasPredefinedResponse = true;
                    botResponse = '📅 Pre-Production Meeting Schedule\n\n📋 Meeting Details:\n• Style: #2024-015 Pre-Production Review\n• Date: Tomorrow, 2:00 PM\n• Location: Conference Room A\n\n👥 Attendees:\n• Production Team\n• QA Team\n• Merchandising Team\n\n📝 Agenda:\n• Quality standards review\n• Production timeline\n• Resource allocation\n\n✅ Status: Scheduled';
                }
                // 5. You got 4 email to replied
                else if (messageLower.includes('you got 4 email to replied') || messageLower === 'you got 4 email to replied' || messageLower.includes('4 email') || messageLower.includes('email to reply')) {
                    hasPredefinedResponse = true;
                    botResponse = '📧 You have 4 emails to reply\n\n1️⃣ From: Quality Auditor\n   Subject: Audit report review\n   Priority: High\n\n2️⃣ From: Buyer QA Team\n   Subject: Sample approval request\n   Priority: High\n\n3️⃣ From: Supplier\n   Subject: Material quality certificate\n   Priority: Medium\n\n4️⃣ From: Internal QA\n   Subject: Defect analysis report\n   Priority: High\n\n⏰ Please respond within 24 hours';
                }
            }

            // Social PA specific responses
            if (botId === 'social-bot') {
                const messageLower = message.toLowerCase().trim();

                // 1. TikTok Comment
                if (messageLower.includes('tiktok comment') || messageLower === 'tiktok comment' || messageLower.includes('tiktok')) {
                    hasPredefinedResponse = true;
                    botResponse = '💬 Comment Statistics\n\n📊 Overview:\n• New Comments: 12\n• Pending Replies: 5\n• Engagement Rate: +15% this week\n• Response Time: Average 2 hours\n\n💭 Latest Comment:\n"Love this product! When will it be available?"\n\n✅ Action: Reply pending';
                    responseType = 'social-media';
                    dropdownItems = [{
                        id: 'tiktok-icon',
                        platform: 'TikTok',
                        iconUrl: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=64'
                    }];
                }
                // 2. Facebook Comment
                else if (messageLower.includes('facebook comment') || messageLower === 'facebook comment' || messageLower.includes('facebook')) {
                    hasPredefinedResponse = true;
                    botResponse = '💬 Comment Statistics\n\n📊 Overview:\n• New Comments: 28\n• Pending Replies: 8\n• Engagement Rate: +22% this week\n• Response Time: Average 3 hours\n\n💭 Latest Comment:\n"Great quality! Highly recommend!"\n\n✅ Action: Reply pending';
                    responseType = 'social-media';
                    dropdownItems = [{
                        id: 'facebook-icon',
                        platform: 'Facebook',
                        iconUrl: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64'
                    }];
                }
                // 3. YouTube Comment
                else if (messageLower.includes('youtube comment') || messageLower === 'youtube comment' || messageLower.includes('youtube')) {
                    hasPredefinedResponse = true;
                    botResponse = '💬 Comment Statistics\n\n📊 Overview:\n• New Comments: 45\n• Pending Replies: 12\n• Engagement Rate: +18% this week\n• Response Time: Average 4 hours\n\n💭 Latest Comment:\n"Excellent video! Very informative."\n\n✅ Action: Reply pending';
                    responseType = 'social-media';
                    dropdownItems = [{
                        id: 'youtube-icon',
                        platform: 'YouTube',
                        iconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64'
                    }];
                }
                // 4. Instagram Comment
                else if (messageLower.includes('instagram comment') || messageLower === 'instagram comment' || messageLower.includes('instagram')) {
                    hasPredefinedResponse = true;
                    botResponse = '💬 Comment Statistics\n\n📊 Overview:\n• New Comments: 67\n• Pending Replies: 15\n• Engagement Rate: +25% this week\n• Response Time: Average 2.5 hours\n\n💭 Latest Comment:\n"Beautiful design! Where can I buy this?"\n\n✅ Action: Reply pending';
                    responseType = 'social-media';
                    dropdownItems = [{
                        id: 'instagram-icon',
                        platform: 'Instagram',
                        iconUrl: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64'
                    }];
                }
                // 5. LinkedIn Comment
                else if (messageLower.includes('linkedin comment') || messageLower === 'linkedin comment' || messageLower.includes('linkedin')) {
                    hasPredefinedResponse = true;
                    botResponse = '💬 Comment Statistics\n\n📊 Overview:\n• New Comments: 19\n• Pending Replies: 6\n• Engagement Rate: +12% this week\n• Response Time: Average 5 hours\n\n💭 Latest Comment:\n"Impressive company growth! Congratulations!"\n\n✅ Action: Reply pending';
                    responseType = 'social-media';
                    dropdownItems = [{
                        id: 'linkedin-icon',
                        platform: 'LinkedIn',
                        iconUrl: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=64'
                    }];
                }
            }

            // YTM PA specific responses
            if (botId === 'ytm-bot') {
                const messageLower = message.toLowerCase().trim();

                // 1. Dashboard Analytics
                if (messageLower.includes('dashboard analytics') || messageLower === 'dashboard analytics' || messageLower.includes('dashboard') || messageLower.includes('analytics')) {
                    hasPredefinedResponse = true;
                    botResponse = '📊 Dashboard Analytics\n\nKey metrics and performance overview';
                    responseType = 'ytm-image';
                    dropdownItems = [{
                        id: 'dashboard-analytics',
                        image: '/assets/bot-images/dashboard-analytics.png',
                        name: 'Dashboard Analytics'
                    }];
                }
                // 2. Repair Machine Status
                else if (messageLower.includes('repair machine status') || messageLower === 'repair machine status' || messageLower.includes('repair machine') || messageLower.includes('machine repair')) {
                    hasPredefinedResponse = true;
                    botResponse = '🔧 Repair Machine Status\n\nActive: 1 | Completed: 3 | Pending: 2';
                }
                // 3. Maintenance Schedule
                else if (messageLower.includes('maintenance schedule') || messageLower === 'maintenance schedule' || messageLower.includes('maintenance') || messageLower.includes('schedule')) {
                    hasPredefinedResponse = true;
                    botResponse = '📅 Maintenance Schedule\n\nThis week: 3 scheduled | Next week: 5 scheduled';
                    responseType = 'ytm-image';
                    dropdownItems = [{
                        id: 'maintenance-schedule',
                        image: '/assets/bot-images/maintenance-schedule.png',
                        name: 'Maintenance Schedule'
                    }];
                }
                // 4. Late Maintenance Alert
                else if (messageLower.includes('late maintenance alert') || messageLower === 'late maintenance alert' || messageLower.includes('late maintenance') || messageLower.includes('maintenance alert')) {
                    hasPredefinedResponse = true;
                    botResponse = '⚠️ Late Maintenance Alert\n\n3 machines require immediate attention';
                }
                // 5. Machine Invoice
                else if (messageLower.includes('machine invoice') || messageLower === 'machine invoice' || messageLower.includes('invoice')) {
                    hasPredefinedResponse = true;
                    botResponse = '📄 Machine Invoice\n\nTotal paid: $2,500 | Pending: $5,000';
                    responseType = 'ytm-image';
                    dropdownItems = [{
                        id: 'machine-invoice',
                        image: '/assets/bot-images/machine-invoice.png',
                        name: 'Machine Invoice'
                    }];
                }
            }

            // Check if we should use Gemini API (ONLY when no predefined response found)
            const isDefaultResponse = botResponse === `Hello! I'm ${bot.name}. You asked: "${message}". ${bot.description}. How can I help you today?`;
            
            // Allow all bots to hit Gemini if there's no predefined response.
            // If they are specific module agents (Admin, Finance, HR, CSR) but the user has NO module selected, 
            // that means it's a general question, so use generateDirectGeminiResponse.
            if (!hasPredefinedResponse && (isDefaultResponse || shouldUseGemini(message, hasPredefinedResponse))) {
                try {
                    const isGeneralQuestion = 
                        (botId === 'admin-bot' && !adminPAModule) ||
                        (botId === 'finance-bot' && !financePAModule) ||
                        (botId === 'hr-bot' && !hrPAModule) ||
                        (botId === 'csr-bot' && !csrPAModule);
                    
                    let aiResponse;
                    if (isGeneralQuestion || message.includes("[IMAGE_DATA:")) {
                        aiResponse = await generateDirectGeminiResponse(
                            message,
                            bot.name,
                            bot.description,
                            chatHistoryForGemini
                        );
                    } else {
                        aiResponse = await generateGeminiResponse(
                            message,
                            bot.name,
                            bot.description,
                            chatHistoryForGemini,
                            { module: adminPAModule || financePAModule || hrPAModule || csrPAModule }
                        );
                    }
                    botResponse = aiResponse;
                } catch (error) {
                    console.error('Error calling AI API:', error);
                    // Keep the default response if API fails
                }
            }


            // For special response types (buttons, dropdowns, images), show instantly
            // For regular text responses, use streaming effect
            if (responseType === 'button' || responseType === 'dropdown' || responseType === 'invoice-list' || 
                responseType === 'invoice-image' || responseType === 'ppc-image' || responseType === 'ytm-image' || 
                responseType === 'social-media') {
                // Show special responses instantly (no streaming)
                setBotStates(prev => {
                    const botState = prev[botId];
                    const messageObj = { from: 'bot', text: botResponse };
                    if (responseType === 'button' && buttonText) {
                        messageObj.type = 'button';
                        messageObj.buttonText = buttonText;
                    } else if (responseType === 'dropdown' && dropdownItems) {
                        messageObj.type = 'dropdown';
                        messageObj.dropdownItems = dropdownItems;
                    } else if (responseType === 'invoice-list' && dropdownItems) {
                        messageObj.type = 'invoice-list';
                        messageObj.dropdownItems = dropdownItems;
                    } else if (responseType === 'invoice-image' && dropdownItems && dropdownItems[0]) {
                        messageObj.type = 'invoice-image';
                        messageObj.imageUrl = dropdownItems[0].image;
                        messageObj.invoiceName = dropdownItems[0].text;
                    } else if (responseType === 'ppc-image' && dropdownItems && dropdownItems[0]) {
                        messageObj.type = 'ppc-image';
                        messageObj.imageUrl = dropdownItems[0].image;
                        messageObj.imageName = dropdownItems[0].name || dropdownItems[0].text;
                    } else if (responseType === 'ytm-image' && dropdownItems && dropdownItems[0]) {
                        messageObj.type = 'ytm-image';
                        messageObj.imageUrl = dropdownItems[0].image;
                        messageObj.imageName = dropdownItems[0].name || dropdownItems[0].text;
                    } else if (responseType === 'social-media' && dropdownItems && dropdownItems[0]) {
                        messageObj.type = 'social-media';
                        messageObj.iconUrl = dropdownItems[0].iconUrl;
                        messageObj.platform = dropdownItems[0].platform;
                    }
                    const updatedMessages = [...botState.messages, messageObj];

                    // Update chat in history if currentChatId exists
                    if (botState.currentChatId) {
                        const firstUserMessage = updatedMessages.find(m => m.from === 'user');
                        const updatedHistory = botState.chatHistory.map(chat => {
                            if (chat.id === botState.currentChatId) {
                                return {
                                    ...chat,
                                    messages: updatedMessages,
                                    title: firstUserMessage?.text?.substring(0, 50) || 'New Chat',
                                    updatedAt: new Date().toISOString()
                                };
                            }
                            return chat;
                        });

                        return {
                            ...prev,
                            [botId]: {
                                ...prev[botId],
                                messages: updatedMessages,
                                isTyping: false,
                                chatHistory: updatedHistory
                            }
                        };
                    }

                    return {
                        ...prev,
                        [botId]: {
                            ...prev[botId],
                            messages: updatedMessages,
                            isTyping: false
                        }
                    };
                });
            } else {
                // Use streaming for regular text responses
                streamBotResponse(botId, botResponse);
            }
        }, 1000 + Math.random() * 500);
    };

    const handleInputChange = (botId, value) => {
        setBotStates(prev => ({
            ...prev,
            [botId]: {
                ...prev[botId],
                input: value
            }
        }));
    };

    const handleNewChat = (botId) => {
        createNewChat(botId);
    };

    // Reset module selection functions for Menu button
    const resetAdminPAModule = () => {
        // Reset module state first
        setAdminPAModule(null);
        setAdminPAUsedActions({
            purchase: [],
            support_ticket: [],
            shop: [],
            gatepass: [],
            car_booking: []
        });
        // Clear messages and reset chat to show module selection screen
        setBotStates(prev => {
            const botState = prev['admin-bot'];
            if (!botState) return prev;
            return {
                ...prev,
                'admin-bot': {
                    ...botState,
                    messages: [],
                    input: '',
                    isTyping: false,
                    currentChatId: null
                }
            };
        });
    };

    const resetFinancePAModule = () => {
        // Reset module state first
        setFinancePAModule(null);
        setFinancePAUsedActions({ accounts: [] });
        // Clear messages and reset chat to show module selection screen
        setBotStates(prev => {
            const botState = prev['finance-bot'];
            if (!botState) return prev;
            return {
                ...prev,
                'finance-bot': {
                    ...botState,
                    messages: [],
                    input: '',
                    isTyping: false,
                    currentChatId: null
                }
            };
        });
    };

    const resetCsrPAModule = () => {
        // Reset module state first
        setCsrPAModule(null);
        setCsrPAUsedActions({ csr: [], air: [], electricity: [], water: [], waste_management: [] });
        // Clear messages and reset chat to show module selection screen
        setBotStates(prev => {
            const botState = prev['csr-bot'];
            if (!botState) return prev;
            return {
                ...prev,
                'csr-bot': {
                    ...botState,
                    messages: [],
                    input: '',
                    isTyping: false,
                    currentChatId: null
                }
            };
        });
    };

    const resetHrPAModule = () => {
        // Reset module state first
        setHrPAModule(null);
        setHrPAUsedActions({ hr: [], training: [] });
        // Clear messages and reset chat to show module selection screen
        setBotStates(prev => {
            const botState = prev['hr-bot'];
            if (!botState) return prev;
            return {
                ...prev,
                'hr-bot': {
                    ...botState,
                    messages: [],
                    input: '',
                    isTyping: false,
                    currentChatId: null
                }
            };
        });
    };

    // Check scroll position
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const maxScroll = scrollWidth - clientWidth;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < maxScroll - 10);
            // Calculate scroll progress (0 to 100)
            const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, progress)));

            // Calculate thumb width and position for custom scrollbar
            if (scrollbarTrackRef.current && scrollWidth > clientWidth) {
                const trackWidth = scrollbarTrackRef.current.offsetWidth;
                const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
                const maxThumbPosition = trackWidth - (trackWidth * thumbWidthPercent / 100);
                const thumbPos = (progress / 100) * maxThumbPosition;

                setThumbWidth(Math.max(60, trackWidth * thumbWidthPercent / 100));
                setThumbPosition(thumbPos);
            } else {
                setThumbWidth(100);
                setThumbPosition(0);
            }
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            // Check on resize
            window.addEventListener('resize', checkScrollPosition);
            // Initial calculation after a short delay to ensure DOM is ready
            setTimeout(checkScrollPosition, 100);
            return () => {
                container.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            };
        }
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    // Handle custom scrollbar drag
    const handleScrollbarMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const track = scrollbarTrackRef.current;
        if (!track || !scrollContainerRef.current) return;

        const trackRect = track.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const trackWidth = track.offsetWidth;
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;

        // Calculate scroll position based on click
        const scrollPercent = clickX / trackWidth;
        const targetScroll = scrollPercent * maxScroll;

        scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    };

    const handleScrollbarThumbMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);

        const startX = e.clientX;
        const startScrollLeft = scrollContainerRef.current?.scrollLeft || 0;
        const track = scrollbarTrackRef.current;
        if (!track || !scrollContainerRef.current) return;

        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const trackWidth = track.offsetWidth;
        const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
        const maxThumbPosition = trackWidth - (trackWidth * thumbWidthPercent / 100);

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPercent = (deltaX / maxThumbPosition) * 100;
            const newScrollPercent = (startScrollLeft / maxScroll) * 100 + deltaPercent;
            const targetScroll = Math.max(0, Math.min(maxScroll, (newScrollPercent / 100) * maxScroll));

            scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className={`fixed inset-0 z-[200] flex flex-col overflow-hidden transition-all duration-300 ease-out ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
            style={{
                animation: isClosing ? 'none' : 'fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                /* Custom Scrollbar Styling - Always Visible and Interactive */
                .custom-scrollbar {
                    overflow-x: scroll !important;
                    overflow-y: hidden !important;
                    scrollbar-width: auto !important;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    height: 20px !important;
                    display: block !important;
                    -webkit-appearance: none;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.9) !important;
                    border-radius: 12px;
                    margin: 0 10px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4) !important;
                    border-radius: 12px;
                    border: 3px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    min-width: 80px;
                    cursor: pointer;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(90deg, #7c3aed, #2563eb, #0891b2) !important;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
                    cursor: grab;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(90deg, #6d28d9, #1d4ed8, #0e7490) !important;
                    cursor: grabbing;
                }
                
                /* Firefox scrollbar */
                .custom-scrollbar {
                    scrollbar-width: auto !important;
                    scrollbar-color: #8b5cf6 rgba(255, 255, 255, 0.9) !important;
                }
                
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
                
                /* Table container wrapper - scrollable horizontally to see all columns (left/right) */
                .table-container-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 100%;
                    background: white;
                    overflow-x: auto !important;
                    overflow-y: visible;
                    -webkit-overflow-scrolling: touch;
                    scroll-behavior: smooth;
                }
                
                /* Custom scrollbar for table container - always visible and easy to use */
                .table-container-wrapper::-webkit-scrollbar {
                    height: 14px;
                    display: block !important;
                    -webkit-appearance: none;
                }
                
                .table-container-wrapper::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 8px;
                    margin: 6px 10px;
                    border: 1px solid #e2e8f0;
                    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
                }
                
                .table-container-wrapper::-webkit-scrollbar-thumb {
                    background: linear-gradient(90deg, #3b82f6, #2563eb, #1e40af);
                    border-radius: 8px;
                    border: 2px solid #f1f5f9;
                    min-width: 60px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                
                .table-container-wrapper::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(90deg, #2563eb, #1d4ed8, #1e3a8a);
                    border: 2px solid #e2e8f0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .table-container-wrapper::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(90deg, #1e40af, #1e3a8a, #1e3a8a);
                }
                
                /* Firefox scrollbar */
                .table-container-wrapper {
                    scrollbar-width: auto;
                    scrollbar-color: #3b82f6 #f1f5f9;
                }
                
                .markdown-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                    background: white;
                }
                
                .markdown-content .data-table {
                    min-width: 600px;
                    width: auto;
                }
                
                /* Ensure table can expand beyond container width for scrolling */
                .markdown-content .data-table {
                    table-layout: auto;
                }
                
                .markdown-content table th {
                    font-weight: 700;
                    text-align: left;
                    background: #f9fafb;
                    color: #111827;
                    border-bottom: 1px solid #e5e7eb;
                    border-right: none !important;
                    border-left: none !important;
                    border-top: none !important;
                }
                
                .markdown-content table td,
                .markdown-content table th {
                    padding: 12px 16px;
                    border-bottom: 1px solid #e5e7eb;
                    border-right: none !important;
                    border-left: none !important;
                    border-top: none !important;
                    vertical-align: middle;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    white-space: normal;
                    max-width: none;
                    line-height: 1.5;
                    background: white;
                    color: #374151;
                    font-weight: 400;
                }
                
                /* Ensure table cells don't shrink and hide content */
                .markdown-content table td {
                    min-width: fit-content;
                }
                
                /* Clean white background for all rows (like the example) */
                .markdown-content table tbody tr {
                    background-color: #ffffff;
                }
                
                /* Remove any outer border from table */
                .markdown-content table {
                    border: none !important;
                }
                
                /* Card-like container with rounded corners and subtle shadow */
                .markdown-content .table-container-wrapper {
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    background: white;
                    border: none !important;
                }
                
                /* Remove any borders from the table itself */
                .markdown-content .data-table {
                    border: none !important;
                }
                
                /* Responsive adjustments - maintain horizontal scrolling on all devices */
                @media (max-width: 768px) {
                    .table-container-wrapper {
                        border-radius: 10px;
                    }
                    
                    .markdown-content .data-table {
                        min-width: 500px;
                    }
                    
                    .markdown-content table th,
                    .markdown-content table td {
                        padding: 12px 14px;
                        font-size: 0.8125rem;
                    }
                    
                    .table-container-wrapper::-webkit-scrollbar {
                        height: 12px;
                    }
                }
                
                @media (max-width: 640px) {
                    .markdown-content .data-table {
                        min-width: 450px;
                    }
                    
                    .markdown-content table th,
                    .markdown-content table td {
                        padding: 10px 12px;
                        font-size: 0.8125rem;
                    }
                    
                    .table-container-wrapper::-webkit-scrollbar {
                        height: 12px;
                    }
                }
                
                @media (max-width: 480px) {
                    .table-container-wrapper {
                        -webkit-overflow-scrolling: touch;
                        scroll-behavior: smooth;
                    }
                    
                    .markdown-content .data-table {
                        min-width: 400px;
                    }
                    
                    .markdown-content table th,
                    .markdown-content table td {
                        padding: 10px 10px;
                        font-size: 0.75rem;
                    }
                    
                    .table-container-wrapper::-webkit-scrollbar {
                        height: 10px;
                    }
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

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 transition-colors duration-300"></div>

            {/* Back Button - Top Left — Yai Blue (Agent Collective context) */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-yai-blue/80 hover:bg-yai-blue text-white rounded-lg backdrop-blur-sm transition-colors font-medium shadow-lg pointer-events-auto"
            >
                <ChevronRight size={18} className="rotate-180" /> Back
            </button>

            {/* Yai Data Header with Dropdown - Top Left */}
            <div className="absolute top-4 left-32 z-50 pointer-events-none">
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
                    .bot-icon-container-modules {
                        position: relative;
                        animation: float 3s ease-in-out infinite;
                    }
                    .bot-icon-glow-modules {
                        animation: pulse-glow 2s ease-in-out infinite;
                    }
                    /* One ring — hugs the 64px logo with 2px clearance, three
                       sides solid yai-blue + one transparent to give the
                       continuous spinning highlight. That's it. */
                    .rotating-ring-modules {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 68px;
                        height: 68px;
                        border: 2.5px solid #1E4DAA;
                        border-bottom-color: transparent;
                        border-radius: 50%;
                        animation: rotate-ring 1.6s linear infinite;
                        pointer-events: none;
                        z-index: 5;
                        box-shadow: 0 0 10px rgba(30, 77, 170, 0.5);
                    }
                    .sparkle-modules {
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: white;
                        border-radius: 50%;
                        animation: sparkle 2s ease-in-out infinite;
                    }
                    .sparkle-1-modules { top: 10%; left: 20%; animation-delay: 0s; }
                    .sparkle-2-modules { top: 20%; right: 15%; animation-delay: 0.5s; }
                    .sparkle-3-modules { bottom: 15%; left: 25%; animation-delay: 1s; }
                    .sparkle-4-modules { bottom: 10%; right: 20%; animation-delay: 1.5s; }
                `}</style>
                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className={`relative ${isDropdownOpen ? '' : 'bot-icon-container-modules'}`}>
                        {/* Rotating Rings - Only show when dropdown is closed */}
                        {!isDropdownOpen && (
                            <>
                                <div className="rotating-ring-modules"></div>

                                {/* Sparkles - Only show when dropdown is closed */}
                                <div className="sparkle-modules sparkle-1-modules"></div>
                                <div className="sparkle-modules sparkle-2-modules"></div>
                                <div className="sparkle-modules sparkle-3-modules"></div>
                                <div className="sparkle-modules sparkle-4-modules"></div>
                            </>
                        )}

                        <button
                            onClick={() => setDropdownOpen(prev => !prev)}
                            className={`relative rounded-full hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 z-10 pointer-events-auto ${isDropdownOpen ? '' : 'bot-icon-glow-modules'}`}
                            aria-label="Yai Agents"
                        >
                            <img
                                src="/assets/modules-image/yai1.png"
                                alt="Yai Agents"
                                className="w-16 h-16 rounded-full object-cover border-2 border-yai-blue/60 relative z-10"
                            />
                            {/* Gradient Overlay - Yai Blue (Agent Collective context) */}
                            {!isDropdownOpen && (
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yai-blue/30 via-blue-400/20 to-yai-blue/30 mix-blend-screen pointer-events-none"></div>
                            )}
                        </button>
                    </div>
                    <span className={`text-yai-blue font-bold text-lg tracking-wide drop-shadow-sm pointer-events-auto ${isDropdownOpen ? '' : 'animate-pulse'}`}>
                        Yai Agents
                    </span>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && onVersionChange && (
                        <div
                            className="absolute top-full mt-2 left-0 w-72 bg-white/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl z-[60] pointer-events-auto"
                            style={{
                                animation: 'yaiDropdownReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
                                transformOrigin: 'top left',
                            }}
                        >
                            <style>{`
                                @keyframes yaiDropdownReveal {
                                    0%   { opacity: 0; transform: translateY(-8px) scale(0.96); }
                                    100% { opacity: 1; transform: translateY(0)    scale(1);    }
                                }
                                @keyframes yaiItemSlideIn {
                                    0%   { opacity: 0; transform: translateX(-14px); }
                                    100% { opacity: 1; transform: translateX(0);     }
                                }
                                .yai-menu-item { animation: yaiItemSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
                                @keyframes yaiPulseHint {
                                    0%, 100% { box-shadow: 0 0 0 0 rgba(30, 77, 170, 0); }
                                    50%      { box-shadow: 0 0 0 6px rgba(30, 77, 170, 0.15); }
                                }
                                @keyframes yaiPulseHintGreen {
                                    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                                    50%      { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.15); }
                                }
                            `}</style>
                            <ul className="p-2">
                                <li
                                    onClick={() => {
                                        onVersionChange('yai1');
                                        setDropdownOpen(false);
                                    }}
                                    style={{
                                        animationDelay: '0.35s',
                                        animation: 'yaiItemSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both, yaiPulseHint 2.2s ease-in-out 1.4s 3',
                                    }}
                                    className="yai-menu-item relative flex items-center justify-between gap-4 px-4 py-3 rounded-md hover:bg-yai-blue/15 cursor-pointer group transition-all border border-transparent hover:border-yai-blue/40"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="assets/modules-image/yai1.png"
                                            alt="Yai 1"
                                            className="w-14 h-14 rounded-full object-cover border-2 border-yai-blue/60 drop-shadow-[0_0_8px_rgba(30,77,170,0.7)] flex-shrink-0"
                                        />
                                        <span className="bg-gradient-to-r from-yai-blue via-blue-400 to-yai-blue bg-clip-text text-transparent font-bold text-lg drop-shadow-[0_0_4px_rgba(30,77,170,0.5)] whitespace-nowrap">Agent Collective</span>
                                    </div>
                                    <ChevronRight size={20} className="text-yai-blue/80 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                                </li>
                                <li
                                    onClick={() => {
                                        onVersionChange('yai2');
                                        setDropdownOpen(false);
                                    }}
                                    style={{
                                        animation: 'yaiItemSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both, yaiPulseHintGreen 2.2s ease-in-out 1.9s 3',
                                    }}
                                    className="yai-menu-item relative flex items-center justify-between gap-4 px-4 py-3 rounded-md hover:bg-gray-500/10 cursor-pointer group transition-all border border-transparent hover:border-gray-500/30"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="assets/modules-image/yai2.png"
                                            alt="Big Brain"
                                            className="w-14 h-14 rounded-full object-contain bg-slate-950/60 border-2 border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.6)] flex-shrink-0"
                                        />
                                        <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent font-bold text-lg drop-shadow-[0_0_4px_rgba(16,185,129,0.5)] whitespace-nowrap">Big Brain</span>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400/70 group-hover:text-gray-300 transition-colors flex-shrink-0" />
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                />
            )}

            {/* Horizontal Scrollable Phone Interfaces */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-x-scroll overflow-y-hidden scroll-smooth px-2 sm:px-4 pt-20 sm:pt-24 custom-scrollbar"
                    style={{
                        scrollbarGutter: 'stable',
                        WebkitOverflowScrolling: 'touch',
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom: 0
                    }}
                    onScroll={checkScrollPosition}
                >
                    <style>{`
                    .phone-frame {
                        width: 100%;
                        height: 100%;
                        min-height: 100%;
                        max-height: 100%;
                    }
                    @media (min-width: 1920px) {
                        .phone-frame {
                            width: 380px;
                            height: 100%;
                            min-height: 100%;
                            max-height: 100%;
                        }
                    }
                    @media (min-width: 1600px) and (max-width: 1919px) {
                        .phone-frame {
                            width: 340px;
                            height: 100%;
                            min-height: 100%;
                            max-height: 100%;
                        }
                    }
                    @media (min-width: 1280px) and (max-width: 1599px) {
                        .phone-frame {
                            width: 300px;
                            height: 100%;
                            min-height: 100%;
                            max-height: 100%;
                        }
                    }
                    @media (min-width: 1024px) and (max-width: 1279px) {
                        .phone-frame {
                            width: 280px;
                            height: 100%;
                            min-height: 100%;
                            max-height: 100%;
                        }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .phone-frame {
                            width: 260px;
                            height: 100%;
                            min-height: 100%;
                            max-height: 100%;
                        }
                    }
                    @media (max-width: 767px) {
                        .phone-frame {
                            width: 100%;
                            min-width: 240px;
                            max-width: 320px;
                            height: 100%;
                            min-height: 100%;
                            max-height: 100%;
                        }
                    }
                    .bot-container {
                        flex-shrink: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        height: 100%;
                        max-height: 100%;
                        justify-content: space-between;
                        overflow: visible;
                        padding-bottom: 0;
                    }
                    .phone-frame-wrapper {
                        flex: 1 1 auto;
                        display: flex;
                        align-items: stretch;
                        justify-content: center;
                        min-height: 0;
                        width: 100%;
                        overflow: hidden;
                    }
                    .phone-frame-wrapper .phone-frame {
                        height: 100% !important;
                        max-height: 100% !important;
                    }
                `}</style>
                    <div className="flex gap-2 sm:gap-4 md:gap-6 items-stretch justify-start w-max h-full min-h-full flex-1">
                        {PREDEFINED_BOTS.map((bot) => {
                            const botState = botStates[bot.id];
                            return (
                                <div
                                    key={bot.id}
                                    className="bot-container"
                                >
                                    {/* Phone Frame Wrapper */}
                                    <div className="phone-frame-wrapper">
                                        <PhoneFrame
                                            key={`phoneframe-${bot.id}-${botLanguages[bot.id]?.code || 'en'}`}
                                            bot={bot}
                                            messages={botState.messages}
                                            onSendMessage={(msg) => handleSendMessage(bot.id, msg)}
                                            onPostBotMessage={(message) => setBotStates(prev => {
                                                const bs = prev[bot.id];
                                                if (!bs) return prev;
                                                return { ...prev, [bot.id]: { ...bs, messages: [...bs.messages, message] } };
                                            })}
                                            onUpdateBotMessage={(messageIdx, updater) => setBotStates(prev => {
                                                const bs = prev[bot.id];
                                                if (!bs) return prev;
                                                const messages = bs.messages.map((m, i) => i === messageIdx ? updater(m) : m);
                                                return { ...prev, [bot.id]: { ...bs, messages } };
                                            })}
                                            inputValue={botState.input}
                                            setInputValue={(value) => handleInputChange(bot.id, value)}
                                            isTyping={botState.isTyping}
                                            onNewChat={() => handleNewChat(bot.id)}
                                            chatHistory={botState.chatHistory || []}
                                            onLoadChat={(chatId) => loadChat(bot.id, chatId)}
                                            onDeleteChat={(chatId) => deleteChat(bot.id, chatId)}
                                            currentChatId={botState.currentChatId}
                                            botId={bot.id}
                                            adminPAModule={bot.id === 'admin-bot' ? adminPAModule : null}
                                            adminPAModules={bot.id === 'admin-bot' ? adminPAModules : null}
                                            adminPAUsedActions={bot.id === 'admin-bot' ? adminPAUsedActions : null}
                                            onMarkActionUsed={bot.id === 'admin-bot' ? markActionAsUsed : null}
                                            financePAModule={bot.id === 'finance-bot' ? financePAModule : null}
                                            financePAModules={bot.id === 'finance-bot' ? financePAModules : null}
                                            financePAUsedActions={bot.id === 'finance-bot' ? financePAUsedActions : null}
                                            onMarkFinanceActionUsed={bot.id === 'finance-bot' ? markFinanceActionAsUsed : null}
                                            csrPAModule={bot.id === 'csr-bot' ? csrPAModule : null}
                                            csrPAModules={bot.id === 'csr-bot' ? csrPAModules : null}
                                            csrPAUsedActions={bot.id === 'csr-bot' ? csrPAUsedActions : null}
                                            onMarkCsrActionUsed={bot.id === 'csr-bot' ? markCsrActionAsUsed : null}
                                            hrPAModule={bot.id === 'hr-bot' ? hrPAModule : null}
                                            hrPAModules={bot.id === 'hr-bot' ? hrPAModules : null}
                                            hrPAUsedActions={bot.id === 'hr-bot' ? hrPAUsedActions : null}
                                            onMarkHrActionUsed={bot.id === 'hr-bot' ? markHrActionAsUsed : null}
                                            onResetAdminPAModule={bot.id === 'admin-bot' ? resetAdminPAModule : null}
                                            onResetFinancePAModule={bot.id === 'finance-bot' ? resetFinancePAModule : null}
                                            onResetCsrPAModule={bot.id === 'csr-bot' ? resetCsrPAModule : null}
                                            onResetHrPAModule={bot.id === 'hr-bot' ? resetHrPAModule : null}
                                            botLanguage={botLanguages[bot.id]}
                                            languages={languages}
                                            onUpdateBotLanguage={updateBotLanguage}
                                            onShowInvoice={(item) => {
                                                // Directly add invoice image message
                                                setBotStates(prev => {
                                                    const botState = prev[bot.id];
                                                    if (!botState) return prev;

                                                    const invoiceMessage = {
                                                        from: 'bot',
                                                        text: `Invoice: ${item.text}`,
                                                        type: 'invoice-image',
                                                        imageUrl: item.image,
                                                        invoiceName: item.text
                                                    };
                                                    const updatedMessages = [...botState.messages, invoiceMessage];
                                                    const updatedHistory = botState.currentChatId ? botState.chatHistory.map(chat =>
                                                        chat.id === botState.currentChatId ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() } : chat
                                                    ) : botState.chatHistory;

                                                    return {
                                                        ...prev,
                                                        [bot.id]: {
                                                            ...prev[bot.id],
                                                            messages: updatedMessages,
                                                            chatHistory: updatedHistory
                                                        }
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* Bot Name Label */}
                                    <div className="flex-shrink-0 text-center w-full px-2 py-1">
                                        <span className={`inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-gradient-to-r ${bot.bgGradient} text-white text-xs sm:text-sm font-semibold rounded-lg shadow-lg whitespace-nowrap border-2 border-white/30`}>
                                            {bot.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Footer Scrollbar */}
                <div className="flex-shrink-0 px-4 sm:px-8 py-2 bg-white/50 backdrop-blur-sm border-t border-gray-200">
                    <div
                        ref={scrollbarTrackRef}
                        className="relative w-full h-6 bg-white/80 rounded-full border-2 border-gray-300 shadow-inner cursor-pointer hover:bg-white/90 transition-colors"
                        onClick={handleScrollbarMouseDown}
                    >
                        <div
                            ref={scrollbarRef}
                            className="absolute top-0 h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full shadow-lg border-2 border-white cursor-grab active:cursor-grabbing transition-all hover:shadow-xl hover:scale-y-110"
                            style={{
                                left: `${thumbPosition}px`,
                                width: `${thumbWidth}px`,
                                minWidth: '60px'
                            }}
                            onMouseDown={handleScrollbarThumbMouseDown}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-8 h-1 bg-white/60 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BotModules;
