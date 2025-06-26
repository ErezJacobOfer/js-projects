import React from 'react';
import Icon from 'components/AppIcon';

const MarketSummary = ({ metrics, activeTimeframe }) => {
  const getTimeframeLabel = (timeframe) => {
    switch (timeframe) {
      case 'daily': return 'Today';
      case '3day': return '3-Day';
      case 'weekly': return 'Weekly';
      default: return 'Today';
    }
  };

  const summaryCards = [
    {
      title: 'Total Stocks',
      value: metrics.totalStocks,
      icon: 'BarChart3',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Gainers',
      value: metrics.gainers,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Losers',
      value: metrics.losers,
      icon: 'TrendingDown',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Avg Change',
      value: `${metrics.avgChange > 0 ? '+' : ''}${metrics.avgChange}%`,
      icon: 'Activity',
      color: metrics.avgChange > 0 ? 'text-success' : 'text-error',
      bgColor: metrics.avgChange > 0 ? 'bg-success/10' : 'bg-error/10'
    }
  ];

  const marketOverview = {
    marketStatus: 'Open',
    lastUpdate: new Date().toLocaleTimeString(),
    totalVolume: '2.4B',
    activeStocks: 3247
  };

  return (
    <div className="space-y-6">
      {/* Market Summary Header */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Market Summary
          </h3>
          <span className="text-xs text-text-secondary bg-background px-2 py-1 rounded-full">
            {getTimeframeLabel(activeTimeframe)}
          </span>
        </div>

        <div className="space-y-3">
          {summaryCards.map((card, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon name={card.icon} size={16} className={card.color} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-text-secondary uppercase tracking-wide">
                  {card.title}
                </div>
                <div className={`text-lg font-body font-semibold ${card.color}`}>
                  {card.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Status */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h4 className="text-sm font-heading font-medium text-text-primary mb-3 uppercase tracking-wide">
          Market Status
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-body font-medium text-success">
                {marketOverview.marketStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Last Update</span>
            <span className="text-sm text-text-primary">
              {marketOverview.lastUpdate}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Total Volume</span>
            <span className="text-sm font-body font-medium text-text-primary">
              {marketOverview.totalVolume}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Active Stocks</span>
            <span className="text-sm text-text-primary">
              {marketOverview.activeStocks.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h4 className="text-sm font-heading font-medium text-text-primary mb-3 uppercase tracking-wide">
          Performance Indicators
        </h4>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Gainers vs Total</span>
              <span className="text-text-primary">
                {metrics.totalStocks > 0 ? Math.round((metrics.gainers / metrics.totalStocks) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${metrics.totalStocks > 0 ? (metrics.gainers / metrics.totalStocks) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Losers vs Total</span>
              <span className="text-text-primary">
                {metrics.totalStocks > 0 ? Math.round((metrics.losers / metrics.totalStocks) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-error h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${metrics.totalStocks > 0 ? (metrics.losers / metrics.totalStocks) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h4 className="text-sm font-heading font-medium text-text-primary mb-3 uppercase tracking-wide">
          Quick Actions
        </h4>
        
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <Icon name="Star" size={16} />
            <span>Create Watchlist</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <Icon name="Bell" size={16} />
            <span>Set Price Alerts</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <Icon name="FileText" size={16} />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;