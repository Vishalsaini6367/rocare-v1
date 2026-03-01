'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { ShoppingBag, MessageSquare, ClipboardList, User as UserIcon, ArrowRight, Activity, Clock, CheckCircle, Package, Truck, AlertCircle, Zap, Phone } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        }
    }, [status]);

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    const fetchData = async () => {
        try {
            const [complaintsRes, ordersRes] = await Promise.all([
                fetch('/api/complaints'),
                fetch('/api/orders')
            ]);

            const complaintsData = await complaintsRes.json();
            const ordersData = await ordersRes.json();

            setComplaints(complaintsData.slice(0, 3));
            setOrders(ordersData.slice(0, 3));
        } catch (error) {
            toast.error('Failed to sync data');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight italic">Syncing Your Portal...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-12 gap-6">
                    <div className="animate-fade-in">
                        <h1 className="mb-2">Hello, {session?.user?.name || 'User'}!</h1>
                        <p className="italic">Welcome to your ROCare control center.</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 px-6 py-4 bg-white rounded-3xl shadow-sm border border-slate-100 w-full lg:w-auto">
                        <div className="flex flex-col items-center flex-1 min-w-[80px]">
                            <span className="text-xl md:text-2xl font-black text-blue-600">Active</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Status</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="flex flex-col items-center flex-1 min-w-[80px]">
                            <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">100%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
                    {[
                        { title: "Shop RO", icon: ShoppingBag, color: "blue", link: "/products", desc: "Browse systems" },
                        { title: "Service", icon: MessageSquare, color: "red", link: "/complaints/new", desc: "Report issue" },
                        { title: "History", icon: ClipboardList, color: "green", link: "/complaints", desc: "Past services" },
                        { title: "Profile", icon: UserIcon, color: "purple", link: "/profile", desc: "My details" }
                    ].map((item, i) => (
                        <Link key={i} href={item.link} className="group relative bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-500/20 transition-all duration-300 active:scale-95">
                            <div className={`w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition duration-300 shadow-inner`}>
                                <item.icon className={`w-6 h-6 md:w-7 md:h-7 text-slate-400 group-hover:text-white transition duration-300`} />
                            </div>
                            <h3 className="text-base md:text-xl font-black text-slate-900 mb-1 leading-tight">{item.title}</h3>
                            <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-tight line-clamp-1">{item.desc}</p>
                            <div className="hidden md:flex items-center text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition duration-300 mt-4">
                                <span>Navigate</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Service Requests */}
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
                            <div className="flex items-center justify-between mb-8 md:mb-10 relative z-10">
                                <h2 className="text-xl md:text-2xl font-black text-slate-900">Active Service Tickets</h2>
                                <Link href="/complaints" className="text-xs font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2">Full History</Link>
                            </div>

                            <div className="space-y-4 md:space-y-6 relative z-10">
                                {complaints.map((comp, i) => (
                                    <Link key={i} href={`/complaints/${comp._id}`} className="flex items-center justify-between p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition group/item active:scale-[0.98]">
                                        <div className="flex items-center space-x-4 md:space-x-6 overflow-hidden">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition duration-300 shrink-0`}>
                                                {comp.status === 'Completed' ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : <Activity className="w-5 h-5 md:w-6 md:h-6" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID: #{comp._id.slice(-6)}</span>
                                                <h4 className="font-extrabold text-slate-900 group-hover/item:text-blue-600 transition truncate text-sm md:text-base">RO Maintenance Request</h4>
                                                <p className="text-[10px] md:text-xs text-slate-500 font-medium italic mt-1 line-clamp-1">{comp.problemDescription}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${comp.status === 'Completed' ? 'bg-green-100 text-green-700' : comp.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'} mb-1`}>
                                                {comp.status}
                                            </span>
                                            <span className="block text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comp.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                                {complaints.length === 0 && (
                                    <div className="p-10 text-center bg-slate-50 rounded-3xl italic text-slate-400 font-medium">
                                        No active service requests found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Orders Section */}
                        <div className="bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden text-white">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
                            <div className="flex justify-between items-center mb-8 md:mb-10 relative z-10">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black tracking-tight leading-none mb-2">System Orders</h2>
                                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest italic">COD Pending Verification</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <Package className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:gap-6 relative z-10">
                                {orders.map((order, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-between hover:bg-white/10 transition group/order active:scale-[0.98]">
                                        <div className="flex items-center space-x-4 md:space-x-6 overflow-hidden">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-2xl p-2 shrink-0 group-hover/order:scale-105 transition duration-500">
                                                <img src={order.productId?.image} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="font-extrabold text-sm md:text-lg mb-1 truncate">{order.productId?.name}</h4>
                                                <div className="flex items-center space-x-3 md:space-x-4">
                                                    <span className="text-blue-400 font-black text-lg md:text-xl tracking-tighter">₹{order.totalAmount}</span>
                                                    <span className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">COD Dept.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end shrink-0">
                                            <div className="flex items-center space-x-2 text-blue-400 font-extrabold text-[8px] md:text-[10px] uppercase tracking-widest mb-1 bg-blue-400/10 px-2 md:px-3 py-1 rounded-full border border-blue-400/20">
                                                <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                <span>{order.status}</span>
                                            </div>
                                            <span className="text-[8px] md:text-[10px] font-medium text-white/30 italic">Est: 48 Hrs</span>
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && (
                                    <Link href="/products" className="p-8 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:bg-white/5 transition group/empty">
                                        <ShoppingBag className="w-8 h-8 text-white/10 group-hover/empty:text-blue-400 transition" />
                                        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">No orders yet. Shop now?</p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Support & Tips Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
                            <h2 className="text-2xl font-extrabold mb-6">Service Hotline</h2>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="block text-blue-100 text-[10px] font-bold uppercase tracking-widest">Available 24/7</span>
                                        <div className="flex flex-col space-y-1">
                                            <a href="tel:9214651276" className="text-lg font-bold italic tracking-tight hover:text-blue-50 transition border-b border-white/10 w-fit pb-1">9214651276</a>
                                            <a href="tel:8209280619" className="text-lg font-bold italic tracking-tight hover:text-blue-50 transition w-fit pt-1">8209280619</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex items-start space-x-4">
                                    <AlertCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                                    <p className="text-blue-100 font-medium italic text-xs leading-relaxed">System offline? Call our toll-free number for immediate technician dispatch.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative group/tip">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center">
                                <Zap className="w-5 h-5 text-amber-500 mr-3" />
                                Maintenance Insight
                            </h2>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border-l-8 border-amber-400 shadow-inner group-hover/tip:border-blue-500 transition duration-500">
                                <p className="text-slate-600 text-sm font-bold leading-relaxed italic">
                                    "Replace your sediment filter every 6-9 months to double the lifespan of your RO membrane."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
