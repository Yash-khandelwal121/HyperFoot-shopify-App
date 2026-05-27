# FooterVerse Landing Page - Design Specifications

## Design System

### Typography Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|-----------------|
| H1 (Hero) | 72px | 900 | 1.1 | -2px |
| H2 (Section) | 48px | 900 | 1.2 | -1px |
| H3 (Card) | 24px | 800 | 1.3 | -0.5px |
| Body Large | 20px | 400 | 1.7 | 0px |
| Body | 16px | 400 | 1.6 | 0px |
| Body Small | 15px | 400 | 1.7 | 0px |
| Label | 14px | 600 | 1.5 | 0.5px |
| Caption | 13px | 500 | 1.5 | 0px |
| Tiny | 11px | 700 | 1.4 | 1px |

### Color Palette

#### Primary Gradients
```
Purple → Pink: linear-gradient(135deg, #a855f7 0%, #ec4899 100%)
Purple → Orange: linear-gradient(135deg, #a855f7 0%, #f97316 100%)
Pink → Orange: linear-gradient(135deg, #ec4899 0%, #f97316 100%)
Indigo → Purple: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)
```

#### Background Colors
```
Dark Primary: #0a0118
Dark Secondary: #1a0b2e
Dark Tertiary: #2d1b4e
Card Background: rgba(255, 255, 255, 0.03)
Hover Background: rgba(255, 255, 255, 0.05)
```

#### Text Colors
```
Primary: #ffffff (white)
Secondary: #c4b5fd (light purple)
Tertiary: #a78bfa (medium purple)
Muted: #6b7280 (gray)
```

#### Accent Colors
```
Purple: #a855f7
Pink: #ec4899
Orange: #f97316
Indigo: #6366f1
Green: #22c55e
Red: #ef4444
```

### Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| xs | 4px | Small gaps, borders |
| sm | 8px | Padding, margins |
| md | 12px | Component spacing |
| lg | 16px | Section padding |
| xl | 24px | Card padding |
| 2xl | 32px | Section spacing |
| 3xl | 40px | Large spacing |
| 4xl | 48px | Hero spacing |
| 5xl | 60px | Section padding |
| 6xl | 80px | Large sections |

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| sm | 6px | Small elements |
| md | 12px | Cards, inputs |
| lg | 16px | Feature cards |
| xl | 24px | Large cards |
| full | 50% | Circles, badges |

### Shadow System

#### Elevation 1 (Subtle)
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```

#### Elevation 2 (Medium)
```css
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
```

#### Elevation 3 (Strong)
```css
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
```

#### Glow (Purple)
```css
box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2);
```

#### Glow (Pink)
```css
box-shadow: 0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2);
```

## Component Specifications

### Navigation Bar

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [F] FooterVerse              Features  Preview  [Install]   │
│     Premium Footer Marketplace                              │
└─────────────────────────────────────────────────────────────┘
```

**Dimensions**:
- Height: 80px (with logo/branding)
- Padding: 20px 40px
- Logo box: 40x40px
- Logo font size: 20px

**States**:
- Default: Transparent background
- Scrolled: `rgba(10, 1, 24, 0.8)` with `blur(20px)`
- Hover (links): Color change to `#e9d5ff`

### Hero Section

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    [Status Badge]                           │
│                                                              │
│              Main Headline with Gradient                    │
│                                                              │
│                    Subtitle Text                            │
│                                                              │
│              [Install Card - Glassmorphism]                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Dimensions**:
- Padding: 180px 40px 100px
- Max-width: 900px
- Centered alignment

**Status Badge**:
- Padding: 8px 20px
- Border-radius: 50px
- Background: `rgba(168, 85, 247, 0.1)`
- Border: `1px solid rgba(168, 85, 247, 0.3)`
- Font: 13px, 700 weight
- Pulsing dot: 8px diameter

