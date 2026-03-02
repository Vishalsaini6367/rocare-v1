'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Droplet, User, LogOut, LayoutDashboard, ShoppingCart, MessageSquarePlus, Menu, X, ShieldCheck } from 'lucide-react';

export function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const isAdmin = (session?.user as any)?.role === 'admin';

    useEffect(() => {
        if (session) {
            fetch('/api/profile', { cache: 'no-store' })
                .then(res => {
                    if (!res.ok) throw new Error("Fetch failed");
                    return res.json();
                })
                .then(data => setUserProfile(data))
                .catch(_err => {
                    console.error("Error fetching profile:", _err);
                    setUserProfile(null);
                });
        }
    }, [session]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition">
                            <Droplet className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            ROCare
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                        <Link href="/products" className="text-gray-600 hover:text-blue-600 font-medium transition">Products</Link>

                        {session ? (
                            <>
                                {isAdmin ? (
                                    <Link href="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition">
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Admin Panel</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition">
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>User Panel</span>
                                        </Link>
                                        <Link href="/complaints/new" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition">
                                            <MessageSquarePlus className="w-4 h-4" />
                                            <span>New Complaint</span>
                                        </Link>
                                    </>
                                )}

                                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                                    <Link href="/profile" className="flex items-center space-x-2 text-gray-700 bg-gray-50 pr-4 py-1.5 pl-1.5 rounded-full hover:bg-gray-100 transition whitespace-nowrap min-w-[120px]">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                            {userProfile?.image ? (
                                                <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-4 h-4 text-blue-600" />
                                            )}
                                        </div>
                                        <span className="font-bold text-sm truncate max-w-[80px]">{session.user?.name}</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/login" className="text-gray-600 font-medium hover:text-blue-600 transition">Login</Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-200"
                                >
                                    Join ROCare
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:text-blue-600 transition"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[60] bg-white animate-fade-in overflow-y-auto">
                    {/* Sticky Header inside Overlay */}
                    <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-50">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <Droplet className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">ROCare</span>
                        </Link>
                        <button onClick={toggleMenu} className="p-2 bg-slate-100 rounded-full text-slate-900">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="px-6 py-8 space-y-3 pb-32">
                        <div className="pb-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Quick Navigation</p>
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition duration-200"
                            >
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Droplet className="w-5 h-5" />
                                </div>
                                <span className="text-lg font-bold text-slate-900">Home</span>
                            </Link>
                            <Link
                                href="/products"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition duration-200"
                            >
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <span className="text-lg font-bold text-slate-900">Products</span>
                            </Link>
                        </div>

                        {session ? (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Member Dashboard</p>
                                {isAdmin ? (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl"
                                    >
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                            <LayoutDashboard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-blue-600 leading-tight">Admin Portal</p>
                                            <p className="text-xs text-blue-400 font-bold uppercase tracking-tight">System Access</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="grid gap-3">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl"
                                        >
                                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                                <LayoutDashboard className="w-5 h-5" />
                                            </div>
                                            <span className="text-lg font-bold text-blue-600">Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/complaints/new"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center space-x-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-sm">
                                                <MessageSquarePlus className="w-5 h-5" />
                                            </div>
                                            <span className="text-lg font-bold text-slate-900">Book Service</span>
                                        </Link>
                                    </div>
                                )}

                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-4 p-4 mb-4 bg-slate-50 border border-slate-100 rounded-3xl"
                                    >
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-white shadow-xl overflow-hidden shrink-0">
                                            {userProfile?.image ? (
                                                <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="bg-blue-600 w-full h-full flex items-center justify-center">
                                                    <User className="w-7 h-7 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-extrabold text-slate-900 text-xl truncate">{session.user?.name}</p>
                                            <p className="text-xs text-blue-600 font-black uppercase tracking-widest">Active Member</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full p-5 bg-red-50 text-red-600 rounded-2xl text-lg font-bold flex items-center justify-center space-x-3 active:scale-95 transition"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout Securely</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-8 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Get Started Today</p>
                                <div className="grid gap-4">
                                    <Link
                                        href="/auth/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-5 bg-blue-600 text-white rounded-2xl text-center text-lg font-black shadow-2xl shadow-blue-200 active:scale-95 transition"
                                    >
                                        Join ROCare
                                    </Link>
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-5 bg-slate-50 text-slate-900 rounded-2xl text-center text-lg font-bold border-2 border-slate-100 active:scale-95 transition"
                                    >
                                        Log In
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Mobile Footer Credit */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white text-center mt-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck className="w-24 h-24" />
                            </div>
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Official Platform</p>
                            <p className="text-white font-black text-lg tracking-tight mb-2">Developed By Vishal Saini</p>
                            <a
                                href="tel:+916367839332"
                                className="inline-flex items-center space-x-2 bg-blue-600 px-6 py-2.5 rounded-full text-sm font-black transition active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.04 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.91 5.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16v.92z" />
                                </svg>
                                <span>+91 6367839332</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
