import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Award, Clock, Plus, CheckCircle, History, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import AddSubjectModal from './AddSubjectModal';
import CompleteSemesterModal from './CompleteSemesterModal';

const StatCard = ({ icon: Icon, label, value, subtext, color, iconColor }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-navy-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-white dark:border-white/5 transition-all duration-300 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${iconColor}`}>
            <Icon size={80} />
        </div>

        <div className="flex items-start justify-between mb-8 relative z-10">
            <div className={`p-3.5 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon size={24} className={iconColor} />
            </div>
        </div>

        <div className="relative z-10">
            <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</span>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mt-1">{label}</h3>
            {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">{subtext}</p>}
        </div>
    </motion.div>
);

const CourseCard = ({ code, name, credit, status }) => (
    <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between p-5 bg-white dark:bg-navy-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:bg-navy-800 transition-all duration-300"
    >
        <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400 font-bold text-sm">
                {code.split(' ')[0]}
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg mb-0.5">{name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-navy-900/50 px-2 py-0.5 rounded-md inline-block">
                    {code} • {credit} Credits
                </p>
            </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${status === 'Ongoing'
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400'
            }`}>
            {status}
        </span>
    </motion.div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const fetchSubjects = async () => {
        try {
            const response = await api.get('/users/me/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [user?.current_semester]);

    const handleSemesterCompleted = () => {
        window.location.reload();
    };

    const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Hello, {user?.name?.split(' ')[0] || 'Student'} <span className="inline-block animate-wave origin-bottom-right">👋</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                        Ready to crush Semester {user?.current_semester || 1}?
                    </p>
                </div>
                <div className="hidden sm:block">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-cyan-300 rounded-xl font-medium text-sm border border-indigo-100 dark:border-indigo-500/20">
                        <Sparkles size={16} />
                        <span>Keep learning, keep growing!</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={TrendingUp}
                    label="CGPA"
                    value="--.--"
                    subtext="Update after semester"
                    color="bg-emerald-500"
                    iconColor="text-emerald-500"
                />
                <StatCard
                    icon={Award}
                    label="Current Sem"
                    value={user?.current_semester || 1}
                    subtext="Stay focused!"
                    color="bg-indigo-500"
                    iconColor="text-indigo-500 dark:text-cyan-400"
                />
                <StatCard
                    icon={BookOpen}
                    label="Active Courses"
                    value={subjects.length}
                    subtext={`${totalCredits} Credits total`}
                    color="bg-amber-500"
                    iconColor="text-amber-500"
                />
                <StatCard
                    icon={Clock}
                    label="Attendance"
                    value="--%"
                    subtext="Not tracked yet"
                    color="bg-rose-500"
                    iconColor="text-rose-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Current Courses</h2>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 dark:shadow-cyan-500/20 hover:shadow-xl hover:scale-105"
                        >
                            <Plus size={18} /> Add Subject
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <span className="loading-spinner text-indigo-600">Loading...</span>
                            </div>
                        ) : subjects.length > 0 ? (
                            subjects.map(sub => (
                                <CourseCard key={sub.code} code={sub.code} name={sub.name} credit={sub.credits} status="Ongoing" />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-navy-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-navy-700">
                                <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-navy-800 rounded-full flex items-center justify-center mb-4">
                                    <BookOpen className="text-slate-400 dark:text-slate-500" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No subjects yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">Start adding your courses to track progress.</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 font-semibold"
                                >
                                    Add your first subject →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-3xl p-1 shadow-2xl shadow-indigo-500/20">
                        <div className="bg-white dark:bg-navy-900 rounded-[22px] p-8 h-full">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setIsCompleteModalOpen(true)}
                                    disabled={subjects.length === 0}
                                    className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 bg-white/20 rounded-lg">
                                            <CheckCircle size={20} />
                                        </div>
                                        <span>Complete Semester</span>
                                    </div>
                                    <ChevronRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => navigate('/history')}
                                    className="w-full py-4 px-6 bg-slate-50 dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all flex items-center justify-between group border border-slate-200 dark:border-navy-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 bg-slate-200 dark:bg-navy-900 rounded-lg text-slate-500 dark:text-slate-400">
                                            <History size={20} />
                                        </div>
                                        <span>Academic History</span>
                                    </div>
                                    <ChevronRight size={20} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-navy-800">
                                <div className="flex gap-3">
                                    <Sparkles className="text-indigo-500 dark:text-cyan-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Pro Tip</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Completing the semester will lock your grades and advance you to the next one automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddSubjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubjectAdded={fetchSubjects}
            />

            <CompleteSemesterModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                subjects={subjects}
                onSemesterCompleted={handleSemesterCompleted}
            />
        </div>
    );
};

export default Dashboard;
