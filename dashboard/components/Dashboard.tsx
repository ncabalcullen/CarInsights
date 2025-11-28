"use client";

import { useState, useEffect, useMemo } from "react";
import { PriceKmChart, VolumeChart, PriceYearChart } from "./Charts";
import { Sidebar } from "./Sidebar";
import { RefreshCw, TrendingUp, DollarSign, Car as CarIcon, ArrowUpRight, ArrowDownRight, Calendar, Filter, Download } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/export";

export default function Dashboard() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState<string>("All");
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [dataSource, setDataSource] = useState<"api" | "local" | "error">("api");
    const [showLocalDataWarning, setShowLocalDataWarning] = useState(false);
    const [limit, setLimit] = useState<number>(200);
    const [totalAvailable, setTotalAvailable] = useState<number>(0);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuOpen && !(event.target as Element).closest('.export-menu-container')) {
                setExportMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [exportMenuOpen]);

    const loadData = (useLocal = false, customLimit?: number) => {
        setLoading(true);
        const requestLimit = customLimit || limit;
        const url = useLocal 
            ? `/api/vehicles?limit=${requestLimit}&useLocal=true`
            : `/api/vehicles?limit=${requestLimit}`;
            
        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                setData(result.data || []);
                setTotalAvailable(result.paging?.total || result.data?.length || 0);
                setDataSource(result.source || "api");
                if (result.source === "local" || result.warning || result.info) {
                    setShowLocalDataWarning(true);
                    // Mostrar mensaje en consola si hay info sobre credenciales
                    if (result.info) {
                        console.info('💡', result.info);
                    }
                    if (result.warning) {
                        console.warn('⚠️', result.warning);
                    }
                } else {
                    setShowLocalDataWarning(false);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load data", err);
                // Fallback a datos locales si la API falla
                fetch("/data/vehicles.json")
                    .then((res) => res.json())
                    .then((data) => {
                        setData(data);
                        setDataSource("local");
                        setShowLocalDataWarning(true);
                        setLoading(false);
                    })
                    .catch(() => {
                        setDataSource("error");
                        setLoading(false);
                    });
            });
    };

    const brands = useMemo(() => {
        const uniqueBrands = new Set(data.map((item) => item.attributes?.brand).filter(Boolean));
        return ["All", ...Array.from(uniqueBrands).sort()];
    }, [data]);

    const filteredData = useMemo(() => {
        if (selectedBrand === "All") return data;
        return data.filter((item) => item.attributes?.brand === selectedBrand);
    }, [data, selectedBrand]);

    const stats = useMemo(() => {
        const total = filteredData.length;
        const prices = filteredData.map(item => item.price || 0).filter(p => p > 0);
        const kms = filteredData.map(item => item.attributes?.kilometers || 0).filter(k => k > 0);
        
        const avgPrice = prices.length > 0 
            ? prices.reduce((acc, curr) => acc + curr, 0) / prices.length 
            : 0;
        const avgKm = kms.length > 0
            ? kms.reduce((acc, curr) => acc + curr, 0) / kms.length
            : 0;
        
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        const minKm = kms.length > 0 ? Math.min(...kms) : 0;
        const maxKm = kms.length > 0 ? Math.max(...kms) : 0;
        const priceRange = maxPrice - minPrice;

        return { 
            total, 
            avgPrice, 
            avgKm, 
            minPrice, 
            maxPrice, 
            minKm, 
            maxKm,
            priceRange 
        };
    }, [filteredData]);

    const handleExport = (format: "csv" | "json" | "pdf") => {
        const exportData = {
            data: filteredData,
            stats,
            filters: {
                brand: selectedBrand !== "All" ? selectedBrand : undefined,
                dateRange: "Last 30 Days",
            },
        };

        switch (format) {
            case "csv":
                exportToCSV(exportData);
                break;
            case "json":
                exportToJSON(exportData);
                break;
            case "pdf":
                exportToPDF(exportData);
                break;
        }
        setExportMenuOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08090A] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm animate-pulse">Loading Market Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08090A] text-gray-100 font-sans selection:bg-indigo-500/30 flex">
            <Sidebar
                brands={brands}
                selectedBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
                currentPage="overview"
            />

            <main className="flex-1 ml-[280px] p-8 lg:p-12 overflow-y-auto h-screen">
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-10 flex items-end justify-between"
                >
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Dashboard</span>
                            <span className="text-gray-700">/</span>
                            <span className="text-gray-300">Overview</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                            {selectedBrand === "All" ? "Market Overview" : selectedBrand}
                        </h2>
                        <p className="text-gray-400 max-w-xl">
                            Real-time analysis of vehicle listings, pricing trends, and market volume distribution.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {showLocalDataWarning && (
                            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2 max-w-xs">
                                <span>⚠️</span>
                                <span className="truncate">Using local data - Configure API credentials for real-time data</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-400 whitespace-nowrap">Limit:</label>
                            <input
                                type="number"
                                min="50"
                                max="1000"
                                step="50"
                                value={limit}
                                onChange={(e) => {
                                    const newLimit = parseInt(e.target.value) || 200;
                                    setLimit(Math.min(1000, Math.max(50, newLimit)));
                                }}
                                onBlur={() => loadData(false, limit)}
                                className="w-20 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                            <span className="text-xs text-gray-500">({totalAvailable} available)</span>
                        </div>
                        <button 
                            onClick={() => loadData(false)}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={16} />
                            <span>Refresh</span>
                        </button>
                        <button 
                            onClick={() => loadData(true)}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2"
                            title="Use local data"
                        >
                            <span>📁</span>
                            <span>Local</span>
                        </button>
                        <div className="relative export-menu-container">
                            <button 
                                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
                            >
                                <Download size={16} />
                                <span>Export Report</span>
                            </button>
                            {exportMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0A0A0A] border border-white/[0.08] shadow-xl z-50 overflow-hidden">
                                    <button
                                        onClick={() => handleExport("csv")}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/[0.05] transition-colors flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Export as CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport("json")}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/[0.05] transition-colors flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Export as JSON
                                    </button>
                                    <button
                                        onClick={() => handleExport("pdf")}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/[0.05] transition-colors flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Export as HTML/PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Vehicles"
                        value={stats.total.toLocaleString()}
                        icon={<CarIcon size={20} />}
                        trend={`${totalAvailable > 0 ? Math.round((stats.total / totalAvailable) * 100) : 0}% of total`}
                        trendUp={true}
                        delay={0.1}
                    />
                    <StatCard
                        title="Avg. Market Price"
                        value={new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            maximumFractionDigits: 0,
                        }).format(stats.avgPrice)}
                        icon={<DollarSign size={20} />}
                        trend={stats.priceRange ? `Range: ${new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(stats.minPrice)} - ${new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(stats.maxPrice)}` : "+5.2%"}
                        trendUp={true}
                        delay={0.2}
                    />
                    <StatCard
                        title="Avg. Mileage"
                        value={`${Math.round(stats.avgKm).toLocaleString()} km`}
                        icon={<TrendingUp size={20} />}
                        trend={stats.avgKm > 0 ? `Min: ${Math.round(stats.minKm).toLocaleString()}km | Max: ${Math.round(stats.maxKm).toLocaleString()}km` : "-2.1%"}
                        trendUp={false}
                        delay={0.3}
                    />
                    <StatCard
                        title="Price per KM"
                        value={stats.avgKm > 0 && stats.avgPrice > 0 ? new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            maximumFractionDigits: 0,
                        }).format(stats.avgPrice / stats.avgKm) : "N/A"}
                        icon={<TrendingUp size={20} />}
                        trend={stats.avgKm > 0 && stats.avgPrice > 0 ? `ARS per kilometer` : "Insufficient data"}
                        trendUp={true}
                        delay={0.4}
                    />
                </div>

                {/* Additional Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <InsightCard
                        title="Market Distribution"
                        data={filteredData}
                        type="condition"
                    />
                    <InsightCard
                        title="Fuel Type Mix"
                        data={filteredData}
                        type="fuel"
                    />
                    <InsightCard
                        title="Transmission Types"
                        data={filteredData}
                        type="transmission"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <PriceKmChart data={filteredData} />
                    </div>
                    <VolumeChart data={filteredData} />
                    <PriceYearChart data={filteredData} />
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, trend, trendUp, delay }: any) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.4 }}
            className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.05] text-gray-400 group-hover:text-white group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-300">
                    {icon}
                </div>
                <div className={clsx(
                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                    trendUp
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                )}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{value}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{trend}</p>
            </div>
        </motion.div>
    );
}

function InsightCard({ title, data, type }: { title: string; data: any[]; type: "condition" | "fuel" | "transmission" }) {
    const distribution = useMemo(() => {
        const counts: Record<string, number> = {};
        
        data.forEach((item) => {
            let key = "Unknown";
            if (type === "condition") {
                key = item.condition || "Unknown";
            } else if (type === "fuel") {
                key = item.attributes?.fuelType || "Unknown";
            } else if (type === "transmission") {
                key = item.attributes?.transmission || "Unknown";
            }
            counts[key] = (counts[key] || 0) + 1;
        });

        const total = data.length;
        return Object.entries(counts)
            .map(([key, count]) => ({
                label: key,
                count,
                percentage: ((count / total) * 100).toFixed(1),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [data, type]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
            <h3 className="text-lg font-semibold text-white tracking-tight mb-4">{title}</h3>
            <div className="space-y-3">
                {distribution.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-300">{item.label}</span>
                            <span className="text-xs text-gray-500">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
