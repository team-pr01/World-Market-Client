/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';

// Data structure for a candle
type CandleData = {
  value: [number, number, number, number]; // [open, close, low, high]
  timestamp: number;
};

type TradePayload = {
  action: 'place_trade';
  userId: string;
  symbolId: string;
  direction: 'up' | 'down';
  amount: number;
  timestamp: string;
};

// Add currentPrice to our context type
type SocketContextType = {
  socket: WebSocket | null;
  liveData: CandleData[];
  currentPrice: number | null; // <-- ADDED
  placeTrade: (payload: Omit<TradePayload, 'action' | 'timestamp' | 'userId' | 'symbolId'>) => void;
  activeTrade: 'up' | 'down' | null;
  tradeHistory: any[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  liveData: [],
  currentPrice: null, // <-- ADDED
  placeTrade: () => {},
  activeTrade: null,
  tradeHistory: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [liveData, setLiveData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null); // <-- ADDED STATE
  const [activeTrade, setActiveTrade] = useState<'up' | 'down' | null>(null);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  // Simplified placeTrade for easier calling from components
  const placeTrade = (payload: Omit<TradePayload, 'action' | 'timestamp' | 'userId' | 'symbolId'>) => {
    if (!socket || activeTrade) return;
    setActiveTrade(payload.direction);
    socket.send(JSON.stringify({
        action: 'place_trade',
        userId: "12345", // Replace with actual user ID
        symbolId: "685d5a29ac54fe77b78af834",
        timestamp: new Date().toISOString(),
        ...payload
    }));
  };

  // useEffect(() => {
  //   const ws = new WebSocket("ws://test.kajghor.com/ws");
  //   setSocket(ws);

  //   ws.onopen = () => {
  //     console.log("✅ WebSocket connection established");
  //     ws.send(JSON.stringify({
  //       action: "subscribe",
  //       symbolId: "685d5a29ac54fe77b78af834"
  //     }));
  //   };

  //   ws.onmessage = (event) => {
  //     const raw = event.data;
  //     if (typeof raw === "string" && raw.startsWith("Echo:")) return;

  //     try {
  //       const json = JSON.parse(raw);

  //       if (json.type === 'trade_result') {
  //         const tradeResult = { id: Date.now(), ...json, timestamp: new Date() };
  //         setTradeHistory(prev => [tradeResult, ...prev]);
  //         setActiveTrade(null);
  //         if (!json.success) console.error('Trade failed:', json.message);
  //         return;
  //       }
        
  //       const parsePrice = (priceStr: string | number) => Number(parseFloat(String(priceStr)).toFixed(5));
  //       if (json.type === 'second_price' && json.data?.price) {
  //         setCurrentPrice(parsePrice(json.data.price));
  //       } else if (json.type === 'new_candle' && json.close) {
  //         setCurrentPrice(parsePrice(json.close));
  //       }

  //       setLiveData(prevData => {
  //         let newData = [...prevData];

  //         const parseToCandle = (candleData: any): CandleData => ({
  //           value: [
  //             parsePrice(candleData.open),
  //             parsePrice(candleData.close),
  //             parsePrice(candleData.low),
  //             parsePrice(candleData.high),
  //           ],
  //           timestamp: candleData.timestamp,
  //         });

  //         if (json.type === "chart_history" && Array.isArray(json.data)) {
  //           newData = json.data.map(parseToCandle).reverse();
  //            if (newData.length > 0) {
  //             setCurrentPrice(newData[0].value[1]);
  //           }
  //         } 
  //         else if (json.type === "new_candle") {
  //           const newCandle = parseToCandle(json);
  //           newData.unshift(newCandle);
  //           if (newData.length > 200) newData.pop();
  //         } 
  //         else if (json.type === "second_price" && newData.length > 0) {
  //           const latestCandle = { ...newData[0] };
  //           const valueArray = [...latestCandle.value];
  //           const newPriceValue = parsePrice(json.data.price); 
            
  //           valueArray[1] = newPriceValue; 
  //           valueArray[2] = Math.min(valueArray[2], newPriceValue);
  //           valueArray[3] = Math.max(valueArray[3], newPriceValue);
            
  //           latestCandle.value = valueArray;
  //           newData[0] = latestCandle;
  //         }

  //         return newData;
  //       });

  //     } catch (err) {
  //       console.error("WebSocket message parse error:", err);
  //     }
  //   };

  //   ws.onerror = (error) => console.error("WebSocket error:", error);
  //   ws.onclose = (e) => console.warn("WebSocket closed:", e);
  //   return () => ws.close();
  // }, []);

  return (
    <SocketContext.Provider value={{ socket, liveData, currentPrice, placeTrade, activeTrade, tradeHistory }}>
      {children}
    </SocketContext.Provider>
  );
};