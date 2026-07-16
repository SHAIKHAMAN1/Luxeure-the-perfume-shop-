/**
 * GET /api/debug/env-check
 * Temporary endpoint to diagnose Vercel environment variable issues.
 * DELETE THIS FILE after debugging is complete.
 */
import { NextResponse } from "next/server";

export async function GET() {
  const checks = {};

  // Check which env vars exist (never expose actual values)
  checks.MONGODB_URI = !!process.env.MONGODB_URI;
  checks.MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "(not set)";
  checks.SESSION_SECRET = !!process.env.SESSION_SECRET;
  checks.FIREBASE_ADMIN_PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID || "(not set)";
  checks.FIREBASE_ADMIN_CLIENT_EMAIL = !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  // Private key — check format without exposing it
  const pk = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!pk) {
    checks.FIREBASE_ADMIN_PRIVATE_KEY = "(not set)";
  } else {
    checks.FIREBASE_ADMIN_PRIVATE_KEY_length = pk.length;
    checks.FIREBASE_ADMIN_PRIVATE_KEY_starts = pk.substring(0, 40);
    checks.FIREBASE_ADMIN_PRIVATE_KEY_ends = pk.substring(pk.length - 40);
    checks.FIREBASE_ADMIN_PRIVATE_KEY_has_real_newlines = pk.includes("\n");
    checks.FIREBASE_ADMIN_PRIVATE_KEY_has_escaped_newlines = pk.includes("\\n");
    checks.FIREBASE_ADMIN_PRIVATE_KEY_has_quotes = pk.startsWith('"') || pk.endsWith('"');
  }

  // NEXT_PUBLIC vars
  checks.NEXT_PUBLIC_FIREBASE_API_KEY = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  checks.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "(not set)";
  checks.NEXT_PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "(not set)";

  // Try to initialize Firebase Admin to see if it crashes
  try {
    const { isAdminConfigured } = await import("@/lib/firebase-admin");
    checks.firebaseAdminConfigured = isAdminConfigured();
  } catch (err) {
    checks.firebaseAdminError = err.message;
  }

  // Try to connect to MongoDB
  try {
    const connectDB = (await import("@/lib/mongoose")).default;
    await connectDB();
    checks.mongodbConnected = true;
  } catch (err) {
    checks.mongodbError = err.message;
  }

  // Try to actually verify a session
  try {
    const { getSession } = await import("@/lib/session");
    const session = await getSession();
    checks.sessionExists = !!session;
    if (session) {
      checks.sessionRole = session.role;
      checks.sessionEmail = session.email;
    }
  } catch (err) {
    checks.sessionError = err.message;
  }

  return NextResponse.json(checks, { status: 200 });
}
