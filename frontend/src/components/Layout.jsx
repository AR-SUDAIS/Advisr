import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, GraduationCap, LogOut, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            active
                ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
    >
        <Icon size={20} className={cn("transition-transform group-hover:scale-110", active && "scale-110")} />
        <span className="font-medium">{label}</span>
        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-8 bg-indigo-400 rounded-r-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
        )}
    </Link>
);

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col hidden md:flex">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                        <GraduationCap size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        AdvisR
                    </h1>
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
                        label="AI Mentor"
                        to="/chat"
                        active={location.pathname === '/chat'}
                    />
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-[#0f172a]">

                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-indigo-500" />
                        <span className="font-bold">Advisor.AI</span>
                    </div>
                    <button className="p-2 text-slate-400">
                        <Menu />
                    </button>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>

                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
                </div>
            </main>
        </div>
    );
};

export default Layout;
