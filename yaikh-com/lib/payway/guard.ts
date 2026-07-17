/* Admin gate for merchant PayWay routes (QR collect, transactions, refund).
 * The customer checkout routes (/api/payway/sign, /check) stay public; these
 * merchant routes must not be callable anonymously — they expose signed
 * transaction data and refunds. */

import { verifyAdminCookie, ADMIN_COOKIE_NAME } from "@/lib/admin";

export function isAdmin(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return Boolean(verifyAdminCookie(m ? decodeURIComponent(m[1]) : null));
}
