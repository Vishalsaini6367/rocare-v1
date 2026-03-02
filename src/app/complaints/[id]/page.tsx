'use client';

import { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Phone, User, FileText, CheckCircle, Activity, AlertCircle, ShieldCheck, Calendar, Star } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const response = await fetch('/api/complaints');
            const data = await response.json();
            const found = Array.isArray(data) ? data.find((c: any) => c._id === id) : null;
            if (found) {
                setComplaint(found);
            } else {
                toast.error('Complaint not found');
                router.push('/dashboard');
            }
        } catch (_error) {
            toast.error('Failed to fetch details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-600 border-green-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Retrieving Ticket Data...</span>
            </div>
        </div>
    );

    if (!complaint) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in group">
                <Link
                    href="/complaints"
                    className="inline-flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition font-bold uppercase tracking-[0.2em] text-xs mb-10 group/back hover:translate-x-[-8px] transition duration-300"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Service Timeline</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition duration-300">Ticket Analysis Report</h1>
                        <p className="text-lg text-slate-500 font-medium italic">Detailed breakdown of your RO support request.</p>
                    </div>
                    <div className={`inline-flex items-center px-8 py-4 border-2 rounded-full text-sm font-extrabold uppercase tracking-widest shadow-sm ${getStatusColor(complaint.status)}`}>
                        {complaint.status === 'Pending' && <AlertCircle className="w-4 h-4 mr-2" />}
                        {complaint.status === 'In Progress' && <Activity className="w-4 h-4 mr-2 animate-pulse" />}
                        {complaint.status === 'Completed' && <CheckCircle className="w-4 h-4 mr-2" />}
                        <span>{complaint.status} Status</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-1 gap-12">
                    <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden group/card shadow-blue-200/20">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <ShieldCheck className="w-32 h-32 text-blue-600" />
                        </div>

                        <div className="relative z-10 space-y-16">
                            <div className="flex flex-wrap gap-12">
                                <div className="flex items-start space-x-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-blue-500">
                                        <User className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-extra-bold text-slate-400 uppercase tracking-widest mb-1">Requester</span>
                                        <span className="text-xl font-bold text-slate-900 leading-none">{complaint.clientName}</span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-blue-500">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-extra-bold text-slate-400 uppercase tracking-widest mb-1">Contact</span>
                                        <span className="text-xl font-bold text-slate-900 leading-none">{complaint.mobileNumber}</span>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-blue-500">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-extra-bold text-slate-400 uppercase tracking-widest mb-1">Logged Date</span>
                                        <span className="text-xl font-bold text-slate-900 leading-none">{complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="inline-flex items-center space-x-3 text-blue-600 text-xs font-extrabold uppercase tracking-[0.2em] mb-4 bg-blue-50 px-4 py-2 rounded-full">
                                    <MapPin className="w-4 h-4" />
                                    <span>Service Location</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-700 leading-relaxed italic border-l-8 border-slate-100 pl-8 bg-slate-50/50 py-6 rounded-r-3xl">
                                    {complaint.location}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="inline-flex items-center space-x-3 text-red-600 text-xs font-extrabold uppercase tracking-[0.2em] mb-4 bg-red-50 px-4 py-2 rounded-full">
                                    <FileText className="w-4 h-4" />
                                    <span>Problem Description</span>
                                </div>
                                <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative group/desc transition duration-500 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                                    <p className="text-xl font-medium leading-relaxed italic relative z-10 text-white/90">
                                        &ldquo;{complaint.problemDescription}&rdquo;
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-amber-500">
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                        <span className="text-sm font-bold text-white/50 tracking-tight">System analysis suggests hardware wear-and-tear.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 border-t border-slate-50 pt-16">
                                <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                                    <h4 className="font-extrabold text-slate-900 leading-none">Technician Assignment</h4>
                                    <p className="text-sm text-slate-500 font-medium italic">
                                        {complaint.status === 'Pending' ? 'Assignment pending – typically happens within 60 minutes.' : 'ROC-Certified Technician dispatched to your vicinity.'}
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                                    <h4 className="font-extrabold text-slate-900 leading-none">Urgency Index</h4>
                                    <div className="flex items-center space-x-3">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-bold text-slate-700">Protected Coverage (ROCare+)</span>
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
