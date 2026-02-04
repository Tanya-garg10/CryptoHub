import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CoinContext } from "../../context/CoinContext";
// Ensure this path is 100% correct relative to this file
import { formatMarketCap } from "../../utils/cryptoUtils"; 
import "./MarketOverview.css";

const MarketOverview = () => {
  const { isDark } = useTheme();
  // Safe context destructuring
  const context = useContext(CoinContext);
  const allCoin = context?.allCoin || [];
  const currency = context?.currency || { symbol: "$" };
  
  const navigate = useNavigate();
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (allCoin && allCoin.length > 0) {
      // Create a copy before sorting to avoid mutating original state
      const sortedCoins = [...allCoin];

      const gainers = [...sortedCoins]
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
        .slice(0, 5);
      setTopGainers(gainers);

      const losers = [...sortedCoins]
        .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
        .slice(0, 5);
      setTopLosers(losers);

      setTrending(allCoin.slice(0, 10));
    }
  }, [allCoin]);

  const formatPrice = (price) => {
    const symbol = currency?.symbol || "$";
    return typeof price === 'number' ? `${symbol}${price.toLocaleString()}` : `${symbol}0`;
  };

  return (
    <div className="market-overview-fullwidth p-4 max-w-[1400px] mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">
          Market Overview
        </h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Gainers Section */}
        <section className={`p-6 rounded-2xl border ${isDark ? "bg-[#14141f] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4 text-green-400">Top Gainers 24h</h2>
          <div className="space-y-4">
            {topGainers.map((coin) => (
              <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="flex justify-between items-center cursor-pointer hover:bg-gray-500/5 p-2 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt="" className="w-8 h-8" />
                  <span className="font-semibold">{coin.name}</span>
                </div>
                <span className="text-green-400">+{coin.price_change_percentage_24h?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Losers Section */}
        <section className={`p-6 rounded-2xl border ${isDark ? "bg-[#14141f] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4 text-red-400">Top Losers 24h</h2>
          <div className="space-y-4">
            {topLosers.map((coin) => (
              <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="flex justify-between items-center cursor-pointer hover:bg-gray-500/5 p-2 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt="" className="w-8 h-8" />
                  <span className="font-semibold">{coin.name}</span>
                </div>
                <span className="text-red-400">{coin.price_change_percentage_24h?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Data powered by <span className="text-[#00d9ff]">CoinGecko API</span></p>
      </footer>
    </div>
  );
};

export default MarketOverview;
