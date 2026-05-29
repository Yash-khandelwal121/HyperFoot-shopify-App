import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import { PLAN_STARTER, PLAN_BUSINESS, PLAN_PREMIUM } from "../constants";
import { getShopSettings } from "../db.helpers.server";

export const loader = async ({ request }) => {
  const { session, billing } = await authenticate.admin(request);
  const shop = session.shop;

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
    console.error("Billing check error on Settings:", err);
  }

  const shopSettings = await getShopSettings(shop);

  return {
    shop,
    activePlan,
    installedFooter: shopSettings.installedFooter || "1"
  };
};

const FOOTER_NAMES = {
  "1": "Zenith Minimal",
  "2": "Sleek Commerce",
  "3": "Dark Tech Startup",
  "4": "Creative Agency",
  "5": "Elegant Premium Brand",
  "6": "Luxury Fashion Brand",
  "7": "Ultra Luxury Animated",
};

const StepCard = ({ number, title, children, color = "#4f46e5" }) => (
  <div style={{
    display: 'flex',
    gap: '20px',
    background: '#ffffff',
    border: '1px solid #f1f5f9',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    transition: 'box-shadow 0.2s'
  }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'}
  >
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '18px',
      color: '#ffffff',
      flexShrink: 0,
      boxShadow: `0 4px 12px ${color}40`
    }}>
      {number}
    </div>
    <div>
      <h4 style={{ fontWeight: 800, margin: '0 0 6px 0', fontSize: '15px', color: '#0f172a' }}>{title}</h4>
      {children}
    </div>
  </div>
);

export default function Settings() {
  const { shop, activePlan, installedFooter } = useLoaderData();
  const navigate = useNavigate();

  const footerName = FOOTER_NAMES[String(installedFooter)] || "Zenith Minimal";
  const themeCustomizerUrl = `https://${shop}/admin/themes/current/editor?context=apps`;

  const planColor = activePlan.includes("Premium")
    ? "#a855f7"
    : activePlan.includes("Business")
    ? "#f59e0b"
    : activePlan.includes("Starter")
    ? "#3b82f6"
    : "#64748b";

  return (
    <div className="fv-fadein" style={{ padding: '0 24px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* PAGE HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: '24px',
        padding: '44px 48px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.14)'
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Integration Settings
          </span>
          <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Activate Your Footer on Storefront
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
            FooterVerse uses Shopify&apos;s native Theme App Extensions for zero-code, zero-bloat storefront integration.
          </p>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>

        {/* LEFT: SETUP STEPS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ marginBottom: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Setup Guide</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Follow these 3 steps to make your footer go live on your storefront.</p>
          </div>

          <StepCard number="1" title="Pick & Customize Your Footer Design" color="#4f46e5">
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.6 }}>
              Go to the Dashboard and choose a footer template that matches your brand. Adjust colors, typography, links, and social handles to perfection. Click <strong>Save &amp; Install Footer</strong> when ready.
            </p>
            <button
              onClick={() => navigate('/app')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(79,70,229,0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              Browse Footer Templates →
            </button>
          </StepCard>

          <StepCard number="2" title="Open the Shopify Theme Customizer" color="#0891b2">
            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.6 }}>
              Click the button below to deep-link directly into your active Shopify theme&apos;s <strong>App Embeds</strong> section. No need to manually navigate through Shopify Admin.
            </p>
            <button
              onClick={() => window.open(themeCustomizerUrl, '_blank')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0891b2',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(8,145,178,0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e7490'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
            >
              ↗ Open Shopify Theme Editor
            </button>
          </StepCard>

          <StepCard number="3" title="Enable FooterVerse Embed &amp; Save" color="#059669">
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              In the left sidebar of the Theme Editor, find <strong>FooterVerse Embed</strong> under <em>App Embeds</em>. Toggle the switch to <strong style={{ color: '#059669' }}>ON</strong>, then click the blue <strong>Save</strong> button in the top-right corner of the Shopify dashboard. Your footer is now live! 🎉
            </p>
          </StepCard>

          {/* HOW IT WORKS */}
          <div style={{
            marginTop: '8px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> How FooterVerse Avoids Theme Bloat
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.7 }}>
              Unlike generic footer apps that inject thousands of lines of raw HTML into your theme files, FooterVerse leverages Shopify&apos;s newest <strong>Theme App Extension</strong> standard. Our lightweight Liquid block renders entirely server-side, suppresses your theme&apos;s native footer, and leaves <strong>zero residual code</strong> on uninstall.
            </p>
          </div>
        </div>

        {/* RIGHT: STATUS SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* CONNECTION STATUS CARD */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '0.3px' }}>
              Connection Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Shop Domain', value: shop, valueStyle: { fontSize: '11px', wordBreak: 'break-all' } },
                {
                  label: 'Subscription Plan',
                  value: activePlan === 'Free' ? 'Free Plan' : activePlan,
                  valueStyle: { color: planColor, fontWeight: 800 }
                },
                { label: 'Active Footer', value: `${footerName} (Style #${installedFooter})` },
                { label: 'Liquid Sync Status', value: '● Connected', valueStyle: { color: '#059669', fontWeight: 700 } },
              ].map(({ label, value, valueStyle = {} }) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: '1px solid #f8fafc'
                }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: 600, textAlign: 'right', ...valueStyle }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '🎨 Customize Active Footer', onClick: () => navigate(`/app/templates/${installedFooter}`), bg: '#f1f5f9', color: '#0f172a' },
                { label: '💳 Manage Subscription', onClick: () => navigate('/app/pricing'), bg: '#ede9fe', color: '#6d28d9' },
                { label: '↗ Open Theme Editor', onClick: () => window.open(themeCustomizerUrl, '_blank'), bg: '#ecfdf5', color: '#059669' },
              ].map(({ label, onClick, bg, color }) => (
                <button
                  key={label}
                  onClick={onClick}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: bg,
                    color,
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'filter 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* TROUBLESHOOTING */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠️</span> Troubleshooting
            </h3>
            <ul style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.7, paddingLeft: '16px', margin: 0 }}>
              <li>Footer not showing? Ensure the embed is toggled <strong>ON</strong> and saved in Theme Editor.</li>
              <li>Hard-refresh your storefront (<kbd>Ctrl+Shift+R</kbd>) to bypass browser cache.</li>
              <li>Verify your plan allows the installed template tier.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
