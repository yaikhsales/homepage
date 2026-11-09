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
import { LoginCard } from "@/components/login/LoginCard";
import { TaskPageInner } from "@/components/task/TaskPageInner";

export const dynamic = "force-dynamic";

// Default assignee list — swap for the real YAID roster once mapped.
const TEAM_OPTIONS = [
  "YAID Gamini",
  "YAID Dale 1",
  "YAID Dale 2",
  "YAID Sam",
  "YAID Lin",
  "YAID Win",
];

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
    <TaskPageInner viewer={viewer} events={[]} teamOptions={TEAM_OPTIONS} />
  );
}
