import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        avatar: '',
        preferences: [] as string[],
    });

    const emojis = ['👨‍💻', '👩‍💻', '🎨', '✈️', '🏋️', '🧘‍♀️', '🍳', '🎸', '📸', '📚', '🐶', '🍕', '🎮', '🏄', '🧗', '🚵', '🏊', '🏀', '⚽', '⚾'];

    const vibes = ['Chill', 'Adventurous', 'Deep Conversations', 'Party', 'Foodie', 'Fitness', 'Artistic', 'Techie'];

    const nextStep = () => {
        if (step === 1 && (!formData.name || !formData.age || !formData.gender)) {
            toast.error('Please fill in all fields');
            return;
        }
        if (step === 2 && !formData.avatar) {
            toast.error('Please select an avatar');
            return;
        }
        setStep((s) => Math.min(s + 1, 4));
    };
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
        if (!formData.name || !formData.age || !formData.gender) {
            return;
        }

        const ageNum = parseInt(formData.age);
        if (ageNum < 18) {
            toast.error("You must be at least 18 years old to use this app.");
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error } = await supabase.from('users').upsert({
                id: user.id,
                name: formData.name,
                age: ageNum,
                gender: formData.gender,
                photos: [formData.avatar],
                preferences: formData.preferences,
                onboarding_completed: true,
            });

            if (error) throw error;
            navigate('/discover');
        } catch (error: any) {
            console.error('Onboarding full error:', error);
            toast.error('Failed to save profile: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground px-6 py-12 flex flex-col">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-12 justify-center">
                {[1, 2, 3, 4].map((i) => (
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
                                        min={18}
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="h-12 bg-card border-none rounded-xl px-4 text-white focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                                    <div className="flex gap-4">
                                        {['Male', 'Female'].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setFormData({ ...formData, gender: g })}
                                                className={`flex-1 h-12 rounded-xl border transition-colors ${formData.gender === g
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'border-border text-muted-foreground hover:bg-card'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
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
                                <h2 className="text-3xl font-semibold mb-2">Choose your avatar</h2>
                                <p className="text-muted-foreground">Pick an emoji that represents you.</p>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {emojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => setFormData({ ...formData, avatar: emoji })}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${formData.avatar === emoji
                                            ? 'bg-primary text-white scale-110 shadow-lg'
                                            : 'bg-card text-foreground hover:bg-card/80'
                                            }`}
                                    >
                                        {emoji}
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

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6 text-center"
                        >
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">{formData.avatar || '😎'}</span>
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
                        onClick={step === 4 ? handleFinish : nextStep}
                        disabled={loading}
                        className="flex-1 h-14 rounded-xl bg-primary text-white hover:bg-primary/90"
                    >
                        {loading ? 'Saving...' : step === 4 ? 'Start Swiping' : 'Next'}
                        {!loading && step < 4 && <ChevronRight className="ml-2 w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
