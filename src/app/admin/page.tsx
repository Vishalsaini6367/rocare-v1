'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, ClipboardList, CheckCircle, Clock, AlertCircle, ShoppingBag, Plus, ArrowUpRight, ArrowRight, BarChart3, TrendingUp, Users, Activity, Package, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (session && (session.user as any).role !== 'admin') {
            router.push('/dashboard');
        } else if (status === 'authenticated') {
            fetchStats();
        }
    }, [session, status, router]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    const statItems = [
        { label: "Total Orders", value: stats?.totalOrders || "0", icon: Package, color: "blue", trend: stats?.pendingOrders ? `${stats.pendingOrders} NEW` : "STABLE" },
        { label: "Active Service", value: stats?.totalComplaints || "0", icon: AlertCircle, color: "red", trend: stats?.pendingComplaints ? `${stats.pendingComplaints} PENDING` : "0" },
        { label: "Total Products", value: stats?.totalProducts || "0", icon: ShoppingBag, color: "purple", trend: "+2" },
        { label: "Active Users", value: stats?.totalUsers || "0", icon: Users, color: "green", trend: "LIVE" },
    ];

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Analyzing Catalog Performance...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-20 gap-8 animate-fade-in group">
                    <div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2 group-hover:text-blue-600 transition duration-300">Command Center</h1>
                        <p className="text-base md:text-lg text-slate-500 font-medium italic">Oversee Logistics and Maintenance Operations.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/admin/products/new"
                            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center space-x-3 transform active:scale-95"
                        >
                            <Plus className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="text-sm md:text-base">Quick Add System</span>
                        </Link>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 mb-10 md:mb-20">
                    {statItems.map((stat, i) => (
                        <div key={i} className="bg-white p-5 md:p-10 rounded-[1.5rem] md:rounded-[3.5rem] shadow-lg border border-slate-100 hover:shadow-2xl transition group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-${stat.color === 'blue' ? 'blue' : stat.color === 'red' ? 'red' : stat.color === 'purple' ? 'purple' : 'green'}-50 rounded-full blur-2xl transform translate-x-12 -translate-y-12`}></div>
                            <div className={`w-10 h-10 md:w-16 md:h-16 ${stat.color === 'blue' ? 'bg-blue-50' : stat.color === 'red' ? 'bg-red-50' : stat.color === 'purple' ? 'bg-purple-50' : 'bg-green-50'} rounded-lg md:rounded-3xl flex items-center justify-center mb-4 md:mb-8 group-hover:bg-slate-900 transition-all duration-500 relative z-10`}>
                                <stat.icon className={`w-5 h-5 md:w-8 md:h-8 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'red' ? 'text-red-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-green-600'} group-hover:text-white`} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.15em] text-[8px] md:text-[10px] mb-2 md:mb-3 leading-none italic relative z-10">{stat.label}</p>
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 relative z-10">
                                <h3 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                                <span className="text-[8px] md:text-[10px] font-black px-2 py-1 bg-slate-50 text-slate-500 rounded-full uppercase tracking-widest border border-slate-100 italic w-fit">{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-8 md:space-y-12">
                        {/* Logistics Summary */}
                        <div className="bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white h-fit">
                            <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-blue-600/10 rounded-full blur-3xl transform translate-x-24 -translate-y-24"></div>
                            <h2 className="text-lg md:text-3xl font-black mb-8 md:mb-12 tracking-tight flex items-center">
                                <Truck className="w-5 h-5 md:w-8 md:h-8 mr-3 md:mr-4 text-blue-400" />
                                Logistics Queue
                            </h2>
                            <div className="space-y-4 md:space-y-8">
                                <Link href="/admin/orders" className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition group/log">
                                    <div className="min-w-0 pr-4">
                                        <h4 className="text-base md:text-2xl font-black mb-1 leading-tight truncate">Inbound Orders</h4>
                                        <p className="text-blue-400 text-[8px] md:text-sm font-black uppercase tracking-widest italic truncate">{stats?.pendingOrders || 0} Pending Confirmation</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 md:w-8 md:h-8 text-blue-400 shrink-0 group-hover/log:translate-x-1 group-hover/log:-translate-y-1 transition duration-500" />
                                </Link>

                                <Link href="/admin/products" className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition group/inv">
                                    <div className="min-w-0 pr-4">
                                        <h4 className="text-base md:text-2xl font-black mb-1 leading-tight truncate">Inventory Monitor</h4>
                                        <p className="text-blue-400 text-[8px] md:text-sm font-black uppercase tracking-widest italic truncate">{stats?.totalProducts || 0} Listed Configurations</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 md:w-8 md:h-8 text-blue-400 shrink-0 group-hover/inv:translate-x-1 group-hover/inv:-translate-y-1 transition duration-500" />
                                </Link>
                            </div>
                        </div>

                        {/* Analytic Graph Area */}
                        <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl">
                            <h2 className="text-lg md:text-3xl font-black text-slate-900 mb-8 md:mb-12 tracking-tight flex items-center">
                                <BarChart3 className="w-5 h-5 md:w-8 md:h-8 mr-3 md:mr-4 text-blue-600" />
                                Health Metrics
                            </h2>
                            <div className="space-y-8 md:space-y-10">
                                {[
                                    { label: "SLA Compliance", val: stats?.completedComplaints || 0, max: stats?.totalComplaints || 1, color: "blue" },
                                    { label: "Fulfilment Rate", val: (stats?.totalOrders - stats?.pendingOrders) || 0, max: stats?.totalOrders || 1, color: "green" },
                                ].map((item, i) => {
                                    const pct = Math.round((item.val / item.max) * 100);
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                                <span className="text-slate-400 font-black text-[8px] md:text-xs uppercase tracking-widest italic">{item.label}</span>
                                                <span className="text-slate-900 font-black text-base md:text-xl">{pct}%</span>
                                            </div>
                                            <div className="h-3 md:h-6 bg-slate-50 border border-slate-100 rounded-full p-0.5 md:p-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-slate-900 rounded-full transition-all duration-1000 shadow-lg"
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 md:space-y-10">
                        {/* Support Channel */}
                        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 relative group/tickets overflow-hidden">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">Active Help-Desk</h2>
                            <p className="text-sm md:text-base text-slate-400 font-medium italic mb-6 md:mb-10">Real-time technician assignments.</p>

                            <div className="space-y-4 md:space-y-6">
                                <Link href="/admin/complaints" className="flex items-center justify-between p-5 md:p-8 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-2xl transition group/ticket animate-fade-in">
                                    <div className="flex items-center space-x-4 md:space-x-6 min-w-0 pr-2">
                                        <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover/ticket:bg-red-500 group-hover/ticket:text-white transition duration-300">
                                            <AlertCircle className="w-5 h-5 md:w-7 md:h-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm md:text-lg font-black text-slate-900 leading-tight truncate">Critical Tickets</h4>
                                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{stats?.pendingComplaints || 0} Awaiting Deployment</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 shrink-0 group-hover/ticket:text-red-500 transition" />
                                </Link>

                                <Link href="/admin/complaints" className="flex items-center justify-between p-5 md:p-8 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-2xl transition group/ongoing">
                                    <div className="flex items-center space-x-4 md:space-x-6 min-w-0 pr-2">
                                        <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover/ongoing:bg-blue-600 group-hover/ongoing:text-white transition duration-300">
                                            <Activity className="w-5 h-5 md:w-7 md:h-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm md:text-lg font-black text-slate-900 leading-tight truncate">Ongoing Service</h4>
                                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{stats?.inProgressComplaints || 0} In Field Activity</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 shrink-0 group-hover/ongoing:text-blue-600 transition" />
                                </Link>
                            </div>
                        </div>

                        {/* User Base Statistics */}
                        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl flex items-center justify-between group/userbase overflow-hidden relative">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition duration-500"></div>
                            <div className="flex items-center space-x-6 md:space-x-10 min-w-0">
                                <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-900 text-white rounded-xl md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl group-hover:rotate-12 transition duration-500">
                                    <Users className="w-7 h-7 md:w-10 md:h-10" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-1 truncate">{stats?.totalUsers || 0}</h2>
                                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic truncate">Registered Homeowners</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-blue-600 text-[10px] md:text-sm font-bold block leading-none">+4 Today</span>
                                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-500 ml-auto mt-1 md:mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
