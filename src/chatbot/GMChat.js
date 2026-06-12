import React, { useState, useRef, useEffect } from 'react';
import { X, Bell, Mic, MessageSquare, Layers, Database, Sparkles, Send, ChevronRight } from 'lucide-react';
import { generateGeminiResponse } from './gemini-api';
import { KHMER_NEW_YEAR } from "../thems";
import { useKhmerTTS } from "./useKhmerTTS";
import { Volume2, VolumeX } from "lucide-react";

const GMChat = ({ onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const { speak, stop, isSpeaking } = useKhmerTTS();
    const [autoSpeak, setAutoSpeak] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateBotResponse = async (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        
        // Keep simple predefined responses for basic greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! How can I assist you today? I'm here to help with tasks, modules, data collection, and answer any questions you have about Yaikh platform or general topics.";
        } else if (lowerMessage.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Use Gemini API for all other queries - modules, general questions, website info, world information
        try {
            // Build comprehensive context about Yaikh platform and modules
            const yaikhContext = `You are Yai, an intelligent AI assistant for Yaikh (Yaikh.com), an AI platform developed by TexLink Technologies Co., Ltd.

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

ADMINISTRATION SECTION:
- Accountant: Purchase Request, E-Invoicing
- HR: YHR, Salary Bill, Org Chart, Training, Temp Work Request, Speak Up
- Admin: Support Ticket, Purchase Request, Y Shop (Stationery), Bill Record, Gate Pass, Meeting Room, My Car Booking, Fire Alarm, CCTV
- CSR: Digital Audit, Energy, Air, Water, Waste, Chemical
- E-GOV: E-GOVERNMENT

MANAGEMENT DASHBOARD:
- System Analysis

OPERATIONS SECTION:
- QA: YQMS, FC
- Production: Traffic Light, YTM, CE, YTM Shop
- DT Sync: DT Sync, Master Plan, Line Plan, PPM, TNA
- PRE PRO: TEC PACK, PPS, Sample
- Production Materials: Material Purchase

AI Assistant Bots (Yai 1 & Yai 2):
- Finance PA: Financial management, budgeting, accounting, purchase requests, invoices, payments
- Admin PA: Administrative operations, support tickets, food menu, car fuel tracking, security issues, job applications
- CSR PA: Corporate social responsibility, induction training, 6S reports, compliance certificates, audit checklists, equipment handling
- PPC PA: Production planning and control, order status, delay alerts, action items, supplier alerts, master plans, line plans
- Production PA: Production scheduling, inventory tracking, workflow optimization, quality metrics monitoring, production status
- Sale PA: Sales order management, buyer communications, quotations, email management, customer factory visits
- QMS PA: Quality management, defect inspections, third-party audits, buyer visits, pre-production meetings
- Social PA: Social media management for TikTok, Facebook, YouTube, Instagram, LinkedIn comments and engagement
- YTM PA: Yield to maturity tracking, machine maintenance schedules, repair status, late maintenance alerts, machine invoices, dashboard analytics

You can answer questions about:
1. Any Yaikh modules and their functions - provide detailed explanations
2. How to use the platform and navigate modules
3. General information and knowledge about any topic
4. Website-related questions about Yaikh
5. World information, current events, and general knowledge
6. Technical questions and explanations
7. Business and enterprise management topics
8. Any other questions users may have

Provide helpful, accurate, and professional responses. Be concise but informative. Use emojis appropriately for better readability. When answering about modules, be specific and helpful.`;

            // Get conversation history for context
            const chatHistory = messages.map(msg => ({
                from: msg.sender === 'user' ? 'user' : 'bot',
                text: msg.text
            }));

            // Generate response using Gemini API
            const geminiResponse = await generateGeminiResponse(
                userMessage,
                'Yai',
                yaikhContext,
                chatHistory
            );

            return geminiResponse;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Fallback response
            return `I understand you're asking about "${userMessage}". I'm having trouble processing that right now. Could you please rephrase your question or try again?`;
        }
    };

    // Helper function to parse and render markdown content (tables, formatting, etc.)
    const renderMarkdownContent = (text) => {
        if (!text) return { __html: '' };
        
        // More flexible table regex - matches tables with various formats
        // Pattern 1: Standard markdown table with separator line
        const tableRegex1 = /(\|[^\n\r]+\|[\r\n]+(?:\|[\s\-:]+\|[\r\n]+)(?:\|[^\n\r]+\|[\r\n]*)+)/g;
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
            const lines = match.split(/\r?\n/).filter(l => l.trim().includes('|'));
            if (lines.length >= 2 && !tables.some(t => t.content.includes(match))) {
                const tableId = `__TABLE_${tableIndex}__`;
                tables.push({ id: tableId, content: match });
                tableIndex++;
                return tableId;
            }
            return match; // Not a table, keep original
        });
        
        // Pattern 3: Convert numbered lists to tables (especially purchase requests, etc.)
        const numberedListRegex = /((?:^\d+\.\s+[^\n]+(?:\r?\n|$)){3,})/gm;
        processedText = processedText.replace(numberedListRegex, (match) => {
            const lines = match.trim().split(/\r?\n/).filter(l => l.trim());
            // Check if this looks like structured data (e.g., "1. Request #PR001: "Description"")
            // More lenient: check if most lines have a colon or hash symbol (indicating structured data)
            const structuredLines = lines.filter(line => {
                const trimmed = line.trim();
                return /^\d+\.\s+.+[#:].+/.test(trimmed) || /^\d+\.\s+Request\s+#/.test(trimmed) || /^\d+\.\s+.+:\s*/.test(trimmed);
            });
            const hasStructuredPattern = structuredLines.length >= Math.min(3, Math.max(1, lines.length * 0.5));
            
            // Also check if it's a simple numbered list (even without colons/hashes) with 5+ items
            const isLongList = lines.length >= 5;
            
            if ((hasStructuredPattern && lines.length >= 3) || (isLongList && hasStructuredPattern)) {
                // Try to extract structured data
                const rows = [];
                lines.forEach(line => {
                    const trimmed = line.trim();
                    // Match: "1. Request #PR001: "New Office Furniture""
                    const match1 = trimmed.match(/^\d+\.\s+Request\s+#([A-Z0-9]+):\s*"([^"]+)"(.*)$/);
                    // Match: "1. Request #PR001: Description" (without quotes)
                    const match2 = trimmed.match(/^\d+\.\s+Request\s+#([A-Z0-9]+):\s*(.+)$/);
                    // Match: "1. Item #ID: Description"
                    const match3 = trimmed.match(/^\d+\.\s+.+?#([A-Z0-9]+):\s*(.+)$/);
                    // Match: "1. Item: Description"
                    const match4 = trimmed.match(/^\d+\.\s+(.+?):\s*(.+)$/);
                    
                    if (match1) {
                        rows.push({ number: trimmed.match(/^\d+/)[0], id: match1[1], description: match1[2], extra: match1[3] });
                    } else if (match2) {
                        rows.push({ number: trimmed.match(/^\d+/)[0], id: match2[1], description: match2[2].trim() });
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
                    // Convert to table
                    const tableId = `__TABLE_${tableIndex}__`;
                    const hasAnyId = rows.some(r => r.id);
                    let tableContent = '| No. |';
                    if (hasAnyId) {
                        tableContent += ' Request ID |';
                    }
                    tableContent += ' Description |\n|';
                    if (hasAnyId) {
                        tableContent += ' --- |';
                    }
                    tableContent += ' --- | --- |\n';
                    rows.forEach(row => {
                        tableContent += `| ${row.number} |`;
                        if (hasAnyId) {
                            tableContent += ` ${row.id ? '#' + row.id : ''} |`;
                        }
                        tableContent += ` ${(row.description || '').replace(/"/g, '').trim()} |\n`;
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
        
        // Build HTML table with proper styling
        let tableHtml = '<div class="overflow-x-auto my-4" style="border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); background: white;">';
        tableHtml += '<table class="min-w-full" style="border-collapse: collapse; width: 100%;">';
        
        // Header row with gradient background
        tableHtml += '<thead><tr style="background: linear-gradient(to right, #3b82f6, #4f46e5);">';
        headers.forEach(header => {
            const escapedHeader = header.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tableHtml += `<th style="border-bottom: 2px solid #1e40af; padding: 12px 16px; text-align: left; font-weight: 700; font-size: 0.875rem; color: white;">${escapedHeader}</th>`;
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
            
            const rowClass = rowIndex % 2 === 0 ? 'table-row-even' : 'table-row-odd';
            tableHtml += `<tr class="${rowClass}">`;
            
            // Ensure we have the right number of cells (pad if needed)
            const paddedCells = [...cells];
            while (paddedCells.length < headers.length) {
                paddedCells.push('');
            }
            
            paddedCells.slice(0, headers.length).forEach((cell, cellIndex) => {
                // Handle status colors and styling
                let cellContent = (cell || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                let cellStyle = 'border-bottom: 1px solid #e5e7eb; padding: 12px 16px; font-size: 0.875rem; color: #374151;';
                
                const cellLower = cellContent.toLowerCase();
                if (cellLower.includes('pending') || cellLower.includes('waiting')) {
                    cellStyle += ' color: #ea580c; font-weight: 600;';
                } else if (cellLower.includes('approved') || cellLower.includes('completed')) {
                    cellStyle += ' color: #16a34a; font-weight: 600;';
                } else if (cellLower.includes('rejected') || cellLower.includes('cancelled')) {
                    cellStyle += ' color: #dc2626; font-weight: 600;';
                } else if (cellLower.includes('in progress') || cellLower.includes('processing')) {
                    cellStyle += ' color: #2563eb; font-weight: 600;';
                } else if (cellIndex === 0) {
                    // First column (usually ID) - make it slightly bold
                    cellStyle += ' font-weight: 500; color: #111827;';
                }
                
                tableHtml += `<td style="${cellStyle}">${cellContent}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table></div>';
        
        return tableHtml;
    };

    // Helper function to stream text like ChatGPT (token/word-based chunks with natural pacing)
    const streamBotResponse = (fullText) => {
        // Create initial bot message with empty text
        const initialMessage = {
            id: Date.now(),
            text: '',
            sender: 'bot',
            isStreaming: true
        };

        // Add the initial message to state
        setMessages(prev => [...prev, initialMessage]);
        setIsTyping(false);

        // Stream in token/word chunks (like ChatGPT - more natural and faster)
        // Split text into natural chunks (words with punctuation)
        const tokens = [];
        const words = fullText.split(/(\s+)/);

        // Group words into chunks (1-3 words per chunk for natural flow like ChatGPT)
        let currentChunk = '';
        for (let i = 0; i < words.length; i++) {
            currentChunk += words[i];
            // Create chunk after 1-3 words, or at punctuation, or at sentence end
            const wordCount = currentChunk.trim().split(/\s+/).filter(w => w).length;
            const shouldChunk = 
                (wordCount >= 2 && Math.random() > 0.4) ||
                /[.!?]\s*$/.test(currentChunk) ||
                (wordCount >= 3);
            
            if (shouldChunk && currentChunk.trim()) {
                tokens.push(currentChunk);
                currentChunk = '';
            }
        }
        // Add remaining chunk
        if (currentChunk.trim()) {
            tokens.push(currentChunk);
        }

        // If no tokens created (very short text), split by words
        if (tokens.length === 0) {
            tokens.push(...words.filter(w => w.trim()));
        }

        let currentText = '';
        let tokenIndex = 0;

        const streamNextChunk = () => {
            if (tokenIndex >= tokens.length) {
                // Streaming complete
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if (lastMessage && lastMessage.sender === 'bot' && lastMessage.isStreaming) {
                        updatedMessages[updatedMessages.length - 1] = {
                            ...lastMessage,
                            text: fullText,
                            isStreaming: false
                        };
                    }
                    // Execute AutoSpeak
                    if (autoSpeak) {
                        setTimeout(() => speak(fullText), 100);
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
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage && lastMessage.sender === 'bot' && lastMessage.isStreaming) {
                    updatedMessages[updatedMessages.length - 1] = {
                        ...lastMessage,
                        text: currentText
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        // Demo Rate Limiting: Max 1 question per chat
        const userMessageCount = messages.filter(msg => msg.sender === 'user').length;
        if (userMessageCount >= 1) {
            const userMsg = { id: Date.now(), text: newMessage, sender: 'user' };
            setMessages(prev => [...prev, userMsg]);
            setNewMessage('');
            setTimeout(() => {
                streamBotResponse("You have reached your limit of 1 question for this demo. If you want to chat more, please visit ChatGPT or Gemini directly.");
            }, 100);
            return;
        }

        // Add user message
        const userMsg = { id: Date.now(), text: newMessage, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentMessage = newMessage;
        setNewMessage('');
        setIsTyping(true);

        // Generate bot response using Gemini API
        try {
            const botResponse = await generateBotResponse(currentMessage);
            // Use streaming for the response
            streamBotResponse(botResponse);
        } catch (error) {
            console.error('Error generating response:', error);
            // Use streaming for error message too
            streamBotResponse("You've reached the free tier rate limit. Please wait a moment before sending another message.");
        }
    };

    const handleActionClick = async (action) => {
        // Handle action clicks (Speak, Chat, All modules, Data Collection)
        let actionMessage = '';
        switch(action) {
            case 'speak':
                actionMessage = "I want to see my salary bill";
                break;
            case 'chat':
                actionMessage = "I want to see my group chat";
                break;
            case 'modules':
                actionMessage = "show me my modules";
                break;
            case 'data':
                actionMessage = "I want to see my chat history";
                break;
            default:
                return;
        }
        
        // Add user message
        const userMsg = { id: Date.now(), text: actionMessage, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Generate bot response using Gemini API
        try {
            const botResponse = await generateBotResponse(actionMessage);
            // Use streaming for the response
            streamBotResponse(botResponse);
        } catch (error) {
            console.error('Error generating response:', error);
            // Use streaming for error message too
            streamBotResponse("You've reached the free tier rate limit. Please wait a moment before sending another message.");
        }
    };

    const showInitialView = messages.length === 0;
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[100] flex items-center justify-center animate-in fade-in duration-500">
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
            
            {/* Main UI Frame - Full Screen Responsive Design */}
            <div className="relative bg-black border border-white/10 md:rounded-3xl shadow-2xl w-full h-full md:h-[95vh] md:max-h-[900px] md:w-[95vw] md:max-w-[1400px] overflow-hidden flex flex-col text-white font-sans"
             style={KHMER_NEW_YEAR.isActive ? { backgroundImage: 'url(/assets/theme/kbach-pattern.png)', backgroundSize: '300px', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(15, 5, 5, 0.95)' } : {}}>

                {/* Back Button - Top Left */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex items-center gap-2 px-4 py-2 bg-slate-800/70 hover:bg-slate-700/80 text-white rounded-lg backdrop-blur-sm transition-colors font-medium shadow-lg"
                >
                    <ChevronRight size={18} className="rotate-180" /> Back
                </button>

                {/* Close Button - Top Right */}
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/50 hover:bg-white/10 hover:text-white rounded-full transition-colors z-10">
                    <X size={24} className="md:w-6 md:h-6" />
                </button>

                {/* 1. Header Section */}
                <header className="p-3 md:p-6 pt-10 md:pt-16 pb-3 md:pb-6 flex-shrink-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        {/* User Avatar */}
                        <img 
                            src="/assets/modules-image/top-bot.png" 
                            alt="User Avatar" 
                            className="w-9 h-9 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/20 shadow-lg flex-shrink-0"
                        />
                        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-white truncate">My AI Agent</h2>

                        
                        {/* Bell Icon */}
                        <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/80 flex items-center justify-center">
                                <Bell size={16} className="md:w-5 md:h-5 text-white/80" />
                            </div>
                        </div>
                        {/* AutoSpeak Toggle */}
                        {KHMER_NEW_YEAR.isActive && (
                            <button 
                                onClick={() => setAutoSpeak(!autoSpeak)} 
                                className={`relative flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${autoSpeak ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800/80 text-white/50 hover:bg-white/10'}`}
                                title={autoSpeak ? "Auto-Voice Active" : "Enable Khmer Voice"}
                            >
                                {autoSpeak ? <Volume2 size={16} className="md:w-5 md:h-5 animate-pulse" /> : <VolumeX size={16} className="md:w-5 md:h-5" />}
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] xs:text-xs md:text-sm lg:text-base text-white/70 mt-1 md:mt-2 leading-relaxed line-clamp-2">
                        Control tasks effortlessly, from creating visuals to organizing your calendar.
                    </p>
                </header>

                {/* 2. Content Area - Shows either initial view or chat messages */}
                <div className="flex-1 flex flex-col px-4 md:px-6 lg:px-8 py-4 md:py-6 relative overflow-y-auto min-h-0">
                    {showInitialView ? (
                        <>
                            {/* Central Glowing Orb */}
                            <div className="flex flex-col items-center justify-start py-4 md:py-8 relative min-h-full">
                                {/* Glowing Orb - Responsive sizing - Smaller on mobile to fit all content */}
                                <div className="relative w-40 h-40 xs:w-44 xs:h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-6 md:mb-8 lg:mb-12 flex-shrink-0">
                                    {/* Outer Glow Ring */}
                                    <div className={`absolute inset-0 rounded-full ${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-yellow-500/30 via-red-500/30 to-orange-500/30' : 'bg-gradient-to-br from-purple-400/30 via-pink-400/30 via-yellow-300/30 to-blue-300/30'} blur-2xl animate-pulse`}></div>
                                    
                                    {/* Main Orb */}
                                    <div className={`absolute inset-2 rounded-full ${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-[0_0_80px_rgba(250,204,21,0.6),0_0_120px_rgba(239,68,68,0.5),inset_0_0_40px_rgba(255,255,255,0.2)]' : 'bg-gradient-to-br from-purple-500 via-pink-500 via-yellow-400 to-blue-400 shadow-[0_0_80px_rgba(139,92,246,0.8),0_0_120px_rgba(236,72,153,0.6),0_0_160px_rgba(250,204,21,0.4),inset_0_0_40px_rgba(255,255,255,0.1)]'} animate-pulse`}></div>
                                    
                                    {/* Inner Highlight */}
                                    <div className="absolute top-3 left-3 md:top-4 md:left-4 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 blur-xl"></div>
                                    
                                    {/* Sparkle Icons on Orb */}
                                    <div className="absolute top-6 left-8 md:top-8 md:left-12 lg:top-10 lg:left-14 z-10">
                                        <Sparkles size={18} className="md:w-5 md:h-5 lg:w-6 lg:h-6 text-white drop-shadow-2xl animate-pulse" />
                                    </div>
                                    <div className="absolute bottom-8 right-10 md:bottom-10 md:right-14 lg:bottom-12 lg:right-16 z-10">
                                        <Sparkles size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5 text-white drop-shadow-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                                    </div>
                                    
                                    {/* Purple Glow Below - Elongated */}
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-28 h-20 md:w-32 md:h-24 lg:w-40 lg:h-32 bg-gradient-to-b ${KHMER_NEW_YEAR.isActive ? 'from-orange-500/40 via-red-500/20 to-transparent' : 'from-purple-500/50 via-purple-400/30 to-transparent'} blur-3xl`}></div>
                                </div>

                                {/* Interaction Cards Grid - Responsive - Ensure all visible */}
                                <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-3 md:gap-4 w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-md lg:max-w-lg pb-4 flex-shrink-0">
                                    {/* My Salary Bill - Top Left */}
                                    <button 
                                        onClick={() => handleActionClick('speak')}
                                        className={`${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-red-900/40 to-orange-950/40 border border-yellow-500/30 hover:border-yellow-400/50' : 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 border border-white/10'} backdrop-blur-sm rounded-xl md:rounded-2xl p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg border border-white/10 min-h-[90px] xs:min-h-[100px] sm:min-h-[110px] md:min-h-[120px] group`}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-1">
                                            <Mic 
                                                size={24} 
                                                className="xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white group-hover:scale-110 transition-transform duration-200" 
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <span className="text-white text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-center leading-tight tracking-tight">
                                            My Salary Bill
                                        </span>
                                    </button>

                                    {/* My Group Chat - Top Right */}
                                    <button 
                                        onClick={() => handleActionClick('chat')}
                                        className={`${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-red-900/40 to-orange-950/40 border border-yellow-500/30 hover:border-yellow-400/50' : 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 border border-white/10'} backdrop-blur-sm rounded-xl md:rounded-2xl p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg border border-white/10 min-h-[90px] xs:min-h-[100px] sm:min-h-[110px] md:min-h-[120px] group`}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-1">
                                            <MessageSquare 
                                                size={24} 
                                                className="xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white group-hover:scale-110 transition-transform duration-200" 
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <span className="text-white text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-center leading-tight tracking-tight">
                                            My Group Chat
                                        </span>
                                    </button>

                                    {/* My Modules - Bottom Left */}
                                    <button 
                                        onClick={() => handleActionClick('modules')}
                                        className={`${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-red-900/40 to-orange-950/40 border border-yellow-500/30 hover:border-yellow-400/50' : 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 border border-white/10'} backdrop-blur-sm rounded-xl md:rounded-2xl p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg border border-white/10 min-h-[90px] xs:min-h-[100px] sm:min-h-[110px] md:min-h-[120px] group`}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-1">
                                            <Layers 
                                                size={24} 
                                                className="xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white group-hover:scale-110 transition-transform duration-200" 
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <span className="text-white text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-center leading-tight tracking-tight">
                                            My Modules
                                        </span>
                                    </button>

                                    {/* My Chat History - Bottom Right */}
                                    <button 
                                        onClick={() => handleActionClick('data')}
                                        className={`${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-br from-red-900/40 to-orange-950/40 border border-yellow-500/30 hover:border-yellow-400/50' : 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 border border-white/10'} backdrop-blur-sm rounded-xl md:rounded-2xl p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg border border-white/10 min-h-[90px] xs:min-h-[100px] sm:min-h-[110px] md:min-h-[120px] group`}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-1">
                                            <Database 
                                                size={24} 
                                                className="xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white group-hover:scale-110 transition-transform duration-200" 
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <span className="text-white text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-center leading-tight tracking-tight">
                                            My Chat History
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Chat Messages Area */}
                            <div className="flex-1 overflow-y-auto mb-4 space-y-3 md:space-y-4 pr-2">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-start gap-2 md:gap-3 group ${
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {message.sender === 'bot' && (
                                            <img 
                                                src="/assets/modules-image/top-bot.png" 
                                                alt="Bot" 
                                                className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-purple-400/50 flex-shrink-0" 
                                            />
                                        )}
                                        <div
                                            className={`max-w-[75%] md:max-w-[70%] lg:max-w-[65%] rounded-2xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm lg:text-base ${
                                                message.sender === 'user'
                                                    ? KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900 rounded-br-none shadow-[0_0_15px_rgba(250,204,21,0.2)] border border-yellow-300 font-medium' : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none'
                                                    : KHMER_NEW_YEAR.isActive ? 'bg-black/30 border-l-[3px] border-l-red-500 border-r border-t border-b border-white/10 text-white shadow-sm backdrop-blur-sm rounded-bl-none' : 'bg-slate-800/80 text-white/90 rounded-bl-none border border-white/10'
                                            }`}
                                        >
                                            {message.sender === 'bot' ? (
                                                <div className="markdown-content">
                                                    <div
                                                        className="prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={renderMarkdownContent(message.text)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{message.text}</div>
                                            )}
                                        </div>
                                        
                {message.sender === 'bot' && (
                    <button
                        onClick={() => isSpeaking ? stop() : speak(message.text)}
                        className="mt-1 p-1 hover:bg-white/10 rounded-full transition-colors flex items-center self-end opacity-0 group-hover:opacity-100"
                        title="Read Aloud in Khmer"
                    >
                        {isSpeaking ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-white/50" />}
                    </button>
                )}
    {message.sender === 'user' && (
                                            <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full ${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-r from-red-600 to-yellow-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-br from-purple-500 to-blue-500'} flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs md:text-sm font-bold">SK</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <img 
                                            src="/assets/modules-image/top-bot.png" 
                                            alt="Bot" 
                                            className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-purple-400/50 flex-shrink-0" 
                                        />
                                        <div className="bg-slate-800/80 rounded-2xl rounded-bl-none px-3 py-2 md:px-4 md:py-3 border border-white/10">
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 ${KHMER_NEW_YEAR.isActive ? 'bg-yellow-400' : 'bg-white/60'} rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 ${KHMER_NEW_YEAR.isActive ? 'bg-yellow-400' : 'bg-white/60'} rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 ${KHMER_NEW_YEAR.isActive ? 'bg-yellow-400' : 'bg-white/60'} rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </>
                    )}
                </div>

                {/* 4. Bottom Input Field */}
                <footer className="p-4 md:p-6 pt-4 pb-4 md:pb-6">
                    <form onSubmit={handleSendMessage} className="relative bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center p-2 md:p-3 gap-2 md:gap-3">
                        <input 
                            type="text"
                            placeholder="Ask anything"
                            className="flex-1 bg-transparent text-xs md:text-sm lg:text-base placeholder:text-white/40 outline-none text-white"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 ${KHMER_NEW_YEAR.isActive ? 'bg-gradient-to-r from-red-600 to-yellow-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-br from-purple-500 to-blue-500'} rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity flex-shrink-0"
                        >
                            {newMessage.trim() ? (
                                <Send size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                            ) : (
                                <Sparkles size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                            )}
                        </button>
                    </form>
                </footer>

            </div>
        </div>
    );
};

export default GMChat;
