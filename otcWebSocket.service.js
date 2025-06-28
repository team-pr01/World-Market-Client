const WebSocket = require('ws');
const ChartSignal = require('../models/chartSignal.model');
const Symbol = require('../models/symbol.model');
const TradeSession = require('../models/tradeSession.model');
const Trade = require('../models/trade.model');
const OtcSecondPrice = require('../models/otcSecondPrice.model');
const User = require('../models/user.model');

class OTCWebSocketService {
  constructor(server) {
    this.wss = null;
    this.server = server;
    this.clients = new Map(); // Map to store client subscriptions
    this.otcSymbols = new Map(); // Map to store OTC symbol data
    this.priceGenerators = new Map(); // Map to store price generators for each symbol
    this.secondIntervals = new Map(); // Map to store per-symbol per-second interval IDs

    this.initialize();
  }

  async initialize() {
    // Load OTC symbols from database
    await this.loadOTCSymbols();

    // Start WebSocket server
    this.setupWebSocket();

    // Start generating chart signals
    this.startChartSignalGeneration();
  }

  async loadOTCSymbols() {
    try {
      const symbols = await Symbol.find({ market_type: 'otc' });
      symbols.forEach(symbol => {
        this.otcSymbols.set(symbol._id.toString(), {
          id: symbol._id,
          pair: symbol.pair,
          baseSymbol: symbol.baseSymbol,
          quoteSymbol: symbol.quoteSymbol,
          start_market_price: symbol.start_market_price,
          min_market_price: symbol.min_market_price,
          max_market_price: symbol.max_market_price,
          currentPrice: symbol.start_market_price || this.generateInitialPrice(symbol.pair)
        });

        // Initialize price generator for this symbol with constraints
        this.priceGenerators.set(symbol._id.toString(), {
          basePrice: symbol.start_market_price || this.generateInitialPrice(symbol.pair),
          volatility: 0.02, // 2% volatility
          trend: 0,
          minPrice: symbol.min_market_price,
          maxPrice: symbol.max_market_price
        });
      });

      console.log(`Loaded ${symbols.length} OTC symbols with price constraints`);
    } catch (error) {
      console.error('Error loading OTC symbols:', error);
    }
  }

  generateInitialPrice(pair) {
    // Generate realistic initial prices based on pair type
    if (pair.includes('BTC')) return 45000 + Math.random() * 10000;
    if (pair.includes('ETH')) return 2500 + Math.random() * 500;
    if (pair.includes('EUR')) return 1.08 + Math.random() * 0.1;
    if (pair.includes('GBP')) return 1.25 + Math.random() * 0.1;
    if (pair.includes('JPY')) return 150 + Math.random() * 10;

    return 100 + Math.random() * 100;
  }

