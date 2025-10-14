import React from "react";
import { Icon } from "@iconify/react";
import Title from "../title/Title";

// --- Feature Data ---
const featureData = [
  {
    icon: "mdi:truck-fast", // Fast delivery
    title: "Fast Delivery",
    description:
      "Get your orders delivered quickly across Bangladesh — same-day or next-day delivery available in many areas.",
  },
  {
    icon: "mdi:cash-refund", // Money-back guarantee
    title: "Money-back Guarantee",
    description:
      "Not satisfied? Return within 7 days for a full refund — no hassle, no questions asked.",
  },
  {
    icon: "mdi:headset", // 24/7 support
    title: "24/7 Customer Support",
    description:
      "Our support team is available around the clock to help with orders, returns, and product questions.",
  },
];

// --- Sub-component for a single feature column ---
const FeatureColumn = ({ icon, title, description, isLast }) => (
  <div
    className={`w-full lg:w-1/3 text-center ${
      !isLast ? "" : ""
    } transition duration-300`}
  >
    {/* Iconify Icon */}
    <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center text-gray-800">
      <Icon icon={icon} className="w-14 h-14 text-text/80" />
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
      <div>
        {/* Main Heading */}
        {/* <div className="flex justify-center items-center">
          <Title title="Why Shop at DigitalHat" center />
        </div> */}

        {/* Features Grid */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch divide-y lg:divide-y-0 rounded-2xl overflow-hidden">
          {featureData.map((feature, index) => (
            <FeatureColumn
              key={feature.title}
              icon={feature.icon}
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
