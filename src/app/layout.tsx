import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "JEE NEET Pulse | Admin Panel",
    description: "Advanced management dashboard for courses and analytics",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
