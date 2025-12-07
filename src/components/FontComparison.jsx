import React, { useState } from 'react';
import { X, Copy, Download, RotateCcw, Save, Bookmark, Grid3x3, List } from 'lucide-react';
import Button, { ToggleButton, PresetButton } from './Button';

const FontComparison = ({ fonts, previewText, fontSize, textColor, onRemoveFont, onSaveComparison }) => {
  const [comparisonText, setComparisonText] = useState(previewText);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleRemoveFont = (font) => {
    if (onRemoveFont) {
      onRemoveFont(font);
    }
  };

  const handleSaveComparison = () => {
    if (saveName.trim() && onSaveComparison) {
      onSaveComparison(saveName.trim());
      setShowSaveModal(false);
      setSaveName('');
    }
  };

  const openSaveModal = () => {
    const defaultName = `${fonts.map(f => f.name).slice(0, 2).join(' vs ')} ${fonts.length > 2 ? `+${fonts.length - 2}` : ''}`;
    setSaveName(defaultName);
    setShowSaveModal(true);
  };

  const handleCopyComparison = () => {
    const comparisonData = fonts.map(font => `${font.name}: "${comparisonText}"`).join('\n');
    navigator.clipboard.writeText(comparisonData);
  };

  const handleResetText = () => {
    setComparisonText(previewText);
  };

  const sampleTexts = [
    'The quick brown fox jumps over the lazy dog',
    'Typography is the art and technique of arranging type',
    'Almost before we knew it, we had left the ground',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz',
    '1234567890 !@#$%^&*()',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Font Comparison
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comparing {fonts.length} font{fonts.length !== 1 ? 's' : ''} side by side
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <ToggleButton
              onClick={() => setViewMode('grid')}
              active={viewMode === 'grid'}
              size="icon"
              title="Grid view"
              icon={<Grid3x3 className="h-4 w-4" />}
            />
            <ToggleButton
              onClick={() => setViewMode('list')}
              active={viewMode === 'list'}
              size="icon"
              title="List view"
              icon={<List className="h-4 w-4" />}
            />
          </div>
          
          <Button
            onClick={openSaveModal}
            variant="purple"
            icon={<Bookmark className="h-4 w-4" />}
            title="Save this comparison"
          >
            <span className="hidden sm:inline">Save Comparison</span>
          </Button>
          
          <Button
            onClick={handleResetText}
            variant="outline"
            icon={<RotateCcw className="h-4 w-4" />}
            title="Reset to default text"
          >
            <span className="hidden sm:inline">Reset Text</span>
          </Button>
          
          <Button
            onClick={handleCopyComparison}
            variant="primary"
            icon={<Copy className="h-4 w-4" />}
            title="Copy comparison to clipboard"
          >
            <span className="hidden sm:inline">Copy Comparison</span>
          </Button>
        </div>
      </div>

      {/* Text Input for Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Comparison Text
        </label>
        <textarea
          value={comparisonText}
          onChange={(e) => setComparisonText(e.target.value)}
          placeholder="Enter text to compare across fonts..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400 resize-vertical min-h-[80px]"
        />
        
        {/* Quick Text Options */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick options:</div>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((text, index) => (
              <PresetButton
                key={index}
                onClick={() => setComparisonText(text)}
                size="xs"
              >
                {text.length > 30 ? text.substring(0, 30) + '...' : text}
              </PresetButton>
            ))}
          </div>
        </div>
      </div>

      {/* Font Comparison - Grid or List View */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className={`grid gap-6 ${
          fonts.length === 1 ? 'grid-cols-1' :
          fonts.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
          fonts.length === 3 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :
          fonts.length === 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' :
          fonts.length === 5 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
        }`}>
          {fonts.map((font, index) => (
            <div 
              key={`${font.name}-${index}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Font Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-gray-50 dark:bg-gray-750">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {font.name}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {font.classification}
                    {font.weight && font.weight !== 'regular' && ` • ${font.weight}`}
                    {font.isDefault && ' • Default'}
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveFont(font)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Font Preview */}
              <div className="p-4">
                <div 
                  className="leading-relaxed break-words min-h-[120px] flex items-center"
                  style={{ 
                    fontFamily: font.name,
                    fontSize: `${fontSize}px`,
                    color: textColor,
                    lineHeight: '1.4'
                  }}
                >
                  {comparisonText}
                </div>
              </div>

              {/* Font Details */}
              <div className="px-4 pb-4 space-y-2">
                <div className="text-xs">
                  <span className="text-gray-500 dark:text-gray-400">CSS:</span>
                  <div className="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-1 rounded text-xs mt-1">
                    font-family: "{font.name}";
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {fonts.map((font, index) => (
            <div 
              key={`${font.name}-${index}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-4">
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
                  </div>
                  
                  {/* Preview */}
                  <div 
                    className="text-lg leading-relaxed"
                    style={{ 
                      fontFamily: font.name,
                      fontSize: `${fontSize}px`,
                      color: textColor
                    }}
                  >
                    {comparisonText}
                  </div>
                  
                  {/* CSS Info */}
                  <div className="mt-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">CSS: </span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      font-family: "{font.name}";
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFont(font)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-4 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Size Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Size Comparison
        </h3>
        
        <div className="space-y-6">
          {[16, 24, 32, 48].map(size => (
            <div key={size} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {size}px
              </div>
              <div className="space-y-3">
                {fonts.map((font, index) => (
                  <div key={`${font.name}-${size}-${index}`} className="flex items-baseline space-x-4">
                    <div className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate flex-shrink-0">
                      {font.name}
                    </div>
                    <div 
                      className="flex-1"
                      style={{ 
                        fontFamily: font.name,
                        fontSize: `${size}px`,
                        color: textColor,
                        lineHeight: '1.2'
                      }}
                    >
                      {comparisonText.length > 50 
                        ? 'The quick brown fox jumps over the lazy dog' 
                        : comparisonText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Character Set Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Character Set Comparison
        </h3>
        
        <div className="space-y-6">
          {[
            { label: 'Uppercase', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            { label: 'Lowercase', text: 'abcdefghijklmnopqrstuvwxyz' },
            { label: 'Numbers', text: '1234567890' },
            { label: 'Symbols', text: '!@#$%^&*()[]{}|;:,.<>?' }
          ].map(({ label, text }) => (
            <div key={label} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {label}
              </div>
              <div className="space-y-3">
                {fonts.map((font, index) => (
                  <div key={`${font.name}-${label}-${index}`} className="flex items-center space-x-4">
                    <div className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate flex-shrink-0">
                      {font.name}
                    </div>
                    <div 
                      className="flex-1 font-normal"
                      style={{ 
                        fontFamily: font.name,
                        fontSize: '18px',
                        color: textColor
                      }}
                    >
                      {text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {fonts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Copy className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No fonts to compare
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select fonts from the grid to compare them side by side
          </p>
        </div>
      )}

      {/* Save Comparison Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer" onClick={() => setShowSaveModal(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Save Font Comparison
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comparison Name
              </label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter a name for this comparison..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveComparison();
                  } else if (e.key === 'Escape') {
                    setShowSaveModal(false);
                  }
                }}
              />
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Fonts in this comparison ({fonts.length}):
              </div>
              <div className="flex flex-wrap gap-1">
                {fonts.map((font, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {font.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveComparison}
                disabled={!saveName.trim()}
                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500
                         text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Save Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontComparison;