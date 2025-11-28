"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutGrid,
    BarChart2,
    Settings,
    HelpCircle,
    ChevronRight,
    Zap,
    LogOut
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
    brands: string[];
    selectedBrand: string;
    onSelectBrand: (brand: string) => void;
    currentPage?: string;
}

export function Sidebar({ brands, selectedBrand, onSelectBrand, currentPage }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[280px] h-screen fixed left-0 top-0 flex flex-col z-50 border-r border-white/[0.08] bg-[#08090A]/80 backdrop-blur-xl"
        >
            {/* Header */}
            <div className="p-6 mb-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Zap className="text-white w-4 h-4" fill="currentColor" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">AutoInsights</span>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Main Navigation */}
            <div className="px-3 space-y-1 mb-8">
                <NavItem 
                    icon={<LayoutGrid size={18} />} 
                    label="Overview" 
                    active={pathname === "/"}
                    onClick={() => router.push("/")}
                />
                <NavItem 
                    icon={<BarChart2 size={18} />} 
                    label="Insights" 
                    active={pathname === "/insights"}
                    onClick={() => router.push("/insights")}
                />
                <NavItem 
                    icon={<Settings size={18} />} 
                    label="Settings" 
                    active={pathname === "/settings"}
                    onClick={() => router.push("/settings")}
                />
            </div>

            {/* Brand Filters */}
            <div className="px-6 mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Brands</span>
                <span className="text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded text-gray-500">{brands.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 custom-scrollbar">
                {brands.map((brand) => (
                    <button
                        key={brand}
                        onClick={() => onSelectBrand(brand)}
                        className={clsx(
                            "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 group",
                            selectedBrand === brand
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
                        )}
                    >
                        <span>{brand}</span>
                        {selectedBrand === brand && (
                            <motion.div layoutId="activeBrand" className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08]">
                <button className="flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors text-sm w-full px-2 py-2 rounded-lg hover:bg-white/[0.03]">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.aside>
    );
}

function NavItem({ 
    icon, 
    label, 
    active, 
    onClick 
}: { 
    icon: React.ReactNode; 
    label: string; 
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                active
                    ? "bg-white/[0.06] text-white shadow-sm ring-1 ring-white/[0.05]"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.02]"
            )}
        >
            {icon}
            {label}
        </button>
    );
}
