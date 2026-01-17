import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, MessageCircle, Settings, LogOut, ChevronRight, Crown, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [limits, setLimits] = useState<any>({
    swipes_today: 0,
    messages_today: 0,
    swipes_limit: 20,
    messages_limit: 30
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const [userRes, limitsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('usage_limits').select('*').eq('user_id', user.id).single()
      ]);

      if (userRes.data) setProfile(userRes.data);
      if (limitsRes.data) {
        setLimits(prev => ({ ...prev, ...limitsRes.data }));
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const swipeProgress = (limits.swipes_today / limits.swipes_limit) * 100;
  const messageProgress = (limits.messages_today / limits.messages_limit) * 100;

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
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center mb-4 ring-4 ring-primary/20">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{profile?.name || 'User'}, {profile?.age || ''}</h1>
          <p className="text-muted-foreground capitalize">{profile?.gender || ''}</p>
        </motion.div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-medium text-foreground mb-4">Today's Activity</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Swipes</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {limits.swipes_today} / {limits.swipes_limit}
                </span>
              </div>
              <Progress value={Math.min(swipeProgress, 100)} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-foreground">Messages</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {limits.messages_today} / {limits.messages_limit}
                </span>
              </div>
              <Progress value={Math.min(messageProgress, 100)} className="h-2" />
            </div>
          </div>
        </motion.div>

        {/* Vibes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Your Vibes</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile?.preferences?.map((vibe: string) => (
              <span
                key={vibe}
                className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {vibe}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl overflow-hidden mb-6"
        >

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-destructive"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </div>
          </button>
        </motion.div>

        {/* App version */}
        <p className="text-center text-sm text-muted-foreground">
          Date For You v1.0.0
        </p>
      </div>
    </AppLayout>
  );
}
