"use client";

import { useVerifyEmailMutation } from "@/redux/Features/Auth/authApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const VerifyEmail = () => {
  const [verifyEmail, { isLoading, isSuccess, isError }] = useVerifyEmailMutation();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      try {
        await verifyEmail({ token }).unwrap();
      } catch (error) {
        console.error("Verification failed:", error);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              {isLoading && (
                <p className="text-white text-center">Verifying your email...</p>
              )}
              {isSuccess && (
                <h1 className="text-3xl font-bold text-white text-center">Email Verified!</h1>
              )}
              {isError && (
                <p className="text-white text-center">
                  Email verification failed. Please try again.
                </p>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Back to{" "}
                  <Link
                    href="/signin"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
