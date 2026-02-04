/**
 * Advanced Cryptocurrency Utilities for CryptoHub
 * Comprehensive utilities for crypto calculations, formatting,
 * price analysis, portfolio management, and market data processing.
 * * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// PRICE FORMATTING UTILITIES
// ============================================================

/**
 * Formats a price value with appropriate precision
 */
export const formatPrice = (price, currency = 'USD', options = {}) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'N/A';
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = price < 1 ? 8 : price < 100 ? 4 : 2,
    compact = false,
    showSign = false
  } = options;

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
      notation: compact ? 'compact' : 'standard',
      signDisplay: showSign ? 'exceptZero' : 'auto'
    });

    return formatter.format(price);
  } catch (error) {
    const prefix = showSign && price > 0 ? '+' : '';
    return `${prefix}${currency} ${price.toFixed(maximumFractionDigits)}`;
  }
};

/**
 * Formats a crypto amount with appropriate precision
 */
export const formatCryptoAmount = (amount, symbol = '', options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }

  const {
    precision = 8,
    trimZeros = true,
    showSymbol = true
  } = options;

  let formatted = amount.toFixed(precision);

  if (trimZeros) {
    formatted = parseFloat(formatted).toString();
  }

  return showSymbol && symbol ? `${formatted} ${symbol}` : formatted;
};

/**
 * Formats percentage values
 */
export const formatPercentage = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const {
    decimals = 2,
    showSign = true,
    suffix = '%'
  } = options;

  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}${suffix}`;
};

/**
 * Formats large numbers with abbreviations
 */
export const formatLargeNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e12) return `${sign}${(absNum / 1e12).toFixed(decimals)}T`;
  if (absNum >= 1e9) return `${sign}${(absNum / 1e9).toFixed(decimals)}B`;
  if (absNum >= 1e6) return `${sign}${(absNum / 1e6).toFixed(decimals)}M`;
  if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(decimals)}K`;

  return `${sign}${absNum.toFixed(decimals)}`;
};

/**
 * Formats market cap - Merged and Fixed Version
 */
export const formatMarketCap = (marketCap, currency = 'USD') => {
  if (marketCap === null || marketCap === undefined || isNaN(marketCap)) return "—";

  const num = Number(marketCap);
  const formatted = formatLargeNumber(num, 1);
  
  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' };
  const symbol = symbols[currency] || (currency + ' ');

  return `${symbol}${formatted}`;
};

/**
 * Formats volume
 */
export const formatVolume = (volume, as24h = true) => {
  if (!volume || isNaN(volume)) return 'N/A';

  const formatted = formatLargeNumber(volume);
  return as24h ? `${formatted} (24h)` : formatted;
};

// ============================================================
// PRICE CALCULATION UTILITIES
// ============================================================

export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

export const calculateProfitLoss = (buyPrice, currentPrice, amount) => {
  const invested = buyPrice * amount;
  const currentValue = currentPrice * amount;
  const profitLoss = currentValue - invested;
  const percentageChange = calculatePercentageChange(invested, currentValue);

  return { invested, currentValue, profitLoss, percentageChange, isProfit: profitLoss >= 0 };
};

export const calculateAveragePrice = (purchases) => {
  if (!purchases || purchases.length === 0) return 0;
  let totalCost = 0;
  let totalAmount = 0;
  for (const purchase of purchases) {
    totalCost += purchase.price * purchase.amount;
    totalAmount += purchase.amount;
  }
  return totalAmount > 0 ? totalCost / totalAmount : 0;
};

export const calculateBreakEven = (averagePrice, fees, amount) => {
  if (!amount || amount === 0) return averagePrice;
  return averagePrice + (fees / amount);
};

export const calculatePositionSize = (accountBalance, riskPercentage, entryPrice, stopLoss) => {
  const riskAmount = accountBalance * (riskPercentage / 100);
  const priceRisk = Math.abs(entryPrice - stopLoss);
  const positionSize = riskAmount / priceRisk;
  const positionValue = positionSize * entryPrice;

  return { riskAmount, positionSize, positionValue, maxLoss: riskAmount, riskRewardRatio: entryPrice / priceRisk };
};

export const calculateLiquidationPrice = (entryPrice, leverage, isLong = true, maintenanceMargin = 0.5) => {
  const marginPercentage = (100 / leverage) - maintenanceMargin;
  return isLong ? entryPrice * (1 - marginPercentage / 100) : entryPrice * (1 + marginPercentage / 100);
};

