import { useState } from "react";
import { useLoaderData, useFetcher, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import { PLAN_STARTER, PLAN_BUSINESS, PLAN_PREMIUM } from "../constants";

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const billingError = url.searchParams.get("billing_error");

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
    console.error("Billing check error on Pricing:", err);
  }

  return { activePlan, shop: session.shop, billingError };
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const planName = formData.get("plan");
  const returnUrl = `${new URL(request.url).origin}/app?billing_redirect=true&requested_plan=${encodeURIComponent(planName)}`;

  try {
    return await billing.request({
      plan: planName,
      isTest: true,
      returnUrl
    });
  } catch (error) {
    // If it's a redirect response (standard for Shopify Remix billing.request), rethrow it
    if (error instanceof Response || (error.status && error.status >= 300 && error.status < 400)) {
      throw error;
    }
    console.error("Billing request error:", error);
    return { error: error.message || "Could not redirect to Shopify Checkout. Make sure your app is configured for App Store distribution." };
  }
};

const PLANS_DATA = [
  {
    id: "free",
    name: "Free",
    billingName: null,
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started with a clean, minimal footer.",
    gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    accentColor: "#64748b",
    textColor: "#0f172a",
    features: [
      { label: "1 Footer Template", ok: true },
      { label: "Colors & Typography Controls", ok: true },
      { label: "Social Media Links", ok: true },
      { label: "Payment Badge Toggles", ok: true },
      { label: "Server-side Liquid Render", ok: true },
      { label: "Premium Newsletter Widget", ok: false },
      { label: "Trust Badge Columns", ok: false },
      { label: "Animated Effects", ok: false },
    ],
    isPopular: false,
    isDark: false,
  },
  {
    id: "starter",
    name: "Starter",
    billingName: PLAN_STARTER,
    price: "$50",
    period: "per month",
    desc: "Beautiful retail-ready footers for growing ecommerce brands.",
    gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    accentColor: "#3b82f6",
    textColor: "#0f172a",
    features: [
      { label: "3 Footer Templates", ok: true },
      { label: "Colors & Typography Controls", ok: true },
      { label: "Social Media Links", ok: true },
      { label: "Payment Badge Toggles", ok: true },
      { label: "Server-side Liquid Render", ok: true },
      { label: "Premium Newsletter Widget", ok: true },
      { label: "Trust Badge Columns", ok: false },
      { label: "Animated Effects", ok: false },
    ],
    isPopular: false,
    isDark: false,
  },
  {
    id: "business",
    name: "Business",
    billingName: PLAN_BUSINESS,
    price: "$70",
    period: "per month",
    desc: "Advanced layouts with trust signals and conversion-focused design.",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    accentColor: "#818cf8",
    textColor: "#ffffff",
    features: [
      { label: "5 Footer Templates", ok: true },
      { label: "Colors & Typography Controls", ok: true },
      { label: "Social Media Links", ok: true },
      { label: "Payment Badge Toggles", ok: true },
      { label: "Server-side Liquid Render", ok: true },
      { label: "Premium Newsletter Widget", ok: true },
      { label: "Trust Badge Columns", ok: true },
      { label: "Animated Effects", ok: false },
    ],
    isPopular: true,
    isDark: true,
  },
  {
    id: "premium",
    name: "Premium",
    billingName: PLAN_PREMIUM,
    price: "$100",
    period: "per month",
    desc: "Luxury editorial styling, glassmorphic effects, and neon animations.",
    gradient: "linear-gradient(135deg, #09090b 0%, #4c1d95 100%)",
    accentColor: "#c084fc",
    textColor: "#ffffff",
    features: [
      { label: "All 7 Footer Templates", ok: true },
      { label: "Colors & Typography Controls", ok: true },
      { label: "Social Media Links", ok: true },
      { label: "Payment Badge Toggles", ok: true },
      { label: "Server-side Liquid Render", ok: true },
      { label: "Premium Newsletter Widget", ok: true },
      { label: "Trust Badge Columns", ok: true },
      { label: "Animated Neon & Glow FX", ok: true },
    ],
    isPopular: false,
    isDark: true,
  },
];

const CheckIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function Pricing() {
  const { activePlan, billingError } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [selectedLoadingPlan, setSelectedLoadingPlan] = useState(null);

  const cleanPlanName = (p) => {
    if (p.includes("Starter")) return "starter";
    if (p.includes("Business")) return "business";
    if (p.includes("Premium")) return "premium";
    return "free";
  };

  const currentTierId = cleanPlanName(activePlan);

  const getButtonLabel = (plan) => {
    if (plan.id === currentTierId) return "Current Plan";
    if (plan.id === "free") return currentTierId === "free" ? "Active" : "Free (No Action Needed)";
    const tiers = ["free", "starter", "business", "premium"];
    return tiers.indexOf(plan.id) > tiers.indexOf(currentTierId) ? "Upgrade Now →" : "Downgrade";
  };

  const isDisabled = (plan) => 
    plan.id === currentTierId || 
    (plan.id === "free" && currentTierId === "free") || 
    selectedLoadingPlan !== null;

  const handleClick = (plan) => {
    if (plan.id === "free") {
      alert("To cancel your subscription and return to Free, go to your Shopify Admin → Settings → Billing → Apps.");
    }
  };

  const isLoading = (plan) => selectedLoadingPlan === plan.billingName;

  const actionError = fetcher.data?.error;
  const showError = billingError || actionError;

  return (
    <div className="fv-fadein" style={{ padding: '24px 24px 48px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Styles for premium redirecting spinners */}
      <style>{`
        @keyframes fv-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fv-btn-spinner {
          animation: fv-spin 1.2s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      {/* API / Activation Error Banner */}
      {showError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '16px',
          padding: '16px 20px',
          color: '#991b1b',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(220,38,38,0.05)',
          animation: 'fv-fadein 0.35s ease-out'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div style={{ flex: 1, lineHeight: 1.5 }}>
            <strong style={{ display: 'block', marginBottom: '2px', fontWeight: 800 }}>Shopify Billing Issue</strong>
            {showError}
          </div>
          <button 
            onClick={() => {
              if (billingError) {
                navigate('/app/pricing', { replace: true });
              } else {
                fetcher.data = null; // Clear fetcher error
                navigate('/app/pricing');
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#991b1b',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0 8px',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* HERO HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: '24px',
        padding: '56px 48px',
        textAlign: 'center',
        marginBottom: '48px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.14)'
      }}>
        {/* BG orbs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-60px', width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <span style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          Flexible Subscription Plans
        </span>

        <h1 style={{
          fontSize: '40px',
          fontWeight: 800,
          color: '#ffffff',
          margin: '0 0 14px 0',
          letterSpacing: '-1px',
          lineHeight: 1.15
        }}>
          Invest in Your Store's First Impression
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.7 }}>
          Unlock beautifully crafted, conversion-ready footer templates that give your store a world-class look instantly.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '40px', padding: '8px 20px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
          <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}>
            Currently on: <strong style={{ color: '#ffffff' }}>{activePlan === 'Free' ? 'Free Plan' : activePlan}</strong>
          </span>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '56px',
        alignItems: 'start'
      }}>
        {PLANS_DATA.map((plan) => {
          const isCurrent = plan.id === currentTierId;
          const loading = isLoading(plan);
          const disabled = isDisabled(plan);

          return (
            <div
              key={plan.id}
              style={{
                background: plan.gradient,
                borderRadius: '20px',
                border: isCurrent
                  ? `2px solid ${plan.accentColor}`
                  : plan.isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                boxShadow: isCurrent
                  ? `0 0 0 4px ${plan.accentColor}20, 0 20px 30px rgba(0,0,0,0.1)`
                  : plan.isPopular ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 16px rgba(0,0,0,0.04)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                position: 'relative',
                transform: plan.isPopular ? 'scale(1.035)' : 'scale(1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!plan.isPopular) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = plan.isDark
                    ? '0 24px 40px rgba(0,0,0,0.25)'
                    : '0 16px 30px rgba(0,0,0,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = plan.isPopular ? 'scale(1.035)' : 'scale(1)';
                e.currentTarget.style.boxShadow = isCurrent
                  ? `0 0 0 4px ${plan.accentColor}20, 0 20px 30px rgba(0,0,0,0.1)`
                  : plan.isPopular ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 16px rgba(0,0,0,0.04)';
              }}
            >
              {/* RECOMMENDED BADGE */}
              {plan.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  padding: '5px 16px',
                  borderRadius: '30px',
                  boxShadow: '0 4px 12px rgba(129,140,248,0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  ✦ RECOMMENDED
                </div>
              )}

              {/* CURRENT BADGE */}
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: plan.isDark ? 'rgba(255,255,255,0.12)' : '#f0fdf4',
                  border: plan.isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #bbf7d0',
                  color: plan.isDark ? '#86efac' : '#16a34a',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '20px'
                }}>
                  ACTIVE
                </div>
              )}

              {/* PLAN INFO */}
              <div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: plan.isDark ? 'rgba(255,255,255,0.08)' : `${plan.accentColor}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontSize: '18px' }}>
                    {plan.id === 'free' ? '🌱' : plan.id === 'starter' ? '⚡' : plan.id === 'business' ? '🚀' : '👑'}
                  </span>
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 800, color: plan.textColor, margin: '0 0 6px 0' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '13px', color: plan.isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {plan.desc}
                </p>
              </div>

              {/* PRICE */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '42px', fontWeight: 800, color: plan.textColor, letterSpacing: '-2px', lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '13px', color: plan.isDark ? '#64748b' : '#94a3b8', fontWeight: 500 }}>
                  /{plan.period}
                </span>
              </div>

              {/* DIVIDER */}
              <div style={{ height: '1px', background: plan.isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9' }} />

              {/* FEATURES */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: feat.ok
                      ? (plan.isDark ? '#e2e8f0' : '#334155')
                      : (plan.isDark ? '#475569' : '#94a3b8'),
                    opacity: feat.ok ? 1 : 0.6
                  }}>
                    {feat.ok ? <CheckIcon color={plan.accentColor} /> : <XIcon />}
                    {feat.label}
                  </li>
                ))}
              </ul>

              {/* CTA BUTTON */}
              {plan.id === "free" ? (
                <button
                  onClick={() => !disabled && handleClick(plan)}
                  disabled={disabled}
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: disabled ? 'default' : 'pointer',
                    border: 'none',
                    transition: 'all 0.2s',
                    opacity: disabled ? 0.6 : 1,
                    background: isCurrent
                      ? (plan.isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9')
                      : `linear-gradient(135deg, ${plan.accentColor} 0%, ${plan.accentColor}cc 100%)`,
                    color: isCurrent
                      ? (plan.isDark ? '#94a3b8' : '#64748b')
                      : '#ffffff',
                    boxShadow: isCurrent ? 'none' : `0 4px 12px ${plan.accentColor}40`
                  }}
                >
                  {getButtonLabel(plan)}
                </button>
              ) : (
                <form method="POST" onSubmit={() => setSelectedLoadingPlan(plan.billingName)}>
                  <input type="hidden" name="plan" value={plan.billingName} />
                  <button
                    type="submit"
                    disabled={disabled || loading}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: disabled || loading ? 'default' : 'pointer',
                      border: 'none',
                      transition: 'all 0.2s',
                      opacity: disabled ? 0.6 : 1,
                      background: isCurrent
                        ? (plan.isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9')
                        : `linear-gradient(135deg, ${plan.accentColor} 0%, ${plan.accentColor}cc 100%)`,
                      color: isCurrent
                        ? (plan.isDark ? '#94a3b8' : '#64748b')
                        : '#ffffff',
                      boxShadow: isCurrent ? 'none' : `0 4px 12px ${plan.accentColor}40`
                    }}
                    onMouseEnter={(e) => {
                      if (!disabled && !loading) e.currentTarget.style.filter = 'brightness(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    {loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <svg className="fv-btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                          <path d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                        </svg>
                        Redirecting to Shopify...
                      </span>
                    ) : getButtonLabel(plan)}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      {/* COMPARISON TABLE */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '64px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Plan Comparison</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>A full feature-by-feature breakdown across all plans.</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 700 }}>Feature</th>
                {['Free', 'Starter', 'Business', 'Premium'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: h === 'Business' ? '#818cf8' : '#64748b',
                    fontWeight: 800,
                    fontSize: h === 'Business' ? '14px' : '13px'
                  }}>
                    {h} {h === 'Business' && <span style={{ fontSize: '9px', background: '#ede9fe', color: '#7c3aed', padding: '2px 6px', borderRadius: '20px', marginLeft: '4px', fontWeight: 700 }}>POPULAR</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Footer Templates", free: "1", starter: "3", business: "5", premium: "7 (All)" },
                { feature: "Color & Font Controls", free: "✓", starter: "✓", business: "✓", premium: "✓" },
                { feature: "Social Media Links", free: "✓", starter: "✓", business: "✓", premium: "✓" },
                { feature: "Payment Badges", free: "✓", starter: "✓", business: "✓", premium: "✓" },
                { feature: "Newsletter Widget", free: "Basic", starter: "Live Form", business: "Asymmetric", premium: "Floating UL" },
                { feature: "Trust Badge Column", free: "—", starter: "—", business: "✓", premium: "✓" },
                { feature: "Animated Neon / Glow FX", free: "—", starter: "—", business: "—", premium: "✓" },
                { feature: "Server-side Liquid Speed", free: "⚡ Instant", starter: "⚡ Instant", business: "⚡ Instant", premium: "⚡ Instant" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#334155' }}>{row.feature}</td>
                  {[row.free, row.starter, row.business, row.premium].map((val, j) => (
                    <td key={j} style={{
                      padding: '14px 16px',
                      textAlign: 'center',
                      color: val === '—' ? '#cbd5e1' : val === '✓' ? '#22c55e' : '#475569',
                      fontWeight: val === '✓' ? 800 : 500
                    }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '64px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0' }}>
          Need help choosing a plan?
        </h3>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px 0' }}>
          Browse all 7 live footer previews to decide what's right for your brand.
        </p>
        <button
          onClick={() => navigate('/app')}
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            border: 'none',
            padding: '13px 28px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255,255,255,0.15)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          View All Footer Templates →
        </button>
      </div>
    </div>
  );
}
