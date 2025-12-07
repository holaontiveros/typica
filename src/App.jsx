import React, { useState, useEffect } from 'react';
import { Moon, Sun, Settings, Palette, Sliders, Menu, X, Bookmark } from 'lucide-react';
import { fontManager } from './utils/fontDetection';
import { useTheme } from './hooks/useTheme';
import ThemeProvider from './contexts/ThemeProvider';
import FontSelector from './components/FontSelector';
import FontPreview from './components/FontPreview';
import FontGrid from './components/FontGrid';
import FontComparison from './components/FontComparison';
import ControlPanel from './components/ControlPanel';
import TypicaLogo from './components/TypicaLogo';
import FilterPanel from './components/FilterPanel';

// Main App Component
function App() {
  // State management
  const [fonts, setFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [fontSize, setFontSize] = useState(24);
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('grid'); // 'grid', 'preview', 'compare'
  const [showFilters, setShowFilters] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);


  // Font grid configuration state with localStorage persistence
  const [gridViewMode, setGridViewMode] = useState(() => {
    const saved = localStorage.getItem('fontGrid.viewMode');
    return saved || 'grid';
  });
  const [gridSortBy, setGridSortBy] = useState(() => {
    const saved = localStorage.getItem('fontGrid.sortBy');
    return saved || 'name';
  });
  const [gridItemsPerPage, setGridItemsPerPage] = useState(() => {
    const saved = localStorage.getItem('fontGrid.itemsPerPage');
    return saved ? parseInt(saved) : 50;
  });
  const [gridCurrentPage, setGridCurrentPage] = useState(1);
  const [savedComparisons, setSavedComparisons] = useState(() => {
    const saved = localStorage.getItem('typica.savedComparisons');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedComparisons, setShowSavedComparisons] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  
  // Initialize text color based on theme
  const [textColor, setTextColor] = useState(() => {
    const saved = localStorage.getItem('theme');
    const isDarkMode = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? '#ffffff' : '#000000';
  });

  // Update text color when theme changes (only if it's a default color)
  useEffect(() => {
    if (textColor === '#000000' || textColor === '#ffffff') {
      setTextColor(isDark ? '#ffffff' : '#000000');
    }
  }, [isDark, textColor]);

  // Save font grid settings to localStorage
  useEffect(() => {
    localStorage.setItem('fontGrid.viewMode', gridViewMode);
  }, [gridViewMode]);

  useEffect(() => {
    localStorage.setItem('fontGrid.sortBy', gridSortBy);
  }, [gridSortBy]);

  useEffect(() => {
    localStorage.setItem('fontGrid.itemsPerPage', gridItemsPerPage.toString());
  }, [gridItemsPerPage]);

  // Handlers that reset current page when needed
  const handleGridSortByChange = (newSortBy) => {
    setGridSortBy(newSortBy);
    setGridCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleGridItemsPerPageChange = (newItemsPerPage) => {
    setGridItemsPerPage(newItemsPerPage);
    setGridCurrentPage(1); // Reset to first page when items per page changes
  };

  const initializeFonts = async () => {
      setIsLoading(true);
      try {
        const detectedFonts = await fontManager.init();
        setFonts(detectedFonts);
        console.log(`Detected ${detectedFonts.length} fonts`);
      } catch (error) {
        console.error('Error detecting fonts:', error);
      }
      setIsLoading(false);
    };

  useEffect(() => {
    initializeFonts();
  }, []);

  // Handle font selection (for viewing details)
  const handleFontSelect = (font) => {
    // Add font to beginning of selection (for preview) while preserving comparison list
    const isAlreadySelected = selectedFonts.some(f => f.name === font.name);
    
    if (!isAlreadySelected) {
      // Add to beginning for preview
      setSelectedFonts([font, ...selectedFonts]);
    } else {
      // Move to beginning if already in list
      const otherFonts = selectedFonts.filter(f => f.name !== font.name);
      setSelectedFonts([font, ...otherFonts]);
    }
    
    setCurrentView('preview');
  };

  // Handle font comparison
  const handleFontCompare = (font) => {
    // Check if font is already selected
    if (selectedFonts.some(f => f.name === font.name)) {
      return; // Don't add duplicates
    }
    
    // Add font to comparison
    setSelectedFonts([...selectedFonts, font]);
  };

  // Remove font from comparison
  const handleRemoveFontFromComparison = (fontToRemove) => {
    const updatedFonts = selectedFonts.filter(font => font.name !== fontToRemove.name);
    setSelectedFonts(updatedFonts);
    
    // Switch back to grid if less than 2 fonts remaining
    if (updatedFonts.length < 2) {
      setCurrentView('grid');
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFonts([]);
    setCurrentView('grid');
  };

  // Save current comparison
  const saveCurrentComparison = (name) => {
    if (selectedFonts.length < 2) return;
    
    const comparison = {
      id: Date.now(),
      name: name.trim(),
      fonts: selectedFonts.map(f => ({ name: f.name, classification: f.classification })),
      createdAt: new Date().toISOString(),
      fontCount: selectedFonts.length
    };
    
    const updatedComparisons = [...savedComparisons, comparison];
    setSavedComparisons(updatedComparisons);
    localStorage.setItem('typica.savedComparisons', JSON.stringify(updatedComparisons));
  };

  // Load saved comparison
  const loadSavedComparison = (comparison) => {
    // Find the actual font objects from the fonts array
    const fontObjects = comparison.fonts.map(savedFont => 
      fonts.find(f => f.name === savedFont.name)
    ).filter(Boolean); // Remove any fonts that weren't found
    
    setSelectedFonts(fontObjects);
    if (fontObjects.length >= 2) {
      setCurrentView('compare');
    }
  };

  // Delete saved comparison
  const deleteSavedComparison = (comparisonId) => {
    const updatedComparisons = savedComparisons.filter(c => c.id !== comparisonId);
    setSavedComparisons(updatedComparisons);
    localStorage.setItem('typica.savedComparisons', JSON.stringify(updatedComparisons));
  };

  // Filter fonts based on active filters and search
  const filteredFonts = fonts.filter(font => {
    // Apply search filter first
    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      if (!font.name.toLowerCase().includes(lowerSearch)) {
        return false;
      }
    }
    
    // Then apply active filters
    if (activeFilters.length === 0) return true;
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Detecting system fonts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>


      {/* Header */}
      <header className={`border-b sticky top-0 z-10 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <button 
              onClick={() => setCurrentView('grid')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <TypicaLogo className="h-8 w-8" />
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Typica</h1>
              <span className={`text-sm hidden sm:inline ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {fonts.length} fonts detected
              </span>
            </button>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              {/* View Controls */}
              <div className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('grid')}
                  className={`px-3 py-1 text-sm rounded ${
                    currentView === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setCurrentView('preview')}
                  disabled={selectedFonts.length === 0}
                  className={`px-3 py-1 text-sm rounded ${
                    currentView === 'preview' && selectedFonts.length > 0
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                      : 'text-gray-600 dark:text-gray-300 disabled:opacity-50'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setCurrentView('compare')}
                  disabled={selectedFonts.length < 2}
                  className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                    currentView === 'compare' && selectedFonts.length >= 2
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                      : selectedFonts.length >= 2
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-400 dark:border-green-600 animate-pulse'
                      : selectedFonts.length === 1
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border border-yellow-400 dark:border-yellow-600'
                      : 'text-gray-600 dark:text-gray-300 disabled:opacity-50'
                  }`}
                  title={
                    selectedFonts.length === 0 
                      ? 'Select at least 2 fonts to compare'
                      : selectedFonts.length === 1
                      ? 'Add 1 more font to start comparing'
                      : `Compare ${selectedFonts.length} selected fonts`
                  }
                >
                  {selectedFonts.length >= 2 && currentView !== 'compare' && '🎯 '}
                  Compare ({selectedFonts.length})
                  {selectedFonts.length >= 2 && currentView !== 'compare' && ' →'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`p-2 rounded-lg transition-colors ${
                    showSidebar 
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Toggle sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <button
                  onClick={() => {
                    if (!showSidebar) setShowSidebar(true);
                    setShowFilters(!showFilters);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Filter fonts"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => {
                    if (!showSidebar) setShowSidebar(true);
                    setShowControls(!showControls);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    showControls 
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Font controls"
                >
                  <Sliders className="h-5 w-5" />
                </button>

                <button
                  onClick={() => {
                    console.log('Saved comparisons button clicked, current state:', showSavedComparisons);
                    if (!showSidebar) setShowSidebar(true);
                    setShowSavedComparisons(!showSavedComparisons);
                  }}
                  className={`p-2 rounded-lg transition-colors relative ${
                    showSavedComparisons 
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Saved comparisons"
                >
                  <Bookmark className="h-5 w-5" />
                  {savedComparisons.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {savedComparisons.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        {showSidebar && (
          <aside className={`w-80 border-r ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          {/* Font Search */}
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <FontSelector 
              fonts={fonts} 
              onFontSelect={handleFontSelect}
              onFontCompare={handleFontCompare}
              selectedFonts={selectedFonts}
              searchFilter={searchFilter}
              onSearchFilterChange={setSearchFilter}
              activeFilters={activeFilters}
            />
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <FilterPanel
                fonts={fonts}
                activeFilters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>
          )}

          {/* Control Panel */}
          {showControls && (
            <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <ControlPanel
                previewText={previewText}
                onPreviewTextChange={setPreviewText}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                textColor={textColor}
                onTextColorChange={setTextColor}
                onClearSelection={clearSelection}
                selectedFonts={selectedFonts}
              />
            </div>
          )}

          {/* Saved Comparisons Panel */}
          {showSavedComparisons && (
            <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📚 Saved Comparisons ({savedComparisons.length})
                  </h3>
                  <button
                    onClick={() => setShowSavedComparisons(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Close saved comparisons"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              
              {savedComparisons.length === 0 ? (
                <div className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No saved comparisons yet
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedComparisons.map((comparison) => (
                      <div 
                        key={comparison.id}
                        className={`p-3 rounded border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {comparison.name}
                          </h4>
                          <button
                            onClick={() => deleteSavedComparison(comparison.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Delete saved comparison"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {comparison.fontCount} fonts • {new Date(comparison.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {comparison.fonts.slice(0, 3).map((font, index) => (
                            <span 
                              key={index}
                              className={`text-xs px-1 py-0.5 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            >
                              {font.name}
                            </span>
                          ))}
                          {comparison.fonts.length > 3 && (
                            <span className={`text-xs px-1 py-0.5 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                              +{comparison.fonts.length - 3} more
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => loadSavedComparison(comparison)}
                          className={`w-full text-xs py-1 px-2 rounded transition-colors ${
                            isDark 
                              ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' 
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          Load Comparison
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Fonts Info */}
          {selectedFonts.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Selected Fonts ({selectedFonts.length})
                </h3>
              </div>
              
              <div className="space-y-1">
                {selectedFonts.map((font, index) => (
                  <div 
                    key={index} 
                    className={`text-sm px-2 py-1 rounded flex items-center justify-between ${isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-50'}`}
                  >
                    <span className="truncate">{font.name}</span>
                    <button
                      onClick={() => handleRemoveFontFromComparison(font)}
                      className="text-red-400 hover:text-red-600 transition-colors ml-2"
                      title="Remove from comparison"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          {currentView === 'grid' && (
            <FontGrid
              fonts={filteredFonts}
              previewText={previewText}
              fontSize={fontSize}
              textColor={textColor}
              onFontSelect={handleFontSelect}
              onFontCompare={handleFontCompare}
              selectedFonts={selectedFonts}
              viewMode={gridViewMode}
              onViewModeChange={setGridViewMode}
              sortBy={gridSortBy}
              onSortByChange={handleGridSortByChange}
              itemsPerPage={gridItemsPerPage}
              onItemsPerPageChange={handleGridItemsPerPageChange}
              currentPage={gridCurrentPage}
              onCurrentPageChange={setGridCurrentPage}
            />
          )}
          
          {currentView === 'preview' && selectedFonts.length > 0 && (
            <FontPreview
              font={selectedFonts[0]}
              previewText={previewText}
              fontSize={fontSize}
              textColor={textColor}
              selectedFonts={selectedFonts}
              onFontCompare={handleFontCompare}
            />
          )}
          
          {currentView === 'compare' && selectedFonts.length >= 2 && (
            <FontComparison
              fonts={selectedFonts}
              previewText={previewText}
              fontSize={fontSize}
              textColor={textColor}
              onRemoveFont={handleRemoveFontFromComparison}
              onSaveComparison={saveCurrentComparison}
            />
          )}

          {/* Empty State */}
          {currentView === 'preview' && selectedFonts.length === 0 && (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a font to preview</p>
              </div>
            </div>
          )}

          {currentView === 'compare' && selectedFonts.length < 2 && (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select at least 2 fonts to compare</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Wrap App with ThemeProvider
function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