// ============================================================
// PORTFOLIO CALCULATIONS
// ============================================================

export const calculateAllocation = (holdings) => {
  if (!holdings || holdings.length === 0) return [];
  const totalValue = holdings.reduce((sum, h) => sum + (h.value || 0), 0);
  return holdings.map(holding => ({
    ...holding,
    allocation: totalValue > 0 ? (holding.value / totalValue) * 100 : 0
  }));
};

export const calculatePortfolioValue = (holdings, prices) => {
  let totalValue = 0;
  let totalInvested = 0;
  const breakdown = [];

  for (const holding of holdings) {
    const currentPrice = prices[holding.symbol] || 0;
    const value = holding.amount * currentPrice;
    const invested = holding.amount * (holding.averagePrice || currentPrice);
    totalValue += value;
    totalInvested += invested;
    breakdown.push({
      ...holding,
      currentPrice,
      value,
      invested,
      profitLoss: value - invested,
      percentageChange: calculatePercentageChange(invested, value)
    });
  }

  return {
    totalValue,
    totalInvested,
    totalProfitLoss: totalValue - totalInvested,
    totalPercentageChange: calculatePercentageChange(totalInvested, totalValue),
    breakdown: calculateAllocation(breakdown)
  };
};

export const calculateDiversificationScore = (holdings) => {
  if (!holdings || holdings.length === 0) {
    return { score: 0, rating: 'None', recommendation: 'Add some holdings' };
  }
  const hhi = holdings.reduce((sum, h) => sum + Math.pow((h.allocation || 0) / 100, 2), 0);
  const maxHHI = 1;
  const minHHI = 1 / holdings.length;
  const score = Math.round((1 - (hhi - minHHI) / (maxHHI - minHHI)) * 100);

  let rating, recommendation;
  if (score >= 80) { rating = 'Excellent'; recommendation = 'Well diversified portfolio'; }
  else if (score >= 60) { rating = 'Good'; recommendation = 'Consider adding a few more assets'; }
  else if (score >= 40) { rating = 'Moderate'; recommendation = 'Consider rebalancing to reduce concentration'; }
  else if (score >= 20) { rating = 'Poor'; recommendation = 'Portfolio is too concentrated'; }
  else { rating = 'Very Poor'; recommendation = 'Significant concentration risk'; }

  return { score, rating, recommendation, hhi, numberOfAssets: holdings.length };
};

export const suggestRebalancing = (currentHoldings, targetAllocations, totalValue) => {
  const suggestions = [];
  const targetMap = new Map(targetAllocations.map(t => [t.symbol, t.target]));

  for (const holding of currentHoldings) {
    const target = targetMap.get(holding.symbol) || 0;
    const current = holding.allocation || 0;
    const difference = target - current;

    if (Math.abs(difference) > 1) {
      const valueChange = (totalValue * difference) / 100;
      suggestions.push({
        symbol: holding.symbol,
        action: difference > 0 ? 'BUY' : 'SELL',
        currentAllocation: current,
        targetAllocation: target,
        difference,
        valueChange: Math.abs(valueChange),
        amountChange: holding.currentPrice ? Math.abs(valueChange / holding.currentPrice) : 0
      });
    }
  }
  return suggestions.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
};

// ============================================================
// TECHNICAL ANALYSIS UTILITIES
// ============================================================

export const calculateSMA = (data, period) => {
  if (!data || data.length < period) return [];
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return [];
  const multiplier = 2 / (period + 1);
  const ema = [data.slice(0, period).reduce((a, b) => a + b, 0) / period];
  for (let i = period; i < data.length; i++) {
    ema.push((data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
  }
  return ema;
};

export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) return [];
  const changes = [];
  for (let i = 1; i < data.length; i++) changes.push(data[i] - data[i - 1]);
  const gains = changes.map(c => c > 0 ? c : 0);
  const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rsi = [100 - (100 / (1 + avgGain / avgLoss))];
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rsi.push(avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss)));
  }
  return rsi;
};

export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!data || data.length < slowPeriod) return { macd: [], signal: [], histogram: [] };
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  const macd = [];
  const diff = slowPeriod - fastPeriod;
  for (let i = 0; i < slowEMA.length; i++) macd.push(fastEMA[i + diff] - slowEMA[i]);
  const signal = calculateEMA(macd, signalPeriod);
  const histogram = [];
  for (let i = signalPeriod - 1; i < macd.length; i++) histogram.push(macd[i] - signal[i - signalPeriod + 1]);
  return { macd, signal, histogram };
};

