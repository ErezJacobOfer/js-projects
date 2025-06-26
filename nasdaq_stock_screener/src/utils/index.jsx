// src/utils/index.jsx
import axios from 'axios';
import { POLYGON_CONFIG, MARKET_CONFIG, TREND_THRESHOLD, API_LIMITS } from '../constants';
import { format, subDays, isWeekend } from 'date-fns';

class PolygonAPI {
  constructor() {
    this.apiKey = POLYGON_CONFIG.API_KEY;
    this.baseURL = POLYGON_CONFIG.BASE_URL;
    this.requestQueue = [];
    this.isProcessing = false;
    
    // Check if API key is configured
    if (!this.apiKey || this.apiKey.includes('your-polygon-api-key')) {
      console.error('Polygon API key is not configured. Please add VITE_POLYGON_API_KEY to your .env file.');
      throw new Error('Polygon API key is required. Please configure VITE_POLYGON_API_KEY in your .env file. Get your free API key at https://polygon.io');
    }
  }

  // Validate API key format
  isValidApiKey(apiKey) {
    return apiKey && 
           typeof apiKey === 'string' && 
           apiKey.length > 10 && 
           !apiKey.includes('your-polygon-api-key') &&
           !apiKey.includes('undefined') &&
           !apiKey.includes('null');
  }

  // Rate limiting utility
  async rateLimitedRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const { url, options, resolve, reject } = this.requestQueue.shift();
      
      try {
        // Validate API key before making request
        if (!this.isValidApiKey(this.apiKey)) {
          throw new Error('Invalid API key format. Please check your VITE_POLYGON_API_KEY in the .env file.');
        }

        const response = await axios.get(url, {
          ...options,
          params: {
            ...options.params,
            apikey: this.apiKey
          },
          timeout: 30000 // 30 second timeout
        });
        resolve(response.data);
      } catch (error) {
        // Enhanced error handling
        if (error.response?.status === 401) {
          const enhancedError = new Error(
            'Authentication failed: Invalid or missing Polygon API key. ' + 'Please verify your VITE_POLYGON_API_KEY in the .env file. '+ 'Get a free API key at https://polygon.io/dashboard/api-keys'
          );
          enhancedError.code = 'INVALID_API_KEY';
          enhancedError.originalError = error;
          reject(enhancedError);
        } else if (error.response?.status === 403) {
          const enhancedError = new Error(
            'Access forbidden: Your API key may not have permission for this endpoint or your subscription tier is insufficient. ' +
            'Check your plan at https://polygon.io/dashboard'
          );
          enhancedError.code = 'ACCESS_FORBIDDEN';
          enhancedError.originalError = error;
          reject(enhancedError);
        } else if (error.response?.status === 429) {
          const enhancedError = new Error(
            'Rate limit exceeded: Too many requests. Free tier allows 5 requests per minute. ' + 'Please wait and try again, or consider upgrading your plan.'
          );
          enhancedError.code = 'RATE_LIMIT_EXCEEDED';
          enhancedError.originalError = error;
          reject(enhancedError);
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          const enhancedError = new Error(
            'Network error: Unable to connect to Polygon API. Please check your internet connection.'
          );
          enhancedError.code = 'NETWORK_ERROR';
          enhancedError.originalError = error;
          reject(enhancedError);
        } else if (error.code === 'ECONNABORTED') {
          const enhancedError = new Error(
            'Request timeout: The API request took too long to complete. Please try again.'
          );
          enhancedError.code = 'TIMEOUT_ERROR';
          enhancedError.originalError = error;
          reject(enhancedError);
        } else {
          reject(error);
        }
      }
      
