"use client";
import { Button } from "@/components/reusable/Button/Button";
import { useResetPasswordMutation } from "@/redux/Features/Auth/authApi";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  // Globe,
  Lock,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  token: string;
  password: string;
  confirm_password: string;
};

const ResetPassword = () => {
  const error = false;
  const [resetPassword, {isLoading}] = useResetPasswordMutation();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string>("");

  const watchPassword = watch("password");
  const watchConfirmPassword = watch("confirm_password");

  const passwordStrength = React.useMemo(() => {
    // Simple strength calculation based on length
    const length = watchPassword?.length || 0;
    let strength = 0;
    let text = "Very weak";
    let color = "bg-red-400";

    if (length > 8) strength += 25;
    if (length > 10) strength += 25;
    if (/[A-Z]/.test(watchPassword || "")) strength += 25;
    if (/\d/.test(watchPassword || "")) strength += 25;

    if (strength >= 75) {
      text = "Strong";
      color = "bg-green-400";
    } else if (strength >= 50) {
      text = "Good";
      color = "bg-blue-400";
    } else if (strength >= 25) {
      text = "Weak";
      color = "bg-yellow-400";
    }

    return { strength, text, color };
  }, [watchPassword]);

  console.log(token);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        token,
      }
      const response = await resetPassword(payload).unwrap();
      console.log(response);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-lg">
              {/* Logo and Title */}
              <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 sm:mb-4 lg:mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 lg:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  Reset Your Password
                </h1>
              </div>

              {/* Registration Form */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 mb-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 sm:space-y-4 lg:space-y-6"
                >

                  {/* Password Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-xs sm:text-sm font-medium text-gray-200"
                    >
                      Password *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
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
                        className={`block w-full pl-8 sm:pl-10 pr-10 py-2 sm:py-3 lg:py-4 border rounded-lg sm:rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 text-sm sm:text-base border-white/20 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">Password is required</p>
                    )}

                    {/* Password Strength Indicator */}
                    {watchPassword && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Password strength</span>
                          <span
                            className={`font-medium ${
                              passwordStrength.strength >= 75
                                ? "text-green-400"
                                : passwordStrength.strength >= 50
                                ? "text-blue-400"
                                : passwordStrength.strength >= 25
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1 sm:space-y-2">
                    <label
                      htmlFor="confirm_password"
                      className="block text-xs sm:text-sm font-medium text-gray-200"
                    >
                      Confirm Password *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock
                          className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                            focusedField === "confirm_password"
                              ? "text-blue-400"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirm_password", {
                          required: true,
                          validate: (value) =>
                            value === watchPassword || "Passwords do not match",
                        })}
                        onFocus={() => setFocusedField("confirm_password")}
                        onBlur={() => setFocusedField("")}
                        className={`block w-full pl-8 sm:pl-10 pr-10 py-2 sm:py-3 lg:py-4 border rounded-lg sm:rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 text-sm sm:text-base border-white/20 ${
                          errors.confirm_password ? "border-red-500" : ""
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                      {watchConfirmPassword && watchPassword === watchConfirmPassword && (
                        <div className="absolute inset-y-0 right-8 sm:right-10 pr-3 flex items-center">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                        </div>
                      )}
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirm_password.message || "Confirm password is required"}
                      </p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl p-3 lg:p-4 text-red-400 text-xs sm:text-sm flex items-center gap-2 animate-shake">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base lg:text-lg cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Reset
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </form>

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

export default ResetPassword;
