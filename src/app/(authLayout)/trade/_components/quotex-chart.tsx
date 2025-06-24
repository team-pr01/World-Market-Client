// "use client"

// import type React from "react"
// import { useEffect, useRef, useState, useCallback } from "react"
// import { useChartDataStore } from "@/lib/chart-data-store"
// import { useTradeStore, type Trade } from "@/lib/trade-store"
// import { useAuthStore } from "@/lib/auth-store"
// import { useUserStore } from "@/lib/user-store"
// import { cn } from "@/lib/utils"
// import { AreaChart, CandlestickChart, LineChartIcon, RefreshCw } from "lucide-react"

// export interface CandleData {
//   time: number
//   open: number
//   high: number
//   low: number
//   close: number
//   isComplete: boolean
// }

// interface QuotexChartProps {
//   symbol: string
//   isMobile: boolean
// }

// type ChartType = "Area" | "Candles" | "Line"

// interface ChartTypeOption {
//   type: ChartType
//   label: string
//   icon: React.ElementType
// }

// const chartTypeOptions: ChartTypeOption[] = [
//   { type: "Area", label: "Area Chart", icon: AreaChart },
//   { type: "Candles", label: "Candlestick Chart", icon: CandlestickChart },
//   { type: "Line", label: "Line Chart", icon: LineChartIcon },
// ]

// export function QuotexChart({ symbol, isMobile }: QuotexChartProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const animationRef = useRef<number>()

//   // Initialize market data using the store's action
//   useEffect(() => {
//     setIsLoading(true)
//     useChartDataStore.getState().initializeMarket(symbol)
//     setIsLoading(false)
//   }, [symbol])

//   // Subscribe to market state for the current symbol
//   const marketState = useChartDataStore(useCallback((state) => state.marketCharts[symbol] || null, [symbol]))

//   const { trades: allTrades } = useTradeStore()
//   const { currentUser } = useAuthStore()
//   const currentUserDetails = useUserStore((state) => state.users.find((user) => user.id === currentUser?.id))

//   const [isLoading, setIsLoading] = useState(true)
//   const [timeRemaining, setTimeRemaining] = useState(0)

//   const [zoom, setZoom] = useState(1)
//   const [panX, setPanX] = useState(0)
//   const [isDragging, setIsDragging] = useState(false)
//   const [lastMouseX, setLastMouseX] = useState(0)
//   const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
//   const [chartType, setChartType] = useState<ChartType>("Candles")

//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const rect = containerRef.current.getBoundingClientRect()
//         setDimensions({ width: Math.max(rect.width, 400), height: Math.max(rect.height, 300) })
//       }
//     }
//     setTimeout(updateDimensions, 100) // Initial delay for layout to settle
//     updateDimensions()
//     window.addEventListener("resize", updateDimensions)
//     const resizeObserver = new ResizeObserver(updateDimensions)
//     if (containerRef.current) resizeObserver.observe(containerRef.current)
//     return () => {
//       window.removeEventListener("resize", updateDimensions)
//       if (containerRef.current) resizeObserver.unobserve(containerRef.current)
//       resizeObserver.disconnect()
//     }
//   }, [])

//   // useEffect for updating the timeRemaining display
//   useEffect(() => {
//     if (!marketState?.isInitialized) return

//     // Update timeRemaining immediately when marketState.nextCandleTime changes
//     if (marketState.nextCandleTime) {
//       setTimeRemaining(Math.max(0, marketState.nextCandleTime - Date.now()))
//     }

//     const timerInterval = setInterval(() => {
//       // Use the marketState from the component's state, which is subscribed from the store
//       if (marketState?.nextCandleTime) {
//         setTimeRemaining(Math.max(0, marketState.nextCandleTime - Date.now()))
//       }
//     }, 1000) // Update timer display every second

//     return () => clearInterval(timerInterval)
//   }, [marketState?.isInitialized, marketState?.nextCandleTime])

