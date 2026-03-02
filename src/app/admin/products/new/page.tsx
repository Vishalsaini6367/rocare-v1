'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ShoppingBag, Tag, Image as ImageIcon, FileText, Loader2, ArrowLeft, Layers, ShieldCheck, HeartPulse, CheckCircle, Camera, Upload, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
    });
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const compressImage = (dataUrl: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 800;
                let w = img.width, h = img.height;
                if (w > h) { h = Math.round(h * MAX / w); w = MAX; } else { w = Math.round(w * MAX / h); h = MAX; }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = dataUrl;
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File is too large (max 5MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const compressed = await compressImage(reader.result as string);
                setFormData(prev => ({ ...prev, image: compressed }));
                toast.success("Photo optimized!");
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setShowCamera(true);
        } catch (_err) {
            toast.error("Could not access camera");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
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
                setFormData(prev => ({ ...prev, image: compressed }));
                stopCamera();
                toast.success("Image captured and optimized!");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Product registered successfully!');
                router.push('/admin/products');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Something went wrong');
            }
        } catch (_error) {
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in group">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition font-bold uppercase tracking-[0.2em] text-xs mb-10 group/back hover:translate-x-[-8px] transition duration-300"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Catalog Management</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-blue-600 transition duration-300">Register New System</h1>
                        <p className="text-lg text-slate-500 font-medium italic">Expand your premium collection of purified water solutions.</p>
                    </div>
                    <div className="flex items-center space-x-12 px-8 py-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-blue-600">Fresh</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Catalog</span>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-900 tracking-tighter">100%</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Authentic</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-16">
                    <div className="lg:col-span-3 space-y-10">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden group/form">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl transform translate-x-24 -translate-y-24"></div>

                            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                <div className="space-y-8">
                                    <div className="group/field">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition">Product Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <ShoppingBag className="h-5 w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-base sm:text-lg"
                                                placeholder="e.g. PureStream Extreme RO"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="group/field">
                                            <label className="block text-sm font-bold text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition">Price (INR)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                    <Tag className="h-5 w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                                </div>
                                                <input
                                                    type="number"
                                                    required
                                                    className="block w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-base sm:text-lg"
                                                    placeholder="0.00"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="group/field">
                                            <label className="block text-sm font-bold text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition">System Class</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                    <Layers className="h-5 w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                                </div>
                                                <select className="block w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none text-base sm:text-lg">
                                                    <option>Domestic RO</option>
                                                    <option>Commercial RO</option>
                                                    <option>Industrial Plant</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group/field">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition">System Image</label>

                                        {!formData.image ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] hover:border-blue-500 hover:bg-blue-50 transition-all group/upload"
                                                >
                                                    <Upload className="w-8 h-8 text-slate-400 group-hover/upload:text-blue-500 mb-2 transition" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gallery</span>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={startCamera}
                                                    className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] hover:border-blue-500 hover:bg-blue-50 transition-all group/camera"
                                                >
                                                    <Camera className="w-8 h-8 text-slate-400 group-hover/camera:text-blue-500 mb-2 transition" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Capture</span>
                                                </button>
                                                <div className="col-span-2">
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                            <ImageIcon className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="block w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-base sm:text-lg"
                                                            placeholder="Or paste Image URL here..."
                                                            value={formData.image}
                                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-[1.5rem] overflow-hidden border-2 border-blue-500/20 group/imgpreview">
                                                <img src={formData.image} alt="System Preview" className="w-full h-48 object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/imgpreview:opacity-100 transition flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                        className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition transform hover:scale-110"
                                                    >
                                                        <Trash2 className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="group/field">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 pl-2 group-hover/field:text-blue-600 transition">System Description</label>
                                        <div className="relative">
                                            <div className="absolute top-6 left-6 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-slate-400 group-hover/field:text-blue-500 transition" />
                                            </div>
                                            <textarea
                                                required
                                                rows={6}
                                                className="block w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium resize-none text-base sm:text-lg"
                                                placeholder="Describe the multi-stage filtration process and smart features..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-4">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-bold text-slate-700">Auto-Apply Compliance Standards</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium italic">By registering this product, you confirm that it meets the WHO and EPA water quality standards after purification.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-6 px-10 bg-blue-600 text-white font-extrabold text-xl rounded-[1.8rem] shadow-2xl shadow-blue-300 hover:bg-blue-700 transform active:scale-[0.98] transition-all disabled:opacity-70 group/btn"
                                >
                                    {loading ? (
                                        <Loader2 className="w-8 h-8 animate-spin mr-3" />
                                    ) : (
                                        <>
                                            <span>Register to Catalog</span>
                                            <ShoppingBag className="w-6 h-6 ml-3 group-hover/btn:translate-x-1 transition duration-300" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden h-fit">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
                            <h2 className="text-2xl font-extrabold mb-10 tracking-tight leading-tight">Live Catalog Preview</h2>

                            <div className="bg-white/10 rounded-[2.5rem] p-8 border border-white/10 backdrop-blur-sm group/preview">
                                <div className="w-full aspect-[4/3] bg-white/5 rounded-[2rem] mb-8 flex items-center justify-center p-8 border border-white/5 overflow-hidden">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Catalog Preview" className="w-full h-full object-contain mix-blend-screen" />
                                    ) : (
                                        <ImageIcon className="w-16 h-16 text-white/10 animate-pulse" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight leading-none mb-3 truncate">{formData.name || 'System Name'}</h3>
                                <p className="text-blue-300 font-extrabold text-3xl tracking-tighter mb-8">₹{formData.price || '0'}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-white/60 font-medium text-xs uppercase tracking-widest leading-none">
                                        <ShieldCheck className="w-4 h-4 text-green-400" />
                                        <span>Official Certification</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-white/60 font-medium text-xs uppercase tracking-widest leading-none">
                                        <HeartPulse className="w-4 h-4 text-blue-400" />
                                        <span>Ro + UV + UF Technology</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 px-6 py-5 bg-blue-600/30 rounded-2xl border border-blue-600/20 text-blue-200 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed italic text-center">
                                Review all specifications before saving to avoid catalog downtime.
                            </div>
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
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Live Capture</h2>
                            <p className="text-slate-500 font-medium italic">Position the RO system in the frame.</p>
                        </div>

                        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-inner aspect-video mb-10">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="flex space-x-6">
                            <button
                                onClick={captureImage}
                                className="flex-1 py-6 bg-blue-600 text-white font-extrabold text-xl rounded-3xl shadow-2xl shadow-blue-300 hover:bg-blue-700 transform active:scale-95 transition-all"
                            >
                                Capture System
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
