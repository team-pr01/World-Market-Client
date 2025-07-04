"use client";

import { useState } from "react";
import { ArrowDownCircle, Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
     useApproveDepositMutation,
     useGetAllDepositsQuery,
     useRejectDepositMutation,
} from "@/redux/Features/Admin/adminApi";
import Header from "./_components/Header";
import { DepositTable } from "./_components/DepositTable";
import { Deposit } from "@/type/deposit";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import DepositModal from "./_components/DepositModal";

export default function DepositPage() {
     const [approveDeposit] = useApproveDepositMutation();
     const [rejectDeposit] = useRejectDepositMutation();
     const [searchTerm, setSearchTerm] = useState("");
     const [statusFilter, setStatusFilter] = useState<string | "all">("all");
     const { data, isLoading, isFetching } = useGetAllDepositsQuery({
          search: searchTerm,
          status: statusFilter,
     });
     const deposits = data?.data?.deposits || [];
     const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

     const [isDetailsOpen, setIsDetailsOpen] = useState(false);
     const isProcessing = false;

     const handleViewDetails = (deposit: Deposit) => {
          setSelectedDeposit(deposit);
          setIsDetailsOpen(true);
     };

     const handleApproveDeposit = async (id: string) => {
          try {
               const response = await approveDeposit(id).unwrap();
               if (response?.success) {
                    setIsDetailsOpen(false);
               }
          } catch (error) {
               console.log(error);
          }
     };

     const handleRejectDeposit = async (id: string) => {
          try {
               const response = await rejectDeposit(id).unwrap();
               if (response?.success) {
                    setIsDetailsOpen(false);
               }
          } catch (error) {
               console.log(error);
          }
     };

     const getStatusBadge = (status: string) => {
          switch (status) {
               case "pending":
                    return (
                         <Badge
                              variant="outline"
                              className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              Pending
                         </Badge>
                    );
               case "approved":
                    return (
                         <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20">
                              Approved
                         </Badge>
                    );
               case "rejected":
                    return (
                         <Badge
                              variant="outline"
                              className="bg-red-500/10 text-red-500 border-red-500/20">
                              Rejected
                         </Badge>
                    );
               default:
                    return null;
          }
     };

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
               <Header pending={5} total={10} />
               {/* Main Content */}
               <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
                         <CardHeader>
                              <CardTitle className="text-white">Deposit Requests</CardTitle>
                              <CardDescription className="text-gray-400">
                                   Manage user deposit requests and process payments
                              </CardDescription>
                         </CardHeader>
                         <CardContent>
                              {/* Filters */}
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                   <div className="relative w-full md:w-auto">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                             placeholder="Search by username, transaction ID..."
                                             className="pl-10 bg-gray-700/50 border-gray-600 text-white w-full md:w-[300px]"
                                             value={searchTerm}
                                             onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                   </div>

                                   <div className="flex items-center space-x-2 w-full md:w-auto">
                                        <Filter className="text-gray-400 h-4 w-4" />
                                        <Select
                                             value={statusFilter}
                                             onValueChange={(value) =>
                                                  setStatusFilter(value as string | "all")
                                             }>
                                             <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white w-full md:w-[180px]">
                                                  <SelectValue placeholder="Filter by status" />
                                             </SelectTrigger>
                                             <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                  <SelectItem value="all">All Statuses</SelectItem>
                                                  <SelectItem value="pending">Pending</SelectItem>
                                                  <SelectItem value="approved">Approved</SelectItem>
                                                  <SelectItem value="rejected">Rejected</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                              </div>

                              {/* Deposits Table */}
                              {isLoading || isFetching ? (
                                   <div className="text-slate-100 flex flex-col items-center justify-center p-4">
                                        <RefreshCw
                                             size={48}
                                             className="animate-spin text-purple-400 mb-4"
                                        />
                                        <p className="text-xl">Loading Transaction History...</p>
                                   </div>
                              ) : data?.data?.deposits?.length > 0 ? (
                                   <div className="rounded-md border border-gray-700 overflow-hidden">
                                        <DepositTable
                                             deposits={deposits}
                                             getStatusBadge={getStatusBadge}
                                             handleViewDetails={handleViewDetails}
                                        />
                                   </div>
                              ) : (
                                   <div className="text-center py-16">
                                        <ArrowDownCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold text-gray-400 mb-2">
                                             No Deposit Requests
                                        </h2>
                                        <p className="text-gray-500">
                                             {data?.data?.deposits?.length === 0
                                                  ? "There are no deposit requests yet."
                                                  : "No deposit requests match your filters."}
                                        </p>
                                   </div>
                              )}
                         </CardContent>
                    </Card>
               </main>

               {/* Deposit Details Dialog */}
               <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                         <DialogHeader>
                              <DialogTitle className="text-xl font-bold flex items-center">
                                   Deposit Request Details
                              </DialogTitle>
                         </DialogHeader>

                         {selectedDeposit && (
                              <DepositModal
                                   setIsDetailsOpen={setIsDetailsOpen}
                                   selectedDeposit={selectedDeposit}
                                   getStatusBadge={getStatusBadge}
                                   handleApproveDeposit={handleApproveDeposit}
                                   handleRejectDeposit={handleRejectDeposit}
                                   isProcessing={isProcessing}
                              />
                         )}
                    </DialogContent>
               </Dialog>
          </div>
     );
}
