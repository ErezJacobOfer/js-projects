// src/constants/index.jsx
export const POLYGON_CONFIG = {
  API_KEY: import.meta.env.VITE_POLYGON_API_KEY,
  BASE_URL: 'https://api.polygon.io',
  ENDPOINTS: {
    TICKERS: '/v3/reference/tickers',
    AGGREGATES: '/v2/aggs/ticker',
    MARKET_STATUS: '/v1/marketstatus/now',
    DAILY_OPEN_CLOSE: '/v1/open-close'
  }
};

export const MARKET_CONFIG = {
  MAX_PRICE: 5.00,
  MIN_VOLUME: 100000,
  EXCHANGES: ['NASDAQ', 'XNAS'],
  MARKET_TYPES: ['stocks'],
  ACTIVE: true
};

export const TIMEFRAMES = {
  DAILY: 'daily',
  THREE_DAY: '3day',
  WEEKLY: 'weekly'
};

export const DATE_RANGES = {
  [TIMEFRAMES.DAILY]: 1,
  [TIMEFRAMES.THREE_DAY]: 3,
  [TIMEFRAMES.WEEKLY]: 7
};

export const TREND_THRESHOLD = {
  STRONG_UP: 3.0,
  UP: 1.0,
  DOWN: -1.0,
  STRONG_DOWN: -3.0
};

export const API_LIMITS = {
  REQUESTS_PER_MINUTE: 5,
  BATCH_SIZE: 100,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};