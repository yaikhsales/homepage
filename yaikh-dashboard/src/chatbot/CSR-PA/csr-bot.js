import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Plus, Menu } from 'lucide-react';

const API_ENDPOINT = 'http://192.167.4.7:8001/api/ai-agent';
const MODULE_NAME = 'csr';

const CSRBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { 
            from: 'bot', 
            text: 'Welcome to CSR Module! I can help you with:\n\n1. How many CSR requests this month?\n2. Show me CSR requests approved by controller\n3. How many CSR requests issued to requestors?\n4. Show me CSR A4 items requested and issued\n5. What\'s the total CSR requestor requests?\n6. Give me CSR statistics\n\nAsk me anything about CSR requests!' 
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
    //     { text: 'Induction Training', highlight: true },
    //     { text: 'Monthly 6S Report' },
    //     { text: 'Compliance Certificate' },
    //     { text: 'Audit Checklist' },
    //     { text: 'CSR Equipment Handling' }
    // ];

    const suggestedActions = [
        { text: 'How many CSR requests this month?', highlight: true },
        { text: 'Show me CSR requests approved by controller' },
        { text: 'How many CSR requests issued to requestors?' },
        { text: 'Show me CSR A4 items requested and issued' },
        { text: 'What\'s the total CSR requestor requests?' },
        { text: 'Give me CSR statistics' }
    ];

    // Load chat history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('csr-chat-history');
        if (saved) {
            const parsed = JSON.parse(saved);
            setChatHistory(parsed);
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('csr-chat-history', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const callAPI = async (userMessage) => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setIsTyping(true);

        // Add user message
        const newMessages = [...messages, { from: 'user', text: userMessage }];
        setMessages(newMessages);

        // Call API
        const botResponse = await callAPI(userMessage);
        setIsTyping(false);

        // Add bot response
        setMessages([...newMessages, { from: 'bot', text: botResponse }]);
    };

    const createNewChat = () => {
        setMessages([
            { 
                from: 'bot', 
                text: 'Welcome to CSR Module! I can help you with:\n\n1. How many CSR requests this month?\n2. Show me CSR requests approved by controller\n3. How many CSR requests issued to requestors?\n4. Show me CSR A4 items requested and issued\n5. What\'s the total CSR requestor requests?\n6. Give me CSR statistics\n\nAsk me anything about CSR requests!' 
            }
        ]);
        setCurrentChatId(null);
    };

    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setMessages(chat.messages);
            setCurrentChatId(chatId);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Menu size={20} className="text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">CSR Module</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>

            {/* Chat History Sidebar */}
            {isHistoryOpen && (
                <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-10 shadow-lg">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Chat History</h3>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={16} className="text-gray-600" />
                            </button>
                        </div>
                        <button
                            onClick={createNewChat}
                            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New Chat
                        </button>
                    </div>
                    <div className="overflow-y-auto">
                        {chatHistory.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No chat history</div>
                        ) : (
                            chatHistory.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        loadChat(chat.id);
                                        setIsHistoryOpen(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-gray-100 border-b border-gray-100 transition-colors"
                                >
                                    <div className="text-sm font-medium text-gray-800 truncate">
                                        {chat.messages[0]?.text || 'New Chat'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(chat.updatedAt).toLocaleDateString()}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
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
                                    : 'bg-white text-gray-800 shadow-sm'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
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

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-200 bg-white">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about CSR requests..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CSRBot;

