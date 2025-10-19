// src/components/Seo.jsx
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Seo({
  title = "DigitalHat - Best Gadget Store in Bangladesh",
  description = "Shop the latest tech gadgets, smartwatches, TWS, laptops, and accessories at DigitalHat. Fast delivery and best prices in Bangladesh.",
  canonical = "https://digitalhat.vercel.app/",
  image = "https://digitalhat.vercel.app/og-image.jpg",
  keywords = "gadget shop, tech accessories, smartwatch, TWS, laptop, DigitalHat, Bangladesh",
}) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonical} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    </HelmetProvider>
  );
}
