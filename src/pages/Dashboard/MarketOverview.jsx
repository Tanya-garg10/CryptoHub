import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CoinContext } from "../../context/CoinContext";
import { formatMarketCap } from "../../utils/cryptoUtils"; 
import "./MarketOverview.css";

const MarketOverview = () => {
  const { isDark } = useTheme();
  const { allCoin, currency } = useContext(CoinContext);
  const navigate = useNavigate();
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (allCoin && allCoin.length > 0) {
      const gainers = [...allCoin]
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
        .slice(0, 5);
      setTopGainers(gainers);

      const losers = [...allCoin]
        .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
        .slice(0, 5);
      setTopLosers(losers);

      setTrending(allCoin.slice(0, 10));
    }
  }, [allCoin]);

  const formatPrice = (price) => {
    const symbol = currency?.symbol || "$";
    return `${symbol}${price.toLocaleString()}`;
  };

  return (
    <div className="market-overview-fullwidth p-4 max-w-[1400px] mx-auto">
      <div className="mb-10 w-full">
        <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">
            Market Overview
          </span>
        </h1>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Real-time cryptocurrency market insights
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gainers */}
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-[#14141f] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">Top Gainers</h2>
          {topGainers.map((coin) => (
            <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center justify-between py-2 cursor-pointer hover:opacity-80">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <span className="font-medium">{coin.name}</span>
              </div>
              <span className="text-green-400">+{coin.price_change_percentage_24h?.toFixed(2)}%</span>
            </div>
          ))}
        </div>

        {/* Losers */}
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-[#14141f] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">Top Losers</h2>
          {topLosers.map((coin) => (
            <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center justify-between py-2 cursor-pointer hover:opacity-80">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <span className="font-medium">{coin.name}</span>
              </div>
              <span className="text-red-400">{coin.price_change_percentage_24h?.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <p className="mt-10 text-center text-sm text-gray-500">
        Data powered by <span className="text-[#00d9ff]">CoinGecko API</span>
      </p>
    </div>
  );
};

export default MarketOverview;
