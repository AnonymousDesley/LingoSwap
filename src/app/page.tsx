"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkRepoAccess } from "@/lib/github";
import { SecurityModal } from "@/components/SecurityModal";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const router = useRouter();

  const handleStart = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setModalError(null);

    // Deep Scan: Check anonymous access first
    const result = await checkRepoAccess(url);

    setIsLoading(false);

    if (result.valid) {
      console.log("Public repo found:", result.data?.full_name);
      router.push(`/dashboard?repo=${encodeURIComponent(url)}`);
    } else if (result.needsToken) {
      console.log("Repo private or not found, requesting token...");
      setIsModalOpen(true);
    } else {
      // General error (invalid URL format etc)
      alert(`Error: ${result.error}`);
    }
  };

  const handleTokenSubmit = async (token: string) => {
    setModalError(null);
    setIsLoading(true);

    // Verify with token
    const result = await checkRepoAccess(url, token);

    setIsLoading(false);

    if (result.valid) {
      console.log("Private repo authorized:", result.data?.full_name);
      setIsModalOpen(false);
      // In a real app, pass token securely (context/session). 
      // For demo, we just flag it.
      router.push(`/dashboard?repo=${encodeURIComponent(url)}&auth=true`);
    } else {
      setModalError("Invalid token or repository still inaccessible.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center p-4">
      {/* Ambient Glows */}
      <div className="ambient-glow top-[-10%] left-[-10%] opacity-40 mix-blend-screen" />
      <div className="ambient-glow bottom-[-10%] right-[-10%] opacity-40 mix-blend-screen bg-navy" style={{ background: 'radial-gradient(circle, rgba(30, 58, 138, 0.2) 0%, transparent 70%)' }} />

      <AnimatePresence>
        {isModalOpen && (
          <SecurityModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleTokenSubmit}
            isLoading={isLoading}
            error={modalError}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 max-w-2xl w-full"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          LingoSwap
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-lg mx-auto">
          Automate your transition from legacy i18n to the
          <span className="text-cyan font-semibold block mt-1">Lingo.dev Compiler</span>
        </p>

        {/* Glass Card */}
        <div className="glass-panel p-1 rounded-2xl shadow-2xl backdrop-blur-3xl">
          <form onSubmit={handleStart} className="flex flex-col md:flex-row gap-2 p-2 bg-black/20 rounded-xl">
            <div className="relative flex-1">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 pl-12 pr-4 py-4 rounded-lg focus:ring-0"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(6, 182, 212, 0.9)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-cyan text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 shadow-lg glow-cyan"
            >
              Start Migration <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        </div>

        {/* Stats / trust badges could go here */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-8 text-white/30 text-sm font-medium"
        >
          <span className="flex items-center gap-2"><Wand2 className="w-4 h-4" /> AI-Powered AST Analysis</span>
          <span className="flex items-center gap-2"><Github className="w-4 h-4" /> Secure Integration</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
