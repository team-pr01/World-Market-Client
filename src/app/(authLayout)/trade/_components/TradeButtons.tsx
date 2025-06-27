import React, { useState } from 'react';
import './TradeButtons.css';

const TradeButtons = ({ onBuyClick, onSellClick, createHoverOverlay, removeHoverOverlay }) => {
  const [buyHoverArea, setBuyHoverArea] = useState(null);
  const [sellHoverArea, setSellHoverArea] = useState(null);

  const handleBuyHover = () => {
    if (buyHoverArea) removeHoverOverlay(buyHoverArea);
    const area = createHoverOverlay('buy');
    setBuyHoverArea(area);
  };

  const handleBuyLeave = () => {
    if (buyHoverArea) {
      removeHoverOverlay(buyHoverArea);
      setBuyHoverArea(null);
    }
  };

  const handleSellHover = () => {
    if (sellHoverArea) removeHoverOverlay(sellHoverArea);
    const area = createHoverOverlay('sell');
    setSellHoverArea(area);
  };

  const handleSellLeave = () => {
    if (sellHoverArea) {
      removeHoverOverlay(sellHoverArea);
      setSellHoverArea(null);
    }
  };

  return (
    <div className="trade-buttons">
      <button 
        id="buy-btn" 
        className="trade-btn"
        onClick={onBuyClick}
        onMouseEnter={handleBuyHover}
        onMouseLeave={handleBuyLeave}
      >
        Buy ↑
      </button>
      <button 
        id="sell-btn" 
        className="trade-btn"
        onClick={onSellClick}
        onMouseEnter={handleSellHover}
        onMouseLeave={handleSellLeave}
      >
        Sell ↓
      </button>
    </div>
  );
};

export default TradeButtons; 