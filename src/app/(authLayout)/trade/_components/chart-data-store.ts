// import { create } from "zustand"
// import type { CandleData } from "./quotex-chart"

// // Utility: Get initial price
// const getInitialPriceForStore = (sym: string): number => {
//   if (sym.includes("EUR/USD")) return 1.0734
//   if (sym.includes("GBP/USD")) return 1.2512
//   if (sym.includes("USD/JPY")) return 155.45
//   if (sym.includes("AUD/USD")) return 0.6605
//   if (sym.includes("Bitcoin") || sym.includes("BTC/USD")) return 67123.45
//   if (sym.includes("Ethereum") || sym.includes("ETH/USD")) return 3123.45
//   if (sym.includes("Apple") || sym.includes("AAPL")) return 180.5
//   if (sym.includes("Tesla") || sym.includes("TSLA")) return 175.2
//   if (sym.includes("Boeing") || sym.includes("BA")) return 220.0
//   if (sym.includes("FX")) return Number.parseFloat((1 + Math.random() * 0.5).toFixed(4))
//   if (sym.includes("OTC")) return Number.parseFloat((50 + Math.random() * 150).toFixed(2))
//   if (sym.includes("STK")) return Number.parseFloat((100 + Math.random() * 200).toFixed(2))
//   if (sym.includes("CRY")) return Number.parseFloat((1000 + Math.random() * 50000).toFixed(2))
//   return 100
// }

// // Utility: Get current minute timestamp
// const getCurrentMinuteTime = (): number => {
//   const now = new Date()
//   now.setSeconds(0, 0)
//   return now.getTime()
// }

// // Utility: Get next minute timestamp
// const getNextMinuteTime = (): number => {
//   const now = new Date()
//   now.setSeconds(0, 0)
//   now.setMinutes(now.getMinutes() + 1)
//   return now.getTime()
// }

// // Utility: Generate historical data
// const generateHistoricalDataForStore = (basePrice: number, count = 100): CandleData[] => {
//   const data: CandleData[] = []
//   let currentPriceVal = basePrice
//   const now = getCurrentMinuteTime()

//   for (let i = count - 1; i >= 0; i--) {
//     const time = now - i * 60000 // 1 minute intervals
//     const volatility = basePrice * 0.002

//     const open = currentPriceVal
//     const change = (Math.random() - 0.5) * volatility * 2
//     const high = open + Math.abs(change) + Math.random() * volatility
//     const low = open - Math.abs(change) - Math.random() * volatility
//     const close = low + Math.random() * (high - low)

//     data.push({
//       time,
//       open,
//       high,
//       low,
//       close,
//       isComplete: true,
//     })
//     currentPriceVal = close
//   }
//   return data
// }

// export interface MarketChartState {
//   candleData: CandleData[]
//   currentPrice: number
//   nextCandleTime: number
//   isInitialized: boolean
//   symbol: string
// }

// const GLOBAL_UPDATE_INTERVAL_MS = 1000 // Update every second

// export interface ChartDataStore {
//   marketCharts: Record<string, MarketChartState>
//   _globalUpdateInterval: NodeJS.Timeout | null
//   getMarketChartState: (symbol: string) => MarketChartState | undefined
//   initializeMarket: (symbol: string) => MarketChartState
//   updateMarketPrice: (symbol: string, newPrice: number) => void
//   createNewCandle: (symbol: string) => void
//   startGlobalUpdates: () => void
//   stopGlobalUpdates: () => void
// }

// export const useChartDataStore = create<ChartDataStore>((set, get) => ({
//   marketCharts: {},
//   _globalUpdateInterval: null,

//   getMarketChartState: (symbol) => {
//     return get().marketCharts[symbol]
//   },

//   startGlobalUpdates: () => {
//     if (get()._globalUpdateInterval) return // Already running

//     const intervalId = setInterval(() => {
//       const { marketCharts, updateMarketPrice, createNewCandle } = get()
//       const now = Date.now()

//       Object.keys(marketCharts).forEach((symbol) => {
//         const marketState = marketCharts[symbol]
//         if (!marketState || !marketState.isInitialized) return

