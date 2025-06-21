"use client"
import { Button } from "@/components/reusable/Button/Button";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
    return (
        <header className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                World Market
              </span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link
               href="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white bg-white/10 backdrop-blur-sm text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-6 py-1 sm:py-2"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-6 py-1 sm:py-2"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
};

export default Navbar;