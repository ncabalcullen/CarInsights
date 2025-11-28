"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import {
    Settings as SettingsIcon,
    Bell,
    Database,
    Download,
    RefreshCw,
    Save,
    Check,
    X,
} from "lucide-react";
import { clsx } from "clsx";

export default function SettingsPage() {
    const [data, setData] = useState<any[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string>("All");
    const [saved, setSaved] = useState(false);

    // Configuración del usuario
    const [settings, setSettings] = useState({
        autoRefresh: true,
        refreshInterval: 30, // minutos
        notifications: true,
        emailReports: false,
        defaultView: "overview",
        itemsPerPage: 50,
        currency: "ARS",
        language: "es-AR",
    });

    const handleSave = () => {
        // Guardar configuración en localStorage
        localStorage.setItem("dashboardSettings", JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleExportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "dashboard-settings.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (confirm("¿Estás seguro de que quieres resetear la configuración?")) {
            setSettings({
                autoRefresh: true,
                refreshInterval: 30,
                notifications: true,
                emailReports: false,
                defaultView: "overview",
                itemsPerPage: 50,
                currency: "ARS",
                language: "es-AR",
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#08090A] text-gray-100 font-sans selection:bg-indigo-500/30 flex">
            <Sidebar
                brands={brands}
                selectedBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
                currentPage="settings"
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
                            <span className="text-gray-300">Settings</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                            Configuration
                        </h2>
                        <p className="text-gray-400 max-w-xl">
                            Manage your dashboard preferences, data sources, and export settings.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportSettings}
                            className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2"
                        >
                            <Download size={16} />
                            <span>Export Config</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all flex items-center gap-2",
                                saved
                                    ? "bg-emerald-600 hover:bg-emerald-500"
                                    : "bg-indigo-600 hover:bg-indigo-500"
                            )}
                        >
                            {saved ? <Check size={16} /> : <Save size={16} />}
                            <span>{saved ? "Saved!" : "Save Changes"}</span>
                        </button>
                    </div>
                </motion.header>

                <div className="space-y-6">
                    <SettingsSection
                        title="Data Refresh"
                        icon={<RefreshCw size={20} />}
                        description="Configure how often data is updated"
                    >
                        <div className="space-y-4">
                            <SettingToggle
                                label="Auto Refresh"
                                description="Automatically refresh data at intervals"
                                checked={settings.autoRefresh}
                                onChange={(checked) =>
                                    setSettings({ ...settings, autoRefresh: checked })
                                }
                            />
                            {settings.autoRefresh && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Refresh Interval (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="1440"
                                        value={settings.refreshInterval}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                refreshInterval: parseInt(e.target.value) || 30,
                                            })
                                        }
                                        className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                                    />
                                </div>
                            )}
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Notifications"
                        icon={<Bell size={20} />}
                        description="Manage notification preferences"
                    >
                        <div className="space-y-4">
                            <SettingToggle
                                label="Enable Notifications"
                                description="Receive alerts for price changes and new listings"
                                checked={settings.notifications}
                                onChange={(checked) =>
                                    setSettings({ ...settings, notifications: checked })
                                }
                            />
                            <SettingToggle
                                label="Email Reports"
                                description="Send weekly reports via email"
                                checked={settings.emailReports}
                                onChange={(checked) =>
                                    setSettings({ ...settings, emailReports: checked })
                                }
                            />
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Display Preferences"
                        icon={<SettingsIcon size={20} />}
                        description="Customize your dashboard view"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Default View
                                </label>
                                <select
                                    value={settings.defaultView}
                                    onChange={(e) =>
                                        setSettings({ ...settings, defaultView: e.target.value })
                                    }
                                    className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                                >
                                    <option value="overview">Overview</option>
                                    <option value="insights">Insights</option>
                                    <option value="analytics">Analytics</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Items Per Page
                                </label>
                                <input
                                    type="number"
                                    min="10"
                                    max="200"
                                    value={settings.itemsPerPage}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            itemsPerPage: parseInt(e.target.value) || 50,
                                        })
                                    }
                                    className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Currency
                                </label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) =>
                                        setSettings({ ...settings, currency: e.target.value })
                                    }
                                    className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                                >
                                    <option value="ARS">ARS - Argentine Peso</option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        title="Data Management"
                        icon={<Database size={20} />}
                        description="Manage your data and storage"
                    >
                        <div className="space-y-4">
                            <button
                                onClick={handleReset}
                                className="w-full px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                <span>Reset to Defaults</span>
                            </button>
                        </div>
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
}

function SettingsSection({
    title,
    icon,
    description,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.05] text-indigo-400">{icon}</div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            {children}
        </motion.div>
    );
}

function SettingToggle({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={clsx(
                    "relative w-12 h-6 rounded-full transition-colors duration-200",
                    checked ? "bg-indigo-500" : "bg-white/[0.1]"
                )}
            >
                <div
                    className={clsx(
                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                        checked ? "translate-x-6" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
}

