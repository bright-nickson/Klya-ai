import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription | Klya AI',
  description: 'Manage your subscription',
};

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
        <p className="text-gray-600">Manage your subscription settings here.</p>
      </div>
    </div>
  );
}