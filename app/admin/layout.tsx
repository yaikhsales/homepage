import Link from "next/link";
import { cookies } from "next/headers";
import { verifyAdminCookie, ADMIN_COOKIE_NAME } from "@/lib/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Yai · Admin Back-end",
  description: "Manual data entry portal for the live Yai plan portal.",
};

/**
 * Admin section layout — gate + sidebar.
 *
 * Unauthenticated visitors see the login form rendered IN PLACE OF children.
 * Authenticated admin sees a sidebar + the child page content.
 *
 * Auth is the admin cookie set by /api/admin/auth (user "texlink" / passcode "012026"
 * by default; overridable via YAI_ADMIN_USER + YAI_ADMIN_PASS env).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  const user = verifyAdminCookie(adminCookie?.value);
  const isAdmin = !!user;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-yai-navy text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white text-yai-navy p-8 shadow-2xl">
          <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold mb-1">
            Yai · Back-end
          </div>
          <h1 className="text-2xl font-extrabold mb-1">Admin sign in</h1>
          <p className="text-xs text-gray-600 mb-5">
            Manual data entry portal. Use it to update planned-vs-actual budget, factory adoption,
            partner pathway progress, OC update content, and events.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-yai-navy">
      {/* Side nav */}
      <aside className="w-64 bg-yai-navy text-white shrink-0 flex flex-col">
        <div className="px-5 py-4 border-b border-white/10">
          <Link href="/admin" className="block">
            <div className="text-[10px] uppercase tracking-[0.18em] text-yai-orange/80 font-bold">
              Yai · Back-end
            </div>
            <div className="text-base font-extrabold mt-0.5">Admin Portal</div>
          </Link>
        </div>
        <nav className="px-3 py-3 space-y-0.5 text-sm flex-1">
          <AdminNavLink href="/admin"          label="Dashboard"          icon="◆" />
          <div className="pt-3 pb-1 px-3 text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold">
            P&amp;L streams
          </div>
          <AdminNavLink href="/admin/sales"    label="Sales / Income"     icon="💰" />
          <AdminNavLink href="/admin/salaries" label="Salaries"           icon="👥" />
          <AdminNavLink href="/admin/capex"    label="Capex / Equipment"  icon="⚙" />
          <AdminNavLink href="/admin/costs"    label="Sales Running Costs" icon="💸" disabled />
          <div className="pt-3 pb-1 px-3 text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold">
            Aggregate &amp; reporting
          </div>
          <AdminNavLink href="/admin/budget"   label="Live Budget roll-up" icon="∑" />
          <div className="pt-3 pb-1 px-3 text-[9px] uppercase tracking-[0.18em] text-white/40 font-bold">
            Plan content
          </div>
          <AdminNavLink href="/admin/factories" label="Factory Adoption"  icon="▦" disabled />
          <AdminNavLink href="/admin/events"    label="Events Calendar"   icon="▣" disabled />
          <AdminNavLink href="/admin/partners"  label="Partner Pathways"  icon="▤" disabled />
          <AdminNavLink href="/admin/oc"        label="OC Update Content" icon="✎" disabled />
          <AdminNavLink href="/admin/about"     label="About · Section 17" icon="ℹ" />
        </nav>
        <div className="px-5 py-3 border-t border-white/10 text-[10px] text-white/50 space-y-1">
          <div>Signed in as <strong className="text-white/90">{user}</strong></div>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="hover:text-white text-left">
              Sign out
            </button>
          </form>
          <Link href="/plan" target="_blank" className="block hover:text-white">
            ↗ Open live plan in new tab
          </Link>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

function AdminNavLink({
  href,
  label,
  icon,
  disabled,
}: {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="flex items-center gap-2 py-2 pl-4 pr-2 rounded text-white/30 cursor-not-allowed">
        <span className="text-yai-blue/70 font-bold">{icon}</span>
        <span>{label}</span>
        <span className="ml-auto text-[9px] uppercase tracking-wider text-yai-blue/60">soon</span>
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-center gap-2 py-2 pl-4 pr-2 rounded text-white/75 hover:text-white hover:bg-white/5 transition"
    >
      <span className="text-yai-orange font-bold">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
