import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "cms_auth";

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-change-in-production",
  );
}

// Constant-time string comparison to prevent timing attacks
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function signIn(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD not set");
    return false;
  }

  const emailOk = safeCompare(email, adminEmail);
  const passwordOk = safeCompare(password, adminPassword);

  if (!emailOk || !passwordOk) return false;

  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return true;
}

export async function signOut() {
  const c = await cookies();
  c.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getSession() {
  try {
    const c = await cookies();
    const token = c.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
