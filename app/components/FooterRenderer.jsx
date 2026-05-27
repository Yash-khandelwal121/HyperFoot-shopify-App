
// Default configuration settings to fallback on
export const defaultFooterSettings = {
  colors: {
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#818cf8',
    icon: '#ffffff',
    heading: '#ffffff'
  },
  brand: {
    title: 'FooterVerse',
    logoUrl: '',
    description: 'Providing gorgeous premium footer solutions for high-converting Shopify storefronts.'
  },
  links: {
    quickLinks: [
      { label: 'Shop All', url: '/collections/all' },
      { label: 'New Arrivals', url: '/collections/new' },
      { label: 'Best Sellers', url: '/collections/best' },
      { label: 'Special Offers', url: '/collections/sale' }
    ],
    supportLinks: [
      { label: 'Contact Us', url: '/pages/contact' },
      { label: 'Shipping & Delivery', url: '/pages/shipping' },
      { label: 'Returns & Exchanges', url: '/pages/returns' },
      { label: 'FAQs', url: '/pages/faq' }
    ],
    companyLinks: [
      { label: 'Our Story', url: '/pages/about' },
      { label: 'Careers', url: '/pages/careers' },
      { label: 'Press Kit', url: '/pages/press' },
      { label: 'Affiliates', url: '/pages/affiliates' }
    ]
  },
  contact: {
    email: 'hello@footerverse.com',
    phone: '+1 (800) 555-FOOT',
    address: '100 Infinite Loop, Cupertino, CA'
  },
  newsletter: {
    title: 'Keep in Touch',
    subtitle: 'Sign up to receive modern store design tips, product drops, and exclusive offers.',
    placeholder: 'Enter your email address',
    btnText: 'Subscribe'
  },
  socials: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    youtube: '#',
    linkedin: '#'
  },
  payments: {
    visa: true,
    mastercard: true,
    amex: true,
    paypal: true,
    applepay: true
  },
  trustBadges: {
    badge1: 'Secure SSL Checkout',
    badge2: 'Fast Worldwide Shipping',
    badge3: '30-Day Moneyback'
  },
  policies: [
    { label: 'Privacy Policy', url: '/policies/privacy-policy' },
    { label: 'Terms of Service', url: '/policies/terms-of-service' },
    { label: 'Refund Policy', url: '/policies/refund-policy' }
  ],
  blocksOrder: ['brand', 'quickLinks', 'supportLinks', 'newsletter'],
  visibleBlocks: {
    brand: true,
    quickLinks: true,
    supportLinks: true,
    newsletter: true,
    socials: true,
    payments: true,
    policies: true,
    trustBadges: true
  }
};

const SocialIcon = ({ platform }) => {
  const icons = {
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    ),
    youtube: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
    ),
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    )
  };
  return icons[platform] || null;
};

