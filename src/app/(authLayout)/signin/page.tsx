/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/reusable/Button/Button";
import { useSigninMutation } from "@/redux/Features/Auth/authApi";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  User,
  User2,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

const SignIn = () => {
  const success = false;
  const { register, handleSubmit } = useForm<{
    identifier: string;
    password: string;
  }>({
    mode: "onChange",
  });
  
  const [signin, {isLoading}] = useSigninMutation();

  const [showPassword, setShowPassword] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string>("");
  // const emailValue = watch("email");

  const onSubmit = async (data : any) => {
     try {
      const payload = {
        ...data,
      }
      const response = await signin(payload);
      if( response?.data?.success) {
        Cookies.set("accessToken", response?.data?.token, { expires: 7 });
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Logo and Title */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-4 lg:mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 lg:mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-base lg:text-lg">
              Sign in to your trading account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 lg:space-y-8"
            >
              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-3 lg:p-4 text-green-400 text-sm flex items-center gap-2 animate-pulse">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User2
                      className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === "email"
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    id="identifier"
                    type="identifier"
                    {...register("identifier", { required: true })}
                    onFocus={() => setFocusedField("identifier")}
                    onBlur={() => setFocusedField("")}
                    className="block w-full pl-10 pr-3 py-3 lg:py-4 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 text-base lg:text-lg"
                    placeholder="Enter your username"
                  />
                  {/* {emailValue && emailValue.includes("@") && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                  )} */}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className={`h-5 w-5 transition-colors duration-200 ${
                        focusedField === "password"
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className="block w-full pl-10 pr-10 py-3 lg:py-4 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 text-base lg:text-lg"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {false /* your error state here */ && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 lg:p-4 text-red-400 text-sm flex items-center gap-2 animate-shake">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {/* your error message */}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base lg:text-lg cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 lg:mt-8 text-center">
              <p className="text-gray-300 text-sm lg:text-base">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-200"
                >
                  Create one here
                </Link>
              </p>
            </div>

            {/* Additional Links */}
            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-gray-400 hover:text-gray-300 text-sm hover:underline transition-all duration-200"
              >
                Forgot your password?
              </Link>
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

export default SignIn;
