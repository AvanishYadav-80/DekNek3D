"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Award, TrendingUp } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="mesh-bg opacity-30" />
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Creator Community</h1>
          <p className="text-white/40 max-w-lg mx-auto">Connect with other 3D artists, share your work, and get feedback to improve your craft.</p>
        </div>

        <div className="grid gap-6">
          <CommunityPost 
            user="Alex3D" 
            content="Just finished my first custom shader for the Cyber-Core model! What do you guys think of the glow intensity?" 
            comments={12} 
            time="2h ago"
          />
          <CommunityPost 
            user="NekNek" 
            content="Looking for collaborators for a new sci-fi environment project. Need someone who is good with lighting!" 
            comments={45} 
            time="5h ago"
          />
          <CommunityPost 
            user="TexturePro" 
            content="Check out this new tutorial on optimizing PBR textures for real-time engines. Game changer for web performance." 
            comments={8} 
            time="1d ago"
          />
        </div>

        {/* Community Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat icon={<Users size={20} />} label="Members" value="12k+" />
          <Stat icon={<MessageSquare size={20} />} label="Daily Posts" value="450" />
          <Stat icon={<Award size={20} />} label="Challenges" value="8" />
          <Stat icon={<TrendingUp size={20} />} label="Growth" value="15%" />
        </div>
      </div>
    </div>
  );
}

function CommunityPost({ user, content, comments, time }: { user: string, content: string, comments: number, time: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="glass-card p-6 border-l-4 border-l-indigo-500 relative group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xl shadow-lg">
            {user[0]}
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg leading-none mb-1">@{user}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">{time}</p>
          </div>
        </div>
        
        <button className="p-3 bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 rounded-xl text-white/40 hover:text-indigo-400 transition-all duration-300">
          <MessageSquare size={20} />
        </button>
      </div>

      <p className="text-white/70 mb-6 leading-relaxed font-medium">{content}</p>
      
      <div className="flex items-center gap-6 text-xs text-white/30 pt-4 border-t border-white/5">
        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full"><MessageSquare size={14} className="text-indigo-400" /> {comments} comments</span>
        <span className="hover:text-indigo-400 cursor-pointer transition-colors font-bold uppercase tracking-wider">Join Discussion</span>
      </div>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="text-center p-6 glass-card border border-white/5 hover:border-indigo-500/20 transition-all">
      <div className="inline-flex p-3 bg-indigo-500/10 rounded-xl mb-3 text-indigo-400">
        {icon}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-[10px] uppercase text-white/20 tracking-widest font-bold">{label}</p>
    </div>
  );
}
