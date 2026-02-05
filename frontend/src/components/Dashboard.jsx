import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';

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
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Abdul Rahman Sudais 👋</h1>
                    <p className="text-slate-400">Here's your academic overview for Semester 6.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-slate-500">Program</p>
                    <p className="font-semibold text-indigo-400">B.Tech Computer Science</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={TrendingUp}
                    label="CGPA"
                    value="9.2"
                    subtext="Top 5% of class"
                    color="bg-emerald-500 text-emerald-400"
                />
                <StatCard
                    icon={Award}
                    label="SGPA (Last Sem)"
                    value="9.4"
                    subtext="+0.2 improvement"
                    color="bg-indigo-500 text-indigo-400"
                />
                <StatCard
                    icon={BookOpen}
                    label="Active Courses"
                    value="6"
                    subtext="24 Credits total"
                    color="bg-amber-500 text-amber-400"
                />
                <StatCard
                    icon={Clock}
                    label="Attendance"
                    value="88%"
                    subtext="Good standing"
                    color="bg-rose-500 text-rose-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-white">Current Courses</h2>
                    <div className="space-y-3">
                        <CourseCard code="CS 301" name="Data Structures & Algorithms" credit={4} status="Ongoing" />
                        <CourseCard code="CS 302" name="Database Management Systems" credit={4} status="Ongoing" />
                        <CourseCard code="CS 303" name="Operating Systems" credit={3} status="Ongoing" />
                        <CourseCard code="MA 301" name="Linear Algebra" credit={3} status="Ongoing" />
                        <CourseCard code="HU 301" name="Professional Ethics" credit={2} status="Ongoing" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/20 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">
                            View Detailed Grade Report
                        </button>
                        <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors">
                            Contact Faculty Advisor
                        </button>
                        <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors">
                            Update Profile
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-slate-400 mb-3">AI Insight</h3>
                        <p className="text-sm text-slate-300 italic">
                            "Based on your strong performance in algorithms, you might be interested in the 'Advanced AI' elective next semester."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
