"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User, Shield, ArrowLeft,
  CheckCircle, Mail, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState("");

  const handleSave = async () => {
    if (!user || !auth.currentUser) return;
    setSaving(true);
    setError("");
    try {
      await updateProfile(auth.currentUser, { displayName });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <User className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-50" />
        <h1 className="font-serif text-2xl text-white mb-2">You&apos;re not signed in</h1>
        <p className="text-sm text-[#B8B8B8] mb-5">Sign in to manage your settings.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-[#B8B8B8] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>

      <h1 className="font-serif text-3xl text-white mb-6">Settings</h1>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 mb-4"
      >
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Profile</h2>
        </div>

        {/* Display Name */}
        <div className="mb-4">
          <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.12)] rounded-xl text-white text-sm focus:outline-none focus:border-[rgba(212,175,55,0.4)] transition-all placeholder:text-[#B8B8B8]/40"
          />
        </div>

        {/* Email (read-only) */}
        <div className="mb-5">
          <label className="block text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-1.5">
            Email Address
          </label>
          <div className="flex items-center gap-2 w-full px-4 py-3 bg-white/5 border border-[rgba(212,175,55,0.06)] rounded-xl">
            <Mail className="w-4 h-4 text-[#B8B8B8]" />
            <span className="text-sm text-[#B8B8B8] truncate">{user.email}</span>
          </div>
          <p className="text-[10px] text-[#B8B8B8]/60 mt-1">Email cannot be changed here.</p>
        </div>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A8891C] text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : null}
          {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </motion.div>

      {/* Security section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="luxury-card p-6 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Security</h2>
        </div>
        <div className="flex items-start justify-between gap-4 py-2">
          <div>
            <p className="text-sm text-white font-medium">Email Verified</p>
            <p className="text-xs text-[#B8B8B8] mt-0.5">
              {user.emailVerified
                ? "Your email is verified."
                : "Your email is not yet verified."}
            </p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
              user.emailVerified
                ? "bg-green-500/10 text-green-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {user.emailVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </motion.div>

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <button
          onClick={handleSignOut}
          className="w-full luxury-card p-4 flex items-center gap-4 cursor-pointer group hover:border-red-500/20 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-red-400 font-medium">Sign Out</p>
            <p className="text-xs text-[#B8B8B8]">Sign out of your LUXEURE account</p>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