//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       e.preventDefault()
//       const canvas = canvasRef.current
//       if (!canvas) return
//       const rect = canvas.getBoundingClientRect()
//       const mouseX = e.clientX - rect.left
//       const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
//       const newZoom = Math.max(0.5, Math.min(5, zoom * zoomFactor))
//       const zoomPoint = (mouseX - panX) / zoom
//       const newPanX = mouseX - zoomPoint * newZoom
//       setZoom(newZoom)
//       setPanX(newPanX)
//     },
//     [zoom, panX],
//   )
//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     setIsDragging(true)
//     setLastMouseX(e.clientX)
//   }, [])
//   const handleMouseMove = useCallback(
//     (e: React.MouseEvent) => {
//       if (!isDragging) return
//       const deltaX = e.clientX - lastMouseX
//       setPanX((prev) => prev + deltaX)
//       setLastMouseX(e.clientX)
//     },
//     [isDragging, lastMouseX],
//   )
//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false)
//   }, [])
//   const [touchStart, setTouchStart] = useState<{ x: number; distance: number } | null>(null)
//   const handleTouchStart = useCallback((e: React.TouchEvent) => {
//     e.preventDefault()
//     if (e.touches.length === 1) {
//       setTouchStart({ x: e.touches[0].clientX, distance: 0 })
//       setIsDragging(true)
//     } else if (e.touches.length === 2) {
//       const distance = Math.sqrt(
//         Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
//           Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2),
//       )
//       setTouchStart({ x: 0, distance })
//       setIsDragging(false)
//     }
//   }, [])
//   const handleTouchMove = useCallback(
//     (e: React.TouchEvent) => {
//       e.preventDefault()
//       if (!touchStart) return
//       if (e.touches.length === 1 && isDragging) {
//         const deltaX = e.touches[0].clientX - touchStart.x
//         setPanX((prev) => prev + deltaX)
//         setTouchStart({ ...touchStart, x: e.touches[0].clientX })
//       } else if (e.touches.length === 2 && touchStart.distance > 0) {
//         const distance = Math.sqrt(
//           Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
//             Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2),
//         )
//         const zoomFactor = distance / touchStart.distance
//         const newZoom = Math.max(0.5, Math.min(5, zoom * zoomFactor))
//         setZoom(newZoom)
//         setTouchStart({ ...touchStart, distance })
//       }
//     },
//     [touchStart, isDragging, zoom],
//   )
//   const handleTouchEnd = useCallback(() => {
//     setTouchStart(null)
//     setIsDragging(false)
//   }, [])

//   const formatTimeDisplay = useCallback((ms: number) => {
//     if (ms < 0) ms = 0
//     const totalSeconds = Math.floor(ms / 1000)
//     const minutes = Math.floor(totalSeconds / 60)
//     const seconds = totalSeconds % 60
//     return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
//   }, [])

//   const drawChart = useCallback(() => {
//     const canvas = canvasRef.current
//     if (!canvas || !marketState || marketState.candleData.length === 0) return

//     const { candleData: currentCandleData, currentPrice } = marketState
//     const activeMode = currentUserDetails?.activeMode || "demo"

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     const dpr = window.devicePixelRatio || 1
//     const actualWidth = containerRef.current?.clientWidth || dimensions.width
//     const actualHeight = containerRef.current?.clientHeight || dimensions.height
//     canvas.width = actualWidth * dpr
//     canvas.height = actualHeight * dpr
//     canvas.style.width = actualWidth + "px"
//     canvas.style.height = actualHeight + "px"
//     ctx.scale(dpr, dpr)
//     const { width, height } = { width: actualWidth, height: actualHeight }

//     ctx.fillStyle = "#0B0E14"
//     ctx.fillRect(0, 0, width, height)

//     const prices = currentCandleData.flatMap((c) => [c.high, c.low, c.open, c.close])
//     prices.push(currentPrice)
//     const minPrice = Math.min(...prices.filter((p) => p !== undefined && p !== null))
//     const maxPrice = Math.max(...prices.filter((p) => p !== undefined && p !== null))
//     const priceRange = maxPrice - minPrice || 1
//     const paddingY = priceRange * 0.1
//     const chartMinPrice = minPrice - paddingY
//     const chartMaxPrice = maxPrice + paddingY
//     const chartPriceRange = chartMaxPrice - chartMinPrice || 1

//     ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
//     ctx.lineWidth = 1
//     for (let i = 0; i <= 8; i++) {
//       const y = (height / 8) * i
//       ctx.beginPath()
//       ctx.moveTo(0, y)
//       ctx.lineTo(width, y)
//       ctx.stroke()
//     }
//     for (let i = 0; i <= 10; i++) {
//       const x = (width / 10) * i
//       ctx.beginPath()
//       ctx.moveTo(x, 0)
//       ctx.lineTo(x, height)
//       ctx.stroke()
//     }

//     const baseWidth = width / Math.max(currentCandleData.length, 50)
//     const candleWidth = baseWidth * zoom
//     const startIndex = Math.max(0, Math.floor(-panX / candleWidth))
//     const endIndex = Math.min(currentCandleData.length, startIndex + Math.ceil(width / candleWidth) + 2)

//     const visibleCandleData = currentCandleData.slice(startIndex, endIndex)

