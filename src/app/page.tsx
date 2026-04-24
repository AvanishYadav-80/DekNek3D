"use client";

import { motion } from "framer-motion";
import { ArrowRight, Box, Layers, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Three.js scene to avoid SSR issues
const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="mesh-bg" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <Sparkles className="text-indigo-400" size={14} />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Next-Gen 3D Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
              Create, Manage, <br />
              <span className="text-indigo-500">Scale 3D Assets</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-lg leading-relaxed">
              Nex3D Hub is the ultimate ecosystem for creators. Harness the power of AI to organize your 3D workflow and showcase your masterpieces to the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="btn-primary group">
                Start Creating <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/explore" className="btn-secondary">
                Explore Gallery
              </Link>
            </div>
          </motion.div>

          {/* 3D Visualizer Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[500px] rounded-3xl overflow-hidden glass-card"
          >
            <ThreeScene />
            
            <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs text-white/40 uppercase">Model Preview</p>
                <p className="font-semibold">Cyber-Core V1</p>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-indigo-600 flex items-center justify-center">
                    <span className="text-[10px]">AI</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">Powerful Creator Tools</h2>
            <p className="text-white/50">Everything you need to build the metaverse.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Box className="text-indigo-500" />}
              title="Cloud Library"
              description="Securely store and version your 3D assets with our encrypted cloud infrastructure."
            />
            <FeatureCard 
              icon={<Zap className="text-indigo-500" />}
              title="AI Optimization"
              description="Automatically optimize textures and polygon counts using our state-of-the-art AI engines."
            />
            <FeatureCard 
              icon={<Layers className="text-indigo-500" />}
              title="Team Sync"
              description="Collaborate in real-time with shared workspaces and seamless asset pipelines."
            />
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 text-center text-white/30 text-sm">
        <p>&copy; 2026 Nex3D Hub. Built for DekNek3D Assignment.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8 flex flex-col items-start gap-4"
    >
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-white/40 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
