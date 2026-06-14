import React from 'react';

/* Header — minimal chrome for the absorbed dashboard.
 *
 * When the demo runs standalone (V2 dev :3002) or embedded inside
 * yaikh-com at /dashboard, the only chrome we want is:
 *   • Yai orange logo (left)        — click → back to yaikh-com homepage
 *   • "Experience" button (right)   — click → back to yaikh-com homepage
 *
 * Everything else from V2 (user profile, notifications, language picker,
 * Google Play + App Store buttons, AT country code, etc.) is intentionally
 * removed here. To restore it, see the previous commit.
 *
 * Uses window.location so the user exits the CRA SPA back into the host
 * Next.js app at "/" (yaikh-com's marketing homepage), not the in-router
 * "/" which would stay inside the dashboard.
 */

const Header = () => {
  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <header className="bg-yai-navy/95 backdrop-blur shadow-md px-4 sm:px-6 py-2 flex justify-between items-center sticky top-0 z-50 h-14 sm:h-16">
      {/* Left: Home button — click returns to yaikh-com homepage */}
      <button
        onClick={goHome}
        aria-label="Back to yaikh.com homepage"
        className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-yai-orange text-white text-sm sm:text-base font-semibold hover:bg-yai-orange/90 transition shadow-md flex items-center gap-2"
      >
        <span>← Home</span>
      </button>

      {/* Right side intentionally empty — Experience duplicate removed. */}
      <div />
    </header>
  );
};

export default Header;
