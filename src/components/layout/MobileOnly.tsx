import { useState, useEffect } from 'react';
import { Smartphone, Download, Share } from 'lucide-react';
import { motion } from 'framer-motion';

export function MobileOnly({ children }: { children: React.ReactNode }) {
    const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent flicker
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkDisplayMode = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
                || (window.navigator as any).standalone
                || document.referrer.includes('android-app://');

            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            setIsStandalone(isStandaloneMode);
            setIsMobile(isMobileDevice);
        };

        checkDisplayMode();
        // Re-check on resize/rotate
        window.addEventListener('resize', checkDisplayMode);
        return () => window.removeEventListener('resize', checkDisplayMode);
    }, []);

    // For development, allow bypassing via URL param ?bypass=true
    const bypass = new URLSearchParams(window.location.search).get('bypass') === 'true';

    if (bypass) return <>{children}</>;

    if (!isMobile) {
        return (
            <div className="fixed inset-0 z-[99999] bg-background flex items-center justify-center p-8 text-center">
                <div className="max-w-xs">
                    <Smartphone className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
                    <h1 className="text-2xl font-bold mb-4">Mobile Experience Only</h1>
                    <p className="text-muted-foreground leading-relaxed">
                        Please open <strong>Date For You</strong> on your smartphone to start connecting.
                    </p>
                    <div className="mt-8 p-4 bg-card rounded-2xl border border-border">
                        <p className="text-sm">Scan QR or type the URL on your phone's browser.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isStandalone) {
        return (
            <div className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xs space-y-6"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Download className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">Install Date For You</h1>

                    <p className="text-muted-foreground">
                        This app is designed to be used as a native app for the best experience.
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border text-left">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                                <Share className="w-5 h-5" />
                            </div>
                            <p className="text-sm">
                                Tap <strong>'Share'</strong> in your browser menu.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border text-left">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                                <div className="w-5 h-5 border-2 border-foreground rounded flex items-center justify-center text-[10px] font-bold">+</div>
                            </div>
                            <p className="text-sm">
                                Select <strong>'Add to Home Screen'</strong> to install.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground pt-8 uppercase tracking-widest opacity-50">
                        Open the installed app to continue
                    </p>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
