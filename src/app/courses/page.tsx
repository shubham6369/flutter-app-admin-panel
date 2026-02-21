"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    FileText,
    Video
} from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const coursesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesData);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            await deleteDoc(doc(db, "courses", id));
            fetchCourses();
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Courses</h1>
                        <p style={{ color: '#94a3b8' }}>Manage your educational content and materials.</p>
                    </div>
                    <Link href="/courses/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} />
                        Add New Course
                    </Link>
                </header>

                <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                        <div style={{
                            flex: 1,
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
                                placeholder="Search courses..."
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
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: '#94a3b8', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>COURSE NAME</th>
                                <th style={{ padding: '1rem 1.5rem' }}>INSTRUCTOR</th>
                                <th style={{ padding: '1rem 1.5rem' }}>PRICE</th>
                                <th style={{ padding: '1rem 1.5rem' }}>CATEGORY</th>
                                <th style={{ padding: '1rem 1.5rem' }}>SALES</th>
                                <th style={{ padding: '1rem 1.5rem' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>Loading courses...</td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>No courses found.</td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={course.thumbnail || "https://via.placeholder.com/40"}
                                                    alt=""
                                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>{course.title}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                        {course.type === 'video' ? <Video size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> : <FileText size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />}
                                                        {course.type === 'video' ? 'Video Course' : 'PDF Course'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{course.instructor}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>₹{course.price}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                                                color: 'var(--primary)',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                {course.category || 'General'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{course.salesCount || 0}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button style={{ color: '#94a3b8' }}><Edit2 size={18} /></button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
