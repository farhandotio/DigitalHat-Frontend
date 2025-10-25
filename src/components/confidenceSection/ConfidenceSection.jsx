import React from 'react';
// Import the necessary icons from lucide-react
import { Shield, Truck, Headset } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, iconBgColor, iconColor }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      {/* Icon Circle Container */}
      <div 
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-4`} 
        style={{ backgroundColor: iconBgColor }}
      >
        <Icon 
          className="w-10 h-10" 
          style={{ color: iconColor }} 
        />
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-text/90 max-w-xs">
        {description}
      </p>
    </div>
  );
};

const ConfidenceSection = () => {
  return (
    <section className="bg-secondary-bg mt-10 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text mb-2">
          Shop with Confidence
        </h2>
        <p className="text-text/90 text-base">
          Trusted by millions of customers worldwide
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. Secure Payments */}
        <FeatureCard
          icon={Shield} // Icon component
          title="Secure Payments"
          description="Your payment information is always protected"
          iconBgColor="#e6ffe6" // Light Green
          iconColor="#4CAF50"   // Darker Green
        />

        {/* 2. Fast Shipping */}
        <FeatureCard
          icon={Truck} // Icon component
          title="Fast Shipping"
          description="Quick delivery from trusted sellers"
          iconBgColor="#e6f0ff" // Light Blue
          iconColor="#2196F3"   // Darker Blue
        />

        {/* 3. 24/7 Support */}
        <FeatureCard
          icon={Headset} // Icon component
          title="24/7 Support"
          description="We're here to help whenever you need us"
          iconBgColor="#f5e6ff" // Light Purple
          iconColor="#9C27B0"   // Darker Purple
        />
        
      </div>
    </section>
  );
};

export default ConfidenceSection;