'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Droplet, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const inputStyle = {
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
    WebkitAppearance: 'none' as const,
    boxSizing: 'border-box' as const,
};

const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#475569',
    marginBottom: '0.5rem',
    paddingLeft: '0.25rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
};

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'user' }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful! Please login.');
                window.location.replace('/auth/login');
            } else {
                toast.error(data.message || 'Something went wrong');
                setLoading(false);
            }
        } catch (error) {
            toast.error('Failed to register. Check your connection.');
            setLoading(false);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)';
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#f1f5f9';
        e.target.style.boxShadow = 'none';
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
                    <div className="bg-blue-600 p-2 rounded-xl transition" style={{ boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>
                        <Droplet className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter" style={{ background: 'linear-gradient(to right, #2563eb, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ROCare
                    </span>
                </Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Create Account</h1>
                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '1rem' }}>Join our ROCare community for premium service</p>
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
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', background: 'rgba(219,234,254,0.5)', borderRadius: '50%', filter: 'blur(40px)' }} />

                    <form className="space-y-5" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Name */}
                        <div>
                            <label htmlFor="name" style={labelStyle}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <User style={{ width: '1.1rem', height: '1.1rem', color: '#94a3b8' }} />
                                </div>
                                <input id="name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" style={labelStyle}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <Mail style={{ width: '1.1rem', height: '1.1rem', color: '#94a3b8' }} />
                                </div>
                                <input id="email" type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" style={labelStyle}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <Lock style={{ width: '1.1rem', height: '1.1rem', color: '#94a3b8' }} />
                                </div>
                                <input id="password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        </div>

                        {/* Submit */}
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
                                WebkitAppearance: 'none',
                                marginTop: '0.5rem',
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight style={{ width: '1.1rem', height: '1.1rem' }} />
                                </>
                            )}
                        </button>

                        <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                            <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
