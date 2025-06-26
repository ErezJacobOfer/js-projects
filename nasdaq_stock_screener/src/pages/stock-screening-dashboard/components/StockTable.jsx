import React from 'react';
import Icon from 'components/AppIcon';

const StockTable = ({ stocks, sortConfig, onSort, isLoading }) => {
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const formatPercent = (percent) => `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toLocaleString();
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(0)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' 
      ? <Icon name="TrendingUp" size={16} className="text-success" />
      : <Icon name="TrendingDown" size={16} className="text-error" />;
  };

  const columns = [
    { key: 'symbol', label: 'Symbol', sortable: true },
    { key: 'companyName', label: 'Company', sortable: true },
    { key: 'currentPrice', label: 'Price', sortable: true },
    { key: 'changePercent', label: 'Change %', sortable: true },
    { key: 'volume', label: 'Volume', sortable: true },
    { key: 'marketCap', label: 'Market Cap', sortable: true },
    { key: 'sector', label: 'Sector', sortable: true },
    { key: 'trend', label: 'Trend', sortable: false }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-secondary">Loading stock data...</span>
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-heading font-medium text-text-primary mb-2">
          No stocks found
        </h3>
        <p className="text-text-secondary text-center max-w-md">
          Try adjusting your filters or search criteria to find stocks that match your requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-caption font-medium text-text-secondary uppercase tracking-wide ${
                    column.sortable ? 'cursor-pointer hover:text-text-primary' : ''
                  }`}
                  onClick={column.sortable ? () => onSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stocks.map((stock) => (
              <tr key={stock.id} className="table-row-hover">
                <td className="px-4 py-4">
                  <div className="font-body font-semibold text-text-primary">
                    {stock.symbol}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-text-primary max-w-xs truncate">
                    {stock.companyName}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-body font-medium text-text-primary">
                    {formatPrice(stock.currentPrice)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    H: {formatPrice(stock.dayHigh)} L: {formatPrice(stock.dayLow)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`font-body font-medium ${
                    stock.changePercent > 0 ? 'text-success' : 'text-error'
                  }`}>
                    {formatPercent(stock.changePercent)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-text-primary">
                    {formatVolume(stock.volume)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Avg: {formatVolume(stock.avgVolume)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-text-primary">
                    {formatMarketCap(stock.marketCap)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-body font-medium bg-background text-text-secondary">
                    {stock.sector}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    {getTrendIcon(stock.trend)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {stocks.map((stock) => (
          <div key={stock.id} className="bg-background border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-body font-semibold text-text-primary text-lg">
                  {stock.symbol}
                </div>
                <div className="text-sm text-text-secondary truncate max-w-48">
                  {stock.companyName}
                </div>
              </div>
              <div className="text-right">
                <div className="font-body font-medium text-text-primary text-lg">
                  {formatPrice(stock.currentPrice)}
                </div>
                <div className={`text-sm font-body font-medium ${
                  stock.changePercent > 0 ? 'text-success' : 'text-error'
                }`}>
                  {formatPercent(stock.changePercent)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-text-secondary">Volume</div>
                <div className="text-text-primary font-body font-medium">
                  {formatVolume(stock.volume)}
                </div>
              </div>
              <div>
                <div className="text-text-secondary">Market Cap</div>
                <div className="text-text-primary font-body font-medium">
                  {formatMarketCap(stock.marketCap)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-body font-medium bg-surface text-text-secondary border border-border">
                {stock.sector}
              </span>
              <div className="flex items-center space-x-1">
                {getTrendIcon(stock.trend)}
                <span className="text-xs text-text-secondary capitalize">
                  {stock.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTable;