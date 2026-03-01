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
            className="bg-slate-50 flex flex-col justify-center items-center px-6"
            style={{
                minHeight: '100dvh',
                paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 2.5rem)',
            }}
        >
            {/* Logo */}
            <div className="mx-auto w-full max-w-md text-center mb-10">
                <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition shadow-lg" style={{ boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
                        <Droplet className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter" style={{ background: 'linear-gradient(to right, #2563eb, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ROCare
                    </span>
                </Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Welcome Back</h1>
                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '1rem' }}>Please sign in to your ROCare account</p>
            </div>

            {/* Card */}
            <div className="mx-auto w-full" style={{ maxWidth: '480px' }}>
                <div
                    className="bg-white border border-slate-100"
                    style={{
                        borderRadius: '2rem',
                        padding: '2.5rem 2rem',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background blob */}
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(219,234,254,0.5)', borderRadius: '50%', filter: 'blur(40px)' }} />

                    <form className="space-y-6" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', paddingLeft: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <Mail style={{ width: '1.1rem', height: '1.1rem', color: '#94a3b8' }} />
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
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        paddingLeft: '2.75rem',
                                        paddingRight: '1rem',
                                        paddingTop: '0.9rem',
                                        paddingBottom: '0.9rem',
                                        background: '#f8fafc',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '1rem',
                                        color: '#0f172a',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        WebkitAppearance: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#f1f5f9'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', paddingLeft: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <Lock style={{ width: '1.1rem', height: '1.1rem', color: '#94a3b8' }} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        paddingLeft: '2.75rem',
                                        paddingRight: '1rem',
                                        paddingTop: '0.9rem',
                                        paddingBottom: '0.9rem',
                                        background: '#f8fafc',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '1rem',
                                        color: '#0f172a',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        WebkitAppearance: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#f1f5f9'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2rem',
                                background: loading ? '#93c5fd' : '#2563eb',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '1.05rem',
                                borderRadius: '1rem',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 10px 30px rgba(37,99,235,0.3)',
                                transition: 'all 0.2s ease',
                                WebkitAppearance: 'none',
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight style={{ width: '1.1rem', height: '1.1rem' }} />
                                </>
                            )}
                        </button>

                        {/* Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                            <Link href="/auth/register" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', borderBottom: '1px solid transparent' }}>
                                Don&apos;t have an account? Sign up
                            </Link>
                            <Link href="#" style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>
                    </form>
                </div>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Industry Standard Security Protocol
                </p>
            </div>

            {/* Spin animation */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
