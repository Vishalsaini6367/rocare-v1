'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Box, ClipboardList, CheckCircle, Clock, AlertCircle, ShoppingBag, Plus, ArrowUpRight, ArrowRight, BarChart3, TrendingUp, Users, Activity, Package, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    if (session && (session.user as any).role !== 'admin') {
        redirect('/dashboard');
    }

    useEffect(() => {
        fetchStats();
    }, []);

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

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-8 animate-fade-in group">
                    <div>
                        <h1 className="mb-2 group-hover:text-blue-600 transition duration-300">Command Center</h1>
                        <p className="italic">Oversee Logistics and Maintenance Operations.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/admin/products/new"
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center space-x-3 transform active:scale-95"
                        >
                            <Plus className="w-5 h-5 md:w-6 md:h-6" />
                            <span>Quick Add System</span>
                        </Link>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-12 md:mb-20">
                    {statItems.map((stat, i) => (
                        <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color === 'blue' ? 'blue' : stat.color === 'red' ? 'red' : stat.color === 'purple' ? 'purple' : 'green'}-50 rounded-full blur-3xl transform translate-x-12 -translate-y-12`}></div>
                            <div className={`w-14 h-14 md:w-16 md:h-16 ${stat.color === 'blue' ? 'bg-blue-50' : stat.color === 'red' ? 'bg-red-50' : stat.color === 'purple' ? 'bg-purple-50' : 'bg-green-50'} rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 group-hover:bg-slate-900 transition-all duration-500`}>
                                <stat.icon className={`w-7 h-7 md:w-8 md:h-8 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'red' ? 'text-red-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-green-600'} group-hover:text-white`} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-3 leading-none italic">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</h3>
                                <span className="text-[10px] font-black px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full uppercase tracking-widest border border-slate-100 italic">{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-8 md:space-y-12 group">
                        {/* Logistics Summary */}
                        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white h-fit">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl transform translate-x-24 -translate-y-24"></div>
                            <h2 className="text-xl md:text-3xl font-black mb-10 md:mb-12 tracking-tight flex items-center">
                                <Truck className="w-6 h-6 md:w-8 md:h-8 mr-4 text-blue-400" />
                                Logistics Queue
                            </h2>
                            <div className="space-y-6 md:space-y-8">
                                <Link href="/admin/orders" className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition group/log">
                                    <div>
                                        <h4 className="text-lg md:text-2xl font-black mb-1 leading-tight">Inbound Orders</h4>
                                        <p className="text-blue-400 text-[10px] md:text-sm font-black uppercase tracking-widest italic">{stats?.pendingOrders || 0} Pending Confirmation</p>
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-blue-400 group-hover/log:translate-x-1 group-hover/log:-translate-y-1 transition duration-500" />
                                </Link>

                                <Link href="/admin/products" className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition group/inv">
                                    <div>
                                        <h4 className="text-lg md:text-2xl font-black mb-1 leading-tight">Inventory Monitor</h4>
                                        <p className="text-blue-400 text-[10px] md:text-sm font-black uppercase tracking-widest italic">{stats?.totalProducts || 0} Listed Configurations</p>
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-blue-400 group-hover/inv:translate-x-1 group-hover/inv:-translate-y-1 transition duration-500" />
                                </Link>
                            </div>
                        </div>

                        {/* Analytic Graph Area */}
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl">
                            <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-10 md:mb-12 tracking-tight flex items-center">
                                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 mr-4 text-blue-600" />
                                Health Metrics
                            </h2>
                            <div className="space-y-10">
                                {[
                                    { label: "SLA Compliance", val: stats?.completedComplaints || 0, max: stats?.totalComplaints || 1, color: "blue" },
                                    { label: "Fulfilment Rate", val: (stats?.totalOrders - stats?.pendingOrders) || 0, max: stats?.totalOrders || 1, color: "green" },
                                ].map((item, i) => {
                                    const pct = Math.round((item.val / item.max) * 100);
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-5 md:mb-6">
                                                <span className="text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest italic">{item.label}</span>
                                                <span className="text-slate-900 font-black text-lg md:text-xl">{pct}%</span>
                                            </div>
                                            <div className="h-4 md:h-6 bg-slate-50 border border-slate-100 rounded-full p-1 overflow-hidden">
                                                <div
                                                    className={`h-full bg-slate-900 rounded-full transition-all duration-1000 w-[${pct}%] shadow-lg`}
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Support Channel */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative group/tickets">
                            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Active Help-Desk</h2>
                            <p className="text-slate-400 font-medium italic mb-10">Real-time technician assignments.</p>

                            <div className="space-y-6">
                                <Link href="/admin/complaints" className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-2xl transition group/ticket animate-fade-in">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover/ticket:bg-red-500 group-hover/ticket:text-white transition duration-300">
                                            <AlertCircle className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 leading-tight">Critical Tickets</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stats?.pendingComplaints || 0} Awaiting Deployment</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover/ticket:text-red-500 group-focus/ticket:translate-x-2 transition" />
                                </Link>

                                <Link href="/admin/complaints" className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-2xl transition group/ongoing">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover/ongoing:bg-blue-600 group-hover/ongoing:text-white transition duration-300">
                                            <Activity className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 leading-tight">Ongoing Maintenance</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stats?.inProgressComplaints || 0} In Field Activity</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover/ongoing:text-blue-600 transition" />
                                </Link>
                            </div>
                        </div>

                        {/* User Base Statistics */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl flex items-center justify-between group/userbase overflow-hidden relative">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition duration-500"></div>
                            <div className="flex items-center space-x-10">
                                <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition duration-500">
                                    <Users className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-1">{stats?.totalUsers || 0}</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Registered Homeowners</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-blue-600 font-bold block leading-none">+4 Today</span>
                                <TrendingUp className="w-6 h-6 text-green-500 ml-auto mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
