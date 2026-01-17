import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        preferences: [] as string[],
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/');
                return;
            }

            const { data: profile } = await supabase
                .from('users')
                .select('onboarding_completed')
                .eq('id', user.id)
                .single();

            if (profile?.onboarding_completed) {
                navigate('/discover');
            }
        };
        checkUser();
    }, [navigate]);

    const vibes = ['Chill', 'Adventurous', 'Deep Conversations', 'Party', 'Foodie', 'Fitness', 'Artistic', 'Techie'];

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const toggleVibe = (vibe: string) => {
        setFormData((prev) => ({
            ...prev,
            preferences: prev.preferences.includes(vibe)
                ? prev.preferences.filter((v) => v !== vibe)
                : [...prev.preferences, vibe],
        }));
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error } = await supabase.from('users').upsert({
                id: user.id,
                name: formData.name,
                age: parseInt(formData.age),
                gender: formData.gender,
                preferences: formData.preferences,
                onboarding_completed: true,
            });

            if (error) throw error;
            navigate('/discover');
        } catch (error: any) {
            console.error('Onboarding error:', error.message);
            // Fallback for development
            navigate('/discover');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground px-6 py-12 flex flex-col">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-12 justify-center">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-muted'
                            }`}
                    />
                ))}
            </div>

            <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-3xl font-semibold mb-2">Tell us about you</h2>
                                <p className="text-muted-foreground">This helps us find the right matches.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <Input
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-12 bg-card border-none rounded-xl px-4 text-white focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                                    <Input
                                        type="number"
                                        placeholder="Your age"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="h-12 bg-card border-none rounded-xl px-4 text-white focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-3xl font-semibold mb-2">What's your vibe?</h2>
                                <p className="text-muted-foreground">Select what you're interested in.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {vibes.map((vibe) => (
                                    <button
                                        key={vibe}
                                        onClick={() => toggleVibe(vibe)}
                                        className={`px-4 py-2 rounded-full border transition-all ${formData.preferences.includes(vibe)
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-border text-muted-foreground hover:border-muted'
                                            }`}
                                    >
                                        {vibe}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6 text-center"
                        >
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-semibold mb-2">All set!</h2>
                                <p className="text-muted-foreground">
                                    You're ready to start finding connections.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-auto pt-8 flex gap-4">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 h-14 rounded-xl border-border text-muted-foreground hover:bg-card"
                        >
                            <ChevronLeft className="mr-2 w-5 h-5" />
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={step === 3 ? handleFinish : nextStep}
                        disabled={loading}
                        className="flex-1 h-14 rounded-xl bg-primary text-white hover:bg-primary/90"
                    >
                        {loading ? 'Saving...' : step === 3 ? 'Start Swiping' : 'Next'}
                        {!loading && step < 3 && <ChevronRight className="ml-2 w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
