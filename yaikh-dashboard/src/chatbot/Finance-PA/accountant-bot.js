import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Plus, Menu, Trash2 } from 'lucide-react';

const API_ENDPOINT = 'http://192.167.4.7:8001/api/ai-agent';
const MODULE_NAME = 'accounts';

const AccountantBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { 
            from: 'bot', 
            text: 'Welcome to Accounts Module! I can help you with:\n\n1. How many accounts requests this month?\n2. Show me accounts requests approved by controller\n3. How many accounts requests issued to requestors?\n4. Show me accounts A4 items requested and issued\n5. What\'s the total accounts requestor requests?\n6. Give me accounting department statistics\n\nAsk me anything about accounts!' 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Suggested actions - commented out but kept for future use
    // const suggestedActions = [
    //     { text: 'Purchase Request appr', highlight: true },
    //     { text: 'Supp Payment Request' },
    //     { text: 'E-invoice' },
    //     { text: 'Generate Invoice' },
    //     { text: 'Data' }
    // ];

    const suggestedActions = [
        { text: 'How many accounts requests this month?', highlight: true },
        { text: 'Show me accounts requests approved by controller' },
        { text: 'How many accounts requests issued to requestors?' },
        { text: 'Show me accounts A4 items requested and issued' },
        { text: 'What\'s the total accounts requestor requests?' },
        { text: 'Give me accounting department statistics' }
    ];

    // Load chat history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('accounts-chat-history');
        if (saved) {
            const parsed = JSON.parse(saved);
            setChatHistory(parsed);
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('accounts-chat-history', JSON.stringify(chatHistory));
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
                text: 'Welcome to Accounts Module! I can help you with:\n\n1. How many accounts requests this month?\n2. Show me accounts requests approved by controller\n3. How many accounts requests issued to requestors?\n4. Show me accounts A4 items requested and issued\n5. What\'s the total accounts requestor requests?\n6. Give me accounting department statistics\n\nAsk me anything about accounts!' 
            }
        ]);
        setCurrentChatId(newChatId);
    };

    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setMessages(chat.messages);
            setCurrentChatId(chatId);
        }
    };

    const deleteChat = (chatId) => {
        setChatHistory(prev => prev.filter(c => c.id !== chatId));
        if (currentChatId === chatId) {
            createNewChat();
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setIsTyping(true);

        // Add user message
        const newUserMessage = { from: 'user', text: userMessage };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);

        // Update chat history
        if (currentChatId) {
            setChatHistory(prev => prev.map(chat => 
                chat.id === currentChatId 
                    ? { ...chat, messages: updatedMessages, updatedAt: new Date().toISOString() }
                    : chat
            ));
        }

        // Call API
        try {
            const response = await callAPI(userMessage);
            const botMessage = { from: 'bot', text: response };
            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);

            // Update chat history with bot response
            if (currentChatId) {
                setChatHistory(prev => prev.map(chat => 
                    chat.id === currentChatId 
                        ? { ...chat, messages: finalMessages, updatedAt: new Date().toISOString() }
                        : chat
                ));
            }
        } catch (error) {
            const errorMessage = { from: 'bot', text: `Error: ${error.message}` };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleActionClick = (actionText) => {
        setInput(actionText);
        inputRef.current?.focus();
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col z-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <h2 className="text-xl font-bold">Accounts Module</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Chat History Sidebar */}
                {isHistoryOpen && (
                    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-green-200 flex flex-col">
                        <div className="p-4 border-b border-green-200">
                            <button
                                onClick={createNewChat}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                New Chat
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {chatHistory.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                                        currentChatId === chat.id
                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300'
                                            : 'bg-white/50 hover:bg-white/80 border border-green-100'
                                    }`}
                                    onClick={() => loadChat(chat.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {chat.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(chat.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteChat(chat.id);
                                            }}
                                            className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                                        >
                                            <Trash2 size={14} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        msg.from === 'user'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                            : 'bg-white text-gray-800 shadow-md'
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 shadow-md rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Actions */}
                    {messages.length === 1 && (
                        <div className="px-6 pb-4">
                            <div className="flex flex-wrap gap-2">
                                {suggestedActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleActionClick(action.text)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            action.highlight
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600'
                                                : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                                        }`}
                                    >
                                        {action.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-green-200 bg-white/80 backdrop-blur-md p-4">
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Plus size={20} />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about accounts..."
                                className="flex-1 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantBot;

