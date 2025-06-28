/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  LifeBuoy,
  User,
  MoreHorizontal,
  Plus,
  Minus,
  Bell,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  LogOut,
  Search,
  X,
  Check,
  Star,
  List,
  ListChecks,
  ListFilter,
  Grid,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/reusable/Button/Button";
import Header from "./_components/Header";
import LeftSidebar from "./_components/LeftSidebar";
import RightSidebar from "./_components/RightSidebar";
import TradingKlineChart from "./_components/TradingKlineChart";
import { TradeListItem } from "./_components/TradeListItem";
import { SocketView } from "./_components/SocketView";
import TradingChart from "./_components/TradingChart";
import Timer from "./_components/Timer";
import { useDispatch, useSelector } from "react-redux";
import { logout, useCurrentUser } from "@/redux/Features/Auth/authSlice";
import { toast } from "sonner";
import Cookies from "js-cookie";

const timeOptions = [
  { label: "1 Minute", value: "00:01:00" },
  { label: "2 Minutes", value: "00:02:00" },
  { label: "3 Minutes", value: "00:03:00" },
  { label: "5 Minutes", value: "00:05:00" },
];

const tradesForPanel = [1, 2, 3, 4];

export default function TradingPlatform() {
  const user = useSelector(useCurrentUser) as any;
  const dispatch = useDispatch();
  const [candlesData, setCandlesData] = useState<any[]>([]);
  const [tradeLines, setTradeLines] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<any>({ trades: [] });
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  console.log(currentPrice);
  const [lastCandleTimestamp, setLastCandleTimestamp] = useState<number | null>(
    null
  );
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const candlesDataRef = useRef<any[]>([]);
  const lastTradeTypeRef = useRef<string>("");
  const tradeLinesRef = useRef<any[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState(1);

  const symbol = "btcusdt";
  const interval = "1m";

  // Update ref whenever candlesData changes
  useEffect(() => {
    candlesDataRef.current = candlesData;
  }, [candlesData]);

  // Update ref whenever tradeLines changes
  useEffect(() => {
    tradeLinesRef.current = tradeLines;
  }, [tradeLines]);

  // const ws = new WebSocket(`ws://test.kajghor.com/ws`);

  useEffect(() => {
    // fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`)
    //   .then(res => {
    //     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    //     return res.json();
    //   })
    //   .then(data => {
    //     const formattedData = data.map(d => ({
    //       time: d[0] / 1000,
    //       open: +d[1],
    //       high: +d[2],
    //       low: +d[3],
    //       close: +d[4],
    //     }));
    //     setCandlesData(formattedData);

    //     if (candleSeriesRef.current) {
    //       candleSeriesRef.current.setData(formattedData);
    //       chartRef.current.timeScale().scrollToPosition(25, false);
    //     }
    //   })
    //   .catch(err => {
    //     console.error('Error loading candle data:', err);
    //     alert('Failed to load candle data. See console for details.');
    //   });

    // WebSocket connection for real-time updates
    const ws = new WebSocket(`wss://test.kajghor.com/ws`);
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
          symbolId: "685d5a29ac54fe77b78af834",
        })
      );
      ws?.send(
        JSON.stringify({
          action: "get_trade_history",
          userId: user?._id,
          symbolId: "685d5a29ac54fe77b78af834",
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // console.log(data?.type);
      // console.log(JSON.parse(e.data));

      if (data?.type === "user_trade_history") {
        console.log("Received trade history:", data?.data);
        setTradeHistory(data?.data || { trades: [] });
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
          chartRef.current?.timeScale().scrollToPosition(25, false);
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

        // console.log(newCandle);

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
            chartRef.current?.timeScale().scrollToPosition(25, false);
          }

          return updatedData;
        });
      }

      if (data?.type === "trade_placed") {
        // Create price line after successful trade placement
        if (candlesDataRef.current.length === 0) {
          console.log("No candle data available for trade placement");
          return;
        }

        const lastCandle =
          candlesDataRef.current[candlesDataRef.current.length - 1];

        const price = lastCandle.close;
        const tradeType = lastTradeTypeRef.current;

        // Create price line on the candle series
        const priceLine = candleSeriesRef.current?.createPriceLine({
          price: price,
          color: tradeType === "buy" ? "#28a745" : "#dc3545",
          lineWidth: 2,
          lineStyle: 0, // Solid
          axisLabelVisible: true,
          title: tradeType === "buy" ? "🔼 Buy" : "🔽 Sell",
        });

        // Create horizontal line across the chart
        const lineSeries = chartRef.current?.addLineSeries({
          color: tradeType === "buy" ? "#28a74580" : "#dc354580",
          lineWidth: 2,
          lineStyle: 1, // Dashed
        });

        // Get the time range of the chart
        const firstTime = candlesDataRef.current[0]?.time;

        lineSeries?.setData([{ time: firstTime, value: price }]);

        setTradeLines((prev) => {
          if (!Array.isArray(prev))
            return [{ priceLine, lineSeries, type: tradeType, price }];
          return [...prev, { priceLine, lineSeries, type: tradeType, price }];
        });

        // Request updated trade history
        wsRef.current?.send(
          JSON.stringify({
            action: "get_trade_history",
            userId: user?._id,
            symbolId: "685d5a29ac54fe77b78af834",
          })
        );
      }

      if (data?.type === "session_end") {
        console.log("Session ended - removing all price lines");

        // Remove all price lines from the chart
        if (Array.isArray(tradeLinesRef.current)) {
          tradeLinesRef.current.forEach((tradeLine) => {
            if (tradeLine.priceLine) {
              candleSeriesRef.current?.removePriceLine(tradeLine.priceLine);
            }
            if (tradeLine.lineSeries) {
              chartRef.current?.removeSeries(tradeLine.lineSeries);
            }
          });
        }

        // Clear the trade lines state
        setTradeLines([]);
        console.log("All price lines removed");
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, interval]);

  const placeTrade = (type: string) => {
    if (candlesData.length === 0) {
      alert("No candle data yet");
      return;
    }

    // Store the trade type for later use
    lastTradeTypeRef.current = type;

     const tradeData = JSON.stringify({
        action: "place_trade",
        userId: user?._id,
        symbolId: "685d5a29ac54fe77b78af834",
        direction: type === "buy" ? "up" : "down",
        amount: investmentAmount,
        account_type: "demo",
      })
      wsRef.current?.send(tradeData);
  };

  const addTradeLine = (type: string) => {
    placeTrade(type);
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
      topColor:
        type === "buy" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
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

  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);
  const [customInvestment, setCustomInvestment] = useState("");
  const investmentModalRef = useRef(null);
  const [isMobileTradesPanelOpen, setIsMobileTradesPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
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
    setIsTimeDropdownOpen(false);
    setSearchTerm("");
    setActiveCategory("All");
  };
  const toggleTimeDropdown = () => {
    setIsTimeDropdownOpen(!isTimeDropdownOpen);
    setIsMarketDropdownOpen(false);
  };
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  console.log(setIsInvestmentModalOpen);
  const categories = ["All", "Favorite", "Forex"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const markets = [
    {
      name: "EUR/USD",
      logo: "EUUS",
      category: "Forex",
      price: 1.05,
      percentage: "85%",
    },
    {
      name: "EUR/USD",
      logo: "EUUS",
      category: "Forex",
      price: 1.05,
      percentage: "85%",
    },
    {
      name: "EUR/USD",
      logo: "EUUS",
      category: "Forex",
      price: 1.05,
      percentage: "85%",
    },
  ];

    useEffect(() => {
      if (!user) {
        router.push("/signin");
      }
    }, [user, router]);

  // Mobile View
  if (isMobile) {
    const menuItems = [
      { href: "/", icon: BarChart3, label: "Trading" },
      { href: "/deposit", icon: ArrowDownToLine, label: "Deposit" },
      { href: "/withdrawal", icon: ArrowUpFromLine, label: "Withdrawal" },
      { href: "/account", icon: User, label: "Account" },
      { href: "/support", icon: LifeBuoy, label: "Support" },
      { href: "/transaction-history", icon: ListChecks, label: "Transactions" },
      { href: "/trades-history", icon: ListFilter, label: "Trades" },
    ];

   

    return (
      <div className="flex flex-col h-[100dvh] w-full bg-[#1C1F2A] text-white overflow-hidden">
        {/* Mobile Top Navigation */}
        <header className="flex h-12 items-center justify-between px-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <button className="p-1">
              <MoreHorizontal size={20} />
            </button>
            {/* <BalanceSwitcher isMobile={true} /> */}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[10px]">
                1
              </span>
            </div>
            <Button
              className="bg-green-500 hover:bg-green-600 text-xs px-4 py-1.5 h-7"
              onClick={() => router.push("/deposit")}
            >
              Deposit
            </Button>
            <button onClick={handleLogout} className="text-red-500 p-1 cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Chart Area */}
        <div className="relative flex-1 min-h-0">
          <TradingKlineChart />
        </div>

        {/* Mobile Market Selector */}
        <div className="relative shrink-0">
          <div
            className="flex items-center justify-between px-3 py-2 border-t border-gray-800 bg-[#1A1D27] cursor-pointer"
            onClick={toggleMarketDropdown}
          >
            <div className="flex items-center gap-1">
              <span className="text-base min-w-[24px] text-center">
                Selected market icon
              </span>
              <span className="text-sm font-medium truncate max-w-[150px]">
                Market name
              </span>
              <span className="text-orange-400 text-sm font-medium">
                percentage
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                isMarketDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isMarketDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full left-0 right-0 bg-[#1A1D27] border-t border-gray-800 max-h-[50vh] overflow-y-auto z-50"
            >
              <div className="sticky top-0 bg-[#1A1D27] p-3 border-b border-gray-800">
                <div className="relative mb-2">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#252833] border border-gray-700 rounded py-2 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setSearchTerm("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="flex overflow-x-auto pb-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                        activeCategory === category
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-gray-300"
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-2">
                {markets.length > 0 ? (
                  markets.map((market, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded hover:bg-gray-800`}
                    >
                      <div
                        className="flex items-center flex-grow cursor-pointer"
                        // onClick={() => selectMarketAndUpdateChart(market)}
                      >
                        <span className="mr-2 text-lg min-w-[24px] text-center">
                          Market icon
                        </span>
                        <div>
                          <div className="font-medium truncate max-w-[180px]">
                            {market.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {market.category}
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-right mr-2 cursor-pointer"
                        // onClick={() => selectMarketAndUpdateChart(market)}
                      >
                        <div>{market.price}</div>
                        <div className="text-yellow-500 text-sm">
                          {market.percentage}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1 text-gray-400 hover:text-yellow-400"
                        // aria-label={market.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star size={18} fill={"yellow"} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No markets found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Trading Controls */}
        <div className="bg-[#1A1D27] px-3 pt-3 pb-2 shrink-0">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <div className="text-[11px] text-gray-400 mb-1">Timer</div>
              <div className="h-9 rounded border border-gray-600 bg-[#252833] flex items-center justify-center">
                <span className="text-sm font-medium">SelectedTimeLevel</span>
              </div>
              <div className="text-center mt-1 relative">
                <button
                  className="text-[10px] text-blue-400 font-medium"
                  onClick={toggleTimeDropdown}
                >
                  SWITCH TIME
                </button>
                {isTimeDropdownOpen && (
                  <div
                    // ref={timeDropdownRef}
                    className="absolute bottom-full left-0 right-0 bg-[#252833] border border-gray-700 rounded shadow-lg z-50 mb-1 w-full"
                  >
                    {timeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center justify-between p-2.5 hover:bg-gray-700 cursor-pointer text-sm`}
                        // onClick={() => selectTime(option)}
                      >
                        <span>{option.label}</span>
                        <Check size={16} className="text-white" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-400">Investment</span>
              </div>
              <div className="relative">
                <div
                  className="h-9 rounded border border-gray-600 bg-[#252833] flex items-center justify-between px-2 cursor-pointer"
                  // onClick={openInvestmentModal}
                >
                  <button className="p-1">
                    <Minus size={14} className="text-gray-400" />
                  </button>
                  <span>Investment 1$</span>
                  <button className="p-1">
                    <Plus size={14} className="text-gray-400" />
                  </button>
                </div>
                {isInvestmentModalOpen && (
                  <div
                    ref={investmentModalRef}
                    className="absolute top-full left-0 right-0 mt-1 p-3 bg-[#252833] border border-gray-700 rounded shadow-lg z-50"
                  >
                    <div className="mb-2">
                      <input
                        type="number"
                        value={customInvestment}
                        onChange={(e) => setCustomInvestment(e.target.value)}
                        className="w-full bg-[#1C1F2A] border border-gray-700 rounded py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="Enter amount"
                        autoFocus
                      />
                    </div>
                    <Button
                      onClick={() => setInvestmentAmount(1)}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      Set Amount
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mb-3">
            <span className="text-xs text-gray-400">Payout: </span>
            <span className="text-sm font-bold">10 $</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="h-11 bg-red-500 hover:bg-red-600 text-white font-medium rounded"
              //   onClick={() => placeTrade("down")}
            >
              Down <ArrowDown size={16} className="ml-1" />
            </Button>
            <Button
              className="h-11 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
              //   onClick={() => placeTrade("up")}
            >
              Up <ArrowUp size={16} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="flex items-center justify-around h-12 border-t border-gray-800 bg-[#1A1D27] shrink-0">
          {/* Item 1: Menu Button (Replaces old Trade link) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400"
          >
            <Grid size={20} />
            {/* Optional: add text label if desired, e.g., <span className="text-[9px] mt-0.5">Menu</span> */}
          </button>

          {/* Item 2: Transaction History */}
          <Link
            href="/transaction-history"
            className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400"
          >
            <ListChecks size={20} />
            {/* <span className="text-[9px] mt-0.5">History</span> */}
          </Link>

          {/* Item 3: Trades History */}
          <Link
            href="/trades-history"
            className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400"
          >
            <ListFilter size={20} />
            {/* <span className="text-[9px] mt-0.5">Trades</span> */}
          </Link>

          {/* Item 4: Account */}
          <Link
            href="/account"
            className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400"
          >
            <User size={20} />
            {/* <span className="text-[9px] mt-0.5">Account</span> */}
          </Link>

          {/* Item 5: Support */}
          <Link
            href="/support"
            className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400"
          >
            <LifeBuoy size={20} />
            {/* <span className="text-[9px] mt-0.5">Support</span> */}
          </Link>

          {/* Item 6: Mobile Trades Panel Button */}
          <button
            onClick={() => setIsMobileTradesPanelOpen(true)}
            className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400"
          >
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
              aria-labelledby="mobile-menu-title"
            >
              <div className="flex justify-between items-center mb-5">
                <h3
                  id="mobile-menu-title"
                  className="text-lg font-semibold text-slate-100"
                >
                  Menu
                </h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="grid grid-cols-3 gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center justify-center p-3 bg-[#1C1F2A] rounded-lg hover:bg-gray-700/70 transition-colors space-y-1.5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon size={24} className="text-purple-400" />
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
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {tradesForPanel.length > 0 ? (
                  tradesForPanel.map((trade, index) => (
                    <TradeListItem key={index} trade={trade} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-3 rounded-full bg-gray-800 p-3">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />

          <main className="flex flex-1 overflow-hidden">
            <div className="relative flex-1 overflow-hidden">
              {/* <TradingKlineChart/> */}
              <TradingChart
                chartRef={chartRef}
                candleSeriesRef={candleSeriesRef}
              />
              {/* <TradeButtons
        onBuyClick={() => addTradeLine('buy')}
        onSellClick={() => addTradeLine('sell')}
        createHoverOverlay={createHoverOverlay}
        removeHoverOverlay={removeHoverOverlay}
      /> */}
              <Timer
                lastCandleTimestamp={lastCandleTimestamp}
                currentTimestamp={currentTimestamp}
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
            />
          </main>
        </div>
      </div>
    </SocketView>
  );
}
