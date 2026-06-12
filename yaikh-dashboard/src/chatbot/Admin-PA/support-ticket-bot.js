import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Plus, Menu, Trash2, Sparkles } from 'lucide-react';

const API_ENDPOINT = 'https://dev.yaikh.com/api/ai-agent';
const MODULE_NAME = 'support_ticket';

const SupportTicketBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { 
            from: 'bot', 
            text: 'Welcome to Support Ticket Module! I can help you with:\n\n1. Show all tickets requested this month\n2. How many tickets are currently in progress?\n3. Show all completed tickets\n4. How many users are using the support ticket module?\n5. How many tickets were requested by the admin department?\n\nAsk me anything about support tickets!' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const suggestedActions = [
        { text: 'Show all tickets requested this month', highlight: true },
        { text: 'How many tickets are currently in progress?' },
        { text: 'Show all completed tickets' },
        { text: 'How many users are using the support ticket module?' },
        { text: 'How many tickets were requested by the admin department?' }
    ];

    // Load chat history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('support-ticket-chat-history');
        if (saved) {
            const parsed = JSON.parse(saved);
            setChatHistory(parsed);
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('support-ticket-chat-history', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // API call function
    const callAPI = async (message) => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    module: MODULE_NAME
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.message || 'I received your request, but the response format was unexpected.';
        } catch (error) {
            console.error('API Error:', error);
            return `Sorry, I encountered an error: ${error.message}. Please try again later.`;
        }
    };

    const createNewChat = () => {
        const newChatId = Date.now().toString();
        const newChat = {
            id: newChatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setChatHistory(prev => [newChat, ...prev]);
        setMessages([
            { 
                from: 'bot', 
                text: 'Welcome to Support Ticket Module! I can help you with:\n\n1. Show all tickets requested this month\n2. How many tickets are currently in progress?\n3. Show all completed tickets\n4. How many users are using the support ticket module?\n5. How many tickets were requested by the admin department?\n\nAsk me anything about support tickets!' 
            }
        ]);
        setCurrentChatId(newChatId);
    };

    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setMessages(chat.messages);
            setCurrentChatId(chatId);
            setIsHistoryOpen(false);
        }
    };

    const deleteChat = (chatId) => {
        const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
        setChatHistory(updatedHistory);
        if (currentChatId === chatId) {
            setMessages([
                { 
                    from: 'bot', 
                    text: 'Welcome to Support Ticket Module! I can help you with:\n\n1. Show all tickets requested this month\n2. How many tickets are currently in progress?\n3. Show all completed tickets\n4. How many users are using the support ticket module?\n5. How many tickets were requested by the admin department?\n\nAsk me anything about support tickets!' 
                }
            ]);
            setCurrentChatId(null);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        const userMsg = { from: 'user', text: userMessage };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);

        // Create new chat if none exists
        let chatId = currentChatId;
        if (!chatId) {
            chatId = Date.now().toString();
            const newChat = {
                id: chatId,
                title: userMessage.substring(0, 50),
                messages: updatedMessages,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setChatHistory(prev => [newChat, ...prev]);
            setCurrentChatId(chatId);
        } else {
            // Update existing chat
            setChatHistory(prev => prev.map(chat => 
                chat.id === chatId 
                    ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() }
                    : chat
            ));
        }

        // Show typing indicator
        setIsTyping(true);

        // Call API
        try {
            const botResponse = await callAPI(userMessage);
            const botMsg = { from: 'bot', text: botResponse };
            const finalMessages = [...updatedMessages, botMsg];
            setMessages(finalMessages);

            // Update chat history with bot response
            setChatHistory(prev => prev.map(chat => 
                chat.id === chatId 
                    ? { ...chat, messages: finalMessages, updatedAt: new Date().toISOString() }
                    : chat
            ));
        } catch (error) {
            const errorMsg = { from: 'bot', text: `Error: ${error.message}` };
            setMessages([...updatedMessages, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSuggestedAction = (action) => {
        setInput(action);
        inputRef.current?.focus();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[100] p-4">
            <div className="relative w-full max-w-md h-[90vh] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                {/* Phone Screen */}
                <div className="w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl border-2 border-purple-200">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-b-2xl z-20"></div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 pt-8 border-b border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                className="p-2 rounded-full hover:bg-white/50 transition"
                            >
                                <Menu size={20} className="text-purple-800" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-purple-800">Support Ticket PA</h2>
                                    <p className="text-xs text-purple-600">AI Assistant</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/50 transition"
                        >
                            <X size={20} className="text-purple-800" />
                        </button>
                    </div>

                    {/* History Sidebar */}
                    <div className={`absolute inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-r border-purple-200 transform transition-transform duration-300 ease-in-out ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-purple-200">
                                <h2 className="text-sm font-semibold text-purple-800">Chat History</h2>
                                <button
                                    onClick={() => setIsHistoryOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-white/50 transition"
                                >
                                    <X size={16} className="text-purple-600" />
                                </button>
                            </div>

                            <div className="p-3 border-b border-purple-200">
                                <button
                                    onClick={createNewChat}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 border border-purple-200 hover:opacity-80 transition shadow-sm"
                                >
                                    <Plus size={14} className="text-purple-700" />
                                    <span className="text-xs font-medium text-purple-700">New Chat</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {chatHistory.length === 0 ? (
                                    <div className="p-4 text-center text-purple-500 text-xs">
                                        No chat history yet
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {chatHistory.map((chat) => (
                                            <div
                                                key={chat.id}
                                                onClick={() => loadChat(chat.id)}
                                                className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
                                                    currentChatId === chat.id
                                                        ? 'bg-gradient-to-r from-purple-200 to-pink-200 border border-purple-300'
                                                        : 'hover:bg-white/50 border border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium text-purple-800 truncate flex-1">
                                                        {chat.title}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteChat(chat.id);
                                                        }}
                                                        className="p-1 rounded hover:bg-red-100 transition ml-2"
                                                    >
                                                        <Trash2 size={12} className="text-red-600" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-purple-600 mt-1">
                                                    {new Date(chat.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        msg.from === 'user'
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                            : 'bg-white text-purple-800 border border-purple-200'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white text-purple-800 border border-purple-200 rounded-2xl px-4 py-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Actions */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2">
                            <div className="flex flex-wrap gap-2">
                                {suggestedActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestedAction(action.text)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                                            action.highlight
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                                : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                                        }`}
                                    >
                                        {action.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2.5 rounded-full bg-white border border-purple-200 text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="p-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketBot;

