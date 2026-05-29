export const meta = () => [
  { title: "Privacy Policy — FooterVerse" },
  { name: "description", content: "FooterVerse Privacy Policy — learn how we collect, use, and protect your data." },
];

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0118 0%, #1a0b2e 25%, #2d1b4e 50%, #1a0b2e 75%, #0a0118 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#e2e8f0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: #a855f7; text-decoration: none; }
        a:hover { color: #ec4899; text-decoration: underline; }
        .section-divider { border: none; border-top: 1px solid rgba(168,85,247,0.15); margin: 32px 0; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 0',
        background: 'rgba(10,1,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(168,85,247,0.12)',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/App%20logo%202.png" alt="FooterVerse Logo" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>FooterVerse</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '60px 32px 0',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 18px',
          background: 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: '50px',
          fontSize: '13px',
          color: '#a855f7',
          fontWeight: 600,
          marginBottom: '20px',
          letterSpacing: '0.5px',
        }}>LEGAL</div>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff 0%, #a855f7 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.2,
          marginBottom: '16px',
        }}>Privacy Policy</h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '8px' }}>
          Last updated: <strong style={{ color: '#c4b5fd' }}>May 29, 2026</strong>
        </p>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          This Privacy Policy describes how FooterVerse (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares information about you when you use our Shopify application.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '50px auto 80px', padding: '0 32px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(168,85,247,0.15)',
          borderRadius: '20px',
          padding: '48px',
          backdropFilter: 'blur(10px)',
        }}>

          <Section number="1" title="Information We Collect">
            <p>When you install and use FooterVerse, we may collect the following types of information:</p>
            <ul>
              <li><strong>Shop Information:</strong> Your Shopify store domain, store name, and store owner contact details provided by Shopify during OAuth installation.</li>
              <li><strong>Usage Data:</strong> Information about how you use the app, including pages viewed, features used, and actions taken within the dashboard.</li>
              <li><strong>Theme Data:</strong> We access your Shopify theme files only to install and manage footer templates. We do not read or store unrelated theme content.</li>
              <li><strong>Subscription Data:</strong> Billing plan and subscription status, managed via Shopify Billing API.</li>
            </ul>
          </Section>

          <hr className="section-divider" />

          <Section number="2" title="How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve FooterVerse features and services.</li>
              <li>Process your subscription and manage billing through Shopify Billing API.</li>
              <li>Install footer templates and extensions into your Shopify store theme.</li>
              <li>Send you important service notifications (e.g., billing changes, app updates).</li>
              <li>Provide customer support and respond to your inquiries.</li>
              <li>Monitor app performance, detect errors, and prevent abuse.</li>
            </ul>
          </Section>

          <hr className="section-divider" />

          <Section number="3" title="Sharing of Information">
            <p>We do <strong>not</strong> sell, rent, or trade your personal information. We may share data only in these limited circumstances:</p>
            <ul>
              <li><strong>Shopify:</strong> Our app operates within the Shopify platform and is bound by <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer">Shopify&apos;s Privacy Policy</a>.</li>
              <li><strong>Service Providers:</strong> We may use trusted third-party services (e.g., hosting, analytics) that process data on our behalf under strict confidentiality agreements.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and the safety of our users.</li>
            </ul>
          </Section>

          <hr className="section-divider" />

          <Section number="4" title="Data Storage & Security">
            <p>Your data is stored securely using industry-standard encryption and security practices. We use:</p>
            <ul>
              <li>HTTPS/TLS encryption for all data in transit.</li>
              <li>Encrypted databases for data at rest.</li>
              <li>Access controls to limit who can view your data.</li>
            </ul>
            <p>While we take all reasonable precautions, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and keep your Shopify account secure.</p>
          </Section>

          <hr className="section-divider" />

          <Section number="5" title="Data Retention">
            <p>We retain your data for as long as you have FooterVerse installed on your Shopify store. When you uninstall the app:</p>
            <ul>
              <li>We will delete your store data within <strong>30 days</strong> of uninstallation.</li>
              <li>Billing records may be retained for up to <strong>5 years</strong> for financial compliance purposes.</li>
            </ul>
          </Section>

          <hr className="section-divider" />

          <Section number="6" title="Your Rights">
            <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
              <li><strong>Portability:</strong> Request your data in a portable format.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at the email below.</p>
          </Section>

          <hr className="section-divider" />

          <Section number="7" title="Cookies & Tracking">
            <p>FooterVerse may use cookies and similar tracking technologies to:</p>
            <ul>
              <li>Maintain your session within the Shopify admin.</li>
              <li>Remember your preferences and settings.</li>
              <li>Analyze app usage for improvements.</li>
            </ul>
            <p>Shopify manages most session cookies. You can control cookies through your browser settings.</p>
          </Section>

          <hr className="section-divider" />

          <Section number="8" title="Third-Party Links">
            <p>Our app or landing page may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.</p>
          </Section>

          <hr className="section-divider" />

          <Section number="9" title="Children's Privacy">
            <p>FooterVerse is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately.</p>
          </Section>

          <hr className="section-divider" />

          <Section number="10" title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page. We encourage you to review this policy periodically. Continued use of FooterVerse after changes constitutes your acceptance of the updated policy.</p>
          </Section>

          <hr className="section-divider" />

          <Section number="11" title="Contact Us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
            <div style={{
              marginTop: '16px',
              padding: '20px 24px',
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '12px',
            }}>
              <p><strong style={{ color: '#c4b5fd' }}>FooterVerse</strong></p>
              <p>Email: <a href="mailto:support@footerverse.electrosale.shop">support@footerverse.electrosale.shop</a></p>
              <p>Website: <a href="https://footerverse.electrosale.shop" target="_blank" rel="noopener noreferrer">footerverse.electrosale.shop</a></p>
            </div>
          </Section>

        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="/" style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: '#fff',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
          }}>← Back to Home</a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(168,85,247,0.12)',
        padding: '32px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '14px',
      }}>
        <p>© 2026 FooterVerse. All rights reserved.</p>
        <p style={{ marginTop: '8px' }}>
          <a href="/">Home</a>
          <span style={{ margin: '0 12px', color: '#334155' }}>|</span>
          <a href="/privacy" style={{ color: '#a855f7' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#f1f5f9',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 800,
          color: '#fff',
          flexShrink: 0,
        }}>{number}</span>
        {title}
      </h2>
      <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '15px' }}>
        {children}
      </div>
      <style>{`
        div ul { padding-left: 24px; margin: 12px 0; }
        div ul li { margin-bottom: 8px; }
        div p { margin-bottom: 12px; }
      `}</style>
    </div>
  );
}