const PaymentIcon = ({ card }) => {
  const cards = {
    visa: (
      <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" rx="2" fill="#1A1F71"/>
        <path d="M13.78 15.75l1.64-10.02h2.62l-1.64 10.02h-2.62zm10.74-9.69c-.48-.18-1.24-.38-2.18-.38-2.4 0-4.09 1.28-4.1 3.11-.02 1.35 1.21 2.1 2.13 2.55.94.46 1.26.76 1.26 1.17-.01.63-.76.92-1.46.92-1.22 0-1.89-.18-2.9-.65l-.4-.19-.43 2.68c.72.33 2.06.62 3.44.63 3.01 0 4.97-1.49 4.99-3.79.02-1.26-.75-2.22-2.39-3-.99-.5-1.6-.83-1.6-1.34 0-.46.51-.95 1.62-.95.92-.02 1.6.2 2.12.42l.25.12.42-2.63zm3.17 9.71h2.47l2.29-10.02h-2.47l-2.29 10.02zm-15.69-10.02h-2.58c-.8 0-1.4.23-1.75.98l-4.91 9.04h2.75l.55-1.52h3.36l.32 1.52h2.42l-1.92-10.02zm-3.8 6.02l1.37-3.77.79 3.77h-2.16z" fill="#FFF"/>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" rx="2" fill="#1E1E1E"/>
        <circle cx="14.4" cy="12" r="7.2" fill="#EB001B"/>
        <circle cx="21.6" cy="12" r="7.2" fill="#F79E1B" fillOpacity="0.8"/>
      </svg>
    ),
    amex: (
      <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" rx="2" fill="#0170B2"/>
        <path d="M6 16.5V7.5h2.8l1.6 3.6 1.6-3.6H15v9h-2.2V11l-1.8 4h-1.2l-1.8-4v5.5H6zm11.2 0V7.5H22v2h-2.8v1.5H21v2h-1.8v1.5H22v2h-4.8zm6.5 0l2.2-4.5-2.2-4.5h2.5l1.1 2.3 1.1-2.3h2.5l-2.2 4.5 2.2 4.5h-2.5l-1.1-2.3-1.1 2.3h-2.5z" fill="#FFF"/>
      </svg>
    ),
    paypal: (
      <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" rx="2" fill="#003087"/>
        <path d="M12.5 16.5l2-9.5h3.8c2 0 3.2.9 2.8 2.8-.4 1.9-1.9 2.8-3.8 2.8H15.1l-1.1 4.9H12.5zm4-3.5l1.5-6.5h2.8c1.5 0 2.2.6 1.9 1.9-.3 1.3-1.3 1.9-2.8 1.9h-3.4z" fill="#FFF"/>
        <path d="M14.5 18.5l2-9.5h3.8c2 0 3.2.9 2.8 2.8-.4 1.9-1.9 2.8-3.8 2.8H17.1l-1.1 4.9H14.5z" fill="#0079C1" fillOpacity="0.6"/>
      </svg>
    ),
    applepay: (
      <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="24" rx="2" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1"/>
        <path d="M13.25 15.5v-5.2c0-.8-.6-1.3-1.4-1.3H10.1l.1 1.1h1.3c.3 0 .5.2.5.6v4.8h1.25zm5-4.2c.4-.4.6-.9.6-1.5v-.5h-1v.5c0 .3-.1.6-.3.8-.2.2-.5.3-.8.3-.7 0-1.1-.4-1.1-1v-.6h-1.1v.6c0 1.2.9 2 2.2 2 .5 0 1-.2 1.5-.6zm3.5.7h-2.1v2.5H18.4V8.5h3.2c.9 0 1.5.6 1.5 1.5s-.6 1.5-1.4 1.5zm.1-2.5h-2.1v1.5h2.1c.3 0 .5-.2.5-.5V9.5c0-.3-.2-.5-.5-.5zm5.9.3c-.3-.2-.7-.3-1.1-.3-1 0-1.7.7-1.7 1.8 0 1 .7 1.8 1.7 1.8.5 0 .9-.1 1.1-.3l.1-1.1h-1.2v-1h2.2v2.4c-.4.4-1 .8-2.2.8-1.7 0-3-1.2-3-3s1.3-3 3-3c1 0 1.7.3 2.1.7l-.3.9z" fill="#000000"/>
      </svg>
    )
  };
  return cards[card] || null;
};

