import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const PriceFilter = ({ priceRange, onPriceRangeChange }) => {
  const [localRange, setLocalRange] = useState(priceRange);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleRangeChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const newRange = { ...localRange, [field]: numValue };
    
    // Ensure min doesn't exceed max and max doesn't go below min
    if (field === 'min' && numValue > localRange.max) {
      newRange.max = numValue;
    } else if (field === 'max' && numValue < localRange.min) {
      newRange.min = numValue;
    }
    
    // Ensure values stay within 0-5 range
    newRange.min = Math.max(0, Math.min(5, newRange.min));
    newRange.max = Math.max(0, Math.min(5, newRange.max));
    
    setLocalRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleSliderChange = (value) => {
    const newRange = { ...localRange, max: parseFloat(value) };
    setLocalRange(newRange);
    onPriceRangeChange(newRange);
  };

  const presetRanges = [
    { label: 'Under $1', min: 0, max: 1 },
    { label: '$1 - $2', min: 1, max: 2 },
    { label: '$2 - $3', min: 2, max: 3 },
    { label: '$3 - $5', min: 3, max: 5 },
    { label: 'All ($0 - $5)', min: 0, max: 5 }
  ];

  const handlePresetClick = (preset) => {
    const newRange = { min: preset.min, max: preset.max };
    setLocalRange(newRange);
    onPriceRangeChange(newRange);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading font-medium text-text-primary uppercase tracking-wide">
          Price Filter
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 lg:hidden"
          aria-label={isExpanded ? 'Collapse price filter' : 'Expand price filter'}
        >
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-text-secondary"
          />
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Current Range Display */}
        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-primary" />
            <span className="text-sm font-body font-medium text-text-primary">
              ${localRange.min.toFixed(2)} - ${localRange.max.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            Max: $5.00
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <label className="text-xs font-caption text-text-secondary uppercase tracking-wide">
            Maximum Price: ${localRange.max.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.01"
            value={localRange.max}
            onChange={(e) => handleSliderChange(e.target.value)}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(localRange.max / 5) * 100}%, var(--color-border) ${(localRange.max / 5) * 100}%, var(--color-border) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>$0.00</span>
            <span>$5.00</span>
          </div>
        </div>

        {/* Manual Input */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-caption text-text-secondary uppercase tracking-wide">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                $
              </span>
              <input
                type="number"
                value={localRange.min}
                onChange={(e) => handleRangeChange('min', e.target.value)}
                min="0"
                max="5"
                step="0.01"
                className="w-full pl-6 pr-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-caption text-text-secondary uppercase tracking-wide">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                $
              </span>
              <input
                type="number"
                value={localRange.max}
                onChange={(e) => handleRangeChange('max', e.target.value)}
                min="0"
                max="5"
                step="0.01"
                className="w-full pl-6 pr-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Preset Ranges */}
        <div className="space-y-2">
          <label className="text-xs font-caption text-text-secondary uppercase tracking-wide">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presetRanges.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetClick(preset)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  localRange.min === preset.min && localRange.max === preset.max
                    ? 'bg-primary text-white border-primary' :'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;