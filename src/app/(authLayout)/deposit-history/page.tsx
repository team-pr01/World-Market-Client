"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent} from "@/components/ui/card";;
import { Input } from "@/components/ui/input";
import {
     ArrowLeft,
     ListChecks,
     Search,
     Info,
     RefreshCw,
} from "lucide-react";
import {
     Select,
     SelectTrigger,
     SelectValue,
     SelectContent,
     SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/reusable/Button/Button";
import { useGetAllDepositsQuery } from "@/redux/Features/User/userApi";
import MakeDepositForm from "./_components/MakeDepositForm";
import TransactionCard from "./_components/TrasctionCard";

export default function DepositHistoryPage() {
     const [isDepositFormOpen, setIsDepositFormOpen] = useState(false);
     const [statusFilter, setStatusFilter] = useState<string>("all");
     const [searchTerm, setSearchTerm] = useState("");
     const { data, isLoading } = useGetAllDepositsQuery({
          search: searchTerm,
          status: statusFilter,
     });

     const deposits = data?.data?.deposits;

     console.log("deposits:", deposits);

     if (isLoading) {
          return (
               <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center justify-center p-4">
                    <RefreshCw size={48} className="animate-spin text-purple-400 mb-4" />
                    <p className="text-xl">Loading Transaction History...</p>
               </div>
          );
     }



     return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
               <div className="max-w-5xl mx-auto">
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
                              <ListChecks className="h-10 w-10 text-purple-400 mr-3" />
                              <h1 className="text-4xl font-bold tracking-tight">Deposit History</h1>
                         </div>
                         <p className="text-slate-400">Review your past deposits.</p>
                    </header>

                    <Card className="bg-slate-800/50 backdrop-blur-md shadow-2xl border-slate-700 p-4 sm:p-6 mb-8">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                              <div className="relative sm:col-span-2">
                                   <label
                                        htmlFor="search-tx"
                                        className="block text-xs font-medium text-slate-400 mb-1">
                                        Search Transactions
                                   </label>
                                   <Input
                                        id="search-tx"
                                        type="text"
                                        placeholder="ID, amount, wallet name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
                                   />
                                   <Search className="absolute left-3 bottom-2.5 h-5 w-5 text-slate-400" />
                              </div>

                              <div className="flex flex-col md:flex-row items-center gap-2">
                                   <div>
                                        <label
                                             htmlFor="status-filter"
                                             className="block text-xs font-medium text-slate-400 mb-1">
                                             Status
                                        </label>
                                        <Select
                                             value={statusFilter}
                                             onValueChange={setStatusFilter}>
                                             <SelectTrigger
                                                  id="status-filter"
                                                  className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500">
                                                  <SelectValue placeholder="Status" />
                                             </SelectTrigger>
                                             <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                                                  <SelectItem value="all">All Statuses</SelectItem>
                                                  <SelectItem value="pending">Pending</SelectItem>
                                                  <SelectItem value="approved">Approved</SelectItem>
                                                  <SelectItem value="rejected">Rejected</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                                   <Button
                                        onClick={() => setIsDepositFormOpen(true)}
                                        className="bg-green-500 hover:bg-green-600 mt-5">
                                        Make a Deposit
                                   </Button>
                              </div>
                         </div>
                    </Card>

                    {deposits?.length === 0 ? (
                         <Card className="bg-slate-800/50 backdrop-blur-md shadow-xl border-slate-700 text-center py-16">
                              <CardContent className="flex flex-col items-center">
                                   <Info className="mx-auto h-16 w-16 text-slate-500 mb-6" />
                                   <p className="text-slate-300 text-xl font-semibold">
                                        No Deposits Found
                                   </p>
                                   <p className="text-slate-400 mt-2">
                                        {deposits > 0 && (searchTerm || statusFilter !== "all")
                                             ? "No transactions match your current filters."
                                             : "You haven't made any transactions yet."}
                                   </p>
                                   {deposits?.length === 0 && (
                                        <div className="mt-6 space-x-4">
                                             <Button
                                                  onClick={() => setIsDepositFormOpen(true)}
                                                  className="bg-green-500 hover:bg-green-600">
                                                  Make a Deposit
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {!isLoading &&
                                   deposits.map((tx: any) => (
                                        <TransactionCard
                                             key={tx.id || tx._id || Math.random()}
                                             tx={tx}
                                        />
                                   ))}
                         </div>
                    )}
               </div>

               <MakeDepositForm
                    open={isDepositFormOpen}
                    onOpenChange={() => setIsDepositFormOpen(false)}
                    setIsDepositFormOpen={setIsDepositFormOpen}
               />
          </div>
     );
}