**Install Card**:
- Padding: 40px
- Border-radius: 24px
- Background: `rgba(255, 255, 255, 0.03)`
- Backdrop-filter: `blur(20px)`
- Border: `1px solid rgba(168, 85, 247, 0.2)`
- Box-shadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 80px rgba(168, 85, 247, 0.1)`

**Input Field**:
- Padding: 16px 20px
- Border-radius: 12px
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `1px solid rgba(168, 85, 247, 0.3)`
- Font: 16px, 500 weight
- Focus: Border color changes to `rgba(168, 85, 247, 0.6)`

**Button**:
- Padding: 18px
- Border-radius: 12px
- Font: 16px, 800 weight
- Gradient: `linear-gradient(135deg, #a855f7 0%, #ec4899 100%)`
- Box-shadow: `0 10px 30px rgba(168, 85, 247, 0.4)`
- Hover: `translateY(-2px)` + enhanced shadow

### Feature Cards

#### Grid Layout
```
┌──────────────┬──────────────┬──────────────┐
│   Card 1     │   Card 2     │   Card 3     │
├──────────────┼──────────────┼──────────────┤
│ Icon Box     │ Icon Box     │ Icon Box     │
│ Title        │ Title        │ Title        │
│ Description  │ Description  │ Description  │
│ Tags/Items   │ Tags/Items   │ Tags/Items   │
└──────────────┴──────────────┴──────────────┘
```

**Grid**:
- Columns: `repeat(auto-fit, minmax(320px, 1fr))`
- Gap: 32px
- Max-width: 1400px

**Card**:
- Padding: 40px
- Border-radius: 24px
- Background: `rgba(255, 255, 255, 0.03)`
- Backdrop-filter: `blur(20px)`
- Border: `1px solid rgba(168, 85, 247, 0.2)`
- Box-shadow: `0 10px 40px rgba(0, 0, 0, 0.3)`
- Hover: `translateY(-8px)` + enhanced shadow

**Icon Box**:
- Size: 60x60px
- Border-radius: 16px
- Gradient background (varies per card)
- Box-shadow: `0 8px 24px rgba(gradient-color, 0.4)`
- Margin-bottom: 24px

**Title**:
- Font: 24px, 800 weight
- Color: `#ffffff`
- Margin-bottom: 12px
- Letter-spacing: -0.5px

**Description**:
- Font: 15px, 400 weight
- Color: `#c4b5fd`
- Line-height: 1.7
- Margin-bottom: 20px

### Preview Cards

#### Desktop Preview
```
┌─────────────────────────────────────────┐
│ ⚫ 🟡 🟢  active_theme_preview.liquid   │
├─────────────────────────────────────────┤
│                                         │
│  BRAND        SHOP        SUPPORT       │
│  ─────        ────        ───────       │
│  Link 1       Link 1      Link 1        │
│  Link 2       Link 2      Link 2        │
│  Link 3       Link 3      Link 3        │
│                                         │
│  ─────────────────────────────────────  │
│  © 2026 Your Store    [Social Icons]    │
│                                         │
└─────────────────────────────────────────┘
```

**Dimensions**:
- Padding: 24px
- Border-radius: 24px
- Background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)`
- Border: `1px solid rgba(168, 85, 247, 0.1)`
- Min-height: 280px

#### Mobile Preview
```
┌──────────────────────┐
│ BRAND                │
│ ─────                │
│ Link 1               │
│ Link 2               │
│ Link 3               │
│                      │
│ SHOP                 │
│ ────                 │
│ Link 1               │
│ Link 2               │
│ Link 3               │
│                      │
│ SUPPORT              │
│ ───────              │
│ Link 1               │
│ Link 2               │
│ Link 3               │
│                      │
│ © 2026 Your Store    │
└──────────────────────┘
```

**Dimensions**:
- Max-width: 280px
- Padding: 24px 20px
- Border-radius: 24px
- Background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)`
- Border: `1px solid rgba(168, 85, 247, 0.1)`

### Final CTA Section

