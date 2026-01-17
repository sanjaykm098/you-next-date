import { useState, useEffect } from 'react';
import { Smartphone, Download, Share, Plus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function MobileOnly({ children }: { children: React.ReactNode }) {
    const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent flicker
    const [isMobile, setIsMobile] = useState(true);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const checkDisplayMode = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
                || (window.navigator as any).standalone
                || document.referrer.includes('android-app://');

            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            setIsStandalone(isStandaloneMode);
            setIsMobile(isMobileDevice);
        };

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        checkDisplayMode();
        window.addEventListener('resize', checkDisplayMode);
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('resize', checkDisplayMode);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        setDeferredPrompt(null);
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/onboarding'
            }
        });
    };

    // For development, allow bypassing via URL param ?bypass=true
    const bypass = new URLSearchParams(window.location.search).get('bypass') === 'true';

    if (bypass) return <>{children}</>;

    // 1. DESKTOP BLOCKER (Show QR)
    if (!isMobile) {
        return (
            <div className="fixed inset-0 z-[99999] bg-background flex items-center justify-center p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full py-12 flex flex-col items-center text-center space-y-8"
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                        <Smartphone className="w-8 h-8 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Mobile Experience Only</h1>
                        <p className="text-muted-foreground">
                            Open <strong>Date For You</strong> on your phone to start matching.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-[2rem] shadow-xl border border-border">
                        <QRCodeSVG
                            value={window.location.origin}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-black/40">Scan to Open</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 w-full">
                        <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">1</div>
                            <p className="text-sm">Scan the QR code with your phone camera.</p>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">2</div>
                            <p className="text-sm">Open the link in your browser.</p>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">3</div>
                            <p className="text-sm">Install the app for the best experience.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border w-full">
                        <p className="text-sm text-muted-foreground mb-4">Want to login first?</p>
                        <Button
                            onClick={handleGoogleLogin}
                            variant="outline"
                            className="w-full h-12 rounded-xl gap-2 hover:bg-muted"
                        >
                            <LogIn className="w-4 h-4" />
                            Continue with Google
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 2. MOBILE INSTALL BLOCKER
    if (!isStandalone) {
        return (
            <div className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xs space-y-6 w-full py-8"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Download className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">Install the App</h1>

                    <p className="text-muted-foreground text-sm">
                        Install <strong>Date For You</strong> on your home screen to enable smooth scrolling and native features.
                    </p>

                    {/* Browser Native Prompt Button (If Available) */}
                    {deferredPrompt && (
                        <Button
                            onClick={handleInstallClick}
                            className="w-full h-14 rounded-2xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/20"
                        >
                            Install Now
                        </Button>
                    )}

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border text-left">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                                <Share className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium">
                                1. Tap <strong>'Share'</strong> in browser menu.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border text-left">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0 font-black">
                                <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium">
                                2. Select <strong>'Add to Home Screen'</strong>.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border text-left">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 font-black text-primary">
                                ✓
                            </div>
                            <p className="text-sm font-medium">
                                3. Open from home screen.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4">
                        <Button
                            onClick={handleGoogleLogin}
                            variant="ghost"
                            className="text-primary font-bold hover:bg-primary/5"
                        >
                            Or Login with Google First
                        </Button>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                            Highly recommended for mobile
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
