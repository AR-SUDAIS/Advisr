import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Award, Clock, Plus, CheckCircle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import AddSubjectModal from './AddSubjectModal';
import CompleteSemesterModal from './CompleteSemesterModal';

const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <span className="text-2xl font-bold">{value}</span>
        </div>
        <h3 className="text-slate-400 font-medium mb-1">{label}</h3>
        <p className="text-xs text-slate-500">{subtext}</p>
    </motion.div>
);

const CourseCard = ({ code, name, credit, status }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                {code.split(' ')[0]}
            </div>
            <div>
                <h4 className="font-semibold text-slate-200">{name}</h4>
                <p className="text-xs text-slate-500">{code} • {credit} Credits</p>
            </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status === 'Ongoing'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-slate-700 text-slate-400 border-slate-600'
            }`}>
            {status}
        </span>
    </div>
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
        // Refresh subjects (should be empty for new semester) and potentially user data
        // For now, reload window to refresh everything including user context
        window.location.reload();
    };

    const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Student'} 👋</h1>
                    <p className="text-slate-400">Here's your academic overview for Semester {user?.current_semester || 1}.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <button
                        onClick={() => navigate('/history')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition-colors"
                    >
                        <History size={18} />
                        Academic History
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={TrendingUp}
                    label="CGPA"
                    value="--"
                    subtext="Update after semester"
                    color="bg-emerald-500 text-emerald-400"
                />
                <StatCard
                    icon={Award}
                    label="Current Sem"
                    value={user?.current_semester || 1}
                    subtext="Keep it up!"
                    color="bg-indigo-500 text-indigo-400"
                />
                <StatCard
                    icon={BookOpen}
                    label="Active Courses"
                    value={subjects.length}
                    subtext={`${totalCredits} Credits total`}
                    color="bg-amber-500 text-amber-400"
                />
                <StatCard
                    icon={Clock}
                    label="Attendance"
                    value="--"
                    subtext="Not tracked yet"
                    color="bg-rose-500 text-rose-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">Current Courses</h2>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Plus size={16} /> Add Subject
                        </button>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-slate-400 text-center py-4">Loading subjects...</p>
                        ) : subjects.length > 0 ? (
                            subjects.map(sub => (
                                <CourseCard key={sub.code} code={sub.code} name={sub.name} credit={sub.credits} status="Ongoing" />
                            ))
                        ) : (
                            <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <p className="text-slate-400">No subjects added for this semester.</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                >
                                    Add your first subject
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/20 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => setIsCompleteModalOpen(true)}
                            disabled={subjects.length === 0}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Complete Semester
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                        >
                            View Academic History
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-slate-400 mb-3">System</h3>
                        <p className="text-sm text-slate-300 italic">
                            Completing the semester will ask for grades and then automatically advance you to the next semester.
                        </p>
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
