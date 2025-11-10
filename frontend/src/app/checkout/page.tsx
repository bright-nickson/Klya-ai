'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

interface Plan {
  name: string;
  price: number;
  features: string[];
  billing: 'monthly' | 'yearly';
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<Plan>({
    name: 'Starter',
    price: 0,
    features: [
      'Up to 5 AI generations per day',
      'Access to content and translation tools',
      'Basic analytics dashboard',
      'Community support'
    ],
    billing: 'monthly' as const
  });

  useEffect(() => {
    // Get plan details from URL parameters
    const planName = searchParams?.get('plan') || 'starter';
    const price = parseFloat(searchParams?.get('price') || '0');
    const billing = searchParams?.get('billing') === 'yearly' ? 'yearly' : 'monthly';

    // Map plan name to features
    const planFeatures = {
      'starter': [
        'Up to 5 AI generations per day',
        'Access to content and translation tools',
        'Basic analytics dashboard',
        'Community support'
      ],
      'pro': [
        'Unlimited content generations',
        'Priority AI processing speed',
        'Full analytics suite',
        'Email & chat support',
        'Voice transcription tools'
      ]
    };

    const displayName = {
      'starter': 'Starter',
      'pro': 'Pro'
    };

    setSelectedPlan({
      name: displayName[planName as keyof typeof displayName] || 'Starter',
      price: price || 0,
      features: planFeatures[planName as keyof typeof planFeatures] || planFeatures['starter'],
      billing
    });
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
      <p className="text-muted-foreground mb-8">
        You're subscribing to the <span className="font-semibold text-primary">{selectedPlan.name} Plan</span>
        {selectedPlan.price > 0 ? ` (${selectedPlan.billing})` : ''}
      </p>
      
      <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-sm border p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedPlan.name} Plan</p>
                <p className="text-sm text-muted-foreground">
                  Billed {selectedPlan.billing === 'monthly' ? 'monthly' : 'annually'}
                </p>
              </div>
              <p className="font-semibold">
                {selectedPlan.price > 0 ? `₵${selectedPlan.price.toFixed(2)}` : 'Free'}
              </p>
            </div>
          </div>
        </div>

        <CheckoutForm 
          plan={{
            name: selectedPlan.name,
            price: selectedPlan.price,
            features: selectedPlan.features
          }} 
          onSuccess={() => {
            // Handle successful payment
            console.log('Payment successful!');
          }} 
        />
      </div>
    </div>
  );
}