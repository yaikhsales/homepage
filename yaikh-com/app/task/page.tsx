/* /task — events calendar.
 *
 * Single URL: unauthenticated visitors see the TASK login card inline;
 * authenticated viewers see the calendar. No /task-login redirect.
 *
 * Access codes (set in Railway YAI_ACCESS_CODES):
 *   GK12@#:Gamini task
 *   TL25@#:Texlink task
 *
 * Data source (phase 2): events harvested by _strategy-board/telegram/scout.py
 * from the GOV STARTUP folder (21 channels) + TAFTAC MEMBERS topics. For
 * now the calendar renders empty with a "feed pending" placeholder.
 */
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { TaskCalendar } from "@/components/task/TaskCalendar";
import { LoginCard } from "@/components/login/LoginCard";

export const dynamic = "force-dynamic";

export default function TaskPage() {
  const viewer = verifySession(cookies().get(COOKIE_NAME)?.value);

  if (!viewer) {
    return (
      <main className="min-h-screen leather-bg flex items-center justify-center p-4 sm:p-6">
        <LoginCard redirectTo="/task" title="Task · Events Calendar" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f0e8] px-4 py-8 sm:px-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-yai-orange">
            Yai · Task
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-yai-navy">
            Events Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Pulled from the GOV · STARTUP folder (21 channels) + TAFTAC MEMBERS
            topics. Pick what we go to, skip, or defer.
          </p>
          <div className="mt-1 text-[11px] text-gray-500">
            Signed in as <strong>{viewer}</strong>
          </div>
        </header>
        <TaskCalendar events={[]} />
      </div>
    </main>
  );
}
