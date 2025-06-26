// src/pages/stock-screening-dashboard/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import StockTable from './components/StockTable';
import TimeframeSelector from './components/TimeframeSelector';
import PriceFilter from './components/PriceFilter';
import MarketSummary from './components/MarketSummary';
import ExportPanel from './components/ExportPanel';
import Icon from 'components/AppIcon';
import { polygonAPI, calculateTrend, formatStockData, retryWithBackoff } from '../../utils';
import { TIMEFRAMES, DATE_RANGES, MARKET_CONFIG } from '../../constants';

const StockScreeningDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState(TIMEFRAMES.DAILY);
  const [priceRange, setPriceRange] = useState({ min: 0, max: MARKET_CONFIG.MAX_PRICE });
  const [volumeThreshold, setVolumeThreshold] = useState(MARKET_CONFIG.MIN_VOLUME);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'changePercent', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0, status: '' });
  const [apiKeyError, setApiKeyError] = useState(false);

  // Check API key configuration on component mount
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
      if (!apiKey || apiKey.includes('your-polygon-api-key')) {
        setApiKeyError(true);
        setError(
          'Polygon API key is not configured. Please add VITE_POLYGON_API_KEY to your .env file. ' + 'Get your free API key at https://polygon.io/dashboard/api-keys'
        );
        return false;
      }
      setApiKeyError(false);
      return true;
    };
    
    checkApiKey();
  }, []);

  // Fetch and analyze NASDAQ stocks
  const fetchNasdaqStocks = async () => {
    // Don't proceed if API key is not configured
    if (apiKeyError) {
      setError(
        'Cannot fetch stock data: Polygon API key is not configured. ' + 'Please add VITE_POLYGON_API_KEY to your .env file and refresh the page. '+ 'Get your free API key at https://polygon.io/dashboard/api-keys'
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setScanProgress({ current: 0, total: 0, status: 'Initializing...' });
    
    try {
      // Step 1: Get all NASDAQ tickers
      setScanProgress(prev => ({ ...prev, status: 'Fetching NASDAQ tickers...' }));
      
      const tickers = await retryWithBackoff(() => polygonAPI.getNasdaqTickers());
      
      if (!tickers || tickers.length === 0) {
        throw new Error('No NASDAQ tickers found. Please check your API key permissions.');
      }
      
      setScanProgress({ current: 0, total: tickers.length, status: 'Analyzing stocks...' });
      
      // Step 2: Process tickers in batches to get price data and filter under $5
      const processStock = async (ticker, index) => {
        setScanProgress(prev => ({ 
          ...prev, 
          current: index + 1, 
          status: `Analyzing ${ticker.ticker} (${index + 1}/${tickers.length})...` 
        }));
        
        try {
          // Get current price first to filter out expensive stocks early
          const currentPrice = await polygonAPI.getCurrentPrice(ticker.ticker);
          
          if (!currentPrice || !currentPrice.close || currentPrice.close > MARKET_CONFIG.MAX_PRICE) {
            return null; // Skip expensive stocks
          }
          
          // Get historical data for trend analysis
          const days = DATE_RANGES[activeTimeframe] || 1;
          const historicalData = await polygonAPI.getHistoricalData(ticker.ticker, activeTimeframe, days);
          
          if (!historicalData || historicalData.length === 0) {
            return null; // Skip if no historical data
          }
          
          // Calculate trend
          const trendAnalysis = calculateTrend(historicalData);
          
          // Only include trending stocks (up or down)
          if (trendAnalysis.trend === 'neutral') {
            return null;
          }
          
          // Format stock data
          const stockData = formatStockData(ticker, { close: currentPrice.close, volume: currentPrice.volume }, { [ticker.ticker]: trendAnalysis });
          
          return stockData;
        } catch (error) {
          console.warn(`Error processing ${ticker.ticker}:`, error);
          return null;
        }
      };
      
      // Process stocks in smaller batches to avoid rate limits
      const batchSize = 10; // Smaller batch size for better rate limiting
      const processedStocks = [];
      
      for (let i = 0; i < tickers.length; i += batchSize) {
        const batch = tickers.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(
          batch.map((ticker, batchIndex) => processStock(ticker, i + batchIndex))
        );
        
        const successfulResults = batchResults
          .filter(result => result.status === 'fulfilled' && result.value !== null)
          .map(result => result.value);
        
        processedStocks.push(...successfulResults);
        
        // Add delay between batches
        if (i + batchSize < tickers.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      setScanProgress(prev => ({ ...prev, status: 'Finalizing results...' }));
      
      // Filter out null results and apply additional filters
      const validStocks = processedStocks
        .filter(stock => stock && stock.volume >= volumeThreshold)
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)); // Sort by strongest trends
      
      setStocks(validStocks);
      setLastRefresh(new Date());
      setScanProgress({ current: validStocks.length, total: tickers.length, status: `Found ${validStocks.length} trending stocks` });
      
    } catch (error) {
      console.error('Error fetching NASDAQ stocks:', error);
      
      let errorMessage = `Failed to fetch stock data: ${error.message}`;
      
      // Provide specific guidance based on error type
      if (error.code === 'INVALID_API_KEY') {
        errorMessage = 'Invalid API key: Please check your VITE_POLYGON_API_KEY in the .env file. Get a free API key at https://polygon.io/dashboard/api-keys';
        setApiKeyError(true);
      } else if (error.code === 'ACCESS_FORBIDDEN') {
        errorMessage = 'Access denied: Your API key may not have sufficient permissions. Check your subscription at https://polygon.io/dashboard';
      } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
        errorMessage = 'Rate limit exceeded: Please wait a moment before trying again. Free tier allows 5 requests per minute.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error: Unable to connect to Polygon API. Please check your internet connection.';
      } else if (error.code === 'TIMEOUT_ERROR') {
        errorMessage = 'Request timeout: The API request took too long. Please try again.';
      }
      
      setError(errorMessage);
      setScanProgress(prev => ({ ...prev, status: 'Error occurred' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and timeframe changes
  useEffect(() => {
    fetchNasdaqStocks();
  }, [activeTimeframe]);

  // Filter stocks based on current filters
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const matchesPrice = stock.currentPrice >= priceRange.min && stock.currentPrice <= priceRange.max;
      const matchesVolume = stock.volume >= volumeThreshold;
      const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(stock.sector);
      const matchesSearch = searchQuery === '' || 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPrice && matchesVolume && matchesSector && matchesSearch;
    });
  }, [stocks, priceRange, volumeThreshold, selectedSectors, searchQuery]);

  // Sort filtered stocks
  const sortedStocks = useMemo(() => {
    if (!sortConfig.key) return filteredStocks;
    
    return [...filteredStocks].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredStocks, sortConfig]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleRefreshData = () => {
    fetchNasdaqStocks();
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
  };

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalStocks = filteredStocks.length;
    const gainers = filteredStocks.filter(stock => stock.changePercent > 0).length;
    const losers = filteredStocks.filter(stock => stock.changePercent < 0).length;
    const avgChange = filteredStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / totalStocks || 0;
    
    return {
      totalStocks,
      gainers,
      losers,
      avgChange: avgChange.toFixed(2)
    };
  }, [filteredStocks]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleSidebarClose}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        volumeThreshold={volumeThreshold}
        setVolumeThreshold={setVolumeThreshold}
        selectedSectors={selectedSectors}
        setSelectedSectors={setSelectedSectors}
      />
      
      <main className="main-content">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                NASDAQ Stock Screener
              </h1>
              <p className="text-text-secondary mt-1">
                Auto-scanning trending NASDAQ stocks under ${MARKET_CONFIG.MAX_PRICE} across multiple timeframes
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                <Icon 
                  name={isLoading ? "Loader2" : "RefreshCw"} 
                  size={16} 
                  className={isLoading ? "animate-spin" : ""}
                />
                <span className="text-sm font-body-medium">
                  {isLoading ? 'Scanning...' : 'Refresh Scan'}
                </span>
              </button>
              
              <div className="text-xs text-text-secondary">
                Last scan: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Scan Progress */}
          {isLoading && (
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Icon name="Loader2" size={16} className="animate-spin text-primary" />
                <span className="text-sm font-medium text-text-primary">
                  {scanProgress.status}
                </span>
              </div>
              {scanProgress.total > 0 && (
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`border rounded-lg p-4 ${
              apiKeyError ? 'bg-warning/10 border-warning/20' : 'bg-error/10 border-error/20'
            }`}>
              <div className="flex items-start space-x-3">
                <Icon 
                  name={apiKeyError ? "AlertTriangle" : "AlertCircle"} 
                  size={20} 
                  className={apiKeyError ? "text-warning mt-0.5" : "text-error mt-0.5"} 
                />
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-2 ${
                    apiKeyError ? 'text-warning' : 'text-error'
                  }`}>
                    {apiKeyError ? 'API Configuration Required' : 'Error'}
                  </div>
                  <div className={`text-sm ${
                    apiKeyError ? 'text-warning' : 'text-error'
                  }`}>
                    {error}
                  </div>
                  {apiKeyError && (
                    <div className="mt-3 p-3 bg-background/50 rounded border text-xs text-text-secondary">
                      <div className="font-medium mb-2">Quick Setup:</div>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Visit <a href="https://polygon.io/dashboard/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">polygon.io/dashboard/api-keys</a></li>
                        <li>Sign up for a free account if you don't have one</li>
                        <li>Copy your API key</li>
                        <li>Create a <code className="px-1 py-0.5 bg-surface rounded">.env</code> file in your project root</li>
                        <li>Add: <code className="px-1 py-0.5 bg-surface rounded">VITE_POLYGON_API_KEY=your_api_key_here</code></li>
                        <li>Restart the development server</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Controls Section */}
          <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
            {/* Timeframe Selector */}
            <TimeframeSelector 
              activeTimeframe={activeTimeframe}
              onTimeframeChange={handleTimeframeChange}
            />
            
            {/* Price Filter and Search */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <PriceFilter 
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                />
              </div>
              
              <div className="lg:w-80">
                <div className="relative">
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Filter by symbol or company..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Stock Table - Takes up 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-text-primary">
                      Trending Stocks ({sortedStocks.length})
                    </h2>
                    <ExportPanel stocks={sortedStocks} />
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {activeTimeframe === TIMEFRAMES.DAILY && 'Daily trending stocks'}
                    {activeTimeframe === TIMEFRAMES.THREE_DAY && '3-day trending stocks'}
                    {activeTimeframe === TIMEFRAMES.WEEKLY && 'Weekly trending stocks'}
                  </p>
                </div>
                
                <StockTable 
                  stocks={sortedStocks}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Right Sidebar - Market Summary */}
            <div className="xl:col-span-1">
              <MarketSummary 
                metrics={summaryMetrics}
                activeTimeframe={activeTimeframe}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockScreeningDashboard;