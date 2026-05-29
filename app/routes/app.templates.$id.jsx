import { useState, useEffect, useRef } from "react";
import { useLoaderData, useFetcher, useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { PLAN_STARTER, PLAN_BUSINESS, PLAN_PREMIUM, checkPlanAccess } from "../constants";
import { getShopSettings, updateShopSettings, syncSettingsToShopify } from "../db.helpers.server";
import FooterRenderer, { defaultFooterSettings } from "../components/FooterRenderer";

// Template metadata lookup — mirrors dashboard data
const TEMPLATE_INFO = {
  "1": { name: "Zenith Minimal",        tags: ["SaaS", "Agency"],           tier: "FREE",                  tierColor: "#64748b" },
  "2": { name: "Sleek Commerce",         tags: ["Ecommerce"],                tier: "STARTER",               tierColor: "#3b82f6" },
  "3": { name: "Dark Tech Startup",      tags: ["SaaS", "Ecommerce"],        tier: "STARTER",               tierColor: "#a855f7" },
  "4": { name: "Creative Agency",        tags: ["Agency"],                   tier: "BUSINESS",              tierColor: "#ec4899" },
  "5": { name: "Elegant Premium Brand",  tags: ["Luxury", "Fashion"],        tier: "BUSINESS",              tierColor: "#f59e0b" },
  "6": { name: "Luxury Fashion Brand",   tags: ["Luxury", "Fashion"],        tier: "PREMIUM",               tierColor: "#10b981" },
  "7": { name: "Ultra Luxury Animated",  tags: ["Luxury", "SaaS"],           tier: "PREMIUM",               tierColor: "#6366f1" },
};

export const loader = async ({ request, params }) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;
  const id = params.id;

  // 1. Get active plan
  let activePlan = "Free";
  try {
    const billingCheck = await billing.check({
      plans: [PLAN_STARTER, PLAN_BUSINESS, PLAN_PREMIUM],
      isTest: true,
    });
    if (billingCheck.hasActivePayment && billingCheck.appSubscriptions?.length > 0) {
      activePlan = billingCheck.appSubscriptions[0].name;
    }
  } catch (err) {
    console.error("Billing check error on Customizer Loader:", err);
  }

  // 2. Validate template access (allow live preview but prevent saving if locked)
  const isUnlocked = checkPlanAccess(activePlan, id);

  // 3. Load settings
  const shopSettings = await getShopSettings(shop);

  return {
    shop,
    activePlan,
    templateId: id,
    savedSettings: shopSettings.parsedSettings,
    isUnlocked
  };
};

export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;
  
  const formData = await request.formData();
  const templateId = formData.get("templateId");
  const settingsJson = formData.get("settingsJson");

  // Save in local SQLite
  await updateShopSettings(shop, {
    installedFooter: templateId,
    settingsJson
  });

  // Sync with Shopify Metafields
  const parsedSettings = JSON.parse(settingsJson);
  const synced = await syncSettingsToShopify(admin, shop, {
    installedFooterId: templateId,
    ...parsedSettings
  });

  return { success: true, synced };
};

// ==========================================================================
// STOREFRONT SIMULATOR SECTIONS (Reusable & Scalable Preview Architecture)
// ==========================================================================

// 1. Mock Announcement Bar (Modular & Reusable)
function MockAnnouncementBar({ text = "✨ Free express shipping on orders over $150 • Code: ELEGANCE" }) {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: 700,
      padding: '8px 16px',
      textAlign: 'center',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      position: 'relative',
      zIndex: 15,
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'inline-block',
        animation: 'fv-announcement-scroll 25s linear infinite'
      }}>
        {text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {text}
      </div>
    </div>
  );
}

// 2. Mock Storefront Header / Navbar (Modular & Reusable)
function MockHeader({ brandName = "AURORA FASHION" }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky',
      top: 0,
      zIndex: 12,
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <span style={{ fontWeight: 900, fontSize: '17px', letterSpacing: '2px', color: '#0f172a', textTransform: 'uppercase' }}>
        {brandName}
      </span>

      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
        {['Home', 'New Arrivals', 'Shop Catalog', 'Lookbook', 'Journal'].map((item) => (
          <span 
            key={item} 
            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
          >
            {item}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#475569' }}>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg style={{ width: '19px', height: '19px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: '9px',
            fontWeight: 800,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(79,70,229,0.3)'
          }}>
            3
          </span>
        </div>
      </div>
    </div>
  );
}

