"use client";

import { ReactNode, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import { useCurrentUser } from "@/redux/Features/Auth/authSlice";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const user = useSelector(useCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  return (
    <div>
      <Suspense fallback={<div className="text-white text-center py-10">Loading...</div>}>
        {children}
      </Suspense>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default AuthLayout;
