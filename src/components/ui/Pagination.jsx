import React from 'react';
import { cn } from '../../utils/cn';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  showItemsPerPage = true,
  maxVisiblePages = 7,
  className,
  itemsPerPageOptions = [25, 50, 100, 200, -1]
}) => {
  // Don't render if only one page or no pages
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (items) => {
    onItemsPerPageChange(items);
  };

  // Calculate visible page numbers
  const pages = [];
    
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
      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-lg cursor-pointer
               hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
               bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
        className={cn(
          "px-3 py-2 text-sm border-t border-b border-r border-gray-300 dark:border-gray-600 cursor-pointer",
          "bg-white dark:bg-gray-800",
          i === currentPage 
            ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
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
      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-r-lg cursor-pointer
               hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
               bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    >
      Next
    </button>
  );

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0", className)}>
      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value) || -1)}
            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                     rounded px-3 py-1 text-sm text-gray-900 dark:text-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option === -1 ? 'All' : option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {itemsPerPage === -1 
              ? `of ${totalItems} items`
              : `per page`
            }
          </span>
        </div>
      )}

      {/* Page info and navigation */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
          {totalItems && ` (${totalItems} total)`}
        </div>
        <div className="flex">
          {pages}
        </div>
      </div>
    </div>
  );
};

export default Pagination;