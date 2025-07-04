"use client";
import { ArrowLeft, ListChecks, Search, ChevronDown, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TransactionType = "All Types" | "Deposits" | "Withdrawals";
type TransactionStatus = "All Statuses" | "Pending" | "Approved" | "Rejected";

const typeFilters: readonly TransactionType[] = ["All Types", "Deposits", "Withdrawals"];

const statusFilters: readonly TransactionStatus[] = [
     "All Statuses",
     "Pending",
     "Approved",
     "Rejected",
];

export default function TransactionHistory() {
     const [searchValue, setSearchValue] = useState<string>("");
     const router = useRouter();
     const [typeFilter, setTypeFilter] = useState<TransactionType>("All Types");
     const [statusFilter, setStatusFilter] = useState<TransactionStatus>("All Statuses");
     const [showTypeDropdown, setShowTypeDropdown] = useState(false);
     const [showStatusDropdown, setShowStatusDropdown] = useState(false);

     const typeRef = useRef<HTMLDivElement>(null);
     const statusRef = useRef<HTMLDivElement>(null);

     const handleClickOutside = (event: MouseEvent) => {
          if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
               setShowTypeDropdown(false);
          }
          if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
               setShowStatusDropdown(false);
          }
     };

     useEffect(() => {
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
     }, []);

     return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
               <div className="max-w-5xl mx-auto">
                    <Link
                         className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-6 group"
                         href="/">
                         <ArrowLeft
                              className="mr-1 group-hover:-translate-x-1 transition-transform"
                              size={18}
                         />
                         Back to Trading
                    </Link>

                    <header className="mb-8 text-center md:text-left">
                         <div className="flex items-center justify-center md:justify-start mb-2">
                              <ListChecks className="h-10 w-10 text-purple-400 mr-3" />
                              <h1 className="text-4xl font-bold tracking-tight">
                                   Transaction History
                              </h1>
                         </div>
                         <p className="text-slate-400">
                              Review your past deposits and withdrawals.
                         </p>
                    </header>

                    {/* Search and Filters */}
                    <div className="rounded-lg border text-card-foreground bg-slate-800/50 backdrop-blur-md shadow-2xl border-slate-700 p-4 sm:p-6 mb-8">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                              {/* Search Input */}
                              <div className="relative sm:col-span-2">
                                   <label
                                        htmlFor="search-tx"
                                        className="block text-xs font-medium text-slate-400 mb-1">
                                        Search Transactions
                                   </label>
                                   <input
                                        id="search-tx"
                                        placeholder="ID, amount, wallet name..."
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
                                   />
                                   <Search className="absolute left-3 bottom-2.5 h-5 w-5 text-slate-400" />
                              </div>

                              {/* Filter Dropdowns */}
                              <div className="grid grid-cols-2 gap-2 sm:col-span-1">
                                   {/* Type Filter */}
                                   <div className="relative" ref={typeRef}>
                                        <label
                                             htmlFor="type-filter"
                                             className="block text-xs font-medium text-slate-400 mb-1">
                                             Type
                                        </label>
                                        <button
                                             id="type-filter"
                                             type="button"
                                             onClick={() => setShowTypeDropdown((prev) => !prev)}
                                             className="flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm bg-slate-700 border-slate-600 text-slate-200 focus:ring-2 focus:ring-purple-500">
                                             <span className="line-clamp-1">{typeFilter}</span>
                                             <ChevronDown className="h-4 w-4 opacity-50" />
                                        </button>
                                        {showTypeDropdown && (
                                             <ul className="absolute z-1500 mt-1 w-full rounded-md bg-slate-700 text-slate-100 border border-slate-600 shadow-lg">
                                                  {typeFilters.map((type) => (
                                                       <li
                                                            key={type}
                                                            onClick={() => {
                                                                 setTypeFilter(type);
                                                                 setShowTypeDropdown(false);
                                                            }}
                                                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-600 ${
                                                                 typeFilter === type
                                                                      ? "bg-slate-600"
                                                                      : ""
                                                            }`}>
                                                            {type}
                                                       </li>
                                                  ))}
                                             </ul>
                                        )}
                                   </div>

                                   {/* Status Filter */}
                                   <div className="relative" ref={statusRef}>
                                        <label
                                             htmlFor="status-filter"
                                             className="block text-xs font-medium text-slate-400 mb-1">
                                             Status
                                        </label>
                                        <button
                                             id="status-filter"
                                             type="button"
                                             onClick={() => setShowStatusDropdown((prev) => !prev)}
                                             className="flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm bg-slate-700 border-slate-600 text-slate-200 focus:ring-2 focus:ring-purple-500">
                                             <span className="line-clamp-1">{statusFilter}</span>
                                             <ChevronDown className="h-4 w-4 opacity-50" />
                                        </button>
                                        {showStatusDropdown && (
                                             <ul className="absolute z-10 mt-1 w-full rounded-md bg-slate-700 text-slate-100 border border-slate-600 shadow-lg">
                                                  {statusFilters.map((status) => (
                                                       <li
                                                            key={status}
                                                            onClick={() => {
                                                                 setStatusFilter(status);
                                                                 setShowStatusDropdown(false);
                                                            }}
                                                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-600 ${
                                                                 statusFilter === status
                                                                      ? "bg-slate-600"
                                                                      : ""
                                                            }`}>
                                                            {status}
                                                       </li>
                                                  ))}
                                             </ul>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Empty State */}
                    <div className="rounded-lg border text-card-foreground bg-slate-800/50 shadow-xl border-slate-700 text-center py-16">
                         <div className="p-6 pt-0 flex flex-col items-center">
                              <Info className="mx-auto h-16 w-16 text-slate-500 mb-6" />
                              <p className="text-slate-300 text-xl font-semibold">
                                   No Transactions Found
                              </p>
                              <p className="text-slate-400 mt-2">
                                   {"You haven't made any transactions yet."}
                              </p>
                              <div className="mt-6 space-x-4">
                                   <button onClick={() => router.push("/deposit-history")} className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-white h-10 px-4 py-2 bg-green-500 hover:bg-green-600">
                                        Make a Deposit
                                   </button>
                                   <button onClick={() => router.push("/withdraw-history")} className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-white h-10 px-4 py-2 bg-red-500 hover:bg-red-600">
                                        Request Withdrawal
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
