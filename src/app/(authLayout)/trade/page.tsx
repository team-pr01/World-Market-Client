/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import {
  BarChart3,
  LifeBuoy,
  User,
  Trophy,
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/reusable/Button/Button"
import Header from "./_components/Header"
import LeftSidebar from "./_components/LeftSidebar"
import RightSidebar from "./_components/RightSidebar"
import TradingKlineChart from "./_components/TradingKlineChart"

const generateMockMarkets = () => {
  const markets = []

  // Forex Data (50 markets)
  const forexPairs = [
    { name: "EUR/USD", icon: "🇪🇺🇺🇸", price: (1.05 + Math.random() * 0.1).toFixed(4) },
    { name: "GBP/USD", icon: "🇬🇧🇺🇸", price: (1.2 + Math.random() * 0.1).toFixed(4) },
    { name: "USD/JPY", icon: "🇺🇸🇯🇵", price: (140 + Math.random() * 20).toFixed(2) },
    { name: "AUD/USD", icon: "🇦🇺🇺🇸", price: (0.63 + Math.random() * 0.05).toFixed(4) },
    { name: "USD/CAD", icon: "🇺🇸🇨🇦", price: (1.35 + Math.random() * 0.05).toFixed(4) },
    { name: "USD/CHF", icon: "🇺🇸🇨🇭", price: (0.9 + Math.random() * 0.05).toFixed(4) },
    { name: "NZD/USD", icon: "🇳🇿🇺🇸", price: (0.58 + Math.random() * 0.05).toFixed(4) },
    { name: "EUR/GBP", icon: "🇪🇺🇬🇧", price: (0.85 + Math.random() * 0.05).toFixed(4) },
    { name: "EUR/JPY", icon: "🇪🇺🇯🇵", price: (150 + Math.random() * 10).toFixed(2) },
    { name: "GBP/JPY", icon: "🇬🇧🇯🇵", price: (170 + Math.random() * 10).toFixed(2) },
    { name: "AUD/JPY", icon: "🇦🇺🇯🇵", price: (90 + Math.random() * 10).toFixed(2) },
    { name: "CAD/JPY", icon: "🇨🇦🇯🇵", price: (100 + Math.random() * 10).toFixed(2) },
    { name: "CHF/JPY", icon: "🇨🇭🇯🇵", price: (160 + Math.random() * 10).toFixed(2) },
    { name: "EUR/AUD", icon: "🇪🇺🇦🇺", price: (1.6 + Math.random() * 0.1).toFixed(4) },
    { name: "EUR/CAD", icon: "🇪🇺🇨🇦", price: (1.4 + Math.random() * 0.1).toFixed(4) },
    { name: "EUR/CHF", icon: "🇪🇺🇨🇭", price: (0.95 + Math.random() * 0.05).toFixed(4) },
    { name: "GBP/AUD", icon: "🇬🇧🇦🇺", price: (1.9 + Math.random() * 0.1).toFixed(4) },
    { name: "GBP/CAD", icon: "🇬🇧🇨🇦", price: (1.7 + Math.random() * 0.1).toFixed(4) },
    { name: "GBP/CHF", icon: "🇬🇧🇨🇭", price: (1.1 + Math.random() * 0.1).toFixed(4) },
    { name: "AUD/CAD", icon: "🇦🇺🇨🇦", price: (0.9 + Math.random() * 0.05).toFixed(4) },
  ]
  for (let i = 0; i < 50; i++) {
    const pair = forexPairs[i % forexPairs.length]
    markets.push({
      ...pair,
      name: i < forexPairs.length ? pair.name : `${pair.name} v${Math.floor(i / forexPairs.length)}`,
      symbol: `${pair.name.replace("/", "")}${i}`,
      percentage: `${Math.floor(Math.random() * 10 + 85)}%`,
      category: "Forex",
      isFavorite: false,
    })
  }

  const otcAssets = [
    { name: "EUR/USD (OTC)", icon: "🇪🇺🇺🇸", price: (1.06 + Math.random() * 0.1).toFixed(4) },
    { name: "Gold (OTC)", icon: "🥇", price: (1900 + Math.random() * 200).toFixed(2) },
    { name: "Oil (OTC)", icon: "🛢️", price: (70 + Math.random() * 20).toFixed(2) },
    { name: "Silver (OTC)", icon: "🥈", price: (20 + Math.random() * 5).toFixed(2) },
    { name: "Alibaba (OTC)", icon: "🇨🇳", price: (80 + Math.random() * 20).toFixed(2) },
    { name: "AUD/CAD (OTC)", icon: "🇦🇺🇨🇦", price: (0.91 + Math.random() * 0.05).toFixed(4) },
    { name: "USD/MXN (OTC)", icon: "🇺🇸🇲🇽", price: (17 + Math.random() * 2).toFixed(2) },
  ]
  for (let i = 0; i < 60; i++) {
    const asset = otcAssets[i % otcAssets.length]
    markets.push({
      ...asset,
      name:
        i < otcAssets.length
          ? asset.name
          : `${asset.name.replace(" (OTC)", "")} ${Math.floor(i / otcAssets.length)} (OTC)`,
      symbol: `${asset.name.split(" ")[0].replace("/", "")}OTC${i}`,
      percentage: `${Math.floor(Math.random() * 15 + 80)}%`,
      category: "OTC",
      isFavorite: false,
    })
  }

  const stockAssets = [
    { name: "Apple Inc.", icon: "🇺🇸", symbolPrefix: "AAPL", price: (150 + Math.random() * 50).toFixed(2) },
    { name: "Microsoft Corp.", icon: "🇺🇸", symbolPrefix: "MSFT", price: (300 + Math.random() * 50).toFixed(2) },
    { name: "Amazon.com Inc.", icon: "🇺🇸", symbolPrefix: "AMZN", price: (100 + Math.random() * 30).toFixed(2) },
    { name: "Tesla Inc.", icon: "🇺🇸", symbolPrefix: "TSLA", price: (150 + Math.random() * 100).toFixed(2) },
    { name: "NVIDIA Corp.", icon: "🇺🇸", symbolPrefix: "NVDA", price: (400 + Math.random() * 100).toFixed(2) },
    { name: "Meta Platforms Inc.", icon: "🇺🇸", symbolPrefix: "META", price: (250 + Math.random() * 50).toFixed(2) },
    {
      name: "Samsung Electronics",
      icon: "🇰🇷",
      symbolPrefix: "SMSN",
      price: (60000 + Math.random() * 10000).toFixed(0),
    },
    { name: "Toyota Motor Corp.", icon: "🇯🇵", symbolPrefix: "TM", price: (2500 + Math.random() * 500).toFixed(0) },
  ]
  for (let i = 0; i < 30; i++) {
    const asset = stockAssets[i % stockAssets.length]
    markets.push({
      name: asset.name,
      icon: asset.icon,
      symbol: `${asset.symbolPrefix}${i}`,
      price: asset.price,
      percentage: `${Math.floor(Math.random() * 10 + 75)}%`,
      category: "Stocks",
      isFavorite: false,
    })
  }

  const cryptoAssets = [
    { name: "BTC/USD", icon: "₿", symbolPrefix: "BTCUSD", price: (60000 + Math.random() * 10000).toFixed(2) },
    { name: "ETH/USD", icon: "Ξ", symbolPrefix: "ETHUSD", price: (3000 + Math.random() * 500).toFixed(2) },
    { name: "BNB/USD", icon: "🔶", symbolPrefix: "BNBUSD", price: (300 + Math.random() * 50).toFixed(2) },
    { name: "SOL/USD", icon: "☀️", symbolPrefix: "SOLUSD", price: (100 + Math.random() * 50).toFixed(2) },
    { name: "XRP/USD", icon: "Ripple", symbolPrefix: "XRPUSD", price: (0.5 + Math.random() * 0.3).toFixed(3) },
    { name: "ADA/USD", icon: "Cardano", symbolPrefix: "ADAUSD", price: (0.4 + Math.random() * 0.2).toFixed(3) },
    { name: "DOGE/USD", icon: "Ɖ", symbolPrefix: "DOGEUSD", price: (0.1 + Math.random() * 0.1).toFixed(4) },
    { name: "LTC/USD", icon: "Ł", symbolPrefix: "LTCUSD", price: (70 + Math.random() * 20).toFixed(2) },
  ]
  for (let i = 0; i < 40; i++) {
    const asset = cryptoAssets[i % cryptoAssets.length]
    markets.push({
      name: asset.name,
      icon: asset.icon,
      symbol: `${asset.symbolPrefix}${i}`,
      price: asset.price,
      percentage: `${Math.floor(Math.random() * 15 + 80)}%`,
      category: "Crypto",
      isFavorite: false,
    })
  }
  return markets
}

const timeOptions = [
  { label: "1 Minute", value: "00:01:00" },
  { label: "2 Minutes", value: "00:02:00" },
  { label: "3 Minutes", value: "00:03:00" },
  { label: "5 Minutes", value: "00:05:00" },
]

const tradesForPanel = [1,2,3,4]

export default function TradingPlatform() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false)
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const dropdownRef = useRef(null)
  const [customInvestment, setCustomInvestment] = useState("")
  const investmentModalRef = useRef(null)
  const [isMobileTradesPanelOpen, setIsMobileTradesPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])
  const handleLogout = () => {
    // logout()
    router.push("/login")
  }
  const toggleMarketDropdown = () => {
    setIsMarketDropdownOpen(!isMarketDropdownOpen)
    setIsTimeDropdownOpen(false)
    setSearchTerm("")
    setActiveCategory("All")
  }
  const toggleTimeDropdown = () => {
    setIsTimeDropdownOpen(!isTimeDropdownOpen)
    setIsMarketDropdownOpen(false)
  }

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
    ]

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
            <button onClick={handleLogout} className="text-red-500 p-1">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Chart Area */}
        <div className="relative flex-1 min-h-0">
          <TradingKlineChart/>
        </div>

        {/* Mobile Market Selector */}
        <div className="relative shrink-0">
          <div
            className="flex items-center justify-between px-3 py-2 border-t border-gray-800 bg-[#1A1D27] cursor-pointer"
            onClick={toggleMarketDropdown}
          >
            <div className="flex items-center gap-1">
              <span className="text-base min-w-[24px] text-center">{selectedMarket.icon}</span>
              <span className="text-sm font-medium truncate max-w-[150px]">{selectedMarket.name}</span>
              <span className="text-orange-400 text-sm font-medium">{selectedMarket.percentage}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isMarketDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isMarketDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full left-0 right-0 bg-[#1A1D27] border-t border-gray-800 max-h-[50vh] overflow-y-auto z-50"
            >
              <div className="sticky top-0 bg-[#1A1D27] p-3 border-b border-gray-800">
                <div className="relative mb-2">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                        activeCategory === category ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-2">
                {filteredMarkets.length > 0 ? (
                  filteredMarkets.map((market) => (
                    <div
                      key={market.symbol}
                      className={`flex items-center justify-between p-3 rounded hover:bg-gray-800 ${
                        selectedMarket.symbol === market.symbol ? "bg-gray-800" : ""
                      }`}
                    >
                      <div
                        className="flex items-center flex-grow cursor-pointer"
                        onClick={() => selectMarketAndUpdateChart(market)}
                      >
                        <span className="mr-2 text-lg min-w-[24px] text-center">{market.icon}</span>
                        <div>
                          <div className="font-medium truncate max-w-[180px]">{market.name}</div>
                          <div className="text-xs text-gray-400">{market.category}</div>
                        </div>
                      </div>
                      <div
                        className="text-right mr-2 cursor-pointer"
                        onClick={() => selectMarketAndUpdateChart(market)}
                      >
                        <div>{market.price}</div>
                        <div className="text-yellow-500 text-sm">{market.percentage}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(market.symbol)
                        }}
                        className="p-1 text-gray-400 hover:text-yellow-400"
                        aria-label={market.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star size={18} fill={market.isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">No markets found</div>
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
                <span className="text-sm font-medium">{selectedTimeLabel}</span>
              </div>
              <div className="text-center mt-1 relative">
                <button className="text-[10px] text-blue-400 font-medium" onClick={toggleTimeDropdown}>
                  SWITCH TIME
                </button>
                {isTimeDropdownOpen && (
                  <div
                    ref={timeDropdownRef}
                    className="absolute bottom-full left-0 right-0 bg-[#252833] border border-gray-700 rounded shadow-lg z-50 mb-1 w-full"
                  >
                    {timeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center justify-between p-2.5 hover:bg-gray-700 cursor-pointer text-sm ${
                          tradeTime === option.value ? "bg-blue-600 text-white" : "text-gray-300 hover:text-gray-100"
                        }`}
                        onClick={() => selectTime(option)}
                      >
                        <span>{option.label}</span>
                        {tradeTime === option.value && <Check size={16} className="text-white" />}
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
                  onClick={openInvestmentModal}
                >
                  <button
                    className="p-1"
                  >
                    <Minus size={14} className="text-gray-400" />
                  </button>
                  <span>{investment} $</span>
                  <button
                    className="p-1"
                  >
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
                    <Button onClick={setCustomInvestmentAmount} className="w-full bg-blue-500 hover:bg-blue-600">
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
          <Link href="/trades-history" className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
            <ListFilter size={20} />
            {/* <span className="text-[9px] mt-0.5">Trades</span> */}
          </Link>

          {/* Item 4: Account */}
          <Link href="/account" className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
            <User size={20} />
            {/* <span className="text-[9px] mt-0.5">Account</span> */}
          </Link>

          {/* Item 5: Support */}
          <Link href="/support" className="p-2 flex flex-col items-center text-gray-400 hover:text-purple-400">
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
                <h3 id="mobile-menu-title" className="text-lg font-semibold text-slate-100">
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
                    <span className="text-xs text-center text-slate-200">{item.label}</span>
                  </Link>
                ))}
              </nav>
              {socialMediaItems.length > 0 && (
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
              )}
              <div className="mt-4 h-1" /> {/* Small spacer at the bottom */}
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
                <h3 className="text-md font-semibold text-white">Your Trades</h3>
                <button
                  onClick={() => setIsMobileTradesPanelOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {tradesForPanel.length > 0 ? (
                  tradesForPanel.map((trade) => <TradeListItem key={trade.id} trade={trade} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-3 rounded-full bg-gray-800 p-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="16" width="5" height="5" rx="1" fill="#6B7280" />
                        <rect x="10" y="10" width="5" height="11" rx="1" fill="#6B7280" />
                        <rect x="17" y="4" width="5" height="17" rx="1" fill="#6B7280" />
                      </svg>
                    </div>
                    <p className="mb-1 text-sm text-gray-200">You don't have any trades.</p>
                    <p className="text-xs text-gray-400">Open a trade using the form above.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Desktop View
  return (
    <div className="flex h-screen w-full flex-col bg-[#1C1F2A] text-white overflow-hidden">
      <Header/>

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar/>

        <main className="flex flex-1 overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <TradingKlineChart/>
          </div>
          <RightSidebar/>
        </main>
      </div>
    </div>
  )
}
