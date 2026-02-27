import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const [, setLocation] = useLocation();

    useEffect(() => {
        api.get(apiConfig.endpoints.auth.me)
            .then((res) => {
                if (res.data.role === "admin") setAllowed(true);
                else setLocation("/");
            })
            .catch(() => setLocation("/login"));
    }, []);

    if (allowed === null) return null;

    return <>{children}</>;
}