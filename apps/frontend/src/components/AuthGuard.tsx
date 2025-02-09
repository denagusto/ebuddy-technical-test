"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser } from "../store/userSlice";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.user.token);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!token && storedUser) {
            const userData = JSON.parse(storedUser);
            dispatch(setUser(userData));
        }

        if (!token && !storedUser && pathname !== "/login") {
            router.push("/login");
        }
    }, [token, pathname, router, dispatch]);

    return <>{children}</>;
}
