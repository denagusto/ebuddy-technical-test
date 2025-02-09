"use client";

import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import { CssBaseline, Box, Paper, Container } from "@mui/material";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <html lang="en">
        <body>
        <Providers>
            <CssBaseline />
            <AuthGuard>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100vh",
                        backgroundColor: "#F4F6F8",
                        justifyContent: isLoginPage ? "center" : "flex-start",
                        alignItems: isLoginPage ? "center" : "normal"
                    }}
                >
                    {!isLoginPage && <Navbar />}

                    {isLoginPage ? (
                        children // ✅ Show login page directly, without a Container
                    ) : (
                        <Container maxWidth="lg"> {/* ✅ Wrap in a Container */}
                            <Paper elevation={3} sx={{ width: "100%", padding: 4, borderRadius: 2, marginTop: "5%" }}>
                                {children}
                            </Paper>
                        </Container>
                    )}
                </Box>
            </AuthGuard>
        </Providers>
        </body>
        </html>
    );
}
