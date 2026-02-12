import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const CompleteSemesterModal = ({ isOpen, onClose, subjects, onSemesterCompleted }) => {
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleGradeChange = (code, grade) => {
        setGrades(prev => ({ ...prev, [code]: grade }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/me/complete-semester', grades);
            onSemesterCompleted();
            onClose();
        } catch (error) {
            console.error("Failed to complete semester", error);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700/50 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Semester</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter grades to proceed.</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
                                {subjects.map(sub => (
                                    <div key={sub.code} className="flex items-center justify-between bg-slate-50 dark:bg-navy-800 p-4 rounded-2xl border border-slate-200 dark:border-navy-700">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{sub.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{sub.code} • {sub.credits} Credits</p>
                                        </div>
                                        <select
                                            required
                                            className="bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-600 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/20 font-medium cursor-pointer"
                                            value={grades[sub.code] || ''}
                                            onChange={(e) => handleGradeChange(sub.code, e.target.value)}
                                        >
                                            <option value="">Select Grade</option>
                                            <option value="O">O</option>
                                            <option value="A+">A+</option>
                                            <option value="A">A</option>
                                            <option value="B+">B+</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="F">F</option>
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || Object.keys(grades).length !== subjects.length}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/20 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                                {loading ? 'Submitting...' : 'Complete & Advance'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CompleteSemesterModal;
