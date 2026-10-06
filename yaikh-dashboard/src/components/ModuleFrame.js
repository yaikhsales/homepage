// ModuleFrame — the frame around the older module screens (YQMS sub-screens, YHR, bills, admin, CSR,
// YTM …) so they obey the same rules as the newer ones without rewriting each page:
//   • the page starts BELOW the fixed 3-mode nav (NavCover + the screen-top padding), never under it;
//   • the page's own header loses its "sticky top-0" (it would stick back under the nav) and becomes a
//     compact one-line header;
//   • the page's back button — whatever markup it has (icon + "Back" text, hover arrows) — is shown as the
//     standard 32 px icon-only arrow with the white ring, and it goes back to the module hub.
// Pages that already frame themselves (NavCover / useScreenTop) don't need this.
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavCover, useScreenTop } from "./ScreenTop";

// Where the back arrow of a module screen lands: the module hub, not browser history.
const HUB = [[/^\/dashboard\/yqms\//, "/dashboard/submenu/yqms"]];

const CSS = `
.module-frame .sticky.top-0, .module-frame header.sticky { position: relative !important; top: auto !important; }
.module-body > .fixed.inset-0, .module-body > .fixed, .module-body > .h-screen { position: relative !important; inset: auto !important; height: auto !important; min-height: calc(100vh - 150px); overflow: visible !important; animation: none !important; }
.module-body > .fixed > .flex-1.overflow-auto, .module-body > .fixed > .flex-1.overflow-y-auto { overflow: visible !important; }
.module-body > div > header, .module-body > div > div > header { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
.module-frame header h1, .module-frame header h2 { font-size: 1.125rem !important; line-height: 1.2 !important; }
.module-frame header p, .module-frame header .text-sm:not(button):not(input) { font-size: 0.75rem !important; }
.module-frame button:has(> svg.lucide-arrow-left) {
  width: 2rem !important; height: 2rem !important; min-width: 2rem; padding: 0 !important; margin-right: 0.5rem;
  border-radius: 9999px !important; border: 2px solid #fff !important; background: rgba(15, 23, 42, 0.85) !important; color: #fff !important;
  display: inline-flex !important; align-items: center !important; justify-content: center !important; font-size: 0 !important; gap: 0 !important; flex-shrink: 0;
  transition: box-shadow 0.15s, background-color 0.15s;
}
.module-frame button:has(> svg.lucide-arrow-left) > svg { width: 1.375rem !important; height: 1.375rem !important; transform: none !important; color: #fff; }
.module-frame button:has(> svg.lucide-arrow-left) > *:not(svg) { display: none !important; }
.module-frame button:has(> svg.lucide-arrow-left):hover { background: rgba(255,255,255,0.18) !important; box-shadow: 0 0 0 3px rgba(255,255,255,0.25), 0 0 14px rgba(255,255,255,0.45); }
.module-frame .min-h-screen { min-height: calc(100vh - 150px) !important; }
`;

const ModuleFrame = ({ children }) => {
  const [topRef, topPad] = useScreenTop();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hub = (HUB.find(([re]) => re.test(pathname)) || [])[1];
  // the page's own back button goes to history (-1); on hub-owned screens send it to the hub instead
  const onClickCapture = (e) => {
    if (!hub) return;
    const btn = e.target.closest && e.target.closest("button");
    if (!btn || !btn.querySelector(":scope > svg.lucide-arrow-left")) return;
    e.preventDefault(); e.stopPropagation();
    navigate(hub);
  };
  return (
    <div ref={topRef} className="module-frame" style={{ paddingTop: topPad }} onClickCapture={onClickCapture}>
      <style>{CSS}</style>
      <NavCover />
      <div className="module-body">{children}</div>
    </div>
  );
};

export default ModuleFrame;
