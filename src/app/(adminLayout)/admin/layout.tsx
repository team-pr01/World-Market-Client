"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/Features/Auth/authSlice";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector(useCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    }
  }, [user, router]);

  return <>{children}</>;
}
