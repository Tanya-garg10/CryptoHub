import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CoinContext } from "../../context/CoinContext";
// Check your folder structure: agar utils 'src' ke direct andar hai to "../../utils/cryptoUtils" use karein
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
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 5);
      setTopGainers(gainers);

      const losers = [...allCoin]
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5);
      setTopLosers(losers);

      const top = allCoin.slice(0, 10);
      setTrending(top);
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Top Gainers Card */}
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-[#14141f] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">▲</span> Top Gainers 24h
          </h2>
          <div className="space-y-3">
            {topGainers.map((coin, index) => (
              <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center justify-between p-3 hover:bg-gray-500/10 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt="" className="w-8 h-8" />
                  <div>
                    <p className="font-bold">{coin.name}</p>
                    <p className="text-xs opacity-60">{formatPrice(coin.current_price)}</p>
                  </div>
                </div>
                <span className="text-green-400">+{coin.price_change_percentage_24h?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers Card */}
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-[#14141f] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-red-400">▼</span> Top Losers 24h
          </h2>
          <div className="space-y-3">
            {topLosers.map((coin, index) => (
              <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)} className="flex items-center justify-between p-3 hover:bg-gray-500/10 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt="" className="w-8 h-8" />
                  <div>
                    <p className="font-bold">{coin.name}</p>
                    <p className="text-xs opacity-60">{formatPrice(coin.current_price)}</p>
                  </div>
                </div>
                <span className="text-red-400">{coin.price_change_percentage_24h?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="market-source text-gray-500 text-sm">
          Data powered by <span className="text-[#00d9ff]">CoinGecko API</span>
        </p>
      </div>
    </div>
  );
};

export default MarketOverview;
