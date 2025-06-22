"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"
import Link from "next/link"
// import { useDepositStore, type Deposit } from "@/lib/deposit-store"
// import { useWithdrawalStore, type WithdrawalRequest } from "@/lib/withdrawal-store"
// import { useAuthStore } from "@/lib/auth-store"
// import { useUserStore } from "@/lib/user-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ListChecks, ArrowDownCircle, ArrowUpCircle, Search, Info, RefreshCw } from "lucide-react"
// import { format } from "date-fns"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { cn } from "@/utils/utils"
import { Button } from "@/components/reusable/Button/Button"
import { useGetAllDepositsQuery } from "@/redux/Features/User/userApi"

// type CombinedTransaction = (Deposit | WithdrawalRequest) & { type: "deposit" | "withdrawal" }

// const getStatusBadgeClasses = (
//   status: Deposit["status"] | WithdrawalRequest["status"],
//   type: "deposit" | "withdrawal",
// ) => {
//   if (type === "deposit") {
//     switch (status as Deposit["status"]) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300"
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-300"
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-300"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   } else {
//     switch (status as WithdrawalRequest["status"]) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300"
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-300"
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-300"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }
// }

const getStatusBadgeClasses = "deposit"

export default function TransactionHistoryPage() {

  const { data } = useGetAllDepositsQuery({
  page: 2,
  status: 'approved',
  startDate: '2023-01-01',
  endDate: '2023-12-31'
});
console.log(data);




  // const { getUserDeposits } = useDepositStore()
  // const { getWithdrawalsByUserId } = useWithdrawalStore()
  // const { currentUser: authUser, isAuthenticated } = useAuthStore()
  // const { getCurrentUser } = useUserStore()

  const [transactions, setTransactions] = useState([1,2])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all") // "all", "pending", "approved", "rejected"
  const [typeFilter, setTypeFilter] = useState<"all" | "deposit" | "withdrawal">("all")
  const filteredTransactions = [1,2];

  // const currentUser = getCurrentUser()

  // useEffect(() => {
  //   setIsLoading(true)
  //   if (isAuthenticated && currentUser?.id) {
  //     const deposits = getUserDeposits(currentUser.id).map((d) => ({ ...d, type: "deposit" as const }))
  //     const withdrawals = getWithdrawalsByUserId(currentUser.id).map((w) => ({ ...w, type: "withdrawal" as const }))

  //     const combined = [...deposits, ...withdrawals].sort((a, b) => {
  //       const dateA = new Date(a.type === "deposit" ? (a as Deposit).createdAt : (a as WithdrawalRequest).submittedAt)
  //       const dateB = new Date(b.type === "deposit" ? (b as Deposit).createdAt : (b as WithdrawalRequest).submittedAt)
  //       return dateB.getTime() - dateA.getTime()
  //     })
  //     setTransactions(combined)
  //   } else {
  //     setTransactions([])
  //   }
  //   setIsLoading(false)
  // }, [authUser, isAuthenticated, getUserDeposits, getWithdrawalsByUserId, currentUser])

  // const filteredTransactions = useMemo(() => {
  //   return transactions.filter((tx) => {
  //     const searchLower = searchTerm.toLowerCase()
  //     const matchesSearch =
  //       (tx.type === "deposit" &&
  //         ((tx as Deposit).transactionId?.toLowerCase().includes(searchLower) ||
  //           (tx as Deposit).walletName?.toLowerCase().includes(searchLower))) ||
  //       (tx.type === "withdrawal" &&
  //         ((tx as WithdrawalRequest).walletId?.toLowerCase().includes(searchLower) ||
  //           (tx as WithdrawalRequest).walletName?.toLowerCase().includes(searchLower))) ||
  //       tx.id.toLowerCase().includes(searchLower) ||
  //       tx.amount.toString().includes(searchLower)

  //     const matchesStatus = statusFilter === "all" || tx.status === statusFilter
  //     const matchesType = typeFilter === "all" || tx.type === typeFilter

  //     return matchesSearch && matchesStatus && matchesType
  //   })
  // }, [transactions, searchTerm, statusFilter, typeFilter])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center justify-center p-4">
        <RefreshCw size={48} className="animate-spin text-purple-400 mb-4" />
        <p className="text-xl">Loading Transaction History...</p>
      </div>
    )
  }

  const TransactionCard = ({ tx }: { tx: any }) => {
    const isDeposit = tx.type === "deposit"
    // const depositTx = tx as Deposit
    // const withdrawalTx = tx as WithdrawalRequest

    // const date = isDeposit ? depositTx.createdAt : withdrawalTx.submittedAt
    const amount = tx.amount
    // const currencyOrSymbol = isDeposit ? depositTx.currency : "$"
    // const status = tx.status
    // const walletName = isDeposit ? depositTx.walletName : withdrawalTx.walletName
    // const transactionId = isDeposit ? depositTx.transactionId : withdrawalTx.id

    return (
      <Card className="bg-slate-800/70 border-slate-700 text-slate-200 shadow-lg hover:shadow-purple-500/20 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg flex items-center">
              {isDeposit ? (
                <ArrowDownCircle className="h-6 w-6 mr-2 text-green-400" />
              ) : (
                <ArrowUpCircle className="h-6 w-6 mr-2 text-red-400" />
              )}
              {isDeposit ? "Deposit" : "Withdrawal"}
            </CardTitle>
            <Badge className={getStatusBadgeClasses}>{status}</Badge>
            {/* <Badge className={cn("text-xs", getStatusBadgeClasses(status, tx.type))}>{status}</Badge> */}
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Amount:</span>
            <span className="font-semibold text-lg">
              {isDeposit ? "" : "-"}
              {amount?.toFixed(2)} $
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Method:</span>
            <span>Wallet Name</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date:</span>
            <span>25 June,2025</span>
            {/* <span>{format(new Date(date), "PPpp")}</span> */}
          </div>
          {isDeposit &&(
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction ID:</span>
              <span className="font-mono text-xs truncate max-w-[150px]">Deposit transaction id</span>
            </div>
          )}
          {!isDeposit && (
            <div className="flex justify-between">
              <span className="text-slate-400">Request ID:</span>
              <span className="font-mono text-xs truncate max-w-[150px]">Withdraw id</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-6 group">
          <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Trading
        </Link>

        <header className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <ListChecks className="h-10 w-10 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold tracking-tight">Transaction History</h1>
          </div>
          <p className="text-slate-400">Review your past deposits and withdrawals.</p>
        </header>

        <Card className="bg-slate-800/50 backdrop-blur-md shadow-2xl border-slate-700 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="relative sm:col-span-2">
              <label htmlFor="search-tx" className="block text-xs font-medium text-slate-400 mb-1">
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

            <div className="grid grid-cols-2 gap-2 sm:col-span-1">
              <div>
                <label htmlFor="type-filter" className="block text-xs font-medium text-slate-400 mb-1">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                  <SelectTrigger
                    id="type-filter"
                    className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-xs font-medium text-slate-400 mb-1">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    id="status-filter"
                    className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500"
                  >
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
            </div>
          </div>
        </Card>

        {filteredTransactions.length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-md shadow-xl border-slate-700 text-center py-16">
            <CardContent className="flex flex-col items-center">
              <Info className="mx-auto h-16 w-16 text-slate-500 mb-6" />
              <p className="text-slate-300 text-xl font-semibold">No Transactions Found</p>
              <p className="text-slate-400 mt-2">
                {transactions.length > 0 && (searchTerm || statusFilter !== "all" || typeFilter !== "all")
                  ? "No transactions match your current filters."
                  : "You haven't made any transactions yet."}
              </p>
              {transactions.length === 0 && (
                <div className="mt-6 space-x-4">
                  <Button
                    onClick={() => (window.location.href = "/deposit")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Make a Deposit
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/withdrawal")}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Request Withdrawal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map((tx) => (
              <TransactionCard key={tx} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
