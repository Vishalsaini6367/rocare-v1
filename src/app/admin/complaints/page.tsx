'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ClipboardList, User, Phone, MapPin, FileText, CheckCircle, Clock, AlertCircle, Eye, MoreHorizontal, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminComplaintsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchComplaints();
        }
    }, [status]);

    const fetchComplaints = async () => {
        try {
            const response = await fetch('/api/complaints', { cache: 'no-store' });
            const data = await response.json();
            setComplaints(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/complaints/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success(`Complaint marked as ${newStatus}`);
                fetchComplaints();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-red-50 text-red-600 border-red-100';
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const [activeTab, setActiveTab] = useState<'all' | 'Pending' | 'In Progress' | 'Completed'>('all');

    const filteredComplaints = activeTab === 'all'
        ? complaints
        : complaints.filter(c => c.status === activeTab);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Decrypting Service Requests...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 animate-fade-in group">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition duration-300">Service Taskmaster</h1>
                        <p className="text-lg text-slate-500 font-medium italic">Manage all user complaints and technician assignments from one place.</p>
                    </div>
                    <div className="flex items-center space-x-12 px-8 py-5 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-red-500">{complaints.filter(c => c.status === 'Pending').length}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Unassigned</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-900 tracking-tighter">89%</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">SLA Rating</span>
                        </div>
                    </div>
                </div>

                {/* Tab Interface - Scrollable on mobile */}
                <div className="flex items-center space-x-2 md:space-x-4 mb-10 p-2 bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 overflow-x-auto no-scrollbar shadow-sm">
                    {['all', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-[1rem] md:rounded-2xl font-bold text-xs md:text-sm transition-all duration-300 transform active:scale-95 whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 md:gap-12">
                    {filteredComplaints.map((complaint) => (
                        <div key={complaint._id} className="group bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 relative overflow-hidden">
                            {/* Status Badge - Repositioned for mobile */}
                            <div className="flex flex-col md:absolute md:top-0 md:right-0 p-0 md:p-10 mb-6 md:mb-0 text-left md:text-right">
                                <div className={`inline-flex items-center w-fit md:ml-auto px-4 md:px-6 py-1.5 md:py-2 border-2 rounded-full text-[10px] md:text-sm font-extrabold uppercase tracking-widest mb-2 md:mb-4 ${getStatusColor(complaint.status)}`}>
                                    {complaint.status === 'Pending' && <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />}
                                    {complaint.status === 'In Progress' && <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 animate-pulse" />}
                                    {complaint.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />}
                                    <span>{complaint.status}</span>
                                </div>
                                <div className="flex items-center md:justify-end space-x-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
                                <div className="md:col-span-1 md:border-r border-slate-50 md:pr-8">
                                    <div className="flex items-center space-x-4 mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg font-black text-lg md:text-xl overflow-hidden relative group/avatar">
                                            <span className="relative z-10">{complaint.clientName[0]}</span>
                                            <div className="absolute inset-0 bg-blue-600 scale-0 group-hover/avatar:scale-100 transition duration-300"></div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1 md:mb-2 truncate">{complaint.clientName}</h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block truncate">ID: #{complaint._id.slice(-6)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="flex items-center space-x-3 md:space-x-4 group/item">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center border border-slate-100">
                                                <Phone className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 font-bold text-xs md:text-sm">{complaint.mobileNumber}</p>
                                        </div>
                                        <div className="flex items-start space-x-3 md:space-x-4 group/item">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center border border-slate-100 px-1">
                                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed truncate">{complaint.location}</p>
                                                {complaint.lat && complaint.lng && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${complaint.lat},${complaint.lng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 bg-blue-50 px-2 py-1 rounded w-fit"
                                                    >
                                                        View Map
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="inline-flex items-center space-x-2 text-blue-600 text-[10px] font-extrabold uppercase tracking-widest mb-4 md:mb-6 bg-blue-50 px-3 py-1.5 rounded-full">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Problem Report</span>
                                    </div>
                                    <h4 className="text-lg md:text-2xl font-extrabold text-slate-900 mb-4 md:mb-6 group-hover:text-blue-600 transition duration-300">System MalfunctionAnalysis</h4>
                                    <p className="text-sm md:text-lg text-slate-500 font-medium italic leading-relaxed mb-6 md:mb-10 px-4 border-l-4 border-slate-100 p-3 md:p-4 bg-slate-50/50 rounded-r-xl md:rounded-r-2xl">
                                        "{complaint.problemDescription}"
                                    </p>

                                    <div className="flex items-center space-x-6 md:space-x-12 pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Registered With</span>
                                            <span className="text-xs md:text-sm font-bold text-slate-700 italic truncate max-w-[120px] md:max-w-none">{complaint.userId?.email || 'Guest Portal'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Priority</span>
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                                                <span className="text-xs md:text-sm font-bold text-amber-600 italic uppercase">High</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1 md:border-l border-slate-50 md:pl-8 flex flex-col justify-center gap-3 md:gap-4">
                                    {complaint.status === 'Pending' && (
                                        <button
                                            onClick={() => updateStatus(complaint._id, 'In Progress')}
                                            className="w-full flex items-center justify-between px-6 md:px-8 py-4 md:py-5 bg-blue-600 text-white font-extrabold rounded-xl md:rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition group/btn"
                                        >
                                            <span className="text-sm md:text-base">Process Task</span>
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition duration-300" />
                                        </button>
                                    )}
                                    {complaint.status === 'In Progress' && (
                                        <button
                                            onClick={() => updateStatus(complaint._id, 'Completed')}
                                            className="w-full flex items-center justify-between px-6 md:px-8 py-4 md:py-5 bg-green-600 text-white font-extrabold rounded-xl md:rounded-2xl hover:bg-green-700 shadow-xl shadow-green-200 transition group/btn"
                                        >
                                            <span className="text-sm md:text-base">Deliver Closure</span>
                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:scale-110 transition duration-300" />
                                        </button>
                                    )}

                                    <button className="w-full py-4 md:py-5 border-2 border-slate-100 text-slate-400 font-bold rounded-xl md:rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center space-x-2 md:space-x-3">
                                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="text-sm md:text-base">Inspect</span>
                                    </button>
                                    <button className="w-full py-4 md:py-5 border-2 border-slate-100 text-slate-400 font-bold rounded-xl md:rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center space-x-2 md:space-x-3">
                                        <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="text-sm md:text-base">Options</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredComplaints.length === 0 && (
                        <div className="py-20 md:py-32 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-8 md:mb-10">
                                <ClipboardList className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-none px-4">No active service requests</h2>
                            <p className="text-base md:text-lg text-slate-500 font-medium italic px-6">Congratulations! You are all caught up for the moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
