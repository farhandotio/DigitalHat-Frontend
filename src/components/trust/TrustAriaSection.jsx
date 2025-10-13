import React from "react";
import Title from "../title/Title";

// Updated feature data for DigitalHat e-commerce site
const featureData = [
  {
    iconPlaceholder: "🚚", // Fast delivery
    title: "Fast Delivery",
    description:
      "Get your orders delivered quickly across Bangladesh — same-day or next-day delivery available in many areas.",
  },
  {
    iconPlaceholder: "💸", // Money-back guarantee
    title: "Money-back Guarantee",
    description:
      "Not satisfied? Return within 7 days for a full refund — no hassle, no questions asked.",
  },
  {
    iconPlaceholder: "🕒", // 24/7 support
    title: "24/7 Customer Support",
    description:
      "Our support team is available around the clock to help with orders, returns, and product questions.",
  },
];

// --- Sub-component for a single feature column ---
const FeatureColumn = ({ iconPlaceholder, title, description, isLast }) => (
  <div
    className={`p-6 w-full lg:w-1/3 text-center border-border ${
      !isLast ? "border-r-2" : ""
    } transition duration-300`}
  >
    {/* Icon Placeholder Styling */}
    <div className="text-5xl mb-4 mx-auto w-16 h-16 flex items-center justify-center text-gray-800">
      {iconPlaceholder}
    </div>

    {/* Title */}
    <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>

    {/* Description Text */}
    <p className="text-sm text-gray-600 px-4">{description}</p>
  </div>
);

// --- Main Component ---
const TrustAriaSection = () => {
  return (
    <section className="py-16 sm:py-24 px-5 md:px-10 lg:px-20">
      <div className="">
        {/* Main Heading */}
        <div className="flex justify-center items-center">
          <Title title="Why Shop at DigitalHat" center />
        </div>

        {/* Features Grid - Flex layout for desktop, stacked for mobile */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch divide-y lg:divide-y-0 rounded-2xl overflow-hidden">
          {featureData.map((feature, index) => (
            <FeatureColumn
              key={feature.title}
              iconPlaceholder={feature.iconPlaceholder}
              title={feature.title}
              description={feature.description}
              isLast={index === featureData.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustAriaSection;
