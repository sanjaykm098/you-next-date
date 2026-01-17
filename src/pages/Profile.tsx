import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, MessageCircle, Settings, LogOut, ChevronRight, Crown } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsageLimits } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
export default function Profile() {
  const navigate = useNavigate();
  
  // Mock user data
  const user = {
    name: 'Rahul',
    age: 25,
    gender: 'Male',
    vibes: ['Music', 'Travel', 'Coffee', 'Movies'],
  };

  const handleLogout = () => {
    // For now, navigate to landing
    navigate('/');
  };

  const swipeProgress = (mockUsageLimits.swipesUsed / mockUsageLimits.swipesLimit) * 100;
  const messageProgress = (mockUsageLimits.messagesUsed / mockUsageLimits.messagesLimit) * 100;

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
          <h1 className="text-2xl font-semibold text-foreground">{user.name}, {user.age}</h1>
          <p className="text-muted-foreground">{user.gender}</p>
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
                  {mockUsageLimits.swipesUsed} / {mockUsageLimits.swipesLimit}
                </span>
              </div>
              <Progress value={swipeProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-foreground">Messages</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockUsageLimits.messagesUsed} / {mockUsageLimits.messagesLimit}
                </span>
              </div>
              <Progress value={messageProgress} className="h-2" />
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
            <button className="text-secondary text-sm hover:underline">Edit</button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {user.vibes.map((vibe) => (
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
            onClick={() => navigate('/my-plan')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-foreground">My Plan</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="h-px bg-border" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="h-px bg-border" />
          
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
