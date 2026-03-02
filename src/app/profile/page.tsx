'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Shield, Loader2, Save, Trash2, Droplet, Star, Clock, Camera, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: '',
        createdAt: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter(); void router;

    // Format a date to IST locale string
    const toIST = (isoDate: string, opts: Intl.DateTimeFormatOptions) =>
        new Date(isoDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...opts });

    // Current IST time
    const nowIST = () =>
        new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

    const compressImage = (dataUrl: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 400;
                let w = img.width, h = img.height;
                if (w > h) { h = Math.round(h * MAX / w); w = MAX; } else { w = Math.round(w * MAX / h); h = MAX; }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = dataUrl;
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large (max 5MB)');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string);
            setFormData((prev: any) => ({ ...prev, image: compressed }));
            toast.success('Photo ready! Click Synchronize to save.');
        };
        reader.onerror = () => toast.error('Error reading file');
        reader.readAsDataURL(file);
    };

    const startCamera = () => {
        setShowCamera(true);
    };

    useEffect(() => {
        async function enableStream() {
            if (showCamera && videoRef.current) {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'user', width: { ideal: 1024 }, height: { ideal: 1024 } }
                    });
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } catch (err) {
                    console.error("Camera access error:", err);
                    toast.error("Could not access camera. Please ensure permissions are granted.");
                    setShowCamera(false);
                }
            }
        }
        enableStream();
    }, [showCamera]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track: any) => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const raw = canvasRef.current.toDataURL('image/jpeg', 1.0);
                const compressed = await compressImage(raw);
                setFormData((prev: any) => ({ ...prev, image: compressed }));
                stopCamera();
                toast.success('Photo captured! Click Synchronize to save.');
            }
        }
    };

    if (!session) {
        redirect('/auth/login');
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile', { cache: 'no-store' });
            const data = await response.json();
            setFormData({ name: data.name, email: data.email, image: data.image || '', createdAt: data.createdAt || '' });
        } catch (_error) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const body = JSON.stringify(formData);
            console.log('Saving profile, body size KB:', Math.round(body.length / 1024));

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully!');
                await update({ name: formData.name });
                router.push('/');
            } else {
                console.error('Profile update failed:', data);
                toast.error(`Failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-bold text-slate-900 tracking-tight italic">Accessing ROCare Records...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16 animate-fade-in group space-y-12 md:space-y-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                    <div className="lg:w-1/3 space-y-8 md:space-y-12">
                        <div>
                            <h1 className="mb-4 group-hover:text-blue-600 transition">Identity & Access</h1>
                            <p className="italic">Manage your account credentials and ROCare membership details.</p>
                        </div>

                        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200 text-white relative overflow-hidden group/card transform hover:-translate-y-2 transition duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                            <div className="flex flex-col items-center mb-8 md:mb-10 relative z-10">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-[1.8rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-8 border border-white/10 overflow-hidden shadow-2xl group-hover/card:scale-110 transition duration-500">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl md:text-4xl font-black text-blue-500">{formData.name[0]}</span>
                                    )}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 leading-none text-center">{formData.name}</h2>
                                <div className="inline-flex items-center space-x-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed italic mb-6">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Verified {(session?.user as any).role} Member</span>
                                </div>
                            </div>

                            <div className="space-y-6 md:space-y-10 relative z-10">
                                <div className="flex items-center space-x-4 md:space-x-6 border-b border-white/5 pb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                        <Droplet className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="block text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Membership Since</span>
                                        <span className="text-xs md:text-sm font-bold text-white leading-none">
                                            {formData.createdAt
                                                ? toIST(formData.createdAt, { month: 'short', year: 'numeric' })
                                                : '—'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 md:space-x-6 border-b border-white/5 pb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                        <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <span className="block text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Tier Level</span>
                                        <span className="text-xs md:text-sm font-bold text-white leading-none">Premium ROCare+ Member</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 md:space-x-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <span className="block text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Last Active</span>
                                        <span className="text-xs md:text-sm font-bold text-white leading-none">
                                            {nowIST()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/3">
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 group/form">
                            <div className="flex items-center justify-between mb-10 md:mb-12">
                                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none group-hover/form:text-blue-600 transition">Profile Settings</h2>
                                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                    <Save className="w-5 h-5" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                                <div className="group/field mb-8 md:mb-10">
                                    <label className="block text-sm font-black text-slate-700 mb-6 pl-2 group-hover/field:text-blue-600 transition">Update Photo</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden group/pfp transition duration-500">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black text-3xl md:text-4xl">
                                                    {formData.name[0]}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/pfp:opacity-100 transition flex items-center justify-center pointer-events-none group-hover/pfp:pointer-events-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((prev: any) => ({ ...prev, image: '' }))}
                                                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-1 sm:flex-none flex items-center justify-center space-x-3 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition font-bold text-slate-600 hover:text-blue-600 text-sm md:text-base"
                                            >
                                                <Upload className="w-5 h-5" />
                                                <span>Gallery</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="flex-1 sm:flex-none flex items-center justify-center space-x-3 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition font-bold text-slate-600 hover:text-blue-600 text-sm md:text-base"
                                            >
                                                <Camera className="w-5 h-5" />
                                                <span>Camera</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                    <div className="group/field">
                                        <label className="block text-xs md:text-sm font-black text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] md:rounded-[1.8rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm md:text-base"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group/field">
                                        <label className="block text-xs md:text-sm font-black text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition uppercase tracking-widest">Email Address</label>
                                        <div className="relative opacity-60 pointer-events-none">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 md:h-5 md:w-5 text-slate-400 transition" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                readOnly
                                                className="block w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-slate-100 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[1.8rem] text-slate-900 font-bold text-sm md:text-base"
                                                value={formData.email}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 bg-blue-50 rounded-3xl border border-blue-100">
                                    <p className="text-blue-800 text-xs md:text-sm font-bold leading-relaxed italic">
                                        Account security is our priority. Please contact our support team to change your authenticated email address or membership role.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-blue-600 text-white font-black text-lg md:text-xl rounded-2xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transform active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center space-x-4"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Save className="w-5 h-5 md:w-6 md:h-6" />}
                                        <span>Sync Changes</span>
                                    </button>

                                    <button type="button" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white border-2 border-slate-100 text-red-500 font-bold text-sm md:text-lg rounded-2xl hover:bg-red-50 hover:border-red-100 transition flex items-center justify-center space-x-3 group/delete">
                                        <Trash2 className="w-5 h-5 md:w-6 md:h-6 group-hover/delete:scale-110 transition" />
                                        <span>Deactivate</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl transform translate-x-12 -translate-y-12"></div>

                        <button
                            type="button"
                            onClick={stopCamera}
                            className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition group/close"
                        >
                            <X className="w-6 h-6 group-hover/close:rotate-90 transition duration-300" />
                        </button>

                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Member Photo Booth</h2>
                            <p className="text-slate-500 font-medium italic">Update your ROCare identity photo.</p>
                        </div>

                        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-inner aspect-square mb-10">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="flex space-x-6">
                            <button
                                onClick={captureImage}
                                className="flex-1 py-6 bg-blue-600 text-white font-extrabold text-xl rounded-3xl shadow-2xl shadow-blue-300 hover:bg-blue-700 transform active:scale-95 transition-all"
                            >
                                Take Photo
                            </button>
                            <button
                                onClick={stopCamera}
                                className="px-10 py-6 bg-slate-100 text-slate-500 font-bold text-xl rounded-3xl hover:bg-slate-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
