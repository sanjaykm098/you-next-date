import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Crown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '/forever',
    description: 'Get started with basic features',
    features: [
      '20 swipes per day',
      '30 messages per day',
      'Basic profiles',
      'Standard support',
    ],
    cta: 'Current Plan',
    disabled: true,
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹299',
    period: '/month',
    description: 'Unlock the full experience',
    features: [
      'Unlimited swipes',
      'Unlimited messages',
      'See who liked you',
      'Priority matches',
      'Read receipts',
      'Ad-free experience',
    ],
    cta: 'Upgrade Now',
    disabled: false,
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '₹599',
    period: '/month',
    description: 'The ultimate dating experience',
    features: [
      'Everything in Premium',
      'Profile boost weekly',
      'Super likes daily',
      'Undo last swipe',
      'VIP badge',
      '24/7 priority support',
    ],
    cta: 'Go VIP',
    disabled: false,
    popular: false,
  },
];

export default function Upgrade() {
  const navigate = useNavigate();

  const handleUpgrade = (planId: string) => {
    // TODO: Integrate with payment system
    console.log('Upgrading to:', planId);
  };

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
          <h1 className="font-semibold text-foreground">Upgrade</h1>
        </div>
      </div>

      <div className="pt-14 pb-8 px-4 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Unlock Premium Features
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get more matches, unlimited messaging, and exclusive features to boost your dating experience.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-card rounded-2xl p-6 border ${
                plan.popular 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.disabled}
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90'
                    : plan.disabled
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-card border border-border hover:bg-muted'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Questions? Check our{' '}
            <button className="text-secondary hover:underline">FAQ</button>
            {' '}or{' '}
            <button className="text-secondary hover:underline">contact support</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
