"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    FileText,
    Video,
    Youtube,
    Image as ImageIcon,
    Upload,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddCourse() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingLectures, setUploadingLectures] = useState<Record<number, boolean>>({});
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [course, setCourse] = useState({
        title: "",
        instructor: "",
        price: "",
        description: "",
        category: "JEE",
        thumbnail: "",
        type: "video", // video or pdf
    });

    const [sections, setSections] = useState<any[]>([
        { id: Date.now(), title: "Introduction", lectures: [] }
    ]);

    const handleThumbnailUpload = async (file: File) => {
        if (!file) return;
        setUploadingThumbnail(true);
        try {
            const fileRef = ref(storage, `courses/thumbnails/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setCourse(prev => ({ ...prev, thumbnail: downloadURL }));
        } catch (error) {
            console.error("Thumbnail upload failed:", error);
            alert("Thumbnail upload failed.");
        } finally {
            setUploadingThumbnail(false);
        }
    };

    const handleFileUpload = async (sectionId: number, lectureId: number, file: File) => {
        if (!file) return;

        setUploadingLectures(prev => ({ ...prev, [lectureId]: true }));
        try {
            const fileRef = ref(storage, `courses/lectures/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setSections(sections.map(s => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        lectures: s.lectures.map((l: any) =>
                            l.id === lectureId ? { ...l, url: downloadURL } : l
                        )
                    };
                }
                return s;
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploadingLectures(prev => ({ ...prev, [lectureId]: false }));
        }
    };

    const addSection = () => {
        setSections([...sections, { id: Date.now(), title: "", lectures: [] }]);
    };

    const removeSection = (id: number) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const addLecture = (sectionId: number, type: "video" | "pdf" | "youtube") => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    lectures: [...s.lectures, { id: Date.now(), title: "", type, url: "" }]
                };
            }
            return s;
        }));
    };

    const updateLecture = (sectionId: number, lectureId: number, field: string, value: string) => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    lectures: s.lectures.map((l: any) => l.id === lectureId ? { ...l, [field]: value } : l)
                };
            }
            return s;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course.title || !course.price) {
            alert("Please fill in course title and price.");
            return;
        }
        setLoading(true);

        try {
            await addDoc(collection(db, "courses"), {
                ...course,
                price: Number(course.price),
                sections,
                createdAt: serverTimestamp(),
                salesCount: 0
            });
            router.push("/courses");
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Failed to add course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link href="/courses" style={{ color: '#94a3b8' }}><ArrowLeft /></Link>
                        <div>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Add New Course</h1>
                            <p style={{ color: '#94a3b8' }}>Fill in the details to create a new educational program.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Course"}
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Course Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Course Title</label>
                                    <input
                                        className="input-field"
                                        value={course.title}
                                        onChange={e => setCourse({ ...course, title: e.target.value })}
                                        placeholder="e.g. JEE Main 2026: Physics"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Instructor Name</label>
                                    <input
                                        className="input-field"
                                        value={course.instructor}
                                        onChange={e => setCourse({ ...course, instructor: e.target.value })}
                                        placeholder="e.g. Dr. Amit Singh"
                                    />
                                </div>
                            </div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                value={course.description}
                                onChange={e => setCourse({ ...course, description: e.target.value })}
                                placeholder="Briefly describe what students will learn..."
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Course Curriculum</h3>
                                <button onClick={addSection} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                    <Plus size={18} /> Add Section
                                </button>
                            </div>

                            {sections.map((section, sIndex) => (
                                <div key={section.id} style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>SECTION {sIndex + 1}</label>
                                            <input
                                                className="input-field"
                                                style={{ margin: 0 }}
                                                value={section.title}
                                                onChange={e => {
                                                    const newSections = [...sections];
                                                    newSections[sIndex].title = e.target.value;
                                                    setSections(newSections);
                                                }}
                                                placeholder="Section Title"
                                            />
                                        </div>
                                        <button onClick={() => removeSection(section.id)} style={{ color: 'var(--danger)', marginTop: '24px' }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {section.lectures.map((lecture: any, lIndex: number) => (
                                            <div key={lecture.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <input
                                                            className="input-field"
                                                            style={{ margin: 0, padding: '0.5rem', fontSize: '0.875rem' }}
                                                            value={lecture.title}
                                                            onChange={e => updateLecture(section.id, lecture.id, "title", e.target.value)}
                                                            placeholder="Lecture Title"
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                                                        {lecture.type === 'youtube' ? <Youtube size={18} /> : lecture.type === 'video' ? <Video size={18} /> : <FileText size={18} />}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <input
                                                            className="input-field"
                                                            style={{ margin: 0, padding: '0.5rem', fontSize: '0.875rem' }}
                                                            value={lecture.url}
                                                            onChange={e => updateLecture(section.id, lecture.id, "url", e.target.value)}
                                                            placeholder={lecture.type === 'youtube' ? "YouTube Link" : "Video/PDF URL"}
                                                        />
                                                    </div>
                                                    {(lecture.type === 'video' || lecture.type === 'pdf') && (
                                                        <label style={{
                                                            cursor: uploadingLectures[lecture.id] ? 'not-allowed' : 'pointer',
                                                            backgroundColor: 'rgba(6,182,212,0.1)',
                                                            color: 'var(--primary)',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.875rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            fontWeight: 600
                                                        }}>
                                                            {uploadingLectures[lecture.id] ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                                            {uploadingLectures[lecture.id] ? 'Uploading...' : 'Upload File'}
                                                            <input
                                                                type="file"
                                                                style={{ display: 'none' }}
                                                                accept={lecture.type === 'video' ? 'video/*' : 'application/pdf'}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleFileUpload(section.id, lecture.id, file);
                                                                }}
                                                                disabled={uploadingLectures[lecture.id]}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                            <button onClick={() => addLecture(section.id, 'video')} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                                                <Video size={14} /> + Video
                                            </button>
                                            <button onClick={() => addLecture(section.id, 'pdf')} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                                                <FileText size={14} /> + PDF
                                            </button>
                                            <button onClick={() => addLecture(section.id, 'youtube')} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                                                <Youtube size={14} /> + YouTube
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Pricing & Category</h3>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Price (₹)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={course.price}
                                onChange={e => setCourse({ ...course, price: e.target.value })}
                                placeholder="e.g. 1499"
                            />

                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                            <select
                                className="input-field"
                                value={course.category}
                                onChange={e => setCourse({ ...course, category: e.target.value })}
                            >
                                <option value="JEE">JEE Main</option>
                                <option value="Advanced">JEE Advanced</option>
                                <option value="NEET">NEET</option>
                                <option value="Foundation">Foundation</option>
                            </select>

                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Course Primary Content</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setCourse({ ...course, type: 'video' })}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: course.type === 'video' ? 'rgba(6,182,212,0.1)' : 'transparent',
                                        color: course.type === 'video' ? 'var(--primary)' : '#94a3b8',
                                        borderColor: course.type === 'video' ? 'var(--primary)' : 'var(--border)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <Video size={20} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Video</span>
                                </button>
                                <button
                                    onClick={() => setCourse({ ...course, type: 'pdf' })}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: course.type === 'pdf' ? 'rgba(6,182,212,0.1)' : 'transparent',
                                        color: course.type === 'pdf' ? 'var(--primary)' : '#94a3b8',
                                        borderColor: course.type === 'pdf' ? 'var(--primary)' : 'var(--border)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <FileText size={20} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>PDF</span>
                                </button>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Thumbnail</h3>
                                <label style={{
                                    cursor: uploadingThumbnail ? 'not-allowed' : 'pointer',
                                    color: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                }}>
                                    {uploadingThumbnail ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    {uploadingThumbnail ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleThumbnailUpload(file);
                                        }}
                                        disabled={uploadingThumbnail}
                                    />
                                </label>
                            </div>
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                backgroundColor: 'var(--secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed var(--border)',
                                marginBottom: '1rem',
                                overflow: 'hidden'
                            }}>
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#475569" style={{ marginBottom: '8px' }} />
                                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>Preview thumbnail</span>
                                    </>
                                )}
                            </div>
                            <input
                                className="input-field"
                                value={course.thumbnail}
                                onChange={e => setCourse({ ...course, thumbnail: e.target.value })}
                                placeholder="Thumbnail URL"
                            />
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Enter a direct image URL or upload to Firebase Storage.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
