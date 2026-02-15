import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200 py-32 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Growing Local Businesses
            <br />
            Through Community Power
          </h1>

          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
            LocalGrow connects people, businesses, and investors
            into one modern ecosystem that builds stronger communities.
          </p>

          <div className="mt-10 flex justify-center gap-6 flex-wrap">
            <Link
              href="/coupons"
              className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
            >
              Explore Platform
            </Link>

            <Link
              href="/u/profile/apply-for-business"
              className="bg-white border border-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
            >
              Start Business
            </Link>

            <Link
              href="/u/profile/apply-for-investor"
              className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
            >
              Become Investor
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INTRO SECTION ================= */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            A 3-Sided Growth Ecosystem
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Users bring demand. Businesses create value.
            Investors fuel growth. LocalGrow connects all three into
            a circular economic model that benefits everyone.
          </p>
        </div>
      </section>

      {/* ================= USER SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-50 to-sky-100 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div>
            <Image
              src="/user-section.jpg"
              alt="User Experience"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              For App Users
            </h2>

            <p className="text-gray-700 text-lg mb-6">
              Discover trusted local businesses, claim smart coupons,
              and support your neighborhood economy.
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Browse verified stores</li>
              <li>✔ Claim & redeem digital coupons</li>
              <li>✔ Save money while shopping local</li>
            </ul>

            <video
              src="/user-demo.mp4"
              controls
              className="rounded-xl shadow-xl w-full"
            />
          </div>

        </div>
      </section>

      {/* ================= BUSINESS SECTION ================= */}
      <section className="bg-gradient-to-r from-purple-50 to-indigo-100 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              For Business Owners
            </h2>

            <p className="text-gray-700 text-lg mb-6">
              Promote your brand, analyze performance,
              and connect with investors to scale faster.
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Launch promotions</li>
              <li>✔ Access analytics dashboard</li>
              <li>✔ Receive community funding</li>
            </ul>

            <video
              src="/business-demo.mp4"
              controls
              className="rounded-xl shadow-xl w-full"
            />
          </div>

          {/* Image */}
          <div>
            <Image
              src="/business-section.jpg"
              alt="Business Dashboard"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* ================= INVESTOR SECTION ================= */}
      <section className="bg-gradient-to-r from-yellow-50 to-orange-100 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div>
            <Image
              src="/investor-section.jpg"
              alt="Investor Dashboard"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              For Investors
            </h2>

            <p className="text-gray-700 text-lg mb-6">
              Fund promising local ventures through debt or equity
              and track your portfolio growth transparently.
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Browse verified opportunities</li>
              <li>✔ Offer structured investments</li>
              <li>✔ Track ROI performance</li>
            </ul>

            <video
              src="/investor-demo.mp4"
              controls
              className="rounded-xl shadow-xl w-full"
            />
          </div>

        </div>
      </section>

      {/* ================= COMMUNITY SECTION ================= */}
      <section className="py-24 px-6 text-center bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Together, We Build Stronger Communities
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            LocalGrow is not just a platform — it’s a movement.
            A technology-powered ecosystem where local economies
            grow sustainably through collaboration and trust.
          </p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Join the Local Growth Movement
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link
            href="/coupons"
            className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Explore Now
          </Link>

          <Link
            href="/u/profile/apply-for-business"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Start Business
          </Link>

          <Link
            href="/u/profile/apply-for-investor"
            className="bg-gray-200 text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Invest Today
          </Link>
        </div>
      </section>

    </div>
  );
}
