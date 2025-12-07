import React, { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { FilterButton } from './Button';

const FilterPanel = ({ fonts, activeFilters, onFiltersChange }) => {
  // Calculate font counts by classification and weight
  const fontStats = useMemo(() => {
    const stats = {};
    const weightStats = {};
    
    fonts.forEach(font => {
      const classification = font.classification;
      stats[classification] = (stats[classification] || 0) + 1;
      
      const weight = font.weight || 'regular';
      weightStats[weight] = (weightStats[weight] || 0) + 1;
    });
    
    return { byType: stats, byWeight: weightStats };
  }, [fonts]);

  const filterOptions = [
    { key: 'serif', label: 'Serif', description: 'Traditional fonts with decorative strokes' },
    { key: 'sans-serif', label: 'Sans-serif', description: 'Clean fonts without decorative strokes' },
    { key: 'monospace', label: 'Monospace', description: 'Fixed-width fonts for code and data' },
    { key: 'cursive', label: 'Cursive', description: 'Script and handwriting-style fonts' },
    { key: 'fantasy', label: 'Fantasy', description: 'Decorative and display fonts' }
  ];

  const additionalFilters = [
    { key: 'default', label: 'System Default', description: 'Built-in system fonts' },
    { key: 'common', label: 'Common Fonts', description: 'Widely available fonts' }
  ];

  const weightFilters = [
    { key: 'thin', label: 'Thin', description: 'Ultra-light weight fonts (100-200)' },
    { key: 'light', label: 'Light', description: 'Light weight fonts (300)' },
    { key: 'regular', label: 'Regular', description: 'Normal weight fonts (400)' },
    { key: 'medium', label: 'Medium', description: 'Medium weight fonts (500)' },
    { key: 'semibold', label: 'Semi-bold', description: 'Semi-bold weight fonts (600)' },
    { key: 'bold', label: 'Bold', description: 'Bold weight fonts (700)' },
    { key: 'extrabold', label: 'Extra Bold', description: 'Extra bold weight fonts (800)' },
    { key: 'black', label: 'Black', description: 'Heavy/black weight fonts (900)' }
  ];

  const handleFilterToggle = (filterKey) => {
    const newFilters = activeFilters.includes(filterKey)
      ? activeFilters.filter(f => f !== filterKey)
      : [...activeFilters, filterKey];
    
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onFiltersChange([]);
  };

  const getFilterCount = (filterKey) => {
    if (filterKey === 'default') {
      return fonts.filter(font => font.isDefault).length;
    }
    if (filterKey === 'common') {
      return fonts.filter(font => font.isCommon).length;
    }
    // Check if it's a weight filter
    if (weightFilters.some(w => w.key === filterKey)) {
      return fontStats.byWeight[filterKey] || 0;
    }
    return fontStats.byType[filterKey] || 0;
  };

  const totalFiltered = activeFilters.length > 0 
    ? fonts.filter(font => {
        return activeFilters.some(filter => {
          if (filter === 'default') return font.isDefault;
          if (filter === 'common') return font.isCommon;
          return font.classification === filter;
        });
      }).length
    : fonts.length;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </h3>
        {activeFilters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                     flex items-center space-x-1 cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Filter Results */}
      {activeFilters.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">{totalFiltered}</span> of <span className="font-medium">{fonts.length}</span> fonts match your filters
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {activeFilters.map(filter => (
              <span 
                key={filter}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 
                         text-blue-800 dark:text-blue-200 rounded"
              >
                {filterOptions.find(f => f.key === filter)?.label || 
                 additionalFilters.find(f => f.key === filter)?.label || 
                 filter}
                <button
                  onClick={() => handleFilterToggle(filter)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Font Classification Filters */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Font Types
        </h4>
        {filterOptions.map(option => {
          const count = getFilterCount(option.key);
          const isActive = activeFilters.includes(option.key);
          
          return (
            <FilterButton
              key={option.key}
              onClick={() => handleFilterToggle(option.key)}
              disabled={count === 0}
              active={isActive}
              count={count}
            >
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-75">{option.description}</div>
              </div>
            </FilterButton>
          );
        })}
      </div>

      {/* Additional Filters */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Font Properties
        </h4>
        {additionalFilters.map(option => {
          const count = getFilterCount(option.key);
          const isActive = activeFilters.includes(option.key);
          
          return (
            <button
              key={option.key}
              onClick={() => handleFilterToggle(option.key)}
              disabled={count === 0}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer
                ${isActive 
                  ? 'bg-green-50 dark:bg-green-900/50 border-green-300 dark:border-green-600' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
                ${count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isActive 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {option.label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isActive 
                    ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {count}
                </span>
              </div>
              <p className={`text-xs ${
                isActive 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Font Weight Filters */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Font Weights
        </h4>
        {weightFilters.map(option => {
          const count = getFilterCount(option.key);
          const isActive = activeFilters.includes(option.key);
          
          return (
            <button
              key={option.key}
              onClick={() => handleFilterToggle(option.key)}
              disabled={count === 0}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer
                ${isActive 
                  ? 'bg-purple-50 dark:bg-purple-900/50 border-purple-300 dark:border-purple-600' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
                ${count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isActive 
                    ? 'text-purple-900 dark:text-purple-100' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {option.label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isActive 
                    ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {count}
                </span>
              </div>
              <p className={`text-xs ${
                isActive 
                  ? 'text-purple-700 dark:text-purple-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter Summary */}
      {fonts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>Total fonts detected: <span className="font-medium">{fonts.length}</span></div>
            
            {/* Font Type Breakdown */}
            <div className="mt-3">
              <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">By Type:</div>
              {Object.entries(fontStats.byType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between ml-2">
                    <span className="capitalize">{type}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))
              }
            </div>
            
            {/* Font Weight Breakdown */}
            {Object.keys(fontStats.byWeight).length > 1 && (
              <div className="mt-3">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">By Weight:</div>
                {Object.entries(fontStats.byWeight)
                  .sort(([, a], [, b]) => b - a)
                  .map(([weight, count]) => (
                    <div key={weight} className="flex justify-between ml-2">
                      <span className="capitalize">{weight}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;