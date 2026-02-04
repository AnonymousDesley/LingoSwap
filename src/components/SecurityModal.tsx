
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff, HelpCircle, X } from "lucide-react";
import { useState } from "react";

interface SecurityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (token: string) => void;
    isLoading: boolean;
    error?: string | null;
}

export function SecurityModal({ isOpen, onClose, onSubmit, isLoading, error }: SecurityModalProps) {
    const [token, setToken] = useState("");
    const [showToken, setShowToken] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-md p-6 rounded-2xl relative bg-[#0A192F]/80 border border-white/10 shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mb-4 text-cyan glow-cyan shadow-lg shadow-cyan/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Private Repository Access</h2>
                    <p className="text-sm text-white/60">
                        This repository appears to be private. Please provide a fine-grained Personal Access Token (PAT) to continue.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(token);
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                            GitHub Token
                            <div
                                className="relative cursor-pointer group"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <HelpCircle className="w-3 h-3 text-cyan" />
                                {showTooltip && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-navy border border-white/10 rounded-lg text-xs text-white/80 shadow-xl z-10"
                                    >
                                        Used client-side only for AST analysis. Checks file content and opens PRs. Never stored.
                                    </motion.div>
                                )}
                            </div>
                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                            <input
                                type={showToken ? "text" : "password"}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="github_pat_..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all font-mono text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowToken(!showToken)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                            >
                                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-xs text-left pl-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full bg-cyan hover:bg-cyan/90 text-white font-semibold py-3 rounded-lg shadow-lg shadow-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : "Authenticate Access"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
