'use client';

import { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, HeartPulse, Sparkles, CheckCircle, Droplet, Zap, Info, MapPin, Phone, User, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderData, setOrderData] = useState({
        clientName: session?.user?.name || '',
        mobileNumber: '',
        deliveryAddress: '',
        lat: null as number | null,
        lng: null as number | null,
    });
    const router = useRouter();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (session?.user?.name && !orderData.clientName) {
            setOrderData(prev => ({ ...prev, clientName: session?.user?.name || '' }));
        }
    }, [session]);

    const fetchProduct = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            const found = data.find((p: any) => p._id === id);
            if (found) {
                setProduct(found);
            } else {
                toast.error('Product not found');
                router.push('/products');
            }
        } catch (error) {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            toast.loading("Fetching your coordinates...", { id: 'geo' });
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        setOrderData(prev => ({
                            ...prev,
                            deliveryAddress: data.display_name,
                            lat: latitude,
                            lng: longitude
                        }));
                        toast.success("Location identified!", { id: 'geo' });
                    } catch (error) {
                        setOrderData(prev => ({
                            ...prev,
                            deliveryAddress: `${latitude}, ${longitude}`,
                            lat: latitude,
                            lng: longitude
                        }));
                        toast.success("Coordinates captured!", { id: 'geo' });
                    }
                },
                (error) => {
                    toast.error("Location access denied. Please type manually.", { id: 'geo' });
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error('Please login to place an order');
            router.push('/auth/login');
            return;
        }

        setOrderLoading(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: id,
                    ...orderData,
                    totalAmount: product.price,
                }),
            });

            if (response.ok) {
                toast.success('Order Placed! Technician will call for verification.');
                setShowOrderModal(false);
                router.push('/dashboard');
            } else {
                const err = await response.json();
                toast.error(err.message || 'Order failed');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Calibrating Product Data...</span>
            </div>
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in group">
                <Link
                    href="/products"
                    className="inline-flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-8 md:mb-10 group/back hover:translate-x-[-8px] transition duration-300"
                >
                    <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Product Catalog</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">
                    {/* Left Column: Image Container */}
                    <div className="space-y-6 md:space-y-10 group/img">
                        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden flex items-center justify-center aspect-square shadow-blue-200/20 group-hover/img:shadow-blue-300/40 transition duration-500 border-2 border-transparent group-hover/img:border-blue-600/10">
                            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-600/5 rounded-full blur-3xl transform translate-x-24 md:translate-x-32 -translate-y-24 md:-translate-y-32"></div>
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl transform group-hover/img:scale-110 transition duration-700 p-4" />
                            ) : (
                                <Droplet className="w-24 h-24 md:w-48 md:h-48 text-blue-200 animate-pulse" />
                            )}
                            <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 flex space-x-4">
                                <div className="px-4 md:px-6 py-1.5 md:py-2 bg-slate-900 text-white rounded-full text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest flex items-center shadow-2xl">
                                    <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1.5 md:mr-2 text-amber-500" />
                                    <span>Original ROCare Gear</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col">
                        <div className="mb-8 md:mb-12">
                            <div className="flex items-center space-x-2 text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-4 md:mb-6">
                                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span>Trusted Multi-Stage Filtration</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4 md:mb-6 group-hover:text-blue-600 transition duration-300">{product.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-6 md:mb-10">
                                <div className="flex items-center space-x-0.5 md:space-x-1 text-amber-400">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 md:w-5 md:h-5 fill-current" />)}
                                </div>
                                <span className="text-[8px] md:text-sm font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-4 md:pl-8">(4.9/5 from 340+ Reviews)</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 mb-8 md:mb-12 relative overflow-hidden">
                            <div className="md:absolute top-0 right-0 md:p-8 flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-start mb-6 md:mb-0">
                                <span className="text-slate-400 font-bold line-through text-base md:text-xl leading-none italic order-2 md:order-1 ml-2 md:ml-0 md:mb-1">Was ₹{(product.price * 1.25).toFixed(0)}</span>
                                <span className="text-3xl md:text-5xl font-black text-blue-600 tracking-tighter leading-none order-1 md:order-2">₹{product.price}</span>
                            </div>

                            <div className="space-y-6 md:space-y-8 relative z-10 md:max-w-[70%]">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center"><Info className="w-3.5 h-3.5 mr-2" /> Product Specification</h3>
                                    <p className="text-base md:text-xl text-slate-500 font-medium italic leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-slate-50">
                                    <div className="flex items-center space-x-3 md:space-x-4 group/spec">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-500 group-hover/spec:bg-blue-600 group-hover/spec:text-white transition group-hover/spec:rotate-6">
                                            <HeartPulse className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <span className="block text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Purification</span>
                                            <span className="text-xs md:text-sm font-bold text-slate-700">RO+UV+UF+MTDS</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 group/spec">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-500 group-hover/spec:bg-blue-600 group-hover/spec:text-white transition group-hover/spec:rotate-6">
                                            <Zap className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <span className="block text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Capacity</span>
                                            <span className="text-xs md:text-sm font-bold text-slate-700">12L/Hour</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8">
                            <button
                                onClick={() => session ? setShowOrderModal(true) : router.push('/auth/login')}
                                className="flex-1 flex justify-center items-center py-5 md:py-6 px-8 md:px-12 bg-blue-600 text-white font-black text-lg md:text-xl rounded-2xl md:rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transform active:scale-95 transition-all group/buy"
                            >
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 group-hover/buy:rotate-12 transition" />
                                <span>Order Now</span>
                            </button>

                            <div className="flex items-center justify-center space-x-6 md:space-x-8 px-6 md:px-10 py-4 md:py-6 bg-slate-900 rounded-2xl md:rounded-3xl shadow-2xl">
                                <div className="flex flex-col items-center">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mb-1" />
                                    <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">WARRANTY</span>
                                </div>
                                <div className="w-px h-6 md:h-8 bg-white/10"></div>
                                <div className="flex flex-col items-center">
                                    <Droplet className="w-5 h-5 md:w-6 md:h-6 text-blue-400 mb-1" />
                                    <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">CERTIFIED</span>
                                </div>
                            </div>
                        </div>

                        <p className="mt-10 text-center text-slate-400 font-bold text-[8px] md:text-xs uppercase tracking-[0.2em] italic px-4">
                            FREE SHIPPING • CASH ON DELIVERY ONLY
                        </p>
                    </div>
                </div>
            </main>

            {/* Checkout Modal */}
            {showOrderModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group/modal">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl transform translate-x-12 -translate-y-12"></div>

                        <button
                            onClick={() => setShowOrderModal(false)}
                            className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition group/close"
                        >
                            <X className="w-6 h-6 group-hover/close:rotate-90 transition duration-300" />
                        </button>

                        <div className="mb-10">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                <span>Secured Cash on Delivery Checkout</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Finalize Your Acquisition</h2>
                            <p className="text-slate-500 font-medium italic">Payment will be collected by technician after install.</p>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-8 relative z-10">
                            <div className="space-y-6">
                                <div className="group/field">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-blue-500 transition" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                                            value={orderData.clientName}
                                            onChange={(e) => setOrderData({ ...orderData, clientName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="group/field">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Contact Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/field:text-blue-500 transition" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+91 00000 00000"
                                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                                            value={orderData.mobileNumber}
                                            onChange={(e) => setOrderData({ ...orderData, mobileNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="group/field">
                                    <div className="flex justify-between items-end mb-3 px-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Coordinates</label>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 mb-1 flex items-center"
                                        >
                                            <MapPin className="w-3 h-3 mr-1" />
                                            Locate Me
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-7 w-5 h-5 text-slate-400 group-focus-within/field:text-blue-500 transition" />
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Street, Landmark, City..."
                                            className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner resize-none"
                                            value={orderData.deliveryAddress}
                                            onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 text-white rounded-3xl flex items-center justify-between shadow-2xl">
                                <div>
                                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest block mb-1">Total Payable (COD)</span>
                                    <span className="text-4xl font-black tracking-tighter">₹{product.price}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={orderLoading}
                                    className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transform active:scale-95 transition-all flex items-center min-w-[160px] justify-center"
                                >
                                    {orderLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