export const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  if (!data || data.length < period) return { upper: [], middle: [], lower: [] };
  const middle = calculateSMA(data, period);
  const upper = [];
  const lower = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = middle[i - period + 1];
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    upper.push(mean + std * stdDev);
    lower.push(mean - std * stdDev);
  }
  return { upper, middle, lower };
};

export const calculateATR = (candles, period = 14) => {
  if (!candles || candles.length < period + 1) return [];
  const trueRanges = [];
  for (let i = 1; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    );
    trueRanges.push(tr);
  }
  return calculateEMA(trueRanges, period);
};

export const findSupportResistance = (data, lookback = 20) => {
  if (!data || data.length < lookback * 2) return { support: [], resistance: [] };
  const support = [], resistance = [];
  for (let i = lookback; i < data.length - lookback; i++) {
    const left = data.slice(i - lookback, i), right = data.slice(i + 1, i + lookback + 1), curr = data[i];
    if (Math.min(...left) >= curr && Math.min(...right) >= curr) support.push({ index: i, price: curr });
    if (Math.max(...left) <= curr && Math.max(...right) <= curr) resistance.push({ index: i, price: curr });
  }
  const clusterLevels = (levels, threshold = 0.02) => {
    if (levels.length === 0) return [];
    const sorted = [...levels].sort((a, b) => a.price - b.price);
    const clustered = [];
    let currentCluster = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      if ((sorted[i].price - currentCluster[0].price) / currentCluster[0].price < threshold) currentCluster.push(sorted[i]);
      else {
        clustered.push({ price: currentCluster.reduce((s, l) => s + l.price, 0) / currentCluster.length, strength: currentCluster.length });
        currentCluster = [sorted[i]];
      }
    }
    clustered.push({ price: currentCluster.reduce((s, l) => s + l.price, 0) / currentCluster.length, strength: currentCluster.length });
    return clustered;
  };
  return { support: clusterLevels(support), resistance: clusterLevels(resistance) };
};

// ============================================================
// MARKET SENTIMENT UTILITIES
// ============================================================

export const calculateFearGreedIndex = (metrics) => {
  const { priceChange24h = 0, volumeChange = 0, marketCapChange = 0, volatility = 0, socialSentiment = 50 } = metrics;
  const priceScore = Math.min(100, Math.max(0, 50 + priceChange24h * 2));
  const volumeScore = Math.min(100, Math.max(0, 50 + volumeChange * 1.5));
  const marketCapScore = Math.min(100, Math.max(0, 50 + marketCapChange * 2));
  const volatilityScore = Math.min(100, Math.max(0, 100 - volatility * 10));
  const index = Math.round(priceScore * 0.25 + volumeScore * 0.2 + marketCapScore * 0.2 + volatilityScore * 0.15 + socialSentiment * 0.2);
  let sentiment, color;
  if (index <= 20) { sentiment = 'Extreme Fear'; color = '#ff0000'; }
  else if (index <= 40) { sentiment = 'Fear'; color = '#ff6600'; }
  else if (index <= 60) { sentiment = 'Neutral'; color = '#ffcc00'; }
  else if (index <= 80) { sentiment = 'Greed'; color = '#99cc00'; }
  else { sentiment = 'Extreme Greed'; color = '#00cc00'; }
  return { index, sentiment, color, components: { price: priceScore, volume: volumeScore, marketCap: marketCapScore, volatility: volatilityScore, social: socialSentiment } };
};

export const analyzeTrend = (prices) => {
  if (!prices || prices.length < 20) return { trend: 'Unknown', strength: 0 };
  const sma20 = calculateSMA(prices, 20), sma50 = calculateSMA(prices, Math.min(50, prices.length));
  const curr = prices[prices.length - 1], l20 = sma20[sma20.length - 1], l50 = sma50[sma50.length - 1], rsi = calculateRSI(prices).pop();
  let trend, strength;
  if (curr > l20 && l20 > l50) { trend = 'Bullish'; strength = Math.min(100, 50 + (curr / l20 - 1) * 100 + (rsi - 50)); }
  else if (curr < l20 && l20 < l50) { trend = 'Bearish'; strength = Math.min(100, 50 + (1 - curr / l20) * 100 + (50 - rsi)); }
  else { trend = 'Neutral'; strength = 50; }
  return { trend, strength: Math.round(strength), sma20: l20, sma50: l50, rsi, priceAboveSMA20: curr > l20, priceAboveSMA50: curr > l50, goldenCross: l20 > l50, deathCross: l20 < l50 };
};

