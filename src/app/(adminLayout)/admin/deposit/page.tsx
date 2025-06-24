/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowDownCircle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  CreditCard,
  DollarSign,
  FileText,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/reusable/Button/Button"
import { useApproveDepositMutation, useGetAllDepositsQuery, useGetDepositByIDQuery, useRejectDepositMutation } from "@/redux/Features/Admin/adminApi"

export default function DepositPage() {
  const [approveDeposit] = useApproveDepositMutation();
  const [rejectDeposit] = useRejectDepositMutation();
  const {data} = useGetAllDepositsQuery({});
  const [selectedDepositId, setSelectedDepositId] = useState<any | string>("");
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
  const {data:singleDepositData} = useGetDepositByIDQuery(selectedDepositId);
  console.log(singleDepositData);
  console.log(selectedDeposit, "selected deposit");
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<any | "all">("all")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const isProcessing = false

  const handleViewDetails = (deposit: any) => {
    setSelectedDeposit(deposit)
    setIsDetailsOpen(true)
  }

  const handleApproveDeposit = async (id:string) => {
    try{
      await approveDeposit(id).unwrap();
    } catch (error){
      console.log(error);
    }
  }

  const handleRejectDeposit = async (id:string) => {
    try{
      await rejectDeposit(id).unwrap();
    } catch (error){
      console.log(error);
    }
  }
  

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => router.push("/admin")}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700 mr-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <ArrowDownCircle className="w-6 h-6 text-green-500 mr-2" />
              <h1 className="text-xl font-bold text-white">Deposit Management</h1>
            </div>
          </div>
        </div>
      </header>

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
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any | "all")}>
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
            {data?.data?.deposits?.length > 0 ? (
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800/80 border-gray-700">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Payment Method</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.deposits?.map((deposit:any, index:number) => (
                      <TableRow key={index} className="hover:bg-gray-800/50 border-gray-700">
                        <TableCell className="font-medium text-white">{deposit?.user_id?.username}</TableCell>
                        <TableCell className="font-medium text-white">{deposit?.user_id?.email}</TableCell>
                        <TableCell className="text-white">
                          {deposit.amount} {deposit.currency}
                        </TableCell>
                        <TableCell className="text-gray-300">{deposit.payment_method}</TableCell>
                        <TableCell className="text-gray-300">{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(deposit)}
                            className="text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <ArrowDownCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-400 mb-2">No Deposit Requests</h2>
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
            <DialogTitle className="text-xl font-bold flex items-center">Deposit Request Details</DialogTitle>
          </DialogHeader>

          {selectedDeposit && (
            <div className="py-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-gray-700 border border-gray-600 mb-4">
                  <TabsTrigger value="details" className="data-[state=active]:bg-blue-600">
                    Details
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
                          <Label className="text-gray-400 text-sm">Username</Label>
                          <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                            <span className="text-white">{selectedDeposit?.user_id?.username}</span>
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
                          <Label className="text-gray-400 text-sm">Created At</Label>
                          <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                            <span className="text-white">{new Date(selectedDeposit.created_at).toLocaleDateString()}</span>
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
                          <Label className="text-gray-400 text-sm">Wallet Name</Label>
                          <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                            <span className="text-white">{selectedDeposit.payment_method}</span>
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
                              {selectedDeposit.amount} {selectedDeposit.currency}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400 text-sm">Transaction ID</Label>
                          <div className="bg-gray-800/50 rounded-md p-2 border border-gray-600 mt-1">
                            <span className="text-white">{selectedDeposit.transactionId}</span>
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
                            <span className="text-white">{getStatusBadge(selectedDeposit.status)}</span>
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
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      // onClick={handleRejectDeposit(selectedDeposit.id)}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {isProcessing ? "Processing..." : "Reject Deposit"}
                    </Button>
                    <Button
                      type="button"
                      // onClick={handleApproveDeposit(selectedDeposit.id)}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isProcessing ? "Processing..." : "Approve Deposit"}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
