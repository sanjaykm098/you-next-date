import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, Sparkles, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Persona } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

function SwipeCard({
  persona,
  onSwipe,
  isTop,
  isSwiping
}: {
  persona: Persona;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  isSwiping: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className={cn(
        'absolute w-full aspect-[3/4] max-w-sm',
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      )}
      style={{ x, rotate, opacity }}
      drag={isTop && !isSwiping ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 }
      }}
    >
      {/* Card */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-card shadow-2xl">
        {/* Photo */}
        {/* Avatar Emoji (No Photos) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <span className="text-[150px]" role="img" aria-label="avatar">
            {persona.photos?.[0] || (persona.gender === 'Male' ? '👱‍♂️' : '👩‍🦰')}
          </span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Like indicator */}
        <motion.div
          className="absolute top-8 right-8 border-4 border-green-500 text-green-500 px-4 py-2 rounded-lg rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-2xl font-bold">LIKE</span>
        </motion.div>

        {/* Nope indicator */}
        <motion.div
          className="absolute top-8 left-8 border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-2xl font-bold">NOPE</span>
        </motion.div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-2 mb-2">
            <h2 className="text-2xl font-semibold text-white">{persona.name}</h2>
            <span className="text-xl text-white/80">{persona.age}</span>
          </div>
          <p className="text-white/80 text-sm mb-3">{persona.location}</p>
          <p className="text-white/90 text-sm mb-3 line-clamp-2">{persona.bio}</p>
          <div className="flex flex-wrap gap-2">
            {persona.vibes?.slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm"
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MatchModal({ persona, onClose, onChat }: { persona: Persona; onClose: () => void; onChat: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-center"
      >
        <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-foreground mb-2">It's a Match!</h2>
        <p className="text-muted-foreground mb-8">
          You and {persona.name} liked each other
        </p>

        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 ring-4 ring-primary shadow-[0_0_30px_rgba(233,64,87,0.5)] bg-card flex items-center justify-center">
          <span className="text-6xl" role="img" aria-label="avatar">
            {persona.photos?.[0] || (persona.gender === 'Male' ? '👱‍♂️' : '👩‍🦰')}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <button
            onClick={onChat}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            Send a Message
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            Keep Swiping
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Discover() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [matchedPersona, setMatchedPersona] = useState<Persona | null>(null);
  const [lastMatchChatId, setLastMatchChatId] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('chats')
      .select('*, personas(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setMatches(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('users')
        .select('gender')
        .eq('id', user.id)
        .single();

      const targetGender = userProfile?.gender === 'Male' ? 'Female' : 'Male';

      const { data } = await supabase
        .from('personas')
        .select('*')
        .eq('gender', targetGender);

      if (data) setPersonas(data);
      await fetchMatches();
      setLoading(false);
    };
    init();
  }, [fetchMatches]);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (isSwiping) return;
    const currentPersona = personas[0];
    if (!currentPersona) return;

    setIsSwiping(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-swipe', {
        body: { personaId: currentPersona.id, direction }
      });

      if (data?.isMatch) {
        setMatchedPersona(currentPersona);
        setLastMatchChatId(data.chatId);
        await fetchMatches(); // Refresh matches list
      }
    } catch (err: any) {
      console.error('Swipe error:', err);
      if (err.status === 401 || err.message?.includes('JWT')) {
        supabase.auth.signOut();
        navigate('/');
      }
    } finally {
      setIsSwiping(false);
      setPersonas((prev) => prev.slice(1));
    }
  }, [personas, isSwiping, navigate, fetchMatches]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-136px)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-136px)]">
        {/* Matches Bar */}
        {matches.length > 0 && (
          <div className="w-full py-4 bg-background/50 backdrop-blur-sm border-b border-border/30 overflow-hidden">
            <div className="px-4 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">New Matches</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
              {matches.map((match) => (
                <motion.button
                  key={match.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/chat/${match.id}`)}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div className="w-14 h-14 rounded-full bg-card border-2 border-primary/20 p-0.5 flex items-center justify-center relative shadow-sm">
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-2xl overflow-hidden ring-2 ring-primary">
                      {match.personas.photos?.[0] || '👤'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground truncate w-14 text-center">
                    {match.personas.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {personas.length > 0 ? (
            <>
              <div className="relative w-full max-w-sm aspect-[3/4]">
                {personas.slice(0, 3).map((persona, index) => (
                  <SwipeCard
                    key={persona.id}
                    persona={persona}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                    isSwiping={isSwiping}
                  />
                )).reverse()}

                {/* Swipe Loader Overlay */}
                {isSwiping && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-2xl">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={() => handleSwipe('left')}
                  disabled={isSwiping}
                  className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-8 h-8 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  disabled={isSwiping}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(233,64,87,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="w-10 h-10 text-white fill-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No more profiles right now
              </h2>
              <p className="text-muted-foreground">
                Check back later for new matches
              </p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {matchedPersona && (
            <MatchModal
              persona={matchedPersona}
              onClose={() => {
                setMatchedPersona(null);
                setLastMatchChatId(null);
              }}
              onChat={() => {
                if (lastMatchChatId) {
                  navigate(`/chat/${lastMatchChatId}`);
                } else {
                  navigate('/chat');
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
