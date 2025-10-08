import React, { useState } from 'react';

// --- NEW COMPONENT: Detailed Description Content ---
// This component displays the detailed description, typically featuring
// the main paragraph followed by a bulleted list of features.
const DescriptionContent = ({ description, features }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Description</h3>
    
    {/* Main Description Paragraph */}
    <p className="text-gray-700 mb-4 leading-relaxed">
      {description}
    </p>

    {/* Bulleted Features List */}
    <ul className="list-disc ml-6 space-y-2 text-gray-700">
      {features.map((feature, index) => (
        <li key={index} className="pl-1">
          {feature}
        </li>
      ))}
    </ul>
  </div>
);
// --- END NEW COMPONENT ---


// Mock data structure for the full Description features
// In a real application, you would pass this data via props from the parent (ProductDetails)
const mockProductDetails = {
    fullDescription: "The Sony WH-1000XM4 headphones deliver industry-leading noise canceling technology with Dual Noise Sensor technology. Experience exceptional sound quality with 30mm drivers and LDAC technology for Hi-Res Audio wireless streaming.",
    featureList: [
        "Industry-leading noise canceling with Dual Noise Sensor technology",
        "30-hour battery life with quick charge (10 min charge for 5 hours of playback)",
        "Touch Sensor controls to pause play skip tracks, control volume, activate your voice assistant",
        "Speak-to-chat technology automatically reduces volume during conversations",
        "Superior call quality with precise voice pickup technology",
        "Wearing detection pauses playback when headphones are removed",
    ]
}


// Mock component for the Reviews content (kept for structure)
const ReviewsContent = ({ reviewCount }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews ({reviewCount})</h3>
    <p className="text-gray-600">
      A full review system (star ratings, user comments, etc.) would be implemented here. 
      This space will dynamically load all {reviewCount} customer reviews.
    </p>
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <p className="font-semibold">Review Snippet:</p>
      <p className="text-sm italic">"These are the best headphones I've ever owned. The ANC is incredible." - A Happy Customer</p>
    </div>
  </div>
);


const ProductTabs = ({ reviewCount = 0, productDetails = mockProductDetails }) => {
  // Use 'Description' as the new default active tab
  const [activeTab, setActiveTab] = useState('Description'); 

  // List of tabs (Updated to Description and Reviews)
  const tabs = [
    { key: 'Description', label: 'Description' },
    { key: 'Reviews', label: `Reviews (${reviewCount.toLocaleString()})` },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <DescriptionContent 
            description={productDetails.fullDescription} 
            features={productDetails.featureList} 
          />
        );
      case 'Reviews':
        return <ReviewsContent reviewCount={reviewCount} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-12">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-6 py-3 text-base font-medium transition-colors duration-200
              ${activeTab === tab.key
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg">{renderContent()}</div>
    </div>
  );
};

export default ProductTabs;