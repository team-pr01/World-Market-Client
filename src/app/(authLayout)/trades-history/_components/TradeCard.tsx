'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/utils/utils";
import { Trade } from "@/type/trade";

const getTradeStatusBadgeClasses = (status: string) => {
     switch (status) {
          case "profit":
               return "bg-green-100 text-green-800 border-green-300";
          case "loss":
               return "bg-red-100 text-red-800 border-red-300";
          default: // active or other
               return "bg-gray-100 text-gray-800 border-gray-300";
     }
};

const getTradeModeBadgeClasses = (mode: string) => {
     switch (mode) {
          case "live":
               return "bg-blue-100 text-blue-800 border-blue-300";
          case "demo":
               return "bg-purple-100 text-purple-800 border-purple-300";
          default:
               return "bg-gray-100 text-gray-800";
     }
};

const TradeCard = ({ trade }: { trade: Trade }) => {
     const isWon = trade.status === "profit";
     const profitOrLoss = isWon ? trade.payout : -trade.amount;
     const profitColor = isWon ? "text-green-400" : "text-red-400";

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
                              {trade.pair.pair}
                         </CardTitle>
                         <div className="flex space-x-2">
                              <Badge
                                   className={cn(
                                        "text-xs",
                                        getTradeStatusBadgeClasses(trade.status)
                                   )}>
                                   {/* {trade.status.charAt(0)?.toUpperCase() + trade.status.slice(1) || "status"} */}
                                   {trade.status}
                              </Badge>
                              <Badge
                                   className={cn("text-xs", getTradeModeBadgeClasses(trade.account_type))}>
                                   {/* {trade.mode.charAt(0)?.toUpperCase() + trade.mode.slice(1) || "status"} */}
                                   {trade.account_type}
                              </Badge>
                         </div>
                    </div>
                    <CardDescription className="text-xs text-slate-400 pt-1">
                         ID: {trade._id}
                    </CardDescription>
               </CardHeader>
               <CardContent className="text-sm space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                         <div className="flex items-center">
                              <DollarSign size={14} className="mr-1 text-slate-500" />
                              <span className="text-slate-400">Invest:</span>
                              <span className="ml-auto font-medium">${trade.amount}</span>
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
                              <span className="ml-auto font-mono">{trade.bidPrice.toFixed(4)}</span>
                         </div>
                         <div className="flex items-center">
                              <TrendingDown size={14} className="mr-1 text-slate-500" />
                              <span className="text-slate-400">Final:</span>
                              <span className="ml-auto font-mono">
                                   {trade.resultPrice !== undefined
                                        ? trade.resultPrice.toFixed(4)
                                        : "N/A"}
                              </span>
                         </div>
                    </div>
                    <div className="border-t border-slate-700/50 my-2"></div>
                    <div className="flex items-center text-xs">
                         <Clock size={12} className="mr-1.5 text-slate-500" />
                         <span className="text-slate-400">Start:</span>
                         <span className="ml-auto">{new Date(trade.bidTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-xs">
                         <Clock size={12} className="mr-1.5 text-slate-500" />
                         <span className="text-slate-400">End:</span>
                         <span className="ml-auto">
                              {new Date(trade.expiryTime).toLocaleString()}
                         </span>
                    </div>
               </CardContent>
          </Card>
     );
};
export default TradeCard;
