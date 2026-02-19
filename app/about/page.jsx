import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-yellow-400 py-16 sm:py-24 md:py-32 px-4 sm:px-6 text-center border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight uppercase tracking-tight">
            Growing Local Businesses
            <br />
            Through Community Power
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto font-bold">
            LocalGrow connects people, businesses, and investors
            into one modern ecosystem that builds stronger communities.
          </p>

          <div className="mt-6 sm:mt-10 flex justify-center gap-3 sm:gap-6 flex-wrap">
            <Link
              href="/coupons"
              className="bg-black text-yellow-400 px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all uppercase tracking-wide"
            >
              Explore Platform
            </Link>

            <Link
              href="/u/profile/apply-for-business"
              className="bg-white text-black px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all uppercase tracking-wide"
            >
              Start Business
            </Link>

            <Link
              href="/u/profile/apply-for-investor"
              className="bg-yellow-200 text-black px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all uppercase tracking-wide"
            >
              Become Investor
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INTRO SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-4 sm:mb-6 uppercase">
            A 3-Sided Growth Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-bold">
            Users bring demand. Businesses create value.
            Investors fuel growth. LocalGrow connects all three into
            a circular economic model that benefits everyone.
          </p>
        </div>
      </section>

      {/* ================= USER SECTION ================= */}
      <section className="bg-yellow-200 py-12 sm:py-16 md:py-24 px-4 sm:px-6 border-y-4 border-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

          {/* Image */}
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <Image
              src="/user-section.jpg"
              alt="User Experience"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-4 sm:mb-6 uppercase">
              For App Users
            </h2>

            <p className="text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 font-bold">
              Discover trusted local businesses, claim smart coupons,
              and support your neighborhood economy.
            </p>

            <ul className="space-y-3 text-gray-800 font-bold mb-8">
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Browse verified stores
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Claim & redeem digital coupons
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Save money while shopping local
              </li>
            </ul>

            <video
              src="/user-demo.mp4"
              controls
              className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full"
            />
          </div>

        </div>
      </section>

      {/* ================= BUSINESS SECTION ================= */}
      <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-4 sm:mb-6 uppercase">
              For Business Owners
            </h2>

            <p className="text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 font-bold">
              Promote your brand, analyze performance,
              and connect with investors to scale faster.
            </p>

            <ul className="space-y-3 text-gray-800 font-bold mb-8">
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Launch promotions
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Access analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Receive community funding
              </li>
            </ul>

            <video
              src="/business-demo.mp4"
              controls
              className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full"
            />
          </div>

          {/* Image */}
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <Image
              src="/business-section.jpg"
              alt="Business Dashboard"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

        </div>
      </section>

      {/* ================= INVESTOR SECTION ================= */}
      <section className="bg-yellow-200 py-12 sm:py-16 md:py-24 px-4 sm:px-6 border-y-4 border-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

          {/* Image */}
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <Image
              src="/investor-section.jpg"
              alt="Investor Dashboard"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-4 sm:mb-6 uppercase">
              For Investors
            </h2>

            <p className="text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 font-bold">
              Fund promising local ventures through debt or equity
              and track your portfolio growth transparently.
            </p>

            <ul className="space-y-3 text-gray-800 font-bold mb-8">
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Browse verified opportunities
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Offer structured investments
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black text-sm">✔</span>
                Track ROI performance
              </li>
            </ul>

            <video
              src="/investor-demo.mp4"
              controls
              className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full"
            />
          </div>

        </div>
      </section>

      {/* ================= COMMUNITY SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-4 sm:mb-6 uppercase">
            Together, We Build Stronger Communities
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-bold">
            LocalGrow is not just a platform — it&apos;s a movement.
            A technology-powered ecosystem where local economies
            grow sustainably through collaboration and trust.
          </p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center border-t-4 border-yellow-400">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 uppercase text-yellow-400">
          Join the Local Growth Movement
        </h2>

        <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
          <Link
            href="/coupons"
            className="bg-yellow-400 text-black px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(250,204,21,0.4)] sm:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(250,204,21,0.4)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all uppercase tracking-wide"
          >
            Explore Now
          </Link>

          <Link
            href="/u/profile/apply-for-business"
            className="bg-white text-black px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all uppercase tracking-wide"
          >
            Start Business
          </Link>

          <Link
            href="/u/profile/apply-for-investor"
            className="bg-yellow-200 text-black px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black border-4 border-yellow-200 shadow-[4px_4px_0px_0px_rgba(254,240,138,0.4)] sm:shadow-[6px_6px_0px_0px_rgba(254,240,138,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(254,240,138,0.4)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all uppercase tracking-wide"
          >
            Invest Today
          </Link>
        </div>
      </section>

    </div>
  );
}
