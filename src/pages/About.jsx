import React from "react";

// About.jsx
// Modern, responsive About page component for DigitalHat — Tailwind CSS based.
// Drop this file into your React project (e.g., src/pages/About.jsx) and ensure Tailwind CSS is configured.

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="bg-white shadow-sm">
        <div className="mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                DigitalHat — Modern gadgets, smarter living
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                We bring the latest, high-quality gadgets to Bangladesh —
                curated for developers, creators and everyday tech lovers. Fast
                delivery, reliable warranty and UI-first shopping experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/shop"
                  className="inline-block rounded-2xl px-6 py-3 bg-[#ff6a00] text-white font-semibold shadow hover:opacity-95"
                >
                  Shop gadgets
                </a>
                <a
                  href="/support"
                  className="inline-block rounded-2xl px-6 py-3 border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Contact support
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <div className="flex flex-col">
                  <span className="text-xl font-bold">120+</span>
                  <span className="text-sm text-gray-500">Products</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">10k+</span>
                  <span className="text-sm text-gray-500">Happy customers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">2yr</span>
                  <span className="text-sm text-gray-500">
                    Warranty support
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Example product / hero card */}
              <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-6 shadow-lg transform hover:scale-[1.01] transition">
                <img
                  src="/hero-gadget.png"
                  alt="Modern gadget preview"
                  className="w-full h-64 object-contain rounded-lg"
                  onError={(e) => {
                    // graceful fallback if image not found
                    e.currentTarget.src =
                      "https://ik.imagekit.io/iura/Digitalhat/headset.png?updatedAt=1760679622076";
                  }}
                />

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">DigitalHat Pro Headset</h3>
                    <p className="text-sm text-gray-500">
                      Studio-quality sound for creators
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">৳6,499</div>
                    <div className="text-xs text-gray-500">In stock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="container mx-auto px-5 md:px-10 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Our mission</h2>
          <p className="mt-4 text-gray-600">
            To make modern technology accessible across Bangladesh through a
            trusted online shopping experience. We carefully select products,
            verify quality and support customers with friendly service.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold">Curated</h4>
              <p className="mt-2 text-sm text-gray-500">
                Every item is reviewed by our team to ensure quality & value.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold">Fast Delivery</h4>
              <p className="mt-2 text-sm text-gray-500">
                Nationwide delivery with careful packaging and tracking.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold">Reliable Support</h4>
              <p className="mt-2 text-sm text-gray-500">
                Warranty & support that actually responds — via chat, phone and
                email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Why choose us */}
      <section className="bg-gradient-to-b border-border from-white to-gray-50 py-12">
        <div className="container mx-auto px-5 md:px-10 lg:px-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="md:w-11 md:h-11 w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-[#ff6a00] text-white font-bold">
                  1
                </div>
                <div>
                  <h5 className="font-semibold">Quality first</h5>
                  <p className="text-sm text-gray-600">
                    We test and verify products before listing so you get what’s
                    promised.
                  </p>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <div className="md:w-11 md:h-11 w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-[#ff6a00] text-white font-bold">
                  2
                </div>
                <div>
                  <h5 className="font-semibold">Transparent pricing</h5>
                  <p className="text-sm text-gray-600">
                    No hidden fees — clear product pages with specs and honest
                    reviews.
                  </p>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <div className="md:w-11 md:h-11 w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-[#ff6a00] text-white font-bold">
                  3
                </div>
                <div>
                  <h5 className="font-semibold">Secure payments</h5>
                  <p className="text-sm text-gray-600">
                    Multiple payment options and secure checkout to protect your
                    information.
                  </p>
                </div>
              </li>
            </ul>

            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold">Customer Stories</h4>
              <blockquote className="mt-4 text-gray-600 italic">
                "I ordered a specialty microphone from DigitalHat — fast
                delivery and it arrived perfectly packed. Great support!"
              </blockquote>

              <div className="mt-6">
                <a href="/reviews" className="text-sm font-medium underline">
                  Read more reviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-5 md:px-10 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold">Meet the team</h2>
          <p className="mt-2 text-gray-600">
            Small team, big passion — developers, curators and customer-care
            heroes.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Farhan Sadik",
                role: "Founder & Product",
                img: "https://images.unsplash.com/photo-1569779213435-ba3167dde7cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=580",
              },
              {
                name: "Mahmud Hasan",
                role: "Operations",
                img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
              },
              {
                name: "As Babu",
                role: "Support Lead",
                img: "https://images.unsplash.com/photo-1652445716497-5d04b756160c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=503",
              },
            ].map((p) => (
              <div key={p.name} className="bg-white rounded-lg p-4 shadow-sm">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full aspect-square object-cover rounded-md"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/400x300?text=Team")
                  }
                />
                <div className="mt-3">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#ff6a00] text-white py-12">
        <div className="container mx-auto px-5 md:px-10 lg:px-20  text-center">
          <h3 className="text-2xl font-bold">Ready to explore?</h3>
          <p className="mt-2">
            Discover modern gadgets handpicked for you. Free shipping on orders
            over ৳5,000.
          </p>
          <div className="mt-6">
            <a
              href="/shop"
              className="inline-block rounded-2xl px-6 py-3 bg-white text-[#ff6a00] font-semibold"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
