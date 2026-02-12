import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-900 relative overflow-hidden font-sans transition-colors duration-500">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-200/40 dark:bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-200/40 dark:bg-cyan-600/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg p-10 bg-white dark:bg-navy-800/60 backdrop-blur-2xl rounded-[32px] border border-slate-200 dark:border-navy-700/50 shadow-2xl shadow-indigo-500/10 relative z-10 mx-4"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-6 transform -rotate-3 hover:-rotate-6 transition-transform">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Sign in to continue to AdvisR</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-300 text-sm md:text-base text-center flex items-center justify-center font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-navy-700 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-400/20 transition-all font-medium"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 dark:hover:text-cyan-300 text-sm font-medium transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-navy-700 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-400/20 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <input type="checkbox" className="rounded-lg border-slate-300 dark:border-navy-600 bg-slate-50 dark:bg-navy-900 text-indigo-600 dark:text-cyan-400 focus:ring-indigo-600 dark:focus:ring-cyan-400 w-4 h-4" />
                        <span className="text-sm font-medium">Remember me</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/30 dark:shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={22} />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 dark:hover:text-cyan-300 font-bold transition-colors underline decoration-2 decoration-transparent hover:decoration-indigo-500 dark:hover:decoration-cyan-400">Create account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
