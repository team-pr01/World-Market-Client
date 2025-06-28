/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  WalletIcon,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/reusable/Button/Button";
import { cn } from "@/utils/utils";
import {
  useDeletePairMarketMutation,
  useGetAllSymbolsQuery,
} from "@/redux/Features/Admin/adminApi";
import AddPairWalletForm from "./_components/AddPairWalletForm";

export default function PairMarkets() {
  const { data, isLoading } = useGetAllSymbolsQuery({});
  const [deletePairMarket] = useDeletePairMarketMutation();
  const router = useRouter();
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("")

  const handleEditWallet = () => {
    setIsAddWalletOpen(true);
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      await deletePairMarket(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    // setIsEditing(false)
    // setEditingId(null)
  };

  const openAddWalletModal = () => {
    resetForm();
    setIsAddWalletOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => router.push("/admin")}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <WalletIcon className="w-6 h-6 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold text-white">
                Pair Market Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg p-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl text-white font-semibold">
            All Pair Wallets
          </h1>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <Button
              onClick={openAddWalletModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Pair
            </Button>
          </div>
        </div>

        {/* Wallets Grid with Pagination - This div should be scrollable */}
        <div className="flex-1 overflow-y-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {isLoading ? (
            <div className="text-slate-100 flex flex-col items-center justify-center p-4">
              <RefreshCw
                size={48}
                className="animate-spin text-purple-400 mb-4"
              />
              <p className="text-xl">Loading...</p>
            </div>
          ) : data?.data?.symbols?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {data?.data?.symbols?.map((wallet: any) => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    onEdit={handleEditWallet}
                    onDelete={() => handleDeleteWallet(wallet._id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 text-center">
              <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-400 mb-2">
                No Data Found
              </h2>
              <p className="text-gray-500 mb-6">
                Add pair market
              </p>
              <Button
                onClick={openAddWalletModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Pair Market
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Wallet Dialog */}
      <AddPairWalletForm
        open={isAddWalletOpen}
        onOpenChange={() => setIsAddWalletOpen(false)}
        setIsAddWalletOpen={setIsAddWalletOpen}
      />
    </div>
  );
}

// Wallet Card Component
function WalletCard({
  wallet,
  onEdit,
  onDelete,
}: {
  wallet: any;
  onEdit: (wallet: any) => void;
  onDelete: (id: number) => void;
}) {
  // Determine icon based on wallet type
  const getWalletTypeIcon = (type: any) => {
    switch (type) {
      case "Bangladesh Mobile Banking":
        return "🇧🇩";
      case "Cryptocurrency":
        return "₿";
      case "Bank Transfer":
        return "🏦";
      case "E-Wallet":
        return "💳";
      default:
        return "💱";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
      <div
        className={cn(
          "h-2 w-full",
          wallet.active
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : "bg-gradient-to-r from-red-500 to-orange-500"
        )}
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-700 border border-gray-600 flex items-center justify-center">
              {wallet.logo ? (
                <img
                  src={wallet.logo || "/placeholder.svg"}
                  alt={`${wallet.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl">
                  {getWalletTypeIcon(wallet.type)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-400">{wallet.symbol}</span>
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    wallet.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  )}
                >
                  {wallet.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            {/* <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(wallet)}
              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button> */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(wallet.id)}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            
            <span className="text-gray-300">Type: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.type}
            </span>
          </div>

          <div className="flex items-center text-sm">
            
            <span className="text-gray-300">Min Market Price: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.min_market_price}
            </span>
          </div>

          <div className="flex items-center text-sm">
            
            <span className="text-gray-300">Max Market Price: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.max_market_price}
            </span>
          </div>

          <div className="flex items-center text-sm">
            
            <span className="text-gray-300">Start Market Price: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.start_market_price}
            </span>
          </div>

          <div className="flex items-center text-sm">
            
            <span className="text-gray-300">Pair: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.pair}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 flex items-center justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(wallet)}
            className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
