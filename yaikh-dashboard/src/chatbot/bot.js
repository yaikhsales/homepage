import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

const Chatbot = ({ onClose, moduleContext }) => {
    const buildWelcomeMessage = (context) => {
        if (context?.title) {
            return `Welcome to the ${context.title} module! Ask me anything about ${context.title}, or let me guide you through the workflow.`;
        }
        return 'Hello! How can I assist you today?';
    };

    const [messages, setMessages] = useState([
        { from: 'bot', text: buildWelcomeMessage(moduleContext) }
    ]);
    const [input, setInput] = useState('');

    useEffect(() => {
        setMessages([{ from: 'bot', text: buildWelcomeMessage(moduleContext) }]);
        setInput('');
    }, [moduleContext]);

    const handleSend = () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { from: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Simulate a bot response
        const replyText = moduleContext?.title
            ? `I noted your request about ${moduleContext.title}. I'm getting smarter every day, so more guidance is coming soon.`
            : 'Thanks for your message! I am still in development, but I will be able to help soon.';

        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'bot', text: replyText }]);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-[100] backdrop-blur-sm flex items-end justify-end p-4 animate-in fade-in duration-300">
            <div className="bg-black/50 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md h-[70vh] max-h-[600px] overflow-hidden flex flex-col backdrop-blur-2xl">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Glowing Orb */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 relative flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                            <Sparkles className="text-white/80" size={20} />
                            <div className="absolute inset-0 rounded-full bg-white/10"></div>
                        </div>
                        <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/50 hover:bg-white/10 hover:text-white rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Message Area */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.from === 'bot' && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-md"><Sparkles size={16}/></div>}
                                <div className={`max-w-[80%] p-3 rounded-2xl ${
                                    msg.from === 'bot'
                                        ? 'bg-slate-700/50 text-white/90 rounded-bl-none'
                                        : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Footer */}
                <div className="p-3 border-t border-white/10 flex items-center gap-3 flex-shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-black/30 border border-white/10 rounded-full py-2 px-4 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSend}
                        className="p-3 rounded-full text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-90 transition-opacity flex-shrink-0 shadow-lg"
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;