//         // Simulate price tick
//         const currentPrice = marketState.currentPrice
//         const volatility = currentPrice * 0.0003 // Volatility for live ticks
//         const change = (Math.random() - 0.5) * volatility * 2
//         const newPrice = currentPrice + change
//         updateMarketPrice(symbol, newPrice)

//         // Check for new candle
//         if (now >= marketState.nextCandleTime) {
//           createNewCandle(symbol)
//         }
//       })
//     }, GLOBAL_UPDATE_INTERVAL_MS)

//     set({ _globalUpdateInterval: intervalId })
//   },

//   stopGlobalUpdates: () => {
//     if (get()._globalUpdateInterval) {
//       clearInterval(get()._globalUpdateInterval!)
//       set({ _globalUpdateInterval: null })
//     }
//   },

//   initializeMarket: (symbol) => {
//     const existing = get().marketCharts[symbol]
//     if (existing?.isInitialized) {
//       if (!get()._globalUpdateInterval) {
//         get().startGlobalUpdates()
//       }
//       return existing
//     }

//     const basePrice = getInitialPriceForStore(symbol)
//     const historicalData = generateHistoricalDataForStore(basePrice)
//     const lastHistoricalCandle = historicalData[historicalData.length - 1]
//     const currentOpenPrice = lastHistoricalCandle ? lastHistoricalCandle.close : basePrice

//     const liveCandle: CandleData = {
//       time: getCurrentMinuteTime(),
//       open: currentOpenPrice,
//       high: currentOpenPrice,
//       low: currentOpenPrice,
//       close: currentOpenPrice,
//       isComplete: false,
//     }

//     const newMarketState: MarketChartState = {
//       symbol,
//       candleData: [...historicalData, liveCandle],
//       currentPrice: currentOpenPrice,
//       nextCandleTime: getNextMinuteTime(),
//       isInitialized: true,
//     }

//     set((state) => ({
//       marketCharts: {
//         ...state.marketCharts,
//         [symbol]: newMarketState,
//       },
//     }))

//     if (!get()._globalUpdateInterval) {
//       get().startGlobalUpdates()
//     }
//     return newMarketState
//   },

//   updateMarketPrice: (symbol, newPrice) => {
//     set((state) => {
//       const marketState = state.marketCharts[symbol]
//       if (!marketState || marketState.candleData.length === 0) return state

//       const updatedCandleData = [...marketState.candleData]
//       const lastCandle = updatedCandleData[updatedCandleData.length - 1]

//       if (lastCandle && !lastCandle.isComplete) {
//         lastCandle.close = newPrice
//         lastCandle.high = Math.max(lastCandle.high, newPrice)
//         lastCandle.low = Math.min(lastCandle.low, newPrice)
//       }

//       return {
//         marketCharts: {
//           ...state.marketCharts,
//           [symbol]: {
//             ...marketState,
//             candleData: updatedCandleData,
//             currentPrice: newPrice,
//           },
//         },
//       }
//     })
//   },

//   createNewCandle: (symbol) => {
//     set((state) => {
//       const marketState = state.marketCharts[symbol]
//       if (!marketState) return state

//       const updatedCandleData = [...marketState.candleData]
//       const lastCandle = updatedCandleData[updatedCandleData.length - 1]

//       if (lastCandle) {
//         lastCandle.isComplete = true
//       }

//       const newOpenPrice = lastCandle ? lastCandle.close : marketState.currentPrice

//       const newCandle: CandleData = {
//         time: getCurrentMinuteTime(),
//         open: newOpenPrice,
//         high: newOpenPrice,
//         low: newOpenPrice,
//         close: newOpenPrice,
//         isComplete: false,
//       }

//       const finalCandleData = [...updatedCandleData.slice(-149), newCandle] // Keep last 150 candles

//       return {
//         marketCharts: {
//           ...state.marketCharts,
//           [symbol]: {
//             ...marketState,
//             candleData: finalCandleData,
//             nextCandleTime: getNextMinuteTime(),
//           },
//         },
//       }
//     })
//   },
// }))