export default function FooterRenderer({ templateId = '1', settings = defaultFooterSettings }) {
  const tId = String(templateId);
  const s = { ...defaultFooterSettings, ...settings };
  
  const themeStyles = {
    background: s.colors.background,
    color: s.colors.text,
    '--fv-accent': s.colors.accent,
    '--fv-icon': s.colors.icon,
    '--fv-heading': s.colors.heading || s.colors.text,
  };

  // Combine dynamic links based on visibility
  const renderLinks = (linksArray) => {
    if (!linksArray) return null;
    return linksArray.map((link, idx) => (
      <li key={idx}><a href={link.url} style={{ color: 'inherit' }}>{link.label}</a></li>
    ));
  };

  const renderSocials = () => {
    if (!s.visibleBlocks.socials) return null;
    return (
      <div className="fv-social-links">
        {Object.entries(s.socials).map(([platform, url]) => {
          if (!url || url === '#') return null;
          return (
            <a 
              key={platform} 
              href={url} 
              className="fv-social-link" 
              style={{ color: s.colors.icon, borderColor: s.colors.icon }}
            >
              <SocialIcon platform={platform} />
            </a>
          );
        })}
      </div>
    );
  };

  const renderPayments = (themeType = 'dark') => {
    if (!s.visibleBlocks.payments) return null;
    return (
      <div className="fv-payment-icons">
        {Object.entries(s.payments).map(([card, enabled]) => {
          if (!enabled) return null;
          return (
            <div key={card} className={`fv-payment-icon ${themeType === 'light' ? 'light-theme' : ''}`}>
              <PaymentIcon card={card} />
            </div>
          );
        })}
      </div>
    );
  };

  // ==========================================================================
  // 1. MINIMAL SAAS FOOTER (FREE)
  // ==========================================================================
  if (tId === '1') {
    return (
      <footer className="footerverse-sandbox fv-minimal" style={themeStyles}>
        <div className="fv-container">
          {s.visibleBlocks.brand && (
            <div className="fv-logo" style={{ color: s.colors.accent }}>
              {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'40px'}} /> : s.brand.title}
            </div>
          )}
          {s.visibleBlocks.quickLinks && (
            <ul className="fv-links">
              {renderLinks(s.links.quickLinks)}
              {renderLinks(s.links.supportLinks)}
            </ul>
          )}
          <div className="fv-bottom">
            <div className="fv-copy">
              &copy; {new Date().getFullYear()} {s.brand.title}. All rights reserved.
            </div>
            {renderSocials()}
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================================================
  // 2. MODERN ECOMMERCE FOOTER (STARTER - $50)
  // ==========================================================================
  if (tId === '2') {
    return (
      <footer className="footerverse-sandbox fv-ecommerce" style={themeStyles}>
        <div className="fv-container">
          <div className="fv-grid">
            {s.visibleBlocks.brand && (
              <div className="fv-col">
                <div className="fv-logo" style={{ color: s.colors.accent }}>
                  {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'40px'}} /> : s.brand.title}
                </div>
                <p className="fv-text">{s.brand.description}</p>
                {renderSocials()}
              </div>
            )}
            {s.visibleBlocks.quickLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Shop</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.quickLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.supportLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Support</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.supportLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.newsletter && (
              <div className="fv-col">
                <h4 className="fv-col-heading">{s.newsletter.title}</h4>
                <p className="fv-text" style={{fontSize: '13px'}}>{s.newsletter.subtitle}</p>
                <div className="fv-newsletter-form">
                  <input 
                    type="email" 
                    placeholder={s.newsletter.placeholder} 
                    className="fv-newsletter-input"
                    style={{ background: 'rgba(255,255,255,0.05)', color: s.colors.text }}
                  />
                  <button 
                    className="fv-newsletter-btn"
                    style={{ backgroundColor: s.colors.accent, color: '#fff' }}
                  >
                    {s.newsletter.btnText}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="fv-bottom">
            <div className="fv-text">
              &copy; {new Date().getFullYear()} {s.brand.title}. Powered by Shopify.
            </div>
            {renderPayments('dark')}
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================================================
  // 3. DARK TECH STARTUP FOOTER (STARTER - $50)
  // ==========================================================================
  if (tId === '3') {
    return (
      <footer className="footerverse-sandbox fv-gradient" style={themeStyles}>
        <div className="fv-container">
          <div className="fv-grid">
            {s.visibleBlocks.brand && (
              <div className="fv-col">
                <div className="fv-logo">
                  {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'45px'}} /> : s.brand.title}
                </div>
                <p style={{ fontSize: '14px', color: '#a1a1aa' }}>{s.brand.description}</p>
                {renderSocials()}
              </div>
            )}
            {s.visibleBlocks.quickLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Product</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.quickLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.supportLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Developers</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.supportLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.newsletter && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Newsletter</h4>
                <div className="fv-newsletter-form">
                  <input 
                    type="email" 
                    placeholder={s.newsletter.placeholder} 
                    className="fv-newsletter-input"
                  />
                  <button className="fv-newsletter-btn">
                    {s.newsletter.btnText}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="fv-bottom">
            <div>
              &copy; {new Date().getFullYear()} {s.brand.title}. Infinite tech solutions.
            </div>
            {renderPayments('dark')}
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================================================
  // 4. CREATIVE AGENCY FOOTER (BUSINESS - $70)
  // ==========================================================================
  if (tId === '4') {
    return (
      <footer className="footerverse-sandbox fv-agency" style={themeStyles}>
        <div className="fv-container">
          <div className="fv-cta-row">
            <h2 className="fv-cta-title">Let's create something remarkable together.</h2>
            <button className="fv-cta-btn">Get In Touch</button>
          </div>
          <div className="fv-grid">
            {s.visibleBlocks.brand && (
              <div className="fv-col">
                <div className="fv-logo" style={{ color: s.colors.accent }}>
                  {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'50px'}} /> : s.brand.title}
                </div>
                <p style={{ color: '#a1a1aa', fontSize: '15px' }}>{s.brand.description}</p>
                {renderSocials()}
              </div>
            )}
            {s.visibleBlocks.quickLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Work</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.quickLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.supportLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Info</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.supportLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.newsletter && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Join The List</h4>
                <div className="fv-newsletter-form">
                  <input 
                    type="email" 
                    placeholder={s.newsletter.placeholder} 
                    className="fv-newsletter-input"
                    style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                  <button 
                    className="fv-newsletter-btn" 
                    style={{ backgroundColor: '#fff', color: '#000' }}
                  >
                    {s.newsletter.btnText}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="fv-bottom">
            <div>
              &copy; {new Date().getFullYear()} {s.brand.title}. Creative designs verified.
            </div>
            {renderPayments('dark')}
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================================================
  // 5. ELEGANT PREMIUM BRAND FOOTER (BUSINESS - $70)
  // ==========================================================================
  if (tId === '5') {
    return (
      <footer className="footerverse-sandbox fv-premium" style={themeStyles}>
        <div className="fv-container">
          <div className="fv-upper">
            <div className="fv-upper-left">
              <h3 className="fv-upper-title">{s.newsletter.title}</h3>
              <p className="fv-upper-text">{s.newsletter.subtitle}</p>
            </div>
            {s.visibleBlocks.newsletter && (
              <div className="fv-newsletter-form">
                <input 
                  type="email" 
                  placeholder={s.newsletter.placeholder} 
                  className="fv-newsletter-input"
                  style={{ borderColor: 'rgba(0,0,0,0.15)', color: '#000' }}
                />
                <button 
                  className="fv-newsletter-btn"
                  style={{ backgroundColor: s.colors.accent, color: '#fff' }}
                >
                  {s.newsletter.btnText}
                </button>
              </div>
            )}
          </div>
          <div className="fv-grid">
            {s.visibleBlocks.brand && (
              <div className="fv-col">
                <div className="fv-logo" style={{ color: '#000' }}>
                  {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'40px'}} /> : s.brand.title}
                </div>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>{s.brand.description}</p>
                {renderSocials()}
              </div>
            )}
            {s.visibleBlocks.quickLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Collection</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.quickLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.supportLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Customer Care</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.supportLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.trustBadges && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Store Guarantee</h4>
                <div className="fv-trust-badges">
                  <div className="fv-badge">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <span>{s.trustBadges.badge1}</span>
                  </div>
                  <div className="fv-badge">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    <span>{s.trustBadges.badge2}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="fv-bottom">
            <div>
              &copy; {new Date().getFullYear()} {s.brand.title}. All rights reserved.
            </div>
            {renderPayments('light')}
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================================================
  // 6. LUXURY FASHION BRAND FOOTER (PREMIUM - $100)
  // ==========================================================================
  if (tId === '6') {
    return (
      <footer className="footerverse-sandbox fv-luxury" style={themeStyles}>
        <div className="fv-container">
          <div className="fv-header">
            <div className="fv-logo">
              {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'50px'}} /> : s.brand.title}
            </div>
            <div className="fv-subtitle">Haute Couture &amp; Luxury Goods</div>
          </div>
          <div className="fv-grid">
            {s.visibleBlocks.brand && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Maison</h4>
                <p style={{ fontSize: '13px', opacity: 0.7, letterSpacing: '1px', lineHeight: '1.8' }}>{s.brand.description}</p>
                <div style={{marginTop: '10px'}}>{renderSocials()}</div>
              </div>
            )}
            {s.visibleBlocks.quickLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Boutique</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.quickLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.supportLinks && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Services</h4>
                <ul className="fv-menu">
                  {renderLinks(s.links.supportLinks)}
                </ul>
              </div>
            )}
            {s.visibleBlocks.newsletter && (
              <div className="fv-col">
                <h4 className="fv-col-heading">Subscription</h4>
                <p style={{ fontSize: '12px', opacity: 0.6, letterSpacing: '1px' }}>{s.newsletter.subtitle}</p>
                <div className="fv-newsletter-form">
                  <input 
                    type="email" 
                    placeholder={s.newsletter.placeholder} 
                    className="fv-newsletter-input"
                    style={{ color: '#000' }}
                  />
                  <button className="fv-newsletter-btn">
                    &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="fv-bottom">
            <div>
              &copy; {new Date().getFullYear()} {s.brand.title} International.
            </div>
            {renderPayments('light')}
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================================================
  // 7. ULTRA LUXURY ANIMATED FOOTER (PREMIUM - $100)
  // ==========================================================================
  if (tId === '7') {
    return (
      <footer className="footerverse-sandbox fv-ultra-luxury" style={themeStyles}>
        <div className="fv-container">
          <div className="fv-glass-panel">
            <div className="fv-grid">
              {s.visibleBlocks.brand && (
                <div className="fv-col">
                  <div className="fv-logo">
                    {s.brand.logoUrl ? <img src={s.brand.logoUrl} alt={s.brand.title} style={{maxHeight:'55px'}} /> : s.brand.title}
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.7' }}>{s.brand.description}</p>
                  {renderSocials()}
                </div>
              )}
              {s.visibleBlocks.quickLinks && (
                <div className="fv-col">
                  <h4 className="fv-col-heading">Collections</h4>
                  <ul className="fv-menu">
                    {renderLinks(s.links.quickLinks)}
                  </ul>
                </div>
              )}
              {s.visibleBlocks.supportLinks && (
                <div className="fv-col">
                  <h4 className="fv-col-heading">Concierge</h4>
                  <ul className="fv-menu">
                    {renderLinks(s.links.supportLinks)}
                  </ul>
                </div>
              )}
              {s.visibleBlocks.newsletter && (
                <div className="fv-col">
                  <h4 className="fv-col-heading">Join The Circle</h4>
                  <div className="fv-newsletter-form">
                    <input 
                      type="email" 
                      placeholder={s.newsletter.placeholder} 
                      className="fv-newsletter-input"
                    />
                    <button className="fv-newsletter-btn">
                      {s.newsletter.btnText}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="fv-bottom">
            <div>
              &copy; {new Date().getFullYear()} {s.brand.title} Corp. Immersive ecommerce experience.
            </div>
            {renderPayments('dark')}
          </div>
        </div>
      </footer>
    );
  }

  return null;
}
