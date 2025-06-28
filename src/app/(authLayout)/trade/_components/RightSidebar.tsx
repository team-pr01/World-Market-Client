/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/reusable/Button/Button";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Minus,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { TradeListItem } from "./TradeListItem";
import { useSocket } from "./SocketView";

type TRightSidebarProps = {
  onBuyClick: any;
  onSellClick: any;
  createHoverOverlay: any;
  removeHoverOverlay: any;
  investmentAmount: number;
  setInvestmentAmount: (amount: number) => void;
  tradeHistory: any;
};
const RightSidebar: React.FC<TRightSidebarProps> = ({
  onBuyClick,
  onSellClick,
  createHoverOverlay,
  removeHoverOverlay,
  investmentAmount,
  setInvestmentAmount,
  tradeHistory,
}) => {
  // console.log(tradeLines, "tradelines");
  const { activeTrade } = useSocket();
  const categories = ["All", "Favorite", "Forex"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);

  const toggleMarketDropdown = () => {
    setIsMarketDropdownOpen(!isMarketDropdownOpen);
    setSearchTerm("");
    setActiveCategory("All");
  };

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

  const [buyHoverArea, setBuyHoverArea] = useState(null);
  const [sellHoverArea, setSellHoverArea] = useState(null);

  const handleBuyHover = () => {
    // if (buyHoverArea) removeHoverOverlay();
    // const area = createHoverOverlay();
    if (buyHoverArea) removeHoverOverlay(buyHoverArea);
    const area = createHoverOverlay("buy");
    setBuyHoverArea(area as any);
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
    const area = createHoverOverlay("sell");
    setSellHoverArea(area as any);
  };

  const handleSellLeave = () => {
    if (sellHoverArea) {
      // removeHoverOverlay();
      removeHoverOverlay(sellHoverArea);
      setSellHoverArea(null);
    }
  };

  console.log(tradeHistory);

  return (
    <aside className="w-[240px] border-l border-gray-800 bg-[#1A1D27] overflow-y-auto">
      <div className="p-3">
        <div className="mb-4">
          <div
            className="flex items-center p-2 rounded hover:bg-gray-800/50 cursor-pointer transition-colors"
            onClick={toggleMarketDropdown}
          >
            <span className="mr-1 min-w-[24px] text-center">📊</span>
            <span className="font-medium truncate max-w-[100px]">EUR/USD</span>
            <span className="ml-1 text-yellow-500">85%</span>
            <ChevronDown
              size={16}
              className={`ml-auto text-gray-400 transition-transform ${
                isMarketDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isMarketDropdownOpen && (
            <div className="absolute right-[240px] top-16 mt-1 bg-[#1A1D27] border border-gray-800 rounded shadow-lg w-[400px] z-50">
              <div className="p-3 border-b border-gray-800">
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1 text-xs rounded-full ${
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
              <div className="max-h-[400px] overflow-y-auto">
                {markets.length > 0 ? (
                  markets.map((market) => (
                    <div
                      key={market.name}
                      className="flex items-center justify-between p-3 hover:bg-gray-800"
                    >
                      <div className="flex items-center flex-grow cursor-pointer">
                        <span className="mr-2 text-lg min-w-[24px] text-center">
                          {market.logo}
                        </span>
                        <div className="flex-grow">
                          <div className="font-medium truncate max-w-[200px]">
                            {market.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {market.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right mr-3 cursor-pointer">
                        <div>{market.price}</div>
                        <div className="text-yellow-500 text-sm">
                          {market.percentage}
                        </div>
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-yellow-400"
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

        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-1">Time</div>
          <div className="flex h-10 items-center justify-center rounded border border-gray-700 bg-[#252833] px-3 py-2">
            <span className="font-medium">1 Minute</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-1">Investment</div>
          <div className="relative">
            <div className="flex h-10 items-center justify-between rounded border border-gray-700 bg-[#252833] px-2">
              <button
                onClick={() =>
                  setInvestmentAmount(Math.max(1, investmentAmount - 1))
                }
                className="text-gray-400 p-1"
                disabled={investmentAmount <= 1}
              >
                <Minus size={16} />
              </button>
              <span>{investmentAmount} $</span>
              <button
                onClick={() => setInvestmentAmount(investmentAmount + 1)}
                className="text-gray-400 p-1"
              >
                <Plus size={16} />
              </button>
            </div>
            {isInvestmentModalOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-[#252833] border border-gray-700 rounded shadow-lg z-50">
                <div className="mb-2">
                  <input
                    type="number"
                    className="w-full bg-[#1C1F2A] border border-gray-700 rounded py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(Number(e.target.value))
                    }
                    autoFocus
                  />
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => setIsInvestmentModalOpen(false)}
                >
                  Set Amount
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3 flex flex-col gap-3">
          <Button
            className={`w-full h-12 ${
              activeTrade === "up"
                ? "bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
            onClick={onBuyClick}
            onMouseEnter={handleBuyHover}
            onMouseLeave={handleBuyLeave}
          >
            {activeTrade === "up" ? "Trading..." : "Up"}
            <ArrowUp className="ml-2" size={16} />
          </Button>
          <Button
            className={`w-full h-12 ${
              activeTrade === "down"
                ? "bg-red-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
            onClick={onSellClick}
            onMouseEnter={handleSellHover}
            onMouseLeave={handleSellLeave}
          >
            {activeTrade === "down" ? "Trading..." : "Down"}
            <ArrowDown className="ml-2" size={16} />
          </Button>
        </div>

        <div className="rounded border border-gray-800 mt-4">
          <div className="flex items-center justify-between border-b border-gray-800 p-3">
            <span className="font-medium text-white">Trades</span>
            <div className="flex items-center">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs text-gray-300 mr-2">
                {tradeHistory.length}
              </span>
            </div>
          </div>
          <div className="p-3 max-h-[250px] overflow-y-auto space-y-2">
            {tradeHistory?.trades?.length > 0 ? (
              tradeHistory?.trades?.map((trade: any, index: any) => (
                <TradeListItem
                  key={index}
                  trade={{
                    id: trade._id,
                    name: "EUR/USD",
                    time: new Date(trade.bidTime).toLocaleTimeString(),
                    value: `$${trade.amount}`,
                    status: trade.status,
                    direction : trade.direction
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
      </div>
    </aside>
  );
};

export default RightSidebar;
