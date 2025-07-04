"use client";
import { Button } from "@/components/reusable/Button/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Banner = () => {
     return (
          <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 text-center">
               <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6">
                    Ready to Start Trading?
               </h2>
               <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 lg:mb-8">
                    Join thousands of successful traders and start your journey today
               </p>
               <Link href="/signup">
                    <Button
                         size="lg"
                         className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                         Create Free Account
                         <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6" />
                    </Button>
               </Link>
          </div>
     );
};

export default Banner;
