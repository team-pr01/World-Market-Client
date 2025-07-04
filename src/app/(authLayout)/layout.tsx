/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "sonner";
import { useCurrentUser } from "@/redux/Features/Auth/authSlice";

// Define the shape of JWT payload
interface JwtPayload {
  exp: number;
  [key: string]: any;
}

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const user = useSelector(useCurrentUser);
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // in seconds
        console.log("decoded.exp:", decoded.exp);

        if (decoded.exp < currentTime) {
          // Token expired
          Cookies.remove("accessToken");
          router.push("/signin");
        }
      } catch (err: any) {
        // Token is malformed or invalid
        Cookies.remove("accessToken");
        router.push("/signin");
      }
    } else {
      router.push("/signin"); // No token at all
    }
  }, [router]);

  return (
    <div>
      <Suspense
        fallback={
          <div className="text-white text-center py-10">Loading...</div>
        }
      >
        {children}
      </Suspense>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default AuthLayout;
