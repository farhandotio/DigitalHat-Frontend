import React from "react";
import { assets } from "../../../public/assets/assets";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Support", path: "/support" },
    { label: "FAQ", path: "/faq" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  const shopCategories = [
    { label: "Electronics", path: "/shop?category=electronics" },
    { label: "Clothing", path: "/shop?category=clothing" },
    { label: "Beauty", path: "/shop?category=beauty" },
    { label: "Home & Kitchen", path: "/shop?category=home" },
    { label: "Toys & Kids", path: "/shop?category=toys" },
    { label: "Sports & Outdoors", path: "/shop?category=sports" },
  ];

  const socialLinks = [
    { Icon: Facebook, url: "#", label: "Facebook" },
    { Icon: Twitter, url: "#", label: "Twitter" },
    { Icon: Instagram, url: "#", label: "Instagram" },
    { Icon: Youtube, url: "#", label: "Youtube" },
  ];

  const paymentMethods = ["PAYONEER", "BIKASH", "NAGAD", "DBBL"];

  return (
    <footer className="w-full bg-primary text-white py-10 px-5 md:px-10 lg:px-20">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10">
        {/* Logo & About */}
        <div className="space-y-4 col-span-2">
          <img src={assets.logo} alt="DigitalHat Logo" className="w-32" />
          <p className="text-white/80 text-sm">
            DigitalHat is your one-stop online store for products from multiple
            sellers. Discover the latest trends, top brands, and exclusive
            deals.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ Icon, url, label }) => (
              <a
                key={label}
                href={url}
                className="hover:text-white transition"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            {quickLinks.map(({ label, path }) => (
              <li key={label}>
                <a href={path} className="hover:text-white transition">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">Shop Categories</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            {shopCategories.map(({ label, path }) => (
              <li key={label}>
                <a href={path} className="hover:text-white transition">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-2">
          <h3 className="text-white font-semibold mb-4">
            Subscribe to our Newsletter
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Get latest updates, offers and products delivered to your inbox.
          </p>
          <form className="flex flex-col text-sm sm:flex-row gap-2 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-2 rounded-full   border-2 border-white/20 focus:outline-none focus:border-primary bg-transparent text-white placeholder-white/70 transition w-full"
            />
            <button
              type="submit"
              className="px-5 py-2  rounded-full   bg-secondary cursor-pointer  text-white font-medium transition flex-shrink-0"
            >
              Subscribe
            </button>
          </form>

          {/* Payment Methods */}
          <div className="mt-6 flex items-center gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="w-full h-8 bg-white/10  rounded-full flex items-center justify-center text-xs"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 max-md:mb-10 border-t border-white/10 pt-6 text-center text-white/60 text-sm">
        &copy; {new Date().getFullYear()} DigitalHat. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
