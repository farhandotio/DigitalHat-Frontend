import React from "react";

// PrivacyPolicy.jsx
// Clean, modern, responsive Privacy & Policy page for DigitalHat.
// Tailwind CSS required.

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white px-5 md:px-10 lg:px-20 text-gray-900">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600">
            Your data. Your trust. Our priority.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main article */}
          <article className="lg:col-span-2 prose prose-lg max-w-none">
            <h2>Introduction</h2>
            <p>
              At <strong>DigitalHat</strong>, we respect your privacy and are
              committed to protecting your personal information. This policy
              explains what data we collect, why we collect it, and how we keep
              it safe. If you have any questions, email{" "}
              <a
                href="mailto:support@digitalhat.com.bd"
                className="text-[#ff6a00]"
              >
                support@digitalhat.com.bd
              </a>
              .
            </p>

            <h3>🧾 Information we collect</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold">Personal details</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Name, email, phone number and shipping address — provided when
                  you place an order or create an account.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold">Order & payment data</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Order items, billing information (we do not store full card
                  numbers), and transaction records.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold">Device & usage info</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Browser details, IP address, device type, and pages you visit
                  — used for analytics and site improvements.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold">Cookies & tracking</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cookies help personalize your experience and power analytics.
                  You can manage cookie preferences anytime.
                </p>
              </div>
            </div>

            <h3 className="mt-8">🔧 How we use your data</h3>
            <ul>
              <li>To process and deliver your orders.</li>
              <li>
                To provide customer support and communicate about your
                purchases.
              </li>
              <li>
                To improve our website and personalize product recommendations.
              </li>
              <li>To analyze usage and prevent fraud.</li>
            </ul>

            <h3 className="mt-8">🔒 Data protection</h3>
            <p>
              We use industry-standard security measures to protect your data.
              Payment processing is handled by trusted third-party gateways — we
              do not store full card details on our servers. Data at rest and in
              transit is encrypted, and access is limited to authorized
              personnel.
            </p>

            <h3 className="mt-8">🤝 Third-party services</h3>
            <p>
              We work with payment gateways, delivery partners, and analytics
              providers to operate the store. These partners receive only the
              information necessary to perform their services and are expected
              to protect your data per applicable laws.
            </p>

            <h3 className="mt-8">✳️ Your rights</h3>
            <p>
              You have the right to access, correct, or delete your personal
              information. You can also opt out of marketing communications. To
              exercise these rights, contact us at{" "}
              <a
                href="mailto:support@digitalhat.com.bd"
                className="text-[#ff6a00]"
              >
                support@digitalhat.com.bd
              </a>
              . We may verify your identity before processing certain requests.
            </p>

            <h3 className="mt-8">🍪 Cookies</h3>
            <p>
              Cookies and similar technologies remember your preferences and
              analyze site usage. You can manage cookie settings from the cookie
              banner or your browser — note that disabling some cookies may
              reduce site functionality (e.g., keeping you logged in or saving
              cart items).
            </p>

            <h3 className="mt-8">🔁 Updates to this policy</h3>
            <p>
              We may update this Privacy Policy occasionally. When we do, we
              will post the updated policy here and update the "Last updated"
              date below. Continued use after changes indicates acceptance of
              the updated policy.
            </p>

            <h3 className="mt-8">📞 Contact us</h3>
            <p>
              If you have questions or requests about your data, email us at{" "}
              <a
                href="mailto:support@digitalhat.com.bd"
                className="text-[#ff6a00]"
              >
                support@digitalhat.com.bd
              </a>{" "}
              or visit our{" "}
              <a href="/contact" className="text-[#ff6a00]">
                contact page
              </a>
              .
            </p>

            <p className="mt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </article>

          {/* Sidebar / Quick actions */}
          <aside className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold">Quick actions</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="/account"
                    className="block rounded-lg px-4 py-2 hover:bg-white border border-gray-100"
                  >
                    Manage your account
                  </a>
                </li>
                <li>
                  <button
                    onClick={() =>
                      alert("This will start your data export process.")
                    }
                    className="w-full text-left rounded-lg px-4 py-2 hover:bg-white border border-gray-100"
                  >
                    Download my data
                  </button>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="w-full inline-block text-center rounded-lg px-4 py-2 bg-[#ff6a00] text-white"
                  >
                    Manage cookie preferences
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Need help? Email{" "}
                <a
                  href="mailto:support@digitalhat.com.bd"
                  className="text-[#ff6a00]"
                >
                  support@digitalhat.com.bd
                </a>{" "}
                or visit our{" "}
                <a href="/support" className="text-[#ff6a00]">
                  support center
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
