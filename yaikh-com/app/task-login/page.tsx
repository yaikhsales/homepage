/* /task-login — gate for the /task events calendar.
 *
 * Middleware redirects unauthenticated /task/* visitors here. On a valid
 * code, LoginCard sets the yai_session cookie and routes to /task.
 * Accepts the same env var YAI_ACCESS_CODES as the SDTV gate — codes with
 * labels that mention "task" (e.g. GK12@#:Gamini task, TL25@#:Texlink
 * task) are intended for this entrance, but technically any valid code
 * opens any gate (cookies are shared).
 */
import { LoginCard } from "@/components/login/LoginCard";

export default function TaskLoginPage() {
  return (
    <main className="min-h-screen leather-bg flex items-center justify-center p-4 sm:p-6">
      <LoginCard redirectTo="/task" title="Task · Events Calendar" />
    </main>
  );
}
