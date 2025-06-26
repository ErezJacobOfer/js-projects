import React, { useState } from 'react';
import Icon from '../AppIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('daily');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5 });
  const [volumeThreshold, setVolumeThreshold] = useState(100000);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  const timeframes = [
    { id: 'daily', label: 'Daily Trends', icon: 'Calendar' },
    { id: '3day', label: '3-Day Trends', icon: 'CalendarDays' },
    { id: 'weekly', label: 'Weekly Trends', icon: 'CalendarRange' }
  ];

  const sectors = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Consumer Cyclical',
    'Communication Services',
    'Industrials',
    'Consumer Defensive',
    'Energy',
    'Utilities',
    'Real Estate',
    'Materials',
    'Basic Materials'
  ];

  const handleTimeframeChange = (timeframeId) => {
    setActiveTimeframe(timeframeId);
    console.log('Timeframe changed to:', timeframeId);
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleVolumeChange = (value) => {
    setVolumeThreshold(parseInt(value) || 0);
  };

  const handleSectorToggle = (sector) => {
    setSelectedSectors(prev => 
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleResetFilters = () => {
    setPriceRange({ min: 0, max: 5 });
    setVolumeThreshold(100000);
    setSelectedSectors([]);
    console.log('Filters reset');
  };

  const handleApplyFilters = () => {
    const filters = {
      timeframe: activeTimeframe,
      priceRange,
      volumeThreshold,
      sectors: selectedSectors
    };
    console.log('Applying filters:', filters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[998]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`nav-sidebar ${isOpen ? 'open' : ''} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
            <h2 className="text-lg font-heading-semibold text-text-primary">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Close filters"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Timeframe Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-heading-medium text-text-primary uppercase tracking-wide">
                Timeframe
              </h3>
              <div className="space-y-1">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.id}
                    onClick={() => handleTimeframeChange(timeframe.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      activeTimeframe === timeframe.id
                        ? 'bg-primary text-white' :'text-text-primary hover:bg-background'
                    }`}
                  >
                    <Icon 
                      name={timeframe.icon} 
                      size={18} 
                      color={activeTimeframe === timeframe.id ? 'white' : 'currentColor'}
                    />
                    <span className="text-sm font-body-normal">{timeframe.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading-medium text-text-primary uppercase tracking-wide">
                  Filters
                </h3>
                <button
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  className="p-1 rounded hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label={isFiltersExpanded ? 'Collapse filters' : 'Expand filters'}
                >
                  <Icon 
                    name={isFiltersExpanded ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                    className="text-text-secondary"
                  />
                </button>
              </div>

              {isFiltersExpanded && (
                <div className="space-y-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-caption-normal text-text-secondary uppercase tracking-wide">
                      Price Range ($)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        min="0"
                        max="5"
                        step="0.01"
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Min"
                      />
                      <span className="text-text-secondary">to</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        min="0"
                        max="5"
                        step="0.01"
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Volume Threshold */}
                  <div className="space-y-2">
                    <label className="text-xs font-caption-normal text-text-secondary uppercase tracking-wide">
                      Min Volume
                    </label>
                    <input
                      type="number"
                      value={volumeThreshold}
                      onChange={(e) => handleVolumeChange(e.target.value)}
                      min="0"
                      step="1000"
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="100000"
                    />
                  </div>

                  {/* Sectors */}
                  <div className="space-y-2">
                    <label className="text-xs font-caption-normal text-text-secondary uppercase tracking-wide">
                      Sectors
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-1 border border-border rounded-md p-2 bg-surface">
                      {sectors.map((sector) => (
                        <label
                          key={sector}
                          className="flex items-center space-x-2 p-1 rounded hover:bg-background cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSectors.includes(sector)}
                            onChange={() => handleSectorToggle(sector)}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                          />
                          <span className="text-sm text-text-primary">{sector}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={handleApplyFilters}
              className="w-full btn-primary px-4 py-2 rounded-lg text-sm font-body-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 text-sm font-body-normal text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Reset All
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;