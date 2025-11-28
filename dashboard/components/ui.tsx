"use client";

import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function Button({
    children,
    onClick,
    active,
    className,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    className?: string;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                active
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/5",
                className
            )}
        >
            {children}
        </motion.button>
    );
}
