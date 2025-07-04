/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ListFilter, Search, Info, RefreshCw } from "lucide-react";
import {
     Select,
     SelectTrigger,
     SelectValue,
     SelectContent,
     SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/reusable/Button/Button";
import { useGetAllSymbolsQuery, useGetTradeHistoryQuery } from "@/redux/Features/User/userApi";
import TradeCard from "./_components/TradeCard";
import { useRouter } from "next/navigation";
import { Trade } from "@/type/trade";

type Market = {
     _id: string;
     logo: string;
     pair: string;
     market_type: string;
     commission_percentage: number;
     start_market_price: number;
     min_market_price: number;
     max_market_price: number;
     status: string;
     createdAt: string; // or `Date` if you're handling it as a Date object
};

export default function TradesHistoryPage() {
     const router = useRouter();
     const { data, isLoading } = useGetTradeHistoryQuery(undefined);
     const { data: symbolRes } = useGetAllSymbolsQuery(undefined);
     const userTrades: Trade[] = data?.data || [];
     const availableMarkets: Market[] = symbolRes?.data || [];

     const [searchTerm, setSearchTerm] = useState("");
     const [statusFilter, setStatusFilter] = useState<any | "all">("all");
     const [modeFilter, setModeFilter] = useState<any | "all">("all");
     const [marketFilter, setMarketFilter] = useState<string>("all");


     // const availableMarkets: any[] = [1, 2, 3];
     const filteredTrades = userTrades.filter((trade) => {
          const term = searchTerm.trim().toLowerCase();

          // 1) if no searchTerm, match everything; otherwise compare lowercased strings
          const matchesSearchTerm = term === "" || trade._id.toLowerCase().includes(term);

          // 2) statusFilter “all” === wildcard
          const matchesStatusFilter = statusFilter === "all" || trade.status === statusFilter;

          // 3) account_type filter
          const matchesModeFilter = modeFilter === "all" || trade.account_type === modeFilter;

          // 4) market_type might be a number or string—compare as strings, support “all”
          const marketType = String(trade.pair.market_type).toLowerCase();
          const mf = marketFilter.toString().toLowerCase();
          const matchesMarketFilter = mf === "all" || marketType === mf;

          return (
               matchesSearchTerm && matchesStatusFilter && matchesModeFilter && matchesMarketFilter
          );
     });
     if (isLoading) {
          return (
               <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center justify-center p-4">
                    <RefreshCw size={48} className="animate-spin text-purple-400 mb-4" />
                    <p className="text-xl">Loading Trades History...</p>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
               <div className="max-w-6xl mx-auto">
                    <Link
                         href="/"
                         className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-6 group">
                         <ArrowLeft
                              size={18}
                              className="mr-1 group-hover:-translate-x-1 transition-transform"
                         />
                         Back to Trading
                    </Link>

                    <header className="mb-8 text-center md:text-left">
                         <div className="flex items-center justify-center md:justify-start mb-2">
                              <ListFilter className="h-10 w-10 text-purple-400 mr-3" />
                              <h1 className="text-4xl font-bold tracking-tight">Trades History</h1>
                         </div>
                         <p className="text-slate-400">Review your past trading activity.</p>
                    </header>

                    <Card className="bg-slate-800/50 backdrop-blur-md shadow-2xl border-slate-700 p-4 sm:p-6 mb-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                              <div className="relative lg:col-span-1">
                                   <label
                                        htmlFor="search-trade"
                                        className="block text-xs font-medium text-slate-400 mb-1">
                                        Search Trades
                                   </label>
                                   <Input
                                        id="search-trade"
                                        type="text"
                                        placeholder="trade Id"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
                                   />
                                   <Search className="absolute left-3 bottom-2.5 h-5 w-5 text-slate-400" />
                              </div>

                              <div>
                                   <label
                                        htmlFor="market-filter"
                                        className="block text-xs font-medium text-slate-400 mb-1">
                                        Market
                                   </label>
                                   <Select value={marketFilter} onValueChange={setMarketFilter}>
                                        <SelectTrigger
                                             id="market-filter"
                                             className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500">
                                             <SelectValue placeholder="Market" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-700 border-slate-600 text-slate-200 max-h-60">
                                             <SelectItem value="all" className="text-slate-400">
                                                  All Markets
                                             </SelectItem>
                                             {availableMarkets.map((market) => (
                                                  <SelectItem
                                                       key={market._id}
                                                       value={market.market_type}>
                                                       {market.market_type}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div>
                                   <label
                                        htmlFor="status-filter"
                                        className="block text-xs font-medium text-slate-400 mb-1">
                                        Status
                                   </label>
                                   <Select
                                        value={statusFilter}
                                        onValueChange={(value) => setStatusFilter(value as any)}>
                                        <SelectTrigger
                                             id="status-filter"
                                             className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500">
                                             <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                                             <SelectItem value="all">All Statuses</SelectItem>
                                             <SelectItem value="profit">Profit</SelectItem>
                                             <SelectItem value="loss">Loss</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div>
                                   <label
                                        htmlFor="mode-filter"
                                        className="block text-xs font-medium text-slate-400 mb-1">
                                        Mode
                                   </label>
                                   <Select
                                        value={modeFilter}
                                        onValueChange={(value) => setModeFilter(value as any)}>
                                        <SelectTrigger
                                             id="mode-filter"
                                             className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500">
                                             <SelectValue placeholder="Mode" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                                             <SelectItem value="all">All Modes</SelectItem>
                                             <SelectItem value="main">Live</SelectItem>
                                             <SelectItem value="demo">Demo</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                         </div>
                    </Card>

                    {filteredTrades.length === 0 ? (
                         <Card className="bg-slate-800/50 backdrop-blur-md shadow-xl border-slate-700 text-center py-16">
                              <CardContent className="flex flex-col items-center">
                                   <Info className="mx-auto h-16 w-16 text-slate-500 mb-6" />
                                   <p className="text-slate-300 text-xl font-semibold">
                                        No Trades Found
                                   </p>
                                   <p className="text-slate-400 mt-2">
                                        {userTrades.length > 0 &&
                                        (searchTerm ||
                                             statusFilter !== "all" ||
                                             modeFilter !== "all" ||
                                             marketFilter !== "all")
                                             ? "No trades match your current filters."
                                             : "You haven't made any completed trades yet."}
                                   </p>
                                   {userTrades.length === 0 && (
                                        <div className="mt-6">
                                             <Button
                                                  onClick={() => router.push("/trade")}
                                                  className="bg-purple-500 hover:bg-purple-600">
                                                  Start Trading
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredTrades.map((trade) => (
                                   <TradeCard key={trade._id} trade={trade} />
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
}
