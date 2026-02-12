import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const CompleteSemesterModal = ({ isOpen, onClose, subjects, onSemesterCompleted }) => {
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);

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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Complete Semester</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-slate-400 text-sm mb-4">
                            Enter grades for all subjects to complete the semester.
                            This will move you to the next semester.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {subjects.map(sub => (
                                <div key={sub.code} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium text-white">{sub.name}</p>
                                        <p className="text-xs text-slate-500">{sub.code} • {sub.credits} Credits</p>
                                    </div>
                                    <select
                                        required
                                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500"
                                        value={grades[sub.code] || ''}
                                        onChange={(e) => handleGradeChange(sub.code, e.target.value)}
                                    >
                                        <option value="">Grade</option>
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

                            <button
                                type="submit"
                                disabled={loading || Object.keys(grades).length !== subjects.length}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit & Advance Semester'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CompleteSemesterModal;
