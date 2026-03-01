'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, User, Phone, MapPin, Truck, CheckCircle, Clock, AlertCircle, Eye, MoreHorizontal, ArrowRight, TrendingUp, IndianRupee, Box } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered'>('all');

    useEffect(() => {
        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status]);

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

                {/* Tab Interface - Scrollable on mobile */}
                <div className="flex items-center space-x-2 md:space-x-4 mb-10 p-2 bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 overflow-x-auto no-scrollbar shadow-sm">
                    {['all', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-[1rem] md:rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 transform active:scale-95 whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid gap-8 md:gap-10">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                            {/* Status Badge - Repositioned for mobile */}
                            <div className="flex flex-col md:absolute md:top-0 md:right-0 p-0 md:p-10 mb-6 md:mb-0">
                                <div className={`px-4 md:px-6 py-1.5 md:py-2 border-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest w-fit md:ml-auto ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                                <div className="md:col-span-1 md:border-r border-slate-50 md:pr-8">
                                    <div className="w-full aspect-square max-w-[140px] md:max-w-full mx-auto bg-slate-50 rounded-2xl md:rounded-3xl p-4 flex items-center justify-center mb-4 md:mb-6 overflow-hidden">
                                        <img src={order.productId?.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2 truncate text-center md:text-left">{order.productId?.name}</h3>
                                    <div className="flex items-center justify-center md:justify-start text-blue-600 font-black text-xl md:text-2xl tracking-tighter">
                                        <IndianRupee className="w-4 h-4 md:w-5 md:h-5" />
                                        <span>{order.totalAmount}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 bg-slate-100 w-fit px-3 py-1 rounded-full mx-auto md:ml-0">ID: #{order._id.slice(-6)}</p>
                                </div>

                                <div className="md:col-span-2 px-0 md:px-4 space-y-6 md:space-y-8">
                                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                                        <div className="space-y-3 md:space-y-4">
                                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Customer Details</span>
                                            <div className="flex items-center space-x-2 md:space-x-3">
                                                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                                                <span className="font-bold text-slate-700 text-xs md:text-sm truncate">{order.clientName}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 md:space-x-3">
                                                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                                                <span className="font-bold text-slate-700 text-xs md:text-sm">{order.mobileNumber}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3 md:space-y-4">
                                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Order Date</span>
                                            <div className="flex items-center space-x-2 md:space-x-3">
                                                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
                                                <span className="font-bold text-slate-600 text-xs md:text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:space-y-4">
                                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Deployment Address</span>
                                        <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 flex items-start space-x-3 md:space-x-4 pr-10 md:pr-12 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 md:p-4">
                                                {order.lat && order.lng && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 md:p-3 bg-white text-blue-600 rounded-lg md:rounded-2xl shadow-sm border border-slate-100 hover:bg-blue-600 hover:text-white transition group/map"
                                                        title="Launch Navigation"
                                                    >
                                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 group-hover/map:scale-125 transition" />
                                                    </a>
                                                )}
                                            </div>
                                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-400 mt-1 shrink-0" />
                                            <p className="text-xs md:text-sm font-bold text-slate-600 italic leading-relaxed truncate md:whitespace-normal">{order.deliveryAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1 flex flex-col space-y-3 md:pl-8 md:border-l border-slate-50">
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                                            className="w-full py-4 bg-blue-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition text-sm md:text-base"
                                        >
                                            Confirm Order
                                        </button>
                                    )}
                                    {order.status === 'Confirmed' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                                            className="w-full py-4 bg-purple-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-200 transition text-sm md:text-base"
                                        >
                                            Ship Now
                                        </button>
                                    )}
                                    {order.status === 'Out for Delivery' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                            className="w-full py-4 bg-green-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-green-700 shadow-xl shadow-green-200 transition text-sm md:text-base"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}

                                    <button className="w-full py-3 md:py-4 border-2 border-slate-100 text-slate-400 font-bold rounded-xl md:rounded-2xl hover:bg-slate-50 transition text-sm md:text-base flex items-center justify-center space-x-2">
                                        <Box className="w-4 h-4" />
                                        <span>Invoice</span>
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                        className="w-full py-3 md:py-4 text-red-400 font-bold hover:bg-red-50 rounded-xl md:rounded-2xl transition text-sm md:text-base"
                                    >
                                        Void Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className="py-20 md:py-32 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl">
                            <Package className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">No orders found</h3>
                            <p className="text-sm md:text-lg text-slate-500 font-medium italic px-4">All caught up with dispatches!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
