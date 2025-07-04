"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useGetAdminProfileQuery } from "@/redux/Features/Admin/adminApi";

interface AdminLayoutProps {
     children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
     const router = useRouter();
     const pathname = usePathname();

     // Define public admin routes that don't require authentication
     const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

     const {
          data,
          isLoading: isLoadingAdminProfile,
     } = useGetAdminProfileQuery(undefined, {
          refetchOnMountOrArgChange: true,
          refetchOnFocus: true,
          refetchOnReconnect: true,
     });

     const adminProfile = data?.user;

     useEffect(() => {
          // Skip protection logic for public routes like login
          if (PUBLIC_ADMIN_ROUTES.includes(pathname)) return;

          if (!isLoadingAdminProfile && adminProfile?.role !== "admin") {
               console.warn("Unauthorized access. Redirecting...");
               router.replace("/");
          }
     }, [pathname,, isLoadingAdminProfile, adminProfile, router]);

     if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
          return <>{children}</>;
     }

     if (isLoadingAdminProfile) {
          return <div className="p-4 text-center">Loading...</div>;
     }

     if (adminProfile?.role === "admin") {
          return <>{children}</>;
     }

     return null;
}