  setupWebSocket() {
    console.log('Setting up WebSocket server');

    // Configure WebSocket server for public access
    this.wss = new WebSocket.Server({
      port: 3001,
      path: '/ws',
      handleProtocols: (protocols, request) => {
        // Optional: allow custom subprotocols if needed
        return protocols[0]; // or null if none
      },
      verifyClient: (info, done) => {
        // Allow from any origin (public)
        // console.log('Origin:', info.origin);
        done(true);
      }
    });

    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection from:', req.socket.remoteAddress);

      // Store client with empty subscriptions and no user ID initially
      this.clients.set(ws, {
        subscriptions: new Set(),
        userId: null
      });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', (code, reason) => {
        console.log('WebSocket connection closed:', code, reason);
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial connection confirmation
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to OTC WebSocket',
        timestamp: new Date().toISOString()
      }));
    });

    // Add error handling for the WebSocket server
    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    console.log('WebSocket server setup complete on path: /ws');
  }

  handleMessage(ws, data) {
    switch (data.action) {
      case 'authenticate':
        this.authenticateUser(ws, data.userId);
        break;
      case 'subscribe':
        this.subscribeToSymbol(ws, data.symbolId);
        break;
      case 'unsubscribe':
        this.unsubscribeFromSymbol(ws, data.symbolId);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;
      case 'place_trade':
        this.handlePlaceTrade(ws, data);
        break;
      case 'get_trade_history':
        this.sendUserTradeHistory(ws, data.userId, data.symbolId);
        break;
      default:
        ws.send(JSON.stringify({ error: 'Unknown action' }));
    }
  }

  authenticateUser(ws, userId) {
    const clientData = this.clients.get(ws);
    if (clientData) {
      clientData.userId = userId;
      this.clients.set(ws, clientData);
      console.log(`User ${userId} authenticated for WebSocket connection`);

      ws.send(JSON.stringify({
        type: 'authenticated',
        userId: userId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  subscribeToSymbol(ws, symbolId) {
    if (!this.otcSymbols.has(symbolId)) {
      ws.send(JSON.stringify({ error: 'Symbol not found' }));
      return;
    }

    const clientData = this.clients.get(ws);
    if (!clientData) {
      ws.send(JSON.stringify({ error: 'Client not found' }));
      return;
    }

    clientData.subscriptions.add(symbolId);
    this.clients.set(ws, clientData);

    // Send current symbol data
    const symbolData = this.otcSymbols.get(symbolId);
    ws.send(JSON.stringify({
      type: 'subscription',
      symbolId,
      data: symbolData,
      timestamp: new Date().toISOString()
    }));

    // Send ChartSignal history first
    this.sendChartSignalHistory(ws, symbolId);

    console.log(`Client subscribed to symbol: ${symbolId}`);
  }

  async sendChartSignalHistory(ws, symbolId) {
    try {
      // Get last 100 ChartSignal records for this symbol
      const chartHistory = await ChartSignal.find({ symbol: symbolId })
        .sort({ timestamp: -1 })
        .limit(100);

      // Send chart history
      ws.send(JSON.stringify({
        type: 'chart_history',
        symbolId,
        data: chartHistory.reverse(),
        timestamp: new Date().toISOString()
      }));

      console.log(`Sent ${chartHistory.length} chart signals to client for symbol: ${symbolId}`);
    } catch (error) {
      console.error('Error sending chart history:', error);
    }
  }

  unsubscribeFromSymbol(ws, symbolId) {
    const clientData = this.clients.get(ws);
    if (clientData && clientData.subscriptions) {
      clientData.subscriptions.delete(symbolId);
      this.clients.set(ws, clientData);
      console.log(`Client unsubscribed from symbol: ${symbolId}`);
    }
  }

  generateNewPrice(symbolId) {
    const generator = this.priceGenerators.get(symbolId);
    if (!generator) return null;

    // Get current session to check if we have a price direction
    this.getCurrentSessionDirection(symbolId).then(direction => {
      if (direction) {
        // Apply direction-based price manipulation
        this.applyPriceDirection(generator, direction);
      }
    });

    // Update trend (random walk)
    generator.trend += (Math.random() - 0.5) * 0.01;
    generator.trend = Math.max(-0.1, Math.min(0.1, generator.trend)); // Limit trend

    // Generate new price with trend and volatility
    const randomChange = (Math.random() - 0.5) * generator.volatility;
    const trendChange = generator.trend * generator.volatility;
    const totalChange = randomChange + trendChange;

    let newPrice = generator.basePrice * (1 + totalChange);

    // Apply price constraints
    if (generator.minPrice && newPrice < generator.minPrice) {
      newPrice = generator.minPrice;
    }
    if (generator.maxPrice && newPrice > generator.maxPrice) {
      newPrice = generator.maxPrice;
    }

    // Update base price for next iteration
    generator.basePrice = newPrice;

    return newPrice;
  }

  async generateChartSignal(symbolId) {
    const symbol = this.otcSymbols.get(symbolId);
    if (!symbol) return;

    const newPrice = this.generateNewPrice(symbolId);
    if (!newPrice) return;

    const now = new Date();
    const timestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);

    // Get the last candle for this symbol
    const lastCandle = await ChartSignal.findOne({ symbol: symbolId }).sort({ timestamp: -1 });

    const pair = symbol.pair;

    let open, high, low, close;
    let isNewCandle = false;

    if (!lastCandle || lastCandle.timestamp.getTime() !== timestamp.getTime()) {
      // New minute, create new candle
      // Use start_market_price for the first candle, otherwise use last candle's close
      if (!lastCandle && symbol.start_market_price) {
        open = symbol.start_market_price;
      } else {
        open = lastCandle ? lastCandle.close : newPrice;
      }

      // Ensure prices respect min/max constraints
      const constrainedPrice = Math.max(
        symbol.min_market_price || 0,
        Math.min(symbol.max_market_price || Infinity, newPrice)
      );

      high = constrainedPrice;
      low = constrainedPrice;
      close = constrainedPrice;
      isNewCandle = true;
    } else {
      // Same minute, update existing candle
      open = lastCandle.open; // Keep the original open price for this minute

      // Ensure prices respect min/max constraints
      const constrainedPrice = Math.max(
        symbol.min_market_price || 0,
        Math.min(symbol.max_market_price || Infinity, newPrice)
      );

      high = Math.max(lastCandle.high, constrainedPrice);
      low = Math.min(lastCandle.low, constrainedPrice);
      close = constrainedPrice;

      // Update the existing candle
      await ChartSignal.findByIdAndUpdate(lastCandle._id, {
        high, low, close, volume: lastCandle.volume + Math.random() * 1000
      });
      return { open, high, low, close, timestamp, symbolId, pair };
    }

    // Create new ChartSignal first
    const chartsignal = new ChartSignal({
      symbol: symbolId,
      pair: pair,
      open,
      high,
      low,
      close,
      timestamp,
      volume: Math.random() * 1000 + 100
    });
    const chartSignal = await chartsignal.save();

    // Broadcast new_candle event to all clients subscribed to this symbol
    this.broadcastNewCandle(symbolId, chartSignal.timestamp);

    // Update symbol current price
    symbol.currentPrice = close;
    this.otcSymbols.set(symbolId, symbol);

    // --- SESSION LOGIC: create session for this new candle only ---
    if (isNewCandle) {
      // Start new per-second price interval for this ChartSignal immediately
      setTimeout(() => {
        this.startSecondPriceInterval(symbolId, pair, chartSignal);
      }, 500); // Small delay to ensure ChartSignal is saved

      // Create TradeSession using ChartSignal's OHLC data and chartSignalId
      await this.startTradeSession(symbolId, pair, chartSignal.open, chartSignal.high, chartSignal.low, chartSignal.close, timestamp, chartSignal._id);
    }
    // --- END SESSION LOGIC ---

    return { open, high, low, close, timestamp, symbolId, pair };
  }

  broadcastChartSignal(signal) {
    const message = JSON.stringify({
      type: 'chart_signal',
      data: signal,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach((clientData, ws) => {
      if (clientData.subscriptions.has(signal.symbolId) && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  async startTradeSession(symbolId, pair, openPrice, highPrice, lowPrice, closePrice, startTime, chartSignalId) {
    // Close previous session if still open
    await this.closeTradeSession(symbolId);
    const sessionStart = startTime || new Date();
    const endTime = new Date(sessionStart.getTime() + 60 * 1000); // 1 minute session

    const session = await TradeSession.create({
      symbol: symbolId,
      chartSignalId: chartSignalId,
      pair,
      startTime: sessionStart,
      endTime,
      open: openPrice,
      high: highPrice,
      low: lowPrice,
      close: closePrice,
      market_type: 'otc',
      status: 'open'
    });

    // Schedule trade analysis at 30 seconds
    setTimeout(() => {
      this.analyzeTradesAndSetDirection(symbolId, session._id);
    }, 30000);

    this.broadcastSessionEvent('session_start', session);
    return session;
  }

  async analyzeTradesAndSetDirection(symbolId, sessionId) {
    try {
      // Get all trades for this session
      const trades = await Trade.find({
        pair: symbolId,
        expiryTime: { $gte: new Date(Date.now() - 60000), $lte: new Date(Date.now() + 60000) },
        status: 'pending'
      });

      let upAmount = 0;
      let downAmount = 0;
      let upCount = 0;
      let downCount = 0;

      trades.forEach(trade => {
        if (trade.direction === 'up') {
          upAmount += trade.amount;
          upCount++;
        } else if (trade.direction === 'down') {
          downAmount += trade.amount;
          downCount++;
        }
      });

      // Determine price direction based on amounts
      let priceDirection = 'neutral'; // Default to neutral

      // Only set direction if there are trades and significant difference
      if (trades.length > 0) {
        if (upAmount > downAmount) {
          priceDirection = 'down'; // Reverse: more up trades = price goes down
        } else if (downAmount > upAmount) {
          priceDirection = 'up'; // Reverse: more down trades = price goes up
        }
        // If difference is small or equal, keep as neutral
      }

      // Store the direction in session or a separate collection
      await TradeSession.findByIdAndUpdate(sessionId, {
        $set: {
          priceDirection,
          upAmount,
          downAmount,
          upCount,
          downCount,
          totalTrades: upCount + downCount
        }
      });

      console.log(`Session ${sessionId}: UP(${upAmount}) vs DOWN(${downAmount}) = Direction: ${priceDirection} (${trades.length} total trades)`);

      // Broadcast trade analysis result
      this.broadcastTradeAnalysis(symbolId, {
        sessionId,
        priceDirection,
        upAmount,
        downAmount,
        upCount,
        downCount,
        totalTrades: upCount + downCount
      });

    } catch (error) {
      console.error('Error analyzing trades:', error);
    }
  }

  broadcastTradeAnalysis(symbolId, analysis) {
    const message = JSON.stringify({
      type: 'trade_analysis',
      data: analysis,
      timestamp: new Date().toISOString()
    });
    this.clients.forEach((clientData, ws) => {
      if (clientData.subscriptions.has(symbolId) && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  async closeTradeSession(symbolId) {
    // Find the open session for this symbol
    const session = await TradeSession.findOne({ symbol: symbolId, status: 'open' }).sort({ startTime: -1 });
    if (!session) return;

    // Update close, high, low, status
    const lastMinuteSignals = await ChartSignal.find({ symbol: symbolId, timestamp: { $gte: session.startTime, $lte: session.endTime } });
    let high = session.open, low = session.open, close = session.open;
    if (lastMinuteSignals.length > 0) {
      high = Math.max(...lastMinuteSignals.map(s => s.high));
      low = Math.min(...lastMinuteSignals.map(s => s.low));
      close = lastMinuteSignals[lastMinuteSignals.length - 1].close;
    }
    session.close = close;
    session.high = high;
    session.low = low;
    session.status = 'closed';
    await session.save();

    this.broadcastSessionEvent('session_end', session);

    // Process all pending trades and distribute profits
    setTimeout(() => {
      this.handleTradeSessionEnd(symbolId);
    }, 1000); // Small delay to ensure session is fully closed

    return session;
  }

  broadcastSessionEvent(type, session) {
    const message = JSON.stringify({
      type,
      data: {
        sessionId: session._id,
        symbol: session.symbol,
        pair: session.pair,
        market_type: session.market_type,
        startTime: session.startTime,
        endTime: session.endTime,
        open: session.open,
        close: session.close,
        high: session.high,
        low: session.low,
        status: session.status
      },
      timestamp: new Date().toISOString()
    });
    this.clients.forEach((clientData, ws) => {
      if (clientData.subscriptions.has(session.symbol.toString()) && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  startChartSignalGeneration() {
    // Generate signals every minute
    setInterval(async () => {
      for (const symbolId of this.otcSymbols.keys()) {
        try {
          // Only generate chart signal; session logic is now inside generateChartSignal
          const signal = await this.generateChartSignal(symbolId);
          if (signal) {
            this.broadcastChartSignal(signal);
          }
        } catch (error) {
          console.error(`Error generating chart signal for ${symbolId}:`, error);
        }
      }
    }, 60000); // Every minute
    // Also generate initial signals for all symbols
    setTimeout(async () => {
      for (const symbolId of this.otcSymbols.keys()) {
        try {
          const signal = await this.generateChartSignal(symbolId);
          if (signal) {
            this.broadcastChartSignal(signal);
          }
        } catch (error) {
          console.error(`Error generating initial chart signal for ${symbolId}:`, error);
        }
      }
    }, 1000);
  }

  startSecondPriceInterval(symbolId, pair, chartSignal) {
    // Track previous price for this symbol
    let previousPrice = null;
    let recordCount = 0;
    const chartSignalId = chartSignal._id.toString();

    console.log(`Starting second price interval for ChartSignal: ${chartSignalId} at ${new Date().toISOString()}`);

    // Function to generate and store price
    const generateAndStorePrice = async () => {
      try {
        const symbol = this.otcSymbols.get(symbolId);
        if (!symbol) return;

        // Generate new price
        const rawPrice = this.generateNewPrice(symbolId);
        if (!rawPrice) return;

        // Apply price constraints
        const price = Math.max(
          symbol.min_market_price || 0,
          Math.min(symbol.max_market_price || Infinity, rawPrice)
        );

        const now = new Date();

        // Check if this ChartSignal's minute has ended (60 seconds from start)
        const chartSignalEndTime = new Date(chartSignal.timestamp.getTime() + 60000); // 1 minute after ChartSignal start
        if (now >= chartSignalEndTime) {
          console.log(`ChartSignal ${chartSignalId} minute ended, stopping interval. Created ${recordCount} OtcSecondPrice records`);
          this.stopSecondPriceInterval(chartSignalId);
          return;
        }

        // Get the current TradeSession
        const currentSession = await TradeSession.findOne({
          symbol: symbolId,
          status: 'open'
        }).sort({ startTime: -1 });

        // Only proceed if we have both ChartSignal and TradeSession
        if (!chartSignal || !currentSession) {
          console.error(`Missing required data - ChartSignal: ${!!chartSignal}, TradeSession: ${!!currentSession} for symbol ${symbolId}`);
          return;
        }

        let open, high, low, close;

        // Use the ChartSignal's open price for this minute
        open = chartSignal.open;
        high = chartSignal.high;
        low = chartSignal.low;
        close = price;

        // Store in OtcSecondPrice with OHLC data, ChartSignal ID, and Session ID
        const otcSecondPrice = await OtcSecondPrice.create({
          symbol: symbolId,
          chartSignalId: chartSignal._id,
          sessionId: currentSession._id,
          price,
          open,
          high,
          low,
          close,
          previousPrice: previousPrice,
          timestamp: now
        });

        recordCount++;

        // Update previous price for next iteration
        previousPrice = price;

        // Update ChartSignal (1m candle)
        const updatedCandle = await this.updateCurrentCandleWithSecondPrice(symbolId, price, now);
        if (updatedCandle) {
          await OtcSecondPrice.findByIdAndUpdate(otcSecondPrice._id, {
            open: updatedCandle.open,
            high: updatedCandle.high,
            low: updatedCandle.low,
            close: updatedCandle.close
          });

          // Broadcast to clients
          this.broadcastSecondPrice(symbolId, price, now, { open: updatedCandle.open, high: updatedCandle.high, low: updatedCandle.low, close: updatedCandle.close, previousPrice });
        }

      } catch (err) {
        console.error('Error in per-second price generation:', err);
      }
    };

    // Execute immediately to get the first record
    generateAndStorePrice();

    // Start a new per-second interval for this ChartSignal
    const intervalId = setInterval(generateAndStorePrice, 1000); // Run every 1000ms (1 second) to get ~60 records per minute

    // Store interval using ChartSignal ID as key
    this.secondIntervals.set(chartSignalId, intervalId);

    // Log that interval is set up
    console.log(`Interval set up for ChartSignal ${chartSignalId}, will run for 60 seconds with ~60 records per minute`);
  }

  stopSecondPriceInterval(chartSignalId) {
    const intervalId = this.secondIntervals.get(chartSignalId);
    if (intervalId) {
      clearInterval(intervalId);
      this.secondIntervals.delete(chartSignalId);
      console.log(`Stopped second price interval for ChartSignal: ${chartSignalId}`);
    }
  }

  broadcastSecondPrice(symbolId, price, timestamp, ohlc = null) {
    const message = JSON.stringify({
      type: 'second_price',
      data: {
        symbolId,
        price,
        timestamp,
        ...(ohlc && { ohlc })
      },
      timestamp: new Date().toISOString()
    });
    this.clients.forEach((clientData, ws) => {
      if (clientData.subscriptions.has(symbolId) && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  async updateCurrentCandleWithSecondPrice(symbolId, price, now) {
    // Find the current minute's ChartSignal (should already exist from generateChartSignal)
    const minuteTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
    const candle = await ChartSignal.findOne({ symbol: symbolId, timestamp: minuteTimestamp });

    if (candle) {
      // Get symbol constraints
      const symbol = this.otcSymbols.get(symbolId);
      const minPrice = symbol?.min_market_price;
      const maxPrice = symbol?.max_market_price;

      // Constrain the price within min/max bounds
      const constrainedPrice = Math.max(
        minPrice || 0,
        Math.min(maxPrice || Infinity, price)
      );

      // Find all OtcSecondPrice records for this ChartSignal
      const secondPrices = await OtcSecondPrice.find({
        chartSignalId: candle._id
      }).sort({ timestamp: 1 });

      if (secondPrices.length > 0) {
        // Calculate actual high and low from OtcSecondPrice records (with constraints)
        const prices = secondPrices.map(sp => {
          // Ensure each second price is also constrained
          return Math.max(
            minPrice || 0,
            Math.min(maxPrice || Infinity, sp.price)
          );
        });

        const actualHigh = Math.max(...prices, constrainedPrice);
        const actualLow = Math.min(...prices, constrainedPrice);
        const actualClose = constrainedPrice; // Current constrained price is the close

        // Update ChartSignal with actual high, low, close
        candle.high = actualHigh;
        candle.low = actualLow;
        candle.close = actualClose;
        await candle.save();

        // Update TradeSession with the same values
        const session = await TradeSession.findOne({
          symbol: symbolId,
          status: 'open'
        }).sort({ startTime: -1 });

        if (session) {
          session.high = actualHigh;
          session.low = actualLow;
          session.close = actualClose;
          await session.save();
        }
      } else {
        // Fallback: if no second prices found, use current constrained price
        candle.high = Math.max(candle.high, constrainedPrice);
        candle.low = Math.min(candle.low, constrainedPrice);
        candle.close = constrainedPrice;
        await candle.save();
      }

      return candle;
    } else {
      console.error(`ChartSignal not found for symbol ${symbolId} at timestamp ${minuteTimestamp}`);
    }
  }

  // Method to get current prices for all OTC symbols
  getCurrentPrices() {
    const prices = {};
    this.otcSymbols.forEach((symbol, symbolId) => {
      prices[symbolId] = {
        symbol: symbol.pair,
        price: symbol.currentPrice,
        timestamp: new Date().toISOString()
      };
    });
    return prices;
  }

  // Method to get chart history for a symbol
  async getChartHistory(symbolId, limit = 100) {
    try {
      const signals = await ChartSignal.find({ symbol: symbolId })
        .sort({ timestamp: -1 })
        .limit(limit);
      return signals.reverse();
    } catch (error) {
      console.error('Error getting chart history:', error);
      return [];
    }
  }

  async handlePlaceTrade(ws, data) {
    try {
      const { userId, symbolId, direction, amount, account_type } = data;
      if (!userId || !symbolId || !direction || !amount || !account_type) {
        ws.send(JSON.stringify({ type: 'trade_error', message: 'Missing required fields.' }));
        return;
      }

      // Validate account_type
      if (!['main', 'demo'].includes(account_type)) {
        ws.send(JSON.stringify({ type: 'trade_error', message: 'Invalid account type. Must be "main" or "demo".' }));
        return;
      }

      // Find the current open session for this symbol
      const session = await TradeSession.findOne({ symbol: symbolId, status: 'open' }).sort({ startTime: -1 });
      if (!session) {
        ws.send(JSON.stringify({ type: 'trade_error', message: 'No open session for this symbol.' }));
        return;
      }

      const now = new Date();
      const elapsed = (now.getTime() - session.startTime.getTime()) / 1000;
      if (elapsed > 29) {
        ws.send(JSON.stringify({ type: 'trade_timeout', message: 'Trade window closed for this session.' }));
        return;
      }

      // Get user and validate balance

      const user = await User.findById(userId);
      if (!user) {
        ws.send(JSON.stringify({ type: 'trade_error', message: 'User not found.' }));
        return;
      }

      // Check balance based on account type
      let currentBalance = 0;
      if (account_type === 'main') {
        currentBalance = user.main_balance || 0;
      } else if (account_type === 'demo') {
        currentBalance = user.demo_balance || 0;
      }

      // Validate amount
      if (amount <= 0) {
        ws.send(JSON.stringify({ type: 'trade_error', message: 'Amount must be greater than 0.' }));
        return;
      }

      // Check if user has sufficient balance
      if (currentBalance < amount) {
        ws.send(JSON.stringify({
          type: 'trade_error',
          message: `Insufficient ${account_type} balance. Required: ${amount}, Available: ${currentBalance}`
        }));
        return;
      }

      // Deduct balance from user account
      if (account_type === 'main') {
        user.main_balance -= amount;
      } else if (account_type === 'demo') {
        user.demo_balance -= amount;
      }
      await user.save();

      // Place the trade
      const trade = await Trade.create({
        user: userId,
        amount,
        bidPrice: session.open,
        system_type: 'timer',
        bidTime: now,
        status: 'pending',
        pair: symbolId,
        direction,
        account_type,
        expiryTime: session.endTime,
        sessionId: session._id
      });

      ws.send(JSON.stringify({
        type: 'trade_placed',
        data: trade,
        message: `Trade placed successfully. ${amount} deducted from ${account_type} balance.`
      }));

      console.log(`Trade placed: User ${userId}, Amount: ${amount}, Account: ${account_type}, Direction: ${direction}`);

    } catch (error) {
      console.error('Error placing trade:', error);
      ws.send(JSON.stringify({ type: 'trade_error', message: error.message }));
    }
  }

  async handleTradeSessionEnd(symbolId) {
    try {
      // Find the closed session
      const session = await TradeSession.findOne({
        symbol: symbolId,
        status: 'closed'
      }).sort({ startTime: -1 });

      if (!session) {
        console.log(`No closed session found for symbol ${symbolId}`);
        return;
      }

      // Get all pending trades for this session
      const pendingTrades = await Trade.find({
        sessionId: session._id,
        status: 'pending'
      });

      if (pendingTrades.length === 0) {
        console.log(`No pending trades found for session ${session._id}`);
        return;
      }

      const finalPrice = session.close;
      const openPrice = session.open;

      console.log(`Processing ${pendingTrades.length} trades for session ${session._id}`);
      console.log(`Open price: ${openPrice}, Close price: ${finalPrice}`);

      for (const trade of pendingTrades) {
        try {
          // Determine if trade is profitable
          let isProfitable = false;
          let profitAmount = 0;

          if (trade.direction === 'up') {
            isProfitable = finalPrice > openPrice;
          } else if (trade.direction === 'down') {
            isProfitable = finalPrice < openPrice;
          }

          // Calculate profit (80% return for winning trades, 0% for losing trades)
          if (isProfitable) {
            profitAmount = trade.amount;
          }

          // Update trade status
          trade.status = isProfitable ? 'profit' : 'loss';
          trade.payout = profitAmount;
          trade.resultPrice = finalPrice;
          await trade.save();

          // Update user balance
          const user = await User.findById(trade.user);
          if (user) {
            if (trade.account_type === 'main') {
              user.main_balance += profitAmount;
            } else if (trade.account_type === 'demo') {
              user.demo_balance += profitAmount;
            }
            await user.save();

            console.log(`User ${trade.user} ${isProfitable ? 'Profit' : 'Loss'} ${profitAmount} on ${trade.account_type} account`);
          }

          // Broadcast trade result to client
          this.broadcastTradeResult(trade);

        } catch (error) {
          console.error(`Error processing trade ${trade._id}:`, error);
        }
      }

      console.log(`Completed processing trades for session ${session._id}`);

    } catch (error) {
      console.error('Error handling trade session end:', error);
    }
  }

  broadcastTradeResult(trade) {
    const message = JSON.stringify({
      type: 'trade_result',
      data: {
        tradeId: trade._id,
        userId: trade.user,
        symbolId: trade.pair,
        direction: trade.direction,
        amount: trade.amount,
        account_type: trade.account_type,
        status: trade.status,
        payout: trade.payout,
        resultPrice: trade.resultPrice,
        openPrice: trade.bidPrice,
        openTime: trade.bidTime
      },
      timestamp: new Date().toISOString()
    });

    // Send to the specific user who made the trade
    this.clients.forEach((clientData, ws) => {
      if (clientData.userId === trade.user.toString() && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  async getCurrentSessionDirection(symbolId) {
    try {
      const session = await TradeSession.findOne({
        symbol: symbolId,
        status: 'open'
      }).sort({ startTime: -1 });

      if (!session || !session.priceDirection) return null;

      const now = new Date();
      const elapsed = (now.getTime() - session.startTime.getTime()) / 1000;

      return {
        direction: session.priceDirection,
        elapsed,
        sessionId: session._id
      };
    } catch (error) {
      console.error('Error getting session direction:', error);
      return null;
    }
  }

  applyPriceDirection(generator, directionInfo) {
    const { direction, elapsed } = directionInfo;

    // If direction is neutral or no trades, provide mixed/random movements
    if (direction === 'neutral' || !direction) {
      // Random trend between -0.02 and 0.02 (small random movement)
      generator.trend = (Math.random() - 0.5) * 0.04;
      generator.volatility = 0.015; // Normal volatility
      return;
    }

    // For non-neutral directions, create longer candles with higher volatility
    generator.volatility = 0.04; // Double the volatility for longer candles

    // First 10 seconds (30s-40s): Go in reverse direction
    if (elapsed >= 30 && elapsed <= 40) {
      if (direction === 'up') {
        generator.trend = -0.08; // Strong downward trend (reverse)
      } else if (direction === 'down') {
        generator.trend = 0.08; // Strong upward trend (reverse)
      }
    }
    // After 40s: Continue in the determined direction
    else if (elapsed > 40) {
      if (direction === 'up') {
        generator.trend = 0.06; // Strong upward trend
      } else if (direction === 'down') {
        generator.trend = -0.06; // Strong downward trend
      }
    }
  }

  broadcastNewCandle(symbolId, timestamp) {
    const message = JSON.stringify({
      type: 'new_candle',
      symbolId,
      timestamp
    });

    // Send new candle notification to all subscribed clients
    this.clients.forEach((clientData, ws) => {
      if (clientData.subscriptions.has(symbolId) && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });

    // Send user-specific trade history to authenticated users
    this.broadcastUserTradeHistory(symbolId);
  }

  async broadcastUserTradeHistory(symbolId) {
    try {
      // Get all authenticated clients subscribed to this symbol
      const authenticatedClients = [];
      this.clients.forEach((clientData, ws) => {
        if (clientData.userId && clientData.subscriptions.has(symbolId) && ws.readyState === WebSocket.OPEN) {
          authenticatedClients.push({ ws, userId: clientData.userId });
        }
      });

      if (authenticatedClients.length === 0) {
        return;
      }

      // Send user-specific trade history to each authenticated user
      for (const { ws, userId } of authenticatedClients) {
        await this.sendUserTradeHistory(ws, userId, symbolId);
      }

      console.log(`Sent user-specific trade history to ${authenticatedClients.length} users for symbol ${symbolId}`);

    } catch (error) {
      console.error('Error broadcasting user trade history:', error);
    }
  }

  async sendUserTradeHistory(ws, userId, symbolId = null) {
    try {
      const tradeHistory = await this.getUserTradeHistory(userId, symbolId);

      const message = JSON.stringify({
        type: 'user_trade_history',
        symbolId,
        data: tradeHistory,
        timestamp: new Date().toISOString()
      });

      ws.send(message);

    } catch (error) {
      console.error('Error sending user trade history:', error);
    }
  }

  async getUserTradeHistory(userId, symbolId = null, limit = 50) {
    try {
      const query = { user: userId };
      if (symbolId) {
        query.pair = symbolId;
      }

      const trades = await Trade.find(query)
        .sort({ bidTime: -1 })
        .limit(limit)
        .populate('user', 'username email');

      return {
        trades,
        summary: this.calculateTradeSummary(trades)
      };
    } catch (error) {
      console.error('Error getting user trade history:', error);
      return { trades: [], summary: {} };
    }
  }

  calculateTradeSummary(trades) {
    const summary = {
      totalTrades: trades.length,
      totalAmount: 0,
      totalProfit: 0,
      totalLoss: 0,
      winCount: 0,
      lossCount: 0,
      pendingCount: 0,
      winRate: 0,
      averageProfit: 0,
      averageLoss: 0
    };

    trades.forEach(trade => {
      summary.totalAmount += trade.amount || 0;

      if (trade.status === 'profit') {
        summary.totalProfit += trade.payout || 0;
        summary.winCount++;
      } else if (trade.status === 'loss') {
        summary.totalLoss += trade.amount || 0; // Loss is the original amount
        summary.lossCount++;
      } else if (trade.status === 'pending') {
        summary.pendingCount++;
      }
    });

    // Calculate percentages and averages
    const completedTrades = summary.winCount + summary.lossCount;
    if (completedTrades > 0) {
      summary.winRate = (summary.winCount / completedTrades) * 100;
      summary.averageProfit = summary.winCount > 0 ? summary.totalProfit / summary.winCount : 0;
      summary.averageLoss = summary.lossCount > 0 ? summary.totalLoss / summary.lossCount : 0;
    }

    return summary;
  }
}

module.exports = OTCWebSocketService; 