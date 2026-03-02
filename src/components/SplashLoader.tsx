'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        let hasSeenSplash = false;
        try {
            hasSeenSplash = !!sessionStorage.getItem('rocare_splash_seen_v2');
        } catch (e) {
            console.warn("Storage access denied:", e);
        }

        if (hasSeenSplash) {
            setShouldRender(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
            try {
                sessionStorage.setItem('rocare_splash_seen_v2', 'true');
            } catch (_e) {
                // Ignore storage errors on exit
            }
            setTimeout(() => setShouldRender(false), 1000);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(20px)",
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center overflow-hidden"
                >
                    {/* Dynamic Particle Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * 100 + "%",
                                    y: "110%",
                                    scale: Math.random() * 0.5 + 0.5,
                                    opacity: 0
                                }}
                                animate={{
                                    y: "-10%",
                                    opacity: [0, 0.5, 0],
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2,
                                    delay: Math.random() * 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[2px]"
                            />
                        ))}
                    </div>

                    {/* Central Interactive Animation */}
                    <div className="relative flex flex-col items-center">
                        {/* Ripple Effect Layers */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute w-64 h-64 border-2 border-blue-500/30 rounded-full"
                        />
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.5], opacity: [0.3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                            className="absolute w-64 h-64 border-2 border-blue-400/20 rounded-full"
                        />

                        {/* Main Logo Sphere */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                delay: 0.2
                            }}
                            className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)] relative z-10 group"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 text-white fill-current drop-shadow-lg">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                                </svg>
                            </motion.div>
                        </motion.div>

                        {/* Liquid Text Reveal */}
                        <div className="mt-12 flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="relative"
                            >
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                                    RO<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Care</span>
                                </h1>
                                {/* Shimmer Effect */}
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full skew-x-[-20deg] pointer-events-none"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-8 flex flex-col items-center"
                            >
                                {/* Progress Bar v2 */}
                                <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2.5, ease: "easeInOut" }}
                                        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
