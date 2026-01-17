import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, MessageCircle, Users, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 text-pink-500" />,
      title: "Hinglish AI Chats",
      description: "Talk to real-feeling personas in your own language. No boring bots here."
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: "Emoji Avatars",
      description: "Express yourself with unique emoji identities. Fun, private, and playful."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "Safe & Secure",
      description: "Your privacy is our priority. Controlled environments for real connections."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Instant Matches",
      description: "Find someone who vibes with you instantly. No long waiting times."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">Date For You</span>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/auth')}
          className="rounded-full px-6 hover:bg-primary/10"
        >
          Login
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full opacity-30 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>The Future of Dating is Here</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Next Vibe</span> <br />
              With Emojis.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience a dating app that feels like a game but connects you for real.
              Playful avatars, Hinglish conversations, and zero pressure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(233,64,87,0.4)] transition-all hover:scale-105"
              >
                Join the Waitlist
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl border-border/60 hover:bg-muted/50"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative w-full max-w-5xl mx-auto"
          >
            <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-border/40 shadow-2xl bg-card/30 backdrop-blur-sm">
              <img
                src="/hero_dating_app_1768666510121.png"
                alt="Date For You App Interface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 md:right-10 w-24 h-24 bg-card p-4 rounded-2xl border border-border shadow-xl backdrop-blur-md hidden sm:block"
            >
              <span className="text-4xl">💖</span>
              <p className="text-[10px] mt-2 font-bold uppercase tracking-widest opacity-50 text-foreground">Matched!</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-20 -left-10 w-32 h-16 bg-card p-4 rounded-2xl border border-border shadow-xl backdrop-blur-md hidden sm:block"
            >
              <p className="text-xs font-medium italic">"Aur kya haal?"</p>
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-card border-r border-b border-border rotate-45" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Date For You?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We ditched the boring swipes and forced conversations. Here's what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 bg-card rounded-3xl border border-border/60 hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 px-6 border-y border-border/40 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-12 opacity-50 uppercase tracking-[0.2em] text-center">Trusted by curious hearts</h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-40">
            <div className="flex items-center gap-2 text-3xl font-black">EMOJI MATCH</div>
            <div className="flex items-center gap-2 text-3xl font-black italic">VIBE CHECK</div>
            <div className="flex items-center gap-2 text-3xl font-black">HINGLISH.AI</div>
            <div className="flex items-center gap-2 text-3xl font-black tracking-tighter">DATE4U</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-primary to-purple-600 text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to find your match?</h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto">
              Skip the small talk and dive into real vibes. Start your journey with emojis today.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="h-16 px-12 text-xl rounded-2xl bg-white text-primary hover:bg-white/90 transition-all hover:scale-105"
            >
              Get Started Now
            </Button>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-900/40 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-bold">Date For You</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Date For You. Made with 💖</p>
        </div>
      </footer>
    </div>
  );
}
