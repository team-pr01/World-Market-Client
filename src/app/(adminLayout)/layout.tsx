/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// JWT payload shape
interface JwtPayload {
  exp: number;
  role?: string;
  [key: string]: any;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // in seconds
        // Check if role is not admin or not
        if (decoded.role !== "admin") {
          router.push("/admin/login");
          return;
        }

        // Check if token is expired
        if (decoded.exp < currentTime) {
          Cookies.remove("accessToken");
          router.push("/admin/login");
          return;
        }

      } catch (err: any) {
        // Token is malformed or invalid
        Cookies.remove("accessToken");
        router.push("/admin/login");
      }
    } else {
      router.push("/admin/login"); // No token at all
    }
  }, [router]);

  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading...</div>}>
      {children}
    </Suspense>
  );
}