// 3. Mock Hero Section (Modular & Reusable)
function MockHero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef2f2 0%, #fae8ff 100%)',
      padding: '72px 48px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#db2777',
          backgroundColor: '#fce7f3',
          padding: '4px 12px',
          borderRadius: '30px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '16px',
          display: 'inline-block'
        }}>
          New Season Collection
        </span>
        <h1 style={{
          fontSize: '40px',
          fontWeight: 900,
          color: '#111827',
          margin: '0 0 16px 0',
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          maxWidth: '650px'
        }}>
          Elevate Your Everyday Style
        </h1>
        <p style={{
          fontSize: '14.5px',
          color: '#4b5563',
          margin: '0 0 28px 0',
          maxWidth: '520px',
          lineHeight: 1.6
        }}>
          Experience unmatched comfort and timeless design with our latest edit of clothing, footwear, and accessories. Crafted using sustainable premium fabrics.
        </p>
        <div style={{ display: 'flex', gap: '14px' }}>
          <button style={{
            backgroundColor: '#111827',
            color: '#ffffff',
            border: 'none',
            padding: '13px 32px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 4px 12px rgba(17,24,39,0.15)'
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
          >
            Shop Apparel
          </button>
          <button style={{
            backgroundColor: 'transparent',
            color: '#111827',
            border: '2px solid #111827',
            padding: '11px 30px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#111827'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#111827'; }}
          >
            Explore Lookbook
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Mock Trust Pillars (Modular & Reusable)
function MockTrustPillars() {
  const pillars = [
    { title: "Worldwide Shipping", desc: "Express delivery to over 150 countries", icon: "✈️" },
    { title: "Secure Checkout", desc: "100% encrypted payment networks", icon: "🛡️" },
    { title: "Sustainable Choice", desc: "Ethically made from organic fibers", icon: "🌿" },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      padding: '40px 32px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9'
    }}>
      {pillars.map((pillar) => (
        <div key={pillar.title} style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            {pillar.icon}
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{pillar.title}</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>{pillar.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. Mock Product Collection Showcase (Modular & Reusable)
function MockProductCollection() {
  const products = [
    { title: "Aura Premium Silk Dress", price: "$189.00", badge: "BEST SELLER", bg: "#fef3c7", rating: "★★★★★ (48)" },
    { title: "Modernist Minimalist Watch", price: "$340.00", badge: "NEW", bg: "#dbeafe", rating: "★★★★★ (19)" },
    { title: "Classic Leather Weekender", price: "$260.00", badge: "10% OFF", bg: "#f3e8ff", rating: "★★★★☆ (32)" },
  ];

  return (
    <div style={{ padding: '56px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Top Selling Gear</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>The most popular items from our summer lineup.</p>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', cursor: 'pointer' }}>View All Collections &rarr;</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {products.map((p, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #f1f5f9',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,23,42,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              backgroundColor: p.bg,
              height: '180px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.5px'
              }}>{p.badge}</span>
              <svg style={{ width: '44px', height: '44px', color: 'rgba(0,0,0,0.05)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#db2777', fontWeight: 800, marginBottom: '2px' }}>★ CLOTHING & ACCESSORIES</div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>{p.title}</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{p.price}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>{p.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Mock Editorial Promo Split Banner (Modular & Reusable)
function MockEditorialPromo() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '56px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px', color: '#818cf8', textTransform: 'uppercase' }}>Join the Circle</span>
        <h3 style={{ fontSize: '28px', fontWeight: 800, margin: 0, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
          Subscribe &amp; Get 15% Off Your First Purchase
        </h3>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0, lineHeight: 1.6, maxWidth: '400px' }}>
          Subscribe to our newsletter to receive secret lookbooks, priority drop access, and modern store styling tips.
        </p>
        <div style={{ display: 'flex', width: '100%', maxWidth: '360px', gap: '8px', marginTop: '8px' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            disabled 
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.04)',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '13px'
          }}>
            Subscribe
          </button>
        </div>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 40px',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎁</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>Free Worldwide Shipping</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Apply code at checkout on orders over $150.</div>
        </div>
      </div>
    </div>
  );
}

// 7. Mock Instagram Feed Gallery (Modular & Reusable)
function MockInstagramFeed() {
  return (
    <div style={{ padding: '40px 32px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>@AURORA_STUDIOS</h4>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Follow our journey and tag us to get featured.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '12px'
      }}>
        {[
          "linear-gradient(135deg, #fce7f3 0%, #db2777 100%)",
          "linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)",
          "linear-gradient(135deg, #f3e8ff 0%, #7c3aed 100%)",
          "linear-gradient(135deg, #ffe4e6 0%, #e11d48 100%)",
          "linear-gradient(135deg, #ffedd5 0%, #ea580c 100%)",
          "linear-gradient(135deg, #e0f2fe 0%, #0284c7 100%)"
        ].map((bg, idx) => (
          <div key={idx} style={{
            height: '80px',
            background: bg,
            borderRadius: '8px',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'transform 0.2s'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800
            }}>
              📷
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Reusable Storefront Shell wrapper
function MockStorefront({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: '#ffffff' }}>
      <MockAnnouncementBar />
      <MockHeader />
      <MockHero />
      <MockTrustPillars />
      <MockProductCollection />
      <MockEditorialPromo />
      <MockInstagramFeed />
      {children}
    </div>
  );
}

export default function CustomizeFooter() {
  const { templateId, savedSettings, isUnlocked } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const footerRef = useRef(null);

  const tplInfo = TEMPLATE_INFO[String(templateId)] || { name: `Footer #${templateId}`, tags: [], tier: "", tierColor: "#64748b" };

  const currentNum = parseInt(templateId, 10) || 1;
  const totalTemplates = Object.keys(TEMPLATE_INFO).length;
  const prevId = currentNum > 1 ? String(currentNum - 1) : String(totalTemplates);
  const nextId = currentNum < totalTemplates ? String(currentNum + 1) : "1";

  // Local customize states
  const [settings, setSettings] = useState({
    ...defaultFooterSettings,
    ...savedSettings
  });

  const [activeTab, setActiveTab] = useState("colors"); // colors, brand, links, socials, blocks
  const [viewport, setViewport] = useState("desktop"); // desktop, mobile
  const [loading, setLoading] = useState(true);

  // Trigger loading skeletons transition on mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Toast handler
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Footer saved and installed in theme metafields!");
    }
  }, [fetcher.data, shopify]);

  const handleColorChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleBrandChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [key]: value
      }
    }));
  };

  const handleNewsletterChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        [key]: value
      }
    }));
  };

  const handleSocialChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [key]: value
      }
    }));
  };

  const handleVisibilityChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      visibleBlocks: {
        ...prev.visibleBlocks,
        [key]: value
      }
    }));
  };

  const handlePaymentChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        [key]: value
      }
    }));
  };

  const handleLinkChange = (group, index, field, value) => {
    setSettings((prev) => {
      const linksCopy = [...prev.links[group]];
      linksCopy[index] = { ...linksCopy[index], [field]: value };
      return {
        ...prev,
        links: {
          ...prev.links,
          [group]: linksCopy
        }
      };
    });
  };

  const addLink = (group) => {
    setSettings((prev) => {
      const linksCopy = [...prev.links[group]];
      linksCopy.push({ label: "New Link", url: "#" });
      return {
        ...prev,
        links: {
          ...prev.links,
          [group]: linksCopy
        }
      };
    });
  };

  const removeLink = (group, index) => {
    setSettings((prev) => {
      const linksCopy = [...prev.links[group]];
      linksCopy.splice(index, 1);
      return {
        ...prev,
        links: {
          ...prev.links,
          [group]: linksCopy
        }
      };
    });
  };

  const saveSettings = () => {
    if (!isUnlocked) return;
    fetcher.submit(
      {
        templateId,
        settingsJson: JSON.stringify(settings)
      },
      { method: "POST" }
    );
  };

  const isSaving = fetcher.state !== "idle";

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#f8fafc',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* Stylesheets injection for Scroll & Scale animations */}
      <style>{`
        @keyframes fv-announcement-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes fv-pulse-upgrade {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); }
          50% { transform: scale(1.04); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.45); }
        }
        @keyframes fv-viewport-shrink {
          from { transform: scale(1.02); opacity: 0.6; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .fv-viewport-frame {
          animation: fv-viewport-shrink 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fv-scroll-hint {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(4px); }
        }
        .fv-scroll-hint-arrow { animation: fv-scroll-hint 1.4s ease-in-out infinite; }
      `}</style>

      {/* 1. TOP CONTROL BAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#ffffff',
        borderBottom: '1px solid #e8edf3',
        zIndex: 20,
        boxShadow: '0 1px 0 #e8edf3, 0 2px 8px rgba(15,23,42,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/app')} 
            style={{
              padding: '7px 14px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s',
              letterSpacing: '0.2px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
          >
            ← Dashboard
          </button>

          {/* Quick template navigator buttons */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => navigate(`/app/templates/${prevId}`)}
              title="Previous Template"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <button
              onClick={() => navigate(`/app/templates/${nextId}`)}
              title="Next Template"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${tplInfo.tierColor}, ${tplInfo.tierColor}aa)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              flexShrink: 0
            }}>
              ✨
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.2px' }}>
                {tplInfo.name}
              </h2>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: tplInfo.tierColor,
                  backgroundColor: `${tplInfo.tierColor}15`,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  letterSpacing: '0.4px'
                }}>
                  {tplInfo.tier}
                </span>
                {tplInfo.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '0.2px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {!isUnlocked ? (
              <span style={{
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: '20px',
                letterSpacing: '0.5px',
                border: '1px solid #fecaca',
                whiteSpace: 'nowrap'
              }}>
                🔒 PREVIEW ONLY
              </span>
            ) : (
              <span style={{
                background: '#f0fdf4',
                color: '#16a34a',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: '20px',
                letterSpacing: '0.5px',
                border: '1px solid #bbf7d0',
                whiteSpace: 'nowrap'
              }}>
                ✓ UNLOCKED
              </span>
            )}
          </div>
        </div>

        {/* Viewport switch controls (Desktop / Mobile) */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button 
            onClick={() => setViewport('desktop')}
            style={{
              padding: '6px 14px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: viewport === 'desktop' ? '#ffffff' : 'transparent',
              boxShadow: viewport === 'desktop' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
              fontSize: '12px',
              fontWeight: viewport === 'desktop' ? 700 : 600,
              color: viewport === 'desktop' ? '#4f46e5' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="13" rx="2"></rect>
              <path d="M12 16v5M8 21h8" strokeLinecap="round"></path>
            </svg>
            Desktop
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            style={{
              padding: '6px 14px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: viewport === 'mobile' ? '#ffffff' : 'transparent',
              boxShadow: viewport === 'mobile' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
              fontSize: '12px',
              fontWeight: viewport === 'mobile' ? 700 : 600,
              color: viewport === 'mobile' ? '#4f46e5' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="2" width="12" height="20" rx="3"></rect>
              <circle cx="12" cy="18" r="1.5" fill="currentColor"></circle>
            </svg>
            Mobile
          </button>
        </div>

        {/* Sticky Action CTA */}
        <div>
          {isUnlocked ? (
            <button 
              onClick={saveSettings} 
              disabled={isSaving}
              style={{ 
                backgroundColor: '#4f46e5', 
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
                transition: 'all 0.2s',
                opacity: isSaving ? 0.7 : 1
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              {isSaving ? 'Installing...' : 'Save & Install Footer'}
            </button>
          ) : (
            <button 
              onClick={() => navigate('/app/pricing')}
              style={{ 
                backgroundColor: '#ef4444', 
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                transition: 'all 0.2s',
                animation: 'fv-pulse-upgrade 2s infinite ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Upgrade to Install
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN SPLIT BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN: Sidebar Customizer Panel */}
        <div style={{
          width: '380px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          zIndex: 10
        }}>
          {/* Locked warning banner */}
          {!isUnlocked && (
            <div style={{
              background: '#fef2f2',
              borderBottom: '1px solid #fee2e2',
              padding: '16px 20px',
              color: '#991b1b',
              fontSize: '13px',
              lineHeight: 1.5
            }}>
              <strong style={{ display: 'block', marginBottom: '2px' }}>🔒 Preview Mode Active</strong>
              Customize style settings below. Upgrade plan to install this footer in theme metafields.
            </div>
          )}

          {/* Customizer Tabs Header */}
          <div style={{
            display: 'flex',
            gap: '4px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '8px 12px'
          }}>
            {[
              { id: 'colors', label: 'Colors', emoji: '🎨' },
              { id: 'brand', label: 'Brand', emoji: '✏️' },
              { id: 'links', label: 'Links', emoji: '🔗' },
              { id: 'socials', label: 'Social', emoji: '📱' },
              { id: 'blocks', label: 'Blocks', emoji: '🧩' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  background: activeTab === tab.id ? '#ffffff' : 'none',
                  border: activeTab === tab.id ? '1px solid #e2e8f0' : '1px solid transparent',
                  borderRadius: '8px',
                  color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                  fontSize: '11px',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                  boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Options Content */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Panel 1: Colors */}
            {activeTab === 'colors' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Color Palette</h3>
                
                {Object.entries({
                  background: 'Background Color',
                  text: 'Body Text Color',
                  heading: 'Heading Color',
                  accent: 'Accent / Hover Color',
                  icon: 'Social Icons Color'
                }).map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>{label}</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="color" 
                          value={settings.colors[key] || '#ffffff'} 
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          style={{
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            width: '42px',
                            height: '38px',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        />
                      </div>
                      <input 
                        type="text" 
                        value={settings.colors[key] || ''} 
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          color: '#0f172a',
                          fontFamily: 'monospace',
                          background: '#fafafa',
                          transition: 'border-color 0.15s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#818cf8'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Panel 2: Brand & Newsletter */}
            {activeTab === 'brand' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px 0' }}>Brand Identity</h4>
                  {[
                    { key: 'title', label: 'Store / Brand Name', placeholder: 'Your Brand', type: 'text' },
                    { key: 'logoUrl', label: 'Logo Image URL', placeholder: 'https://yourstore.com/logo.png', type: 'text' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                      <label htmlFor={`brand-${key}`} style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</label>
                      <input
                        id={`brand-${key}`}
                        type="text"
                        value={settings.brand[key]}
                        onChange={(e) => handleBrandChange(key, e.target.value)}
                        placeholder={placeholder}
                        style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', transition: 'border-color 0.15s' }}
                        onFocus={(e) => e.target.style.borderColor = '#818cf8'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="brand-description" style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Brand Tagline</label>
                    <textarea
                      id="brand-description"
                      value={settings.brand.description}
                      onChange={(e) => handleBrandChange('description', e.target.value)}
                      rows="3"
                      placeholder="A short description of your store..."
                      style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', background: '#fff', lineHeight: 1.5, transition: 'border-color 0.15s' }}
                      onFocus={(e) => e.target.style.borderColor = '#818cf8'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px 0' }}>Newsletter Block</h4>
                  {[
                    { key: 'title', label: 'Heading', placeholder: 'Keep in Touch' },
                    { key: 'subtitle', label: 'Subtext', placeholder: 'Get exclusive deals...' },
                    { key: 'btnText', label: 'Button Label', placeholder: 'Subscribe' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                      <label htmlFor={`newsletter-${key}`} style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</label>
                      <input
                        id={`newsletter-${key}`}
                        type="text"
                        value={settings.newsletter[key]}
                        onChange={(e) => handleNewsletterChange(key, e.target.value)}
                        placeholder={placeholder}
                        style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', transition: 'border-color 0.15s' }}
                        onFocus={(e) => e.target.style.borderColor = '#818cf8'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Panel 3: Links */}
            {activeTab === 'links' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Store Menus</h3>

                {['quickLinks', 'supportLinks'].map((group) => (
                  <div key={group} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>
                        {group === 'quickLinks' ? 'Quick Links Menu' : 'Support Menu'}
                      </span>
                      <button 
                        onClick={() => addLink(group)}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          background: '#ffffff',
                          fontWeight: 700,
                          color: '#475569',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                      >
                        + Add link
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {settings.links[group].map((link, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={link.label} 
                            onChange={(e) => handleLinkChange(group, idx, 'label', e.target.value)}
                            placeholder="Text"
                            style={{ flex: 1, padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                          />
                          <input 
                            type="text" 
                            value={link.url} 
                            onChange={(e) => handleLinkChange(group, idx, 'url', e.target.value)}
                            placeholder="URL"
                            style={{ flex: 1, padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
                          />
                          <button 
                            onClick={() => removeLink(group, idx)}
                            style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', padding: '0 4px' }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Panel 4: Social handles */}
            {activeTab === 'socials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 14px 0' }}>Social Media Profiles</h4>
                  {Object.entries({
                    facebook: { label: 'Facebook', emoji: '📘' },
                    instagram: { label: 'Instagram', emoji: '📸' },
                    twitter: { label: 'Twitter / X', emoji: '🐦' },
                    youtube: { label: 'YouTube', emoji: '📺' },
                    linkedin: { label: 'LinkedIn', emoji: '💼' },
                  }).map(([platform, { label, emoji }]) => (
                    <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>{emoji}</span> {label}
                      </label>
                      <input 
                        type="text" 
                        value={settings.socials[platform] || ''} 
                        onChange={(e) => handleSocialChange(platform, e.target.value)}
                        placeholder={`https://${platform}.com/yourstore`}
                        style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', outline: 'none', background: '#fff', transition: 'border-color 0.15s' }}
                        onFocus={(e) => e.target.style.borderColor = '#818cf8'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Panel 5: Blocks Visibility */}
            {activeTab === 'blocks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Block Visibility</h3>

                {Object.keys(settings.visibleBlocks).map((blockId) => (
                  <div key={blockId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>
                      {blockId === 'quickLinks' ? 'Quick Links' : 
                       blockId === 'supportLinks' ? 'Support Links' : 
                       blockId === 'trustBadges' ? 'Trust Badges' : `${blockId}`}
                    </span>
                    <input 
                      type="checkbox" 
                      checked={settings.visibleBlocks[blockId]} 
                      onChange={(e) => handleVisibilityChange(blockId, e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </div>
                ))}

                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '16px 0 0 0' }}>Payment Badges</h3>

                {Object.keys(settings.payments).map((cardId) => (
                  <div key={cardId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                      {cardId}
                    </span>
                    <input 
                      type="checkbox" 
                      checked={settings.payments[cardId]} 
                      onChange={(e) => handlePaymentChange(cardId, e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic Live Store Simulator */}
        <div style={{
          flex: 1,
          padding: viewport === 'mobile' ? '24px 12px' : '32px',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
          alignItems: 'flex-start',
          background: '#e8edf3',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          position: 'relative'
        }}>
          {loading ? (
            /* Premium Shimmer Skeletons */
            <div style={{
              width: viewport === 'mobile' ? '375px' : '100%',
              maxWidth: viewport === 'mobile' ? '375px' : '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div className="fv-skeleton" style={{ height: '32px', width: '100%' }} />
              <div className="fv-skeleton" style={{ height: '64px', width: '100%' }} />
              <div className="fv-skeleton" style={{ height: '350px', width: '100%' }} />
              <div className="fv-skeleton" style={{ height: '120px', width: '100%' }} />
              <div className="fv-skeleton" style={{ height: '240px', width: '100%' }} />
            </div>
          ) : (
            /* Animated Mock Store Frame */
            <div
              key={viewport}
              className="fv-viewport-frame"
              style={{
                width: viewport === 'mobile' ? '390px' : '100%',
                maxWidth: viewport === 'mobile' ? '390px' : '1200px',
                backgroundColor: '#ffffff',
                borderRadius: viewport === 'mobile' ? '40px' : '16px',
                border: viewport === 'mobile' ? '10px solid #0f172a' : '8px solid #0f172a',
                boxShadow: viewport === 'mobile'
                  ? '0 30px 60px -10px rgba(15,23,42,0.35), inset 0 0 0 2px rgba(255,255,255,0.05)'
                  : '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Mobile top notch bar */}
              {viewport === 'mobile' && (
                <div style={{
                  background: '#0f172a',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{ width: '60px', height: '10px', background: '#1e293b', borderRadius: '8px' }} />
                </div>
              )}
              <MockStorefront>
                <div ref={footerRef}>
                  <FooterRenderer templateId={templateId} settings={settings} />
                </div>
              </MockStorefront>
            </div>
          )}

          {/* Scroll to footer hint — floating pill */}
          <button
            type="button"
            onClick={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              position: 'absolute',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15,23,42,0.8)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '7px 16px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              zIndex: 25,
              letterSpacing: '0.3px',
              border: '1px solid rgba(255,255,255,0.1)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              transition: 'opacity 0.2s',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span className="fv-scroll-hint-arrow">↓</span> Jump to Footer
          </button>

          {/* Sticky/Floating action CTA in viewport container */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 30
          }}>
            {isUnlocked ? (
              <button 
                onClick={saveSettings} 
                disabled={isSaving}
                style={{ 
                  backgroundColor: '#4f46e5', 
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(79, 70, 229, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isSaving ? 0.7 : 1
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = '#4338ca'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = '#4f46e5'; }}
              >
                📥 {isSaving ? 'Installing...' : 'Install Footer Design'}
              </button>
            ) : (
              <button 
                onClick={() => navigate('/app/pricing')}
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(239, 68, 68, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'fv-pulse-upgrade 2s infinite ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                👑 Upgrade to Unlock &amp; Install
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