//     if (chartType === "Candles") {
//       const bodyWidth = Math.max(1, candleWidth * 0.8)
//       for (let i = 0; i < visibleCandleData.length; i++) {
//         const candle = visibleCandleData[i]
//         const actualIndex = startIndex + i
//         const x = panX + actualIndex * candleWidth + candleWidth / 2
//         if (x < -candleWidth || x > width + candleWidth) continue

//         const openY = height - ((candle.open - chartMinPrice) / chartPriceRange) * height
//         const closeY = height - ((candle.close - chartMinPrice) / chartPriceRange) * height
//         const highY = height - ((candle.high - chartMinPrice) / chartPriceRange) * height
//         const lowY = height - ((candle.low - chartMinPrice) / chartPriceRange) * height
//         const isGreen = candle.close > candle.open
//         const color = isGreen ? "#00C851" : "#FF4444"
//         const isLiveCandle = !candle.isComplete
//         const candleOpacity = isLiveCandle ? 0.8 : 1.0

//         ctx.globalAlpha = candleOpacity
//         ctx.strokeStyle = color
//         ctx.lineWidth = Math.max(1, candleWidth * 0.1)
//         ctx.beginPath()
//         ctx.moveTo(x, highY)
//         ctx.lineTo(x, lowY)
//         ctx.stroke()
//         const bodyTop = Math.min(openY, closeY)
//         const bodyHeight = Math.abs(closeY - openY) || 1
//         ctx.fillStyle = color
//         ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight)
//         if (isLiveCandle) {
//           ctx.strokeStyle = "#FFD700"
//           ctx.lineWidth = 1
//           ctx.strokeRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight)
//         }
//         ctx.globalAlpha = 1.0
//       }
//     } else if (chartType === "Line" || chartType === "Area") {
//       ctx.beginPath()
//       let firstPoint = true
//       let firstX = 0

//       for (let i = 0; i < visibleCandleData.length; i++) {
//         const candle = visibleCandleData[i]
//         const actualIndex = startIndex + i
//         const x = panX + actualIndex * candleWidth + candleWidth / 2
//         if (x < -candleWidth && x > width + candleWidth && i < visibleCandleData.length - 1) continue

//         const y = height - ((candle.close - chartMinPrice) / chartPriceRange) * height

//         if (firstPoint) {
//           ctx.moveTo(x, y)
//           firstX = x
//           firstPoint = false
//         } else {
//           ctx.lineTo(x, y)
//         }
//       }

//       if (chartType === "Area") {
//         if (!firstPoint && visibleCandleData.length > 0) {
//           const lastCandleIndex = startIndex + visibleCandleData.length - 1
//           const lastX = panX + lastCandleIndex * candleWidth + candleWidth / 2
//           ctx.lineTo(lastX, height)
//           ctx.lineTo(firstX, height)
//           ctx.closePath()
//           ctx.fillStyle = "rgba(75, 192, 192, 0.2)"
//           ctx.fill()
//         }
//       }

//       ctx.strokeStyle = "#4BC0C0"
//       ctx.lineWidth = 1.5
//       ctx.stroke()
//     }

//     const tradesToMark = currentUser?.id
//       ? allTrades.filter(
//           (t: Trade) =>
//             t.userId === currentUser.id && t.status === "active" && t.market === symbol && t.mode === activeMode,
//         )
//       : []

//     for (let i = 0; i < visibleCandleData.length; i++) {
//       const candle = visibleCandleData[i]
//       const actualIndex = startIndex + i
//       const x = panX + actualIndex * candleWidth + candleWidth / 2
//       if (x < -candleWidth || x > width + candleWidth) continue

//       const currentTime = Date.now()
//       tradesToMark.forEach((trade) => {
//         if (trade.entryCandleTime === candle.time) {
//           const expirationTimestamp = new Date(trade.endTime).getTime()
//           const remainingMs = expirationTimestamp - currentTime
//           if (remainingMs <= 0) return

//           const remainingTimeStr = formatTimeDisplay(remainingMs)
//           const entryPriceY = height - ((trade.entryPrice - chartMinPrice) / chartPriceRange) * height
//           const isUpTrade = trade.direction === "up"
//           const badgeColor = isUpTrade ? "rgba(26, 173, 114, 0.95)" : "rgba(239, 68, 68, 0.95)"
//           const lineColor = badgeColor
//           const tradeAmountStr = `${trade.investment}$`
//           const iconSize = isMobile ? 7 : 8
//           const textSizeAmount = isMobile ? 9 : 10
//           const textSizeTime = isMobile ? 8 : 9
//           const paddingH = isMobile ? 5 : 7
//           const paddingV = isMobile ? 3 : 4
//           const spacing = isMobile ? 2 : 3

