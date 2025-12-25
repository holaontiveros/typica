import React, { useMemo } from 'react';
import { Eye, Plus, Grid3x3, List, ChevronDown } from 'lucide-react';
import Button, { ToggleButton, CompareButton } from './Button';
import Pagination from './ui/Pagination';
import FontCard from './font/FontCard';

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

  const FontListItem = ({ font }) => {
    return (
      <FontCard 
        font={font}
        previewText={previewText}
        fontSize={fontSize}
        textColor={textColor}
        onFontSelect={onFontSelect}
        onFontCompare={onFontCompare}
        selectedFonts={selectedFonts}
        variant="default"
        className="hover:shadow-none border-b border-gray-200 dark:border-gray-700 rounded-none border-l-0 border-r-0 border-t-0 last:border-b-0"
      />
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
            <ToggleButton
              onClick={() => onViewModeChange('grid')}
              active={viewMode === 'grid'}
              size="icon"
              title="Grid view"
              icon={<Grid3x3 className="h-4 w-4" />}
            />
            <ToggleButton
              onClick={() => onViewModeChange('list')}
              active={viewMode === 'list'}
              size="icon"
              title="List view"
              icon={<List className="h-4 w-4" />}
            />
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
            ? <FontCard 
                key={font.name} 
                font={font} 
                previewText={previewText}
                fontSize={fontSize}
                textColor={textColor}
                onFontSelect={onFontSelect}
                onFontCompare={onFontCompare}
                selectedFonts={selectedFonts}
              />
            : <FontListItem key={font.name} font={font} />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={sortedFonts.length}
        showItemsPerPage={false}
        className="mb-8"
      />

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