#### Layout
```
┌─────────────────────────────────────────┐
│                                         │
│    Ready to Transform Your Footer?      │
│                                         │
│    [Get Started Free →] [View Demo]     │
│                                         │
│    5,000+ Stores | 4.9★ | 7 Templates  │
│                                         │
└─────────────────────────────────────────┘
```

**Container**:
- Padding: 60px 50px
- Border-radius: 32px
- Background: `rgba(255, 255, 255, 0.03)`
- Backdrop-filter: `blur(20px)`
- Border: `1px solid rgba(168, 85, 247, 0.2)`
- Box-shadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 100px rgba(168, 85, 247, 0.15)`
- Max-width: 800px

**Buttons**:
- Primary: Gradient with glow
- Secondary: Transparent with border
- Padding: 18px 40px
- Border-radius: 12px
- Font: 16px, 700-800 weight

**Stats**:
- Font: 32px, 900 weight
- Gradient text
- Margin-bottom: 4px
- Label: 13px, 600 weight

## Animation Specifications

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
```
- Duration: 20-30 seconds
- Timing: ease-in-out
- Iteration: infinite

### Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2); }
  50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3); }
}
```
- Duration: 2 seconds
- Timing: ease-in-out
- Iteration: infinite

### Gradient Shift
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```
- Duration: 3-4 seconds
- Timing: ease
- Iteration: infinite
- Background-size: 200% 200%

### Fade In Up
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```
- Duration: 0.8 seconds
- Timing: ease-out
- Staggered delays: 0s, 0.2s, 0.3s, 0.4s, 0.5s

## Responsive Breakpoints

### Desktop (1024px+)
- Full navigation visible
- 3-column grid
- Large typography
- Full preview cards
- Padding: 40px

### Tablet (768px - 1024px)
- Adjusted navigation
- 2-column grid
- Medium typography
- Responsive preview
- Padding: 32px

### Mobile (< 768px)
- Collapsed navigation
- Single column
- Reduced typography
- Stacked preview
- Padding: 20px

### Mobile Typography
```css
h1 { font-size: 48px; }
h2 { font-size: 36px; }
p { font-size: 16px; }
```

## Accessibility Specifications

### Color Contrast
- Text on background: > 4.5:1
- Interactive elements: > 3:1
- Large text: > 3:1

### Focus States
- Outline: 2px solid `#a855f7`
- Offset: 2px
- Visible on all interactive elements

### Touch Targets
- Minimum size: 44x44px
- Minimum spacing: 8px

### Keyboard Navigation
- Tab order follows visual flow
- Focus visible on all buttons
- Links are keyboard accessible

## Performance Specifications

### Load Time Targets
- First Paint: < 1 second
- Largest Contentful Paint: < 2.5 seconds
- Time to Interactive: < 3 seconds
- Cumulative Layout Shift: < 0.1

### Animation Performance
- Frame rate: 60fps
- GPU acceleration: enabled
- No layout thrashing

### File Size Targets
- HTML: < 50KB
- CSS: < 30KB
- JavaScript: < 20KB
- Total: < 100KB

## Browser Support

### Desktop
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+
- Firefox Mobile 88+

## Testing Specifications

### Visual Testing
- [ ] All colors render correctly
- [ ] Animations are smooth (60fps)
- [ ] Text is readable
- [ ] Images load properly
- [ ] Hover states work

### Functional Testing
- [ ] Form submission works
- [ ] Links navigate correctly
- [ ] Scroll effects trigger
- [ ] Mobile menu works
- [ ] OAuth integration works

### Performance Testing
- [ ] Page loads in < 2 seconds
- [ ] Animations are 60fps
- [ ] No layout shifts
- [ ] Images optimized
- [ ] CSS is minified

### Responsive Testing
- [ ] Desktop (1920px, 1440px)
- [ ] Tablet (768px, 1024px)
- [ ] Mobile (375px, 414px)
- [ ] Landscape orientation
- [ ] Touch interactions

---

**Status**: ✅ Complete
**Last Updated**: May 2026
**Version**: 1.0.0
