import { useState } from "react";

export default function AdditionalPage() {
  const [subscribed, setSubscribed] = useState({
    abTesting: false,
    exitIntent: false,
    translate: false,
    trustRotator: false,
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubscribe = (key, title) => {
    setSubscribed((prev) => ({ ...prev, [key]: true }));
    setToastMessage(`✓ Access requested for ${title}. We'll notify you as soon as it goes live!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const LABS_FEATURES = [
    {
      id: "abTesting",
      title: "Footer A/B Testing",
      icon: "🧪",
      tag: "Beta",
      tagColor: "#818cf8",
      tagBg: "#e0e7ff",
      desc: "Split test two footer layouts to see which variant performs better in conversion metrics like newsletter signups and trust link clickthroughs.",
      tech: "Built with Shopify CDN Edge integration",
    },
    {
      id: "exitIntent",
      title: "Exit-Intent Mini Overlay",
      icon: "🎯",
      tag: "Developing",
      tagColor: "#f59e0b",
      tagBg: "#fef3c7",
      desc: "Automatically trigger a sleek glassmorphic mini-overlay with payment icons and a newsletter signup when customers show checkout abandonment behavior.",
      tech: "Super lightweight, pure JS trigger",
    },
    {
      id: "translate",
      title: "AI Smart Translation",
      icon: "🌐",
      tag: "In Labs",
      tagColor: "#a855f7",
      tagBg: "#f3e8ff",
      desc: "Translate your footer content dynamically based on the user's localized Shopify region setting. Zero configuration required.",
      tech: "Shopify Translation API integration",
    },
    {
      id: "trustRotator",
      title: "Cart-Aware Trust Badges",
      icon: "🛡️",
      tag: "Planning",
      tagColor: "#ec4899",
      tagBg: "#fce7f3",
      desc: "Change checkout trust badges dynamically based on items currently inside the shopping cart (e.g. show eco-friendly badges for organic products).",
      tech: "Shopify Metafields + Cart API sync",
    },
  ];

  return (
    <div className="fv-fadein" style={{ padding: '0 24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* PAGE HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #311042 100%)',
        borderRadius: '24px',
        padding: '44px 48px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.14)'
      }}>
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            FooterVerse Labs
          </span>
          <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Experimental Features &amp; Add-ons
          </h1>
          <p style={{ fontSize: '15px', color: '#cbd5e1', margin: 0, maxWidth: '560px', lineHeight: 1.6 }}>
            Be the first to try our upcoming storefront additions. Request early beta access or get notified upon public release.
          </p>
        </div>
      </div>

      {/* LABS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {LABS_FEATURES.map((feature, index) => {
          const isSubbed = subscribed[feature.id];
          return (
            <div 
              key={feature.id}
              className={`fv-fadein fv-fadein-delay-${index + 1}`}
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${feature.tagColor}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px'
                  }}>
                    {feature.icon}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: feature.tagColor,
                    backgroundColor: feature.tagBg,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {feature.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>

              <div>
                <div style={{
                  fontSize: '11.5px',
                  color: '#64748b',
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500
                }}>
                  <span style={{ fontSize: '12px' }}>⚙️</span> {feature.tech}
                </div>

                <button
                  onClick={() => !isSubbed && handleSubscribe(feature.id, feature.title)}
                  disabled={isSubbed}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSubbed ? 'default' : 'pointer',
                    border: 'none',
                    backgroundColor: isSubbed ? '#ecfdf5' : '#0f172a',
                    color: isSubbed ? '#059669' : '#ffffff',
                    transition: 'all 0.2s',
                    boxShadow: isSubbed ? 'none' : '0 4px 12px rgba(15,23,42,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubbed) e.currentTarget.style.backgroundColor = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubbed) e.currentTarget.style.backgroundColor = '#0f172a';
                  }}
                >
                  {isSubbed ? '✓ Access Requested' : 'Notify Me & Request Access'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          fontSize: '13px',
          fontWeight: 600,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          animation: 'fv-fadein 0.3s ease both'
        }}>
          {toastMessage}
        </div>
      )}

    </div>
  );
}
