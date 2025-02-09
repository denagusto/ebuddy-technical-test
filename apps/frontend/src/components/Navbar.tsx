"use client";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        router.push("/login");
    };

    return (
        <AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "normal" }}>
                        EBUDDY (<b>Agus Riyanto</b>) Technical Test
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
