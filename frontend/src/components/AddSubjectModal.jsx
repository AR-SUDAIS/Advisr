import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const AddSubjectModal = ({ isOpen, onClose, onSubjectAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        credits: 3
    });
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/me/subjects', formData);
            onSubjectAdded();
            onClose();
            setFormData({ name: '', code: '', credits: 3 });
        } catch (error) {
            console.error("Failed to add subject", error);
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
                        className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700/50 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Gradient for a touch of color */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-cyan-500" />

                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Subject</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Subject Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-400/20 transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Data Structures"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Course Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-400/20 transition-all font-medium"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="e.g. CS101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Credits</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="6"
                                        required
                                        className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-400/20 transition-all font-medium"
                                        value={formData.credits}
                                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/20 dark:shadow-cyan-500/20 transform hover:scale-[1.02] active:scale-[0.98] mt-2"
                            >
                                {loading ? 'Adding Subject...' : 'Add Subject'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AddSubjectModal;
