import { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { PLAN_STARTER, PLAN_BUSINESS, PLAN_PREMIUM, checkPlanAccess, unlockedCount } from "../constants";
import { getShopSettings, updateShopSettings } from "../db.helpers.server";

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

  // Detect return from Shopify billing approval page.
  // After the merchant approves billing, Shopify redirects back to:
  //   <SHOPIFY_APP_URL>/app?billing_success=true
  // We log this so it's clear in server logs, then re-check billing below.
  const url = new URL(request.url);
  const billingSuccess = url.searchParams.get("billing_success");
  if (billingSuccess) {
    console.log(`[HyperFoot] Billing approval returned for shop: ${shop}`);
  }

  // 1. Dynamic plan check via Shopify Billing API
  // This always runs — on billing_success it picks up the newly activated plan.
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
    console.error("Billing check error on Dashboard:", err);
  }

  // 2. Sync to local database
  await updateShopSettings(shop, { activePlan });

  // 3. Retrieve settings
  const shopSettings = await getShopSettings(shop);

  return {
    shop: session.shop,
    activePlan,
    billingSuccess: !!billingSuccess,
    installedFooter: shopSettings.installedFooter || "1",
    parsedSettings: shopSettings.parsedSettings,
  };
};

const TEMPLATES = [
  {
    id: "1",
    name: "Zenith Minimal",
    tier: "Free",
    tierLabel: "FREE",
    color: "#64748b",
    desc: "Minimalist, high-whitespace branding footer. Ideal for minimal agencies, portfolio sites, or startup brand headers.",
    previewGradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    isDark: false,
    tags: ["SaaS", "Agency"]
  },
  {
    id: "2",
    name: "Sleek Commerce",
    tier: "Starter Plan",
    tierLabel: "STARTER ($50/mo)",
    color: "#3b82f6",
    desc: "Robust classic retail grid. Support for quick links, newsletter signup block, and grid checkout trust icons.",
    previewGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    isDark: false,
    tags: ["Ecommerce"]
  },
  {
    id: "3",
    name: "Dark Tech Startup",
    tier: "Starter Plan",
    tierLabel: "STARTER ($50/mo)",
    color: "#a855f7",
    desc: "Glowing cyberpunk accents on solid black. Bold newsletter inputs, pulsing outlines, and glossy dark backgrounds.",
    previewGradient: "linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)",
    isDark: true,
    tags: ["SaaS", "Ecommerce"]
  },
  {
    id: "4",
    name: "Creative Agency",
    tier: "Business Plan",
    tierLabel: "BUSINESS ($70/mo)",
    color: "#ec4899",
    desc: "Asymmetrical double-decker CTA. High-impact fonts, letter-space stretching, and interactive responsive structures.",
    previewGradient: "linear-gradient(135deg, #000 0%, #111 100%)",
    isDark: true,
    tags: ["Agency"]
  },
  {
    id: "5",
    name: "Elegant Premium Brand",
    tier: "Business Plan",
    tierLabel: "BUSINESS ($70/mo)",
    color: "#f59e0b",
    desc: "Prestige corporate layout. Featuring top premium newsletters, elegant sliders, and dedicated badge lists.",
    previewGradient: "linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)",
    isDark: false,
    tags: ["Luxury", "Fashion"]
  },
  {
    id: "6",
    name: "Luxury Fashion Brand",
    tier: "Premium Plan",
    tierLabel: "PREMIUM ($100/mo)",
    color: "#10b981",
    desc: "Sophisticated editorial fashion style. Elegant serif typography, floating underlines, and ultra-high-end spacing.",
    previewGradient: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
    isDark: false,
    tags: ["Luxury", "Fashion"]
  },
  {
    id: "7",
    name: "Ultra Luxury Animated",
    tier: "Premium Plan",
    tierLabel: "PREMIUM ($100/mo)",
    color: "#6366f1",
    desc: "Futuristic interactive masterwork. Blurry neon glassmorphic panels, responsive glowing cards, fluid hover flows.",
    previewGradient: "linear-gradient(135deg, #03001e 0%, #7303c0 50%, #ec38bc 100%)",
    isDark: true,
    tags: ["Luxury", "SaaS"]
  }
];

