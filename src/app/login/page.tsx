"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at top right, #0f172a, #020617)",
            padding: "20px"
        }}>
            <div className="glass" style={{
                width: "100%",
                maxWidth: "400px",
                padding: "2.5rem",
                textAlign: "center"
            }}>
                <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "rgba(6, 182, 212, 0.1)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    color: "var(--primary)"
                }}>
                    <Lock size={30} />
                </div>

                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Admin Portal</h1>
                <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "0.875rem" }}>
                    Sign in to manage your education platform
                </p>

                {error && (
                    <div style={{
                        padding: "10px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", color: "#94a3b8" }}>Email Address</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: "40px" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem", color: "#94a3b8" }}>Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: "40px" }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