//           ctx.font = `bold ${textSizeAmount}px Arial`
//           const amountWidth = ctx.measureText(tradeAmountStr).width
//           ctx.font = `${textSizeTime}px Arial`
//           const timeWidth = ctx.measureText(remainingTimeStr).width

//           const badgeHeight = iconSize + paddingV * 2
//           const badgeContentWidth = iconSize + spacing + amountWidth + spacing + timeWidth
//           const badgeWidth = badgeContentWidth + paddingH * 2
//           const badgeX = x - (candleWidth * 0.8) / 2 - badgeWidth - (isMobile ? 3 : 5)
//           const badgeY = entryPriceY - badgeHeight / 2

//           ctx.fillStyle = badgeColor
//           ctx.beginPath()
//           const radius = badgeHeight / 2
//           ctx.moveTo(badgeX + radius, badgeY)
//           ctx.lineTo(badgeX + badgeWidth - radius, badgeY)
//           ctx.arcTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + radius, radius)
//           ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - radius)
//           ctx.arcTo(
//             badgeX + badgeWidth,
//             badgeY + badgeHeight,
//             badgeX + badgeWidth - radius,
//             badgeY + badgeHeight,
//             radius,
//           )
//           ctx.lineTo(badgeX + radius, badgeY + badgeHeight)
//           ctx.arcTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - radius, radius)
//           ctx.lineTo(badgeX, badgeY + radius)
//           ctx.arcTo(badgeX, badgeY, badgeX + radius, badgeY, radius)
//           ctx.closePath()
//           ctx.fill()

//           ctx.fillStyle = "white"
//           let currentXContent = badgeX + paddingH

//           ctx.beginPath()
//           const arrowCenterY = badgeY + badgeHeight / 2
//           const arrowHalfSize = iconSize / 2
//           if (isUpTrade) {
//             ctx.moveTo(currentXContent, arrowCenterY + arrowHalfSize)
//             ctx.lineTo(currentXContent + iconSize, arrowCenterY + arrowHalfSize)
//             ctx.lineTo(currentXContent + arrowHalfSize, arrowCenterY - arrowHalfSize)
//           } else {
//             ctx.moveTo(currentXContent, arrowCenterY - arrowHalfSize)
//             ctx.lineTo(currentXContent + iconSize, arrowCenterY - arrowHalfSize)
//             ctx.lineTo(currentXContent + arrowHalfSize, arrowCenterY + arrowHalfSize)
//           }
//           ctx.closePath()
//           ctx.fill()
//           currentXContent += iconSize + spacing

//           ctx.font = `bold ${textSizeAmount}px Arial`
//           ctx.textAlign = "left"
//           ctx.textBaseline = "middle"
//           ctx.fillText(tradeAmountStr, currentXContent, arrowCenterY + 0.5)
//           currentXContent += amountWidth + spacing

//           ctx.font = `${textSizeTime}px Arial`
//           ctx.fillText(remainingTimeStr, currentXContent, arrowCenterY + 0.5)

//           const lineStartX = badgeX + badgeWidth
//           const lineLength = isMobile ? 25 : 35
//           const lineEndX = lineStartX + lineLength

//           ctx.strokeStyle = lineColor
//           ctx.lineWidth = 1.5
//           ctx.beginPath()
//           ctx.moveTo(lineStartX, entryPriceY)
//           ctx.lineTo(lineEndX, entryPriceY)
//           ctx.stroke()

//           const arrowHeadSize = isMobile ? 3 : 4
//           ctx.fillStyle = lineColor
//           ctx.beginPath()
//           ctx.moveTo(lineEndX, entryPriceY)
//           ctx.lineTo(lineEndX - arrowHeadSize * 1.5, entryPriceY - arrowHeadSize)
//           ctx.lineTo(lineEndX - arrowHeadSize * 1.5, entryPriceY + arrowHeadSize)
//           ctx.closePath()
//           ctx.fill()
//         }
//       })
//     }

//     const currentPriceY = height - ((currentPrice - chartMinPrice) / chartPriceRange) * height
//     ctx.strokeStyle = "#FFD700"
//     ctx.lineWidth = 2
//     ctx.setLineDash([5, 5])
//     ctx.beginPath()
//     ctx.moveTo(0, currentPriceY)
//     ctx.lineTo(width, currentPriceY)
//     ctx.stroke()
//     ctx.setLineDash([])

