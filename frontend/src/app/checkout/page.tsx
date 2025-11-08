'use client';

import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  // Mock plan data - replace with actual plan selection logic
  const selectedPlan = {
    name: 'Pro Plan',
    price: 29.99,
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'API access'
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>
      <div className="max-w-3xl mx-auto">
        <CheckoutForm 
          plan={selectedPlan} 
          onSuccess={() => {
            // Handle successful payment
            console.log('Payment successful!');
          }} 
        />
      </div>
    </div>
  );
}