'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Package, User, Phone, MapPin, Truck, CheckCircle, Clock, AlertCircle, Eye, MoreHorizontal, ArrowRight, TrendingUp, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered'>('all');

    if (session && (session.user as any).role !== 'admin') {
        redirect('/dashboard');
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success(`Order updated to ${newStatus}`);
                fetchOrders();
            } else {
                toast.error('Status update failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Out for Delivery': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeTab);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Intercepting Dispatch Logs...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 animate-fade-in group">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition duration-300">Logistics Control</h1>
                        <p className="text-lg text-slate-500 font-medium italic">Manage Cash on Delivery orders and system installations.</p>
                    </div>
                </div>

                {/* Tab Interface */}
                <div className="flex items-center space-x-4 mb-12 p-2 bg-white rounded-[2rem] border border-slate-100 w-fit shadow-sm overflow-x-auto max-w-full">
                    {['all', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-95 whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid gap-10">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10">
                                <div className={`px-6 py-2 border-2 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-8 items-center">
                                <div className="md:col-span-1 md:border-r border-slate-50 md:pr-8">
                                    <div className="w-full aspect-square max-w-[160px] mx-auto md:max-w-full bg-slate-50 rounded-3xl p-4 flex items-center justify-center mb-6 overflow-hidden">
                                        <img src={order.productId?.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 truncate">{order.productId?.name}</h3>
                                    <div className="flex items-center text-blue-600 font-black text-2xl tracking-tighter">
                                        <IndianRupee className="w-5 h-5" />
                                        <span>{order.totalAmount}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 bg-slate-100 w-fit px-3 py-1 rounded-full">ID: #{order._id.slice(-6)}</p>
                                </div>

                                <div className="md:col-span-2 px-0 md:px-4 space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Customer Details</span>
                                            <div className="flex items-center space-x-3">
                                                <User className="w-4 h-4 text-blue-500" />
                                                <span className="font-bold text-slate-700">{order.clientName}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Phone className="w-4 h-4 text-blue-500" />
                                                <span className="font-bold text-slate-700">{order.mobileNumber}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Order Date</span>
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Deployment Address</span>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-4 pr-12 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4">
                                                {order.lat && order.lng && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm border border-slate-100 hover:bg-blue-600 hover:text-white transition group/map"
                                                        title="Launch Navigation"
                                                    >
                                                        <MapPin className="w-5 h-5 group-hover/map:scale-125 transition" />
                                                    </a>
                                                )}
                                            </div>
                                            <MapPin className="w-5 h-5 text-red-400 mt-1 shrink-0" />
                                            <p className="text-sm font-bold text-slate-600 italic leading-relaxed">{order.deliveryAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1 flex flex-col space-y-3 pl-8 border-l border-slate-50">
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                                            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition"
                                        >
                                            Confirm Order
                                        </button>
                                    )}
                                    {order.status === 'Confirmed' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                                            className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-200 transition"
                                        >
                                            Ship Now
                                        </button>
                                    )}
                                    {order.status === 'Out for Delivery' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                            className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-xl shadow-green-200 transition"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}

                                    <button className="w-full py-4 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition">
                                        Print Invoice
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                        className="w-full py-4 text-red-400 font-bold hover:bg-red-50 rounded-2xl transition"
                                    >
                                        Void Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                            <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No orders in this segment</h3>
                            <p className="text-slate-500 font-medium italic">All caught up with dispatches!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
