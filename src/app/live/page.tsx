"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import {
    Play,
    Calendar,
    Clock,
    Plus,
    Youtube,
    Monitor,
    Video,
    ExternalLink
} from "lucide-react";

export default function LiveClassesPage() {
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newClass, setNewClass] = useState({
        title: "",
        instructor: "",
        startTime: "",
        youtubeUrl: "",
        description: "",
    });

    useEffect(() => {
        fetchLiveClasses();
    }, []);

    const fetchLiveClasses = async () => {
        try {
            const q = query(collection(db, "live_classes"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLiveClasses(data);
        } catch (error) {
            console.error("Error fetching live classes:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "live_classes"), {
                ...newClass,
                isLive: false,
                createdAt: serverTimestamp()
            });
            setShowAddForm(false);
            fetchLiveClasses();
            setNewClass({ title: "", instructor: "", startTime: "", youtubeUrl: "", description: "" });
        } catch (error) {
            console.error("Error adding live class:", error);
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Live Classes</h1>
                        <p style={{ color: '#94a3b8' }}>Schedule and manage your live video lectures.</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} />
                        Schedule Class
                    </button>
                </header>

                {showAddForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div className="glass" style={{ width: '500px', padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Schedule Live Class</h3>
                            <form onSubmit={handleSubmit}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Class Title</label>
                                <input
                                    className="input-field"
                                    required
                                    value={newClass.title}
                                    onChange={e => setNewClass({ ...newClass, title: e.target.value })}
                                    placeholder="e.g. Physics: Atomic Structure"
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Instructor</label>
                                        <input
                                            className="input-field"
                                            required
                                            value={newClass.instructor}
                                            onChange={e => setNewClass({ ...newClass, instructor: e.target.value })}
                                            placeholder="e.g. Prof. Verma"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Start Time</label>
                                        <input
                                            type="datetime-local"
                                            className="input-field"
                                            required
                                            value={newClass.startTime}
                                            onChange={e => setNewClass({ ...newClass, startTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>YouTube URL / Stream Key</label>
                                <input
                                    className="input-field"
                                    required
                                    value={newClass.youtubeUrl}
                                    onChange={e => setNewClass({ ...newClass, youtubeUrl: e.target.value })}
                                    placeholder="https://youtube.com/live/..."
                                />

                                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', color: 'white' }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Schedule Now</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {liveClasses.length === 0 ? (
                        <div className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1' }}>
                            <Monitor size={48} color="#334155" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: '#94a3b8' }}>No live classes scheduled yet.</p>
                        </div>
                    ) : (
                        liveClasses.map((item) => (
                            <div key={item.id} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    backgroundColor: 'var(--secondary)',
                                    borderRadius: '12px',
                                    marginBottom: '1rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Youtube size={48} color="rgba(255,255,255,0.2)" />
                                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                        <span style={{
                                            backgroundColor: item.isLive ? 'var(--danger)' : 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {item.isLive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white', animation: 'pulse 1.5s infinite' }}></div>}
                                            {item.isLive ? 'LIVE NOW' : 'SCHEDULED'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>with {item.instructor}</p>

                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.875rem' }}>
                                            <Calendar size={16} />
                                            {new Date(item.startTime).toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.875rem' }}>
                                            <Clock size={16} />
                                            {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Play size={16} />
                                        {item.isLive ? 'End Session' : 'Start Stream'}
                                    </button>
                                    <a
                                        href={item.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <ExternalLink size={18} color="#94a3b8" />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
            <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
