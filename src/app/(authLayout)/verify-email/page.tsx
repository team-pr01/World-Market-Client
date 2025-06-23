"use client";
import { useVerifyEmailMutation } from "@/redux/Features/Auth/authApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const VerifyEmail = () => {
  const [verifyEmail, { isLoading, isSuccess }] = useVerifyEmailMutation();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const onSubmit = async () => {
      try {
        const payload = {
          token,
        };
        const response = await verifyEmail(payload).unwrap();
        console.log(response);
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    };
    onSubmit();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-4 sm:py-6 lg:py-8 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 mb-6">
                {isLoading ? (
                  <p className="text-white text-center">Please wait...</p>
                ) : isSuccess ? (
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
                    Email Is Verified
                  </h1>
                ) : (
                  <p className="text-white text-center">
                    Email verification failed, please try again.
                  </p>
                )}

                {/* Login Link */}
                <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base">
                    Back to{" "}
                    <Link
                      href="/signin"
                      className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-200"
                    >
                      Sign
                    </Link>
                  </p>
                </div>
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
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
