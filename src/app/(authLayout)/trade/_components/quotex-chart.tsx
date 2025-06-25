/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { AreaChart, CandlestickChart, LineChartIcon, RefreshCw } from "lucide-react"
import { cn } from "@/utils/utils"

export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  isComplete: boolean
}

interface QuotexChartProps {
  symbol: string
  isMobile: boolean
}

type ChartType = "Area" | "Candles" | "Line"

interface ChartTypeOption {
  type: ChartType
  label: string
  icon: React.ElementType
}

const chartTypeOptions: ChartTypeOption[] = [
  { type: "Area", label: "Area Chart", icon: AreaChart },
  { type: "Candles", label: "Candlestick Chart", icon: CandlestickChart },
  { type: "Line", label: "Line Chart", icon: LineChartIcon },
]

export function QuotexChart({ symbol, isMobile }: QuotexChartProps) {
  

  // isLoading is now primarily for the initial load of the component/symbol
  if (isLoading || !marketState?.isInitialized) {
    return (
      <div ref={containerRef} className="h-full w-full flex items-center justify-center bg-[#0B0E14] min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
          <p className="text-white text-sm">Loading Real-time Chart...</p>
        </div>
      </div>
    )
  }

  // marketState might be null briefly before subscription updates, handle safely
  const currentPriceForInfo = marketState.currentPrice
  const currentCandleDataForInfo = marketState.candleData

  return (
    <div ref={containerRef} className="h-full w-full relative bg-[#0B0E14] overflow-hidden min-h-[300px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair select-none block"
        style={{ touchAction: "none", width: "100%", height: "100%", display: "block" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <div className="absolute top-4 left-4 text-white pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold">{symbol}</span>
          <span
            className={`text-sm ${currentPriceForInfo > (currentCandleDataForInfo[currentCandleDataForInfo.length - 2]?.close || 0) ? "text-green-400" : "text-red-400"}`}
          >
            {currentPriceForInfo.toFixed(symbol.includes("/") || symbol.toLowerCase().includes("otc") ? 5 : 2)}
          </span>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-1 md:gap-2">
        {chartTypeOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <button
              key={option.type}
              onClick={() => setChartType(option.type)}
              className={cn(
                "bg-gray-800/70 hover:bg-gray-700/70 text-white p-1.5 md:p-2 rounded transition-colors flex items-center justify-center",
                chartType === option.type && "bg-blue-600/80 ring-1 ring-blue-400",
              )}
              aria-label={option.label}
              aria-pressed={chartType === option.type}
            >
              <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )
        })}
        <button
          onClick={resetZoom}
          className="bg-gray-800/70 hover:bg-gray-700/70 text-white p-1.5 md:p-2 rounded text-xs transition-colors flex items-center justify-center"
          aria-label="Reset Zoom"
        >
          <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
          Reset
        </button>
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white pointer-events-none">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs">LIVE</span>
      </div>
    </div>
  )
}
