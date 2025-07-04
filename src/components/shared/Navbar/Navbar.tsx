/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/reusable/Button/Button";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../assets/logo.png";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/Features/Auth/authSlice";

const Navbar = () => {
  const user = useSelector(useCurrentUser) as any;
  return (
    <header className="relative z-10 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <Image src={logo} alt="" className="w-44 sm:w-56 md:w-72" />
          {!user ? (
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white bg-white/10 backdrop-blur-sm text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-6 py-1 sm:py-2 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm lg:text-base cursor-pointer px-2 sm:px-3 lg:px-6 py-1 sm:py-2"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/trade">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm lg:text-base cursor-pointer px-2 sm:px-3 lg:px-6 py-1 sm:py-2"
              >
                Trade Now
              </Button>
            </Link>
            <Link href="/account">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm lg:text-base cursor-pointer px-2 sm:px-3 lg:px-6 py-1 sm:py-2"
              >
                Account
              </Button>
            </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