// ============================================================
// PRICE ALERT UTILITIES
// ============================================================

export const AlertConditions = {
  PRICE_ABOVE: 'price_above',
  PRICE_BELOW: 'price_below',
  PERCENTAGE_CHANGE: 'percentage_change',
  RSI_OVERSOLD: 'rsi_oversold',
  RSI_OVERBOUGHT: 'rsi_overbought',
  VOLUME_SPIKE: 'volume_spike'
};

export const checkAlertCondition = (alert, marketData) => {
  const { condition, value, symbol } = alert;
  const { price, price24hAgo, volume, volume24hAgo, rsi } = marketData;
  let triggered = false, message = '';
  switch (condition) {
    case AlertConditions.PRICE_ABOVE: triggered = price >= value; message = `${symbol} above ${formatPrice(value)}`; break;
    case AlertConditions.PRICE_BELOW: triggered = price <= value; message = `${symbol} below ${formatPrice(value)}`; break;
    case AlertConditions.PERCENTAGE_CHANGE: const ch = calculatePercentageChange(price24hAgo, price); triggered = Math.abs(ch) >= value; message = `${symbol} changed ${formatPercentage(ch)}`; break;
    case AlertConditions.RSI_OVERSOLD: triggered = rsi <= (value || 30); message = `${symbol} RSI oversold at ${rsi?.toFixed(2)}`; break;
    case AlertConditions.RSI_OVERBOUGHT: triggered = rsi >= (value || 70); message = `${symbol} RSI overbought at ${rsi?.toFixed(2)}`; break;
    case AlertConditions.VOLUME_SPIKE: const vch = calculatePercentageChange(volume24hAgo, volume); triggered = vch >= (value || 100); message = `${symbol} volume spiked ${formatPercentage(vch)}`; break;
    default: message = 'Unknown condition';
  }
  return { triggered, message, timestamp: new Date().toISOString(), data: { price, rsi, volume } };
};

// ============================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================

export const aggregateCandles = (candles, targetMinutes) => {
  if (!candles || candles.length === 0) return [];
  const aggregated = [];
  let current = null;
  for (const candle of candles) {
    const periodStart = Math.floor(new Date(candle.timestamp).getTime() / (targetMinutes * 60000)) * (targetMinutes * 60000);
    if (!current || current.timestamp !== periodStart) {
      if (current) aggregated.push(current);
      current = { timestamp: periodStart, open: candle.open, high: candle.high, low: candle.low, close: candle.close, volume: candle.volume };
    } else {
      current.high = Math.max(current.high, candle.high);
      current.low = Math.min(current.low, candle.low);
      current.close = candle.close;
      current.volume += candle.volume;
    }
  }
  if (current) aggregated.push(current);
  return aggregated;
};

export const calculateStatistics = (prices) => {
  if (!prices || prices.length === 0) return { min: 0, max: 0, mean: 0, median: 0, stdDev: 0 };
  const sorted = [...prices].sort((a, b) => a - b), mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / prices.length;
  return { 
    min: sorted[0], max: sorted.pop(), mean, 
    median: prices.length % 2 === 0 ? (sorted[prices.length / 2 - 1] + sorted[prices.length / 2]) / 2 : sorted[Math.floor(prices.length / 2)], 
    stdDev: Math.sqrt(variance) 
  };
};

// ============================================================
// EXPORTS
// ============================================================

const cryptoUtils = {
  formatPrice,
  formatCryptoAmount,
  formatPercentage,
  formatLargeNumber,
  formatMarketCap,
  formatVolume,
  calculatePercentageChange,
  calculateProfitLoss,
  calculateAveragePrice,
  calculateBreakEven,
  calculatePositionSize,
  calculateLiquidationPrice,
  calculateAllocation,
  calculatePortfolioValue,
  calculateDiversificationScore,
  suggestRebalancing,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateATR,
  findSupportResistance,
  calculateFearGreedIndex,
  analyzeTrend,
  AlertConditions,
  checkAlertCondition,
  aggregateCandles,
  calculateStatistics
};

export default cryptoUtils;;
