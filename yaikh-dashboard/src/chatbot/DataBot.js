import React, { useState } from 'react';
import { X, Send, Database, Bot } from 'lucide-react';

const DataBot = ({ onClose, moduleContext }) => {
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome to the Data Bot. How can I assist with your data tasks today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { from: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Simulate a bot response
        const replyText = `Acknowledged. I am processing your data-related query: "${input}". Further capabilities are under development.`;

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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                            <Database className="text-white/80" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Data Bot</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/50 hover:bg-white/10 hover:text-white rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Message Area */}
                <div className="p-4 flex-1 overflow-y-auto">
                    {/* Messages will be mapped here */}
                </div>

                {/* Input Footer */}
                <div className="p-3 border-t border-white/10 flex items-center gap-3 flex-shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-black/30 border border-white/10 rounded-full py-2 px-4 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder="Ask about data..."
                    />
                    <button onClick={handleSend} className="p-3 rounded-full text-white bg-gradient-to-br from-emerald-500 to-green-600 hover:opacity-90 transition-opacity flex-shrink-0 shadow-lg">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataBot;