// The top of a simulated-factory module screen (MRP, FC, YPI, 4DP line).
// The site's 3-mode nav (My Task Agent · Agent Collective · Big Brain) is a fixed, transparent row drawn by
// AppLayout at top 80 px, and the site header above it scrolls away (an ancestor has overflow-x hidden, so
// its "sticky" never sticks). Without help the nav floats over the page and the content scrolls through it.
// NavCover lays a solid band (the page colour) under the nav, from the top of the window to just below it;
// useScreenTop gives the screen the top padding that starts its toolbar right under that band, whether or not
// the site header is shown on this route. Written with React.createElement (no JSX), like MrpView.
import React, { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const h = React.createElement;
export const NAV_BOTTOM = 146; // window y just under the 3-mode nav (top 80 + 56 high + the avatar ring)

// Solid band behind the fixed nav: above the page (z 45), below the site header (z 50) and the nav (z 60).
export const NavCover = () => h("div", { "aria-hidden": true, className: "fixed top-0 left-0 right-0 z-[45] bg-slate-900", style: { height: NAV_BOTTOM } });

// ref for the screen wrapper + its top padding, so the toolbar starts 4 px under the band.
export const useScreenTop = () => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const [pad, setPad] = useState(NAV_BOTTOM + 4 - 64);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY; // the site header's height on routes that show it
    setPad(Math.max(8, Math.round(NAV_BOTTOM + 4 - top)));
  }, [pathname]);
  return [ref, pad];
};

// Key figures as small inline "label value" text for a toolbar. The group takes the room left on the toolbar line
// and wraps inside itself when the figures do not fit, rather than pushing the controls onto a line of their own.
export const Figures = ({ items, fmt, tone }) =>
  h(
    "div",
    { className: "flex flex-1 basis-0 min-w-[16rem] items-center gap-x-2.5 gap-y-0.5 flex-wrap text-xs text-slate-400" },
    (items || []).map((x) =>
      h("span", { key: x.label, className: "whitespace-nowrap" }, x.label + " ", h("b", { className: "tabular-nums text-sm " + ((tone && tone(x)) || "text-white") }, fmt ? fmt(x.value) : x.value))
    )
  );
