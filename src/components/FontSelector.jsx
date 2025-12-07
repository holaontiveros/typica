import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, Eye } from 'lucide-react';

const FontSelector = ({ fonts, onFontSelect, onFontCompare, selectedFonts = [], searchFilter = '', onSearchFilterChange, activeFilters = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter fonts based on search term and active filters
  const filteredFonts = useMemo(() => {
    let filtered = fonts;
    
    // Apply active filters first
    if (activeFilters.length > 0) {
      filtered = fonts.filter(font => {
        return activeFilters.some(filter => {
          if (filter === 'all') return true;
          if (filter === 'default') return font.isDefault;
          if (filter === 'common') return font.isCommon;
          // Check if it's a weight filter
          if (['thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'extrabold', 'black'].includes(filter)) {
            return (font.weight || 'regular') === filter;
          }
          // Default to classification filter
          return font.classification === filter;
        });
      });
    }
    
    // Apply search filter
    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      filtered = filtered.filter(font => 
        font.name.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Limit results for performance
    return searchFilter ? filtered.slice(0, 20) : filtered.slice(0, 50);
  }, [fonts, searchFilter, activeFilters]);

  // Define handleFontSelect before it's used in useEffect
  const handleFontSelect = useCallback((font) => {
    onFontSelect(font);
    setIsOpen(false);
    onSearchFilterChange('');
    setSelectedIndex(-1);
  }, [onFontSelect, onSearchFilterChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredFonts.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredFonts.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && filteredFonts[selectedIndex]) {
            handleFontSelect(filteredFonts[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredFonts, handleFontSelect]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  const handleFontCompare = (font, e) => {
    e.stopPropagation();
    onFontCompare(font);
  };

  const handleSearchChange = (e) => {
    onSearchFilterChange(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow for click events
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 200);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Filter Fonts
      </label>
      
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchFilter}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Type to filter fonts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        
        {/* Results Count */}
        {searchFilter && (
          <span className="absolute right-3 top-2.5 text-xs text-gray-500 dark:text-gray-400">
            {filteredFonts.length}
          </span>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 
                        border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg 
                        max-h-64 overflow-y-auto z-50">
          {filteredFonts.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No fonts found
            </div>
          ) : (
            <ul ref={listRef} className="py-1">
              {filteredFonts.map((font, index) => {
                const isInComparison = selectedFonts.some(f => f.name === font.name);
                const canAddToComparison = selectedFonts.length < 6 && !isInComparison;
                
                return (
                  <li
                    key={font.name}
                    className={`px-4 py-2 cursor-pointer group flex items-center justify-between
                               ${index === selectedIndex 
                                 ? 'bg-blue-50 dark:bg-blue-900/50' 
                                 : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                               } ${isInComparison ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                    onClick={() => handleFontSelect(font)}
                  >
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-medium text-gray-900 dark:text-white truncate"
                        style={{ fontFamily: font.name }}
                      >
                        {font.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center space-x-2">
                        <span>
                          {font.classification}
                          {font.weight && font.weight !== 'regular' && ` • ${font.weight}`}
                          {font.isDefault && ' • Default'}
                        </span>
                        {isInComparison && (
                          <span className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 px-1 py-0.5 rounded text-xs">
                            In Comparison
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleFontCompare(font, e)}
                        disabled={!canAddToComparison}
                        className={`p-1 transition-colors rounded ${
                          isInComparison
                            ? 'text-gray-400 cursor-not-allowed'
                            : canAddToComparison
                            ? 'text-gray-400 hover:text-green-500'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        title={
                          isInComparison
                            ? 'Font already in comparison'
                            : !canAddToComparison
                            ? 'Comparison limit reached (6 fonts max)'
                            : 'Add to comparison'
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFontSelect(font)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Preview font"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Instructions */}
      {!searchFilter && !isOpen && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Click to browse or type to filter {fonts.length} available fonts
        </div>
      )}
    </div>
  );
};

export default FontSelector;