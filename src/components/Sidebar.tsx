"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    BookOpen,
    Video,
    Users,
    Settings,
    LogOut,
    PlayCircle
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => (
    <Link
        href={href}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '4px',
            backgroundColor: active ? 'var(--primary)' : 'transparent',
            color: active ? 'white' : '#94a3b8',
            transition: 'all 0.2s',
        }}
    >
        {icon}
        <span style={{ fontWeight: 500 }}>{label}</span>
    </Link>
);

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--secondary)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--border)',
            zIndex: 100,
        }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <PlayCircle size={20} color="white" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Pulse Admin
                </h2>
            </div>

            <nav style={{ flex: 1 }}>
                <SidebarItem
                    href="/"
                    icon={<BarChart3 size={20} />}
                    label="Dashboard"
                    active={pathname === "/"}
                />
                <SidebarItem
                    href="/courses"
                    icon={<BookOpen size={20} />}
                    label="Manage Courses"
                    active={pathname === "/courses"}
                />
                <SidebarItem
                    href="/live"
                    icon={<Video size={20} />}
                    label="Live Classes"
                    active={pathname === "/live"}
                />
                <SidebarItem
                    href="/sales"
                    icon={<Users size={20} />}
                    label="Sales & Users"
                    active={pathname === "/sales"}
                />
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <SidebarItem
                    href="/settings"
                    icon={<Settings size={20} />}
                    label="Settings"
                    active={pathname === "/settings"}
                />
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        color: '#ef4444',
                        marginTop: '8px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={20} />
                    <span style={{ fontWeight: 500 }}>Logout</span>
                </button>
            </div>
        </aside>
    );
}
