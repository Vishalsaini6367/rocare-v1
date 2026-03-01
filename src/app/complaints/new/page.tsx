'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { MessageSquare, User, Phone, MapPin, FileText, Loader2, ArrowLeft, HeartPulse, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewComplaintPage() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        clientName: '',
        mobileNumber: '',
        location: '',
        problemDescription: '',
        lat: null as number | null,
        lng: null as number | null,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.name && !formData.clientName) {
            setFormData(prev => ({ ...prev, clientName: session?.user?.name || '' }));
        }
    }, [session]);

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            toast.loading("Fetching coordinates...", { id: 'geo-comp' });
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        setFormData(prev => ({
                            ...prev,
                            location: data.display_name,
                            lat: latitude,
                            lng: longitude
                        }));
                        toast.success("Location identified!", { id: 'geo-comp' });
                    } catch (error) {
                        setFormData(prev => ({
                            ...prev,
                            location: `${latitude}, ${longitude}`,
                            lat: latitude,
                            lng: longitude
                        }));
                        toast.success("Coordinates captured!", { id: 'geo-comp' });
                    }
                },
                (error) => {
                    toast.error("Location access denied.", { id: 'geo-comp' });
                }
            );
        } else {
            toast.error("Geolocation is not supported.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Complaint submitted successfully!');
                router.push('/dashboard');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-10 md:py-16 animate-fade-in group">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition font-black uppercase tracking-widest text-[10px] mb-8 group/back hover:translate-x-[-4px] transition duration-300"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Dashboard</span>
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-6">
                    <div>
                        <h1 className="mb-2 group-hover:text-blue-600 transition duration-300">Support Ticket</h1>
                        <p className="italic">Our technicians are standing by to resolve your issues fast.</p>
                    </div>
                    <div className="flex items-center space-x-8 md:space-x-12 px-6 md:px-8 py-4 bg-white rounded-3xl shadow-sm border border-slate-100 w-full lg:w-auto">
                        <div className="flex flex-col items-center flex-1 lg:flex-none">
                            <span className="text-xl md:text-2xl font-black text-red-500">Fast</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Response</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="flex flex-col items-center flex-1 lg:flex-none">
                            <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">4H</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Turnaround</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
                    <div className="lg:col-span-3 space-y-8 md:space-y-10">
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden group/form">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-red-50/50 rounded-full blur-3xl transform translate-x-24 -translate-y-24"></div>

                            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative z-10">
                                <div className="space-y-6 md:space-y-8">
                                    <div className="group/field">
                                        <label className="block text-xs font-black text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base"
                                                placeholder="e.g. John Doe"
                                                value={formData.clientName}
                                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group/field">
                                        <label className="block text-xs font-black text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Mobile Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                className="block w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={formData.mobileNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group/field">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-3 px-2 gap-2">
                                            <label className="block text-xs font-black text-slate-700 group-hover/field:text-blue-600 transition uppercase tracking-widest">Service Address</label>
                                            <button
                                                type="button"
                                                onClick={getCurrentLocation}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1.5 rounded-full w-fit active:scale-95 transition"
                                            >
                                                <MapPin className="w-3 h-3 mr-1" />
                                                Auto-Locate
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute top-5 md:top-6 left-6 flex items-center pointer-events-none">
                                                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <textarea
                                                required
                                                rows={3}
                                                className="block w-full pl-14 md:pl-16 pr-6 py-5 md:py-6 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base resize-none shadow-inner"
                                                placeholder="Street, Area, Landmark..."
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group/field">
                                        <label className="block text-xs font-black text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Problem Details</label>
                                        <div className="relative">
                                            <div className="absolute top-5 md:top-6 left-6 flex items-center pointer-events-none">
                                                <FileText className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <textarea
                                                required
                                                rows={4}
                                                className="block w-full pl-14 md:pl-16 pr-6 py-5 md:py-6 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base resize-none"
                                                placeholder="Describe the issue..."
                                                value={formData.problemDescription}
                                                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-5 md:py-6 px-10 bg-blue-600 text-white font-black text-lg md:text-xl rounded-[1.5rem] md:rounded-[1.8rem] shadow-2xl shadow-blue-100 hover:bg-blue-700 transform active:scale-[0.98] transition-all disabled:opacity-70 group/btn"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <span>Register Ticket</span>
                                            <MessageSquare className="w-5 h-5 group-hover/btn:translate-x-1 transition duration-300" />
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden h-fit">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl transform translate-x-16 translate-y-16"></div>
                            <h2 className="text-xl md:text-2xl font-black mb-8 md:mb-10 tracking-tight leading-tight">Our Commitment</h2>

                            <div className="space-y-8 md:space-y-12">
                                <div className="flex items-start space-x-4 md:space-x-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black mb-1 leading-none tracking-tight">Swift Action</h4>
                                        <p className="text-white/40 text-[10px] md:text-sm font-bold leading-relaxed italic uppercase tracking-tighter">Technician assignment within 60 mins.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 md:space-x-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                                        <HeartPulse className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black mb-1 leading-none tracking-tight">Expert Care</h4>
                                        <p className="text-white/40 text-[10px] md:text-sm font-bold leading-relaxed italic uppercase tracking-tighter">Certified professionals only.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 md:space-x-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                                        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black mb-1 leading-none tracking-tight">Quality</h4>
                                        <p className="text-white/40 text-[10px] md:text-sm font-bold leading-relaxed italic uppercase tracking-tighter">3-month post-service warranty.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
