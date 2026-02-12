import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import api from '../lib/api';

const ChatMessage = ({ role, content }) => {
    const isBot = role === 'assistant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex gap-4 max-w-[85%]",
                isBot ? "self-start" : "self-end flex-row-reverse"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                isBot
                    ? "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-indigo-500/20"
                    : "bg-slate-200 dark:bg-navy-700 text-slate-600 dark:text-slate-300"
            )}>
                {isBot ? <Bot size={20} /> : <User size={20} />}
            </div>

            <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                isBot
                    ? "bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-navy-700"
                    : "bg-indigo-600 dark:bg-cyan-600 text-white rounded-tr-none shadow-indigo-500/20 dark:shadow-cyan-500/20"
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

        try {
            const response = await api.post('/chat', { message: input });
            const botResponse = {
                role: 'assistant',
                content: response.data.response
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 flex flex-col custom-scrollbar py-4">
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} role={msg.role} content={msg.content} />
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="self-start flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm ml-14"
                    >
                        <Sparkles size={16} className="animate-spin text-indigo-500 dark:text-cyan-400" />
                        <span>Thinking...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4">
                <form onSubmit={handleSend} className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your grades, career advice, or subject choices..."
                        className="w-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl py-4 pl-6 pr-14 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-cyan-500/10 transition-all font-medium shadow-lg shadow-indigo-500/5 dark:shadow-none"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 dark:shadow-cyan-500/20 scale-95 group-hover:scale-100"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 font-medium">
                    AI can make mistakes. Please verify important academic decisions with a human advisor.
                </p>
            </div>
        </div>
    );
};

export default Chatbot;
