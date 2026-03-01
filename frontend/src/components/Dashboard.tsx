"use client";

import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    Activity, DollarSign, ShoppingCart, Clock, Search, Calendar, Filter,
    FileText, Headphones, Archive, Settings, ChevronRight, ChevronLeft, ChevronDown, Menu, X, ArrowUpRight, ArrowDownRight,
    MessageSquare, Target, Briefcase, LayoutDashboard, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Format Rupiah function
const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
};

const formatJutaan = (amount: number) => {
    const millions = amount / 1_000_000;
    return `Rp ${new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(millions)} Jt`;
};

const formatBillions = (amount: number) => {
    return `Rp ${(amount / 1_000_000_000).toFixed(2)}M`;
};

// Types
interface DashboardData {
    brand: string;
    availableBrands: string[];
    kpis: {
        currentRevenue: number;
        revenueGrowth: number;
        currentProfit: number;
        profitGrowth: number;
        totalTransactions: number;
        slaAvg: number;
    };
    financials: Array<{
        Bulan: string;
        "Pendapatan (IDR)": number;
        "Laba Bersih (IDR)": number;
    }>;
    regions: Array<{
        Wilayah: string;
        "Volume Penjualan": number;
    }>;
    transactions: Array<{
        Tanggal: string;
        "ID Transaksi": string;
        "Kategori Produk": string;
        "Nilai Transaksi": number;
        Status: string;
        SLA: number;
    }>;
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState("Semua Merek");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8000/api/dashboard?brand=${encodeURIComponent(selectedBrand)}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedBrand]);

    if (!data && loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FDFDFD] text-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Dummy data for sparklines if needed
    const dummySparkline = [
        { value: 100 }, { value: 120 }, { value: 110 }, { value: 140 }, { value: 130 }, { value: 160 }, { value: 150 }
    ];

    const revenueSparklineData = data?.financials.map(f => ({ value: f['Pendapatan (IDR)'] })) || [];
    const profitSparklineData = data?.financials.map(f => ({ value: f['Laba Bersih (IDR)'] })) || [];


    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex font-sans overflow-hidden relative">

            {/* Decorative Background Blur */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-400/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Sidebar Overview */}
            <aside className={cn(
                "bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col pt-6 pb-6 shrink-0 z-20 h-screen transition-all duration-300 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] shadow-purple-500/5",
                isSidebarOpen ? "w-64 px-4 translate-x-0" : "w-16 px-2 md:translate-x-0 -translate-x-full absolute md:relative"
            )}>
                <div className={cn("flex items-center mb-10 px-2", isSidebarOpen ? "justify-end" : "justify-center")}>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hidden md:block">
                        {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>

                <div className={cn("flex-1 overflow-y-auto hide-scrollbar overflow-x-hidden", !isSidebarOpen && "flex flex-col items-center")}>
                    <div className="mb-8">
                        {isSidebarOpen && <h3 className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Favorites</h3>}
                        <nav className="space-y-0.5">
                            <NavItem icon={<FileText className="w-4 h-4" />} label="Technical Docs" showLabel={isSidebarOpen} />
                            <NavItem icon={<FileText className="w-4 h-4" />} label="Campaign Guidelines" showLabel={isSidebarOpen} />
                            <NavItem icon={<FileText className="w-4 h-4" />} label="Important Rules" showLabel={isSidebarOpen} />
                            <NavItem icon={<FileText className="w-4 h-4" />} label="Onboarding" showLabel={isSidebarOpen} />
                        </nav>
                    </div>

                    <div>
                        {isSidebarOpen && <h3 className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Main Menu</h3>}
                        <nav className="space-y-0.5">
                            <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active showLabel={isSidebarOpen} />
                        </nav>
                    </div>
                </div>


            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen relative z-10 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-4 w-1/3">
                        <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="text-sm text-gray-500 font-medium">
                            Executive <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-1/3">
                        <div className="relative hidden md:block w-full max-w-md">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 w-full transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end w-1/3">
                        <div className="relative">
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="appearance-none bg-transparent hover:bg-white border border-transparent hover:border-gray-200 text-gray-900 text-sm font-semibold rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all"
                            >
                                {data?.availableBrands.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </header>

                <div className="px-8 py-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
                    {/* Hero Section */}
                    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-4 relative">
                        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-64 h-64 bg-orange-400/10 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <h1 className="text-2xl md:text-[32px] font-bold text-gray-900 tracking-tight mb-2">Total Pendapatan</h1>
                            <div className="text-5xl md:text-[64px] font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text leading-tight">
                                {data ? formatRupiah(data.kpis.currentRevenue) : "$0.00"}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10 shrink-0">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all shadow-sm">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                Select Dates
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all shadow-sm">
                                <Filter className="w-4 h-4 text-gray-500" />
                                Filter
                            </button>
                        </div>
                    </section>

                    {/* KPI Cards Strip */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SparklineCard
                            title="Laba Bersih"
                            value={data ? formatJutaan(data.kpis.currentProfit) : '0'}
                            trend={data?.kpis.profitGrowth}
                            chartData={profitSparklineData}
                            color="#8b5cf6" // purple
                            gradientId="colorPurple"
                        />
                        <SparklineCard
                            title="Total Transaksi"
                            value={data ? data.kpis.totalTransactions.toLocaleString('id-ID') : '0'}
                            trend={15}
                            chartData={dummySparkline}
                            color="#f97316" // orange
                            gradientId="colorOrange"
                        />
                        <SparklineCard
                            title="Rata-rata Waktu Proses (SLA)"
                            value={data ? `${data.kpis.slaAvg.toFixed(1)} Hari` : '0'}
                            trend={-0.2}
                            chartData={dummySparkline}
                            color="#0ea5e9" // blue
                            gradientId="colorBlue"
                            inverseTrend // negative is better for SLA
                        />
                    </section>


                    {/* Recent Transactions area */}
                    <section className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Transaksi Terkini</h2>
                            <button className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-purple-600 transition-colors">View all</button>
                        </div>

                        <div className="flex gap-6 border-b border-gray-200 mb-6 pb-2">
                            <div className="text-sm font-medium text-gray-900 px-1 border-b-2 border-gray-900 pb-2">Selesai <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 font-semibold">12</span></div>
                            <div className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 pb-2 cursor-pointer transition-colors">Diproses <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 font-semibold">5</span></div>
                            <div className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 pb-2 cursor-pointer transition-colors">Gagal <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 font-semibold">1</span></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Instead of a dense table, display transactions as beautiful cards based on the image style */}
                            {data?.transactions.slice(0, 6).map((trx, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                <ShoppingCart className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{trx['ID Transaksi']}</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-snug">{trx['Kategori Produk']}</h3>
                                        <p className="text-lg font-bold text-gray-900 mb-4">{formatRupiah(trx['Nilai Transaksi'])}</p>

                                        <div className="flex justify-between text-[11px] text-gray-500 mb-2 font-medium">
                                            <span>Tanggal: {trx.Tanggal}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    trx.Status === 'Selesai' ? "bg-green-500 w-full" : (trx.Status === 'Diproses' ? "bg-blue-500 w-1/2" : "bg-red-500 w-1/4")
                                                )}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                                        <span className="text-[11px] text-gray-400 font-medium tracking-wide">Status: {trx.Status}</span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-sm",
                                            trx.SLA <= 2 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                                        )}>SLA: {trx.SLA}hr</span>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-white/50 border border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/80 hover:border-gray-400 transition-all min-h-[220px]">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                    <span className="text-gray-500 font-semibold">+</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">Buat Laporan Baru</span>
                            </div>
                        </div>
                    </section>

                    {/* Additional Charts area mimicking a larger card */}
                    <section className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Tren Pendapatan & Laba Ritel</h3>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.financials || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="Bulan" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `Rp${(val / 1000000000).toFixed(0)}M`}
                                        dx={-10}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                        itemStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '13px' }}
                                        labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px', fontWeight: 500 }}
                                        formatter={(value: any) => [formatRupiah(Number(value) || 0), '']}
                                    />
                                    <Area type="monotone" name="Pendapatan" dataKey="Pendapatan (IDR)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" name="Laba Bersih" dataKey="Laba Bersih (IDR)" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}

