import { Droplet } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[100] flex items-center justify-center animate-fade-in">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Droplet className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center">
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tighter">
                        ROCare
                    </span>
                    <p className="mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">
                        Synchronizing...
                    </p>
                </div>
            </div>
        </div>
    );
}
