/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { cn } from "@/utils/utils"
import { ArrowUp, ArrowDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface TradeListItemProps {
  trade: any
}

export function TradeListItem({ trade }: TradeListItemProps) {
   const [liveStatusColor, setLiveStatusColor] = useState("text-gray-400");
   const isUpTrade = trade.status === "profit" || trade.status === "pending";
  const currentMarketPrice = 10;
  
    useEffect(() => {
    if (trade.status !== "profit" || currentMarketPrice === undefined) {
      if (trade.status === "profit" || trade.status === "pending") setLiveStatusColor("text-green-500")
      else if (trade.status === "loss") setLiveStatusColor("text-red-500")
      else setLiveStatusColor("text-gray-400") // For pending or other statuses
      return
    }

    // Live profit/Lloss coloring
    if (trade.status === "profit") {
      setLiveStatusColor( "text-green-500")
    } else {
      // Down trade
      setLiveStatusColor("text-red-500")
    }
  }, [trade.status, trade.direction, trade.entryPrice, currentMarketPrice])

  

  const finalStatusColor = useMemo(() => {
    if (trade.status === "profit" || trade.status === "pending") return "text-green-500"
    if (trade.status === "loss") return "text-red-500"
    return liveStatusColor
  }, [trade.status, liveStatusColor])

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2.5 rounded-md text-xs mb-2",
        "bg-gray-800/70 border border-gray-700/50",
        finalStatusColor,
      )}
    >
      <div className="flex flex-col items-start">
        <span className="font-medium text-sm truncate max-w-[100px] text-white">{trade.market}</span>
        <div className="flex items-center mt-1">
          {isUpTrade ? (
            <ArrowUp size={14} className={cn("mr-1", finalStatusColor)} />
          ) : (
            <ArrowDown size={14} className={cn("mr-1", finalStatusColor)} />
          )}
          <span className={cn("font-semibold", finalStatusColor)}>{trade.value}</span>
        </div>
      </div>
      <div className="flex flex-col items-end text-right">
        <span className={cn("text-sm font-mono", finalStatusColor)}>{trade.time}</span>
        <span className={cn("text-xs mt-1", finalStatusColor)}>
          {trade.status === "active"
            ? currentMarketPrice !== undefined &&
              ((isUpTrade && currentMarketPrice > trade.entryPrice) ||
              (!isUpTrade && currentMarketPrice < trade.entryPrice)
                ? "Profit"
                : "Loss")
            : trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
        </span>
      </div>
    </div>
  )
}
