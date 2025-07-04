"use client";

import { useState, useEffect } from "react";
import { Withdraw as WithdawType } from "@/type/withdraw";
import {
     ArrowUpCircle,
     Check,
     X,
     Clock,
     DollarSign,
     User,
     Calendar,
     FileText,
     RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/reusable/Button/Button";
import {
     useApproveWithdrawMutation,
     useGetAllWithdrawalsQuery,
     useRejectWithdrawMutation,
} from "@/redux/Features/Admin/adminApi";
import WithdrawalCard from "./_components/WithdrawCard";
import Header from "./_components/Header";


export default function AdminWithdrawalPage() {
     const [approveWithdraw] = useApproveWithdrawMutation();
     const [rejectWithdraw] = useRejectWithdrawMutation();
     const { data, isLoading, isFetching } = useGetAllWithdrawalsQuery();
     const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdawType | null>(null);
     const [isDetailsOpen, setIsDetailsOpen] = useState(false);
     const isProcessing = false;
     const [isMobile, setIsMobile] = useState(false);
     console.log(isMobile);

     const withdraws = data?.data?.withdraws || [];

     console.log(withdraws);

     // Check if mobile
     useEffect(() => {
          const checkIfMobile = () => {
               setIsMobile(window.innerWidth < 768);
          };
          checkIfMobile();
          window.addEventListener("resize", checkIfMobile);
          return () => window.removeEventListener("resize", checkIfMobile);
     }, []);

     const handleViewDetails = (withdrawal: WithdawType) => {
          setSelectedWithdrawal(withdrawal);
          setIsDetailsOpen(true);
     };

     const handleApprove = async (id: string) => {
          try {
               const response = await approveWithdraw(id).unwrap();
               if (response?.success) {
                    setIsDetailsOpen(false);
               }
          } catch (error) {
               console.log(error);
          }
     };

     const handleReject = async (id: string) => {
          try {
               const response = await rejectWithdraw(id).unwrap();
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
                         <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Pending
                         </Badge>
                    );
               case "approved":
                    return (
                         <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Approved
                         </Badge>
                    );
               case "rejected":
                    return (
                         <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              Rejected
                         </Badge>
                    );
               default:
                    return (
                         <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              Unknown
                         </Badge>
                    );
          }
     };

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleString();
     };

     const pendingWithdrawals: WithdawType[] = withdraws.filter(
          (w: WithdawType) => w.status === "pending"
     );


     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
               {/* Header */}
               <Header pending={5} total={10} />

               {/* Main Content */}
               <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {isLoading || isFetching ? (
                         <div className="text-slate-100 flex flex-col items-center justify-center p-4">
                              <RefreshCw size={48} className="animate-spin text-purple-400 mb-4" />
                              <p className="text-xl">Loading Transaction History...</p>
                         </div>
                    ) : data?.data?.withdraws?.length === 0 ? (
                         <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 text-center">
                              <ArrowUpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                              <h2 className="text-2xl font-bold text-gray-400 mb-2">
                                   No Withdrawal Requests
                              </h2>
                              <p className="text-gray-500">
                                   No withdrawal requests have been submitted yet.
                              </p>
                         </div>
                    ) : (
                         <div className="space-y-8">
                              {/* Pending Withdrawals */}
                              {data?.data?.withdraws?.length > 0 && (
                                   <div>
                                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                             <Clock className="w-6 h-6 text-yellow-500 mr-2" />
                                             Pending Withdrawals ({pendingWithdrawals?.length})
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                             {data?.data?.withdraws?.map(
                                                  (withdrawal: any, index: number) => (
                                                       <WithdrawalCard
                                                            key={index}
                                                            withdrawal={withdrawal}
                                                            onViewDetails={handleViewDetails}
                                                            isPending={true}
                                                       />
                                                  )
                                             )}
                                        </div>
                                   </div>
                              )}
                         </div>
                    )}

                    {/* Withdrawal Details Dialog */}
                    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                         <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                   <DialogTitle className="text-xl font-bold flex items-center">
                                        <ArrowUpCircle className="w-6 h-6 text-red-500 mr-2" />
                                        Withdrawal Details
                                   </DialogTitle>
                              </DialogHeader>

                              {selectedWithdrawal && (
                                   <div className="py-4 space-y-6">
                                        {/* User Information */}
                                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                             <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                                  <User className="w-5 h-5 mr-2" />
                                                  User Information
                                             </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Username
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-white">
                                                                 {
                                                                      selectedWithdrawal?.user_id
                                                                           ?.username
                                                                 }
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            User Email
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-white font-mono text-sm">
                                                                 {selectedWithdrawal?.user_id.email}
                                                            </span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Withdrawal Information */}
                                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                             <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                                  <DollarSign className="w-5 h-5 mr-2" />
                                                  Withdrawal Information
                                             </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Payment Method
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-white">
                                                                 {
                                                                      selectedWithdrawal
                                                                           .payment_method
                                                                           .method_type
                                                                 }
                                                            </span>
                                                            {/* <span className="text-gray-400 text-sm ml-2">({selectedWithdrawal.walletType})</span> */}
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Wallet ID/Address
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-white font-mono text-sm">
                                                                 {
                                                                      selectedWithdrawal.receiver_address
                                                                 }
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Withdrawal Amount
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-white font-bold uppercase">
                                                                 {selectedWithdrawal?.amount?.toFixed(
                                                                      2
                                                                 ) || 0}{" "}
                                                                 {selectedWithdrawal?.currency}
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Fee
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-red-400">
                                                                 $
                                                                 {selectedWithdrawal?.fee?.toFixed(
                                                                      2
                                                                 ) || 0}
                                                            </span>
                                                       </div>
                                                  </div>
                                                  {/* <div>
                                     <Label className="text-gray-400 text-sm">Net Amount (User Receives)</Label>
                                     <div className="bg-green-500/20 rounded-md p-2 border border-green-500/30">
                                       <span className="text-green-400 font-bold uppercase">{selectedWithdrawal?.netAmount?.toFixed(2) || 0} {selectedWithdrawal?.currency}</span>
                                     </div>
                                   </div> */}
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Status
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            {getStatusBadge(
                                                                 selectedWithdrawal?.status
                                                            )}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                             <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                                  <Calendar className="w-5 h-5 mr-2" />
                                                  Timeline
                                             </h3>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                       <Label className="text-gray-400 text-sm">
                                                            Submitted At
                                                       </Label>
                                                       <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                            <span className="text-white text-sm">
                                                                 {formatDate(
                                                                      selectedWithdrawal.created_at)}
                                                            </span>
                                                       </div>
                                                  </div>
                                                  {selectedWithdrawal.approved_at && (
                                                       <div>
                                                            <Label className="text-gray-400 text-sm">
                                                                 Approved At
                                                            </Label>
                                                            <div className="bg-gray-700/50 rounded-md p-2 border border-gray-600">
                                                                 <span className="text-white text-sm">
                                                                      {formatDate(
                                                                           selectedWithdrawal.approved_at
                                                                      )}
                                                                 </span>
                                                            </div>
                                                       </div>
                                                  )}
                                             </div>
                                        </div>

                                        {/* User Notes */}
                                        {selectedWithdrawal.note && (
                                             <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                                  <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                                       <FileText className="w-5 h-5 mr-2" />
                                                       User Notes
                                                  </h3>
                                                  <div className="bg-gray-700/50 rounded-md p-3 border border-gray-600">
                                                       <p className="text-white text-sm">
                                                            {selectedWithdrawal.note}
                                                       </p>
                                                  </div>
                                             </div>
                                        )}

                                        {/* Admin Notes */}
                                        {/* <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                 <h3 c</Button>lassName="text-lg font-medium text-white mb-3">Admin Notes</h3>
                                 <Textarea
                                   placeholder="Add notes about this withdrawal request..."
                                   value={adminNotes}
                                   onChange={(e) => setAdminNotes(e.target.value)}
                                   className="bg-gray-700 border-gray-600 text-white h-20"
                                   disabled={selectedWithdrawal.status !== "pending"}
                                 />
                                 {selectedWithdrawal.adminNotes && selectedWithdrawal.status !== "pending" && (
                                   <div className="mt-2 bg-gray-700/50 rounded-md p-3 border border-gray-600">
                                     <Label className="text-gray-400 text-xs">Previous Admin Notes:</Label>
                                     <p className="text-white text-sm mt-1">{selectedWithdrawal.adminNotes}</p>
                                   </div>
                                 )}
                               </div> */}

                                        {/* Action Buttons */}
                                        {selectedWithdrawal.status === "pending" && (
                                             <div className="flex flex-col sm:flex-row gap-3">
                                                  <Button
                                                       onClick={() =>
                                                            handleReject(selectedWithdrawal?._id)
                                                       }
                                                       disabled={isProcessing}
                                                       variant="outline"
                                                       className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                                                       <X className="w-4 h-4 mr-2" />
                                                       {isProcessing
                                                            ? "Processing..."
                                                            : "Reject & Refund"}
                                                  </Button>
                                                  <Button
                                                       onClick={() =>
                                                            handleApprove(selectedWithdrawal?._id)
                                                       }
                                                       disabled={isProcessing}
                                                       className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                                       <Check className="w-4 h-4 mr-2" />
                                                       {isProcessing
                                                            ? "Processing..."
                                                            : "Approve Withdrawal"}
                                                  </Button>
                                             </div>
                                        )}
                                   </div>
                              )}

                              <DialogFooter>
                                   <Button
                                        onClick={() => setIsDetailsOpen(false)}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                        Close
                                   </Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>
               </main>
          </div>
     );
}

