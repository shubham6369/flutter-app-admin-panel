"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
    Users,
    Search,
    TrendingUp,
    Calendar,
    Download,
    Filter
} from "lucide-react";

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        activeUsers: 0
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            // Mocking sales for now, in real app you'd fetch from an 'orders' collection
            const mockSales = [
                { id: '1', userName: 'Rahul Kumar', userEmail: 'rahul@gmail.com', courseTitle: 'JEE Physics Mastery', amount: 1499, date: '21 Feb 2026', status: 'Completed' },
                { id: '2', userName: 'Anjali Sharma', userEmail: 'anjali@outlook.com', courseTitle: 'NEET Bio Intensive', amount: 1999, date: '20 Feb 2026', status: 'Completed' },
                { id: '3', userName: 'Vikram Singh', userEmail: 'vikram@yahoo.com', courseTitle: 'Organic Chem Rapid', amount: 999, date: '19 Feb 2026', status: 'Completed' },
                { id: '4', userName: 'Suresh Raina', userEmail: 'suresh@gmail.com', courseTitle: 'Calculus Intensive', amount: 1499, date: '19 Feb 2026', status: 'Pending' },
                { id: '5', userName: 'Priya Verma', userEmail: 'priya@gmail.com', courseTitle: 'Foundation Class 10', amount: 2499, date: '18 Feb 2026', status: 'Completed' },
            ];
            setSales(mockSales);

            const revenue = mockSales.reduce((acc, curr) => acc + (curr.status === 'Completed' ? curr.amount : 0), 0);
            setStats({
                totalRevenue: revenue,
                totalOrders: mockSales.length,
                activeUsers: 1240
            });
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Sales & Analytics</h1>
                        <p style={{ color: '#94a3b8' }}>Monitor your revenue and user engagement.</p>
                    </div>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} />
                        Export CSV
                    </button>
                </header>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Revenue</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Orders</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalOrders}</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Students</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.activeUsers}</p>
                    </div>
                </div>

                <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                            width: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: 'var(--secondary)',
                            padding: '0 1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                        }}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search by student or email..."
                                style={{
                                    flex: 1,
                                    padding: '12px 0',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--secondary)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <Calendar size={18} />
                                Last 30 Days
                            </button>
                            <button style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--secondary)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <Filter size={18} />
                                Filters
                            </button>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: '#94a3b8', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>STUDENT</th>
                                <th style={{ padding: '1rem 1.5rem' }}>COURSE</th>
                                <th style={{ padding: '1rem 1.5rem' }}>AMOUNT</th>
                                <th style={{ padding: '1rem 1.5rem' }}>DATE</th>
                                <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale) => (
                                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{sale.userName}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sale.userEmail}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{sale.courseTitle}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>₹{sale.amount}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{sale.date}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            backgroundColor: sale.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: sale.status === 'Completed' ? 'var(--success)' : 'var(--accent)',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {sale.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
