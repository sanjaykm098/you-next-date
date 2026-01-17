import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Crown, Calendar, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockUsageLimits } from '@/data/mockData';

export default function MyPlan() {
  const navigate = useNavigate();

  // Mock current plan data
  const currentPlan = {
    name: 'Free',
    price: '₹0',
    period: '/forever',
    renewalDate: null,
    features: [
      '20 swipes per day',
      '30 messages per day',
      'Basic profiles',
      'Standard support',
    ],
  };

  const swipeProgress = (mockUsageLimits.swipesUsed / mockUsageLimits.swipesLimit) * 100;
  const messageProgress = (mockUsageLimits.messagesUsed / mockUsageLimits.messagesLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-foreground">My Plan</h1>
        </div>
      </div>

      <div className="pt-14 pb-8 px-4 max-w-lg mx-auto">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border mt-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Current Plan</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">{currentPlan.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-foreground">{currentPlan.price}</span>
              <span className="text-muted-foreground text-sm">{currentPlan.period}</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {currentPlan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate('/upgrade')}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Upgrade Plan
          </Button>
        </motion.div>

        {/* Usage Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border mt-4"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Usage</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Swipes</span>
                <span className="text-sm text-muted-foreground">
                  {mockUsageLimits.swipesUsed} / {mockUsageLimits.swipesLimit}
                </span>
              </div>
              <Progress value={swipeProgress} className="h-2" />
              {swipeProgress >= 80 && (
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Running low! Upgrade for unlimited swipes.
                </p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Messages</span>
                <span className="text-sm text-muted-foreground">
                  {mockUsageLimits.messagesUsed} / {mockUsageLimits.messagesLimit}
                </span>
              </div>
              <Progress value={messageProgress} className="h-2" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Limits reset at midnight every day
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl overflow-hidden border border-border mt-4"
        >
          <button 
            onClick={() => navigate('/upgrade')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-foreground">View All Plans</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="h-px bg-border" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Payment Methods</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="h-px bg-border" />
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Billing History</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Need help with your subscription?{' '}
          <button className="text-secondary hover:underline">Contact Support</button>
        </motion.p>
      </div>
    </div>
  );
}
