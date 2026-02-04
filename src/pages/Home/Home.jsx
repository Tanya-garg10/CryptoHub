import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowUpRight, FiArrowDownRight, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";
import MarketFilters from "../../components/MarketFilters";

const Home = () => {
  const { allCoin, filteredCoins, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coinPerPage = 5;

  const totalPages = Math.ceil(displayCoin.length / coinPerPage);
  const paginatedCoins = displayCoin.slice((currentPage - 1) * coinPerPage, currentPage * coinPerPage);

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (e.target.value === "") setDisplayCoin(filteredCoins);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (input && filteredCoins) {
      setDisplayCoin(
        filteredCoins.filter((item) =>
          item.name.toLowerCase().includes(input.toLowerCase()) ||
          item.symbol.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setDisplayCoin(filteredCoins);
    }
  };

  const applyFilters = () => {
    let filtered = [...filteredCoins];
    if (minPrice) filtered = filtered.filter((coin) => coin.current_price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((coin) => coin.current_price <= Number(maxPrice));
    setDisplayCoin(filtered);
    setShowFilters(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
    setDisplayCoin(filteredCoins);
  }, [filteredCoins]);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="cosmic-hero">
        <div className="hero-content">
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="title-purple">Sailing The Seas Of</span> <br />
            <span className="title-cyan">Crypto Universe</span>
          </motion.h1>

          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            Explore real-time data across the blockchain galaxy.
          </motion.p>

          <motion.div className="search-orbit-container" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <form className="search-bar-cosmic" onSubmit={searchHandler}>
              <FiSearch className="search-icon" />
              <input value={input} onChange={inputHandler} list="coinlist" placeholder="Search Tokens..." />
              <button type="button" className="filter-trigger" onClick={() => setShowFilters(!showFilters)}>
                <FiFilter />
              </button>
            </form>
            <p className="search-helper-text">Search by coin name or symbol (e.g., Bitcoin, BTC)</p>

            {showFilters && (
              <motion.div className="cosmic-filters glass-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                <button className="btn-neon-purple" onClick={applyFilters}>Apply</button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* MARKET TABLE SECTION */}
      <section className="market-section">
        <div className="section-header">
          <h2>Market Overview</h2>
          <div className="market-actions">
            <div className="live-indicator">
              <span className="dot-pulse"></span> Live Updates
            </div>
            <MarketFilters />
          </div>
        </div>

        <div className="table-container glass-panel">
          <div className="table-header">
            <div className="col-rank">#</div>
            <div className="col-name">Asset</div>
            <div className="col-price">Price</div>
            <div className="col-change">24h Change</div>
            <div className="col-mcap">Market Cap</div>
          </div>

          <div className="table-body">
            {paginatedCoins.length > 0 ? (
              paginatedCoins.map((item) => (
                <Link to={`/coin/${item.id}`} className="table-row" key={item.id}>
                  <div className="col-rank">{item.market_cap_rank}</div>
                  <div className="col-name">
                    <img src={item.image} alt="" className="coin-icon" />
                    <div className="coin-info">
                      <span className="coin-symbol">{item.symbol.toUpperCase()}</span>
                      <span className="coin-fullname">{item.name}</span>
                    </div>
                  </div>
                  <div className="col-price">
                    {currency.Symbol || currency.symbol}{item.current_price.toLocaleString()}
                  </div>
                  <div className={`col-change ${item.price_change_percentage_24h > 0 ? "positive" : "negative"}`}>
                    {item.price_change_percentage_24h > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
                  </div>
                  <div className="col-mcap">
                    {currency.Symbol || currency.symbol}{item.market_cap.toLocaleString()}
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-data">No coins found.</div>
            )}
          </div>
          
          <div className="pagination">
            <button className="btn-neon-purple" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span className="page-info">Page {currentPage} of {totalPages || 1}</span>
            <button className="btn-neon-purple" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </section>

      <datalist id="coinlist">
        {allCoin?.slice(0, 10).map((c, i) => (
          <option key={i} value={c.name} />
        ))}
      </datalist>
    </div>
  );
};

export default Home;
