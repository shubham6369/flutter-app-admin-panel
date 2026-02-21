"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
    TrendingUp,
    Users,
    BookOpen,
    CreditCard,
    ArrowUpRight,
    PlayCircle
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const data = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
    { name: 'Jul', sales: 3490, revenue: 4300 },
];

const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px' }}>
                {icon}
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
                    {trend}
                    <ArrowUpRight size={14} />
                </div>
            )}
        </div>
        <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 500 }}>{title}</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
    </div>
);

export default function Dashboard() {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard Overview</h1>
                        <p style={{ color: '#94a3b8' }}>Welcome back, Admin. Here's what's happening today.</p>
                    </div>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlayCircle size={18} />
                        Go Live
                    </button>
                </header>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <StatCard
                        title="Total Revenue"
                        value="₹4,25,000"
                        icon={<CreditCard size={20} color="var(--primary)" />}
                        trend="+12.5%"
                    />
                    <StatCard
                        title="Active Students"
                        value="1,240"
                        icon={<Users size={20} color="#8b5cf6" />}
                        trend="+8.2%"
                    />
                    <StatCard
                        title="Total Courses"
                        value="48"
                        icon={<BookOpen size={20} color="#f59e0b" />}
                    />
                    <StatCard
                        title="Avg. Watch Time"
                        value="42m"
                        icon={<TrendingUp size={20} color="#ec4899" />}
                        trend="+15%"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass" style={{ flex: 2, padding: '1.5rem', minHeight: '400px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Revenue Analytics</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass" style={{ flex: 1, padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Top Courses</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { title: 'JEE Physics Mastery', sales: 450, color: '#06b6d4' },
                                { title: 'NEET Bio Intensive', sales: 380, color: '#8b5cf6' },
                                { title: 'Organic Chemistry', sales: 290, color: '#f59e0b' },
                                { title: 'Maths Fundamentals', sales: 210, color: '#ec4899' },
                            ].map((course, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookOpen size={18} color={course.color} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{course.title}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{course.sales} sales this month</p>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>₹{(course.sales * 1499).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
