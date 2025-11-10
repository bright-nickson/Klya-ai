import { Check, Star } from 'lucide-react';

export type PlanId = 'starter' | 'pro' | 'enterprise';

export interface PricingPlan {
  id: PlanId;
  name: string;
  monthly: number | null;
  yearly: number | null;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export interface PricingFeature {
  name: string;
  starter: string;
  pro: string;
  enterprise: string;
  [key: string]: string; // Index signature for dynamic access
}

export interface PricingFeatureCategory {
  category: string;
  features: PricingFeature[];
}

export const pricingPlans: ReadonlyArray<PricingPlan> = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    description: 'Perfect for individual creators and small businesses',
    features: [
      '5 AI content generations per day',
      'Basic voice transcription (1 hour/month)',
      'English and Twi language support',
      'Mobile app access',
      'Email support',
      'Basic analytics'
    ],
    popular: false,
    cta: 'Get Started'
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 150,
    yearly: 1500, // ~17% discount for annual billing
    description: 'Ideal for growing businesses and teams',
    features: [
      'Unlimited AI content generation',
      'Advanced voice transcription (10 hours/month)',
      'All Ghanaian languages support',
      'Team collaboration (up to 5 members)',
      'Priority support',
      'Advanced analytics & insights',
      'Custom templates',
      'API access'
    ],
    popular: true,
    cta: 'Get Started'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    yearly: null,
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom AI model training',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
];

export const pricingFeatures: ReadonlyArray<PricingFeatureCategory> = [
  {
    category: 'AI Content Generation',
    features: [
      { name: 'Content generations per day', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Languages supported', starter: '2', pro: 'All Ghanaian', enterprise: 'All + Custom' },
      { name: 'Templates', starter: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
    ]
  },
  {
    category: 'Voice & Transcription',
    features: [
      { name: 'Voice transcription', starter: '1 hour/month', pro: '10 hours/month', enterprise: 'Unlimited' },
      { name: 'Voice cloning', starter: '❌', pro: '✅', enterprise: '✅' },
      { name: 'Custom voice models', starter: '❌', pro: '❌', enterprise: '✅' },
    ]
  },
  {
    category: 'Support & Team',
    features: [
      { name: 'Support', starter: 'Email', pro: 'Priority', enterprise: '24/7 Dedicated' },
      { name: 'Team members', starter: '1', pro: 'Up to 5', enterprise: 'Unlimited' },
      { name: 'Training', starter: '❌', pro: '❌', enterprise: '✅' },
    ]
  },
  {
    category: 'Advanced Features',
    features: [
      { name: 'API Access', starter: '❌', pro: '✅', enterprise: '✅' },
      { name: 'Custom Integrations', starter: '❌', pro: '❌', enterprise: '✅' },
      { name: 'SLA', starter: '❌', pro: '❌', enterprise: '✅' },
    ]
  }
];

export default {
  pricingPlans,
  pricingFeatures
};
