import React, { useContext, useEffect, useState, useRef } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { motion } from "framer-motion";
import MarketFilters from "../../components/MarketFilters";

const Home = () => {
  const { allCoin, filteredCoins, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);

  const [searchResults, setSearchResults] = useState([]);

  const marketSectionRef = useRef(null);
  const observerTarget = useRef(null);

  const inputHandler = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val === "") {
      setDisplayCoin(filteredCoins);
      setSearchResults([]);
    } else {
      const matches = allCoin.filter(coin =>
        coin.name.toLowerCase().includes(val.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setSearchResults(matches);
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (input && filteredCoins) {
      setDisplayCoin(
        filteredCoins.filter((item) =>
          item.name.toLowerCase().includes(input.toLowerCase())
        )
      );
      setSearchResults([]);
      // AUTO-SCROLL TO RESULTS
      marketSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setDisplayCoin(filteredCoins);
    }
  };

  const loadMore = () => {
    if (visibleCount < displayCoin.length) {
      setVisibleCount(prev => prev + 50);
    }
  };

  // INFINITE SCROLL OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && input === "") {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [observerTarget, visibleCount, displayCoin, input]);

  useEffect(() => {
    setDisplayCoin(filteredCoins);
  }, [filteredCoins]);

  return (
    <div className="home-container">
      {/* -------------------------------------------
        FINAL REDESIGN HERO SECTION
        -------------------------------------------
      */}
      <section className="cosmic-hero">
        <div className="hero-glow-center"></div>

        {/* Pill Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Start Your Journey with CryptoHub
        </motion.div>

        {/* Hero Content */}
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Sailing The Seas Of <br />
            Crypto Universe
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore real-time data across the blockchain galaxy.
          </motion.p>

          <motion.div
            className="search-orbit-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="search-wrapper-professional">
              <form className="search-bar-cosmic" onSubmit={searchHandler}>
                <FiSearch style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '12px', fontSize: '1.2rem' }} />
                <input
                  value={input}
                  onChange={inputHandler}
                  placeholder="Search Tokens..."
                  autoComplete="off"
                />
              </form>

              {/* Dynamic Results Dropdown */}
              {searchResults.length > 0 && (
                <motion.div
                  className="search-results-dropdown glass-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {searchResults.map((coin) => (
                    <Link
                      key={coin.id}
                      to={`/coin/${coin.id}`}
                      className="dropdown-item"
                      onClick={() => setSearchResults([])}
                    >
                      <div className="item-info">
                        <img src={coin.image} alt={coin.name} />
                        <span className="symbol">{coin.symbol.toUpperCase()}</span>
                        <span className="name">{coin.name}</span>
                      </div>
                      <span className="price">{currency.Symbol || currency.symbol}{coin.current_price.toLocaleString()}</span>
                    </Link>
                  ))}
                  <div className="dropdown-footer" onClick={searchHandler}>
                    View all in Market Overview →
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Top Coins Marquee - Integrated below search */}
          <div className="top-coins-marquee">
            <div className="marquee-content">
              {[...allCoin.slice(0, 10), ...allCoin.slice(0, 10)].map((coin, index) => (
                <div className="marquee-item" key={index}>
                  <img src={coin.image} alt={coin.name} />
                  <span className="marquee-symbol">{coin.symbol.toUpperCase()}</span>
                  <span className={`marquee-change ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                    {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements (Orbitals) */}
        <div className="hero-orbitals">
          <motion.div
            className="orbital-element glass-card orb-1"
            whileHover={{ scale: 1.1 }}
          >
            Bitcoin <span className="col-change positive">+5.2%</span>
          </motion.div>
          <motion.div
            className="orbital-element glass-card orb-2"
            whileHover={{ scale: 1.1 }}
          >
            Solana <span className="col-change positive">+8.5%</span>
          </motion.div>
          <motion.div
            className="orbital-element glass-card orb-3"
            whileHover={{ scale: 1.1 }}
          >
            Cardano <span className="col-change negative">-2.1%</span>
          </motion.div>
          <motion.div
            className="orbital-element glass-card orb-4"
            whileHover={{ scale: 1.1 }}
          >
            Ethereum <span className="col-change positive">+1.5%</span>
          </motion.div>
          <motion.div
            className="orbital-element glass-card orb-5"
            whileHover={{ scale: 1.1 }}
          >
            BNB <span className="col-change positive">+1.2%</span>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------
        MARKET DATA SECTION
        -------------------------------------------
      */}
      <section className="market-section" ref={marketSectionRef}>
        <div className="section-header">
          <h2>Market Overview</h2>
          <div className="market-actions">
            <div className="live-indicator">
              <span className="dot-pulse"></span> Live Updates
            </div>
            <MarketFilters />
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <p className="col-rank">#</p>
            <p className="col-name">Asset</p>
            <p>Price</p>
            <p>24h Change</p>
            <p className="col-mcap">Market Cap</p>
          </div>
          <div className="table-body">
            {displayCoin && displayCoin.length > 0 ? (
              displayCoin.slice(0, visibleCount).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.3, delay: (index % 10) * 0.03 }}
                >
                  <Link to={`/coin/${item.id}`} className="table-row">
                    <p className="col-rank">{item.market_cap_rank}</p>
                    <div className="col-name">
                      <img className="coin-icon" src={item.image} alt={item.name} />
                      <div className="coin-info">
                        <p className="coin-symbol">{item.symbol.toUpperCase()}</p>
                        <p className="coin-fullname">{item.name}</p>
                      </div>
                    </div>
                    <p className="col-price">
                      {currency.Symbol || currency.symbol}
                      {item.current_price.toLocaleString()}
                    </p>
                    <div className={`col-change ${item.price_change_percentage_24h > 0 ? "positive" : "negative"}`}>
                      {item.price_change_percentage_24h > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                      {item.price_change_percentage_24h?.toFixed(2)}%
                    </div>
                    <p className="col-mcap">
                      {currency.Symbol || currency.symbol}
                      {item.market_cap.toLocaleString()}
                    </p>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#fff',
                fontSize: '1.1rem'
              }}>
                {allCoin && allCoin.length === 0 ? 'Loading crypto data...' : 'No coins found. Try adjusting your filters.'}
              </div>
            )}
          </div>

          {/* INFINITE SCROLL SENTINEL */}
          <div ref={observerTarget} style={{ height: '20px', width: '100%' }}></div>
        </div>

        {visibleCount < displayCoin.length && (
          <div className="load-more-container">
            <button className="btn-load-more" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
