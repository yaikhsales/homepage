# Yai Navigation System — Comprehensive Design Guide

## 📱 Mobile Navbar (`components/mobile-nav.tsx`)

### Features
- **Hamburger toggle** — Menu/X icon (Lucide)
- **Slide-out drawer** — Smooth expand/collapse with backdrop
- **Full nav links** — 9 links + Login button
- **Body scroll lock** — Prevents scroll when menu open
- **Responsive breakpoints** — Hidden on `lg:` screens
- **Configurable props**:
  - `hideLanguages` — Hide language flags (currently stub)
  - `hideLogin` — Hide login button (for success screens)

### Mobile Structure
```
┌─ Mobile Nav (fixed) ────────────────┐
│ [Logo] Yai    [☰ Menu]              │
└─────────────────────────────────────┘
  ↓ (on menu click)
┌─ Slide Drawer ─────────────────────┐
│ About                               │
│ Product                             │
│ Customers                           │
│ Partners                            │
│ Pricing                             │
│ Subscription                        │
│ Experience                          │
│ Ai feed                             │
│ Chat                                │
│ [Login Button - Full width]         │
└─────────────────────────────────────┘
```

### Desktop Navbar (lg: screens)
```
Desktop: Full horizontal nav in header
- Logo + tagline (left)
- Nav links in a row (center)
- Language flags + Login pill (right)
```

---

## 🎯 Implementation Checklist

### ✅ Completed
- [x] Mobile nav component created
- [x] Subscription page (`/subscribe`) — MobileNav + desktop header
- [x] Verifying payment screen — MobileNav + desktop header
- [x] Invoice request success — MobileNav + desktop header
- [x] Payment success — MobileNav + desktop header

### ⏳ To Do (Next Pass)
- [ ] Homepage (`/app/page.tsx`) — Add MobileNav + restructure header
- [ ] About page (`/app/about`) — Add MobileNav
- [ ] Experience dashboard — Add MobileNav
- [ ] AI Feed page — Add MobileNav
- [ ] Partner Portal — Add MobileNav

---

## 🎨 Design Principles

### Mobile-First
- **Navigation is critical on mobile** — not hidden or secondary
- **Touch-friendly targets** — 44px minimum tap area
- **Clear visual hierarchy** — Logo ≥ Menu icon
- **Scroll lock** — Prevents layout shift when drawer opens

### Desktop (1024px+)
- **Fixed header** — Stays visible on scroll
- **Scrolled state** — Bg becomes opaque with shadow
- **Unscrolled state** — Transparent bg for hero section overlap
- **Full nav visible** — No drawer, all links shown

### Consistency Across All Pages
- **Same nav structure** everywhere
- **Same URL paths** for all links
- **Same color scheme** (yai-navy, yai-orange, white)
- **Same transition timing** (300ms)

---

## 📏 Sizing & Spacing

### Mobile Nav Bar
- Height: 4rem (64px)
- Logo: 40px (w-10 h-10)
- Menu icon: 24px
- Padding: 1rem (16px)

### Drawer Menu
- Full width
- Padding: 1rem (16px)
- Each link: 0.75rem py (12px), 1rem px (16px)
- Link gaps: 0.25rem (4px) between items
- Border radius: 0.5rem (8px) per link

### Desktop Header
- Height: 4rem (64px)
- Logo text: Hidden on mobile, shown on sm:
- Nav gaps: 1.5rem (24px) between main groups
- Font size: 13px for nav links

---

## 🎯 Usage Pattern

```tsx
// In any page or component
import MobileNav from "@/components/mobile-nav";

export default function YourPage() {
  return (
    <main>
      {/* Mobile nav */}
      <MobileNav hideLogin={false} />

      {/* Desktop header (example) */}
      <div className="hidden lg:block bg-yai-navy text-white fixed top-0 inset-x-0 z-40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold">Yai</Link>
          <a href="https://main.yaikh.com/login" className="px-4 py-2 bg-yai-orange text-white rounded-full">LOGIN</a>
        </div>
      </div>

      {/* Spacer for desktop nav */}
      <div className="hidden lg:block h-16" />

      {/* Page content */}
    </main>
  );
}
```

---

## 🔗 Navigation Links (Canonical)
All pages use these links:

| Label | Path |
|-------|------|
| About | `/about` |
| Product | `/#product` |
| Customers | `#customers` |
| Partners | `/SDTV` |
| Pricing | `#pricing` |
| Subscription | `/subscribe` |
| Experience | `/experience` |
| Ai feed | `/ai-feed` |
| Chat | `#contact` |
| Login | `https://main.yaikh.com/login` |

---

## 🎯 z-index Stack

| Layer | z-index | Purpose |
|-------|---------|---------|
| Backdrop overlay | 39 | Behind drawer, click to close |
| Mobile drawer | 39 | Slide-out menu |
| Mobile nav header | 40 | Fixed top bar |
| Desktop nav header | 40 | Fixed top bar (desktop) |
| Toast/alerts | 50 | Above everything |

---

## 🔧 Future Enhancements

1. **Language switcher on mobile** — Add flag buttons to drawer
2. **Search** — Add search icon/modal on mobile
3. **Breadcrumbs** — Show page context in drawer
4. **Analytics** — Track nav link clicks
5. **Keyboard navigation** — Trap focus in drawer, Esc to close
6. **Animation refinements** — Add spring animations
7. **Dark mode support** — Adapt colors to theme
