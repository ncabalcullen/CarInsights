"use client";

import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Car as CarIcon,
    BarChart3,
    PieChart,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { clsx } from "clsx";

interface Insight {
    title: string;
    value: string | number;
    change: number;
    trend: "up" | "down";
    icon: React.ReactNode;
    description: string;
}

export default function InsightsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState<string>("All");
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

    useEffect(() => {
        fetch("/api/vehicles?limit=100")
            .then((res) => res.json())
            .then((result) => {
                setData(result.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load data", err);
                setLoading(false);
            });
    }, []);

    const brands = useMemo(() => {
        const uniqueBrands = new Set(data.map((item) => item.attributes?.brand).filter(Boolean));
        return ["All", ...Array.from(uniqueBrands).sort()];
    }, [data]);

    const filteredData = useMemo(() => {
        if (selectedBrand === "All") return data;
        return data.filter((item) => item.attributes?.brand === selectedBrand);
    }, [data, selectedBrand]);

    const insights: Insight[] = useMemo(() => {
        if (filteredData.length === 0) return [];

        const prices = filteredData.map((item) => item.price).filter(Boolean);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const medianPrice = [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)];
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        const priceRange = maxPrice - minPrice;
        const priceVolatility = prices.length > 1
            ? prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / prices.length
            : 0;

        const brandsCount = filteredData.reduce((acc: Record<string, number>, item) => {
            const brand = item.attributes?.brand || "Unknown";
            acc[brand] = (acc[brand] || 0) + 1;
            return acc;
        }, {});

        const topBrand = Object.entries(brandsCount).sort((a, b) => b[1] - a[1])[0];
        const marketShare = topBrand ? ((topBrand[1] / filteredData.length) * 100).toFixed(1) : 0;

        return [
            {
                title: "Average Market Price",
                value: new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                }).format(avgPrice),
                change: 5.2,
                trend: "up",
                icon: <DollarSign size={20} />,
                description: "Average price across all listings",
            },
            {
                title: "Price Range",
                value: new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                }).format(priceRange),
                change: -2.1,
                trend: "down",
                icon: <BarChart3 size={20} />,
                description: "Difference between highest and lowest prices",
            },
            {
                title: "Market Leader",
                value: topBrand ? `${topBrand[0]} (${marketShare}%)` : "N/A",
                change: 0,
                trend: "up",
                icon: <CarIcon size={20} />,
                description: "Brand with highest market share",
            },
            {
                title: "Price Volatility",
                value: `${(Math.sqrt(priceVolatility) / avgPrice * 100).toFixed(1)}%`,
                change: -1.5,
                trend: "down",
                icon: <TrendingUp size={20} />,
                description: "Standard deviation of prices",
            },
        ];
    }, [filteredData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08090A] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm animate-pulse">Loading Insights...</p>
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
                currentPage="insights"
            />

            <main className="flex-1 ml-[280px] p-8 lg:p-12 overflow-y-auto h-screen">
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-10 flex items-end justify-between"
                >
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Dashboard</span>
                            <span className="text-gray-700">/</span>
                            <span className="text-gray-300">Insights</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                            Market Insights
                        </h2>
                        <p className="text-gray-400 max-w-xl">
                            Deep analysis of market trends, pricing patterns, and competitive intelligence.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                            <option value="all">All Time</option>
                        </select>
                        <button
                            onClick={() => {
                                setLoading(true);
                                fetch("/api/vehicles?limit=100")
                                    .then((res) => res.json())
                                    .then((result) => {
                                        setData(result.data || []);
                                        setLoading(false);
                                    });
                            }}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={16} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {insights.map((insight, index) => (
                        <InsightCard key={index} insight={insight} delay={index * 0.1} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TrendAnalysisCard data={filteredData} />
                    <BrandComparisonCard data={filteredData} />
                </div>
            </main>
        </div>
    );
}

function InsightCard({ insight, delay }: { insight: Insight; delay: number }) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.4 }}
            className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.05] text-gray-400 group-hover:text-white group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-300">
                    {insight.icon}
                </div>
                <div
                    className={clsx(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                        insight.trend === "up"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    )}
                >
                    {insight.trend === "up" ? (
                        <TrendingUp size={12} />
                    ) : (
                        <TrendingDown size={12} />
                    )}
                    {insight.change !== 0 && `${insight.change > 0 ? "+" : ""}${insight.change}%`}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{insight.title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{insight.value}</h3>
                <p className="text-xs text-gray-600">{insight.description}</p>
            </div>
        </motion.div>
    );
}

function TrendAnalysisCard({ data }: { data: any[] }) {
    const priceTrends = useMemo(() => {
        const byYear = data.reduce((acc: Record<number, number[]>, item) => {
            const year = item.attributes?.year;
            if (year) {
                if (!acc[year]) acc[year] = [];
                acc[year].push(item.price);
            }
            return acc;
        }, {});

        return Object.entries(byYear)
            .map(([year, prices]) => ({
                year: parseInt(year),
                avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            }))
            .sort((a, b) => a.year - b.year);
    }, [data]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
            <h3 className="text-lg font-semibold text-white tracking-tight mb-2">Price Trends by Year</h3>
            <p className="text-sm text-gray-500 mb-6">Average pricing evolution over model years</p>
            <div className="space-y-4">
                {priceTrends.slice(-5).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{trend.year}</span>
                        <div className="flex-1 mx-4 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                style={{
                                    width: `${(trend.avgPrice / Math.max(...priceTrends.map((t) => t.avgPrice))) * 100}%`,
                                }}
                            />
                        </div>
                        <span className="text-sm font-medium text-white">
                            {new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 0,
                            }).format(trend.avgPrice)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function BrandComparisonCard({ data }: { data: any[] }) {
    const brandStats = useMemo(() => {
        const stats = data.reduce((acc: Record<string, { count: number; totalPrice: number }>, item) => {
            const brand = item.attributes?.brand || "Unknown";
            if (!acc[brand]) {
                acc[brand] = { count: 0, totalPrice: 0 };
            }
            acc[brand].count++;
            acc[brand].totalPrice += item.price;
            return acc;
        }, {});

        return Object.entries(stats)
            .map(([brand, stat]) => ({
                brand,
                count: stat.count,
                avgPrice: stat.totalPrice / stat.count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [data]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
            <h3 className="text-lg font-semibold text-white tracking-tight mb-2">Top Brands</h3>
            <p className="text-sm text-gray-500 mb-6">Market share and average pricing</p>
            <div className="space-y-4">
                {brandStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white">{stat.brand}</span>
                                <span className="text-xs text-gray-500">{stat.count} listings</span>
                            </div>
                            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    style={{
                                        width: `${(stat.count / Math.max(...brandStats.map((s) => s.count))) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="ml-4 text-right">
                            <p className="text-sm font-medium text-white">
                                {new Intl.NumberFormat("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                    maximumFractionDigits: 0,
                                }).format(stat.avgPrice)}
                            </p>
                            <p className="text-xs text-gray-500">avg. price</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

