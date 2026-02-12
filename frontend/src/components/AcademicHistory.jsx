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
                    className="p-2 bg-white dark:bg-navy-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors border border-slate-200 dark:border-navy-700"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Academic History</h1>
                    <p className="text-slate-500 dark:text-slate-400">View your past semester performance.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your academic journey...</p>
                </div>
            ) : history.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 px-6 bg-white dark:bg-navy-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-navy-700/50 shadow-sm"
                >
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Book size={32} className="text-indigo-500 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No History Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                        Your academic journey is just beginning. Complete your first semester to see your history here.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 dark:shadow-cyan-500/20"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    {history.map((sem, index) => (
                        <motion.div
                            key={sem.semester_number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-navy-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-navy-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-navy-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-navy-900/50">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Semester {sem.semester_number}</h2>
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 text-sm font-medium">
                                    <Award size={16} />
                                    <span>Completed</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sem.subjects.map((sub, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-navy-900/50 p-4 rounded-xl border border-slate-200 dark:border-navy-700/30 flex justify-between items-center group hover:border-indigo-200 dark:hover:border-cyan-500/30 transition-colors">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">{sub.name}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{sub.code} • {sub.credits} Credits</p>
                                            </div>
                                            <div className="text-center bg-white dark:bg-navy-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-navy-700 shadow-sm">
                                                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Grade</span>
                                                <span className="text-lg font-bold text-indigo-600 dark:text-cyan-400">{sub.grade}</span>
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
