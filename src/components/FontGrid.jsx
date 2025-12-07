import React, { useMemo } from 'react';
import { Eye, Plus, Grid3x3, List, ChevronDown } from 'lucide-react';

const FontGrid = ({ 
  fonts, 
  previewText, 
  fontSize, 
  textColor, 
  onFontSelect, 
  onFontCompare, 
  selectedFonts = [],
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  onCurrentPageChange
}) => {
  // Remove local state - now using props from parent

  // Sort and paginate fonts
  const sortedFonts = useMemo(() => {
    const sorted = [...fonts].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'classification') {
        if (a.classification !== b.classification) {
          return a.classification.localeCompare(b.classification);
        }
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    return sorted;
  }, [fonts, sortBy]);

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(sortedFonts.length / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? sortedFonts.length : startIndex + itemsPerPage;
  const currentFonts = sortedFonts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    onCurrentPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (items) => {
    onItemsPerPageChange(items);
    onCurrentPageChange(1);
  };

  // Render pagination
  const renderPagination = () => {
    // Don't show pagination when showing all items
    if (totalPages <= 1 || itemsPerPage === -1) return null;

    const pages = [];
    const maxVisiblePages = 7;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm border-t border-b border-r border-gray-300 dark:border-gray-600 
                     ${i === currentPage 
                       ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                       : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-r-lg 
                 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    );

    return (
      <div className="flex justify-center items-center space-x-0">
        {pages}
      </div>
    );
  };

  const FontCard = ({ font }) => {
    const isInComparison = selectedFonts.some(f => f.name === font.name);
    
    return (
      <div className={`group bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${
        isInComparison 
          ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }`}>
        {/* Font Name */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
              {font.name}
            </h3>
            {isInComparison && (
              <span className="text-xs bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 px-2 py-1 rounded">
                In Comparison
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {font.classification}
            {font.weight && font.weight !== 'regular' && ` • ${font.weight}`}
            {font.isDefault && ' • Default'}
          </div>
        </div>

        {/* Preview Text */}
        <div 
          className="mb-4 flex items-center overflow-hidden"
          style={{ 
            fontFamily: font.name,
            fontSize: `${fontSize}px`,
            color: textColor,
            lineHeight: '1.3',
            minHeight: `${Math.max(64, fontSize + 20)}px`
          }}
        >
          <span className="truncate">
            {previewText}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onFontSelect(font)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs 
                     bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 
                     rounded border hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => onFontCompare(font)}
            disabled={isInComparison}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs rounded border transition-colors ${
              isInComparison
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 animate-pulse'
            }`}
            title={
              isInComparison
                ? 'Font already in comparison'
                : 'Add to comparison'
            }
          >
            <Plus className="h-3 w-3" />
            <span>
              {isInComparison ? 'Added' : 'Compare'}
            </span>
          </button>
        </div>
      </div>
    );
  };

  const FontListItem = ({ font }) => {
    const isInComparison = selectedFonts.some(f => f.name === font.name);
    
    return (
      <div className={`group bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
        isInComparison 
          ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* Font Info */}
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {font.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {font.classification}
                {font.weight && font.weight !== 'regular' && ` • ${font.weight}`}
              </span>
              {font.isDefault && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Default
                </span>
              )}
              {isInComparison && (
                <span className="text-xs bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 px-2 py-1 rounded">
                  In Comparison
                </span>
              )}
            </div>
            
            {/* Preview */}
            <div 
              className="text-lg truncate"
              style={{ 
                fontFamily: font.name,
                fontSize: `${fontSize}px`,
                color: textColor
              }}
            >
              {previewText}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onFontSelect(font)}
              className="flex items-center space-x-1 px-3 py-2 text-xs 
                       bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 
                       rounded border hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onFontCompare(font)}
              disabled={isInComparison}
              className={`flex items-center space-x-1 px-3 py-2 text-xs rounded border transition-colors ${
                isInComparison
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 animate-pulse'
              }`}
              title={
                isInComparison
                  ? 'Font already in comparison'
                  : 'Add to comparison'
              }
            >
              <Plus className="h-3 w-3" />
              <span>
                {isInComparison ? 'Added' : 'Compare'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Font Gallery
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {itemsPerPage === -1 
              ? `Showing all ${fonts.length} fonts`
              : `Showing ${currentFonts.length} of ${fonts.length} fonts (page ${currentPage} of ${totalPages})`
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Sort by:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded px-3 py-1 text-sm text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                <option value="name">Name</option>
                <option value="classification">Type</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Items Per Page */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Show:</label>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value) || -1)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded px-3 py-1 text-sm text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={-1}>All</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Font Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8'
          : 'space-y-3 mb-8'
      }>
        {currentFonts.map(font => 
          viewMode === 'grid' 
            ? <FontCard key={font.name} font={font} />
            : <FontListItem key={font.name} font={font} />
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Empty State */}
      {fonts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Grid3x3 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No fonts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
};

export default FontGrid;