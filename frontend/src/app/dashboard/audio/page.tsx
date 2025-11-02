import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audio | Klya AI',
  description: 'Manage your audio files',
};

export default function AudioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audio Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Audio Files</h2>
        <p className="text-gray-600">Upload and manage your audio files here.</p>
      </div>
    </div>
  );
}