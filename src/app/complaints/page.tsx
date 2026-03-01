'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ClipboardList, CheckCircle, Clock, AlertCircle, MessageSquarePlus, Activity, ArrowRight, Star, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UserComplaintsPage() {
    const { data: session } = useSession();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    if (session && (session.user as any).role === 'admin') {
        redirect('/admin/complaints');
    }

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await fetch('/api/complaints');
            const data = await response.json();
            setComplaints(data);
        } catch (error) {
            toast.error('Failed to fetch complaints');
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
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Analyzing Your Network...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 animate-fade-in group">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition duration-300">Service Timeline</h1>
                        <p className="text-lg text-slate-500 font-medium italic">Track your RO maintenance and repair requests in real-time.</p>
                    </div>
                    <Link
                        href="/complaints/new"
                        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center space-x-3 transform active:scale-95 group-hover:shadow-2xl"
                    >
                        <MessageSquarePlus className="w-5 h-5" />
                        <span>New Complaint</span>
                    </Link>
                </div>

                <div className="space-y-12">
                    {complaints.length > 0 ? (
                        complaints.map((complaint) => (
                            <div key={complaint._id} className="group flex flex-col items-center bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-500/10 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 text-right">
                                    <div className={`inline-flex items-center px-6 py-2 border-2 rounded-full text-sm font-extrabold uppercase tracking-widest mb-4 z-10 relative ${getStatusColor(complaint.status)}`}>
                                        {complaint.status === 'Pending' && <AlertCircle className="w-4 h-4 mr-2" />}
                                        {complaint.status === 'In Progress' && <Activity className="w-4 h-4 mr-2 animate-pulse" />}
                                        {complaint.status === 'Completed' && <CheckCircle className="w-4 h-4 mr-2" />}
                                        <span>{complaint.status}</span>
                                    </div>
                                    <div className="flex items-center justify-end space-x-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
                                        <Clock className="w-4 h-4" />
                                        <span>Created {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="w-full relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-12">
                                    <div className="flex-1">
                                        <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-extrabold uppercase tracking-widest mb-6 bg-blue-50 px-3 py-1.5 rounded-full">
                                            <Star className="w-4 h-4" />
                                            <span>Ticket Detail</span>
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-slate-900 mb-6 group-hover:text-blue-600 transition tracking-tight">Support Ticket Analysis</h3>
                                        <p className="text-lg text-slate-500 font-medium italic leading-relaxed mb-10 max-w-2xl px-6 border-l-4 border-slate-200 p-6 bg-slate-50/50 rounded-r-3xl">
                                            "{complaint.problemDescription}"
                                        </p>

                                        <div className="flex items-center space-x-12">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 leading-none">Registered With</span>
                                                <span className="text-sm font-bold text-slate-700 italic">{complaint.mobileNumber}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 leading-none">Quality Standard</span>
                                                <div className="flex items-center space-x-2">
                                                    <HeartPulse className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm font-bold text-red-600 italic">Certified Support</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:w-64 pt-10 text-right">
                                        <Link href={`/complaints/${complaint._id}`} className="inline-flex items-center space-x-4 px-10 py-5 bg-slate-900 text-white font-extrabold rounded-3xl hover:bg-black transition group/btn shadow-xl shadow-slate-200">
                                            <span>Full Detail</span>
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition duration-300" />
                                        </Link>
                                        <p className="mt-6 text-xs text-slate-400 font-bold uppercase tracking-[0.2em] italic">Service ID: #{complaint._id.slice(-6)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-slate-100 shadow-xl group hover:shadow-2xl transition duration-500">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-inner group-hover:bg-blue-50 transition">
                                <ClipboardList className="w-12 h-12 text-slate-300 group-hover:text-blue-400 transition" />
                            </div>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Fresh service record</h2>
                            <p className="text-xl text-slate-400 font-medium italic mb-12">You haven't submitted any service tickets yet.</p>
                            <Link href="/complaints/new" className="inline-flex items-center px-12 py-5 bg-blue-600 text-white font-extrabold rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition transform hover:-translate-y-1">
                                Register Your First Ticket
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
