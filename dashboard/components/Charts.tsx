"use client";

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
} from "recharts";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short"
    }).format(value);
};

const formatKm = (value: number) => {
    return `${(value / 1000).toFixed(0)}k`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0A0A0A]/95 border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-xl">
                <p className="text-xs font-medium text-gray-400 mb-1">{label || payload[0].payload.name || payload[0].payload.title}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm font-semibold text-white font-mono">
                            {entry.name === "Price" || entry.name === "avgPrice"
                                ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(entry.value)
                                : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

function ChartCard({ title, subtitle, children, className }: { title: string; subtitle: string; children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={clsx("p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]", className)}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="h-[350px] w-full">
                {children}
            </div>
        </motion.div>
    );
}

export function PriceKmChart({ data }: { data: any[] }) {
    const chartData = data
        .filter((item) => item.price && item.attributes?.kilometers)
        .map((item) => ({
            price: item.price,
            kilometers: item.attributes.kilometers,
        }));

    return (
        <ChartCard title="Price vs. Mileage Distribution" subtitle="Correlation analysis between vehicle price and odometer reading">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis
                        type="number"
                        dataKey="kilometers"
                        name="Kilometers"
                        unit="km"
                        stroke="#525252"
                        tickFormatter={formatKm}
                        tick={{ fill: '#737373', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        type="number"
                        dataKey="price"
                        name="Price"
                        unit="$"
                        stroke="#525252"
                        tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
                        tick={{ fill: '#737373', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "#ffffff10" }} />
                    <Scatter name="Vehicle" data={chartData} fill="#818cf8" fillOpacity={0.5} stroke="transparent" />
                </ScatterChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function VolumeChart({ data }: { data: any[] }) {
    const brandCounts = data.reduce((acc: any, curr: any) => {
        const brand = curr.attributes?.brand || "Unknown";
        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a: any, b: any) => b.count - a.count);

    return (
        <ChartCard title="Market Share" subtitle="Volume distribution by manufacturer">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#525252"
                        tick={{ fill: '#737373', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#525252"
                        tick={{ fill: '#737373', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip cursor={{ fill: "#ffffff03" }} content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function PriceYearChart({ data }: { data: any[] }) {
    const yearStats = data.reduce((acc: any, curr: any) => {
        const year = curr.attributes?.year;
        if (year && curr.price) {
            if (!acc[year]) acc[year] = { total: 0, count: 0 };
            acc[year].total += curr.price;
            acc[year].count += 1;
        }
        return acc;
    }, {});

    const chartData = Object.entries(yearStats)
        .map(([year, stats]: [string, any]) => ({
            year: parseInt(year),
            avgPrice: stats.total / stats.count,
        }))
        .sort((a, b) => a.year - b.year);

    return (
        <ChartCard title="Depreciation Curve" subtitle="Average market value by model year">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis
                        dataKey="year"
                        stroke="#525252"
                        tick={{ fill: '#737373', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#525252"
                        tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
                        tick={{ fill: '#737373', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="avgPrice"
                        stroke="#c084fc"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#c084fc", strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
