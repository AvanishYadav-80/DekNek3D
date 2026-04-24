"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hexagon, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle auth state and redirect result
  useEffect(() => {
    // 1. Listen for auth state changes (handles popup and existing sessions)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    // 2. Check for redirect results (handles coming back from Google redirect)
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: user.displayName || "Google Creator",
            email: user.email,
            createdAt: new Date().toISOString()
          }, { merge: true });
          router.push("/dashboard");
        }
      } catch (err: any) {
        console.error("Redirect Error:", err);
        setError(err.message);
      }
    };

    checkRedirect();
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName || "Google Creator",
          email: user.email,
          createdAt: new Date().toISOString()
        }, { merge: true });

        router.push("/dashboard");
      } catch (popupErr: any) {
        // If popup is blocked, fallback to redirect
        if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupErr;
        }
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#07080f' }}>
      {/* Scattered dot background — Zenzai style */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `rgba(99,102,241,${Math.random() * 0.5 + 0.2})`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
        {/* Blue edge glow */}
        <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500/40 blur-sm" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500/40 blur-sm" />
        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/20 blur-sm" />
        <div className="absolute inset-y-0 right-0 w-1 bg-indigo-500/20 blur-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl p-8 z-10"
        style={{ background: '#0e1020', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
      >
        {/* Logo & heading */}
        <div className="flex flex-col items-center mb-8">
          <Hexagon className="text-indigo-500 fill-indigo-500/20 mb-5" size={44} />
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="text-white/40 text-sm mt-2">Log in to manage your 3D assets</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          {/* Email */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/50 uppercase tracking-widest">
              Email
            </label>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#161828', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Mail size={16} className="text-white/30 shrink-0" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full text-base placeholder:text-white/25 focus:outline-none"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', caretColor: '#6366f1' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#161828', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Lock size={16} className="text-white/30 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full text-base placeholder:text-white/25 focus:outline-none"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', caretColor: '#6366f1' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="transition-colors shrink-0 p-1 rounded-lg hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #5b5bd6 0%, #4f46e5 100%)' }}
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
          
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs font-semibold text-white/30 uppercase">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold transition-all hover:bg-white/5 active:scale-[0.98] cursor-pointer border border-white/10 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
