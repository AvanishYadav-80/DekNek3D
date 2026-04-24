"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Box, Eye, Heart, Download, Share2, X, Shield, Cpu, Zap, CheckCircle2, TrendingUp, ChevronDown } from "lucide-react";

interface Model {
  id: number;
  name: string;
  author: string;
  views: string;
  likes: number;
  image: string;
  type: string;
  isLiked?: boolean;
  polygons: string;
  format: string;
  category: string;
  isTrending?: boolean;
}

const CATEGORIES = ["All", "Characters", "Weapons", "Vehicles", "Props", "Environments"];

const INITIAL_MODELS: Model[] = [
  { id: 1, name: "Neon Katana", author: "CyberNek", views: "1.2k", likes: 850, image: "linear-gradient(135deg, #4f46e5 20%, #000 100%)", type: "Melee", polygons: "12k", format: "GLB", category: "Weapons", isTrending: true },
  { id: 2, name: "Mecha Wing", author: "3DMaster", views: "3.4k", likes: 1200, image: "linear-gradient(135deg, #10b981 20%, #000 100%)", type: "Parts", polygons: "45k", format: "FBX", category: "Props" },
  { id: 3, name: "Bio-Pod", author: "NekD", views: "900", likes: 430, image: "linear-gradient(135deg, #f59e0b 20%, #000 100%)", type: "Prop", polygons: "8k", format: "OBJ", category: "Props" },
  { id: 4, name: "Void Sphere", author: "VoidWalker", views: "5.6k", likes: 2100, image: "linear-gradient(135deg, #8b5cf6 20%, #000 100%)", type: "Effect", polygons: "2k", format: "USDZ", category: "Environments", isTrending: true },
  { id: 5, name: "Retro Console", author: "PixelArt", views: "2.1k", likes: 980, image: "linear-gradient(135deg, #ef4444 20%, #000 100%)", type: "Prop", polygons: "15k", format: "GLB", category: "Props" },
  { id: 6, name: "Floating Island", author: "Zenith", views: "4.5k", likes: 1540, image: "linear-gradient(135deg, #3b82f6 20%, #000 100%)", type: "Environment", polygons: "120k", format: "FBX", category: "Environments" },
];

