import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, GraduationCap, LogOut, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group font-medium relative overflow-hidden",
            active
                ? "text-white shadow-xl shadow-indigo-500/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800/50 hover:text-indigo-600 dark:hover:text-cyan-400"
        )}
    >
        {active && (
            <motion.div
                layoutId="active-bg"
                className="absolute inset-0 bg-indigo-600 rounded-2xl"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
        <div className="relative z-10 flex items-center gap-3">
            <Icon size={22} className={cn("transition-transform group-hover:scale-110", active && "scale-110")} />
            <span>{label}</span>
        </div>
    </Link>
);

const Layout = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-500">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-navy-800 p-6 flex flex-col hidden md:flex transition-colors duration-500 z-20">
                <div className="flex items-center gap-4 mb-12 px-3 pt-2">
                    <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
                        <GraduationCap size={26} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            AdvisR
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">Student Portal</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        to="/"
                        active={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={MessageSquare}
                        label="AI Assistant"
                        to="/chat"
                        active={location.pathname === '/chat'}
                    />
                </nav>

                <div className="pt-8 border-t border-slate-200 dark:border-navy-800 space-y-4">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-navy-800/50 rounded-2xl border border-slate-100 dark:border-navy-700/50">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Appearance</span>
                        <ThemeToggle />
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3.5 w-full rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium group">
                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">

                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">AdvisR</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors">
                            <Menu size={24} />
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-full relative z-10 text-slate-900 dark:text-slate-100">
                    <Outlet />
                </div>

                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-30 transition-opacity duration-1000">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                </div>
            </main>
        </div>
    );
};

export default Layout;
