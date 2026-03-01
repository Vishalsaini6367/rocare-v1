'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        // Register our custom Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/' })
                .then((reg) => {
                    console.log('SW registered:', reg.scope);
                    // Force update if a new SW is waiting
                    if (reg.waiting) {
                        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New SW available, reload to use it
                                    window.location.reload();
                                }
                            });
                        }
                    });
                })
                .catch((err) => console.error('SW registration failed:', err));
        }
    }, []);

    return (
        <SessionProvider>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '1rem',
                        fontWeight: 'bold',
                    },
                }}
            />
        </SessionProvider>
    );
}
