'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // Handle standalone PWA back button mapping
        const handlePopState = (e: PopStateEvent) => {
            // Prevent default and let Next.js router handle it gracefully
            if (window.matchMedia('(display-mode: standalone)').matches) {
                // Allows internal back navigation
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <SessionProvider>
            {children}
            <Toaster position="top-center" />
        </SessionProvider>
    );
}
