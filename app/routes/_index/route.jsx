import { useState, useEffect } from "react";
import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function PremiumLanding() {
  const { showForm } = useLoaderData();
  const [scrolled, setScrolled] = useState(false);
  const [shopDomain, setShopDomain] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0118 0%, #1a0b2e 25%, #2d1b4e 50%, #1a0b2e 75%, #0a0118 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 25s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 30s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .feature-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.2);
        }
        
        .install-button {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          transition: all 0.3s ease;
        }
        
        .install-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3);
        }
      `}</style>

      {/* Premium Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '20px 0',
        background: scrolled ? 'rgba(10, 1, 24, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(168, 85, 247, 0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/App%20logo%202.png" 
              alt="FooterVerse Logo" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover'
              }} 
            />
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.5px'
              }}>
                FooterVerse
              </div>
              <div style={{
                fontSize: '11px',
                color: '#a78bfa',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}>
                Premium Footer Marketplace
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            <a href="#features" style={{
              color: '#e9d5ff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}>
              Features
            </a>
            <a href="#preview" style={{
              color: '#e9d5ff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}>
              Live Preview
            </a>
            <a href="#install" style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}>
              Install App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        paddingTop: '180px',
        paddingBottom: '100px',
        textAlign: 'center',
        animation: 'fade-in-up 0.8s ease-out'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '50px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '32px',
            animation: 'fade-in-up 0.8s ease-out 0.2s backwards'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#a855f7',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
              animation: 'glow-pulse 2s ease-in-out infinite'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#e9d5ff',
              letterSpacing: '0.5px'
            }}>
              SHOPIFY APP STORE FEATURED
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: '72px',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-2px',
            animation: 'fade-in-up 0.8s ease-out 0.3s backwards'
          }}>
            <span style={{ color: '#fff' }}>
              Elevate Your Shopify{' '}
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 4s ease infinite'
            }}>
              Footer Experience
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '20px',
            color: '#c4b5fd',
            lineHeight: 1.7,
            marginBottom: '48px',
            maxWidth: '700px',
            margin: '0 auto 48px',
            animation: 'fade-in-up 0.8s ease-out 0.4s backwards'
          }}>
            Transform your store footer into a premium conversion-focused experience with beautifully crafted footer templates. No coding required.
          </p>

          {/* Install Card */}
          {showForm && (
            <div id="install" style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '40px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 80px rgba(168, 85, 247, 0.1)',
              animation: 'fade-in-up 0.8s ease-out 0.5s backwards'
            }}>
              <Form method="post" action="/auth/login">
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#e9d5ff',
                    marginBottom: '12px',
                    textAlign: 'left',
                    letterSpacing: '0.5px'
                  }}>
                    ENTER YOUR SHOPIFY STORE
                  </label>
                  <input
                    type="text"
                    name="shop"
                    value={shopDomain}
                    onChange={(e) => setShopDomain(e.target.value)}
                    placeholder="your-store.myshopify.com"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 500,
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="install-button"
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  Install FooterVerse →
                </button>
              </Form>

              <div style={{
                marginTop: '20px',
                fontSize: '13px',
                color: '#a78bfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Free 14-day trial • No credit card required
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Cards Section */}
      <div id="features" style={{
        position: 'relative',
        zIndex: 1,
        padding: '80px 40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            Premium Features
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#c4b5fd',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Everything you need to create stunning, conversion-optimized footers
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {/* Feature Card 1 */}
          <div className="feature-card" style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Premium Footer Designs
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#c4b5fd',
              lineHeight: 1.7,
              marginBottom: '20px'
            }}>
              7 beautifully crafted footer templates designed by world-class designers. From minimal to luxury, find the perfect style for your brand.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Minimal', 'Luxury', 'SaaS', 'Agency'].map(tag => (
                <span key={tag} style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#e9d5ff'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="feature-card" style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Fully Responsive Layouts
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#c4b5fd',
              lineHeight: 1.7,
              marginBottom: '20px'
            }}>
              Every footer template is meticulously optimized for mobile, tablet, and desktop. Your footer looks perfect on every device, every time.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(236, 72, 153, 0.05)',
              border: '1px solid rgba(236, 72, 153, 0.2)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#fda4af'
              }}>
                Mobile-first design approach
              </span>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="feature-card" style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              One-Click Shopify Install
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#c4b5fd',
              lineHeight: 1.7,
              marginBottom: '20px'
            }}>
              Install in seconds with zero coding required. Our app integrates seamlessly with your Shopify theme using native theme extensions.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {['No code required', 'Theme 2.0 compatible', 'Instant activation'].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#8b5cf6',
                    boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: '#c4b5fd',
                    fontWeight: 500
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      <div id="preview" style={{
        position: 'relative',
        zIndex: 1,
        padding: '80px 40px 120px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            See It In Action
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#c4b5fd',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Real footer templates from real stores. Choose your style and go live in minutes.
          </p>
        </div>

        {/* Preview Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {/* Preview Card 1 - Desktop */}
          <div style={{
            padding: '24px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#e9d5ff',
                letterSpacing: '0.5px'
              }}>
                DESKTOP VIEW
              </span>
              <div style={{
                display: 'flex',
                gap: '6px'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
              </div>
            </div>
            <div style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              padding: '32px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(168, 85, 247, 0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                gap: '24px'
              }}>
                {[
                  { title: 'BRAND', items: 3 },
                  { title: 'SHOP', items: 4 },
                  { title: 'SUPPORT', items: 4 },
                  { title: 'NEWSLETTER', items: 1 }
                ].map((col, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#a78bfa',
                      marginBottom: '12px',
                      letterSpacing: '1px'
                    }}>
                      {col.title}
                    </div>
                    {Array.from({ length: col.items }).map((_, j) => (
                      <div key={j} style={{
                        height: '6px',
                        background: 'rgba(168, 85, 247, 0.2)',
                        borderRadius: '3px',
                        marginBottom: '8px',
                        width: `${60 + j * 15}%`
                      }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{
                height: '1px',
                background: 'rgba(168, 85, 247, 0.2)',
                margin: '20px 0'
              }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#a78bfa',
                  fontWeight: 600
                }}>
                  © 2026 Your Store
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card 2 - Mobile */}
          <div style={{
            padding: '24px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#e9d5ff',
                letterSpacing: '0.5px'
              }}>
                MOBILE VIEW
              </span>
              <div style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#e9d5ff'
              }}>
                RESPONSIVE
              </div>
            </div>
            <div style={{
              maxWidth: '280px',
              margin: '0 auto',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              padding: '24px 20px',
              minHeight: '280px',
              border: '1px solid rgba(168, 85, 247, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {['BRAND', 'SHOP', 'SUPPORT'].map((title, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#a78bfa',
                      marginBottom: '10px',
                      letterSpacing: '1px'
                    }}>
                      {title}
                    </div>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} style={{
                        height: '6px',
                        background: 'rgba(168, 85, 247, 0.2)',
                        borderRadius: '3px',
                        marginBottom: '6px',
                        width: `${70 + j * 10}%`
                      }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{
                height: '1px',
                background: 'rgba(168, 85, 247, 0.2)',
                margin: '20px 0'
              }} />
              <div style={{
                textAlign: 'center',
                fontSize: '10px',
                color: '#a78bfa',
                fontWeight: 600
              }}>
                © 2026 Your Store
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '80px 40px 100px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '60px 50px',
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 100px rgba(168, 85, 247, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Glow effect */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            animation: 'float 15s ease-in-out infinite'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '20px',
              letterSpacing: '-1px'
            }}>
              Ready to Transform Your Footer?
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#c4b5fd',
              marginBottom: '40px',
              lineHeight: 1.7
            }}>
              Join thousands of Shopify merchants who've upgraded their store's footer experience. Start your free trial today.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <a href="#install" style={{
                padding: '18px 40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.5)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                display: 'inline-block'
              }}>
                Get Started Free →
              </a>
              <a href="#preview" style={{
                padding: '18px 40px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#e9d5ff',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s',
                cursor: 'pointer',
                display: 'inline-block'
              }}>
                View Live Demo
              </a>
            </div>

            {/* Trust Indicators */}
            <div style={{
              marginTop: '40px',
              paddingTop: '40px',
              borderTop: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '4px'
                }}>
                  5,000+
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#a78bfa',
                  fontWeight: 600
                }}>
                  Active Stores
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '4px'
                }}>
                  4.9★
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#a78bfa',
                  fontWeight: 600
                }}>
                  App Store Rating
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '4px'
                }}>
                  7
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#a78bfa',
                  fontWeight: 600
                }}>
                  Premium Templates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        padding: '40px',
        borderTop: '1px solid rgba(168, 85, 247, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 800,
            color: '#fff'
          }}>
            F
          </div>
          <span style={{
            fontSize: '16px',
            fontWeight: 800,
            color: '#fff'
          }}>
            FooterVerse
          </span>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#a78bfa',
          marginBottom: '20px'
        }}>
          Premium Footer Marketplace for Shopify
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <a href="#features" style={{
            color: '#c4b5fd',
            fontSize: '14px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}>
            Features
          </a>
          <a href="#preview" style={{
            color: '#c4b5fd',
            fontSize: '14px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}>
            Preview
          </a>
          <a href="#install" style={{
            color: '#c4b5fd',
            fontSize: '14px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}>
            Install
          </a>
        </div>
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          margin: 0
        }}>
          © 2026 FooterVerse. All rights reserved.
        </p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
          <a href="/privacy" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
