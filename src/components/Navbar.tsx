"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { LogOut, User as UserIcon, Hexagon, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <Hexagon className="text-indigo-500 fill-indigo-500/20" size={32} />
          <span>Nex3D<span className="text-indigo-500">Hub</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="text-sm font-medium hover:text-indigo-400 transition-colors">Explore</Link>
          <Link href="/community" className="text-sm font-medium hover:text-indigo-400 transition-colors">Community</Link>
          {user && user.emailVerified ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                <UserIcon size={18} />
                <span className="text-sm">Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="text-white/60 hover:text-red-400 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-indigo-400">Login</Link>
              <Link href="/signup" className="btn-primary py-2 px-6 rounded-full text-sm">Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full p-6 animate-fadeIn">
          <div className="flex flex-col gap-6">
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
            <Link href="/community" onClick={() => setMobileMenuOpen(false)}>Community</Link>
            {user && user.emailVerified ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/signup" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 1200px;
        }
      `}</style>
    </nav>
  );
}
