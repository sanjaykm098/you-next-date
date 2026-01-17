import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockPersonas } from '@/data/mockData';
import { Persona } from '@/types';
import { cn } from '@/lib/utils';

function SwipeCard({ 
  persona, 
  onSwipe, 
  isTop 
}: { 
  persona: Persona; 
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
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
      drag={isTop ? 'x' : false}
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
        <img
          src={persona.photos[0]}
          alt={persona.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        
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
          <p className="text-white/90 text-sm mb-3">{persona.bio}</p>
          <div className="flex flex-wrap gap-2">
            {persona.vibes.map((vibe) => (
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

function MatchModal({ persona, onClose }: { persona: Persona; onClose: () => void }) {
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
        
        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 ring-4 ring-primary">
          <img
            src={persona.photos[0]}
            alt={persona.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors"
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
  const [cards, setCards] = useState(mockPersonas);
  const [matchedPersona, setMatchedPersona] = useState<Persona | null>(null);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentCard = cards[0];
    
    // Simulate match on like (for demo, every other like is a match)
    if (direction === 'right' && Math.random() > 0.5) {
      setTimeout(() => setMatchedPersona(currentCard), 300);
    }
    
    setCards((prev) => prev.slice(1));
  }, [cards]);

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-136px)] px-4">
        {cards.length > 0 ? (
          <>
            {/* Card Stack */}
            <div className="relative w-full max-w-sm aspect-[3/4]">
              {cards.slice(0, 3).map((persona, index) => (
                <SwipeCard
                  key={persona.id}
                  persona={persona}
                  onSwipe={handleSwipe}
                  isTop={index === 0}
                />
              )).reverse()}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={() => handleButtonSwipe('left')}
                className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                <X className="w-8 h-8 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleButtonSwipe('right')}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse-glow hover:scale-105 active:scale-95 transition-transform"
              >
                <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
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
      
      {/* Match Modal */}
      {matchedPersona && (
        <MatchModal
          persona={matchedPersona}
          onClose={() => setMatchedPersona(null)}
        />
      )}
    </AppLayout>
  );
}
