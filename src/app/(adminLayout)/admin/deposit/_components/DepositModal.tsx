"use client";
import { Button } from "@/components/reusable/Button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Deposit } from "@/type/deposit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
     ArrowUpCircle,
     Calendar,
     CheckCircle,
     CreditCard,
     DollarSign,
     FileText,
     User,
     XCircle,
} from "lucide-react";
import React from "react";

interface DepositModalProps {
     setIsDetailsOpen: (open: boolean) => void;
     selectedDeposit: Deposit;
     getStatusBadge: (status: string) => React.JSX.Element;
     handleApproveDeposit: (id: string) => void;
     handleRejectDeposit: (id: string) => void;
     isProcessing: boolean;
}

const DepositModal = ({
     setIsDetailsOpen,
     selectedDeposit,
     getStatusBadge,
     handleApproveDeposit,
     handleRejectDeposit,
     isProcessing,
}: DepositModalProps) => {
     return (
          <div className="py-4">
               <Tabs defaultValue="details" className="w-full">
                    <TabsList className="bg-gray-700 border border-gray-600 mb-4">
                         <TabsTrigger
                              value="details"
                              className="text-xl font-bold flex items-center">
                              <ArrowUpCircle className="w-6 h-6 text-red-500 mr-2" />
                              Deposit Details
                         </TabsTrigger>

                         {/* <TabsTrigger value="screenshot" className="data-[state=active]:bg-blue-600">
                    Screenshot
                  </TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="details" className="mt-0">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card className="bg-gray-700/50 border-gray-600">
                                   <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-white flex items-center">
                                             <User className="w-5 h-5 mr-2 text-gray-400" />
                                             User Information
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="space-y-3 pt-2">
                                        <div>
                                             <Label className="text-gray-400 text-sm">
                                                  Username
                                             </Label>
                                             <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                                                  <span className="text-white">
                                                       {selectedDeposit?.user_id?.username}
                                                  </span>
                                             </div>
                                        </div>
                                        {/* <div>
                          <Label className="text-gray-400 text-sm">User ID</Label>
                          <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                            <span className="text-white">{selectedDeposit.userId}</span>
                          </div>
                        </div> */}
                                   </CardContent>
                              </Card>

                              <Card className="bg-gray-700/50 border-gray-600">
                                   <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-white flex items-center">
                                             <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                                             Timing Information
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="space-y-3 pt-2">
                                        <div>
                                             <Label className="text-gray-400 text-sm">
                                                  Created At
                                             </Label>
                                             <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                                                  <span className="text-white">
                                                       {new Date(
                                                            selectedDeposit.created_at
                                                       ).toLocaleDateString()}
                                                  </span>
                                             </div>
                                        </div>
                                   </CardContent>
                              </Card>

                              <Card className="bg-gray-700/50 border-gray-600">
                                   <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-white flex items-center">
                                             <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                                             Payment Method
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="space-y-3 pt-2">
                                        <div>
                                             <Label className="text-gray-400 text-sm">
                                                  Wallet Name
                                             </Label>
                                             <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                                                  <span className="text-white">
                                                       {selectedDeposit.payment_method.method_name}
                                                  </span>
                                             </div>
                                        </div>
                                        {/* <div>
                          <Label className="text-gray-400 text-sm">Wallet Type</Label>
                          <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                            <span className="text-white">{selectedDeposit.walletType}</span>
                          </div>
                        </div> */}
                                   </CardContent>
                              </Card>

                              <Card className="bg-gray-700/50 border-gray-600">
                                   <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-white flex items-center">
                                             <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                                             Transaction Details
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="space-y-3 pt-2">
                                        <div>
                                             <Label className="text-gray-400 text-sm">Amount</Label>
                                             <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                                                  <span className="text-white font-medium">
                                                       {selectedDeposit.amount}{" "}
                                                       {selectedDeposit.currency}
                                                  </span>
                                             </div>
                                        </div>
                                        <div>
                                             <Label className="text-gray-400 text-sm">
                                                  Sender Address
                                             </Label>
                                             <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                                                  <span className="text-white">
                                                       {selectedDeposit.sender_address}
                                                  </span>
                                             </div>
                                        </div>
                                   </CardContent>
                              </Card>

                              <Card className="bg-gray-700/50 border-gray-600 md:col-span-2">
                                   <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-white flex items-center">
                                             <FileText className="w-5 h-5 mr-2 text-gray-400" />
                                             Additional Information
                                        </CardTitle>
                                   </CardHeader>
                                   <CardContent className="space-y-3 pt-2">
                                        <div>
                                             <Label className="text-gray-400 text-sm">Status</Label>
                                             <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                                                  <span className="text-white">
                                                       {getStatusBadge(selectedDeposit.status)}
                                                  </span>
                                             </div>
                                        </div>
                                        {/* {selectedDeposit.notes && (
                          <div>
                            <Label className="text-gray-400 text-sm">User Notes</Label>
                            <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                              <span className="text-white">{selectedDeposit.notes}</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <Label htmlFor="adminNotes" className="text-gray-400 text-sm">
                            Admin Notes
                          </Label>
                          <Textarea
                            id="adminNotes"
                            placeholder="Add notes about this deposit request"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="bg-gray-800/50 border-gray-600 text-white h-20 mt-1"
                            disabled={selectedDeposit.status !== "pending"}
                          />
                        </div> */}
                                   </CardContent>
                              </Card>
                         </div>
                    </TabsContent>

                    {/* <TabsContent value="screenshot" className="mt-0">
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2 text-gray-400" />
                        Payment Screenshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                        {selectedDeposit.screenshot ? (
                          <img
                            src={selectedDeposit.screenshot || "/placeholder.svg"}
                            alt="Payment Screenshot"
                            className="w-full max-h-[500px] object-contain rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-64 text-gray-400">
                            <ImageIcon className="w-16 h-16" />
                            <span className="ml-2">No screenshot available</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent> */}
               </Tabs>

               <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                    {selectedDeposit.status === "pending" ? (
                         <>
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={() => setIsDetailsOpen(false)}
                                   className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                   Cancel
                              </Button>
                              <Button
                                   type="button"
                                   variant="destructive"
                                   onClick={() => handleRejectDeposit(selectedDeposit._id)}
                                   disabled={isProcessing}
                                   className="bg-red-600 hover:bg-red-700 text-white">
                                   <XCircle className="h-4 w-4 mr-2" />
                                   {isProcessing ? "Processing..." : "Reject Deposit"}
                              </Button>
                              <Button
                                   type="button"
                                   onClick={() => handleApproveDeposit(selectedDeposit._id)}
                                   disabled={isProcessing}
                                   className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                                   <CheckCircle className="h-4 w-4 mr-2" />
                                   {isProcessing ? "Processing..." : "Approve Deposit"}
                              </Button>
                         </>
                    ) : (
                         <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDetailsOpen(false)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              Close
                         </Button>
                    )}
               </DialogFooter>
          </div>
     );
};

export default DepositModal;
