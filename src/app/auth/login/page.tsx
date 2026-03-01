'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Droplet, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: email.trim().toLowerCase(),
                password,
            });

            if (result?.error) {
                toast.error('Invalid email or password');
                setLoading(false);
            } else {
                toast.success('Logged in successfully!');
                const session = await getSession();
                const role = (session?.user as any)?.role;
                // Use window.location.href for PWA standalone mode on iOS
                if (role === 'admin') {
                    window.location.replace('/admin');
                } else {
                    window.location.replace('/dashboard');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-10 px-6 sm:px-6 lg:px-8" style={{ minHeight: '100dvh' }}>
            <div className="mx-auto w-full max-w-md text-center">
                <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
                    <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl group-hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        <Droplet className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tighter">
                        ROCare
                    </span>
                </Link>
                <h1 className="mb-2">Welcome Back</h1>
                <p className="italic">Please sign in to your ROCare account</p>
            </div>

            <div className="mt-10 mx-auto w-full max-w-lg">
                <div className="bg-white py-10 md:py-12 px-8 md:px-12 shadow-2xl rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>

                    <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="group/field">
                                <label htmlFor="email" className="block text-xs font-black text-slate-700 mb-2 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 md:pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] md:rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="group/field">
                                <label htmlFor="password" className="block text-xs font-black text-slate-700 mb-2 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 md:pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] md:rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 md:py-5 px-8 rounded-2xl shadow-2xl shadow-blue-100 text-lg md:text-xl font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                                </div>
                            )}
                        </button>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm font-bold">
                            <Link href="/auth/register" className="text-blue-600 hover:text-blue-500 transition border-b border-transparent hover:border-blue-500 pb-0.5">Don&apos;t have an account? Sign up</Link>
                            <Link href="#" className="text-slate-400 hover:text-slate-600 transition">Forgot password?</Link>
                        </div>
                    </form>
                </div>

                <p className="mt-12 text-center text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
                    Industry Standard Security Protocol
                </p>
            </div>
        </div>
    );
}
