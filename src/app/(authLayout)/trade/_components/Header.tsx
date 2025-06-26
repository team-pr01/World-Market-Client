"use client";
import { Button } from "@/components/reusable/Button/Button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/signin");
  };
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
      <div className="flex items-center">
        <button className="mr-4 p-1">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="5" width="18" height="2" rx="1" fill="white" />
            <rect x="3" y="11" width="18" height="2" rx="1" fill="white" />
            <rect x="3" y="17" width="18" height="2" rx="1" fill="white" />
          </svg>
        </button>
        <div className="flex items-center mr-4">
          <span className="text-xl font-bold">World Market</span>
        </div>
        <span className="text-gray-400 text-sm">WEB TRADING PLATFORM</span>
      </div>
      <div className="flex items-center bg-green-500/20 rounded-full px-4 py-1.5">
        <span className="text-green-400 mr-2">🚀</span>
        <span className="text-sm">Get a 30% bonus on your first deposit</span>
        <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
          30%
        </span>
      </div>
      <div className="flex items-center">
        {/* <BalanceSwitcher className="mr-4" /> */}
        <Button
          className="bg-green-500 hover:bg-green-600 mr-2"
          onClick={() => router.push("/deposit-history")}
        >
          Deposit
        </Button>
        <Button
          variant="outline"
          className="border-gray-700 text-white hover:bg-gray-700 mr-2"
          onClick={() => router.push("/withdraw-history")}>
          Withdrawal
        </Button>
        <button
          onClick={handleLogout}
          className="text-red-500 p-1 hover:bg-gray-800 rounded-full"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