export default function Explore() {
  const [models, setModels] = useState(INITIAL_MODELS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = models.filter(m => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.author.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setModels(models.map(m => {
      if (m.id === id) {
        return { ...m, likes: m.isLiked ? m.likes - 1 : m.likes + 1, isLiked: !m.isLiked };
      }
      return m;
    }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="mesh-bg opacity-30 pointer-events-none" style={{ pointerEvents: 'none' }} />
      <div className="container mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col gap-16 mb-20 relative z-[60]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 tracking-widest text-xs uppercase">
              <TrendingUp size={14} /> Global Marketplace
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter leading-none">Premium 3D Assets</h1>
            <p className="text-white/40 text-xl leading-relaxed">
              Access high-fidelity 3D assets meticulously crafted for next-gen experiences.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 w-full mb-10" style={{ marginTop: '3rem' }}>
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/[0.08] focus-within:border-indigo-500/60 transition-all"
              style={{ flexGrow: 1, background: '#1e2035' }}
            >
              <Search className="text-white/30 shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search resources..."
                className="outline-none appearance-none text-sm text-white w-full"
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', caretColor: '#6366f1' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative shrink-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-secondary h-11 px-6 rounded-full border-white/10 flex items-center gap-3 min-w-[160px] bg-white/5 hover:bg-white/10 transition-all relative z-30"
              >
                <Filter className="text-indigo-400" size={18} />
                <span className="font-bold text-white/80 text-sm">{selectedCategory}</span>
                <ChevronDown className={`ml-auto transition-transform duration-300 text-white/20 ${isFilterOpen ? "rotate-180" : ""}`} size={16} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 p-2 bg-[#121212] z-50 border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9)] min-w-[220px]"
                    >
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Category Bar - Added Bottom Margin */}


        {/* Grid - Adjusted Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {filteredModels.map((model, i) => (
            <motion.div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group overflow-hidden cursor-pointer border-white/[0.05] hover:border-indigo-500/30"
            >
              <div className="h-64 relative flex items-center justify-center overflow-hidden" style={{ background: model.image }}>
                <div className="absolute inset-0 bg-black/10" />

                {/* 3D Asset Visualizer Style */}
                <div className="relative z-10 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6">
                  <div className="absolute inset-0 blur-3xl opacity-30 bg-white" />
                  <Box size={70} className="relative text-white/40 group-hover:text-white/80" />
                </div>

                {/* Trending Badge - Adjusted Positioning */}
                {model.isTrending && (
                  <div className="absolute top-6 left-6 px-3 py-1.5 bg-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-2xl z-20">
                    <TrendingUp size={12} /> Trending
                  </div>
                )}

              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-indigo-400 transition-colors">{model.name}</h3>
                  <span className="text-[10px] font-black text-white/20 uppercase mt-1">{model.format}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-400/60 font-bold mb-8">
                  <span>@{model.author}</span>
                  <CheckCircle2 size={14} className="text-indigo-400" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                    <p className="text-[9px] text-indigo-400 uppercase font-black mb-1 tracking-widest">Complexity</p>
                    <p className="text-xs font-light whitespace-nowrap">{model.polygons} Tris</p>
                  </div>
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                    <p className="text-[9px] text-indigo-400 uppercase font-black mb-1 tracking-widest">Type</p>
                    <p className="text-xs font-light">{model.type}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-6">
                  <div className="flex items-center gap-4 text-white/30 text-xs">
                    <span className="flex items-center gap-1.5"><Eye size={16} /> {model.views}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleLike(e, model.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${model.isLiked
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-white/5 text-white/30 border border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <Heart size={14} className={model.isLiked ? "fill-red-400 shadow-[0_0_10px_rgba(248,113,113,0.4)]" : ""} />
                      <span className="font-bold">{model.likes}</span>
                    </motion.button>
                  </div>
                  <span className="font-bold text-indigo-400 uppercase tracking-widest text-[9px] bg-indigo-500/10 px-2 py-1 rounded">Free Access</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedModel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModel(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl glass-card z-[101] overflow-hidden border-white/10"
            >
              <div className="grid md:grid-cols-2 h-full">
                <div className="h-80 md:h-auto flex items-center justify-center relative p-12" style={{ background: selectedModel.image }}>
                  <div className="absolute inset-0 bg-black/10" />
                  <Box size={160} className="relative z-10 text-white/40 drop-shadow-2xl" />
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="absolute top-8 left-8 p-3 bg-black/40 rounded-2xl hover:bg-black/60 transition-colors border border-white/5"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-12 space-y-10 overflow-y-auto max-h-[70vh] md:max-h-none bg-[#0a0a0a]">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-5xl font-bold tracking-tighter">{selectedModel.name}</h2>
                      <div className="flex gap-3">
                        <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-colors"><Share2 size={24} /></button>
                        <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 text-red-500 transition-colors"><Heart size={24} /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                      <span>@{selectedModel.author}</span>
                      <CheckCircle2 size={18} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05]">
                      <p className="text-[10px] text-white/20 uppercase font-black mb-2 tracking-widest">Complexity</p>
                      <p className="text-xl font-bold flex items-center gap-3"><Cpu size={20} className="text-indigo-400" /> {selectedModel.polygons}</p>
                    </div>
                    <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05]">
                      <p className="text-[10px] text-white/20 uppercase font-black mb-2 tracking-widest">Native Format</p>
                      <p className="text-xl font-bold flex items-center gap-3"><Box size={20} className="text-emerald-400" /> {selectedModel.format}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-white/50 text-lg leading-relaxed">
                      Industry-standard {selectedModel.category.toLowerCase()} asset with clean topology and PBR materials.
                    </p>
                  </div>

                  <div className="flex gap-5 pt-4">
                    <button className="btn-primary flex-1 py-6 rounded-3xl text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
                      <Download size={24} /> Download Asset
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
