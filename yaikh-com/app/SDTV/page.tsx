/* Strategic DTV access-code gate for the protected /plan portal.
 *
 * Lives at /SDTV (NOT / — the public marketing homepage stays at /).
 * Middleware at the repo root redirects unauthenticated /plan/* visitors
 * here. On a successful POST /api/auth, the cookie is set and LoginCard
 * navigates to /plan.
 */
import { LoginCard } from "@/components/login/LoginCard";

export default function SDTVPage() {
  return (
    <main className="min-h-screen leather-bg flex items-center justify-center p-4 sm:p-6">
      <LoginCard />
    </main>
  );
}
