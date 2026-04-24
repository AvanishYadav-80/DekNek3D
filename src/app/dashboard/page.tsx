"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Plus, Search, Box, MoreVertical, ExternalLink } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isFetchingAssets, setIsFetchingAssets] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredAssets = assets.filter(asset => {
    const query = searchQuery.toLowerCase();
    const nameMatch = asset.name ? String(asset.name).toLowerCase().includes(query) : false;
    const typeMatch = asset.type ? String(asset.type).toLowerCase().includes(query) : false;
    return nameMatch || typeMatch;
  });

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else if (!user.emailVerified) {
        // Redirect to signup page where the verification message is shown
        router.push("/signup");
      } else {
        setUser(user);
        setLoading(false);

        setIsFetchingAssets(true);
        const q = query(collection(db, "assets"), where("userId", "==", user.uid));
        
        // Listen to real-time updates. This provides instant loading from cache!
        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const assetsData: Asset[] = [];
          snapshot.forEach((doc) => {
            assetsData.push({ id: doc.id, ...doc.data() } as Asset);
          });
          // Sort newest first
          assetsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAssets(assetsData);
          setIsFetchingAssets(false);
        }, (error) => {
          console.error("Error fetching assets:", error);
          setIsFetchingAssets(false);
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [router]);

  const handleAddAsset = () => {
    if (!user) return;
    setIsAdding(true);
    
    const newAsset = {
      name: `Cyber-Asset #${Math.floor(Math.random() * 1000)}`,
      type: "3D Model",
      status: "Active",
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    
    // Fire and forget - Firebase will sync in background
    addDoc(collection(db, "assets"), newAsset).catch((error: any) => {
      console.error("Error adding asset:", error);
      alert("Failed to create asset: " + error.message);
    });
    
    // Instantly reset button for premium snappy feel
    setTimeout(() => setIsAdding(false), 400);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="mesh-bg opacity-30 pointer-events-none" style={{ pointerEvents: 'none' }} />
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-white/40">Manage your 3D assets and workspace.</p>
          </div>
          <button onClick={handleAddAsset} disabled={isAdding} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            {isAdding ? "Creating..." : "New Asset"}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Assets" value={assets.length.toString()} color="text-indigo-400" />
          <StatCard title="Storage Used" value="1.2 GB" color="text-emerald-400" />
          <StatCard title="Views" value="2.4k" color="text-amber-400" />
        </div>

        {/* Asset Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <LayoutDashboard size={20} className="text-indigo-400" /> Recent Assets
            </h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Asset Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date Created</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isFetchingAssets ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Loading your workspace...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/20">
                      {searchQuery ? "No matching assets found." : "No assets found. Click \"New Asset\" to get started."}
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <motion.tr 
                      key={asset.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Box size={16} />
                          </div>
                          <span className="font-medium">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{asset.type}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase">
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="hover:text-white"><ExternalLink size={16} /></button>
                          <button className="hover:text-white"><MoreVertical size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="glass-card p-6">
      <p className="text-sm text-white/40 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
