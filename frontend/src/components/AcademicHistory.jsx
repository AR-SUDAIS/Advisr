import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AcademicHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/users/me/history');
                // Sort by semester number descending
                const sortedHistory = response.data.sort((a, b) => b.semester_number - a.semester_number);
                setHistory(sortedHistory);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Academic History</h1>
                    <p className="text-slate-400">View your past semester performance.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading history...</div>
            ) : history.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                    <Book size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-medium text-slate-300">No History Yet</h3>
                    <p className="text-slate-500 mt-2">Complete your first semester to see it here.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {history.map((sem) => (
                        <motion.div
                            key={sem.semester_number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
                                <h2 className="text-xl font-semibold text-white">Semester {sem.semester_number}</h2>
                                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    <Award size={16} />
                                    <span className="font-bold">Completed</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sem.subjects.map((sub, idx) => (
                                        <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium text-slate-200">{sub.name}</h4>
                                                <p className="text-xs text-slate-500">{sub.code} • {sub.credits} Credits</p>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-xs text-slate-500 uppercase">Grade</span>
                                                <span className="text-lg font-bold text-indigo-400">{sub.grade}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AcademicHistory;
