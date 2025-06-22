/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {  useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ListFilter,
  Search,
  Info,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
} from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { cn } from "@/utils/utils"
import { Button } from "@/components/reusable/Button/Button"

const getTradeStatusBadgeClasses = (status: any) => {
  switch (status) {
    case "won":
      return "bg-green-100 text-green-800 border-green-300"
    case "lost":
      return "bg-red-100 text-red-800 border-red-300"
    default: // active or other
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

const getTradeModeBadgeClasses = (mode: any) => {
  switch (mode) {
    case "live":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "demo":
      return "bg-purple-100 text-purple-800 border-purple-300"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TradesHistoryPage() {
  // const currentUser = {
  //   id: "12345",
  //   displayId: "user_12345",
  //   username: "john_doe",
  //   email: "ra1oB@example.com",
  //   name: "John Doe",
  //   address: "123 Main St, Anytown, USA",
  //   phoneNumber: "123-456-7890",
  //   country: "USA",
  //   profilePictureUrl: "/placeholder.svg?width=128&height=128&query=user+avatar",
  //   isVerified: false,
  // }

  const availableMarkets:any[] = [1,2,3];
  const filteredTrades = [1,2,3];
  const userTrades:any[] = [1,2,3];
  const isLoading = false

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<any | "all">("all")
  const [modeFilter, setModeFilter] = useState<any | "all">("all")
  const [marketFilter, setMarketFilter] = useState<string>("all")

  // const availableMarkets = useMemo(() => {
  //   if (!currentUser?.id) return []
  //   const userSpecificTrades = getUserTrades(currentUser.id)
  //   const markets = new Set(userSpecificTrades.map((trade) => trade.market))
  //   return ["all", ...Array.from(markets)]
  // }, [currentUser, getUserTrades])

  // useEffect(() => {
  //   setIsLoading(true)
  //   if (isAuthenticated && currentUser?.id) {
  //     const trades = getUserTrades(currentUser.id)
  //       .filter((trade) => trade.status === "won" || trade.status === "lost") 
  //       .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
  //     setUserTrades(trades)
  //   } else {
  //     setUserTrades([])
  //   }
  //   setIsLoading(false)
  // }, [currentUser, isAuthenticated, getUserTrades, allTrades]) 

  // const filteredTrades = useMemo(() => {
  //   return userTrades.filter((trade) => {
  //     const searchLower = searchTerm.toLowerCase()
  //     const matchesSearch =
  //       trade.market.toLowerCase().includes(searchLower) ||
  //       trade.investment.toString().includes(searchLower) ||
  //       (trade.finalPrice && trade.finalPrice.toString().includes(searchLower))

  //     const matchesStatus = statusFilter === "all" || trade.status === statusFilter
  //     const matchesMode = modeFilter === "all" || trade.mode === modeFilter
  //     const matchesMarket = marketFilter === "all" || trade.market === marketFilter

  //     return matchesSearch && matchesStatus && matchesMode && matchesMarket
  //   })
  // }, [userTrades, searchTerm, statusFilter, modeFilter, marketFilter])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center justify-center p-4">
        <RefreshCw size={48} className="animate-spin text-purple-400 mb-4" />
        <p className="text-xl">Loading Trades History...</p>
      </div>
    )
  }

  const TradeCard = ({ trade }: { trade: any }) => {
    const isWon = trade.status === "won"
    const profitOrLoss = isWon ? trade.payout : -trade.investment
    const profitColor = isWon ? "text-green-400" : "text-red-400"

    return (
      <Card className="bg-slate-800/70 border-slate-700 text-slate-200 shadow-lg hover:shadow-purple-500/20 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg flex items-center">
              {trade.direction === "up" ? (
                <TrendingUp className="h-6 w-6 mr-2 text-sky-400" />
              ) : (
                <TrendingDown className="h-6 w-6 mr-2 text-orange-400" />
              )}
              {trade.market}
            </CardTitle>
            <div className="flex space-x-2">
              <Badge className={cn("text-xs", getTradeStatusBadgeClasses(trade.status))}>
                {/* {trade.status.charAt(0)?.toUpperCase() + trade.status.slice(1) || "status"} */}
                Status
              </Badge>
              <Badge className={cn("text-xs", getTradeModeBadgeClasses(trade.mode))}>
                {/* {trade.mode.charAt(0)?.toUpperCase() + trade.mode.slice(1) || "status"} */}
                Status
              </Badge>
            </div>
          </div>
          <CardDescription className="text-xs text-slate-400 pt-1">
            ID: Trade ID
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center">
              <DollarSign size={14} className="mr-1 text-slate-500" />
              <span className="text-slate-400">Invest:</span>
              <span className="ml-auto font-medium">$100</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={14} className={`mr-1 ${profitColor}`} />
              <span className="text-slate-400">P/L:</span>
              <span className={`ml-auto font-bold ${profitColor}`}>
                {isWon ? "+" : ""}${profitOrLoss.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center">
              <TrendingUp size={14} className="mr-1 text-slate-500" />
              <span className="text-slate-400">Entry:</span>
              <span className="ml-auto font-mono">entryPrice</span>
            </div>
            <div className="flex items-center">
              <TrendingDown size={14} className="mr-1 text-slate-500" />
              <span className="text-slate-400">Final:</span>
              <span className="ml-auto font-mono">
                {trade.finalPrice !== undefined ? trade.finalPrice.toFixed(4) : "N/A"}
              </span>
            </div>
          </div>
          <div className="border-t border-slate-700/50 my-2"></div>
          <div className="flex items-center text-xs">
            <Clock size={12} className="mr-1.5 text-slate-500" />
            <span className="text-slate-400">Start:</span>
            <span className="ml-auto">25 Jan 2023, 12:00 AM</span>
          </div>
          <div className="flex items-center text-xs">
            <Clock size={12} className="mr-1.5 text-slate-500" />
            <span className="text-slate-400">End:</span>
            <span className="ml-auto">25 Jan 2023, 12:00 AM</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-6 group">
          <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
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
              <label htmlFor="search-trade" className="block text-xs font-medium text-slate-400 mb-1">
                Search Trades
              </label>
              <Input
                id="search-trade"
                type="text"
                placeholder="Market, investment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500 focus:ring-purple-500 focus:border-purple-500"
              />
              <Search className="absolute left-3 bottom-2.5 h-5 w-5 text-slate-400" />
            </div>

            <div>
              <label htmlFor="market-filter" className="block text-xs font-medium text-slate-400 mb-1">
                Market
              </label>
              <Select value={marketFilter} onValueChange={setMarketFilter}>
                <SelectTrigger
                  id="market-filter"
                  className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500"
                >
                  <SelectValue placeholder="Market" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-200 max-h-60">
                  {availableMarkets.map((market) => (
                    <SelectItem key={market} value={market}>
                      {market === "all" ? "All Markets" : market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-xs font-medium text-slate-400 mb-1">
                Status
              </label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger
                  id="status-filter"
                  className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500"
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="mode-filter" className="block text-xs font-medium text-slate-400 mb-1">
                Mode
              </label>
              <Select value={modeFilter} onValueChange={(value) => setModeFilter(value as any)}>
                <SelectTrigger
                  id="mode-filter"
                  className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500 focus:border-purple-500"
                >
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
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
              <p className="text-slate-300 text-xl font-semibold">No Trades Found</p>
              <p className="text-slate-400 mt-2">
                {userTrades.length > 0 &&
                (searchTerm || statusFilter !== "all" || modeFilter !== "all" || marketFilter !== "all")
                  ? "No trades match your current filters."
                  : "You haven't made any completed trades yet."}
              </p>
              {userTrades.length === 0 && (
                <div className="mt-6">
                  <Button onClick={() => (window.location.href = "/")} className="bg-purple-500 hover:bg-purple-600">
                    Start Trading
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrades.map((trade) => (
              <TradeCard key={trade} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
