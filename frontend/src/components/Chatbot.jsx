import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const ChatMessage = ({ role, content }) => {
    const isBot = role === 'assistant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex gap-4 max-w-[80%]",
                isBot ? "self-start" : "self-end flex-row-reverse"
            )}
        >
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isBot ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"
            )}>
                {isBot ? <Bot size={18} /> : <User size={18} />}
            </div>

            <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                isBot
                    ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                    : "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20"
            )}>
                {content}
            </div>
        </motion.div>
    );
};

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your personal AI Advisor. I have access to your academic records. How can I guide you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Mock Response delay
        setTimeout(() => {
            const botResponse = {
                role: 'assistant',
                content: "I'm currently running in demo mode. Once connected to the backend, I'll use RAG to fetch specific advice based on your grades and courses!"
            };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 flex flex-col custom-scrollbar">
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} role={msg.role} content={msg.content} />
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="self-start flex items-center gap-2 text-slate-400 text-sm ml-12"
                    >
                        <Sparkles size={16} className="animate-spin text-indigo-400" />
                        <span>Thinking...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-6">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your grades, career advice, or subject choices..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-6 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-center text-xs text-slate-500 mt-3">
                    AI can make mistakes. Please verify important academic decisions with a human advisor.
                </p>
            </div>
        </div>
    );
};

export default Chatbot;
