'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
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
                toast.success('Welcome to ROCare!');
                // Use window.location for reliable PWA navigation on iOS
                // Admin email check to avoid slow getSession() call
                const isAdmin = email.trim().toLowerCase() === 'vishalsaini00185@gmail.com';
                const dest = isAdmin ? '/admin' : '/dashboard';
                window.location.replace(dest);
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div
            className="bg-slate-50 flex flex-col justify-center items-center px-4 md:px-6"
            style={{
                minHeight: '100dvh',
                paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            {/* Logo Section */}
            <div className="w-full max-w-[400px] text-center mb-8 md:mb-10">
                <Link href="/" className="inline-flex items-center space-x-2 mb-6 md:mb-8 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition shadow-lg" style={{ boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
                        <Droplet className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <span className="text-2xl md:text-3xl font-black tracking-tighter" style={{ background: 'linear-gradient(to right, #2563eb, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ROCare
                    </span>
                </Link>
                <h1 className="text-slate-900" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                    Welcome Back
                </h1>
                <p className="text-slate-500" style={{ fontStyle: 'italic', fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>
                    Please sign in to your ROCare account
                </p>
            </div>

            {/* Login Card Container */}
            <div className="w-full flex justify-center" style={{ maxWidth: '440px' }}>
                <div
                    className="bg-white border border-slate-100 w-full"
                    style={{
                        borderRadius: '2rem',
                        padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 5vw, 2rem)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Visual Flare */}
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(219,234,254,0.5)', borderRadius: '50%', filter: 'blur(40px)' }} />

                    <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Email Input */}
                        <div className="w-full">
                            <label htmlFor="email" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#475569', marginBottom: '0.4rem', paddingLeft: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <Mail style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    inputMode="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    style={{
                                        display: 'block',
                                        paddingLeft: '2.5rem',
                                        paddingRight: '1rem',
                                        paddingTop: '0.8rem',
                                        paddingBottom: '0.8rem',
                                        background: '#f8fafc',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '1rem',
                                        color: '#0f172a',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="w-full">
                            <label htmlFor="password" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#475569', marginBottom: '0.4rem', paddingLeft: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <Lock style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    style={{
                                        display: 'block',
                                        paddingLeft: '2.5rem',
                                        paddingRight: '1rem',
                                        paddingTop: '0.8rem',
                                        paddingBottom: '0.8rem',
                                        background: '#f8fafc',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '1rem',
                                        color: '#0f172a',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="hover:scale-[1.02] active:scale-95 transition-all"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '1rem',
                                background: loading ? '#93c5fd' : '#2563eb',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '1rem',
                                borderRadius: '1rem',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 10px 30px rgba(37,99,235,0.3)',
                                WebkitAppearance: 'none',
                                boxSizing: 'border-box'
                            }}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>

                        {/* Helper Links */}
                        <div className="flex flex-col items-center gap-3 pt-4">
                            <Link href="/auth/register" className="text-blue-600 font-bold text-sm tracking-tight hover:underline">
                                Don&apos;t have an account? Sign up
                            </Link>
                            <Link href="#" className="text-slate-400 font-bold text-xs tracking-tight hover:text-slate-500">
                                Forgot password?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Footer */}
            <div className="mt-8 text-center px-4">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                    Industry Standard Security Protocol
                </p>
            </div>

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
