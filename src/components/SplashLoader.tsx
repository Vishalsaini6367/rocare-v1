'use client';

import { useState, useEffect } from 'react';
import { Droplet } from 'lucide-react';

export function SplashLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Only show splash on the first visit in a session
        const hasSeenSplash = sessionStorage.getItem('rocare_splash_seen');
        if (hasSeenSplash) {
            setShouldRender(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('rocare_splash_seen', 'true');
            // Remove from DOM after fade out
            setTimeout(() => setShouldRender(false), 800);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-blue-400/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>

                <div className="relative flex flex-col items-center">
                    {/* Animated Logo */}
                    <div className="bg-blue-600 p-6 rounded-[2rem] shadow-2xl shadow-blue-200 mb-8 animate-[splash-bounce_2s_infinite]">
                        <Droplet className="w-16 h-16 text-white" />
                    </div>

                    {/* Animated Name */}
                    <div className="overflow-hidden">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 animate-[text-reveal_1.2s_ease-out_forwards]">
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                ROCare
                            </span>
                        </h1>
                    </div>

                    {/* Subtext */}
                    <div className="mt-4 flex flex-col items-center animate-[fade-up_1s_ease-out_0.5s_forwards] opacity-0">
                        <p className="text-slate-400 font-black text-[10px] md:text-sm uppercase tracking-[0.4em] mb-8 italic">
                            Purifying Life Since 2024
                        </p>

                        {/* Professional Loading Line */}
                        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-full animate-[loading-bar_2s_ease-in-out_infinite] origin-left"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credits at Bottom */}
            <div className="absolute bottom-12 animate-[fade-in_1s_ease-out_1s_forwards] opacity-0">
                <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">A Vishal Saini Product</p>
            </div>

            <style jsx global>{`
                @keyframes splash-bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                @keyframes text-reveal {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes loading-bar {
                    0% { transform: scaleX(0); }
                    50% { transform: scaleX(0.7); }
                    100% { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
}
