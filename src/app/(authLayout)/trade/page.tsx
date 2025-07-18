/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import {
     BarChart3,
     LifeBuoy,
     User,
     Plus,
     Minus,
     ArrowUp,
     ArrowDown,
     LogOut,
     X,
     List,
     ListFilter,
     Grid,
     ArrowDownToLine,
     ArrowUpFromLine,
     ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/reusable/Button/Button";
import Header from "./_components/Header";
import LeftSidebar from "./_components/LeftSidebar";
import RightSidebar from "./_components/RightSidebar";
import { TradeListItem } from "./_components/TradeListItem";
import { SocketView, useSocket } from "./_components/SocketView";
import TradingChart from "./_components/TradingChart";
import Timer from "./_components/Timer";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/Features/Auth/authSlice";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useGetAllSymbolsQuery, useGetMeQuery } from "@/redux/Features/User/userApi";
import { RootState } from "@/redux/store";
import BalanceSwitcher from "./_components/BalanceSwitcher";
import { User as UserType } from "@/type/user";
import MarketItem from "./_components/MarketItem";

export default function TradingPlatform() {
     const dispatch = useDispatch();
     const router = useRouter();
     const { activeTrade } = useSocket();

     const { current: currentAccountType } = useSelector((state: RootState) => state.accountType);
     // console.log("Current account type:", currentAccountType);
     const user = useSelector(useCurrentUser) as any;

     const [loading, setLoading] = useState(true);
     const { data: symbols } = useGetAllSymbolsQuery({});
     const { data: profile } = useGetMeQuery({});

     const [selectedSymbol, setSelectedSymbol] = useState<any>(null);
     const [userData, setUserData] = useState<UserType | null>(null);
     const [candlesData, setCandlesData] = useState<any[]>([]);
     const [tradeLines, setTradeLines] = useState<any[]>([]);
     const [tradeHistory, setTradeHistory] = useState<any>({ trades: [] });
     // const [pendingTrades, setPendingTrades] = useState<any[]>([]);
     const [currentPrice, setCurrentPrice] = useState<number | null>(null);
     const [lastCandleTimestamp, setLastCandleTimestamp] = useState<number | null>(null);
     const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
     const [investmentAmount, setInvestmentAmount] = useState(1);
     const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
     const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
     const [isMobile, setIsMobile] = useState(false);
     const [isMobileTradesPanelOpen, setIsMobileTradesPanelOpen] = useState(false);
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
     const [buyHoverArea, setBuyHoverArea] = useState(null);
     const [sellHoverArea, setSellHoverArea] = useState(null);

     const chartRef = useRef<any>(null);
     const candleSeriesRef = useRef<any>(null);
     const wsRef = useRef<WebSocket | null>(null);
     const candlesDataRef = useRef<any[]>([]);
     const lastTradeTypeRef = useRef<string>("");
     const tradeLinesRef = useRef<any[]>([]);
     const isCreateLine = useRef(false);
     const isSessionEnd = useRef(false);

     useEffect(() => {
          if (symbols?.data?.length) {
               const storedSymbol = localStorage.getItem("selectedSymbol");
               setSelectedSymbol(storedSymbol ? JSON.parse(storedSymbol) : symbols.data[0]);
               setLoading(false);
          }
     }, [symbols]);

     useEffect(() => {
          if (profile?.user) {
               setUserData(profile.user);
          }
     }, [profile]);

     // Update ref whenever candlesData changes
     useEffect(() => {
          candlesDataRef.current = candlesData;
     }, [candlesData]);

     // Update ref whenever tradeLines changes
     useEffect(() => {
          tradeLinesRef.current = tradeLines;
     }, [tradeLines]);

     // const ws = new WebSocket(`ws://test.kajghor.com/ws`);

     // useEffect(() => {

     // }, [pendingTrades]);

     useEffect(() => {
          if (!user?._id || !selectedSymbol?._id) return;

          setLoading(true);

          // WebSocket connection for real-time updates
          const ws = new WebSocket(`wss://api.worldmerket.com/ws`);
          wsRef.current = ws;

          ws.onopen = () => {
               ws.send(
                    JSON.stringify({
                         action: "authenticate",
                         userId: user?._id,
                    })
               );
               ws.send(
                    JSON.stringify({
                         action: "subscribe",
                         symbolId: selectedSymbol?._id,
                    })
               );
               ws?.send(
                    JSON.stringify({
                         action: "get_trade_history",
                         userId: user?._id,
                         symbolId: selectedSymbol?._id,
                    })
               );

               ws?.send(
                    JSON.stringify({
                         action: "get_pending_trade_history",
                         userId: user?._id,
                         symbolId: selectedSymbol?._id,
                    })
               );

               setLoading(false);
          };

          ws.onerror = (err) => {
               console.error("WebSocket error:", err);
               setLoading(false); // also stop loading on error
          };

          ws.onmessage = (e) => {
               const data = JSON.parse(e.data);
               // console.log(JSON.parse(e.data));
               if (data?.type === "trade_timeout") {
                    toast.error("Time out. Trade window closed for this session.");
               }

               if (data?.type === "user_trade_history") {
                    setTradeHistory(data?.data || { trades: [] });
               }

               if (data?.type === "user_pending_trade_history") {
                    if (isCreateLine.current) {
                         if (data?.data?.length <= 0) {
                              removeTradeLines();
                         }
                         data?.data.forEach((trade: any) => {
                              // Check if this trade._id is already in tradeLinesRef.current
                              const alreadyExists =
                                   Array.isArray(tradeLinesRef.current) &&
                                   tradeLinesRef.current.some((line) => line.id === trade._id);

                              if (!alreadyExists) {
                                   handleTradeLine(
                                        trade.bidPrice,
                                        trade.direction === "up" ? "buy" : "sell",
                                        new Date(trade.bidTime).getTime(),
                                        trade._id
                                   );
                              }
                         });
                    } else {
                         if (isSessionEnd.current) {
                              setTimeout(() => {
                                   isCreateLine.current = true;
                                   isSessionEnd.current = false;
                              }, 5000);
                         } else {
                              isCreateLine.current = true;
                         }
                    }
               }

               if (data?.type === "chart_history") {
                    const formattedData = data.data.map((d: any) => {
                         const date = new Date(d.timestamp);
                         date.setSeconds(0, 0); // Zero out seconds and milliseconds
                         const time = Math.floor(date.getTime() / 1000); // time in seconds (minute precision)

                         return {
                              time,
                              open: parseFloat(d.open),
                              high: parseFloat(d.high),
                              low: parseFloat(d.low),
                              close: parseFloat(d.close),
                         };
                    });

                    setCandlesData(formattedData);

                    // Set last candle timestamp for timer on initial load
                    if (formattedData.length > 0) {
                         setLastCandleTimestamp(formattedData[formattedData.length - 1].time);
                         setCurrentTimestamp(Math.floor(Date.now() / 1000));
                    }

                    if (candleSeriesRef.current) {
                         candleSeriesRef.current.setData(formattedData);
                         chartRef.current?.timeScale().scrollToPosition(isMobile ? 8 : 20, false);
                    }
               }

               if (data?.type === "second_price" || data?.type === "new_candle") {
                    // console.log(data);
                    const date = new Date(data?.timestamp);
                    date.setSeconds(0, 0); // Remove seconds and milliseconds

                    const newCandle = {
                         time: Math.floor(date.getTime() / 1000), // time in seconds, aligned to the minute
                         open: parseFloat(data?.data?.ohlc?.open),
                         high: parseFloat(data?.data?.ohlc?.high),
                         low: parseFloat(data?.data?.ohlc?.low),
                         close: parseFloat(data?.data?.ohlc?.close),
                    };

                    // Update timestamps for timer
                    setCurrentTimestamp(Math.floor(Date.now() / 1000));

                    if (data?.type === "new_candle") {
                         setLastCandleTimestamp(newCandle.time);
                    }

                    setCandlesData((prevData) => {
                         const updatedData = [...prevData];

                         if (
                              updatedData.length &&
                              updatedData[updatedData.length - 1].time === newCandle.time
                         ) {
                              updatedData[updatedData.length - 1] = newCandle;
                         } else {
                              updatedData.push(newCandle);
                              if (updatedData.length > 200) updatedData.shift();
                         }

                         setCurrentPrice(newCandle.close);

                         if (candleSeriesRef.current) {
                              candleSeriesRef.current.update(newCandle);
                              // chartRef.current?.timeScale().scrollToPosition(25, false);
                         }

                         return updatedData;
                    });
               }

               if (data?.type === "trade_placed") {
                    if (candlesDataRef.current.length === 0) {
                         return;
                    }

                    updateUserBalanceOnTradePlacement(data?.data?.amount, data?.data?.account_type);

                    const timestamp = new Date(data?.data?.bidTime).getTime();

                    handleTradeLine(
                         data?.data?.bidPrice,
                         data?.data?.direction === "up" ? "buy" : "sell",
                         timestamp,
                         data?.data?._id
                    );

                    // Request updated trade history
                    wsRef.current?.send(
                         JSON.stringify({
                              action: "get_trade_history",
                              userId: user?._id,
                              symbolId: selectedSymbol?._id,
                         })
                    );
               }

               if (data?.type === "session_end") {
                    // console.log("Session ended - removing all price lines");
                    removeTradeLines();
                    isCreateLine.current = false;
                    isSessionEnd.current = true;
               }

               if (data?.type === "trade_result") {
                    const { demo_balance, main_balance, status, account_type, amount, payout } =
                         data?.data;
                    updateUserBalanceOnTradeResult(
                         demo_balance,
                         main_balance,
                         status,
                         account_type
                    );
                    toastMobileTradeResult(amount, payout, status);
                    wsRef.current?.send(
                         JSON.stringify({
                              action: "get_trade_history",
                              userId: user?._id,
                              symbolId: selectedSymbol?._id,
                         })
                    );
               }
          };

          return () => {
               if (wsRef.current) {
                    wsRef.current.close();
               }
          };
     }, [user?._id, selectedSymbol?._id]);

     useEffect(() => {
          const checkIfMobile = () => {
               setIsMobile(window.innerWidth < 768);
          };
          checkIfMobile();
          window.addEventListener("resize", checkIfMobile);
          return () => window.removeEventListener("resize", checkIfMobile);
     }, []);

     useEffect(() => {
          if (!user) {
               router.push("/signin");
          }
     }, [user, router]);

     const removeTradeLines = () => {
          setTradeLines([]);
          // Remove all price lines and series from the chart
          if (Array.isArray(tradeLinesRef.current)) {
               console.log("tradeLine.current:", tradeLinesRef.current);
               tradeLinesRef.current.forEach((tradeLine) => {
                    if (tradeLine.priceLine && candleSeriesRef.current) {
                         console.log("tradeLine.priceLine:");
                         try {
                              candleSeriesRef.current.removePriceLine(tradeLine.priceLine);
                         } catch (e) {
                              console.warn("Failed to remove priceLine", e);
                         }
                    }
                    if (tradeLine.lineSeries && chartRef.current) {
                         console.log("tradeLine.lineSeries:");
                         try {
                              chartRef.current.removeSeries(tradeLine.lineSeries);
                         } catch (e) {
                              console.warn("Failed to remove lineSeries", e);
                         }
                    }
                    if (tradeLine.arrowSeries && chartRef.current) {
                         try {
                              chartRef.current.removeSeries(tradeLine.arrowSeries);
                         } catch (e) {
                              console.warn("Failed to remove arrowSeries", e);
                         }
                    }
               });
          }
     };

     const updateUserBalanceOnTradePlacement = (amount: number, accountType: "demo" | "main") => {
          setUserData((prevUser) => {
               if (!prevUser) return prevUser;

               if (accountType === "demo") {
                    return {
                         ...prevUser,
                         demo_balance: prevUser.demo_balance - amount,
                    };
               }

               if (accountType === "main") {
                    return {
                         ...prevUser,
                         main_balance: prevUser.main_balance - amount,
                    };
               }
          });
     };

     const updateUserBalanceOnTradeResult = (
          demo_balance: number,
          main_balance: number,
          result: "profit" | "loss",
          account_type: "demo" | "main"
     ) => {
          if (result === "loss") return;
          setUserData((prevUser) => {
               if (!prevUser) return prevUser;

               if (account_type === "demo") {
                    return {
                         ...prevUser,
                         demo_balance,
                    };
               } else {
                    return {
                         ...prevUser,
                         main_balance,
                    };
               }
          });
     };

     const updateSelectedSymbol = (symbol: any) => {
          // console.log("Updating selected symbol:", symbol);
          setSelectedSymbol(symbol);
          localStorage.setItem("selectedSymbol", JSON.stringify(symbol));
     };

     // Place trade function
     const placeTrade = (type: string) => {
          if (candlesData.length === 0) {
               alert("No candle data yet");
               return;
          }

          // Store the trade type for later use
          lastTradeTypeRef.current = type;
          // console.log("bidPrice:", bidPrice);
          console.log("currentAccountType:", currentAccountType);

          const tradeData = JSON.stringify({
               action: "place_trade",
               bidPrice: currentPrice,
               userId: user?._id,
               symbolId: selectedSymbol?._id,
               direction: type === "buy" ? "up" : "down",
               amount: investmentAmount,
               account_type: currentAccountType, // Use current account type from Redux
          });
          wsRef.current?.send(tradeData);
     };

     const addTradeLine = (type: string) => {
          placeTrade(type);
     };

     const handleTradeLine = (price: number, tradeType: string, timestamp: number, id: string) => {
          // Create price line on the candle series
          if (candlesDataRef.current.length === 0) return;
          const priceLine = candleSeriesRef.current?.createPriceLine({
               price: price,
               color: tradeType === "buy" ? "#28a745" : "#dc3545",
               lineWidth: 2,
               lineStyle: 0, // Solid
               axisLabelVisible: true,
               title: tradeType === "buy" ? "🔼 Buy" : "🔽 Sell" + " - " + price,
          });

          // Create horizontal line across the chart
          // const lineSeries = chartRef.current?.addLineSeries({
          //      color: tradeType === "buy" ? "#28a74580" : "#dc354580",
          //      lineWidth: 2,
          //      lineStyle: 1, // Dashed
          // });

          // Get the time range of the chart
          // const firstTime = candlesDataRef.current[0]?.time;

          // lineSeries?.setData([{ time: timestamp, value: price }]);

          setTradeLines((prev) => {
               if (!Array.isArray(prev)) return [{ priceLine, type: tradeType, price, id }];
               return [...prev, { priceLine, type: tradeType, price, id }];
          });
     };

     const createHoverOverlay = (type: string) => {
          if (candlesData.length === 0) return null;

          const lastCandle = candlesData[candlesData.length - 1];
          const currentPrice = lastCandle.close;

          // Get visible price range
          const priceRange = chartRef.current?.timeScale().getVisibleRange();
          if (!priceRange) return null;

          // Get first and last time in visible range
          const firstTime = priceRange.from;
          const lastTime = priceRange.to;

          // Create area series for the overlay
          const areaSeries = chartRef.current?.addAreaSeries({
               lineColor: "transparent",
               topColor: type === "buy" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
               bottomColor: "rgba(255, 255, 255, 0)",
               lineWidth: 0,
          });

          // Create data points for the overlay with unique time values
          const data = [
               {
                    time: firstTime,
                    value: type === "buy" ? currentPrice + 100 : currentPrice,
               },
               {
                    time: firstTime + 1,
                    value: type === "buy" ? currentPrice + 100 : currentPrice,
               },
               {
                    time: lastTime - 1,
                    value: type === "buy" ? currentPrice : currentPrice,
               },
               {
                    time: lastTime,
                    value: type === "buy" ? currentPrice : currentPrice,
               },
          ];

          areaSeries?.setData(data);

          return areaSeries;
     };

     const removeHoverOverlay = (areaSeries: any) => {
          if (areaSeries) {
               chartRef.current?.removeSeries(areaSeries);
          }
     };

     const handleLogout = async () => {
          // Remove cookies
          Cookies.remove("accessToken");
          // Dispatch logout and navigate
          dispatch(logout());
          toast.success("Logged out successfully.");
          localStorage.clear();
          router.push("/signin");
     };

     const toggleMarketDropdown = () => {
          setIsMarketDropdownOpen(!isMarketDropdownOpen);
     };

     const handleBuyHover = () => {
          // if (buyHoverArea) removeHoverOverlay();
          // const area = createHoverOverlay();
          if (buyHoverArea) removeHoverOverlay(buyHoverArea);
          // const area = createHoverOverlay("buy");
          // setBuyHoverArea(area as any);
     };

     const handleBuyLeave = () => {
          if (buyHoverArea) {
               // removeHoverOverlay();
               removeHoverOverlay(buyHoverArea);
               setBuyHoverArea(null);
          }
     };

     const handleSellHover = () => {
          // if (sellHoverArea) removeHoverOverlay();
          // const area = createHoverOverlay();
          if (sellHoverArea) removeHoverOverlay(sellHoverArea);
          // const area = createHoverOverlay("sell");
          // setSellHoverArea(area as any);
     };

     const handleSellLeave = () => {
          if (sellHoverArea) {
               // removeHoverOverlay();
               removeHoverOverlay(sellHoverArea);
               setSellHoverArea(null);
          }
     };

     const toastMobileTradeResult = (amount: number, payout: number, status: "profit" | "loss") => {
          if (typeof window === "undefined" || !isMobile) return;

          const formattedAmount = amount.toFixed(2);
          const formattedPayout = payout.toFixed(2);
          const message = `Trade ${
               status === "profit" ? `won ${formattedPayout}` : `lost ${formattedAmount}`
          }`;

          const toastFunction = status === "profit" ? toast.success : toast.error;
          toastFunction(message);
     };

     // Mobile View
     if (isMobile) {
          const menuItems = [
               { href: "/trade", icon: BarChart3, label: "Trading" },
               { href: "/deposit-history", icon: ArrowDownToLine, label: "Deposit" },
               { href: "/withdraw-history", icon: ArrowUpFromLine, label: "Withdrawal" },
               { href: "/account", icon: User, label: "Account" },
               { href: "/support", icon: LifeBuoy, label: "Support" },
               { href: "/trades-history", icon: ListFilter, label: "Trades" },
          ];

          return (
               <div className="flex flex-col h-[100dvh] w-full bg-[#1C1F2A] text-white overflow-hidden">
                    {/* Mobile navbar */}
                    <header className="flex h-12 items-center justify-between px-3 border-b border-gray-800 shrink-0">
                         <div className="flex items-center gap-3">
                              <BalanceSwitcher
                                   demoBalance={userData?.demo_balance}
                                   mainBalance={userData?.main_balance}
                              />
                         </div>
                         <div className="flex items-center gap-2">
                              <Button
                                   className="bg-green-500 hover:bg-green-600 text-xs px-4 py-1.5 h-7"
                                   onClick={() => router.push("/deposit-history")}>
                                   Deposit
                              </Button>
                              <button
                                   onClick={handleLogout}
                                   className="text-red-500 p-1 cursor-pointer">
                                   <LogOut size={18} />
                              </button>
                         </div>
                    </header>

                    {/* Mobile Chart Area */}
                    <div className="relative flex-1 min-h-0">
                         {loading ? (
                              <p className="text-white... text-center">Loading...</p>
                         ) : (
                              <>
                                   <TradingChart
                                        chartRef={chartRef}
                                        candleSeriesRef={candleSeriesRef}
                                        isMobile={isMobile}
                                   />
                                   <Timer
                                        lastCandleTimestamp={lastCandleTimestamp}
                                        currentTimestamp={currentTimestamp}
                                        // timer={timer}
                                   />
                              </>
                         )}
                    </div>

                    {/* Mobile Market Selector */}
                    {/* Mobile Market Selector - Optimized */}
                    <div className="relative mt-3">
                         {/* Dropdown Trigger */}
                         <div
                              className="flex items-center p-2 rounded hover:bg-gray-800/50 cursor-pointer transition-colors"
                              onClick={toggleMarketDropdown}>
                              <span className="mr-1 min-w-[24px] text-center">📊</span>
                              <span className="font-medium truncate max-w-[100px]">
                                   {selectedSymbol?.pair}
                              </span>
                              <span className="ml-1 text-yellow-500 uppercase">
                                   ({selectedSymbol?.market_type})
                              </span>
                              <ChevronUp
                                   size={16}
                                   className={`ml-auto transition-transform ${
                                        isMarketDropdownOpen ? "rotate-180" : ""
                                   }`}
                              />
                         </div>

                         {/* Dropdown Content */}
                         <div
                              className={`absolute bottom-full inset-x-0 bg-[#1A1D27] rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-300 ease-in-out transform ${
                                   isMarketDropdownOpen
                                        ? "slide-up"
                                        : "pointer-events-none slide-down"
                              }`}>
                              {/* Header */}
                              <div className="sticky top-0 bg-[#0B0E14] p-2 z-10 border-b border-gray-700">
                                   <h3 className="font-medium">All Pairs</h3>
                              </div>

                              <div className="max-h-[60vh] overflow-y-auto">
                                   {symbols?.data?.length > 0 ? (
                                        <div className="divide-y divide-gray-700">
                                             {symbols.data.map((market) => (
                                                  <MarketItem
                                                       key={market.name}
                                                       market={market}
                                                       onClick={() => {
                                                            updateSelectedSymbol(market);
                                                            setIsMarketDropdownOpen(false);
                                                       }}
                                                  />
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="p-4 text-center text-gray-400">
                                             No markets found
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>

                    {/* Mobile Trading Controls */}
                    <div className="bg-[#1A1D27] px-3 pt-1 pb-2 shrink-0">
                         <div className="bg-[#1A1D27] px-3 pt-3 shrink-0">
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                   {/* Timer  Section */}
                                   <div className="relative">
                                        <div className="text-[11px] text-gray-400 mb-1">Timer</div>
                                        <div className="h-9 rounded border border-gray-600 bg-[#252833] flex items-center justify-center">
                                             <span className="text-sm font-medium">1 Minute</span>
                                        </div>
                                   </div>
                                   {/* Investment Section */}
                                   <div>
                                        <div className="flex items-center justify-between mb-1">
                                             <span className="text-[11px] text-gray-400">
                                                  Investment
                                             </span>
                                        </div>
                                        <div className="relative">
                                             <div className="h-9 rounded border border-gray-600 bg-[#252833] flex items-center justify-between px-2 cursor-pointer">
                                                  <button
                                                       onClick={() =>
                                                            setInvestmentAmount(
                                                                 Math.max(1, investmentAmount - 1)
                                                            )
                                                       }
                                                       className="text-gray-400 p-1"
                                                       disabled={investmentAmount <= 1}>
                                                       <Minus size={16} />
                                                  </button>
                                                  <button
                                                       onClick={() =>
                                                            setIsInvestmentModalOpen(true)
                                                       }
                                                       className="cursor-pointer">
                                                       {investmentAmount} $
                                                  </button>
                                                  <button
                                                       onClick={() =>
                                                            setInvestmentAmount(
                                                                 investmentAmount + 1
                                                            )
                                                       }
                                                       className="text-gray-400 p-1">
                                                       <Plus size={16} />
                                                  </button>
                                             </div>
                                             {isInvestmentModalOpen && (
                                                  <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-[#252833] border border-gray-700 rounded shadow-lg z-50">
                                                       <div className="mb-2">
                                                            <input
                                                                 className="w-full bg-[#1C1F2A] border border-gray-700 rounded py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
                                                                 placeholder="Enter amount"
                                                                 type="number"
                                                                 defaultValue="1"
                                                                 onChange={(e) =>
                                                                      setInvestmentAmount(
                                                                           Math.max(
                                                                                1,
                                                                                Number(
                                                                                     e.target.value
                                                                                )
                                                                           )
                                                                      )
                                                                 }
                                                            />
                                                       </div>
                                                       <button
                                                            onClick={() =>
                                                                 setIsInvestmentModalOpen(false)
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 w-full bg-blue-500 hover:bg-blue-600">
                                                            Set Amount
                                                       </button>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                   <Button
                                        onClick={() => addTradeLine("sell")}
                                        onMouseEnter={handleSellHover}
                                        onMouseLeave={handleSellLeave}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 h-11 bg-red-500 hover:bg-red-600 text-white font-medium rounded">
                                        {activeTrade === "down" ? "Trading..." : "Down"}
                                        <ArrowDown className="ml-2" size={16} />
                                   </Button>
                                   <Button
                                        onClick={() => {
                                             addTradeLine("buy");
                                             // console.log("object");
                                        }}
                                        onMouseEnter={handleBuyHover}
                                        onMouseLeave={handleBuyLeave}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 h-11 bg-green-500 hover:bg-green-600 text-white font-medium rounded">
                                        {activeTrade === "up" ? "Trading..." : "Up"}
                                        <ArrowUp className="ml-2" size={16} />
                                   </Button>
                              </div>
                         </div>
                    </div>

                    {/* Mobile Bottom Navigation */}
                    <nav className="flex items-center justify-around h-12 border-t border-gray-800 bg-[#1A1D27] shrink-0 z-10">
                         {/* Item 1: Menu Button (Replaces old Trade link) */}
                         <button
                              onClick={() => setIsMobileMenuOpen(true)}
                              className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
                              <Grid size={20} />
                              {/* Optional: add text label if desired, e.g., <span className="text-[9px] mt-0.5">Menu</span> */}
                         </button>

                         {/* Item 3: Trades History */}
                         <Link
                              href="/trades-history"
                              className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
                              <ListFilter size={20} />
                              {/* <span className="text-[9px] mt-0.5">Trades</span> */}
                         </Link>

                         {/* Item 4: Account */}
                         <Link
                              href="/account"
                              className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
                              <User size={20} />
                              {/* <span className="text-[9px] mt-0.5">Account</span> */}
                         </Link>

                         {/* Item 5: Support */}
                         <Link
                              href="/support"
                              className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
                              <LifeBuoy size={20} />
                              {/* <span className="text-[9px] mt-0.5">Support</span> */}
                         </Link>

                         {/* Item 6: Mobile Trades Panel Button */}
                         <button
                              onClick={() => setIsMobileTradesPanelOpen(true)}
                              className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400 z-10">
                              <List size={20} />
                              {/* <span className="text-[9px] mt-0.5">Active</span> */}
                         </button>
                    </nav>

                    {/* Mobile Menu Drawer */}
                    {isMobileMenuOpen && (
                         <>
                              <div
                                   className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
                                   onClick={() => setIsMobileMenuOpen(false)}
                                   aria-hidden="true"
                              />
                              <div
                                   className={`fixed bottom-0 left-0 right-0 bg-[#141720] border-t border-gray-700 rounded-t-2xl p-4 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                                        isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
                                   }`}
                                   role="dialog"
                                   aria-modal="true"
                                   aria-labelledby="mobile-menu-title">
                                   <div className="flex justify-between items-center mb-5">
                                        <h3
                                             id="mobile-menu-title"
                                             className="text-lg font-semibold text-slate-100">
                                             Menu
                                        </h3>
                                        <button
                                             onClick={() => setIsMobileMenuOpen(false)}
                                             className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                                             aria-label="Close menu">
                                             <X size={22} />
                                        </button>
                                   </div>
                                   <nav className="grid grid-cols-3 gap-3">
                                        {menuItems.map((item) => (
                                             <Link
                                                  key={item.href}
                                                  href={item.href}
                                                  className="flex flex-col items-center justify-center p-3 bg-[#1C1F2A] rounded-lg hover:bg-gray-700/70 transition-colors space-y-1.5"
                                                  onClick={() => setIsMobileMenuOpen(false)}>
                                                  <item.icon
                                                       size={24}
                                                       className="text-purple-400"
                                                  />
                                                  <span className="text-xs text-center text-slate-200">
                                                       {item.label}
                                                  </span>
                                             </Link>
                                        ))}
                                   </nav>
                                   {/* {socialMediaItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <p className="text-xs text-center text-gray-400 mb-3">Follow us on</p>
                  <div className="flex justify-center items-center space-x-5">
                    {socialMediaItems.map((item) => {
                      const IconComponent = getIconComponentByName(item.iconName)
                      if (!IconComponent) {
                        // Optionally, log a warning or render a default link icon
                        console.warn(`Mobile Menu: Icon not found for ${item.iconName}`)
                        return null
                      }
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.name}
                          aria-label={item.name}
                          className="text-gray-300 hover:text-purple-400 transition-colors"
                        >
                          <IconComponent size={24} />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )} */}
                                   <div className="mt-4 h-1" />
                              </div>
                         </>
                    )}

                    {/* Mobile Trades Panel */}
                    {isMobileTradesPanelOpen && (
                         <>
                              <div
                                   className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                                   onClick={() => setIsMobileTradesPanelOpen(false)}
                              />
                              <div className="fixed bottom-0 left-0 right-0 max-h-[70vh] bg-[#141720] p-4 rounded-t-xl shadow-2xl z-50 flex flex-col">
                                   <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700/50">
                                        <h3 className="text-md font-semibold text-white">
                                             Your Trades
                                        </h3>
                                        <button
                                             onClick={() => setIsMobileTradesPanelOpen(false)}
                                             className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
                                             <X size={20} />
                                        </button>
                                   </div>
                                   <div className="p-3 max-h-[250px] overflow-y-auto space-y-2">
                                        {tradeHistory?.trades?.length > 0 ? (
                                             tradeHistory?.trades?.map((trade: any, index: any) => (
                                                  <TradeListItem
                                                       key={index}
                                                       trade={{
                                                            id: trade._id,
                                                            name: "EUR/USD",
                                                            time: new Date(
                                                                 trade.bidTime
                                                            ).toLocaleTimeString(),
                                                            value: `$${trade.amount}`,
                                                            status: trade.status,
                                                            direction: trade.direction,
                                                       }}
                                                  />
                                             ))
                                        ) : (
                                             <div className="flex flex-col items-center justify-center p-6 text-center">
                                                  <div className="mb-3 rounded-full bg-gray-800 p-3">
                                                       <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <rect
                                                                 x="3"
                                                                 y="16"
                                                                 width="5"
                                                                 height="5"
                                                                 rx="1"
                                                                 fill="#6B7280"
                                                            />
                                                            <rect
                                                                 x="10"
                                                                 y="10"
                                                                 width="5"
                                                                 height="11"
                                                                 rx="1"
                                                                 fill="#6B7280"
                                                            />
                                                            <rect
                                                                 x="17"
                                                                 y="4"
                                                                 width="5"
                                                                 height="17"
                                                                 rx="1"
                                                                 fill="#6B7280"
                                                            />
                                                       </svg>
                                                  </div>
                                                  <p className="mb-1 text-sm text-gray-200">
                                                       You don't have any trades.
                                                  </p>
                                                  <p className="text-xs text-gray-400">
                                                       Open a trade using the form above.
                                                  </p>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </>
                    )}
               </div>
          );
     }

     // Desktop View
     return (
          <SocketView>
               <div className="flex h-screen w-full flex-col bg-[#1C1F2A] text-white overflow-hidden">
                    <Header user={userData} />

                    <div className="flex flex-1 overflow-hidden">
                         <LeftSidebar />

                         <main className="flex flex-1 overflow-hidden">
                              <div className="relative flex-1 overflow-hidden">
                                   {/* <TradingKlineChart/> */}
                                   {loading ? (
                                        <p className="text-white... text-center">Loading...</p>
                                   ) : (
                                        <TradingChart
                                             chartRef={chartRef}
                                             candleSeriesRef={candleSeriesRef}
                                             isMobile={isMobile}
                                        />
                                   )}
                                   {/* <TradeButtons
        onBuyClick={() => addTradeLine('buy')}
        onSellClick={() => addTradeLine('sell')}
        createHoverOverlay={createHoverOverlay}
        removeHoverOverlay={removeHoverOverlay}
      /> */}
                                   <Timer
                                        lastCandleTimestamp={lastCandleTimestamp}
                                        currentTimestamp={currentTimestamp}
                                        // timer={timer}
                                   />
                              </div>
                              <RightSidebar
                                   onBuyClick={() => addTradeLine("buy")}
                                   onSellClick={() => addTradeLine("sell")}
                                   createHoverOverlay={createHoverOverlay}
                                   removeHoverOverlay={removeHoverOverlay}
                                   setInvestmentAmount={setInvestmentAmount}
                                   investmentAmount={investmentAmount}
                                   tradeHistory={tradeHistory}
                                   symbols={symbols}
                                   selectedSymbol={selectedSymbol}
                                   updateSelectedSymbol={updateSelectedSymbol}
                              />
                         </main>
                    </div>
               </div>
          </SocketView>
     );
}