      // Rate limiting: wait between requests
      if (this.requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 12000)); // 5 requests per minute = 12 seconds between requests
      }
    }
    
    this.isProcessing = false;
  }

  // Get all NASDAQ tickers under $5
  async getNasdaqTickers() {
    try {
      // Pre-validate API key
      if (!this.isValidApiKey(this.apiKey)) {
        throw new Error(
          'Polygon API key is not properly configured. ' + 'Please add a valid VITE_POLYGON_API_KEY to your .env file. '+ 'Get your free API key at https://polygon.io/dashboard/api-keys'
        );
      }
      
      const url = `${this.baseURL}${POLYGON_CONFIG.ENDPOINTS.TICKERS}`;
      const params = {
        market: 'stocks',
        exchange: 'XNAS',
        active: true,
        limit: 1000,
        sort: 'ticker'
      };

      console.log('Fetching NASDAQ tickers with API key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'NOT SET');
      
      const data = await this.rateLimitedRequest(url, { params });
      
      if (!data || !data.results) {
        throw new Error('No ticker data received from API. Please check your API key and subscription.');
      }
      
      console.log(`Successfully fetched ${data.results.length} NASDAQ tickers`);
      return data.results;
    } catch (error) {
      console.error('Error fetching NASDAQ tickers:', error);
      
      // Re-throw enhanced errors or create new ones
      if (error.code) {
        throw error;
      }
      
      // Handle generic errors
      if (error.response?.status === 401) {
        throw new Error(
          'Authentication failed: Invalid or missing Polygon API key. ' + 'Please check your VITE_POLYGON_API_KEY in the .env file. '+ 'Get your free API key at https://polygon.io/dashboard/api-keys'
        );
      } else if (error.response?.status === 429) {
        throw new Error(
          'API rate limit exceeded. Free tier allows 5 requests per minute. ' + 'Please wait a moment and try again.'
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          'API access forbidden. Please verify your Polygon API subscription and permissions at https://polygon.io/dashboard'
        );
      }
      
      throw error;
    }
  }

  // Get current price data for a ticker
  async getCurrentPrice(ticker) {
    try {
      if (!this.apiKey || this.apiKey.includes('your-polygon-api-key')) {
        throw new Error('Polygon API key is not configured. Please add VITE_POLYGON_API_KEY to your .env file.');
      }
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const url = `${this.baseURL}${POLYGON_CONFIG.ENDPOINTS.DAILY_OPEN_CLOSE}/${ticker}/${today}`;
      
      const data = await this.rateLimitedRequest(url);
      return data;
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      
      // Return null for individual ticker errors to continue processing
      if (error.response?.status === 401) {
        console.error('Invalid API key for ticker:', ticker);
      } else if (error.response?.status === 404) {
        console.warn(`No data found for ticker: ${ticker}`);
      }
      
      return null;
    }
  }

  // Get historical aggregates for trend analysis
  async getHistoricalData(ticker, timeframe, days) {
    try {
      if (!this.apiKey || this.apiKey.includes('your-polygon-api-key')) {
        throw new Error('Polygon API key is not configured.');
      }
      
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      
      // Skip weekends for start date
      let adjustedStartDate = startDate;
      while (isWeekend(adjustedStartDate)) {
        adjustedStartDate = subDays(adjustedStartDate, 1);
      }

      const url = `${this.baseURL}${POLYGON_CONFIG.ENDPOINTS.AGGREGATES}/${ticker}/range/1/day/${format(adjustedStartDate, 'yyyy-MM-dd')}/${format(endDate, 'yyyy-MM-dd')}`;
      
      const data = await this.rateLimitedRequest(url, {
        params: {
          adjusted: true,
          sort: 'asc'
        }
      });
      
      return data?.results || [];
    } catch (error) {
      console.error(`Error fetching historical data for ${ticker}:`, error);
      
      // Return empty array for individual ticker errors
      if (error.response?.status === 401) {
        console.error('Invalid API key for historical data:', ticker);
      } else if (error.response?.status === 404) {
        console.warn(`No historical data found for ticker: ${ticker}`);
      }
      
      return [];
    }
  }
}

// Utility functions
export const polygonAPI = new PolygonAPI();

export const calculateTrend = (historicalData) => {
  if (!historicalData || historicalData.length < 2) {
    return { trend: 'neutral', changePercent: 0, volume: 0 };
  }

  const latest = historicalData[historicalData.length - 1];
  const previous = historicalData[0];
  
  const changePercent = ((latest.c - previous.c) / previous.c) * 100;
  const avgVolume = historicalData.reduce((sum, day) => sum + day.v, 0) / historicalData.length;
  
  let trend = 'neutral';
  if (changePercent >= TREND_THRESHOLD.STRONG_UP) {
    trend = 'strong_up';
  } else if (changePercent >= TREND_THRESHOLD.UP) {
    trend = 'up';
  } else if (changePercent <= TREND_THRESHOLD.STRONG_DOWN) {
    trend = 'strong_down';
  } else if (changePercent <= TREND_THRESHOLD.DOWN) {
    trend = 'down';
  }
  
  return {
    trend,
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.round(avgVolume),
    currentPrice: latest.c,
    dayHigh: latest.h,
    dayLow: latest.l,
    openPrice: latest.o
  };
};

export const filterUnderPriceLimit = (tickers, priceData) => {
  return tickers.filter(ticker => {
    const price = priceData[ticker.ticker];
    return price && price.close && price.close <= MARKET_CONFIG.MAX_PRICE;
  });
};

export const formatStockData = (ticker, priceData, trendData) => {
  const price = priceData[ticker.ticker];
  const trend = trendData[ticker.ticker];
  
  if (!price || !trend) return null;
  
  return {
    id: ticker.ticker,
    symbol: ticker.ticker,
    companyName: ticker.name || ticker.ticker,
    currentPrice: trend.currentPrice || price.close,
    changePercent: trend.changePercent,
    volume: trend.volume || price.volume || 0,
    marketCap: calculateMarketCap(ticker, trend.currentPrice || price.close),
    sector: ticker.primary_exchange || 'NASDAQ',
    trend: getTrendDirection(trend.trend),
    dayHigh: trend.dayHigh || price.high || trend.currentPrice,
    dayLow: trend.dayLow || price.low || trend.currentPrice,
    avgVolume: trend.volume || price.volume || 0,
    openPrice: trend.openPrice || price.open || trend.currentPrice,
    timeframe: 'daily'
  };
};

export const calculateMarketCap = (ticker, price) => {
  // Estimate market cap based on ticker info if available
  if (ticker.market_cap) return ticker.market_cap;
  
  // Rough estimation for display purposes
  const shareEstimate = ticker.weighted_shares_outstanding || 1000000;
  return Math.round(shareEstimate * price);
};

export const getTrendDirection = (trend) => {
  switch (trend) {
    case 'strong_up': case'up':
      return 'up';
    case 'strong_down': case'down':
      return 'down';
    default:
      return 'neutral';
  }
};

export const batchProcess = async (items, processor, batchSize = API_LIMITS.BATCH_SIZE) => {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(item => processor(item))
    );
    
    const successfulResults = batchResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(value => value !== null);
    
    results.push(...successfulResults);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  return results;
};

export const retryWithBackoff = async (fn, maxRetries = API_LIMITS.RETRY_ATTEMPTS, delay = API_LIMITS.RETRY_DELAY) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const backoffDelay = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};