// Owner-provisioned session auth. No email sender needed: the owner mints a member,
// hands them a one-time /enter/:token link, which sets a durable httpOnly session cookie.

import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export interface Member {
  id: number;
  email: string;
  name: string;
  session_token: string;
  created_at: string;
}

export const SESSION_COOKIE = "tuned_session";

export function newToken(bytes = 24): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function currentMember(c: Context): Promise<Member | null> {
  const tok = getCookie(c, SESSION_COOKIE);
  if (!tok) return null;
  const db = c.env.DB as D1Database;
  return await db.prepare("SELECT * FROM members WHERE session_token = ?").bind(tok).first<Member>();
}

export function grantSession(c: Context, token: string): void {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function clearSession(c: Context): void {
  setCookie(c, SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "Lax", path: "/", maxAge: 0 });
}
