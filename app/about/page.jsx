import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Check, TrendingUp, Users, Briefcase, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
      *, *::before, *::after { box-sizing: border-box; }

      @keyframes ab-fadeUp {
        from { opacity:0; transform:translateY(28px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes ab-shimmer {
        0%   { background-position: -600px 0; }
        100% { background-position:  600px 0; }
      }
      @keyframes ab-float {
        0%,100% { transform:translateY(0); }
        50%     { transform:translateY(-7px); }
      }
      @keyframes ab-pulse {
        0%,100% { opacity:0.5; transform:scale(1); }
        50%     { opacity:0.8; transform:scale(1.04); }
      }

      .ab-hero       { animation: ab-fadeUp 0.6s ease 0.05s both; }
      .ab-intro      { animation: ab-fadeUp 0.6s ease 0.15s both; }
      .ab-sec-user   { animation: ab-fadeUp 0.6s ease 0.1s both; }
      .ab-sec-biz    { animation: ab-fadeUp 0.6s ease 0.1s both; }
      .ab-sec-inv    { animation: ab-fadeUp 0.6s ease 0.1s both; }

      .ab-back-btn {
        transition: all 0.18s ease;
      }
      .ab-back-btn:hover {
        background: linear-gradient(135deg,#3716a8,#6c4bff) !important;
        color: white !important;
        border-color: transparent !important;
        box-shadow: 0 6px 20px rgba(55,22,168,0.38) !important;
        transform: translateX(-3px);
      }

      .ab-cta-primary {
        transition: all 0.2s ease;
      }
      .ab-cta-primary:hover {
        background: linear-gradient(135deg,#5b30e0,#8b5cf6) !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(55,22,168,0.45) !important;
      }
      .ab-cta-outline {
        transition: all 0.2s ease;
      }
      .ab-cta-outline:hover {
        background: #3716a8 !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(55,22,168,0.3) !important;
      }

      .ab-img-wrap {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden; border-radius: 20px;
      }
      .ab-img-wrap:hover {
        transform: translateY(-6px);
        box-shadow: 0 24px 56px rgba(55,22,168,0.2) !important;
      }
      .ab-img-wrap img {
        transition: transform 0.5s ease;
        display: block; width: 100%; height: auto; object-fit: cover;
      }
      .ab-img-wrap:hover img { transform: scale(1.04); }

      .ab-check-item {
        transition: transform 0.15s ease, background 0.15s ease;
        border-radius: 10px; padding: 8px 12px;
      }
      .ab-check-item:hover {
        background: rgba(55,22,168,0.05);
        transform: translateX(4px);
      }

      .ab-final-link {
        transition: all 0.2s ease;
      }
      .ab-final-link:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(0,0,0,0.15) !important;
      }

      .ab-blob {
        animation: ab-pulse 5s ease-in-out infinite;
      }

      @media (max-width: 640px) {
        .ab-grid { grid-template-columns: 1fr !important; }
        .ab-grid-rev { grid-template-columns: 1fr !important; }
        .ab-hero-btns { flex-direction: column !important; align-items: stretch !important; }
        .ab-hero-btns a { text-align: center !important; }
      }
    `}</style>

    <div style={{
      background: '#f8f7ff', color: '#0f0c1d', overflowX: 'hidden',
      fontFamily: "'Outfit','DM Sans',sans-serif",
    }}>

      {/* ── Back to Coupons button ────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 16, left: 16, zIndex: 50,
      }}>
        <Link href="/coupons" className="ab-back-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '9px 16px', borderRadius: '12px',
          background: 'white',
          border: '1.5px solid rgba(55,22,168,0.2)',
          color: '#3716a8', fontWeight: 800, fontSize: '0.78rem',
          letterSpacing: '0.04em', textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(55,22,168,0.12)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'inherit',
        }}>
          <ArrowLeft size={15} /> Coupons
        </Link>
      </div>

      {/* ── Decorative background blobs ──────────────────────────────────── */}
      <div className="ab-blob" aria-hidden style={{
        position: 'fixed', top: -180, right: -180,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,75,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="ab-blob" aria-hidden style={{
        position: 'fixed', bottom: -150, left: -150,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(55,22,168,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0, animationDelay: '2s',
      }} />

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section className="ab-hero" style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(80px,12vw,140px) clamp(16px,5vw,48px) clamp(56px,8vw,100px)',
        textAlign: 'center',
      }}>
        {/* Shimmer gradient headline underline */}
        <div style={{ display: 'inline-block', marginBottom: '16px' }}>
          <span style={{
            fontSize: 'clamp(0.7rem,2vw,0.85rem)', fontWeight: 800,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#6c4bff',
            padding: '4px 14px', borderRadius: '20px',
            background: 'rgba(108,75,255,0.1)',
            border: '1px solid rgba(108,75,255,0.2)',
          }}>
            About LocalGrow
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem,6vw,4.2rem)', fontWeight: 900,
          color: '#3716a8', lineHeight: 1.12, letterSpacing: '-0.03em',
          maxWidth: '820px', margin: '0 auto 20px',
        }}>
          Growing Local Businesses
          <br />
          <span style={{
            background: 'linear-gradient(135deg,#6c4bff,#a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Through Community Power
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.95rem,2.2vw,1.18rem)', color: '#6b7280',
          maxWidth: '580px', margin: '0 auto 36px', lineHeight: 1.7, fontWeight: 500,
        }}>
          LocalGrow connects people, businesses, and investors into
          a powerful ecosystem that strengthens local economies.
        </p>

        <div className="ab-hero-btns" style={{
          display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap',
        }}>
          <Link href="/coupons" className="ab-cta-primary" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '12px 26px', borderRadius: '13px',
            background: 'linear-gradient(135deg,#3716a8,#6c4bff)',
            color: 'white', fontWeight: 800, fontSize: '0.88rem',
            textDecoration: 'none', letterSpacing: '0.04em',
            boxShadow: '0 6px 22px rgba(55,22,168,0.38)',
          }}>
            Explore Platform <ChevronRight size={16} />
          </Link>
          <Link href="/u/profile/apply-for-business" className="ab-cta-outline" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '12px 26px', borderRadius: '13px',
            background: 'white', color: '#3716a8', fontWeight: 800, fontSize: '0.88rem',
            textDecoration: 'none', letterSpacing: '0.04em',
            border: '1.5px solid rgba(55,22,168,0.25)',
            boxShadow: '0 2px 10px rgba(55,22,168,0.08)',
          }}>
            Start Business
          </Link>
          <Link href="/u/profile/apply-for-investor" className="ab-cta-outline" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '12px 26px', borderRadius: '13px',
            background: 'white', color: '#3716a8', fontWeight: 800, fontSize: '0.88rem',
            textDecoration: 'none', letterSpacing: '0.04em',
            border: '1.5px solid rgba(55,22,168,0.25)',
            boxShadow: '0 2px 10px rgba(55,22,168,0.08)',
          }}>
            Become Investor
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          INTRO — 3-sided ecosystem
      ════════════════════════════════════════════════════ */}
      <section className="ab-intro" style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,48px)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem,4vw,2.4rem)', fontWeight: 900,
            color: '#3716a8', marginBottom: '16px', letterSpacing: '-0.02em',
          }}>
            A 3-Sided Growth Ecosystem
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem,2vw,1.08rem)', color: '#6b7280',
            lineHeight: 1.75, fontWeight: 500,
          }}>
            Users create demand. Businesses generate value. Investors fuel growth.
            LocalGrow brings all three together into a circular economic model where everyone benefits.
          </p>

          {/* Trio badges */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '12px',
            flexWrap: 'wrap', marginTop: '28px',
          }}>
            {[
              { icon: <Users size={16}/>,    label: 'Users',     bg: 'rgba(55,22,168,0.07)',   color: '#3716a8', border: 'rgba(55,22,168,0.18)' },
              { icon: <Briefcase size={16}/>, label: 'Businesses',bg: 'rgba(5,150,105,0.07)',   color: '#059669', border: 'rgba(5,150,105,0.18)' },
              { icon: <TrendingUp size={16}/>,label: 'Investors', bg: 'rgba(234,179,8,0.07)',   color: '#b45309', border: 'rgba(234,179,8,0.25)' },
            ].map(({ icon, label, bg, color, border }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '8px 18px', borderRadius: '20px', fontWeight: 700,
                fontSize: '0.82rem', background: bg, color, border: `1.5px solid ${border}`,
              }}>
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          USER SECTION
      ════════════════════════════════════════════════════ */}
      <SectionRow
        className="ab-sec-user"
        reverse={false}
        accent="#3716a8"
        glowColor="rgba(55,22,168,0.15)"
        tag="For App Users"
        title="Discover & Save Locally"
        desc="Discover trusted local businesses, unlock smart coupons, and support the neighborhood economy while saving money."
        checks={[
          'Browse verified local stores',
          'Claim and redeem digital coupons',
          'Save money while shopping local',
        ]}
        imageSrc="/user-section.jpg"
        imageAlt="User Experience"
        videoSrc="/user-demo.mp4"
        bg="#f8f7ff"
      />

      {/* ════════════════════════════════════════════════════
          BUSINESS SECTION
      ════════════════════════════════════════════════════ */}
      <SectionRow
        className="ab-sec-biz"
        reverse={true}
        accent="#059669"
        glowColor="rgba(5,150,105,0.12)"
        tag="For Business Owners"
        title="Promote, Analyse & Grow"
        desc="Promote your brand, run targeted promotions, analyze performance, and connect with investors to accelerate growth."
        checks={[
          'Launch promotional campaigns',
          'Access analytics dashboard',
          'Connect with investors',
        ]}
        imageSrc="/business-section.jpg"
        imageAlt="Business Dashboard"
        videoSrc="/business-demo.mp4"
        bg="white"
      />

      {/* ════════════════════════════════════════════════════
          INVESTOR SECTION
      ════════════════════════════════════════════════════ */}
      <SectionRow
        className="ab-sec-inv"
        reverse={false}
        accent="#b45309"
        glowColor="rgba(180,83,9,0.1)"
        tag="For Investors"
        title="Invest in Local Growth"
        desc="Invest in promising local businesses through transparent opportunities and track the performance of your portfolio."
        checks={[
          'Browse verified opportunities',
          'Offer structured investments',
          'Track ROI performance',
        ]}
        imageSrc="/investor-section.jpg"
        imageAlt="Investor Dashboard"
        videoSrc="/investor-demo.mp4"
        bg="#f8f7ff"
      />

      {/* ════════════════════════════════════════════════════
          COMMUNITY SECTION
      ════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,48px)',
        textAlign: 'center',
        background: 'white',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '16px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg,#3716a8,#6c4bff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(55,22,168,0.32)',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem,4vw,2.4rem)', fontWeight: 900,
            color: '#3716a8', marginBottom: '16px', letterSpacing: '-0.02em',
          }}>
            Together, We Build Stronger Communities
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem,2vw,1.08rem)', color: '#6b7280',
            lineHeight: 1.75, fontWeight: 500,
          }}>
            LocalGrow is more than just a platform — it is a movement that
            empowers communities to grow through technology, collaboration, and trust.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1, overflow: 'hidden',
        padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #3716a8 0%, #5b30e0 50%, #6c4bff 100%)',
      }}>
        {/* Decorative circles */}
        <div aria-hidden style={{
          position: 'absolute', top: -80, right: -80, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: -60, left: -60, width: 220, height: 220,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem,4.5vw,2.8rem)', fontWeight: 900,
            color: 'white', marginBottom: '12px', letterSpacing: '-0.02em',
          }}>
            Join the Local Growth Movement
          </h2>
          <p style={{
            fontSize: 'clamp(0.85rem,2vw,1rem)', color: 'rgba(255,255,255,0.72)',
            marginBottom: '36px', fontWeight: 500,
          }}>
            Start exploring, building, or investing today.
          </p>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap',
          }}>
            {[
              { href: '/coupons',                          label: 'Explore Now',      light: true  },
              { href: '/u/profile/apply-for-business',     label: 'Start Business',   light: false },
              { href: '/u/profile/apply-for-investor',     label: 'Invest Today',     light: true  },
            ].map(({ href, label, light }) => (
              <Link key={href} href={href} className="ab-final-link" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '12px 26px', borderRadius: '13px', fontWeight: 800,
                fontSize: '0.88rem', letterSpacing: '0.04em', textDecoration: 'none',
                background: light ? 'white' : 'rgba(255,255,255,0.15)',
                color: light ? '#3716a8' : 'white',
                border: light ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: light ? '0 4px 16px rgba(0,0,0,0.12)' : 'none',
                fontFamily: "'Outfit','DM Sans',sans-serif",
              }}>
                {label} <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
    </>
  );
}

// ─── Reusable section row ─────────────────────────────────────────────────────
function SectionRow({ reverse, accent, glowColor, tag, title, desc, checks, imageSrc, imageAlt, videoSrc, bg, className }) {
  const content = (
    <div>
      <span style={{
        display: 'inline-block', marginBottom: '12px',
        fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: accent,
        padding: '3px 12px', borderRadius: '20px',
        background: `${glowColor}`,
        border: `1.5px solid ${accent}33`,
      }}>
        {tag}
      </span>
      <h2 style={{
        fontSize: 'clamp(1.4rem,3.5vw,2.1rem)', fontWeight: 900,
        color: '#0f0c1d', marginBottom: '14px', letterSpacing: '-0.02em', lineHeight: 1.2,
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: 'clamp(0.88rem,2vw,1rem)', color: '#6b7280',
        lineHeight: 1.75, marginBottom: '22px', fontWeight: 500,
      }}>
        {desc}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {checks.map(item => (
          <li key={item} className="ab-check-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: 22, height: 22, borderRadius: '7px', flexShrink: 0,
              background: `linear-gradient(135deg,${accent}cc,${accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 3px 8px ${glowColor}`,
            }}>
              <Check size={12} color="white" strokeWidth={3} />
            </span>
            <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>{item}</span>
          </li>
        ))}
      </ul>
      <video
        src={videoSrc}
        controls
        style={{
          borderRadius: '16px', width: '100%',
          boxShadow: `0 8px 32px ${glowColor}`,
          border: `1.5px solid ${accent}22`,
          display: 'block',
        }}
      />
    </div>
  );

  const visual = (
    <div>
      <div className="ab-img-wrap" style={{
        boxShadow: `0 8px 32px ${glowColor}`,
        border: `1.5px solid ${accent}18`,
        marginBottom: '16px',
      }}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={400}
          style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
        />
      </div>
    </div>
  );

  return (
    <section className={className} style={{
      position: 'relative', zIndex: 1, background: bg,
      padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,48px)',
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div className="ab-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px),1fr))',
          gap: 'clamp(28px,5vw,64px)',
          alignItems: 'center',
        }}>
          {reverse ? <>{content}{visual}</> : <>{visual}{content}</>}
        </div>
      </div>
    </section>
  );
}