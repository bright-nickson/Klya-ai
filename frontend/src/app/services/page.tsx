import React from "react";

const Services = () => {
  return (
    <section className="py-16 bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
        <p className="text-gray-600 mb-12">
          KLYA AI provides intelligent tools for modern creators and businesses — helping you create, analyze, and grow smarter.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <img src="/images/ai-writer-placeholder.png" alt="AI Writer" className="w-16 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">AI Content Generator</h3>
            <p className="text-gray-600">
              Automatically create blog posts, ad copies, and social media captions based on Ghanaian trends.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <img src="/images/trends-placeholder.png" alt="Trend Finder" className="w-16 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Local Trend Finder</h3>
            <p className="text-gray-600">
              Discover what's trending in Ghana — festivals, slang, and holidays — to keep your content relevant.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <img src="/images/analytics-placeholder.png" alt="Analytics" className="w-16 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Performance Analytics</h3>
            <p className="text-gray-600">
              Track engagement and performance across all your connected platforms with AI-powered insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