//     ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
//     ctx.font = `${isMobile ? 10 : 12}px Arial`
//     ctx.textAlign = "right"
//     for (let i = 0; i <= 8; i++) {
//       const price = chartMaxPrice - (i / 8) * chartPriceRange
//       const yPos = (height / 8) * i + 4
//       const priceText = price.toFixed(symbol.includes("/") || symbol.toLowerCase().includes("otc") ? 5 : 2)
//       ctx.fillText(priceText, width - 10, yPos)
//     }

//     const priceString = currentPrice.toFixed(symbol.includes("/") || symbol.toLowerCase().includes("otc") ? 5 : 2)
//     const countdownString = formatTimeDisplay(timeRemaining)

//     const boxWidth = isMobile ? 70 : 80
//     const boxHeight = isMobile ? 30 : 32
//     const boxX = width - boxWidth - 5
//     const boxY = currentPriceY - boxHeight / 2

//     ctx.fillStyle = "#FFD700"
//     ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

//     ctx.fillStyle = "#000"
//     ctx.textAlign = "center"

//     ctx.font = `bold ${isMobile ? 10 : 11}px Arial`
//     ctx.fillText(priceString, boxX + boxWidth / 2, boxY + (isMobile ? 10 : 11))

//     ctx.font = `${isMobile ? 9 : 10}px Arial`
//     ctx.fillText(countdownString, boxX + boxWidth / 2, boxY + (isMobile ? 22 : 25))

//     ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
//     ctx.font = "12px Arial"
//     ctx.textAlign = "left"
//     ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
//     ctx.font = "10px Arial"
//   }, [
//     marketState,
//     symbol,
//     isMobile,
//     zoom,
//     panX,
//     dimensions,
//     timeRemaining,
//     formatTimeDisplay,
//     allTrades,
//     currentUser,
//     currentUserDetails,
//     chartType,
//   ])

//   useEffect(() => {
//     const animate = () => {
//       drawChart()
//       animationRef.current = requestAnimationFrame(animate)
//     }
//     if (!isLoading && marketState?.isInitialized) {
//       animate()
//     }
//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current)
//     }
//   }, [drawChart, isLoading, marketState]) // marketState is now a dependency

//   const resetZoom = () => {
//     setZoom(1)
//     setPanX(0)
//   }

//   // isLoading is now primarily for the initial load of the component/symbol
//   if (isLoading || !marketState?.isInitialized) {
//     return (
//       <div ref={containerRef} className="h-full w-full flex items-center justify-center bg-[#0B0E14] min-h-[300px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
//           <p className="text-white text-sm">Loading Real-time Chart...</p>
//         </div>
//       </div>
//     )
//   }

//   // marketState might be null briefly before subscription updates, handle safely
//   const currentPriceForInfo = marketState.currentPrice
//   const currentCandleDataForInfo = marketState.candleData

//   return (
//     <div ref={containerRef} className="h-full w-full relative bg-[#0B0E14] overflow-hidden min-h-[300px]">
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full cursor-crosshair select-none block"
//         style={{ touchAction: "none", width: "100%", height: "100%", display: "block" }}
//         onWheel={handleWheel}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       />
//       <div className="absolute top-4 left-4 text-white pointer-events-none">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-lg font-bold">{symbol}</span>
//           <span
//             className={`text-sm ${currentPriceForInfo > (currentCandleDataForInfo[currentCandleDataForInfo.length - 2]?.close || 0) ? "text-green-400" : "text-red-400"}`}
//           >
//             {currentPriceForInfo.toFixed(symbol.includes("/") || symbol.toLowerCase().includes("otc") ? 5 : 2)}
//           </span>
//         </div>
//       </div>
//       <div className="absolute top-4 right-4 flex gap-1 md:gap-2">
//         {chartTypeOptions.map((option) => {
//           const IconComponent = option.icon
//           return (
//             <button
//               key={option.type}
//               onClick={() => setChartType(option.type)}
//               className={cn(
//                 "bg-gray-800/70 hover:bg-gray-700/70 text-white p-1.5 md:p-2 rounded transition-colors flex items-center justify-center",
//                 chartType === option.type && "bg-blue-600/80 ring-1 ring-blue-400",
//               )}
//               aria-label={option.label}
//               aria-pressed={chartType === option.type}
//             >
//               <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
//             </button>
//           )
//         })}
//         <button
//           onClick={resetZoom}
//           className="bg-gray-800/70 hover:bg-gray-700/70 text-white p-1.5 md:p-2 rounded text-xs transition-colors flex items-center justify-center"
//           aria-label="Reset Zoom"
//         >
//           <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
//           Reset
//         </button>
//       </div>
//       <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white pointer-events-none">
//         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//         <span className="text-xs">LIVE</span>
//       </div>
//     </div>
//   )
// }