export default function Index() {
  const { activePlan, installedFooter, billingSuccess } = useLoaderData();
  const shopify = useAppBridge();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showBillingBanner, setShowBillingBanner] = useState(!!billingSuccess);
  
  const fetcher = useFetcher();

  // Handle direct billing upgrades from the dashboard (bypassing pricing page)
  useEffect(() => {
    if (fetcher.data?.confirmationUrl) {
      window.open(fetcher.data.confirmationUrl, "_top");
    }
    if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true, duration: 5000 });
    }
  }, [fetcher.data, shopify]);

  // Show a toast notification when the merchant returns from billing approval.
  // shopify.toast is the App Bridge way to show embedded notifications.
  useEffect(() => {
    if (billingSuccess) {
      shopify.toast.show(`🎉 ${activePlan} activated successfully!`, { duration: 5000 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFooterName = (id) => {
    const found = TEMPLATES.find(t => t.id === String(id));
    return found ? found.name : 'Zenith Minimal';
  };

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesSearch = tpl.name.toLowerCase().includes(search.toLowerCase()) || 
                          tpl.desc.toLowerCase().includes(search.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === "free") matchesTab = tpl.tier === "Free";
    else if (activeTab === "starter") matchesTab = tpl.tier === "Starter Plan";
    else if (activeTab === "business") matchesTab = tpl.tier === "Business Plan";
    else if (activeTab === "premium") matchesTab = tpl.tier === "Premium Plan";

    return matchesSearch && matchesTab;
  });

  return (
    <div className="fv-fadein" style={{ padding: '0 24px 40px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* BILLING SUCCESS BANNER — shown after merchant approves billing and returns */}
      {showBillingBanner && (
        <div style={{
          background: 'linear-gradient(135deg, #052e16 0%, #064e3b 100%)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 4px 20px rgba(34,197,94,0.08)',
        }}>
          <span style={{ fontSize: '24px' }}>🎉</span>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', color: '#4ade80', fontSize: '15px', fontWeight: 800, marginBottom: '2px' }}>
              {activePlan} Activated!
            </strong>
            <span style={{ color: '#86efac', fontSize: '13px' }}>
              Your subscription is live. Enjoy your newly unlocked footer templates.
            </span>
          </div>
          <button
            onClick={() => setShowBillingBanner(false)}
            style={{ background: 'transparent', border: 'none', color: '#4ade80', fontSize: '20px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}

      {/* SECTION 1 — PREMIUM HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        padding: '50px 40px',
        borderRadius: '24px',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '40px'
      }}>
        <div style={{ flex: '1 1 500px', position: 'relative', zIndex: 2 }}>
          <span style={{
            background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '13px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'block',
            marginBottom: '12px'
          }}>
            Storefront Extensions
          </span>
          <h1 style={{ fontSize: '40px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px', lineHeight: '1.15' }}>
            Elevate Your Store&apos;s Footer Experience
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: '0 0 28px 0', maxWidth: '600px', lineHeight: '1.6' }}>
            Choose from a collection of premium, mobile-responsive footer templates styled to look like world-class SaaS, agency, and luxury retail websites. Toggle designs instantly with zero coding.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#marketplace" style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.15)'
            }}>
              Browse Footers ↓
            </a>
            <button onClick={() => navigate('/app/pricing')} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Upgrade Subscription
            </button>
          </div>
        </div>

        {/* Live Mockup / Visual Device */}
        <div style={{
          flex: '1 1 350px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>active_theme_preview.liquid</span>
            </div>
            
            {/* Visual simulation of premium footer layers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#818cf8', letterSpacing: '1px' }}>AURORA.</span>
                <span style={{ fontSize: '9px', color: '#475569' }}>© 2026</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '25px', height: '5px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
                  <div style={{ width: '35px', height: '4px', backgroundColor: '#475569', borderRadius: '2px' }} />
                  <div style={{ width: '30px', height: '4px', backgroundColor: '#475569', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '25px', height: '5px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
                  <div style={{ width: '30px', height: '4px', backgroundColor: '#475569', borderRadius: '2px' }} />
                  <div style={{ width: '35px', height: '4px', backgroundColor: '#475569', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ width: '50px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ flex: 1, height: '14px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                    <div style={{ width: '20px', height: '14px', backgroundColor: '#818cf8', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '-120px',
          right: '-80px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
      </div>

      {/* WHAT'S NEW STRIP */}
      <style>{`
        @keyframes fv-strip-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .fv-strip-track {
          display: flex;
          gap: 12px;
          animation: fv-strip-scroll 28s linear infinite;
          width: max-content;
        }
        .fv-strip-wrap:hover .fv-strip-track { animation-play-state: paused; }

        /* Premium hover quick preview styles */
        .fv-thumbnail-container {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .fv-quick-preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 8;
        }
        .fv-thumbnail-container:hover .fv-quick-preview-overlay {
          opacity: 1;
        }
        .fv-quick-preview-btn {
          background: #ffffff;
          color: #0f172a;
          padding: 10px 18px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
          transform: translateY(10px);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fv-thumbnail-container:hover .fv-quick-preview-btn {
          transform: translateY(0);
        }
      `}</style>
      <div
        className="fv-strip-wrap"
        style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '16px',
          padding: '14px 0',
          marginBottom: '32px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {/* Left/Right fade masks */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to right, #ffffff, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to left, #ffffff, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div className="fv-strip-track">
          {[
            { icon: '✨', label: 'Live Storefront Preview', color: '#4f46e5', bg: '#ede9fe' },
            { icon: '📱', label: 'Mobile Viewport Simulator', color: '#0891b2', bg: '#ecfeff' },
            { icon: '🎨', label: 'Real-time Color Customizer', color: '#059669', bg: '#ecfdf5' },
            { icon: '🔗', label: 'Editable Link Menus', color: '#dc2626', bg: '#fef2f2' },
            { icon: '💳', label: 'Payment Badge Controls', color: '#d97706', bg: '#fffbeb' },
            { icon: '🌐', label: 'Social Media Integration', color: '#7c3aed', bg: '#f5f3ff' },
            { icon: '⚡', label: 'Instant Theme Metafield Sync', color: '#2563eb', bg: '#eff6ff' },
            { icon: '🧩', label: 'Block Visibility Toggles', color: '#db2777', bg: '#fdf2f8' },
            { icon: '🛡️', label: 'Trust Badge Columns', color: '#16a34a', bg: '#f0fdf4' },
            { icon: '🚀', label: '7 Premium Footer Templates', color: '#9333ea', bg: '#faf5ff' },
            // Duplicate for seamless loop
            { icon: '✨', label: 'Live Storefront Preview', color: '#4f46e5', bg: '#ede9fe' },
            { icon: '📱', label: 'Mobile Viewport Simulator', color: '#0891b2', bg: '#ecfeff' },
            { icon: '🎨', label: 'Real-time Color Customizer', color: '#059669', bg: '#ecfdf5' },
            { icon: '🔗', label: 'Editable Link Menus', color: '#dc2626', bg: '#fef2f2' },
            { icon: '💳', label: 'Payment Badge Controls', color: '#d97706', bg: '#fffbeb' },
            { icon: '🌐', label: 'Social Media Integration', color: '#7c3aed', bg: '#f5f3ff' },
            { icon: '⚡', label: 'Instant Theme Metafield Sync', color: '#2563eb', bg: '#eff6ff' },
            { icon: '🧩', label: 'Block Visibility Toggles', color: '#db2777', bg: '#fdf2f8' },
            { icon: '🛡️', label: 'Trust Badge Columns', color: '#16a34a', bg: '#f0fdf4' },
            { icon: '🚀', label: '7 Premium Footer Templates', color: '#9333ea', bg: '#faf5ff' },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: item.bg,
              padding: '5px 12px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '13px' }}>{item.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: item.color, letterSpacing: '0.2px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — ACTIVE PLAN PANEL (Glassmorphism layout) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        borderRadius: '20px',
        padding: '24px 30px',
        marginBottom: '48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Plan</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {activePlan === 'Free' ? 'Free Plan' : activePlan}
              </h3>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#10b981',
                backgroundColor: '#d1fae5',
                padding: '2px 8px',
                borderRadius: '20px'
              }}>
                Active
              </span>
            </div>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Unlocked Templates</span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '4px', margin: 0 }}>
              {unlockedCount(activePlan)} / 7 Styles
            </h3>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' }} />
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Installed Design</span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '4px', margin: 0 }}>
              {getFooterName(installedFooter)}
            </h3>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate(`/app/templates/${installedFooter}`)} style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Customize Active Footer &rarr;
          </button>
          {activePlan !== PLAN_PREMIUM && (
            <button onClick={() => navigate('/app/pricing')} style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3 — FILTERS & SEARCH */}
      <div id="marketplace" style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '20px',
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Explore Footer Designs</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Select a template to preview or customize for your storefront.</p>
          </div>

          {/* Search input bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <input 
              type="text" 
              placeholder="Search footer styles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            <svg style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8', width: '15px', height: '15px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* Filter pills buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          {['all', 'free', 'starter', 'business', 'premium'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab ? '#4f46e5' : 'transparent',
                color: activeTab === tab ? '#ffffff' : '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'all' ? 'All Footers' : `${tab} Tier`}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2 — TEMPLATE MARKETPLACE GRID */}
      {filteredTemplates.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '64px'
        }}>
          {filteredTemplates.map((tpl) => {
            const isUnlocked = checkPlanAccess(activePlan, tpl.id);
            const isActive = installedFooter === tpl.id;

            return (
              <div 
                key={tpl.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '420px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                }}
              >
                {/* Active installed badge */}
                {isActive && (
                  <div className="fv-active-badge" style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                    Installed & Active
                  </div>
                )}

                {/* Card Top: Template Visual Signature (with Quick Preview hover state) */}
                <div 
                  className="fv-thumbnail-container"
                  style={{
                    background: tpl.previewGradient,
                    height: '180px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    borderBottom: '1px solid #f1f5f9',
                    overflow: 'hidden'
                  }}
                >
                  {/* Per-template unique preview visual */}
                  {tpl.id === '1' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '20px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.5px' }}>ZENITH STORE</div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {['Home', 'About', 'Shop', 'Contact'].map(l => <span key={l} style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>{l}</span>)}
                      </div>
                      <div style={{ width: '60%', height: '1px', background: '#e2e8f0' }} />
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>© 2026 Zenith. All rights reserved.</div>
                    </div>
                  )}
                  {tpl.id === '2' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '12px', padding: '18px 20px' }}>
                      {[{ h: 'AURORA.', lines: 2, color: '#3b82f6' }, { h: 'Shop', lines: 3 }, { h: 'Support', lines: 3 }, { h: 'Newsletter', lines: 1, input: true }].map((col, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <div style={{ fontSize: i === 0 ? '12px' : '9px', fontWeight: 800, color: i === 0 ? '#0f172a' : col.color || '#64748b', letterSpacing: i === 0 ? '1px' : '0.5px', marginBottom: '4px', textTransform: 'uppercase' }}>{col.h}</div>
                          {Array.from({ length: col.lines }).map((_, j) => <div key={j} style={{ height: '4px', borderRadius: '2px', background: '#e2e8f0', width: `${60 + j * 10}%` }} />)}
                          {col.input && <div style={{ height: '12px', borderRadius: '4px', background: '#dbeafe', marginTop: '4px' }} />}
                        </div>
                      ))}
                    </div>
                  )}
                  {tpl.id === '3' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 20px', gap: '10px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, background: 'linear-gradient(to right, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DARKTECH.</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['PRODUCTS', 'COMPANY', 'HELP'].map(h => <span key={h} style={{ fontSize: '7px', color: '#c084fc', fontWeight: 800, letterSpacing: '1px' }}>{h}</span>)}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ flex: 1, height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }} />
                        <div style={{ width: '32px', height: '16px', borderRadius: '4px', background: 'linear-gradient(to right, #a855f7, #ec4899)' }} />
                      </div>
                      <div style={{ height: '1px', background: 'linear-gradient(to right, #a855f7, transparent)' }} />
                    </div>
                  )}
                  {tpl.id === '4' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px', gap: '10px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1 }}>READY TO<br />ELEVATE?</div>
                      <div style={{ width: '40px', height: '2px', background: '#ec4899' }} />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['Work', 'About', 'Careers'].map(l => <span key={l} style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{l}</span>)}
                      </div>
                      <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
                        <div style={{ padding: '4px 12px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '30px', fontSize: '9px', color: '#fff', fontWeight: 700 }}>Get In Touch →</div>
                      </div>
                    </div>
                  )}
                  {tpl.id === '5' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #e4e4e7' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>PRESTIGE CO.</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {['✓ Secure', '✓ Fast'].map(b => <span key={b} style={{ fontSize: '8px', color: '#666', fontWeight: 700 }}>{b}</span>)}
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', flex: 1 }}>
                        {['Quick Links', 'Support', 'Legal'].map(h => (
                          <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontSize: '8px', fontWeight: 800, color: '#111', marginBottom: '3px' }}>{h}</div>
                            {[40, 55, 50].map((w, j) => <div key={j} style={{ height: '3px', borderRadius: '2px', background: '#e4e4e7', width: `${w}%` }} />)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {tpl.id === '6' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '16px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 400, color: '#1a1a1a', letterSpacing: '5px', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>LUXE</div>
                      <div style={{ fontSize: '8px', color: '#999', letterSpacing: '3px', textTransform: 'uppercase' }}>Est. MMXIX</div>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                        {['Collections', 'Lookbook', 'Ateliers', 'Press'].map(l => <span key={l} style={{ fontSize: '8px', color: '#666', letterSpacing: '1px' }}>{l}</span>)}
                      </div>
                      <div style={{ width: '30%', height: '1px', background: '#1a1a1a', opacity: 0.15 }} />
                    </div>
                  )}
                  {tpl.id === '7' && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,56,188,0.5) 0%, transparent 70%)', filter: 'blur(8px)' }} />
                      <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(115,3,192,0.5) 0%, transparent 70%)', filter: 'blur(10px)' }} />
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, background: 'linear-gradient(to right, #ec38bc, #7303c0, #03001e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px' }}>ULTRA.FV</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {[1,2,3].map(n => <div key={n} style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }} />)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradient shine overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.02) 100%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Premium Lock Overlay (top 180px thumbnail only) */}
                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute',
                      top: 0, right: 0, left: 0,
                      height: '180px',
                      backgroundColor: 'rgba(15, 23, 42, 0.45)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      zIndex: 5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        backgroundColor: '#ffffff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        marginBottom: '8px'
                      }}>
                        <svg style={{ width: '15px', height: '15px', color: '#0f172a' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                        {tpl.tier} Required
                      </span>
                    </div>
                  )}

                  {/* Hover Quick Preview Action Overlay */}
                  <button 
                    type="button"
                    className="fv-quick-preview-overlay"
                    onClick={() => navigate(`/app/templates/${tpl.id}`)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div className="fv-quick-preview-btn">
                      <span>👁️</span>
                      <span>Quick Preview {!isUnlocked && " (🔒 Preview)"}</span>
                    </div>
                  </button>
                </div>

                {/* Card Info & Actions */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: tpl.color,
                        backgroundColor: `${tpl.color}15`,
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {tpl.tierLabel}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {(tpl.tags || []).map((tag) => (
                          <span key={tag} style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2px'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>{tpl.name}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{tpl.desc}</p>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button 
                      style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        color: '#334155',
                        border: '1px solid #e2e8f0',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      onClick={() => navigate(`/app/templates/${tpl.id}`)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        👁️ Preview
                      </button>
                      {isUnlocked ? (
                        <button 
                        style={{
                          flex: 1,
                          backgroundColor: '#4f46e5',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
                        }}
                        onClick={() => navigate(`/app/templates/${tpl.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                      >
                        ⚡ Customize
                      </button>
                    ) : (
                      <fetcher.Form method="POST" action="/app/pricing" style={{ flex: 1, display: 'flex' }}>
                        <input 
                          type="hidden" 
                          name="plan" 
                          value={tpl.tier === 'Premium Plan' ? PLAN_PREMIUM : tpl.tier === 'Business Plan' ? PLAN_BUSINESS : PLAN_STARTER} 
                        />
                        <button 
                          type="submit"
                          disabled={fetcher.state !== 'idle'}
                          style={{
                            width: '100%',
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: fetcher.state !== 'idle' ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                            opacity: fetcher.state !== 'idle' ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => { if(fetcher.state === 'idle') e.currentTarget.style.backgroundColor = '#dc2626'; }}
                          onMouseLeave={(e) => { if(fetcher.state === 'idle') e.currentTarget.style.backgroundColor = '#ef4444'; }}
                        >
                          {fetcher.state !== 'idle' ? 'Opening...' : '👑 Unlock'}
                        </button>
                      </fetcher.Form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          marginBottom: '64px',
          border: '1px solid #f1f5f9'
        }}>
          <svg style={{ width: '40px', height: '40px', color: '#94a3b8', margin: '0 auto 12px' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>No footer templates matched your search</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Try clearing your search query or choosing another tier filter.</p>
        </div>
      )}

    </div>
  );
}