// NavItem Component
function NavItem({ icon, label, active = false, showLabel = true }: { icon: React.ReactNode, label: string, active?: boolean, showLabel?: boolean }) {
    return (
        <a href="#" className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            active ? "bg-gray-100/80 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            !showLabel && "justify-center px-0 py-3"
        )}>
            <div className={cn("shrink-0", active ? "text-gray-900" : "text-gray-400")}>
                {icon}
            </div>
            {showLabel && <span className="truncate">{label}</span>}
        </a>
    );
}

// Sparkline KPI Component
function SparklineCard({ title, value, trend, chartData, color, gradientId, inverseTrend = false }: {
    title: string, value: string, trend?: number, chartData: any[], color: string, gradientId: string, inverseTrend?: boolean
}) {
    const isPositive = trend !== undefined && trend > 0;
    const isNegative = trend !== undefined && trend < 0;

    let useGreenForPositive = true;
    if (inverseTrend) useGreenForPositive = false; // For things like SLA, lower is better.

    let trendColorClass = "bg-gray-100 text-gray-600";
    let ArrowIcon = ArrowUpRight;

    if (trend !== undefined) {
        if ((isPositive && useGreenForPositive) || (isNegative && !useGreenForPositive)) {
            trendColorClass = "bg-green-100/80 text-green-700";
            ArrowIcon = isPositive ? ArrowUpRight : ArrowDownRight;
        } else if ((isNegative && useGreenForPositive) || (isPositive && !useGreenForPositive)) {
            trendColorClass = "bg-red-100/80 text-red-700";
            ArrowIcon = isPositive ? ArrowUpRight : ArrowDownRight;
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow relative overflow-hidden group">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">{title}</h3>

            <div className="flex justify-between items-end relative z-10">
                <div className="w-1/2">
                    <div className="flex items-center gap-2 mb-1 cursor-default">
                        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</span>
                        {trend !== undefined && (
                            <span className={cn("px-1.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-0.5 shadow-sm", trendColorClass)}>
                                <ArrowIcon className="w-3 h-3 stroke-[3]" />
                                {Math.abs(trend).toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">Bulan sebelumnya</p>
                </div>

                <div className="w-1/2 h-16 ml-2 -mr-4 -mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill={`url(#${gradientId})`}
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
