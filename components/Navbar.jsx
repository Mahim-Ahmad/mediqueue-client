"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, GraduationCap, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const linkClass = (href) => {
    const active = pathname === href;
    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-brand-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10"
    }`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f1218]/95 backdrop-blur border-b border-brand-100 dark:border-white/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
            <GraduationCap size={18} />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-brand-700 dark:text-brand-300">Media</span>
            <span className="text-accent-500">Queue</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/tutors" className={linkClass("/tutors")}>Tutors</Link>
          {user && (
            <>
              <Link href="/add-tutor" className={linkClass("/add-tutor")}>Add Tutor</Link>
              <Link href="/my-tutors" className={linkClass("/my-tutors")}>My Tutors</Link>
              <Link href="/my-booked-sessions" className={linkClass("/my-booked-sessions")}>My Booked Sessions</Link>
            </>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=" + (user.displayName || user.email)}
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-200"
                />
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#171a22] border border-brand-100 dark:border-white/10 rounded-xl card-shadow py-1.5 z-40">
                  <p className="px-3.5 py-2 text-xs text-gray-400 truncate">{user.displayName || user.email}</p>
                  <Link href="/my-profile" onClick={() => setProfileOpen(false)} className="block px-3.5 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10">
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-white/10 rounded-lg px-4 py-1.5 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors">
                Login
              </Link>
              <Link href="/register" className="btn-press text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-1.5 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button className="text-gray-700 dark:text-gray-200" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-brand-100 dark:border-white/10 px-4 py-3 flex flex-col gap-1.5 bg-white dark:bg-[#0f1218]">
          <Link href="/" className={linkClass("/")} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/tutors" className={linkClass("/tutors")} onClick={() => setOpen(false)}>Tutors</Link>
          {user ? (
            <>
              <Link href="/add-tutor" className={linkClass("/add-tutor")} onClick={() => setOpen(false)}>Add Tutor</Link>
              <Link href="/my-tutors" className={linkClass("/my-tutors")} onClick={() => setOpen(false)}>My Tutors</Link>
              <Link href="/my-booked-sessions" className={linkClass("/my-booked-sessions")} onClick={() => setOpen(false)}>My Booked Sessions</Link>
              <Link href="/my-profile" className={linkClass("/my-profile")} onClick={() => setOpen(false)}>My Profile</Link>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")} onClick={() => setOpen(false)}>Login</Link>
              <Link href="/register" className={linkClass("/register")} onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
