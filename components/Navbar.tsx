"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TEXTS } from "@/lib/texts";
import type { Profile } from "@/lib/types";
import {
  Sparkles,
  Menu,
  X,
  Briefcase,
  LayoutDashboard,
  User,
  ShieldCheck,
  PlusCircle,
  LogOut,
  LogIn,
} from "lucide-react";

interface NavbarProps {
  profile: Profile | null;
}

export function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-primary/15 bg-brand-bg/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-serif text-lg sm:text-xl font-bold tracking-wider text-brand-text hover:text-brand-primary transition-colors"
        >
          <span className="w-9 h-9 rounded-2xl bg-brand-accent/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary shadow-purple-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>{TEXTS.brand.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/jobs"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              isActive("/jobs") && pathname !== "/jobs/new"
                ? "bg-brand-primary/20 text-brand-text border border-brand-primary/30"
                : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {TEXTS.nav.jobs}
          </Link>

          {(profile?.role === "client" || profile?.role === "admin") && (
            <Link
              href="/jobs/new"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                pathname === "/jobs/new"
                  ? "bg-brand-primary/20 text-brand-text border border-brand-primary/30"
                  : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {TEXTS.nav.postJob}
            </Link>
          )}

          {profile && (
            <>
              <Link
                href="/dashboard"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-brand-primary/20 text-brand-text border border-brand-primary/30"
                    : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {TEXTS.nav.dashboard}
              </Link>
              <Link
                href="/profile"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  isActive("/profile")
                    ? "bg-brand-primary/20 text-brand-text border border-brand-primary/30"
                    : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
                }`}
              >
                <User className="w-4 h-4" />
                {TEXTS.nav.profile}
              </Link>
            </>
          )}

          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                isActive("/admin")
                  ? "bg-brand-primary/20 text-brand-text border border-brand-primary/30"
                  : "text-brand-muted hover:text-brand-text hover:bg-brand-card"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              {TEXTS.nav.admin}
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {profile ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-xs px-3 py-1.5 rounded-xl bg-brand-card border border-brand-primary/20 text-brand-muted hover:text-brand-text"
              >
                <span className="font-semibold text-brand-text">{profile.full_name}</span>{" "}
                <span className="text-brand-primary">
                  ({profile.role === "freelancer"
                    ? "Frilanser"
                    : profile.role === "client"
                    ? "Buyurtmachi"
                    : "Admin"})
                </span>
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-brand-card hover:bg-red-950/60 text-brand-muted hover:text-red-200 border border-brand-primary/20 transition-colors inline-flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {TEXTS.nav.logout}
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-text transition-colors inline-flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                {TEXTS.nav.login}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold bg-brand-accent hover:bg-brand-primary text-brand-bg transition-colors shadow-purple-sm"
              >
                {TEXTS.nav.register}
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menyuni ochish"
          className="md:hidden p-2.5 rounded-xl bg-brand-card border border-brand-primary/25 text-brand-text"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-primary/15 bg-brand-card px-4 py-4 space-y-2">
          <Link
            href="/jobs"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-primary/15"
          >
            <Briefcase className="w-4 h-4 text-brand-primary" />
            {TEXTS.nav.jobs}
          </Link>

          {(profile?.role === "client" || profile?.role === "admin") && (
            <Link
              href="/jobs/new"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-primary/15"
            >
              <PlusCircle className="w-4 h-4 text-brand-primary" />
              {TEXTS.nav.postJob}
            </Link>
          )}

          {profile ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-primary/15"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                {TEXTS.nav.dashboard}
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-primary/15"
              >
                <User className="w-4 h-4 text-brand-primary" />
                {TEXTS.nav.profile} ({profile.full_name})
              </Link>
              {profile.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-primary/15"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  {TEXTS.nav.admin}
                </Link>
              )}
              <form action="/auth/signout" method="post" className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-red-950/40 text-red-200 border border-red-400/20"
                >
                  <LogOut className="w-4 h-4" />
                  {TEXTS.nav.logout}
                </button>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center py-3 rounded-xl text-sm font-medium bg-brand-bg border border-brand-primary/25 text-brand-text"
              >
                {TEXTS.nav.login}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold bg-brand-accent text-brand-bg"
              >
                {TEXTS.nav.register}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
