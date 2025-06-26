// src/pages/stock-screening-dashboard/components/TimeframeSelector.jsx
import React from 'react';
import Icon from 'components/AppIcon';
import { TIMEFRAMES } from '../../../constants';

const TimeframeSelector = ({ activeTimeframe, onTimeframeChange }) => {
  const timeframes = [
    {
      key: TIMEFRAMES.DAILY,
      label: 'Daily',
      description: 'Trending today',
      icon: 'Clock'
    },
    {
      key: TIMEFRAMES.THREE_DAY,
      label: '3-Day',
      description: 'Trending over 3 days',
      icon: 'Calendar'
    },
    {
      key: TIMEFRAMES.WEEKLY,
      label: 'Weekly',
      description: 'Trending this week',
      icon: 'CalendarDays'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="TrendingUp" size={18} className="text-primary" />
        <h3 className="text-sm font-heading font-medium text-text-primary uppercase tracking-wide">
          Trend Analysis Timeframe
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.key}
            onClick={() => onTimeframeChange?.(timeframe.key)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-sm ${
              activeTimeframe === timeframe.key
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border bg-background hover:border-primary/30'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${
                activeTimeframe === timeframe.key
                  ? 'bg-primary text-white' :'bg-surface text-text-secondary'
              }`}>
                <Icon name={timeframe.icon} size={16} />
              </div>
              <div>
                <div className={`font-body font-semibold ${
                  activeTimeframe === timeframe.key
                    ? 'text-primary' :'text-text-primary'
                }`}>
                  {timeframe.label}
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary">
              {timeframe.description}
            </p>
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <Icon name="Info" size={16} className="text-primary" />
        <p className="text-xs text-text-secondary">
          Auto-scanning all NASDAQ stocks under $5.00 for trending patterns in the selected timeframe
        </p>
      </div>
    </div>
  );
};

export default TimeframeSelector;