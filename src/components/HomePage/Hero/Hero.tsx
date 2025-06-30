"use client"
import { Button } from "@/components/reusable/Button/Button";
import { useCurrentUser } from "@/redux/Features/Auth/authSlice";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

const Hero = () => {
  const user = useSelector(useCurrentUser);
    return (
       <div className="text-center max-w-5xl mx-auto mb-12 lg:mb-20">
            <div className="mb-4 lg:mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm lg:text-base border border-white/20">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-gray-300">Trusted by 50,000+ traders worldwide</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Trade Binary Options
              </span>
              <br />
              <span className="text-white">with Confidence</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Join thousands of traders on our advanced platform. Start with as little as{" "}
              <span className="text-green-400 font-semibold">$1</span> and earn up to{" "}
              <span className="text-blue-400 font-semibold">95% profit</span> on successful trades.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center mb-12 sm:mb-16 lg:mb-24 px-4">
              <Link href="/trade" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </Button>
              </Link>
              {
                !user && <Link href="/signin" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white bg-white/10 backdrop-blur-sm text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl w-full sm:w-auto"
                >
                  I Have an Account
                </Button>
              </Link>
              }
            </div>
          </div>
    );
};

export default Hero;